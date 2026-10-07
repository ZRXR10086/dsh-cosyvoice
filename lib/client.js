// GENERATED FILE - do not edit by hand. Run `node build.mjs` instead.
// Sources: client/shared.js, client/locales.js, client/message-button.js, client/settings-page.js, client/index.js

window.__ModuleLoader__.load({
	id: "dsh-cosyvoice",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		var React = require("react");

		// ---- client/shared.js ----
		/**
		 * \u6d4f\u89c8\u5668\u7aef\u5404\u6a21\u5757\u5171\u7528\u7684\u7ba1\u9053\u3002
		 *
		 * \u8fd9\u4e9b\u6587\u4ef6\u7531 `build.mjs` \u62fc\u63a5\u6210\u4e00\u4e2a bundle\uff0c\u5171\u4eab\u540c\u4e00\u4e2a factory \u4f5c\u7528\u57df\uff0c\u6240\u4ee5\u8fd9\u91cc
		 * \u58f0\u660e\u7684\u51fd\u6570\u5728\u540e\u9762\u7684\u6587\u4ef6\u91cc\u53ef\u4ee5\u76f4\u63a5\u8c03\u7528\uff1b`build.mjs` \u91cc\u7684\u987a\u5e8f\u5c31\u662f\u58f0\u660e\u987a\u5e8f\u3002
		 *
		 * bundle \u662f\u4e00\u4e2a\u666e\u901a classic script\uff1a\u6ca1\u6709 TypeScript\u3001\u6ca1\u6709 JSX\u3001\u6ca1\u6709 import\uff0c
		 * \u4ece\u6a21\u5757\u8868\u91cc\u53ea\u53d6 `react`\u3002
		 */

		/** \u5bbf\u4e3b\u90a3\u4e00\u534a\u5360\u6709\u7684\u8def\u7531\u524d\u7f00\u3002 */
		var ROUTE_PREFIX = '/dsh-cosyvoice'

		/** \u8bbe\u7f6e\u547d\u540d\u7a7a\u95f4\uff1b\u5fc5\u987b\u7b49\u4e8e profile \u91cc\u7684 entry id\uff08`cordis.patch.yml` \u7684 `id`\uff09\u3002 */
		var SETTINGS_ENTRY = 'cosyvoice'

		/** \u5fc5\u987b\u7b49\u4e8e\u5305\u540d\uff1aboot-graph \u7684\u884c id \u5c31\u662f\u6ce8\u518c\u952e\u3002 */
		var PLUGIN_ID = 'dsh-cosyvoice'

		/** \u4e3b\u673a\u540d\u4e3b\u9898 token\uff0c\u6bcf\u4e2a\u90fd\u5e26\u515c\u5e95\uff0c\u7f3a token \u65f6\u964d\u7ea7\u800c\u4e0d\u662f\u53d8\u7a7a\u767d\u3002 */
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
		 * \u8c03\u7528\u4e00\u4e2a\u5bbf\u4e3b\u8def\u7531\u3002
		 *
		 * \u6c38\u4e0d\u629b\u5f02\u5e38\uff1a\u5931\u8d25\u7684\u8c03\u7528 resolve \u6210 `{ ok: false, message }`\uff0c\u4e8e\u662f\u6e32\u67d3\u8def\u5f84\u4e0d\u4f1a
		 * \u56e0\u4e3a\u4e00\u6b21\u77ac\u65f6\u5bbf\u4e3b\u9519\u8bef\u800c\u5d29\u6389\u3002
		 * @param action - \u63d2\u4ef6\u524d\u7f00\u4e0b\u7684\u8def\u7531\u540d\uff08\u4f8b\u5982 `speak-message`\uff09\u3002
		 * @param body - JSON body\uff1b\u7701\u7565\u5373 GET\u3002
		 * @param method - \u8986\u76d6 HTTP \u65b9\u6cd5\uff08\u6863\u6848\u7684\u5220\u9664\u7528 DELETE\uff09\u3002
		 * @returns \u89e3\u6790\u540e\u7684\u54cd\u5e94\uff0c\u6216\u5931\u8d25\u4fe1\u5c01\u3002
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
		      return { ok: false, message: '\u8fd4\u56de\u5185\u5bb9\u4e0d\u662f\u5408\u6cd5 JSON' }
		    }
		  } catch (error) {
		    return { ok: false, message: String(error) }
		  }
		}

		/**
		 * \u4e0a\u4f20\u4e00\u6bb5\u5b57\u8282\u5e76\u53d6\u56de JSON\uff08\u97f3\u8272\u514b\u9686\u7528\uff09\u3002
		 *
		 * \u4e0e {@link rpc} \u4e00\u6837\u6c38\u4e0d\u629b\u5f02\u5e38\uff0c\u4e8e\u662f"\u4e0a\u4f20\u5931\u8d25"\u4e0d\u4f1a\u628a\u8bbe\u7f6e\u9875\u6380\u7ffb\u3002
		 * @param action - \u63d2\u4ef6\u524d\u7f00\u4e0b\u7684\u8def\u7531\u540d\u3002
		 * @param query - \u67e5\u8be2\u4e32\uff08\u5df2\u7f16\u7801\uff09\u3002
		 * @param bytes - \u8981\u9001\u51fa\u53bb\u7684\u5b57\u8282\u3002
		 * @returns \u89e3\u6790\u540e\u7684\u54cd\u5e94\uff0c\u6216\u5931\u8d25\u4fe1\u5c01\u3002
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
		      return { ok: false, message: '\u8fd4\u56de\u5185\u5bb9\u4e0d\u662f\u5408\u6cd5 JSON' }
		    }
		  } catch (error) {
		    return { ok: false, message: String(error) }
		  }
		}

		/**
		 * \u64ad\u653e\u72b6\u6001\uff1a\u6309 messageId \u7d22\u5f15\u7684\u4e00\u6b21\u6027\u5feb\u7167\u3002
		 *
		 * \u5168\u5c40\u5355\u5b9e\u4f8b\u800c\u975e\u6bcf\u6309\u94ae\u4e00\u4efd\uff0c\u56e0\u4e3a**\u540c\u65f6\u53ea\u8be5\u6709\u4e00\u4e2a\u58f0\u97f3\u5728\u54cd**\uff1a\u4e00\u4e2a `Audio`
		 * \u5143\u7d20\u3001\u4e00\u4efd\u72b6\u6001\uff0c\u70b9\u7b2c\u4e8c\u6761\u6d88\u606f\u7684\u64ad\u653e\u952e\u81ea\u7136\u63a5\u7ba1\u524d\u4e00\u6761\u3002
		 */
		var player = (function () {
		  /** @type {{ idle: true } | { kind: 'loading' | 'playing' | 'error', messageId: string, message?: string }} */
		  var state = { idle: true }
		  var listeners = []
		  var audio = null

		  /**
		   * \u5f53\u524d\u64ad\u653e\u961f\u5217\u3002
		   *
		   * \u56de\u7b54\u662f\u6309\u53e5\u5b50\u5206\u6bb5\u7684\uff1a\u9996\u53e5\u4e00\u5c31\u7eea\u5c31\u5f00\u59cb\u64ad\uff0c\u5176\u4f59\u5728\u540e\u53f0\u7ee7\u7eed\u5408\u6210\u3002\u961f\u5217\u91cc\u5b58\u7684\u662f
		   * **\u5df2\u7ecf\u62ff\u5230 URL \u7684\u90a3\u51e0\u53e5**\uff0c`done` \u8bf4\u660e\u540e\u9762\u4e0d\u4f1a\u518d\u6709\uff0c`index` \u662f\u6b63\u5728\u64ad\u7684\u90a3\u53e5\u3002
		   * @type {{ messageId: string, jobId: string, segments: Array, done: boolean, index: number, error?: string } | null}
		   */
		  var queue = null

		  /** \u540e\u53f0\u7eed\u53e5\u7684\u8f6e\u8be2\u5b9a\u65f6\u5668\u3002 */
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

		  /** \u4e22\u6389\u961f\u5217\uff08\u505c\u6b62\u64ad\u653e\u3001\u5173\u6389\u8f6e\u8be2\uff09\u3002 */
		  function dropQueue() {
		    clearPoll()
		    queue = null
		  }

		  /**
		   * \u9884\u52a0\u8f7d\u4e0b\u4e00\u53e5\u3002
		   *
		   * \u53e5\u95f4\u7684\u51e0\u767e\u6beb\u79d2\u662f\u6700\u5bb9\u6613\u88ab\u542c\u51fa\u6765\u7684\u5361\u987f\uff0c\u800c\u4e0b\u4e00\u53e5\u7684 URL \u6b64\u65f6\u901a\u5e38\u5df2\u7ecf\u62ff\u5230\u4e86\uff0c
		   * \u6240\u4ee5\u8d81\u73b0\u5728\u8ba9\u6d4f\u89c8\u5668\u628a\u5b57\u8282\u53d6\u56de\u6765\u3002
		   * @param url - \u4e0b\u4e00\u53e5\u7684\u5730\u5740\u3002
		   */
		  function preload(url) {
		    try {
		      var next = new Audio()
		      next.preload = 'auto'
		      next.src = url
		    } catch (error) {
		      // \u9884\u52a0\u8f7d\u5931\u8d25\u4e0d\u5f71\u54cd\u64ad\u653e\u672c\u8eab\uff1a\u771f\u5230\u90a3\u53e5\u65f6\u4f1a\u91cd\u65b0\u53d6\u3002
		    }
		  }

		  /**
		   * \u64ad\u653e\u961f\u5217\u91cc\u7684\u7b2c index \u53e5\u3002
		   * @param index - \u53e5\u5e8f\u53f7\u3002
		   */
		  function playAt(index) {
		    if (queue === null) return
		    queue.index = index

		    if (index >= queue.segments.length) {
		      // \u8fd8\u6ca1\u5408\u6210\u51fa\u6765\uff1a\u64ad\u5b8c\u4e86\u4f46\u8fd8\u6709\u540e\u7eed\uff0c\u5c31\u505c\u5728"\u5408\u6210\u4e2d"\u7b49\u8f6e\u8be2\u628a\u65b0\u53e5\u5b50\u63a5\u4e0a\u3002
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
		        // \u53ea\u6709\u8fd9\u4e2a\u961f\u5217\u8fd8\u5728\u64ad\u624d\u66f4\u65b0\u72b6\u6001\uff1a\u7528\u6237\u53ef\u80fd\u5df2\u7ecf\u70b9\u505c\u6216\u5207\u5230\u522b\u7684\u6d88\u606f\u4e86\u3002
		        if (queue !== null && queue.index === index) set({ kind: 'playing', messageId: queue.messageId })
		      }).catch(function () {
		        if (queue !== null && queue.index === index) {
		          set({ kind: 'error', messageId: queue.messageId, message: '\u6d4f\u89c8\u5668\u62d2\u7edd\u4e86\u81ea\u52a8\u64ad\u653e\uff0c\u8bf7\u518d\u70b9\u4e00\u6b21' })
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
		      set({ kind: 'error', messageId: queue.messageId, message: '\u97f3\u9891\u64ad\u653e\u5931\u8d25' })
		      dropQueue()
		    }
		  }

		  /**
		   * \u5b89\u6392\u4e00\u6b21"\u53bb\u540e\u53f0\u53d6\u65b0\u53e5\u5b50"\u7684\u8f6e\u8be2\u3002
		   * @param delayMs - \u5ef6\u8fdf\u6beb\u79d2\u6570\u3002
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
		          set({ kind: 'error', messageId: queue.messageId, message: (res && res.message) || '\u8bed\u97f3\u5408\u6210\u5931\u8d25' })
		          dropQueue()
		          return
		        }
		        queue.segments = res.segments === undefined ? queue.segments : res.segments
		        queue.done = res.done === true
		        if (typeof res.error === 'string' && res.error !== '') queue.error = res.error
		        // \u961f\u5217\u8865\u4e0a\u4e86\u5c31\u63a5\u7740\u64ad\uff1b\u8fd8\u6ca1\u8865\u4e0a\u5c31\u7ee7\u7eed\u7b49\u3002
		        if (queue.index < queue.segments.length) playAt(queue.index)
		        else if (queue.done) playAt(queue.index)
		        else schedulePoll(500)
		      })
		    }, delayMs)
		  }

		  return {
		    /**
		     * \u5f00\u59cb\u64ad\u4e00\u4e2a\u5206\u53e5\u961f\u5217\u3002
		     * @param messageId - \u5f52\u5c5e\u6d88\u606f\u3002
		     * @param job - \u670d\u52a1\u7aef\u7ed9\u7684\u4f5c\u4e1a\u89c6\u56fe `{ jobId, segments, done, error }`\u3002
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
		    /** @returns \u5f53\u524d\u72b6\u6001\u5feb\u7167\u3002 */
		    getSnapshot: function () { return state },
		    /** @param listener - \u53d8\u66f4\u56de\u8c03\u3002 @returns \u53d6\u6d88\u8ba2\u9605\u51fd\u6570\u3002 */
		    subscribe: function (listener) {
		      listeners.push(listener)
		      return function () {
		        var at = listeners.indexOf(listener)
		        if (at >= 0) listeners.splice(at, 1)
		      }
		    },
		    /**
		     * \u5f00\u59cb\u64ad\u4e00\u6bb5\u97f3\u9891\u3002
		     * @param messageId - \u5f52\u5c5e\u6d88\u606f\uff0c\u7528\u4e8e\u628a"\u6b63\u5728\u64ad"\u843d\u5728\u6b63\u786e\u7684\u6309\u94ae\u4e0a\u3002
		     * @param url - \u97f3\u9891\u5730\u5740\u3002
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
		          set({ kind: 'error', messageId: messageId, message: '\u6d4f\u89c8\u5668\u62d2\u7edd\u4e86\u81ea\u52a8\u64ad\u653e\uff0c\u8bf7\u518d\u70b9\u4e00\u6b21' })
		        })
		      } else {
		        set({ kind: 'playing', messageId: messageId })
		      }
		      audio.onended = function () { set({ idle: true }) }
		      audio.onerror = function () {
		        set({ kind: 'error', messageId: messageId, message: '\u97f3\u9891\u64ad\u653e\u5931\u8d25' })
		      }
		    },
		    /** \u505c\u6b62\u64ad\u653e\uff1a\u8fde\u540c\u961f\u5217\u4e0e\u8f6e\u8be2\u4e00\u8d77\u6536\u6389\u3002 */
		    stop: function () {
		      const audio = element()
		      dropQueue()
		      audio.pause()
		      audio.onended = null
		      audio.onerror = null
		      set({ idle: true })
		    },
		    /**
		     * \u6807\u8bb0\u67d0\u6761\u6d88\u606f\u6b63\u5728\u5408\u6210\u3002
		     * @param messageId - \u76ee\u6807\u6d88\u606f\u3002
		     */
		    loading: function (messageId) {
		      dropQueue()
		      set({ kind: 'loading', messageId: messageId })
		    },
		    /**
		     * \u6807\u8bb0\u67d0\u6761\u6d88\u606f\u5931\u8d25\u3002
		     * @param messageId - \u76ee\u6807\u6d88\u606f\u3002
		     * @param message - \u5c55\u793a\u7ed9\u7528\u6237\u7684\u8bf4\u660e\u3002
		     */
		    fail: function (messageId, message) {
		      set({ kind: 'error', messageId: messageId, message: message })
		    },
		  }
		})()

		/**
		 * \u8ba2\u9605\u64ad\u653e\u5668\u72b6\u6001\u3002
		 * @returns \u5f53\u524d\u72b6\u6001\u3002
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
		 * \u67d0\u6761\u6d88\u606f\u6b64\u523b\u7684\u64ad\u653e\u72b6\u6001\u3002
		 * @param snapshot - \u64ad\u653e\u5668\u5feb\u7167\u3002
		 * @param messageId - \u76ee\u6807\u6d88\u606f\u3002
		 * @returns `'idle' | 'loading' | 'playing' | 'error'`\uff0c\u4ee5\u53ca\u9519\u8bef\u6d88\u606f\u3002
		 */
		function stateOf(snapshot, messageId) {
		  if (snapshot.idle === true) return { phase: 'idle', message: undefined }
		  if (snapshot.messageId !== messageId) return { phase: 'idle', message: undefined }
		  return { phase: snapshot.kind, message: snapshot.message }
		}

		/**
		 * \u4ece chat \u5feb\u7167\u91cc\u62bd\u51fa\u4e00\u6761\u52a9\u624b\u6d88\u606f\u7684\u7eaf\u6587\u672c\u3002
		 *
		 * \u4e0e\u5bbf\u4e3b\u6e32\u67d3"\u590d\u5236"\u6309\u94ae\u65f6\u7528\u540c\u4e00\u5957\u89c4\u5219\uff08\u53ea\u53d6 `kind === 'text'` \u7684\u5757\uff09\uff0c\u6240\u4ee5\u542c\u5230\u7684
		 * \u548c\u590d\u5236\u51fa\u6765\u7684\u662f\u540c\u4e00\u6bb5\u5185\u5bb9\u3002
		 * @param snapshot - chat \u5feb\u7167\u3002
		 * @param messageId - \u76ee\u6807\u6d88\u606f\u3002
		 * @returns \u6587\u672c\uff1b\u4e0d\u5728\u5df2\u52a0\u8f7d\u7a97\u53e3\u5185\u65f6\u8fd4\u56de undefined\u3002
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

		// ---- client/locales.js ----
		/**
		 * \u672c\u63d2\u4ef6\u7684\u6587\u6848\u5b57\u5178\u3002
		 *
		 * \u4e24\u5957\u5b57\u5178\u7684\u952e\u96c6\u5fc5\u987b\u5b8c\u5168\u4e00\u81f4 \u2014\u2014 `zh` \u662f\u952e\u96c6\u7684\u4e8b\u5b9e\u6765\u6e90\uff0c`t()` \u5728\u7f3a\u952e\u65f6\u56de\u843d\u5230
		 * \u4e2d\u6587\uff0c\u6240\u4ee5\u82f1\u6587\u6f0f\u4e00\u4e2a\u952e\u4e0d\u4f1a\u628a\u754c\u9762\u53d8\u6210\u7a7a\u767d\uff0c\u4f46 `verify.mjs` \u4f1a\u628a\u5b83\u5f53\u4f5c\u6784\u5efa\u7f3a\u9677\u3002
		 */

		/** \u4e2d\u6587\u5b57\u5178\uff08\u952e\u96c6\u7684\u4e8b\u5b9e\u6765\u6e90\uff09\u3002 */
		var DICT_ZH = {
		  'action.speak': '\u6717\u8bfb\u8fd9\u6761\u56de\u7b54',
		  'action.retry': '\u91cd\u8bd5',
		  'action.stop': '\u505c\u6b62\u64ad\u653e',
		  'action.speaking': '\u6b63\u5728\u64ad\u653e',
		  'action.synthesizing': '\u6b63\u5728\u5408\u6210',
		  'error.missing': '\u6ca1\u627e\u5230\u8fd9\u6761\u56de\u7b54\u7684\u6587\u672c',
		  'error.generic': '\u8bed\u97f3\u5408\u6210\u5931\u8d25',
		  'section.label': '\u8bed\u97f3',
		  'settings.title': '\u8bed\u97f3\u6717\u8bfb',
		  'settings.hint': '\u6bcf\u6761 AI \u56de\u7b54\u672b\u5c3e\u4f1a\u51fa\u73b0\u4e00\u4e2a\u64ad\u653e\u952e\uff0c\u70b9\u51fb\u5373\u7528\u963f\u91cc\u4e91\u767e\u70bc CosyVoice \u97f3\u8272\u6717\u8bfb\u3002',
		  'settings.key': 'API Key',
		  'settings.keyPlaceholder': 'sk-...\uff08\u963f\u91cc\u4e91\u767e\u70bc\u63a7\u5236\u53f0\u83b7\u53d6\uff09',
		  'settings.model': '\u5408\u6210\u6a21\u578b',
		  'settings.modelHint': '\u6ca1\u6709\u542f\u7528\u97f3\u8272\u6863\u6848\u65f6\u4f7f\u7528\u7684\u6a21\u578b\uff1b\u5fc5\u987b\u4e0e\u6ce8\u518c\u97f3\u8272\u65f6\u4f7f\u7528\u7684\u6a21\u578b\u4e00\u81f4\uff0c\u5426\u5219\u767e\u70bc\u4f1a\u76f4\u63a5\u62d2\u7edd\u8bf7\u6c42\u3002',
		  'settings.voice': '\u9ed8\u8ba4\u97f3\u8272 ID',
		  'settings.voiceHint': '\u6ca1\u6709\u542f\u7528\u97f3\u8272\u6863\u6848\u65f6\u4f7f\u7528\u7684\u97f3\u8272\uff1b\u6709\u6863\u6848\u65f6\u4ee5\u6863\u6848\u4e3a\u51c6\u3002',
		  'settings.voicePlaceholder': '\u767e\u70bc\u63a7\u5236\u53f0\u91cc\u590d\u523b/\u8bbe\u8ba1\u7684\u97f3\u8272 ID',
		  'profiles.title': '\u97f3\u8272\u6863\u6848',
		  'profiles.hint': '\u4fdd\u5b58\u591a\u5957\u97f3\u8272\uff0c\u968f\u65f6\u5207\u6362\u5f53\u524d\u4f7f\u7528\u7684\u90a3\u4e00\u5957\u3002',
		  'profiles.empty': '\u8fd8\u6ca1\u6709\u97f3\u8272\u6863\u6848\uff0c\u6b64\u65f6\u4f7f\u7528\u4e0b\u9762\u7684\u9ed8\u8ba4\u97f3\u8272\u3002',
		  'profiles.add': '\u65b0\u589e\u97f3\u8272',
		  'profiles.edit': '\u7f16\u8f91',
		  'profiles.save': '\u4fdd\u5b58',
		  'profiles.cancel': '\u53d6\u6d88',
		  'profiles.delete': '\u5220\u9664',
		  'profiles.use': '\u542f\u7528',
		  'profiles.current': '\u5f53\u524d\u97f3\u8272',
		  'profiles.namePlaceholder': '\u540d\u79f0\uff0c\u4f8b\u5982"\u6211\u7684\u58f0\u97f3"',
		  'profiles.voicePlaceholder': '\u97f3\u8272 ID',
		  'profiles.modelPlaceholder': '\u7559\u7a7a\u5219\u7528\u4e0a\u9762\u7684\u5408\u6210\u6a21\u578b',
		  'profiles.needVoice': '\u97f3\u8272 ID \u4e0d\u80fd\u4e3a\u7a7a\u3002',
		  'profiles.pending': '\u590d\u523b\u4e2d',
		  'profiles.failed': '\u5931\u8d25',
		  'clone.title': '\u97f3\u8272\u514b\u9686',
		  'clone.hint': '\u4e0a\u4f20\u4e00\u6bb5 10~20 \u79d2\u7684\u6e05\u6670\u4eba\u58f0\uff08\u5efa\u8bae 48kHz \u7684 WAV\uff09\uff0c\u63d2\u4ef6\u4f1a\u81ea\u52a8\u5b8c\u6210\u590d\u523b\u5e76\u5199\u5165\u6863\u6848\uff1b\u590d\u523b\u5b8c\u6210\u540e\u4f1a\u81ea\u52a8\u8bbe\u4e3a\u5f53\u524d\u97f3\u8272\u3002',
		  'clone.start': '\u5f00\u59cb\u590d\u523b',
		  'clone.uploading': '\u6b63\u5728\u4e0a\u4f20\u5e76\u590d\u523b\u2026',
		  'clone.pending': '\u97f3\u8272\u90e8\u7f72\u4e2d\uff0c\u8bf7\u7a0d\u5019\u2026',
		  'clone.ready': '\u590d\u523b\u5b8c\u6210\uff0c\u5df2\u8bbe\u4e3a\u5f53\u524d\u97f3\u8272\u3002',
		  'clone.failed': '\u97f3\u8272\u590d\u523b\u5931\u8d25',
		  'clone.timeout': '\u7b49\u5f85\u90e8\u7f72\u8d85\u65f6\uff0c\u53ef\u7a0d\u540e\u5728\u5217\u8868\u91cc\u770b\u5b83\u7684\u72b6\u6001\u3002',
		  'clone.noFile': '\u5148\u9009\u4e00\u4e2a\u97f3\u9891\u6587\u4ef6\u3002',
		  'clone.sync': '\u4ece\u4e91\u7aef\u540c\u6b65',
		  'clone.syncing': '\u6b63\u5728\u8bfb\u53d6\u4e91\u7aef\u97f3\u8272\u2026',
		  'clone.synced': '\u5df2\u5bfc\u5165\u4e91\u7aef\u97f3\u8272',
		  'clone.syncedNone': '\u4e91\u7aef\u6ca1\u6709\u65b0\u7684\u97f3\u8272\u3002',
		  'settings.dir': '\u8f93\u51fa\u76ee\u5f55',
		  'settings.dirPlaceholder': '\u7559\u7a7a\u5219\u4f7f\u7528\u63d2\u4ef6\u9ed8\u8ba4\u76ee\u5f55',
		  'settings.boot': '\u6253\u5f00\u9875\u9762\u540e\u64ad\u653e\u4e00\u6b21\u63d0\u793a\u97f3',
		  'settings.preview': '\u8bd5\u542c',
		  'settings.previewText': '\u8fd9\u662f\u4e00\u6b21\u8bed\u97f3\u8bd5\u542c\uff0c\u97f3\u8272\u4e0e\u6a21\u578b\u914d\u7f6e\u6b63\u786e\u5c31\u80fd\u542c\u5230\u8fd9\u53e5\u8bdd\u3002',
		  'settings.open': '\u6253\u5f00\u76ee\u5f55',
		  'settings.clear': '\u6e05\u7a7a\u7f13\u5b58',
		  'settings.cleared': '\u5df2\u6e05\u7a7a',
		  'settings.count': '\u5f53\u524d\u7f13\u5b58',
		  'settings.unconfigured': '\u5c1a\u672a\u914d\u7f6e API Key \u6216\u97f3\u8272 ID\uff0c\u64ad\u653e\u952e\u4f1a\u63d0\u793a\u914d\u7f6e\u3002',
		  'settings.ready': '\u5df2\u914d\u7f6e\uff0c\u53ef\u4ee5\u5f00\u59cb\u6717\u8bfb\u3002',
		  'settings.saved': '\u5df2\u4fdd\u5b58',
		}

		/** \u82f1\u6587\u5b57\u5178\uff0c\u952e\u96c6\u5bf9\u7740 zh \u6821\u6838\u3002 */
		var DICT_EN = {
		  'action.speak': 'Read this reply aloud',
		  'action.retry': 'Retry',
		  'action.stop': 'Stop playback',
		  'action.speaking': 'Playing',
		  'action.synthesizing': 'Synthesizing',
		  'error.missing': 'Could not find the text of this reply',
		  'error.generic': 'Speech synthesis failed',
		  'section.label': 'Voice',
		  'settings.title': 'Voice playback',
		  'settings.hint': 'Every AI reply gets a play button at its end; clicking it reads the reply in your DashScope CosyVoice voice.',
		  'settings.key': 'API key',
		  'settings.keyPlaceholder': 'sk-... (from the DashScope console)',
		  'settings.model': 'Synthesis model',
		  'settings.modelHint': 'Used when no voice profile is active; must match the model used when registering the voice, or DashScope rejects the request.',
		  'settings.voice': 'Default voice ID',
		  'settings.voiceHint': 'Used when no voice profile is active; an active profile takes precedence.',
		  'settings.voicePlaceholder': 'Cloned or designed voice ID from the console',
		  'profiles.title': 'Voice profiles',
		  'profiles.hint': 'Keep several voices and switch between them at any time.',
		  'profiles.empty': 'No voice profiles yet, so the default voice below is used.',
		  'profiles.add': 'New voice',
		  'profiles.edit': 'Edit',
		  'profiles.save': 'Save',
		  'profiles.cancel': 'Cancel',
		  'profiles.delete': 'Delete',
		  'profiles.use': 'Use',
		  'profiles.current': 'In use',
		  'profiles.namePlaceholder': 'Name, e.g. "My voice"',
		  'profiles.voicePlaceholder': 'Voice ID',
		  'profiles.modelPlaceholder': 'Leave empty for the synthesis model above',
		  'profiles.needVoice': 'Voice ID cannot be empty.',
		  'profiles.pending': 'Enrolling',
		  'profiles.failed': 'Failed',
		  'clone.title': 'Voice cloning',
		  'clone.hint': 'Upload 10-20 seconds of clear speech (48 kHz WAV recommended). The plugin enrolls the voice, adds it to your profiles, and makes it the active one once it is deployed.',
		  'clone.start': 'Clone voice',
		  'clone.uploading': 'Uploading and enrolling\u2026',
		  'clone.pending': 'Deploying the voice, please wait\u2026',
		  'clone.ready': 'Cloned, and now set as the active voice.',
		  'clone.failed': 'Voice cloning failed',
		  'clone.timeout': 'Timed out waiting for deployment; check its status in the list later.',
		  'clone.noFile': 'Pick an audio file first.',
		  'clone.sync': 'Sync from cloud',
		  'clone.syncing': 'Reading cloud voices\u2026',
		  'clone.synced': 'Imported cloud voices',
		  'clone.syncedNone': 'No new voices in the cloud.',
		  'settings.dir': 'Output directory',
		  'settings.dirPlaceholder': 'Leave empty for the plugin default',
		  'settings.boot': 'Play a chime once after the page opens',
		  'settings.preview': 'Preview',
		  'settings.previewText': 'This is a voice preview. If the voice and model are configured correctly, you will hear this sentence.',
		  'settings.open': 'Open folder',
		  'settings.clear': 'Clear cache',
		  'settings.cleared': 'Cleared',
		  'settings.count': 'Cached clips',
		  'settings.unconfigured': 'No API key or voice ID yet; the play button will ask you to configure one.',
		  'settings.ready': 'Configured and ready to speak.',
		  'settings.saved': 'Saved',
		}

		// ---- client/message-button.js ----
		/**
		 * \u64ad\u653e\u952e\uff1a\u6302\u5728 `conversation.chat.assistant-actions` \u4e0a\uff0c\u4e8e\u662f\u5b83\u51fa\u73b0\u5728\u6bcf\u6761 AI
		 * \u56de\u7b54\u672b\u5c3e\u90a3\u4e00\u6392\u52a8\u4f5c\u6309\u94ae\u91cc\uff08\u4e0e\u70b9\u8d5e/\u70b9\u8e29\u540c\u4e00\u884c\uff09\u3002
		 *
		 * \u8fd9\u662f v1 \u7684\u5168\u90e8\u4ea4\u4e92\u9762 \u2014\u2014 **\u6ca1\u6709\u7cfb\u7edf\u63d0\u793a\u6ce8\u5165\uff0c\u4e5f\u6ca1\u6709\u7ed9\u6a21\u578b\u7684\u5de5\u5177**\u3002\u6a21\u578b\u4e0d\u77e5\u9053
		 * \u8bed\u97f3\u8fd9\u4ef6\u4e8b\uff0c\u7528\u6237\u70b9\u54ea\u4e2a\u6309\u94ae\u5c31\u8bfb\u54ea\u4e00\u6761\u3002pull \u800c\u4e0d\u662f push\uff0c\u6240\u4ee5\u4e0d\u5b58\u5728"\u63d0\u9192\u4e86\u5b83
		 * \u5374\u4e0d\u8bf4"\u7684\u4e0d\u786e\u5b9a\u6027\u3002
		 *
		 * \u6587\u672c\u4ece chat \u5feb\u7167\u91cc\u53d6\uff08`useChat` \u662f chat \u4e3a session \u7ea7 slot \u58f0\u660e\u7684\u6807\u51c6 prop\uff09\u3002
		 * \u53d6\u4e0d\u5230\u65f6\uff08\u6d88\u606f\u4e0d\u5728\u5df2\u52a0\u8f7d\u7a97\u53e3\u5185\uff09\u628a messageId \u4ea4\u7ed9\u5bbf\u4e3b\u53bb\u89e3\u6790\uff0c\u4e24\u6761\u8def\u90fd\u8d70\u4e0d\u901a
		 * \u624d\u62a5"\u6ca1\u627e\u5230\u6587\u672c"\u3002
		 */

		/** \u56fe\u6807\u7edf\u4e00\u5c3a\u5bf8\uff1a\u4e0e\u5bbf\u4e3b\u90a3\u4e00\u6392\u52a8\u4f5c\u6309\u94ae\u7684\u89c6\u89c9\u91cd\u91cf\u4e00\u81f4\u3002 */
		var ICON = {
		  width: '16',
		  height: '16',
		  viewBox: '0 0 24 24',
		  fill: 'none',
		  stroke: 'currentColor',
		  strokeWidth: '1.8',
		  strokeLinecap: 'round',
		  strokeLinejoin: 'round',
		}

		/**
		 * \u5587\u53ed\u56fe\u6807\uff1a\u5f85\u64ad\u3002
		 * @returns SVG \u5143\u7d20\u3002
		 */
		function IconSpeak() {
		  return React.createElement('svg', ICON,
		    React.createElement('path', { d: 'M11 5 6 9H3v6h3l5 4V5z' }),
		    React.createElement('path', { d: 'M15.5 8.5a5 5 0 0 1 0 7' }),
		    React.createElement('path', { d: 'M18.5 5.5a9 9 0 0 1 0 13' }))
		}

		/**
		 * \u505c\u6b62\u56fe\u6807\uff1a\u64ad\u653e\u4e2d\u3002
		 * @returns SVG \u5143\u7d20\u3002
		 */
		function IconStop() {
		  return React.createElement('svg', ICON,
		    React.createElement('rect', { x: '7', y: '7', width: '10', height: '10', rx: '2', fill: 'currentColor' }))
		}

		/**
		 * \u8f6c\u5708\u56fe\u6807\uff1a\u5408\u6210\u4e2d\u3002\u7528 SVG \u539f\u751f\u52a8\u753b\uff0c\u6240\u4ee5\u4e0d\u9700\u8981\u989d\u5916\u7684\u6837\u5f0f\u8868\u3002
		 * @returns SVG \u5143\u7d20\u3002
		 */
		function IconBusy() {
		  // animateTransform \u5fc5\u987b\u5f85\u5728 <g> \u91cc\uff1aSVG \u7684\u52a8\u753b\u5143\u7d20\u4f5c\u7528\u4e8e\u5176**\u7236\u5143\u7d20**\u3002
		  // \u82e5\u76f4\u63a5\u6302\u5728 <svg> \u4e0b\uff0c\u65cb\u8f6c\u7684\u662f\u6574\u4e2a\u56fe\u6807\uff08\u8fde\u5e26\u5b83\u5728\u6309\u94ae\u91cc\u7684\u4f4d\u7f6e\u4e00\u8d77\u7ed5\u5708\uff09\uff0c
		  // \u770b\u8d77\u6765\u5c31\u662f"\u6574\u4f53\u4e5f\u5728\u8f6c"\u3002\u653e\u8fdb <g> \u540e\u53ea\u6709\u8fd9\u6761\u5f27\u7ed5\u4e2d\u5fc3\u8f6c\u3002
		  return React.createElement('svg', ICON,
		    React.createElement('g', null,
		      React.createElement('path', { d: 'M12 3a9 9 0 1 0 9 9', opacity: '0.85' }),
		      React.createElement('animateTransform', {
		        attributeName: 'transform',
		        type: 'rotate',
		        from: '0 12 12',
		        to: '360 12 12',
		        dur: '0.9s',
		        repeatCount: 'indefinite',
		      })))
		}

		/**
		 * \u64ad\u653e\u952e\u3002
		 * @param props - slot \u8fd0\u884c\u65f6 props\uff08`messageId`\u3001`sessionId`\u3001`useChat`\uff09\u4e0e `t`\u3002
		 * @returns \u4e00\u4e2a\u6309\u94ae\u3002
		 */
		function CosyvoiceSpeakButton(props) {
		  var messageId = props.messageId
		  var sessionId = props.sessionId
		  var useChat = props.useChat
		  var t = props.t

		  var snapshot = usePlayerState()
		  var current = stateOf(snapshot, messageId)
		  var busy = current.phase === 'loading'
		  var playing = current.phase === 'playing'

		  // chat \u6302\u8f7d\u540e\u624d\u4f1a\u6709 useChat\uff1b\u7f3a\u5931\u65f6\u7ec4\u4ef6\u4ecd\u7136\u6e32\u67d3\uff0c\u6587\u672c\u6539\u7531\u5bbf\u4e3b\u89e3\u6790\u3002
		  var text = typeof useChat === 'function'
		    ? useChat(function (chat) { return textOfMessage(chat, messageId) })
		    : undefined

		  var label = playing
		    ? t('action.stop')
		    : busy
		      ? t('action.synthesizing')
		      : t('action.speak')

		  var title = current.phase === 'error' && current.message !== undefined
		    ? current.message
		    : label

		  /**
		   * \u70b9\u51fb\uff1a\u64ad\u653e\u4e2d\u5373\u505c\u6b62\uff0c\u5426\u5219\u53d6\u6587\u672c \u2192 \u5408\u6210 \u2192 \u64ad\u653e\u3002
		   */
		  function onActivate() {
		    if (playing) {
		      player.stop()
		      return
		    }
		    if (busy) return
		    player.loading(messageId)
		    rpc('speak-message', {
		      messageId: messageId,
		      sessionId: sessionId,
		      text: typeof text === 'string' ? text : '',
		    }).then(function (res) {
		      if (res === undefined || !res.ok) {
		        player.fail(messageId, (res && res.message) || t('error.generic'))
		        return
		      }
		      if (!Array.isArray(res.segments) || res.segments.length === 0 || !res.segments[0].url) {
		        player.fail(messageId, t('error.generic'))
		        return
		      }
		      // \u9996\u53e5\u4e00\u5c31\u7eea\u5c31\u5f00\u59cb\u64ad\uff1b\u5269\u4e0b\u7684\u53e5\u5b50\u5728\u540e\u53f0\u7ee7\u7eed\u5408\u6210\uff0c\u64ad\u653e\u5668\u81ea\u5df1\u4f1a\u6309\u5e8f\u63a5\u4e0a\u3002
		      player.startQueue(messageId, res)
		    })
		  }

		  var glyph = playing ? React.createElement(IconStop) : busy ? React.createElement(IconBusy) : React.createElement(IconSpeak)

		  return React.createElement('button', {
		    type: 'button',
		    'aria-label': title,
		    'aria-pressed': playing,
		    'data-active': playing || undefined,
		    'data-busy': busy || undefined,
		    title: title,
		    onClick: onActivate,
		    style: {
		      display: 'inline-flex',
		      alignItems: 'center',
		      justifyContent: 'center',
		      width: '28px',
		      height: '28px',
		      padding: '0',
		      borderRadius: '6px',
		      border: '1px solid ' + (playing ? T.accent : 'transparent'),
		      background: playing ? T.panel : 'transparent',
		      color: current.phase === 'error' ? '#d93025' : T.textDim,
		      cursor: busy ? 'progress' : 'pointer',
		      opacity: busy ? '0.6' : '1',
		      transition: 'background-color .12s, color .12s',
		    },
		  }, glyph)
		}

		// ---- client/settings-page.js ----
		/**
		 * \u8bbe\u7f6e\u9875\uff1a\u6302\u5728 `settings.section` \u4e0a\uff0c\u63d0\u4f9b\u4e00\u4e2a\u300c\u8bed\u97f3\u300d\u5206\u533a\u3002
		 *
		 * \u9875\u9762\u81ea\u5df1\u753b\u8868\u5355\u800c\u4e0d\u662f\u4f9d\u8d56\u81ea\u52a8\u751f\u6210\u7684\u90a3\u4e00\u5957\uff0c\u56e0\u4e3a\u8fd9\u91cc\u6709\u4e09\u4ef6\u81ea\u52a8\u8868\u5355\u505a\u4e0d\u5230\u7684\u4e8b\uff1a
		 * **\u8bd5\u542c**\uff08\u8981\u8d70\u4e00\u6b21\u771f\u5b9e\u5408\u6210\uff09\u3001**\u6253\u5f00\u8f93\u51fa\u76ee\u5f55**\u3001**\u6e05\u7a7a\u7f13\u5b58**\u3002\u524d\u4e24\u9879\u662f\u5bbf\u4e3b\u8def\u7531
		 * \u4e0a\u7684\u526f\u4f5c\u7528\uff0c\u4e0d\u662f\u5b57\u6bb5\u5199\u5165\u3002
		 *
		 * \u5b57\u6bb5\u8bfb\u5199\u8d70 `ctx.configForms`\uff1a\u5b83\u6309 entry id \u62ff\u5230\u672c\u63d2\u4ef6\u7684\u914d\u7f6e\u955c\u50cf\uff0c\u5199\u5165\u662f\u300c\u6309\u8def\u5f84
		 * \u7684\u589e\u91cf\u7f16\u8f91\u300d\uff0c\u6240\u4ee5\u672c\u9875\u6c38\u8fdc\u62ff\u4e0d\u5230\u88ab\u8131\u654f\u7684 API Key \u660e\u6587\uff0c\u4e5f\u5c31\u4e0d\u4f1a\u5728\u63d0\u4ea4\u65f6\u628a\u5b83
		 * \u62b9\u6389 \u2014\u2014 \u4e00\u4e2a\u53ea\u8bfb\u5230\u63a9\u7801\u7684\u9875\u9762\u82e5\u6574\u4efd\u56de\u5199\uff0c\u4f1a\u9759\u9ed8\u5220\u6389\u7528\u6237\u5b58\u597d\u7684 Key\u3002
		 */

		/** \u4e00\u884c\u8bbe\u7f6e\uff1a\u6807\u7b7e\u5217 + \u5185\u5bb9\u5217\u3002 */
		var ROW = {
		  display: 'flex',
		  alignItems: 'center',
		  gap: '8px',
		  padding: '14px 0',
		  borderBottom: '1px solid ' + T.borderSoft,
		}

		/** \u6807\u7b7e\u5217\u3002 */
		var ROW_LABEL = {
		  flex: 'none',
		  width: '96px',
		  fontSize: '13px',
		  lineHeight: '20px',
		  color: T.textDim,
		}

		/** \u5185\u5bb9\u5217\u3002 */
		var ROW_BODY = {
		  flex: '1',
		  minWidth: '0',
		  display: 'flex',
		  alignItems: 'center',
		  gap: '8px',
		}

		/** \u6587\u672c\u8f93\u5165\u6846\uff0c\u5bf9\u9f50\u5bbf\u4e3b\u81ea\u5df1\u7684\u884c\u6837\u5f0f\u3002 */
		var INPUT = {
		  flex: '1',
		  minWidth: '0',
		  padding: '6px 9px',
		  borderRadius: '6px',
		  border: '1px solid ' + T.border,
		  background: 'var(--dsw-alias-bg-layer-1, transparent)',
		  color: T.text,
		  font: 'inherit',
		  fontSize: '12px',
		  fontFamily: 'monospace',
		  boxSizing: 'border-box',
		}

		/** \u6b21\u7ea7\u6309\u94ae\u3002 */
		var BUTTON = {
		  flex: 'none',
		  padding: '6px 12px',
		  borderRadius: '6px',
		  border: '1px solid ' + T.border,
		  background: 'transparent',
		  color: T.text,
		  font: 'inherit',
		  fontSize: '12px',
		  cursor: 'pointer',
		}

		/** \u884c\u4e0b\u65b9\u7684\u8bf4\u660e\u6587\u5b57\u3002 */
		var HINT = {
		  fontSize: '12px',
		  lineHeight: '18px',
		  color: T.textFaint,
		  padding: '2px 0 10px',
		}

		/** \u539f\u751f\u590d\u9009\u6846\uff0c\u7528\u54c1\u724c\u8272\u7740\u8272\u3002 */
		var CHECKBOX = {
		  width: '18px',
		  height: '18px',
		  margin: '0',
		  cursor: 'pointer',
		  accentColor: T.accent,
		}

		/** \u6863\u6848\u5217\u8868\u91cc\u7684\u4e00\u884c\u3002 */
		var PROFILE_ROW = {
		  display: 'flex',
		  alignItems: 'center',
		  gap: '8px',
		  padding: '7px 10px',
		  borderRadius: '6px',
		  border: '1px solid ' + T.borderSoft,
		  marginBottom: '6px',
		  background: 'var(--dsw-alias-bg-layer-1, transparent)',
		}

		/** \u6863\u6848\u884c\u91cc\u7684\u5c0f\u6309\u94ae\uff1a\u4e00\u884c\u6324\u4e86\u56db\u4e2a\u52a8\u4f5c\uff0c\u7528\u4e0d\u7740\u4e3b\u6309\u94ae\u7684\u4f53\u578b\u3002 */
		var MINI_BUTTON = {
		  flex: 'none',
		  padding: '3px 8px',
		  borderRadius: '5px',
		  border: '1px solid ' + T.border,
		  background: 'transparent',
		  color: T.textDim,
		  font: 'inherit',
		  fontSize: '11px',
		  cursor: 'pointer',
		}

		/** \u6863\u6848\u540d\u4e0b\u9762\u90a3\u884c\u7b49\u5bbd\u5c0f\u5b57\uff08\u97f3\u8272 ID + \u6a21\u578b\uff09\u3002 */
		var PROFILE_META = {
		  fontSize: '11px',
		  lineHeight: '16px',
		  color: T.textFaint,
		  fontFamily: 'monospace',
		  overflow: 'hidden',
		  textOverflow: 'ellipsis',
		  whiteSpace: 'nowrap',
		}

		/**
		 * \u8ba2\u9605\u4e00\u4e2a\u914d\u7f6e\u955c\u50cf\u3002
		 * @param form - `configForms` \u7ed9\u51fa\u7684\u8868\u5355\u63a7\u5236\u5668\u3002
		 * @returns `[\u5feb\u7167, \u5199\u5b57\u6bb5]`\u3002
		 */
		function useConfigForm(form) {
		  var pair = React.useState(function () { return form.getSnapshot() })
		  var snapshot = pair[0]
		  var setSnapshot = pair[1]
		  React.useEffect(function () {
		    setSnapshot(form.getSnapshot())
		    return form.subscribe(function () { setSnapshot(form.getSnapshot()) })
		  }, [form])
		  const write = React.useCallback(function (field, value) {
		    form.set(field, value).catch(function () {})
		  }, [form])
		  return [snapshot, write]
		}

		/**
		 * \u8bed\u97f3\u8bbe\u7f6e\u9875\u3002
		 * @param props - `t`\uff08\u672c\u63d2\u4ef6\u5b57\u5178\uff09\u3001`close`\uff08\u5bbf\u4e3b\u7ed9\u7684\u5173\u95ed\u52a8\u4f5c\uff09\u4e0e\u6ce8\u5165\u7684\u8868\u5355\u3002
		 * @returns \u9875\u9762\u5185\u5bb9\u3002
		 */
		function CosyvoiceSettingsPage(props) {
		  var t = props.t
		  var form = props.form

		  var pair = useConfigForm(form)
		  var snapshot = pair[0]
		  var write = pair[1]

		  var value = (snapshot && snapshot.value) || {}
		  var hasSecret = !!(snapshot && snapshot.user && typeof snapshot.user === 'object' && 'apiKey' in snapshot.user)

		  var statusState = React.useState(null)
		  var status = statusState[0]
		  var setStatus = statusState[1]

		  var countState = React.useState(null)
		  var count = countState[0]
		  var setCount = countState[1]

		  // \u6863\u6848\u6e05\u5355**\u4e0d**\u8d70 configForms\uff1a\u5b83\u662f\u63d2\u4ef6\u81ea\u7ba1\u7684\u4e00\u4e2a JSON\uff08\u89c1 host/profiles.js\uff09\uff0c
		  // \u914d\u7f6e\u955c\u50cf\u91cc\u6ca1\u6709\u5b83\u3002\u4e8e\u662f\u8fd9\u91cc\u81ea\u5df1\u62c9\u3001\u81ea\u5df1\u5b58\uff0c\u5199\u64cd\u4f5c\u56de\u5305\u91cc\u5e26\u4e00\u4efd\u65b0\u6e05\u5355\uff0c
		  // \u7701\u6389\u4e00\u6b21\u5f80\u8fd4\u4e5f\u8ba9\u5217\u8868\u548c"\u5f53\u524d\u97f3\u8272"\u6c38\u8fdc\u540c\u4e00\u62cd\u3002
		  var profilesState = React.useState(null)
		  var profileData = profilesState[0]
		  var setProfileData = profilesState[1]

		  /** \u6b63\u5728\u7f16\u8f91\u7684\u8349\u7a3f\uff1b`editId` \u4e3a\u7a7a\u8868\u793a"\u65b0\u589e"\u800c\u4e0d\u662f"\u6539\u8fd9\u4e00\u5957"\u3002 */
		  var draftState = React.useState({ name: '', voiceId: '', model: '' })
		  var draft = draftState[0]
		  var setDraft = draftState[1]

		  var editIdState = React.useState('')
		  var editId = editIdState[0]
		  var setEditId = editIdState[1]

		  /** \u5f85\u4e0a\u4f20\u7684\u97f3\u9891\u6587\u4ef6\u3002 */
		  var fileState = React.useState(null)
		  var file = fileState[0]
		  var setFile = fileState[1]

		  /** \u514b\u9686/\u540c\u6b65\u8fd9\u5757\u7684\u8fdb\u5ea6\u63d0\u793a\uff1b\u4e0e\u9875\u9762\u5e95\u90e8\u7684 status \u5206\u5f00\uff0c\u56e0\u4e3a\u5b83\u4fe1\u606f\u91cf\u66f4\u5927\u3002 */
		  var cloneState = React.useState(null)
		  var cloneNote = cloneState[0]
		  var setCloneNote = cloneState[1]

		  /** \u8f6e\u8be2\u4e00\u4e2a\u6b63\u5728\u90e8\u7f72\u7684\u97f3\u8272\u3002 */
		  function pollClone(id) {
		    var tries = 0
		    setCloneNote({ kind: 'busy', message: t('clone.pending') })
		    // \u5ba2\u6237\u7aef\u8f6e\u8be2\u800c\u4e0d\u662f\u670d\u52a1\u7aef\u6302\u957f\u8bf7\u6c42\uff1a\u5173\u6389\u9875\u9762\u5c31\u4e0d\u4f1a\u7559\u4e0b orphan \u8f6e\u8be2\u3002
		    function tick() {
		      tries += 1
		      rpc('clone/status?id=' + encodeURIComponent(id)).then(function (res) {
		        if (res === undefined || !res.ok) {
		          setCloneNote({ kind: 'error', message: (res && res.message) || t('clone.failed') })
		          return
		        }
		        setProfileData({ profiles: res.profiles || [], activeId: res.activeId || '' })
		        if (res.phase === 'ready') {
		          setCloneNote({ kind: 'ok', message: t('clone.ready') })
		          return
		        }
		        if (res.phase === 'failed') {
		          setCloneNote({ kind: 'error', message: t('clone.failed') })
		          return
		        }
		        // \u90e8\u7f72\u901a\u5e38\u51e0\u79d2\u5230\u51e0\u5206\u949f\uff0c\u4e24\u5206\u949f\u8db3\u591f\uff1b\u8d85\u65f6\u4e0d\u5224\u5931\u8d25\uff0c\u5217\u8868\u91cc\u7684\u72b6\u6001\u4ecd\u5728\u3002
		        if (tries >= 40) {
		          setCloneNote({ kind: 'error', message: t('clone.timeout') })
		          return
		        }
		        setTimeout(tick, 3000)
		      })
		    }
		    setTimeout(tick, 1500)
		  }

		  /** \u4e0a\u4f20\u97f3\u9891\u5e76\u590d\u523b\u3002 */
		  function startClone() {
		    if (file === null || file === undefined) {
		      setCloneNote({ kind: 'error', message: t('clone.noFile') })
		      return
		    }
		    setCloneNote({ kind: 'busy', message: t('clone.uploading') })
		    var raw = file.name || 'voice.wav'
		    file.arrayBuffer().then(function (buffer) {
		      return rpcBytes('clone',
		        'name=' + encodeURIComponent(raw.replace(/\.[^.]+$/, '')) + '&filename=' + encodeURIComponent(raw),
		        buffer)
		    }).then(function (res) {
		      if (res === undefined || !res.ok) {
		        setCloneNote({ kind: 'error', message: (res && res.message) || t('clone.failed') })
		        return
		      }
		      setProfileData({ profiles: res.profiles || [], activeId: res.activeId || '' })
		      pollClone(res.profile.id)
		    })
		  }

		  /** \u628a\u4e91\u7aef\u5df2\u6709\u7684\u97f3\u8272\u62c9\u8fdb\u6863\u6848\u3002 */
		  function syncCloud() {
		    setCloneNote({ kind: 'busy', message: t('clone.syncing') })
		    rpc('cloud-voices/import', {}).then(function (res) {
		      if (res === undefined || !res.ok) {
		        setCloneNote({ kind: 'error', message: (res && res.message) || t('error.generic') })
		        return
		      }
		      setProfileData({ profiles: res.profiles || [], activeId: res.activeId || '' })
		      setCloneNote({
		        kind: 'ok',
		        message: res.added > 0 ? t('clone.synced') + '\uff1a' + String(res.added) : t('clone.syncedNone'),
		      })
		    })
		  }

		  // "\u80fd\u7528"\u7684\u5224\u5b9a\u8981\u7b97\u4e0a\u6863\u6848\uff1a\u4e00\u5957\u6863\u6848\u542f\u7528\u7740\u4f46\u6ca1\u6709\u9ed8\u8ba4\u97f3\u8272 ID \u65f6\uff0c\u7167\u6837\u53ef\u4ee5\u6717\u8bfb\u3002
		  // \u8fd9\u4e00\u884c\u653e\u5728 profileData \u4e4b\u540e\uff0c\u662f\u56e0\u4e3a\u5b83\u8fd8\u662f undefined \u65f6 `!= null` \u4f1a\u8bef\u5224\u6210 true\u3002
		  var hasVoice = String(value.voiceId || '') !== '' || (profileData !== null && profileData.activeId !== '')
		  var configured = (hasSecret || String(value.apiKey || '') !== '') && hasVoice

		  /** \u6e05\u7a7a\u8349\u7a3f\u3002 */
		  function resetDraft() {
		    setDraft({ name: '', voiceId: '', model: '' })
		    setEditId('')
		  }

		  /** \u62c9\u53d6\u6863\u6848\u6e05\u5355\u3002 */
		  function refreshProfiles() {
		    rpc('profiles').then(function (res) {
		      if (res === undefined || !res.ok) return
		      setProfileData({ profiles: res.profiles || [], activeId: res.activeId || '' })
		    })
		  }

		  React.useEffect(function () { refreshProfiles() }, [])

		  /** \u542f\u7528\u4e00\u5957\u6863\u6848\u3002 */
		  function useProfile(id) {
		    rpc('profiles/activate', { id: id }).then(function (res) {
		      if (res === undefined || !res.ok) {
		        setStatus({ kind: 'error', message: (res && res.message) || t('error.generic') })
		        return
		      }
		      setProfileData({ profiles: res.profiles || [], activeId: res.activeId || '' })
		      setStatus({ kind: 'ok', message: t('settings.saved') })
		    })
		  }

		  /** \u5220\u9664\u4e00\u5957\u6863\u6848\u3002 */
		  function removeProfile(id) {
		    rpc('profiles', { id: id }, 'DELETE').then(function (res) {
		      if (res === undefined || !res.ok) {
		        setStatus({ kind: 'error', message: (res && res.message) || t('error.generic') })
		        return
		      }
		      setProfileData({ profiles: res.profiles || [], activeId: res.activeId || '' })
		      if (editId === id) resetDraft()
		      setStatus({ kind: 'ok', message: t('settings.saved') })
		    })
		  }

		  /** \u4fdd\u5b58\u8349\u7a3f\uff1a\u6709 editId \u662f\u66f4\u65b0\uff0c\u6ca1\u6709\u662f\u65b0\u589e\u3002 */
		  function saveProfile() {
		    var voiceId = String(draft.voiceId || '').trim()
		    if (voiceId === '') {
		      setStatus({ kind: 'error', message: t('profiles.needVoice') })
		      return
		    }
		    rpc('profiles', {
		      id: editId,
		      name: String(draft.name || '').trim(),
		      voiceId: voiceId,
		      model: String(draft.model || '').trim(),
		    }).then(function (res) {
		      if (res === undefined || !res.ok) {
		        setStatus({ kind: 'error', message: (res && res.message) || t('error.generic') })
		        return
		      }
		      setProfileData({ profiles: res.profiles || [], activeId: res.activeId || '' })
		      resetDraft()
		      setStatus({ kind: 'ok', message: t('settings.saved') })
		    })
		  }

		  React.useEffect(function () {
		    rpc('status').then(function (res) {
		      if (res === undefined || !res.ok) return
		      setCount({ count: res.count, dir: res.dir, configured: res.configured })
		    })
		  }, [snapshot])

		  /**
		   * \u8bd5\u542c\uff1a\u8d70\u4e00\u6b21\u771f\u5b9e\u5408\u6210\uff0c\u6240\u4ee5\u80fd\u4e00\u6b21\u6027\u9a8c\u51fa Key\u3001\u6a21\u578b\u4e0e\u97f3\u8272\u662f\u5426\u5339\u914d\u3002
		   */
		  function preview() {
		    setStatus(null)
		    player.loading('__preview__')
		    rpc('speak', { text: t('settings.previewText') }).then(function (res) {
		      if (res === undefined || !res.ok) {
		        player.stop()
		        setStatus({ kind: 'error', message: (res && res.message) || t('error.generic') })
		        return
		      }
		      if (!Array.isArray(res.segments) || res.segments.length === 0 || !res.segments[0].url) {
		        player.stop()
		        setStatus({ kind: 'error', message: t('error.generic') })
		        return
		      }
		      setStatus({ kind: 'ok', message: t('settings.saved') })
		      player.startQueue('__preview__', res)
		    })
		  }

		  /**
		   * \u5728\u7cfb\u7edf\u6587\u4ef6\u7ba1\u7406\u5668\u91cc\u6253\u5f00\u8f93\u51fa\u76ee\u5f55\u3002
		   */
		  function openDir() {
		    rpc('open').then(function (res) {
		      if (res === undefined || !res.ok) setStatus({ kind: 'error', message: (res && res.message) || '' })
		    })
		  }

		  /**
		   * \u6e05\u7a7a\u97f3\u9891\u7f13\u5b58\u3002
		   */
		  function clearCache() {
		    rpc('clear').then(function (res) {
		      if (res === undefined || !res.ok) return
		      setCount({ count: 0, dir: count === null ? '' : count.dir, configured: count === null ? false : count.configured })
		      setStatus({ kind: 'ok', message: t('settings.cleared') })
		    })
		  }

		  function row(labelKey, hint, body) {
		    return React.createElement('div', null,
		      React.createElement('div', { style: ROW },
		        React.createElement('div', { style: ROW_LABEL }, t(labelKey)),
		        React.createElement('div', { style: ROW_BODY }, body)),
		      hint === undefined ? null : React.createElement('div', { style: HINT }, hint))
		  }

		  /**
		   * \u8349\u7a3f\u91cc\u7684\u4e00\u4e2a\u8f93\u5165\u6846\u3002
		   * @param key - `name` / `voiceId` / `model`\u3002
		   * @param placeholderKey - \u5360\u4f4d\u6587\u6848\u7684\u5b57\u5178\u952e\u3002
		   * @returns \u53d7\u63a7\u8f93\u5165\u6846\u3002
		   */
		  function draftField(key, placeholderKey) {
		    return React.createElement('input', {
		      key: key,
		      type: 'text',
		      value: draft[key] === undefined ? '' : draft[key],
		      placeholder: t(placeholderKey),
		      style: INPUT,
		      onChange: function (event) {
		        var next = { name: draft.name, voiceId: draft.voiceId, model: draft.model }
		        next[key] = event.target.value
		        setDraft(next)
		      },
		    })
		  }

		  /**
		   * \u4e00\u6761\u6863\u6848\u3002\u70b9"\u7f16\u8f91"\u628a\u5b83\u88c5\u8fdb\u8349\u7a3f\uff0c\u4e8e\u662f\u65b0\u589e\u548c\u7f16\u8f91\u5171\u7528\u540c\u4e00\u7ec4\u8f93\u5165\u6846\u3002
		   * @param profile - \u6863\u6848\u3002
		   * @returns \u4e00\u884c\u3002
		   */
		  function profileRow(profile) {
		    var isActive = profileData !== null && profile.id === profileData.activeId
		    return React.createElement('div', { key: profile.id, style: PROFILE_ROW },
		      React.createElement('span', {
		        style: {
		          flex: 'none',
		          width: '8px',
		          height: '8px',
		          borderRadius: '50%',
		          background: isActive ? T.accent : 'transparent',
		          border: '1px solid ' + T.border,
		        },
		      }),
		      React.createElement('div', { style: { flex: '1', minWidth: '0' } },
		        React.createElement('div', { style: { fontSize: '13px', lineHeight: '18px', color: T.text } },
		          profile.name === '' ? profile.voiceId : profile.name),
		        React.createElement('div', { style: PROFILE_META },
		          profile.voiceId + (profile.model === '' ? '' : ' \u00b7 ' + profile.model))),
		      // \u514b\u9686\u6765\u7684\u97f3\u8272\u5728\u90e8\u7f72\u597d\u4e4b\u524d\u4e0d\u80fd\u7528\uff0c\u6240\u4ee5\u72b6\u6001\u8981\u6446\u5728\u884c\u4e0a\uff0c\u522b\u8ba9\u4eba\u70b9\u4e86\u624d\u53d1\u73b0\u95ee\u9898\u3002
		      profile.status === 'ready' || profile.status === undefined
		        ? null
		        : React.createElement('span', {
		          style: {
		            flex: 'none',
		            fontSize: '11px',
		            color: profile.status === 'failed' ? '#d93025' : T.textFaint,
		          },
		        }, profile.status === 'failed' ? t('profiles.failed') : t('profiles.pending')),
		      isActive
		        ? React.createElement('span', { style: { flex: 'none', fontSize: '11px', color: T.accent } }, t('profiles.current'))
		        : React.createElement('button', {
		          type: 'button',
		          style: MINI_BUTTON,
		          onClick: function () { useProfile(profile.id) },
		        }, t('profiles.use')),
		      React.createElement('button', {
		        type: 'button',
		        style: MINI_BUTTON,
		        onClick: function () {
		          setEditId(profile.id)
		          setDraft({ name: profile.name || '', voiceId: profile.voiceId || '', model: profile.model || '' })
		        },
		      }, t('profiles.edit')),
		      React.createElement('button', {
		        type: 'button',
		        style: MINI_BUTTON,
		        onClick: function () { removeProfile(profile.id) },
		      }, t('profiles.delete')))
		  }

		  var profilesBlock = React.createElement('div', { style: { padding: '10px 0 4px' } },
		    React.createElement('div', { style: { fontSize: '13px', lineHeight: '20px', color: T.text } }, t('profiles.title')),
		    React.createElement('div', { style: HINT }, t('profiles.hint')),
		    profileData === null || profileData.profiles.length === 0
		      ? React.createElement('div', { style: HINT }, t('profiles.empty'))
		      : React.createElement('div', null, profileData.profiles.map(profileRow)),
		    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
		      draftField('name', 'profiles.namePlaceholder'),
		      draftField('voiceId', 'profiles.voicePlaceholder'),
		      draftField('model', 'profiles.modelPlaceholder'),
		      React.createElement('button', {
		        type: 'button',
		        style: BUTTON,
		        onClick: saveProfile,
		      }, editId === '' ? t('profiles.add') : t('profiles.save')),
		      editId === ''
		        ? null
		        : React.createElement('button', { type: 'button', style: BUTTON, onClick: resetDraft }, t('profiles.cancel'))),
		    React.createElement('div', { style: { fontSize: '13px', lineHeight: '20px', color: T.text, padding: '6px 0 0' } }, t('clone.title')),
		    React.createElement('div', { style: HINT }, t('clone.hint')),
		    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' } },
		      React.createElement('input', {
		        type: 'file',
		        accept: 'audio/*',
		        style: { flex: 'none', fontSize: '12px', color: T.textDim, maxWidth: '220px' },
		        onChange: function (event) {
		          var picked = event.target.files === null || event.target.files === undefined ? null : event.target.files[0]
		          setFile(picked === undefined ? null : picked)
		        },
		      }),
		      React.createElement('button', { type: 'button', style: BUTTON, onClick: startClone }, t('clone.start')),
		      React.createElement('button', { type: 'button', style: BUTTON, onClick: syncCloud }, t('clone.sync')),
		      cloneNote === null
		        ? null
		        : React.createElement('span', {
		          style: {
		            fontSize: '12px',
		            color: cloneNote.kind === 'error' ? '#d93025' : cloneNote.kind === 'ok' ? T.accent : T.textFaint,
		          },
		        }, cloneNote.message)))

		  return React.createElement('div', { style: { display: 'block' } },
		    React.createElement('div', { style: { fontSize: '16px', lineHeight: '24px', color: T.text, padding: '4px 0 2px' } }, t('settings.title')),
		    React.createElement('div', { style: HINT }, t('settings.hint')),
		    row('settings.key', undefined, [
		      // \u5bc6\u7801\u6846\uff0c\u4e14**\u975e\u53d7\u63a7**\uff1a\u672c\u9875\u6c38\u8fdc\u8bfb\u4e0d\u5230\u660e\u6587\uff08\u5bc6\u94a5\u5728\u901a\u9053\u4e0a\u88ab\u8131\u654f\uff09\uff0c\u6240\u4ee5\u4e00\u4e2a
		      // \u53d7\u63a7\u8f93\u5165\u6846\u4f1a\u5728\u6bcf\u6b21\u6309\u952e\u540e\u628a\u81ea\u5df1\u6e05\u7a7a\u3002\u5931\u7126\u5373\u5199\u5165\uff0c\u5199\u5b8c\u628a\u6846\u6e05\u6389 \u2014\u2014 \u56de\u586b\u4e00\u4e2a
		      // \u63a9\u7801\u6ca1\u6709\u4efb\u4f55\u4fe1\u606f\u91cf\u3002
		      React.createElement('input', {
		        key: 'key',
		        type: 'password',
		        defaultValue: '',
		        placeholder: hasSecret ? '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\uff08\u5df2\u4fdd\u5b58\uff0c\u91cd\u65b0\u8f93\u5165\u5373\u8986\u76d6\uff09' : t('settings.keyPlaceholder'),
		        style: INPUT,
		        onBlur: function (event) {
		          const entered = event.target.value
		          if (entered === '') return
		          event.target.value = ''
		          write('apiKey', entered)
		        },
		      }),
		    ]),
		    profilesBlock,
		    // \u5176\u4f59\u5b57\u6bb5\u540c\u6837\u662f"\u5931\u7126\u5373\u5199\u5165"\uff1a\u6bcf\u6572\u4e00\u4e2a\u5b57\u7b26\u90fd\u53d1\u4e00\u6b21\u5199\u8bf7\u6c42\u4f1a\u628a revision \u7528\u5149\uff0c
		    // \u800c\u4e14\u4e2d\u95f4\u6001\uff08\u534a\u4e2a Key\uff09\u672c\u8eab\u4e5f\u4e0d\u662f\u4e00\u4e2a\u5408\u6cd5\u914d\u7f6e\u3002
		    row('settings.voice', t('settings.voiceHint'), [
		      React.createElement('input', {
		        key: 'voice',
		        type: 'text',
		        defaultValue: String(value.voiceId || ''),
		        placeholder: t('settings.voicePlaceholder'),
		        style: INPUT,
		        onBlur: function (event) { write('voiceId', event.target.value) },
		      }),
		    ]),
		    row('settings.model', t('settings.modelHint'), [
		      React.createElement('input', {
		        key: 'model',
		        type: 'text',
		        defaultValue: String(value.model || ''),
		        placeholder: 'cosyvoice-v3.5-plus',
		        style: INPUT,
		        onBlur: function (event) { write('model', event.target.value) },
		      }),
		    ]),
		    row('settings.dir', undefined, [
		      React.createElement('input', {
		        key: 'dir',
		        type: 'text',
		        defaultValue: String(value.outputDir || ''),
		        placeholder: t('settings.dirPlaceholder'),
		        style: INPUT,
		        onBlur: function (event) { write('outputDir', event.target.value) },
		      }),
		      React.createElement('button', { key: 'open', type: 'button', style: BUTTON, onClick: openDir }, t('settings.open')),
		    ]),
		    row('settings.boot', undefined, [
		      React.createElement('input', {
		        key: 'boot',
		        type: 'checkbox',
		        checked: value.bootSound !== false,
		        style: CHECKBOX,
		        onChange: function (event) { write('bootSound', event.target.checked) },
		      }),
		    ]),
		    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 0' } },
		      React.createElement('button', { type: 'button', style: BUTTON, onClick: preview }, t('settings.preview')),
		      React.createElement('button', { type: 'button', style: BUTTON, onClick: clearCache }, t('settings.clear')),
		      count === null
		        ? null
		        : React.createElement('span', { style: { fontSize: '12px', color: T.textFaint } },
		          t('settings.count') + '\uff1a' + String(count.count)),
		      status === null
		        ? null
		        : React.createElement('span', {
		          style: { fontSize: '12px', color: status.kind === 'error' ? '#d93025' : T.textFaint },
		        }, status.message)),
		    React.createElement('div', {
		      style: { fontSize: '12px', lineHeight: '18px', color: T.textFaint, padding: '2px 0 10px' },
		    }, configured ? t('settings.ready') : t('settings.unconfigured')))
		}

		// ---- client/index.js ----
		/**
		 * Bundle \u5165\u53e3\uff1a\u628a\u672c\u63d2\u4ef6\u7684\u5404\u6a21\u5757\u63a5\u8d77\u6765\u3002
		 *
		 * `apply` \u7edd\u4e0d\u80fd\u629b\u5f02\u5e38\u3002\u8fd9\u91cc\u6bcf\u4e2a\u6a21\u5757\u8d21\u732e\u7684\u662f UI\uff0c\u5176\u4e2d\u4e00\u4e2a\u5931\u8d25\u4e0d\u8be5\u628a\u6574\u9875\u62d6\u57ae\uff0c
		 * \u6240\u4ee5\u6bcf\u4e00\u9879\u90fd\u72ec\u7acb try/catch \u2014\u2014 \u4e00\u4e2a\u574f\u6389\u7684\u6a21\u5757\u6700\u574f\u7684\u7ed3\u679c\u662f"\u8fd9\u4e2a\u529f\u80fd\u6ca1\u51fa\u73b0"\uff0c
		 * \u800c\u4e0d\u662f"\u6574\u4e2a\u4f1a\u8bdd\u9762\u677f\u7a7a\u767d"\u3002
		 *
		 * \u4e09\u4ef6\u8d21\u732e\uff1a
		 *
		 * 1. **\u64ad\u653e\u952e**\uff08`conversation.chat.assistant-actions`\uff09\u2014\u2014 v1 \u7684\u5168\u90e8\u4ea4\u4e92\u9762\uff1b
		 * 2. **\u8bbe\u7f6e\u9875**\uff08`settings.section`\uff09\u2014\u2014 \u914d\u7f6e\u3001\u8bd5\u542c\u3001\u6253\u5f00\u76ee\u5f55\u3001\u6e05\u7a7a\u7f13\u5b58\uff1b
		 * 3. **\u5f00\u673a\u97f3** \u2014\u2014 \u9875\u9762\u9996\u6b21\u4ea4\u4e92\u65f6\u6309\u5f00\u5173\u64ad\u4e00\u6b21\u63d0\u793a\u97f3\u3002
		 */

		/** \u672c\u63d2\u4ef6\u62e5\u6709\u7684\u6587\u6848\u547d\u540d\u7a7a\u95f4\u3002 */
		var NS = 'cosyvoice'

		/** \u5fc5\u9700\u670d\u52a1\uff1aslot \u6ce8\u518c\u8868\u3001\u6587\u6848\u3001\u914d\u7f6e\u8868\u5355\u3002 */
		var inject = ['slots', 'locale', 'configForms']

		/**
		 * \u5728\u9875\u9762\u9996\u6b21\u771f\u5b9e\u4ea4\u4e92\u65f6\u64ad\u4e00\u6b21\u63d0\u793a\u97f3\u3002
		 *
		 * \u5fc5\u987b\u662f"\u9996\u6b21\u4ea4\u4e92\u65f6"\u800c\u4e0d\u662f"\u52a0\u8f7d\u5b8c\u6210\u65f6"\uff1a\u6d4f\u89c8\u5668\u7684\u81ea\u52a8\u64ad\u653e\u7b56\u7565\u4f1a\u62e6\u6389\u6ca1\u6709\u7528\u6237\u624b\u52bf
		 * \u7684\u64ad\u653e\uff0c\u800c\u4e00\u6b21\u88ab\u62d2\u7684 `play()` \u518d\u4e5f\u4e0d\u4f1a\u91cd\u6765 \u2014\u2014 \u6240\u4ee5\u8fd9\u91cc\u7b49\u5230\u7528\u6237\u771f\u7684\u78b0\u4e86\u9875\u9762\u3002
		 * @param form - `cosyvoice` \u914d\u7f6e\u8868\u5355\uff0c\u7528\u6765\u8bfb\u5f00\u5173\u3002
		 */
		function armBootSound(form) {
		  var played = false
		  /**
		   * \u4e00\u6b21\u6027\u64ad\u653e\u3002
		   *
		   * \u7528**\u81ea\u5df1\u7684** `Audio` \u800c\u4e0d\u662f\u5171\u4eab\u64ad\u653e\u5668\uff1a\u63d0\u793a\u97f3\u4e0d\u8be5\u62a2\u8d70\u7528\u6237\u6b63\u5728\u542c\u7684\u90a3\u6761\u56de\u7b54\uff0c
		   * \u4e5f\u4e0d\u8be5\u628a\u64ad\u653e\u5668\u7684\u72b6\u6001\u5360\u4f4f\u3002\u6587\u4ef6\u7f3a\u5931\u65f6\u53ea\u662f\u6ca1\u6709\u58f0\u97f3\uff0c\u4e0d\u62a5\u4efb\u4f55\u9519 \u2014\u2014 \u63d0\u793a\u97f3\u4ece\u6765
		   * \u4e0d\u662f\u5173\u952e\u529f\u80fd\u3002
		   */
		  function once() {
		    if (played) return
		    played = true
		    const snapshot = form.getSnapshot()
		    const value = snapshot && snapshot.value ? snapshot.value : {}
		    if (value.bootSound === false) return
		    try {
		      const audio = new Audio(ROUTE_PREFIX + '/boot')
		      audio.volume = 0.5
		      const started = audio.play()
		      if (started && typeof started.catch === 'function') started.catch(function () {})
		    } catch (error) {
		      // \u6ca1\u6709\u63d0\u793a\u97f3\u6587\u4ef6\u3001\u6216\u6d4f\u89c8\u5668\u4e0d\u7ed9\u64ad\uff1a\u9759\u9ed8\u8df3\u8fc7\u3002
		    }
		  }
		  if (typeof document === 'undefined') return
		  document.addEventListener('pointerdown', once, { once: true, passive: true })
		  document.addEventListener('keydown', once, { once: true })
		}

		/**
		 * \u63d2\u4ef6\u4e3b\u4f53\u3002
		 * @param ctx - \u5ba2\u6237\u7aef\u63d2\u4ef6 context\u3002
		 */
		function apply(ctx) {
		  ctx.effect(function () {
		    return ctx.locale.register(NS, { zh: DICT_ZH, en: DICT_EN })
		  }, 'dsh-cosyvoice: dictionaries')
		  const t = ctx.locale.bind(NS)

		  try {
		    ctx.slots.inject('conversation.chat.assistant-actions', function () {
		      return ctx.slots.register({
		        name: 'conversation.chat.assistant-actions',
		        id: 'cosyvoice',
		        order: 20,
		        locale: NS,
		        inject: function () { return {} },
		      }, CosyvoiceSpeakButton)
		    })
		  } catch (error) {
		    console.error('[dsh-cosyvoice] play button failed:', error)
		  }

		  try {
		    const form = ctx.configForms.get(SETTINGS_ENTRY)
		    ctx.slots.inject('settings.section', function () {
		      return ctx.slots.register({
		        name: 'settings.section',
		        id: 'cosyvoice',
		        order: 100,
		        locale: NS,
		        label: t('section.label'),
		        inject: function () { return { form: form } },
		      }, CosyvoiceSettingsPage)
		    })
		    armBootSound(form)
		  } catch (error) {
		    console.error('[dsh-cosyvoice] settings page failed:', error)
		  }
		}

		exports.apply = apply;
		exports.inject = inject;
		exports.CosyvoiceSettingsPage = CosyvoiceSettingsPage;
		exports.player = player;
		return module.exports;
	}
});
