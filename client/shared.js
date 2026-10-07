/**
 * 浏览器端各模块共用的管道。
 *
 * 这些文件由 `build.mjs` 拼接成一个 bundle，共享同一个 factory 作用域，所以这里
 * 声明的函数在后面的文件里可以直接调用；`build.mjs` 里的顺序就是声明顺序。
 *
 * bundle 是一个普通 classic script：没有 TypeScript、没有 JSX、没有 import，
 * 从模块表里只取 `react`。
 */

/** 宿主那一半占有的路由前缀。 */
var ROUTE_PREFIX = '/dsh-cosyvoice'

/** 设置命名空间；必须等于 profile 里的 entry id（`cordis.patch.yml` 的 `id`）。 */
var SETTINGS_ENTRY = 'cosyvoice'

/** 必须等于包名：boot-graph 的行 id 就是注册键。 */
var PLUGIN_ID = 'dsh-cosyvoice'

/** 主机名主题 token，每个都带兜底，缺 token 时降级而不是变空白。 */
var T = {
  text: 'var(--dsw-alias-label-primary, inherit)',
  textDim: 'var(--dsw-alias-label-secondary, inherit)',
  textFaint: 'var(--dsw-alias-label-tertiary, inherit)',
  border: 'var(--dsw-alias-border-l2, rgba(128, 128, 128, 0.24))',
  borderSoft: 'var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.16))',
  panel: 'var(--dsw-alias-bg-layer-2, rgba(128, 128, 128, 0.06))',
  accent: 'var(--dsw-alias-brand-primary, currentColor)',
}

/**
 * 调用一个宿主路由。
 *
 * 永不抛异常：失败的调用 resolve 成 `{ ok: false, message }`，于是渲染路径不会
 * 因为一次瞬时宿主错误而崩掉。
 * @param action - 插件前缀下的路由名（例如 `speak-message`）。
 * @param body - JSON body；省略即 GET。
 * @param method - 覆盖 HTTP 方法（档案的删除用 DELETE）。
 * @returns 解析后的响应，或失败信封。
 */
async function rpc(action, body, method) {
  try {
    const response = await fetch(ROUTE_PREFIX + '/' + action, {
      method: method ?? (body === undefined ? 'GET' : 'POST'),
      headers: body === undefined ? undefined : { 'content-type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    const text = await response.text()
    if (text === '') return { ok: response.ok }
    try {
      return JSON.parse(text)
    } catch (error) {
      return { ok: false, message: '返回内容不是合法 JSON' }
    }
  } catch (error) {
    return { ok: false, message: String(error) }
  }
}

/**
 * 上传一段字节并取回 JSON（音色克隆用）。
 *
 * 与 {@link rpc} 一样永不抛异常，于是"上传失败"不会把设置页掀翻。
 * @param action - 插件前缀下的路由名。
 * @param query - 查询串（已编码）。
 * @param bytes - 要送出去的字节。
 * @returns 解析后的响应，或失败信封。
 */
async function rpcBytes(action, query, bytes) {
  try {
    const response = await fetch(`${ROUTE_PREFIX}/${action}?${query}`, {
      method: 'POST',
      headers: { 'content-type': 'application/octet-stream' },
      body: bytes,
    })
    const text = await response.text()
    if (text === '') return { ok: response.ok }
    try {
      return JSON.parse(text)
    } catch (error) {
      return { ok: false, message: '返回内容不是合法 JSON' }
    }
  } catch (error) {
    return { ok: false, message: String(error) }
  }
}

/**
 * 播放状态：按 messageId 索引的一次性快照。
 *
 * 全局单实例而非每按钮一份，因为**同时只该有一个声音在响**：一个 `Audio`
 * 元素、一份状态，点第二条消息的播放键自然接管前一条。
 */
var player = (function () {
  /** @type {{ idle: true } | { kind: 'loading' | 'playing' | 'error', messageId: string, message?: string }} */
  var state = { idle: true }
  var listeners = []
  var audio = null

  /**
   * 当前播放队列。
   *
   * 回答是按句子分段的：首句一就绪就开始播，其余在后台继续合成。队列里存的是
   * **已经拿到 URL 的那几句**，`done` 说明后面不会再有，`index` 是正在播的那句。
   * @type {{ messageId: string, jobId: string, segments: Array, done: boolean, index: number, error?: string } | null}
   */
  var queue = null

  /** 后台续句的轮询定时器。 */
  var pollTimer = null

  function emit() {
    for (var i = 0; i < listeners.length; i += 1) listeners[i]()
  }

  function element() {
    if (audio === null) audio = new Audio()
    return audio
  }

  function set(next) {
    state = next
    emit()
  }

  function clearPoll() {
    if (pollTimer === null) return
    clearTimeout(pollTimer)
    pollTimer = null
  }

  /** 丢掉队列（停止播放、关掉轮询）。 */
  function dropQueue() {
    clearPoll()
    queue = null
  }

  /**
   * 预加载下一句。
   *
   * 句间的几百毫秒是最容易被听出来的卡顿，而下一句的 URL 此时通常已经拿到了，
   * 所以趁现在让浏览器把字节取回来。
   * @param url - 下一句的地址。
   */
  function preload(url) {
    try {
      var next = new Audio()
      next.preload = 'auto'
      next.src = url
    } catch (error) {
      // 预加载失败不影响播放本身：真到那句时会重新取。
    }
  }

  /**
   * 播放队列里的第 index 句。
   * @param index - 句序号。
   */
  function playAt(index) {
    if (queue === null) return
    queue.index = index

    if (index >= queue.segments.length) {
      // 还没合成出来：播完了但还有后续，就停在"合成中"等轮询把新句子接上。
      if (queue.done) {
        if (typeof queue.error === 'string' && queue.error !== '') {
          set({ kind: 'error', messageId: queue.messageId, message: queue.error })
        } else {
          set({ idle: true })
        }
        dropQueue()
        return
      }
      set({ kind: 'loading', messageId: queue.messageId })
      schedulePoll(0)
      return
    }

    var audio = element()
    audio.pause()
    audio.src = queue.segments[index].url
    audio.currentTime = 0
    set({ kind: 'loading', messageId: queue.messageId })
    preload(queue.segments[index + 1] === undefined ? undefined : queue.segments[index + 1].url)
    var started = audio.play()
    if (started && typeof started.then === 'function') {
      started.then(function () {
        // 只有这个队列还在播才更新状态：用户可能已经点停或切到别的消息了。
        if (queue !== null && queue.index === index) set({ kind: 'playing', messageId: queue.messageId })
      }).catch(function () {
        if (queue !== null && queue.index === index) {
          set({ kind: 'error', messageId: queue.messageId, message: '浏览器拒绝了自动播放，请再点一次' })
        }
        dropQueue()
      })
    } else {
      set({ kind: 'playing', messageId: queue.messageId })
    }
    audio.onended = function () {
      if (queue === null || queue.index !== index) return
      playAt(index + 1)
    }
    audio.onerror = function () {
      if (queue === null || queue.index !== index) return
      set({ kind: 'error', messageId: queue.messageId, message: '音频播放失败' })
      dropQueue()
    }
  }

  /**
   * 安排一次"去后台取新句子"的轮询。
   * @param delayMs - 延迟毫秒数。
   */
  function schedulePoll(delayMs) {
    if (queue === null) return
    clearPoll()
    pollTimer = setTimeout(function () {
      pollTimer = null
      if (queue === null) return
      rpc('segments?job=' + encodeURIComponent(queue.jobId)).then(function (res) {
        if (queue === null) return
        if (res === undefined || !res.ok) {
          set({ kind: 'error', messageId: queue.messageId, message: (res && res.message) || '语音合成失败' })
          dropQueue()
          return
        }
        queue.segments = res.segments === undefined ? queue.segments : res.segments
        queue.done = res.done === true
        if (typeof res.error === 'string' && res.error !== '') queue.error = res.error
        // 队列补上了就接着播；还没补上就继续等。
        if (queue.index < queue.segments.length) playAt(queue.index)
        else if (queue.done) playAt(queue.index)
        else schedulePoll(500)
      })
    }, delayMs)
  }

  return {
    /**
     * 开始播一个分句队列。
     * @param messageId - 归属消息。
     * @param job - 服务端给的作业视图 `{ jobId, segments, done, error }`。
     */
    startQueue: function (messageId, job) {
      dropQueue()
      queue = {
        messageId: messageId,
        jobId: String(job.jobId === undefined ? '' : job.jobId),
        segments: Array.isArray(job.segments) ? job.segments : [],
        done: job.done === true,
        index: 0,
        error: typeof job.error === 'string' ? job.error : undefined,
      }
      playAt(0)
    },
    /** @returns 当前状态快照。 */
    getSnapshot: function () { return state },
    /** @param listener - 变更回调。 @returns 取消订阅函数。 */
    subscribe: function (listener) {
      listeners.push(listener)
      return function () {
        var at = listeners.indexOf(listener)
        if (at >= 0) listeners.splice(at, 1)
      }
    },
    /**
     * 开始播一段音频。
     * @param messageId - 归属消息，用于把"正在播"落在正确的按钮上。
     * @param url - 音频地址。
     */
    play: function (messageId, url) {
      const audio = element()
      dropQueue()
      audio.pause()
      audio.src = url
      audio.currentTime = 0
      set({ kind: 'loading', messageId: messageId })
      const started = audio.play()
      if (started && typeof started.then === 'function') {
        started.then(function () {
          set({ kind: 'playing', messageId: messageId })
        }).catch(function () {
          set({ kind: 'error', messageId: messageId, message: '浏览器拒绝了自动播放，请再点一次' })
        })
      } else {
        set({ kind: 'playing', messageId: messageId })
      }
      audio.onended = function () { set({ idle: true }) }
      audio.onerror = function () {
        set({ kind: 'error', messageId: messageId, message: '音频播放失败' })
      }
    },
    /** 停止播放：连同队列与轮询一起收掉。 */
    stop: function () {
      const audio = element()
      dropQueue()
      audio.pause()
      audio.onended = null
      audio.onerror = null
      set({ idle: true })
    },
    /**
     * 标记某条消息正在合成。
     * @param messageId - 目标消息。
     */
    loading: function (messageId) {
      dropQueue()
      set({ kind: 'loading', messageId: messageId })
    },
    /**
     * 标记某条消息失败。
     * @param messageId - 目标消息。
     * @param message - 展示给用户的说明。
     */
    fail: function (messageId, message) {
      set({ kind: 'error', messageId: messageId, message: message })
    },
  }
})()

/**
 * 订阅播放器状态。
 * @returns 当前状态。
 */
function usePlayerState() {
  var pair = React.useState(function () { return player.getSnapshot() })
  var snapshot = pair[0]
  var setSnapshot = pair[1]
  React.useEffect(function () {
    setSnapshot(player.getSnapshot())
    return player.subscribe(function () { setSnapshot(player.getSnapshot()) })
  }, [])
  return snapshot
}

/**
 * 某条消息此刻的播放状态。
 * @param snapshot - 播放器快照。
 * @param messageId - 目标消息。
 * @returns `'idle' | 'loading' | 'playing' | 'error'`，以及错误消息。
 */
function stateOf(snapshot, messageId) {
  if (snapshot.idle === true) return { phase: 'idle', message: undefined }
  if (snapshot.messageId !== messageId) return { phase: 'idle', message: undefined }
  return { phase: snapshot.kind, message: snapshot.message }
}

/**
 * 从 chat 快照里抽出一条助手消息的纯文本。
 *
 * 与宿主渲染"复制"按钮时用同一套规则（只取 `kind === 'text'` 的块），所以听到的
 * 和复制出来的是同一段内容。
 * @param snapshot - chat 快照。
 * @param messageId - 目标消息。
 * @returns 文本；不在已加载窗口内时返回 undefined。
 */
function textOfMessage(snapshot, messageId) {
  if (snapshot === undefined || snapshot === null) return undefined
  const nodes = snapshot.legacy === undefined ? undefined : snapshot.legacy.nodes
  if (nodes === undefined) return undefined
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i]
    if (node === undefined || node.kind !== 'assistant' || node.messageId !== messageId) continue
    const blocks = node.blocks === undefined ? [] : node.blocks
    let text = ''
    for (let j = 0; j < blocks.length; j += 1) {
      const block = blocks[j]
      if (block !== undefined && block.kind === 'text' && typeof block.text === 'string') text += block.text
    }
    return text === '' ? undefined : text
  }
  return undefined
}
