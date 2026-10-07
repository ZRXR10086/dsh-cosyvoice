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
		 * @param body - POST \u7684 JSON body\uff1b\u7701\u7565\u5373 GET\u3002
		 * @returns \u89e3\u6790\u540e\u7684\u54cd\u5e94\uff0c\u6216\u5931\u8d25\u4fe1\u5c01\u3002
		 */
		async function rpc(action, body) {
		  try {
		    const response = await fetch(ROUTE_PREFIX + '/' + action, body === undefined
		      ? { method: 'GET' }
		      : {
		          method: 'POST',
		          headers: { 'content-type': 'application/json' },
		          body: JSON.stringify(body),
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

		  return {
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
		    /** \u505c\u6b62\u64ad\u653e\u3002 */
		    stop: function () {
		      const audio = element()
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
		  'settings.modelHint': '\u5fc5\u987b\u4e0e\u6ce8\u518c\u97f3\u8272\u65f6\u4f7f\u7528\u7684\u6a21\u578b\u4e00\u81f4\uff0c\u5426\u5219\u767e\u70bc\u4f1a\u76f4\u63a5\u62d2\u7edd\u8bf7\u6c42\u3002',
		  'settings.voice': '\u97f3\u8272 ID',
		  'settings.voicePlaceholder': '\u767e\u70bc\u63a7\u5236\u53f0\u91cc\u590d\u523b/\u8bbe\u8ba1\u7684\u97f3\u8272 ID',
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
		  'settings.modelHint': 'Must match the model used when registering the voice, or DashScope rejects the request.',
		  'settings.voice': 'Voice ID',
		  'settings.voicePlaceholder': 'Cloned or designed voice ID from the console',
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
		  return React.createElement('svg', ICON,
		    React.createElement('path', { d: 'M12 3a9 9 0 1 0 9 9', opacity: '0.85' }),
		    React.createElement('animateTransform', {
		      attributeName: 'transform',
		      type: 'rotate',
		      from: '0 12 12',
		      to: '360 12 12',
		      dur: '0.9s',
		      repeatCount: 'indefinite',
		    }))
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
		      if (res.clip === null || res.clip === undefined || !res.clip.url) {
		        player.fail(messageId, t('error.generic'))
		        return
		      }
		      player.play(messageId, res.clip.url)
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
		  var configured = (hasSecret || String(value.apiKey || '') !== '') && String(value.voiceId || '') !== ''

		  var statusState = React.useState(null)
		  var status = statusState[0]
		  var setStatus = statusState[1]

		  var countState = React.useState(null)
		  var count = countState[0]
		  var setCount = countState[1]

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
		      if (res.clip === null || res.clip === undefined) {
		        player.stop()
		        setStatus({ kind: 'error', message: t('error.generic') })
		        return
		      }
		      setStatus({ kind: 'ok', message: t('settings.saved') })
		      player.play('__preview__', res.clip.url)
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
		    // \u5176\u4f59\u5b57\u6bb5\u540c\u6837\u662f"\u5931\u7126\u5373\u5199\u5165"\uff1a\u6bcf\u6572\u4e00\u4e2a\u5b57\u7b26\u90fd\u53d1\u4e00\u6b21\u5199\u8bf7\u6c42\u4f1a\u628a revision \u7528\u5149\uff0c
		    // \u800c\u4e14\u4e2d\u95f4\u6001\uff08\u534a\u4e2a Key\uff09\u672c\u8eab\u4e5f\u4e0d\u662f\u4e00\u4e2a\u5408\u6cd5\u914d\u7f6e\u3002
		    row('settings.voice', undefined, [
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
		return module.exports;
	}
});
