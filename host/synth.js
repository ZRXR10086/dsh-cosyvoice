/**
 * 合成编排层：把「清洗 → 算缓存键 → 查缓存 → 调云端 → 落盘」串成一次动作。
 *
 * 单独成一层，是因为这三件事的边界恰好是职责的边界：
 *
 * - {@link import('./speech.js').SpeechClient} 只懂 HTTP，不懂磁盘；
 * - {@link import('./store.js').AudioStore} 只懂磁盘，不懂网络；
 * - 缓存策略（什么算命中、失败要不要污染缓存）属于编排，不该塞进任何一边。
 *
 * 于是"换个合成引擎"和"换个缓存介质"互不干扰，单测也可以只注入其中一半。
 * @module dsh-cosyvoice/synth
 */

import { MAX_TEXT_CHARS, normalizeText } from './speech.js'
import { cacheKeyOf } from './store.js'

/**
 * 带内容哈希缓存的语音合成器。
 *
 * 命中缓存时不产生任何 API 调用，所以重复点同一条消息的播放键是零成本的——
 * 这是 v1 里最省钱的一处设计：AI 回答不会变，用户却可能反复听。
 */
export class VoiceSynthesizer {
  /**
   * @param options - 协作者。
   * @param options.speech - 云端合成客户端。
   * @param options.store - 音频目录与缓存。
   * @param options.getSettings - 每次调用都读当前设置。
   * @param options.log - 诊断输出（不进响应）。
   */
  constructor({ speech, store, getSettings, log }) {
    this.speech = speech
    this.store = store
    this.getSettings = getSettings
    this.log = log ?? (() => {})
  }

  /**
   * 当前生效的缓存键参数（模型 + 音色）。
   * @returns 模型与音色。
   */
  identity() {
    const settings = this.getSettings() ?? {}
    return {
      model: String(settings.model ?? '').trim(),
      voiceId: String(settings.voiceId ?? '').trim(),
    }
  }

  /**
   * 合成一段文本，命中缓存则直接复用。
   * @param rawText - 要朗读的文本（可以是 Markdown，会先清洗）。
   * @returns 音频描述；`cached` 标明这次是否走了缓存。
   * @throws {Error} 配置缺失或合成失败时抛出（消息可直接展示给用户）。
   */
  async synthesize(rawText) {
    const text = normalizeText(rawText)
    if (text === '') throw new Error('没有可朗读的文本。')

    const { model, voiceId } = this.identity()
    const key = cacheKeyOf(model, voiceId, text)

    const cached = this.store.hit(key)
    if (cached !== undefined) {
      this.log(`synth: 命中缓存 ${cached.name}（${String(cached.bytes)} 字节）`)
      return { ...cached, cached: true, text, characters: 0 }
    }

    // 长文本在清洗后才截断，所以缓存键算的是"真正会发出去的内容"——
    // 否则同一段超长文本在截断前后会算出两个键，白付一次钱。
    const clipped = text.length > MAX_TEXT_CHARS ? text.slice(0, MAX_TEXT_CHARS) : text
    const result = await this.speech.synthesize(clipped)
    const clip = this.store.put(key, result.bytes)
    this.log(`synth: 已合成 ${clip.name}（${String(clip.bytes)} 字节，计费 ${String(result.characters)} 字符）`)
    return { ...clip, cached: false, text: clipped, characters: result.characters }
  }
}
