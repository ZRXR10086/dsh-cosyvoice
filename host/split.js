/**
 * 切句：把一段回答切成"适合一次合成"的若干小段。
 *
 * 为什么要切：整段文本一次性合成，字数越多越慢，点击后要干等。切成句子就能并行
 * 请求，并且**句子级缓存**让第二次播放近乎瞬时（AI 的回答不会变，用户却会反复听）。
 *
 * 三条规则，都是为了别把话切碎：
 *
 * - 长句再按逗号细分（上限 {@link MAX_SENTENCE_CHARS} 字）；
 * - 过短的句子（< {@link MIN_SENTENCE_CHARS} 字）并回相邻句 —— 缺上下文的短句
 *   合成质量会明显下降，还会念出奇怪的停顿；
 * - 段数硬上限 {@link MAX_SEGMENTS}：一篇两万字的回答按 120 字切会变成一百多个
 *   请求，那就不是加速而是打爆配额了。超过上限时放宽每段的字数预算，而不是丢字。
 * @module dsh-cosyvoice/split
 */

/** 单句的字数上限。超过就再按逗号细分。 */
export const MAX_SENTENCE_CHARS = 120

/** 短于此长度的句子会并回相邻句。 */
export const MIN_SENTENCE_CHARS = 8

/** 一段回答最多切成几段。 */
export const MAX_SEGMENTS = 24

/**
 * 把一段纯文本切成句子。
 * @param raw - 已清洗的文本。
 * @returns 句子数组；空输入返回空数组。
 */
export function splitSentences(raw) {
  const text = String(raw ?? '').trim()
  if (text === '') return []

  // 先按句末标点与换行切：换行本身就是一次停顿，值得切开。
  const rough = text
    .split(/(?<=[。！？!?；;…])|\n+/)
    .map(piece => piece.trim())
    .filter(piece => piece !== '')

  // 段数太多时放宽每段预算，而不是丢掉后面的内容。
  let budget = MAX_SENTENCE_CHARS
  if (rough.length > MAX_SEGMENTS) budget = Math.max(MAX_SENTENCE_CHARS, Math.ceil(text.length / MAX_SEGMENTS))

  const parts = []
  for (const piece of rough) {
    if (piece.length <= budget) {
      parts.push(piece)
      continue
    }
    // 按逗号、顿号、冒号细分；这些位置都是天然的换气点。
    let buffer = ''
    for (const slice of piece.split(/(?<=[，,、：:])/)) {
      if (buffer !== '' && buffer.length + slice.length > budget) {
        parts.push(buffer)
        buffer = slice
      } else {
        buffer += slice
      }
    }
    if (buffer !== '') parts.push(buffer)
  }

  // 兜底硬切：一整段没有任何标点（比如一长串标识符）时上面的细分不会生效。
  let clipped = []
  for (const part of parts) {
    if (part.length <= budget) {
      clipped.push(part)
      continue
    }
    for (let at = 0; at < part.length; at += budget) clipped.push(part.slice(at, at + budget))
  }

  // 句子很多但都很短时（比如几百句短问答），放宽预算也没用，只能把相邻的并成一组。
  if (clipped.length > MAX_SEGMENTS) {
    const group = Math.ceil(clipped.length / MAX_SEGMENTS)
    const packed = []
    for (let at = 0; at < clipped.length; at += group) packed.push(clipped.slice(at, at + group).join(''))
    clipped = packed
  }

  // 过短的并回上一句，避免把话切碎。
  const merged = []
  for (const part of clipped) {
    if (merged.length > 0 && merged[merged.length - 1].length < MIN_SENTENCE_CHARS) {
      merged[merged.length - 1] += part
    } else {
      merged.push(part)
    }
  }
  // 最后一句太短就并回去，别让它孤零零地成为一次请求。
  if (merged.length > 1 && merged[merged.length - 1].length < MIN_SENTENCE_CHARS) {
    merged[merged.length - 1] += merged.pop()
  }

  return merged
}
