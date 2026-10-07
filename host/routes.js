/**
 * 本插件对外暴露的 HTTP 面：浏览器那一半需要宿主做的全部事情。
 *
 * 用路由而不是类型化的 remote-RPC，是因为路由就是一个普通 Node handler：
 * 送音频字节和 JSON 都不需要生成线上 schema，浏览器端也就不用为 RPC 客户端
 * 引入构建步骤，手写拼接即可（见 `build.mjs`）。
 *
 * 所有路由都在 `/dsh-cosyvoice/` 之下——这个前缀没人占，harness 自带的 SPA
 * fallback 和 `/api` 网关都不会挡路。
 *
 * 其中三个端点有真实副作用（合成花钱、打开目录、删文件），所以先过
 * {@link sameOrigin}：浏览器给任何跨站请求都会带上 `Origin`，拒绝不匹配的值，
 * 就能挡住用户浏览器里某个随机页面来驱动本插件。
 * @module dsh-cosyvoice/routes
 */

import { createReadStream, existsSync } from 'node:fs'

/** 接受的 JSON 请求体上限（字节）。文本很短，更大的都是误用或攻击。 */
const MAX_BODY_BYTES = 256 * 1024

/** 本插件占有的路由前缀。 */
export const ROUTE_PREFIX = '/dsh-cosyvoice'

/**
 * 请求是否来自本服务器的页面。
 *
 * 允许 `Origin` 缺失：同源 fetch 可能不带它，而跨站请求一定会带。
 * @param req - 入站请求。
 * @returns 是否可以继续处理。
 */
function sameOrigin(req) {
  const origin = req.headers.origin
  if (origin === undefined || origin === 'null') return true
  try {
    return new URL(origin).host === req.headers.host
  } catch {
    return false
  }
}

/**
 * 用 JSON 回应一个请求。
 * @param res - 要接管的响应。
 * @param status - HTTP 状态码。
 * @param body - 可序列化的响应体。
 */
function sendJson(res, status, body) {
  const text = JSON.stringify(body)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': String(Buffer.byteLength(text)),
    'cache-control': 'no-store',
  })
  res.end(text)
}

/**
 * 读取并解析 JSON 请求体。
 * @param req - 入站请求。
 * @returns 解析出的对象；缺失、过大或格式错误时为 undefined。
 */
function readJson(req) {
  return new Promise((resolve) => {
    let size = 0
    const chunks = []
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        resolve(undefined)
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      const text = Buffer.concat(chunks).toString('utf8').trim()
      if (text === '') return resolve({})
      try {
        const parsed = JSON.parse(text)
        resolve(parsed !== null && typeof parsed === 'object' ? parsed : undefined)
      } catch {
        resolve(undefined)
      }
    })
    req.on('error', () => { resolve(undefined) })
  })
}

/**
 * 以音频字节流回应一个请求。
 * @param res - 要接管的响应。
 * @param path - 磁盘上的音频文件。
 * @param cacheable - 是否允许浏览器缓存（内容哈希命名，可以长期缓存）。
 */
function sendAudio(res, path, cacheable) {
  res.writeHead(200, {
    'content-type': 'audio/mpeg',
    'cache-control': cacheable ? 'private, max-age=31536000, immutable' : 'no-store',
  })
  const stream = createReadStream(path)
  stream.on('error', () => { res.destroy() })
  stream.pipe(res)
}

/**
 * 构建本插件的路由。
 * @param options - 每个路由需要的协作者。
 * @param options.getSettings - 读取当前语音设置。
 * @param options.synth - 带缓存的合成器。
 * @param options.store - 音频目录。
 * @param options.texts - messageId → 文本 的解析器。
 * @param options.bootClip - 内置开机音的绝对路径；不存在时为 undefined。
 * @param options.openDir - 在系统文件管理器里打开音频目录。
 * @param options.log - 诊断输出（不进响应）。
 * @returns 顺序稳定的路由注册项。
 */
export function cosyvoiceRoutes({ getSettings, synth, store, texts, bootClip, openDir, log }) {
  /**
   * 给一段音频补上浏览器该去取的 URL。
   * @param clip - 音频描述。
   * @returns 带 url 的描述；clip 为空时返回 null。
   */
  const describe = clip => (clip === undefined ? null : {
    name: clip.name,
    bytes: clip.bytes,
    cached: clip.cached === true,
    characters: Number(clip.characters ?? 0),
    url: `${ROUTE_PREFIX}/audio?name=${encodeURIComponent(clip.name)}`,
  })

  /**
   * 统一的合成出口：把异常翻成 500 + 人能读懂的消息。
   * @param res - 响应。
   * @param text - 要朗读的文本。
   */
  const respondSynth = async (res, text) => {
    try {
      const clip = await synth.synthesize(text)
      sendJson(res, 200, { ok: true, clip: describe(clip) })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      log(`synthesize failed: ${message}`)
      sendJson(res, 500, { ok: false, message })
    }
  }

  return [
    {
      kind: 'exact',
      path: `${ROUTE_PREFIX}/status`,
      handler(req, res) {
        const settings = getSettings() ?? {}
        sendJson(res, 200, {
          ok: true,
          configured: String(settings.apiKey ?? '').trim() !== '' && String(settings.voiceId ?? '').trim() !== '',
          hasKey: String(settings.apiKey ?? '').trim() !== '',
          model: String(settings.model ?? '').trim(),
          voiceId: String(settings.voiceId ?? '').trim(),
          bootSound: settings.bootSound === true,
          dir: store.dir(),
          count: store.count(),
        })
      },
    },
    {
      // 播放键的主入口。文本优先用客户端给的（它就在 DOM 上，最准），
      // 拿不到才回落到服务端按 messageId 解析。
      kind: 'exact',
      path: `${ROUTE_PREFIX}/speak-message`,
      async handler(req, res) {
        if (!sameOrigin(req)) return sendJson(res, 403, { ok: false, message: '跨站请求被拒绝' })
        const body = await readJson(req)
        if (body === undefined) return sendJson(res, 400, { ok: false, message: '请求体不是合法 JSON' })

        const messageId = String(body.messageId ?? '').trim()
        const sessionId = String(body.sessionId ?? '').trim()
        const supplied = typeof body.text === 'string' ? body.text.trim() : ''
        const text = supplied !== '' ? supplied : texts.resolve(messageId, sessionId)

        if (text === undefined || text === '') {
          log(`speak-message: 取不到 ${messageId || '(无 id)'} 的文本`)
          return sendJson(res, 404, { ok: false, message: '没找到这条回答的文本，无法朗读。' })
        }
        // 客户端给的文本顺手登记，下次点击连 DOM 都不用读。
        if (supplied !== '' && messageId !== '') texts.remember(messageId, supplied)
        return respondSynth(res, text)
      },
    },
    {
      // 设置页试听、以及任何"直接给一段文本"的场景。
      kind: 'exact',
      path: `${ROUTE_PREFIX}/speak`,
      async handler(req, res) {
        if (!sameOrigin(req)) return sendJson(res, 403, { ok: false, message: '跨站请求被拒绝' })
        const body = await readJson(req)
        if (body === undefined) return sendJson(res, 400, { ok: false, message: '请求体不是合法 JSON' })
        const text = typeof body.text === 'string' ? body.text : ''
        return respondSynth(res, text)
      },
    },
    {
      kind: 'exact',
      path: `${ROUTE_PREFIX}/audio`,
      handler(req, res) {
        const url = new URL(req.url ?? '/', 'http://localhost')
        const path = store.pathOf(url.searchParams.get('name') ?? '')
        if (path === undefined) {
          sendJson(res, 404, { ok: false, message: '语音文件不存在' })
          return
        }
        // 文件名是内容哈希，同名必然同内容，可以放心让浏览器永久缓存。
        sendAudio(res, path, true)
      },
    },
    {
      kind: 'exact',
      path: `${ROUTE_PREFIX}/boot`,
      handler(req, res) {
        if (bootClip === undefined || !existsSync(bootClip)) {
          sendJson(res, 404, { ok: false, message: '未找到开机音文件 assets/boot.mp3' })
          return
        }
        // 从磁盘读而不是打进客户端产物，于是换提示音不用重新构建。
        sendAudio(res, bootClip, false)
      },
    },
    {
      kind: 'exact',
      path: `${ROUTE_PREFIX}/open`,
      async handler(req, res) {
        if (!sameOrigin(req)) return sendJson(res, 403, { ok: false, message: '跨站请求被拒绝' })
        try {
          await openDir(store.ensure())
          sendJson(res, 200, { ok: true, dir: store.dir() })
        } catch (error) {
          sendJson(res, 500, { ok: false, message: error instanceof Error ? error.message : String(error) })
        }
      },
    },
    {
      kind: 'exact',
      path: `${ROUTE_PREFIX}/clear`,
      async handler(req, res) {
        if (!sameOrigin(req)) return sendJson(res, 403, { ok: false, message: '跨站请求被拒绝' })
        try {
          sendJson(res, 200, { ok: true, removed: store.clear() })
        } catch (error) {
          sendJson(res, 500, { ok: false, message: error instanceof Error ? error.message : String(error) })
        }
      },
    },
  ]
}
