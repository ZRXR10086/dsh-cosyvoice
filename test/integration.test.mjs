/**
 * 宿主端集成测试：**真的起一个 HTTP 服务器**，把 `apply()` 注册出来的路由挂上去，
 * 再用真实的 `fetch` 打它。
 *
 * 与 `host.test.mjs` 的区别是层次：那边测单个类，这边测"插件接好线之后到底能不能
 * 工作"——包括 cordis 的 `apply(ctx, config)` 签名、`harness.js` 的包解析、路由
 * 分发、以及一次合成从 HTTP 请求到音频字节的全过程。
 *
 * 三处刻意的设计：
 *
 * - **临时 harness home**：`DSH_HOME` 指向一个临时目录，里面按真实布局放一个
 *   `profiles/node_modules/@deepseek-ai/schemastery` 链接，于是这份测试同时验证了
 *   锚点解析这条路径本身。
 * - **假的 `globalThis.fetch`**：合成走的是注入的全局 fetch，所以"合成成功""取出
 *   音频字节""错误消息"都能在不花钱、不联网的情况下复现。
 * - **`apply` 用假 ctx**：只提供插件真正用到的三个能力（`effect`、`webServer`、
 *   `logger`），多给一样都是在掩盖真实的依赖面。
 *
 * 运行：`node --test test/`
 * @module dsh-cosyvoice/test-integration
 */

import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, symlinkSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { after, before, describe, it } from 'node:test'

const HERE = dirname(fileURLToPath(import.meta.url))
const PACKAGE = resolve(HERE, '..')

/** 本测试注入的假合成结果：一段固定的"音频"字节。 */
const FAKE_AUDIO = Buffer.from('FAKE-MP3-BYTES')

/**
 * HTTP 响应体的 JSON 解析。
 * @param response - 响应。
 * @returns 解析结果。
 */
async function json(response) {
  return JSON.parse(await response.text())
}

/**
 * 一个假的百炼响应。
 * @param payload - 响应体。
 * @returns 响应。
 */
function fake(payload) {
  return { ok: true, status: 200, text: async () => JSON.stringify(payload) }
}

let home
let server
let base
/**
 * 真正的网络 fetch。
 *
 * 下面会把 `globalThis.fetch` 换成假的（合成链路走它），所以测试自己发请求必须
 * 用这一份 —— 否则连"请求服务器"这件事本身也被假 fetch 接走了。
 */
let realFetch

/**
 * 把 harness home 布置成一个能解析 `@deepseek-ai/schemastery` 的样子。
 *
 * 链接的目标是从已安装的 DSH 里找出来的，所以测试不硬编码任何版本。
 * @returns 临时 home 的绝对路径。
 */
function stageHome() {
  const root = mkdtempSync(join(tmpdir(), 'cosyvoice-home-'))
  const target = join(root, 'profiles', 'node_modules', '@deepseek-ai')
  mkdirSync(target, { recursive: true })
  // 从本包自身解析不到（它不在 DSH 树里），所以从 DSH 的安装处借一个。
  const anchor = harnessAnchorForTest()
  const resolved = createRequire(anchor).resolve('@deepseek-ai/schemastery/package.json')
  symlinkSync(dirname(resolved), join(target, 'schemastery'))
  return root
}

/**
 * 找一个能解析到 harness 包的起点：优先已安装的 DSH，其次 NVM 里的 CLI。
 * @returns 一个文件路径，供 `createRequire` 使用。
 */
function harnessAnchorForTest() {
  const candidates = process.env.DSH_CLI_ROOT
    ? [join(process.env.DSH_CLI_ROOT, 'lib', 'bin.js')]
    : []
  candidates.push('/usr/lib/node_modules/@deepseek-ai/dsh/lib/bin.js')
  const nvmRoot = join(process.env.HOME ?? '/root', '.nvm/versions/node')
  for (const entry of safeReaddir(nvmRoot)) {
    candidates.push(join(nvmRoot, entry, 'lib/node_modules/@deepseek-ai/dsh/lib/bin.js'))
  }
  for (const candidate of candidates) {
    try {
      readFileSync(candidate)
      return candidate
    } catch {
      // 继续找下一个。
    }
  }
  throw new Error('integration: 找不到 DSH 安装位置，无法借用 @deepseek-ai/schemastery')
}

/**
 * 读目录内容，读不到就是空列表。
 * @param dir - 目录。
 * @returns 条目名。
 */
function safeReaddir(dir) {
  try {
    return readdirSync(dir)
  } catch {
    return []
  }
}

before(async () => {
  home = stageHome()
  process.env.DSH_HOME = home

  // 假 fetch：合成请求返回一段固定音频（`SpeechClient` 默认读全局 fetch）。
  // 音色克隆打的是另外两个端点，所以这里按 URL 分派 —— 于是"上传 → 取内网地址 →
  // 注册 → 查询就绪"整条链也是在不联网的前提下验证的。
  realFetch = globalThis.fetch
  globalThis.fetch = async (url, init) => {
    const target = String(url ?? '')
    if (target.includes('/api/v1/files')) {
      return fake(init?.body === undefined
        ? { data: { url: 'https://intranet.example.com/a.wav' } }
        : { data: { uploaded_files: [{ file_id: 'file-1' }] } })
    }
    if (target.includes('customization')) {
      const body = JSON.parse(String(init?.body ?? '{}'))
      const action = body?.input?.action
      if (action === 'create_voice') return fake({ output: { voice_id: 'cosyvoice-v3.5-plus-dsh-ab12cd' } })
      if (action === 'query_voice') return fake({ output: { voice_id: body.input.voice_id, status: 'OK' } })
      return fake({ output: { voice_list: [{ voice_id: 'cosyvoice-v3.5-plus-cloud1', status: 'OK' }] } })
    }
    return fake({
      output: { audio: { data: FAKE_AUDIO.toString('base64') } },
      usage: { characters: 5 },
    })
  }

  const plugin = await import('../host/index.js')
  const routes = []
  const ctx = {
    effect: (fn) => { fn(); return () => {} },
    webServer: {
      register: (route) => { routes.push(route); return () => {} },
    },
    logger: { warn: () => {} },
  }
  plugin.apply(ctx, {
    apiKey: 'sk-test',
    voiceId: 'voice-1',
    model: 'cosyvoice-v3.5-plus',
    outputDir: join(home, 'audio'),
    bootSound: true,
  })

  server = createServer((req, res) => {
    const path = new URL(req.url ?? '/', 'http://localhost').pathname
    const route = routes.find(candidate => candidate.path === path)
    if (route === undefined) {
      res.writeHead(404).end()
      return
    }
    Promise.resolve(route.handler(req, res)).catch(() => { res.destroy() })
  })
  await new Promise((resolveListen) => { server.listen(0, '127.0.0.1', resolveListen) })
  base = `http://127.0.0.1:${String(server.address().port)}`
})

after(() => {
  if (server !== undefined) server.close()
  delete process.env.DSH_HOME
})

describe('apply', () => {
  it('在真实 HTTP 上响应 /status，且不把密钥带出去', async () => {
    const response = await realFetch(`${base}/dsh-cosyvoice/status`)
    const body = await json(response)
    assert.equal(body.ok, true)
    assert.equal(body.configured, true)
    assert.equal(body.voiceId, 'voice-1')
    assert.equal(body.count, 0)
    assert.ok(!JSON.stringify(body).includes('sk-test'), 'status 绝不能回传 API Key')
  })
})

describe('合成路由', () => {
  it('/speak 分句合成并落盘，/audio 取回同样的字节', async () => {
    const spoken = await json(await realFetch(`${base}/dsh-cosyvoice/speak`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: '这是第一条足够长的回答内容，用来验证分句。这是第二条同样足够长的回答内容。' }),
    }))
    assert.equal(spoken.ok, true)
    assert.equal(spoken.total, 2)
    // 首句就绪就返回，所以响应里可能只有一段；后面几段由 /segments 续上。
    assert.ok(spoken.segments.length >= 1)
    assert.equal(spoken.segments[0].cached, false)

    const audio = await realFetch(`${base}${spoken.segments[0].url}`)
    assert.equal(audio.headers.get('content-type'), 'audio/mpeg')
    const bytes = Buffer.from(await audio.arrayBuffer())
    assert.deepEqual(bytes, FAKE_AUDIO)
  })

  it('同一段文本第二次直接命中句子级缓存', async () => {
    const first = await json(await realFetch(`${base}/dsh-cosyvoice/speak`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: '缓存测试' }),
    }))
    const second = await json(await realFetch(`${base}/dsh-cosyvoice/speak`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: '缓存测试' }),
    }))
    assert.equal(first.segments[0].cached, false)
    assert.equal(second.segments[0].cached, true)
    assert.equal(second.segments[0].name, first.segments[0].name)
  })

  it('/speak-message 用客户端给的文本，并记住它', async () => {
    const spoken = await json(await realFetch(`${base}/dsh-cosyvoice/speak-message`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messageId: 'm-fresh', sessionId: 's1', text: '**重点**内容' }),
    }))
    assert.equal(spoken.ok, true)

    // 不传 text，只给 messageId：应当命中上一步记住的文本。
    const again = await json(await realFetch(`${base}/dsh-cosyvoice/speak-message`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messageId: 'm-fresh', sessionId: 's1' }),
    }))
    assert.equal(again.ok, true)
    assert.equal(again.segments[0].name, spoken.segments[0].name)
  })

  it('/segments 能把后台补齐的句子续上，查不到任务时给 404', async () => {
    const spoken = await json(await realFetch(`${base}/dsh-cosyvoice/speak`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: '第一句话要足够长才会被切开。第二句话同样需要足够长。第三句话也是一样足够长。第四句话依然足够长。' }),
    }))
    const jobId = spoken.jobId
    assert.equal(typeof jobId, 'string')
    assert.equal(spoken.total, 4)

    // 等后台把剩下的句子合成完（假 fetch 是瞬时的，但作业是异步跑的）。
    let view = spoken
    for (let i = 0; i < 20 && !view.done; i += 1) {
      await new Promise(resolve => setTimeout(resolve, 20))
      view = await json(await realFetch(`${base}/dsh-cosyvoice/segments?job=${encodeURIComponent(jobId)}`))
    }
    assert.equal(view.done, true)
    assert.equal(view.segments.length, 4)
    // 顺序必须和原文一致：乱序填满的槽位对外仍是按序交付的。
    assert.equal(view.segments[0].name, spoken.segments[0].name)

    const missing = await realFetch(`${base}/dsh-cosyvoice/segments?job=nope`)
    assert.equal(missing.status, 404)
  })

  it('/speak-message 取不到文本时给 404 和可读提示', async () => {
    const response = await realFetch(`${base}/dsh-cosyvoice/speak-message`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messageId: 'm-unknown', sessionId: 's-nope' }),
    })
    assert.equal(response.status, 404)
    const body = await json(response)
    assert.equal(body.ok, false)
    assert.match(body.message, /没找到这条回答的文本/)
  })

  it('/audio 拒绝目录穿越与不合法文件名', async () => {
    for (const name of ['../../etc/passwd', 'nope.mp3', '']) {
      const response = await realFetch(`${base}/dsh-cosyvoice/audio?name=${encodeURIComponent(name)}`)
      assert.equal(response.status, 404, `name=${name} 应当被拒绝`)
    }
  })

  it('/clear 清掉本插件的缓存文件', async () => {
    await realFetch(`${base}/dsh-cosyvoice/speak`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: '待清理' }),
    })
    const cleared = await json(await realFetch(`${base}/dsh-cosyvoice/clear`, { method: 'POST' }))
    assert.equal(cleared.ok, true)
    assert.ok(cleared.removed >= 1)
    const status = await json(await realFetch(`${base}/dsh-cosyvoice/status`))
    assert.equal(status.count, 0)
  })

  it('空文本得到 500 与中文提示，而不是崩溃', async () => {
    const response = await realFetch(`${base}/dsh-cosyvoice/speak`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: '  **  ' }),
    })
    assert.equal(response.status, 500)
    assert.match((await json(response)).message, /没有可朗读的文本/)
  })
})

describe('音色档案路由', () => {
  /** POST 一个 JSON，返回解析后的响应与状态码。 */
  async function post(action, body) {
    const response = await realFetch(`${base}/dsh-cosyvoice/${action}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body ?? {}),
    })
    return { status: response.status, body: await json(response) }
  }

  /** DELETE 一个 JSON，返回解析后的响应与状态码。 */
  async function del(body) {
    const response = await realFetch(`${base}/dsh-cosyvoice/profiles`, {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body ?? {}),
    })
    return { status: response.status, body: await json(response) }
  }

  it('新增 → 列表 → 启用 → 删除 的完整往返', async () => {
    const first = await post('profiles', { name: '档案甲', voiceId: 'voice-a', model: 'cosyvoice-v3.5-plus' })
    assert.equal(first.status, 200)
    assert.equal(first.body.profiles.length, 1)
    // 第一套自动成为当前音色，于是保存完立刻就能试听。
    assert.equal(first.body.activeId, first.body.profiles[0].id)

    const second = await post('profiles', { name: '档案乙', voiceId: 'voice-b', model: 'cosyvoice-v3.5-flash' })
    assert.equal(second.body.profiles.length, 2)
    assert.equal(second.body.activeId, first.body.profiles[0].id)

    const activated = await post('profiles/activate', { id: second.body.profiles[1].id })
    assert.equal(activated.body.activeId, second.body.profiles[1].id)

    const listed = await json(await realFetch(`${base}/dsh-cosyvoice/profiles`))
    assert.equal(listed.ok, true)
    assert.equal(listed.profiles.length, 2)
    assert.deepEqual(listed.fallback, { model: 'cosyvoice-v3.5-plus', voiceId: 'voice-1' })

    const removed = await del({ id: listed.profiles[1].id })
    assert.equal(removed.body.profiles.length, 1)
    // 删掉的正是当前音色，于是退回剩下那一条而不是变成"没有音色"。
    assert.equal(removed.body.activeId, listed.profiles[0].id)

    await del({ id: listed.profiles[0].id })
    const emptied = await json(await realFetch(`${base}/dsh-cosyvoice/profiles`))
    assert.equal(emptied.profiles.length, 0)
    assert.equal(emptied.activeId, '')
  })

  it('启用档案后 /status 与合成都用档案里的音色', async () => {
    const saved = await post('profiles', { name: '档案丙', voiceId: 'voice-profile', model: 'model-profile' })
    assert.equal(saved.body.activeId, saved.body.profiles[0].id)

    const status = await json(await realFetch(`${base}/dsh-cosyvoice/status`))
    assert.equal(status.voiceId, 'voice-profile')
    assert.equal(status.model, 'model-profile')
    assert.equal(status.profileId, saved.body.profiles[0].id)
    assert.equal(status.configured, true)

    await del({ id: saved.body.profiles[0].id })
    const back = await json(await realFetch(`${base}/dsh-cosyvoice/status`))
    assert.equal(back.voiceId, 'voice-1')
  })

  it('缺音色 ID 得 400，启用不存在的档案得 404', async () => {
    const noVoice = await post('profiles', { name: '没有音色', voiceId: '   ' })
    assert.equal(noVoice.status, 400)
    assert.match(noVoice.body.message, /音色 ID 不能为空/)

    const missing = await post('profiles/activate', { id: '不存在的 id' })
    assert.equal(missing.status, 404)

    const badJson = await realFetch(`${base}/dsh-cosyvoice/profiles`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{ 这不是 JSON',
    })
    assert.equal(badJson.status, 400)
  })
})

describe('音色克隆路由', () => {
  /** POST 一段裸音频字节。 */
  async function upload(body, query = '') {
    const response = await realFetch(`${base}/dsh-cosyvoice/clone${query}`, {
      method: 'POST',
      headers: { 'content-type': 'application/octet-stream' },
      body,
    })
    return { status: response.status, body: await json(response) }
  }

  it('上传音频 → 得到音色 ID → 轮询就绪 → 自动设为当前音色', async () => {
    const made = await upload(Buffer.from('RIFF-fake-wav'), '?name=' + encodeURIComponent('我的声音') + '&filename=my.wav')
    assert.equal(made.status, 200)
    assert.equal(made.body.profile.source, 'clone')
    assert.equal(made.body.profile.voiceId, 'cosyvoice-v3.5-plus-dsh-ab12cd')
    // 刚注册完还没部署好，所以是 pending —— 但用户此刻就该在列表里看见它。
    assert.equal(made.body.profile.status, 'pending')
    assert.equal(made.body.profile.name, '我的声音')

    const polled = await json(await realFetch(`${base}/dsh-cosyvoice/clone/status?id=${encodeURIComponent(made.body.profile.id)}`))
    assert.equal(polled.ok, true)
    assert.equal(polled.phase, 'ready')
    // 就绪即落盘，并自动设为当前音色：用户上传一段音频，默认就是想用它。
    assert.equal(polled.activeId, made.body.profile.id)
    const stored = polled.profiles.find(item => item.id === made.body.profile.id)
    assert.equal(stored.status, 'ready')

    const status = await json(await realFetch(`${base}/dsh-cosyvoice/status`))
    assert.equal(status.voiceId, 'cosyvoice-v3.5-plus-dsh-ab12cd')
  })

  it('空 body 得 400，而不是拿着空音频去打百炼', async () => {
    const empty = await upload(Buffer.alloc(0))
    assert.equal(empty.status, 400)
    assert.match(empty.body.message, /没有收到音频/)
  })

  it('查一个不存在的档案得 404', async () => {
    const response = await realFetch(`${base}/dsh-cosyvoice/clone/status?id=nope`)
    assert.equal(response.status, 404)
  })

  it('云端音色能一键导入，模型从音色 ID 前缀反推', async () => {
    const listed = await json(await realFetch(`${base}/dsh-cosyvoice/cloud-voices`))
    assert.equal(listed.ok, true)
    assert.equal(listed.voices.length, 1)

    const imported = await json(await realFetch(`${base}/dsh-cosyvoice/cloud-voices/import`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{}',
    }))
    assert.equal(imported.ok, true)
    assert.equal(imported.added, 1)
    const cloud = imported.profiles.find(item => item.voiceId === 'cosyvoice-v3.5-plus-cloud1')
    assert.equal(cloud.source, 'cloud')
    assert.equal(cloud.model, 'cosyvoice-v3.5-plus')
    assert.equal(cloud.status, 'ready')

    // 再导一次：已经有的不重复加。
    const again = await json(await realFetch(`${base}/dsh-cosyvoice/cloud-voices/import`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{}',
    }))
    assert.equal(again.added, 0)

    // 收尾：把这次产生的档案删掉，别污染后面可能新增的用例。
    for (const item of await json(await realFetch(`${base}/dsh-cosyvoice/profiles`)).then(r => r.profiles)) {
      await realFetch(`${base}/dsh-cosyvoice/profiles`, {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: item.id }),
      })
    }
  })
})
