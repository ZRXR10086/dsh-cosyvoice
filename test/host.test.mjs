/**
 * 宿主端单测。
 *
 * 全部用例都不碰网络：`SpeechClient` 接收注入的 fetch，于是"合成成功""HTTP 418"
 * "连接失败"都是可复现的本地状态。缓存用例则落在一个临时目录里，跑完即删。
 *
 * 运行：`node --test test/`
 * @module dsh-cosyvoice/test
 */

import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { beforeEach, describe, it } from 'node:test'

import {
  DEFAULT_ENDPOINT,
  MAX_TEXT_CHARS,
  SpeechClient,
  describeFailure,
  normalizeText,
} from '../host/speech.js'
import { AudioStore, cacheKeyOf } from '../host/store.js'
import { VoiceSynthesizer } from '../host/synth.js'
import { MessageTextResolver } from '../host/texts.js'

/** 一段"像百炼回的那种"合成响应：内层给 base64 音频。 */
function okResponse(audioBase64, characters = 12) {
  return {
    ok: true,
    status: 200,
    text: async () => JSON.stringify({
      output: { audio: { data: audioBase64 } },
      usage: { characters },
    }),
  }
}

/** 把注入的 fetch 收到的请求记下来，便于断言请求体。 */
function recordingFetch(handler) {
  const calls = []
  const impl = async (url, init) => {
    calls.push({ url, init })
    return handler(url, init)
  }
  return { impl, calls }
}

describe('normalizeText', () => {
  it('剥掉 Markdown 标记但保留可读内容', () => {
    const cleaned = normalizeText('# 标题\n\n这是 **重点** 与 `code`，见 [链接](https://example.com/x)。')
    assert.equal(cleaned, '标题\n\n这是 重点 与 code，见 链接。')
  })

  it('整块去掉代码块与图片', () => {
    const cleaned = normalizeText('看图：![a](b.png)\n\n```js\nconst a = 1\n```\n结束')
    assert.equal(cleaned, '看图：\n\n结束')
  })

  it('超长文本按上限截断', () => {
    const cleaned = normalizeText('あ'.repeat(MAX_TEXT_CHARS + 500))
    assert.equal(cleaned.length, MAX_TEXT_CHARS)
  })

  it('空白与空输入归一为空串', () => {
    assert.equal(normalizeText('   \n\n  '), '')
    assert.equal(normalizeText(undefined), '')
  })
})

describe('describeFailure', () => {
  it('401/403 指向 Key 问题', () => {
    assert.match(describeFailure(401, '{"message":"InvalidApiKey"}'), /API Key 无效或无权限/)
  })

  it('418 指向模型与音色不匹配', () => {
    assert.match(describeFailure(418, '{}'), /模型与.*音色.*不一致/)
  })

  it('429 指向限流', () => {
    assert.match(describeFailure(429, '{}'), /过于频繁/)
  })

  it('5xx 指向服务不可用', () => {
    assert.match(describeFailure(503, '{}'), /暂时不可用/)
  })
})

describe('cacheKeyOf', () => {
  it('同输入同键，任一输入变化即换键', () => {
    const a = cacheKeyOf('m', 'v', '文本')
    const b = cacheKeyOf('m', 'v', '文本')
    const c = cacheKeyOf('m', 'v2', '文本')
    assert.equal(a, b)
    assert.notEqual(a, c)
    assert.match(a, /^[0-9a-f]{64}$/)
  })
})

describe('AudioStore', () => {
  let dir
  let store

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'cosyvoice-store-'))
    store = new AudioStore(() => dir)
  })

  it('写入后可读回，且落盘内容一致', () => {
    const clip = store.put(cacheKeyOf('m', 'v', 't'), Buffer.from([1, 2, 3, 4]))
    assert.equal(clip.bytes, 4)
    assert.deepEqual(readFileSync(clip.path), Buffer.from([1, 2, 3, 4]))
    assert.equal(store.hit(cacheKeyOf('m', 'v', 't')).name, clip.name)
  })

  it('未命中返回 undefined', () => {
    assert.equal(store.hit(cacheKeyOf('m', 'v', '没写过')), undefined)
  })

  it('拒绝走出目录的文件名', () => {
    assert.equal(store.pathOf('../../etc/passwd'), undefined)
    assert.equal(store.pathOf('not-a-hash.mp3'), undefined)
    assert.equal(store.pathOf(undefined), undefined)
  })

  it('清空只删本插件的缓存文件', () => {
    writeFileSync(join(dir, 'keep-me.txt'), 'x')
    store.put(cacheKeyOf('m', 'v', 'a'), Buffer.from('a'))
    store.put(cacheKeyOf('m', 'v', 'b'), Buffer.from('bb'))
    assert.equal(store.count(), 2)
    assert.equal(store.clear(), 2)
    assert.equal(store.count(), 0)
    assert.equal(readFileSync(join(dir, 'keep-me.txt'), 'utf8'), 'x')
  })
})

describe('SpeechClient', () => {
  const settings = { apiKey: 'sk-test', voiceId: 'voice-1', model: 'cosyvoice-v3.5-plus' }

  it('把文本 POST 到端点，并带上 Bearer 与音色', async () => {
    const { impl, calls } = recordingFetch(async () => okResponse(Buffer.from('AUDIO').toString('base64')))
    const client = new SpeechClient({ getSettings: () => settings, fetchImpl: impl })
    const result = await client.synthesize('你好')
    assert.equal(calls[0].url, DEFAULT_ENDPOINT)
    assert.equal(calls[0].init.headers.authorization, 'Bearer sk-test')
    const body = JSON.parse(calls[0].init.body)
    assert.equal(body.input.voice, 'voice-1')
    assert.equal(body.input.text, '你好')
    assert.equal(body.input.format, 'mp3')
    assert.equal(result.bytes.toString(), 'AUDIO')
    assert.equal(result.characters, 12)
  })

  it('响应给的是 URL 时改为下载', async () => {
    // 必须给一份独立的 ArrayBuffer：`Buffer#buffer` 指向 Node 的内存池，
    // 直接交出去会把池里相邻的字节一起读进来。
    const bytes = Buffer.from('FROM-OSS')
    const { impl, calls } = recordingFetch(async () => ({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ output: { audio: { url: 'https://oss.example.com/a.mp3' } } }),
      arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
    }))
    const client = new SpeechClient({ getSettings: () => settings, fetchImpl: impl })
    const result = await client.synthesize('你好')
    assert.equal(calls.length, 2)
    assert.equal(calls[1].url, 'https://oss.example.com/a.mp3')
    assert.equal(result.bytes.toString(), 'FROM-OSS')
  })

  it('缺 Key 或缺音色时给出可操作的中文提示', async () => {
    const { impl } = recordingFetch(async () => okResponse(''))
    const noKey = new SpeechClient({ getSettings: () => ({ ...settings, apiKey: '' }), fetchImpl: impl })
    await assert.rejects(noKey.synthesize('你好'), /未配置 API Key/)
    const noVoice = new SpeechClient({ getSettings: () => ({ ...settings, voiceId: '' }), fetchImpl: impl })
    await assert.rejects(noVoice.synthesize('你好'), /未配置音色/)
  })

  it('空文本直接拒绝，不发请求', async () => {
    const { impl, calls } = recordingFetch(async () => okResponse(''))
    const client = new SpeechClient({ getSettings: () => settings, fetchImpl: impl })
    await assert.rejects(client.synthesize('**'), /没有可朗读的文本/)
    assert.equal(calls.length, 0)
  })

  it('HTTP 418 翻成"模型与音色不一致"', async () => {
    const { impl } = recordingFetch(async () => ({
      ok: false,
      status: 418,
      text: async () => JSON.stringify({ message: 'model mismatch' }),
    }))
    const client = new SpeechClient({ getSettings: () => settings, fetchImpl: impl })
    await assert.rejects(client.synthesize('你好'), /模型与.*音色.*不一致/)
  })

  it('连接失败不抛裸网络异常', async () => {
    const { impl } = recordingFetch(async () => { throw new Error('ECONNREFUSED') })
    const client = new SpeechClient({ getSettings: () => settings, fetchImpl: impl })
    await assert.rejects(client.synthesize('你好'), /无法连接百炼服务/)
  })
})

describe('VoiceSynthesizer', () => {
  let dir
  let store
  let synth
  let calls
  const settings = { apiKey: 'sk-test', voiceId: 'voice-1', model: 'cosyvoice-v3.5-plus', outputDir: '' }

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'cosyvoice-synth-'))
    settings.outputDir = dir
    calls = []
    const fetchImpl = async (url, init) => {
      calls.push({ url, init })
      return okResponse(Buffer.from('MP3BYTES').toString('base64'), 7)
    }
    store = new AudioStore(() => dir)
    synth = new VoiceSynthesizer({
      speech: new SpeechClient({ getSettings: () => settings, fetchImpl }),
      store,
      getSettings: () => settings,
    })
  })

  it('首次合成调用云端并落盘', async () => {
    const clip = await synth.synthesize('第一条回答')
    assert.equal(clip.cached, false)
    assert.equal(calls.length, 1)
    assert.equal(readFileSync(clip.path).toString(), 'MP3BYTES')
    assert.equal(clip.characters, 7)
  })

  it('相同文本第二次命中缓存，零 API 调用', async () => {
    await synth.synthesize('同一条')
    const second = await synth.synthesize('同一条')
    assert.equal(second.cached, true)
    assert.equal(calls.length, 1)
  })

  it('Markdown 差异不影响缓存命中', async () => {
    await synth.synthesize('**重点**')
    const second = await synth.synthesize('重点')
    assert.equal(second.cached, true)
    assert.equal(calls.length, 1)
  })

  it('换音色后不复用旧缓存', async () => {
    await synth.synthesize('同一条')
    settings.voiceId = 'voice-2'
    const second = await synth.synthesize('同一条')
    assert.equal(second.cached, false)
    assert.equal(calls.length, 2)
  })

  it('换模型后不复用旧缓存', async () => {
    await synth.synthesize('同一条')
    settings.model = 'cosyvoice-v3.5-flash'
    const second = await synth.synthesize('同一条')
    assert.equal(second.cached, false)
    assert.equal(calls.length, 2)
  })

  it('合成失败不写入缓存', async () => {
    settings.apiKey = ''
    await assert.rejects(synth.synthesize('会失败'), /未配置 API Key/)
    assert.equal(store.count(), 0)
    settings.apiKey = 'sk-test'
  })
})

describe('MessageTextResolver', () => {
  let dir

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'cosyvoice-texts-'))
  })

  it('记得住显式登记的文本', () => {
    const texts = new MessageTextResolver({ home: dir })
    texts.remember('m1', '登记的内容')
    assert.equal(texts.resolve('m1'), '登记的内容')
  })

  it('从会话日志里按 messageId 抽出助手文本', () => {
    const sessions = join(dir, 'sessions')
    mkdirSync(sessions, { recursive: true })
    const log = [
      JSON.stringify({ type: 'user', messageId: 'u1', blocks: [{ kind: 'text', text: '问题' }] }),
      JSON.stringify({ type: 'assistant', messageId: 'a1', blocks: [{ kind: 'text', text: '这是回答' }] }),
    ].join('\n')
    writeFileSync(join(sessions, 's1.jsonl'), log)
    const texts = new MessageTextResolver({ home: dir })
    assert.equal(texts.resolve('a1', 's1'), '这是回答')
  })

  it('解析不到时返回 undefined 而不是抛错', () => {
    const texts = new MessageTextResolver({ home: dir })
    assert.equal(texts.resolve('不存在'), undefined)
    assert.equal(texts.resolve(''), undefined)
  })
})
