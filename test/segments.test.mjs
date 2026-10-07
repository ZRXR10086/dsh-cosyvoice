/**
 * 切句与分句合成编排的单测。
 *
 * 这里最想守住的两件事：
 *
 * 1. **首句优先** —— `start()` 必须在第一句就绪时就 resolve，而不是等全部句子。
 *    这是"点击后多久出声"的全部意义所在，退化成"等全部完成"就等于白做。
 * 2. **按序交付** —— 句子可以乱序合成完，但对外暴露的永远是**从 0 开始的连续
 *    前缀**。播放必须按序，第 3 句先回来也不能先播。
 *
 * 合成器是注入的假实现，所以"慢句""失败句""并发上限"都是可复现的本地状态。
 *
 * 运行：`node --test "test/*.test.mjs"`
 * @module dsh-cosyvoice/test-segments
 */

import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { MAX_SEGMENTS, MAX_SENTENCE_CHARS, splitSentences } from '../host/split.js'
import { SegmentSynth } from '../host/segments.js'

/**
 * 一个假的合成器：按句子内容决定延迟与是否失败。
 * @param options - 行为。
 * @param options.delay - 每句的延迟毫秒数（按句序号取，越界用最后一个）。
 * @param options.failAt - 第几句失败（从 0 开始）；省略即不失败。
 * @returns 假合成器与统计量。
 */
function fakeSynth({ delay = [], failAt = -1 } = {}) {
  const seen = []
  // 句子级缓存的替身：同一句第二次直接返回，`seen` 因此只记"真正打云端"的次数。
  const cache = new Map()
  let inFlight = 0
  let peak = 0
  const synth = {
    seen,
    get peak() { return peak },
    async synthesize(text) {
      if (cache.has(text)) return { ...cache.get(text), cached: true }
      const at = seen.length
      seen.push(text)
      inFlight += 1
      if (inFlight > peak) peak = inFlight
      const wait = delay[Math.min(at, delay.length - 1)] ?? 0
      if (wait > 0) await new Promise(resolve => setTimeout(resolve, wait))
      inFlight -= 1
      if (at === failAt) throw new Error('这一句故意失败')
      const clip = { name: `clip-${String(at)}`, bytes: 10, url: `/audio/clip-${String(at)}`, characters: 1 }
      cache.set(text, clip)
      return clip
    },
  }
  return synth
}

/** 造 n 句长度足够的句子（每句远超短句合并阈值）。 */
function sentences(count) {
  const out = []
  for (let i = 0; i < count; i += 1) out.push(`这是第${String(i + 1)}句足够长的回答内容，用来把整段话切开成多段。`)
  return out.join('')
}

describe('splitSentences', () => {
  it('空输入给空数组', () => {
    assert.deepEqual(splitSentences(''), [])
    assert.deepEqual(splitSentences('   \n '), [])
  })

  it('按句末标点与换行切', () => {
    assert.deepEqual(
      splitSentences('第一句足够长的内容在这里。第二句也足够长！\n第三句同样足够长？'),
      ['第一句足够长的内容在这里。', '第二句也足够长！', '第三句同样足够长？'],
    )
  })

  it('过短的句子并回相邻句，不把话切碎', () => {
    // 六个字的一句话单独合成会缺上下文，所以并回去。
    assert.deepEqual(splitSentences('好的，我知道了。'), ['好的，我知道了。'])
  })

  it('超长句按逗号细分', () => {
    // 一句没有句末标点、长度远超上限的话：只能靠逗号来切。
    const long = '这是一段很长的话，'.repeat(20)
    assert.ok(long.length > MAX_SENTENCE_CHARS, '构造的文本要真的超过上限')
    const parts = splitSentences(long)
    assert.ok(parts.length > 1, '长句应当被切开')
    assert.equal(parts.join(''), long, '切开再拼回来不能丢字')
    for (const part of parts) assert.ok(part.length <= MAX_SENTENCE_CHARS + 40, `切出来的仍然过长：${part}`)
  })

  it('段数有硬上限，不会因为超长回答变成上百个请求', () => {
    const huge = sentences(400)
    const parts = splitSentences(huge)
    assert.ok(parts.length <= MAX_SEGMENTS, `段数 ${String(parts.length)} 超过上限`)
    // 放宽预算而不是丢字：拼回来应当还是原文（去掉空白后）。
    assert.equal(parts.join('').replace(/\s/g, ''), huge.replace(/\s/g, ''))
  })

  it('没有标点的长文本也能被切开', () => {
    const flat = 'a'.repeat(MAX_SENTENCE_CHARS * 3)
    assert.equal(splitSentences(flat).length, 3)
  })
})

describe('SegmentSynth', () => {
  it('首句一就绪就返回，不等后面的句子', async () => {
    const synth = fakeSynth({ delay: [0, 80, 80, 80] })
    const segments = new SegmentSynth({ synth, concurrency: 3 })
    const job = await segments.start(sentences(4))

    const first = segments.get(job.id)
    assert.equal(first.total, 4)
    assert.equal(first.segments.length, 1, '首句就绪就应当返回，此时其余句子还没好')
    assert.equal(first.done, false)

    // 后台跑完后能取到全部，且顺序与原文一致。
    await new Promise(resolve => setTimeout(resolve, 200))
    const later = segments.get(job.id)
    assert.equal(later.done, true)
    assert.equal(later.segments.length, 4)
    assert.deepEqual(later.segments.map(clip => clip.name), ['clip-0', 'clip-1', 'clip-2', 'clip-3'])
  })

  it('乱序完成也按序交付：只暴露连续前缀', async () => {
    // 第 3 句（下标 2）最慢；下标 3 会先于它完成。
    const synth = fakeSynth({ delay: [0, 5, 200, 5] })
    const segments = new SegmentSynth({ synth, concurrency: 3 })
    const job = await segments.start(sentences(4))

    await new Promise(resolve => setTimeout(resolve, 80))
    const mid = segments.get(job.id)
    assert.equal(mid.done, false)
    assert.equal(mid.segments.length, 2, '不能越过尚未就绪的第 3 句先交付第 4 句')
    assert.equal(mid.segments[0].name, 'clip-0')
    // 第 4 句其实已经合成好了，只是还不能交出去。
    assert.equal(synth.seen.length, 4)

    await new Promise(resolve => setTimeout(resolve, 250))
    assert.equal(segments.get(job.id).segments.length, 4)
  })

  it('并发不超过设定值', async () => {
    const synth = fakeSynth({ delay: [0, 20, 20, 20, 20, 20] })
    const segments = new SegmentSynth({ synth, concurrency: 2 })
    const job = await segments.start(sentences(6))
    await new Promise(resolve => setTimeout(resolve, 200))
    assert.equal(segments.get(job.id).done, true)
    assert.ok(synth.peak <= 2, `并发峰值 ${String(synth.peak)} 超过 2`)
  })

  it('首句失败时 start() 直接抛出，不用等别句子', async () => {
    const synth = fakeSynth({ delay: [0, 50], failAt: 0 })
    const segments = new SegmentSynth({ synth, concurrency: 2 })
    await assert.rejects(segments.start(sentences(3)), /这一句故意失败/)
  })

  it('后续句失败时作业收工，已成功的句子照常可播', async () => {
    const synth = fakeSynth({ delay: [0, 0, 10], failAt: 2 })
    const segments = new SegmentSynth({ synth, concurrency: 3 })
    const job = await segments.start(sentences(4))
    await new Promise(resolve => setTimeout(resolve, 100))
    const view = segments.get(job.id)
    assert.equal(view.done, true)
    assert.match(view.error, /这一句故意失败/)
    // 前两句已经合成好，用户至少能听到开头，而不是整条播不出来。
    assert.equal(view.segments.length, 2)
  })

  it('没有可朗读的文本时抛出', async () => {
    const segments = new SegmentSynth({ synth: fakeSynth(), split: () => [] })
    await assert.rejects(segments.start('随便什么'), /没有可朗读的文本/)
  })

  it('查不到的作业返回 undefined，而不是抛错', () => {
    const segments = new SegmentSynth({ synth: fakeSynth() })
    assert.equal(segments.get('nope'), undefined)
    assert.equal(segments.get(''), undefined)
  })

  it('句子级缓存让第二次播放不再打云端', async () => {
    const synth = fakeSynth({ delay: [0, 10, 10] })
    const segments = new SegmentSynth({ synth, concurrency: 3 })
    const text = sentences(3)

    await segments.start(text)
    await new Promise(resolve => setTimeout(resolve, 60))
    assert.equal(synth.seen.length, 3, '首次播放每句各打一次云端')

    // 同一条回答第二次播放：每一句都命中缓存，一次云端请求都不发。
    const again = await segments.start(text)
    const view = segments.get(again.id)
    assert.equal(synth.seen.length, 3, '第二次播放不该再打云端')
    assert.equal(view.segments.length, 3)
    assert.ok(view.segments.every(clip => clip.cached === true), '每一句都应当是缓存命中')
  })
})
