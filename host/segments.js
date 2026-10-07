/**
 * 分句合成的作业编排：切句 → 并行合成 → **首句一就绪就交付** → 后台补齐。
 *
 * 为什么要有"作业"这层状态：
 *
 * 用户的原话是"合成时间太久"。并行合成把总耗时从"各句之和"压到"最慢的那一句"，
 * 但仍然要等所有句子都回来才出声。真正改变体感的是**首句优先** —— 第一句合成完
 * 就返回，浏览器立刻出声，剩下的句子在后台继续产出并按序排队。
 *
 * 于是这里维护一个短命的作业表：`start()` 只等到第一句就绪就 resolve，之后由
 * 轮询端点把新就绪的句子续上。作业是纯内存的，进程重启就消失，最坏的结果也只是
 * "这一次播放退化成只念了开头"，不会留下任何需要清理的磁盘状态。
 *
 * 句子按顺序交付：槽位可以乱序填满，但对外只暴露**从 0 开始的连续前缀**，因为
 * 播放必须按序 —— 第 3 句先回来也不能先播。
 * @module dsh-cosyvoice/segments
 */

import { splitSentences } from './split.js'

/** 同时发出的合成请求数。百炼有 QPS 限制，并发不是越高越好。 */
export const DEFAULT_CONCURRENCY = 3

/** 作业保留时长（毫秒）。 */
export const JOB_TTL_MS = 5 * 60 * 1000

/** 作业表上限；超了先淘汰最旧的，防止长时间使用下无限增长。 */
export const MAX_JOBS = 32

/**
 * 生成一个作业 id。
 * @returns 短 id。
 */
function newJobId() {
  return `j_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`
}

/** 分句合成编排。 */
export class SegmentSynth {
  /**
   * @param options - 协作者。
   * @param options.synth - 带缓存的合成器（句子级缓存就落在它身上）。
   * @param options.split - 切句函数。
   * @param options.concurrency - 并发上限。
   * @param options.log - 诊断输出。
   */
  constructor({ synth, split = splitSentences, concurrency = DEFAULT_CONCURRENCY, log }) {
    this.synth = synth
    this.split = split
    this.concurrency = Math.max(1, Math.floor(concurrency))
    this.log = log ?? (() => {})
    this.jobs = new Map()
  }

  /**
   * 推进"已就绪的连续前缀"。
   * @param job - 作业。
   */
  advance(job) {
    while (job.ready < job.slots.length && job.slots[job.ready] !== undefined) job.ready += 1
    if (job.ready > 0 && job.notify !== undefined) {
      const notify = job.notify
      job.notify = undefined
      notify()
    }
  }

  /**
   * 并行跑完一个作业的全部句子。
   * @param job - 作业。
   * @param parts - 句子。
   */
  async run(job, parts) {
    let cursor = 0
    const worker = async () => {
      for (;;) {
        const at = cursor
        cursor += 1
        if (at >= parts.length) return
        try {
          job.slots[at] = await this.synth.synthesize(parts[at])
          this.advance(job)
        } catch (error) {
          job.error = error instanceof Error ? error.message : String(error)
          this.log(`segments: 第 ${String(at + 1)} / ${String(parts.length)} 句失败：${job.error}`)
          // 一句失败就收工：继续跑下去只会让用户在半句之后卡住更久。
          job.done = true
          job.finishedAt = Date.now()
          return
        }
      }
    }
    const workers = []
    for (let i = 0; i < Math.min(this.concurrency, parts.length); i += 1) workers.push(worker())
    await Promise.all(workers)
    job.done = true
    job.finishedAt = Date.now()
    // 一句都没成功时也要放行 start()，否则它会永远等下去。
    if (job.notify !== undefined) {
      const notify = job.notify
      job.notify = undefined
      notify()
    }
  }

  /**
   * 淘汰旧作业。
   */
  prune() {
    const now = Date.now()
    for (const [id, job] of this.jobs) {
      if (job.done && job.finishedAt !== undefined && now - job.finishedAt > JOB_TTL_MS) this.jobs.delete(id)
    }
    while (this.jobs.size > MAX_JOBS) {
      const oldest = this.jobs.keys().next()
      if (oldest.done) break
      this.jobs.delete(oldest.value)
    }
  }

  /**
   * 开始一次分句合成，**等到首句就绪**即返回。
   * @param rawText - 要朗读的文本。
   * @returns 作业（已含至少一段；首句失败时抛出）。
   * @throws {Error} 没有可朗读的文本，或首句合成失败。
   */
  async start(rawText) {
    const parts = this.split(rawText)
    if (parts.length === 0) throw new Error('没有可朗读的文本。')

    const job = {
      id: newJobId(),
      total: parts.length,
      slots: new Array(parts.length),
      ready: 0,
      done: false,
      error: undefined,
      finishedAt: undefined,
      notify: undefined,
    }
    this.jobs.set(job.id, job)
    this.prune()

    const first = new Promise((resolve) => { job.notify = resolve })
    // 故意不 await：后台继续跑，start() 只等首句。
    void this.run(job, parts).catch((error) => {
      job.error = error instanceof Error ? error.message : String(error)
      job.done = true
    })
    await first

    if (job.ready === 0 && job.error !== undefined) throw new Error(job.error)
    return job
  }

  /**
   * 取一个作业的对外视图。
   * @param id - 作业 id。
   * @returns 视图；作业不存在时返回 undefined。
   */
  get(id) {
    const job = this.jobs.get(String(id ?? '').trim())
    if (job === undefined) return undefined
    const segments = []
    for (let i = 0; i < job.ready; i += 1) segments.push(job.slots[i])
    return { jobId: job.id, total: job.total, segments, done: job.done, error: job.error }
  }
}
