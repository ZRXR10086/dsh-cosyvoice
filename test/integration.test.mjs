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
  realFetch = globalThis.fetch
  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    text: async () => JSON.stringify({
      output: { audio: { data: FAKE_AUDIO.toString('base64') } },
      usage: { characters: 5 },
    }),
  })

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
  it('/speak 合成并落盘，/audio 取回同样的字节', async () => {
    const spoken = await json(await realFetch(`${base}/dsh-cosyvoice/speak`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: '第一条回答' }),
    }))
    assert.equal(spoken.ok, true)
    assert.equal(spoken.clip.cached, false)

    const audio = await realFetch(`${base}${spoken.clip.url}`)
    assert.equal(audio.headers.get('content-type'), 'audio/mpeg')
    const bytes = Buffer.from(await audio.arrayBuffer())
    assert.deepEqual(bytes, FAKE_AUDIO)
  })

  it('同一段文本第二次直接命中缓存', async () => {
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
    assert.equal(first.clip.cached, false)
    assert.equal(second.clip.cached, true)
    assert.equal(second.clip.name, first.clip.name)
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
    assert.equal(again.clip.name, spoken.clip.name)
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
