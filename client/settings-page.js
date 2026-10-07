/**
 * 设置页：挂在 `settings.section` 上，提供一个「语音」分区。
 *
 * 页面自己画表单而不是依赖自动生成的那一套，因为这里有三件自动表单做不到的事：
 * **试听**（要走一次真实合成）、**打开输出目录**、**清空缓存**。前两项是宿主路由
 * 上的副作用，不是字段写入。
 *
 * 字段读写走 `ctx.configForms`：它按 entry id 拿到本插件的配置镜像，写入是「按路径
 * 的增量编辑」，所以本页永远拿不到被脱敏的 API Key 明文，也就不会在提交时把它
 * 抹掉 —— 一个只读到掩码的页面若整份回写，会静默删掉用户存好的 Key。
 */

/** 一行设置：标签列 + 内容列。 */
var ROW = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '14px 0',
  borderBottom: '1px solid ' + T.borderSoft,
}

/** 标签列。 */
var ROW_LABEL = {
  flex: 'none',
  width: '96px',
  fontSize: '13px',
  lineHeight: '20px',
  color: T.textDim,
}

/** 内容列。 */
var ROW_BODY = {
  flex: '1',
  minWidth: '0',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}

/** 文本输入框，对齐宿主自己的行样式。 */
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

/** 次级按钮。 */
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

/** 行下方的说明文字。 */
var HINT = {
  fontSize: '12px',
  lineHeight: '18px',
  color: T.textFaint,
  padding: '2px 0 10px',
}

/** 原生复选框，用品牌色着色。 */
var CHECKBOX = {
  width: '18px',
  height: '18px',
  margin: '0',
  cursor: 'pointer',
  accentColor: T.accent,
}

/**
 * 订阅一个配置镜像。
 * @param form - `configForms` 给出的表单控制器。
 * @returns `[快照, 写字段]`。
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
 * 语音设置页。
 * @param props - `t`（本插件字典）、`close`（宿主给的关闭动作）与注入的表单。
 * @returns 页面内容。
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
   * 试听：走一次真实合成，所以能一次性验出 Key、模型与音色是否匹配。
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
   * 在系统文件管理器里打开输出目录。
   */
  function openDir() {
    rpc('open').then(function (res) {
      if (res === undefined || !res.ok) setStatus({ kind: 'error', message: (res && res.message) || '' })
    })
  }

  /**
   * 清空音频缓存。
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
      // 密码框，且**非受控**：本页永远读不到明文（密钥在通道上被脱敏），所以一个
      // 受控输入框会在每次按键后把自己清空。失焦即写入，写完把框清掉 —— 回填一个
      // 掩码没有任何信息量。
      React.createElement('input', {
        key: 'key',
        type: 'password',
        defaultValue: '',
        placeholder: hasSecret ? '••••••••（已保存，重新输入即覆盖）' : t('settings.keyPlaceholder'),
        style: INPUT,
        onBlur: function (event) {
          const entered = event.target.value
          if (entered === '') return
          event.target.value = ''
          write('apiKey', entered)
        },
      }),
    ]),
    // 其余字段同样是"失焦即写入"：每敲一个字符都发一次写请求会把 revision 用光，
    // 而且中间态（半个 Key）本身也不是一个合法配置。
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
          t('settings.count') + '：' + String(count.count)),
      status === null
        ? null
        : React.createElement('span', {
          style: { fontSize: '12px', color: status.kind === 'error' ? '#d93025' : T.textFaint },
        }, status.message)),
    React.createElement('div', {
      style: { fontSize: '12px', lineHeight: '18px', color: T.textFaint, padding: '2px 0 10px' },
    }, configured ? t('settings.ready') : t('settings.unconfigured')))
}
