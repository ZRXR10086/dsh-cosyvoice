/**
 * Bundle 入口：把本插件的各模块接起来。
 *
 * `apply` 绝不能抛异常。这里每个模块贡献的是 UI，其中一个失败不该把整页拖垮，
 * 所以每一项都独立 try/catch —— 一个坏掉的模块最坏的结果是"这个功能没出现"，
 * 而不是"整个会话面板空白"。
 *
 * 三件贡献：
 *
 * 1. **播放键**（`conversation.chat.assistant-actions`）—— v1 的全部交互面；
 * 2. **设置页**（`settings.section`）—— 配置、试听、打开目录、清空缓存；
 * 3. **开机音** —— 页面首次交互时按开关播一次提示音。
 */

/** 本插件拥有的文案命名空间。 */
var NS = 'cosyvoice'

/** 必需服务：slot 注册表、文案、配置表单。 */
var inject = ['slots', 'locale', 'configForms']

/**
 * 在页面首次真实交互时播一次提示音。
 *
 * 必须是"首次交互时"而不是"加载完成时"：浏览器的自动播放策略会拦掉没有用户手势
 * 的播放，而一次被拒的 `play()` 再也不会重来 —— 所以这里等到用户真的碰了页面。
 * @param form - `cosyvoice` 配置表单，用来读开关。
 */
function armBootSound(form) {
  var played = false
  /**
   * 一次性播放。
   *
   * 用**自己的** `Audio` 而不是共享播放器：提示音不该抢走用户正在听的那条回答，
   * 也不该把播放器的状态占住。文件缺失时只是没有声音，不报任何错 —— 提示音从来
   * 不是关键功能。
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
      // 没有提示音文件、或浏览器不给播：静默跳过。
    }
  }
  if (typeof document === 'undefined') return
  document.addEventListener('pointerdown', once, { once: true, passive: true })
  document.addEventListener('keydown', once, { once: true })
}

/**
 * 插件主体。
 * @param ctx - 客户端插件 context。
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
