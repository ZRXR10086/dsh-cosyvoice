/**
 * 本插件的文案字典。
 *
 * 两套字典的键集必须完全一致 —— `zh` 是键集的事实来源，`t()` 在缺键时回落到
 * 中文，所以英文漏一个键不会把界面变成空白，但 `verify.mjs` 会把它当作构建缺陷。
 */

/** 中文字典（键集的事实来源）。 */
var DICT_ZH = {
  'action.speak': '朗读这条回答',
  'action.retry': '重试',
  'action.stop': '停止播放',
  'action.speaking': '正在播放',
  'action.synthesizing': '正在合成',
  'error.missing': '没找到这条回答的文本',
  'error.generic': '语音合成失败',
  'section.label': '语音',
  'settings.title': '语音朗读',
  'settings.hint': '每条 AI 回答末尾会出现一个播放键，点击即用阿里云百炼 CosyVoice 音色朗读。',
  'settings.key': 'API Key',
  'settings.keyPlaceholder': 'sk-...（阿里云百炼控制台获取）',
  'settings.model': '合成模型',
  'settings.modelHint': '必须与注册音色时使用的模型一致，否则百炼会直接拒绝请求。',
  'settings.voice': '音色 ID',
  'settings.voicePlaceholder': '百炼控制台里复刻/设计的音色 ID',
  'settings.dir': '输出目录',
  'settings.dirPlaceholder': '留空则使用插件默认目录',
  'settings.boot': '打开页面后播放一次提示音',
  'settings.preview': '试听',
  'settings.previewText': '这是一次语音试听，音色与模型配置正确就能听到这句话。',
  'settings.open': '打开目录',
  'settings.clear': '清空缓存',
  'settings.cleared': '已清空',
  'settings.count': '当前缓存',
  'settings.unconfigured': '尚未配置 API Key 或音色 ID，播放键会提示配置。',
  'settings.ready': '已配置，可以开始朗读。',
  'settings.saved': '已保存',
}

/** 英文字典，键集对着 zh 校核。 */
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
