/**
 * 与阿里云百炼（DashScope）非实时语音合成 HTTP 接口的对话。
 *
 * 两个决定塑造了这个文件：
 *
 * **fetch 可注入。** 客户端接收一个可注入的 fetch 实现，于是测试可以塞进假 fetch
 * 模拟成功/失败/超时，完全不碰真实网络；真实环境也可以注入受限的 fetch。
 *
 * **业务失败返回结构化错误，而不是抛裸异常。** 模型/调用方要能读懂"为什么失败"
 * 才能正确引导用户（Key 错了、模型与音色不匹配、还是服务不可用）。
 * @module dsh-cosyvoice/speech
 */

/** 合成接口地址（华北2北京；非流式返回音频 URL）。 */
export const DEFAULT_ENDPOINT = 'https://dashscope.aliyuncs.com/api/v1/services/audio/tts/SpeechSynthesizer'

/** 单次合成的文本上限（字符）。超过即截断，避免请求被拒。 */
export const MAX_TEXT_CHARS = 20000

/** 单次请求的超时（毫秒）。合成是长任务，但不能无限等。 */
export const REQUEST_TIMEOUT_MS = 120000

/**
 * 把一段回答文本整理成"适合朗读"的纯文本。
 *
 * 去掉 Markdown 标记，否则 `**`、`#`、链接 URL 都会被念出来，听感很差。
 * 顺序有讲究：先删块级结构（代码块），再删行内标记，最后压空白。
 * @param raw - 原始文本（可能是 Markdown）。
 * @returns 清洗并截断后的文本。
 */
export function normalizeText(raw) {
  let text = String(raw ?? '')

  // 代码块：整块去掉（代码念出来毫无意义）
  text = text.replace(/```[\s\S]*?```/g, ' ')
  text = text.replace(/~~~[\s\S]*?~~~/g, ' ')
  // 行内代码：保留内容，去掉反引号
  text = text.replace(/`([^`]*)`/g, '$1')
  // 图片：整块去掉
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
  // 链接：保留可读文字，丢掉 URL
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  // HTML 标签
  text = text.replace(/<[^>]+>/g, ' ')
  // 标题符号 / 引用符号 / 列表符号 / 表格分隔（保留内容）
  text = text.replace(/^\s{0,3}#{1,6}\s*/gm, '')
  text = text.replace(/^\s{0,3}>\s?/gm, '')
  text = text.replace(/^\s{0,3}(?:[-*+]|\d+\.)\s+/gm, '')
  text = text.replace(/^\s*\|?[\s:|-]{3,}\|?\s*$/gm, ' ')
  text = text.replace(/\|/g, ' ')
  // 强调符号
  text = text.replace(/(\*\*|__)(.*?)\1/g, '$2')
  text = text.replace(/(\*|_)(.*?)\1/g, '$2')
  text = text.replace(/~~(.*?)~~/g, '$1')
  // 压空白：连续空格并成一个，行尾不留白（块级结构被删掉后常留下只含空格的行）。
  text = text.replace(/[ \t]+/g, ' ')
  text = text.replace(/[ \t]+$/gm, '')
  text = text.replace(/\n{3,}/g, '\n\n')
  text = text.trim()

  if (text.length > MAX_TEXT_CHARS) text = text.slice(0, MAX_TEXT_CHARS)
  return text
}

/**
 * 把 HTTP 状态码与响应正文翻译成一句人能看懂的中文提示。
 * @param status - HTTP 状态码。
 * @param bodyText - 响应正文（可能是 JSON，也可能不是）。
 * @returns 面向用户的错误说明。
 */
export function describeFailure(status, bodyText) {
  const text = String(bodyText ?? '').trim()
  let detail = ''
  try {
    const parsed = JSON.parse(text)
    detail = String(parsed?.message ?? parsed?.error?.message ?? '').trim()
  } catch {
    detail = text.slice(0, 200)
  }
  const suffix = detail === '' ? '' : `（${detail}）`

  if (status === 401 || status === 403) return `API Key 无效或无权限${suffix}。请在 设置 → 语音 中检查。`
  if (status === 418) return `合成模型与注册音色时的模型不一致${suffix}。设置里的「合成模型」必须与音色 ID 前缀一致。`
  if (status === 429) return `请求过于频繁或额度不足${suffix}。`
  if (status >= 500) return `百炼服务暂时不可用${suffix}，请稍后重试。`
  return `语音合成失败（HTTP ${String(status)}）${suffix}`
}

/**
 * 带超时的 fetch。AbortSignal.timeout 在 Node 18+ 可用。
 * @param fetchImpl - 实际发请求的 fetch。
 * @param url - 目标地址。
 * @param init - 请求参数。
 * @param timeoutMs - 超时毫秒数。
 * @returns 响应。
 */
async function fetchWithTimeout(fetchImpl, url, init, timeoutMs) {
  return fetchImpl(url, { ...init, signal: AbortSignal.timeout(timeoutMs) })
}

/** 语音合成客户端。 */
export class SpeechClient {
  /**
   * @param options - 协作者。
   * @param options.getSettings - 每次调用时读取当前设置，所以改配置无需重启。
   * @param options.endpoint - 合成接口地址，默认华北2北京。
   * @param options.fetchImpl - 可注入的 fetch（测试用假实现）。
   * @param options.timeoutMs - 请求超时。
   */
  constructor({ getSettings, endpoint = DEFAULT_ENDPOINT, fetchImpl = globalThis.fetch, timeoutMs = REQUEST_TIMEOUT_MS }) {
    this.getSettings = getSettings
    this.endpoint = endpoint
    this.fetchImpl = fetchImpl
    this.timeoutMs = timeoutMs
  }

  /**
   * 合成一段文本，返回音频字节。
   * @param rawText - 要朗读的文本（可以是 Markdown，会先清洗）。
   * @param identity - 本次要用的模型与音色；省略时用设置里的回退值。
   * @returns 音频字节、使用的音色与模型、以及字符用量。
   * @throws {Error} 配置缺失或合成失败时抛出（消息可直接展示给用户）。
   */
  async synthesize(rawText, identity) {
    const text = normalizeText(rawText)
    if (text === '') throw new Error('没有可朗读的文本。')

    const settings = this.getSettings()
    const apiKey = String(settings?.apiKey ?? '').trim()
    // 音色与模型由编排层定（激活的音色档案优先于设置），本类只管把它们发出去 ——
    // 让它自己去读设置的话，切了档案请求却还在用旧音色。
    const voiceId = String(identity?.voiceId ?? settings?.voiceId ?? '').trim()
    const model = String(identity?.model ?? settings?.model ?? '').trim() || DEFAULT_MODEL
    if (apiKey === '') throw new Error('未配置 API Key。请在 设置 → 语音 中填写阿里云百炼的 Key。')
    if (voiceId === '') throw new Error('未配置音色 ID。请在 设置 → 语音 中填写已注册的复刻音色 ID。')

    const payload = {
      model,
      input: { text, voice: voiceId, format: 'mp3', sample_rate: 24000 },
    }
    let response
    try {
      response = await fetchWithTimeout(this.fetchImpl, this.endpoint, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${apiKey}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      }, this.timeoutMs)
    } catch (error) {
      throw new Error(`无法连接百炼服务：${error instanceof Error ? error.message : String(error)}`)
    }

    const bodyText = await response.text()
    if (!response.ok) throw new Error(describeFailure(response.status, bodyText))

    let parsed
    try {
      parsed = JSON.parse(bodyText)
    } catch {
      throw new Error('百炼返回的内容不是合法 JSON，请稍后重试。')
    }

    const audio = parsed?.output?.audio
    const inline = typeof audio?.data === 'string' && audio.data !== ''
    const url = typeof audio?.url === 'string' && audio.url !== '' ? audio.url : undefined
    if (!inline && url === undefined) throw new Error('百炼没有返回音频数据，请稍后重试。')

    const bytes = inline
      ? Buffer.from(audio.data, 'base64')
      : await this.download(url)

    if (bytes.length === 0) throw new Error('合成返回的音频为空，请稍后重试。')
    return { bytes, model, voiceId, characters: Number(parsed?.usage?.characters ?? text.length) }
  }

  /**
   * 下载合成结果。非流式接口返回一个短期有效的 OSS 地址。
   * @param url - 音频地址。
   * @returns 音频字节。
   */
  async download(url) {
    let response
    try {
      response = await fetchWithTimeout(this.fetchImpl, url, { method: 'GET' }, this.timeoutMs)
    } catch (error) {
      throw new Error(`下载合成音频失败：${error instanceof Error ? error.message : String(error)}`)
    }
    if (!response.ok) throw new Error(`下载合成音频失败（HTTP ${String(response.status)}）`)
    const buffer = await response.arrayBuffer()
    return Buffer.from(buffer)
  }
}
