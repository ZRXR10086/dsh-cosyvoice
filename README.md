# dsh-cosyvoice

给 DeepSeek Harness 网页界面的**每条 AI 回答**末尾加一个语音播放键。点一下，就用阿里云百炼（DashScope）CosyVoice 的音色把那条回答读出来。

- **没有系统提示注入**，也**没有给模型的工具**。模型不知道"语音"这件事，所以不存在"提醒了它却不说"的不确定性。
- **点了才合成**（pull 而不是 push），相同内容第二次点击走哈希缓存，零费用。
- 合成在 Node 侧直调百炼 HTTP，**不依赖 Python**。

**V2（2.0.0）新增**：

- **音色档案**：保存多套音色（名称 + 音色 ID + 模型），列表里一键切换当前用的那一套。
- **音色克隆**：上传一段 10~20 秒的人声，插件走完百炼的「声音复刻」自动拿到音色 ID **不需要自己准备 OSS**，也不需要手填 ID；还能一键把百炼控制台已有的音色同步进来。

**v2.1（2.1.0）新增**：

- **两种合成方式，随时切换**（设置页）：
  - **非实时（整段）** —— 默认。整篇一次合成完再播，**语调最连贯**；
  - **实时（流式）** —— 打开百炼 SSE，云端按句把音频推回来，**第一句合成好就开始念**，出声更早。
- 流式播放走 Web Audio 做**采样级排期**：下一句排在上一句结束的那一刻，而不是"播完再去取下一段"，所以听不出句间断顿。
- 两种方式共用同一套内容哈希缓存，但产物不同（MP3 / WAV），来回切换不会串；同一条回答第二次播放都是零费用、零等待。`

> 面向 **dsh 0.2.1-alpha.1**（版本是硬性要求）。

---

## 一、它长什么样

每条助手回答底部那排动作按钮（复制、点赞、点踩……）里会多出一个喇叭图标：

| 状态 | 图标 | 含义 |
| --- | --- | --- |
| 🔊 待播 | 喇叭 | 点一下开始朗读 |
| ⏳ 合成中 | 转圈 | 正在调百炼，播放键变灰 |
| ⏹ 播放中 | 方块 | 再点一下停止 |
| 红色喇叭 | 喇叭（红） | 上一次失败了，悬停看原因 |

同时只会有**一个**声音在响：点第二条消息的播放键会接管前一条。

设置 → **语音** 页里可以配置 Key、管理音色档案、上传音频克隆音色，以及试听、打开目录、清空缓存。

---

## 二、装之前：先把 dsh 0.2.1-alpha.1 的坑填了

`0.2.1-alpha.1` 的 `package.json` **漏声明了一批它自己代码会 import 的包**，装完直接跑会报 `ERR_MODULE_NOT_FOUND`。这不是本插件的问题，但必须先修。

先确认你符合环境前提：

| 项目 | 要求 |
| --- | --- |
| Node | **≥ 22.19.0**（`undici@8`、`@deepseek-ai/libreoffice-kit` 等硬要求） |
| dsh | `0.2.1-alpha.1` |
| pnpm | `dsh plugin add` 需要它 |

补装缺失的包（**注意：要用写入 `package.json` 的方式，`npm i --no-save` 会被随后的安装剪枝掉**）：

```bash
npm i -g @deepseek-ai/dsh@0.2.1-alpha.1
cd "$(npm root -g)/@deepseek-ai/dsh"

# 1) 备份（可选）
cp package.json package.json.orig

# 2) 把缺失的依赖写进 package.json
#    版本必须**与 dsh 同为 0.2.1-alpha.1**：这些包是 dsh 的兄弟包，装成
#    npm 上 dist-tag 指向的 0.0.1-rc.x 会得到旧 API（实测报
#    "does not provide an export named ..."），还会把旧版 dsh-settings
#    提升进来覆盖自带的那个。
node -e '
const fs = require("fs")
const p = JSON.parse(fs.readFileSync("package.json", "utf8"))
const missing = [
  "dsh-scope", "dsh-attachment", "dsh-compaction", "dsh-fs", "dsh-jobs",
  "dsh-sandbox", "dsh-session-persistence", "dsh-session-telemetry", "dsh-shell",
  "dsh-spill", "dsh-workflow", "dsh-anonymous-user-id", "dsh-output-retention",
  "dsh-ptc-runtime", "dsh-util-time", "dsh-session-title-llm",
  "dsh-deepseek-account", "dsh-subagent-in-process-driver"
]
for (const n of missing) p.dependencies["@deepseek-ai/" + n] = "0.2.1-alpha.1"
p.dependencies["@deepseek-ai/cordis-plugin-group"] = "^1.0.4"
fs.writeFileSync("package.json", JSON.stringify(p, null, 2) + "\n")
'

# 3) 按新的 package.json 重装
npm install --legacy-peer-deps

dsh --version   # 应输出 0.2.1-alpha.1
```

> 如果之后你重装/升级 dsh，这段要重做一次。建议顺手给官方提个 issue。

**这一步做对的判据**：`dsh web` 能打印出 `http://127.0.0.1:<port>/?token=...` 而不是
`startup failed`。漏装时会有几十个 `failed to import`；版本装错时则是
`does not provide an export named '...'` —— 两种报错长得很像，别认错了。

---

## 三、安装

```bash
cd /path/to/dsh-cosyvoice
dsh plugin --profile web add "$(pwd)"
dsh web
```

`package.json` 里的 `dsh.bundle.patch` 会让 `dsh plugin add` **一次装全**（宿主插件 + 浏览器端注入 + profile 里的 `- id: cosyvoice` 条目）。装完可以确认一下：

```bash
dsh --profile web --dump-config | grep -A 2 cosyvoice
# # == dsh-cosyvoice
# - id: cosyvoice
#   name: dsh-cosyvoice
```

### 装完怎么确认真的装上了

```bash
# 1) 插件进了配置树
dsh --profile web --dump-config | grep -A 2 cosyvoice
# # == dsh-cosyvoice
# - id: cosyvoice
#   name: dsh-cosyvoice

# 2) 宿主路由活着（启动 dsh web 后，端口换成实际那个）
curl http://127.0.0.1:<port>/dsh-cosyvoice/status
# {"ok":true,"configured":false,...,"dir":".../voice/audio","count":0}

# 3) 浏览器端被注入：首页的 boot graph 里应出现
#    {"id":"dsh-cosyvoice","url":"plugins/??dsh-cosyvoice/client.js&rev=...",...}
```

第 2 步返回 `configured: false` 是正常的 —— 还没填 Key。第 3 步要带 dsh 的会话
cookie，用浏览器 DevTools 看 `window.__DSH_BOOT__` 最直接。

改了 `client/` 下的源码后要重新构建（`lib/client.js` 是产物，别手改）：

```bash
npm run build     # 拼接到 lib/client.js
npm run verify    # 产物自检
npm test          # 单测 + 集成测试 + 构建 + 自检
```

---

## 四、配置

设置 → **语音**：

| 字段 | 说明 |
| --- | --- |
| **API Key** | 阿里云百炼的 `sk-...`。密钥字段：页面上永远只有掩码，输入即覆盖。 |
| **默认音色 ID** | 百炼控制台里**复刻**或**设计**出来的音色 ID。**只有"音色档案"里一套都没有时才用它**。 |
| **合成模型** | 默认 `cosyvoice-v3.5-plus`。**必须与注册音色时用的模型一致**，否则百炼直接拒绝（HTTP 418）。 |
| **输出目录** | 音频落盘位置。留空用 `~/.dsh/voice/audio`。 |
| **合成方式** | **非实时（整段）**（默认）/ **实时（流式）**。切换即时生效，不用重启。 |
| **开机提示音** | 打开页面后首次交互时"叮"一声。 |

改完立即生效，不用重启。

### 合成方式：实时（流式）/ 非实时（整段）

| | 非实时（整段） | 实时（流式） |
| --- | --- | --- |
| 请求 | 一次 POST，等整段合成完 | 同一个端点 + `X-DashScope-SSE: enable`，云端按句推回来 |
| 出声 | 全文合成完之后 | **第一句好了就开始念** |
| 语调 | **最连贯**（一次成韵） | 略逊于整段（云端按句合成） |
| 播放 | `<audio src>` 一次播完 | Web Audio 采样级排期，句间无空白 |
| 缓存 | `<hash>.mp3` | `<hash>.wav`（同样只有在第二次起生效） |

两种模式的产物各用一个扩展名，所以在两者之间来回切不会串缓存，也不用白付第二次钱。

> 流式播放用的是 **Web Audio**（`AudioBufferSourceNode`）。若浏览器拿不到 `AudioContext`，页面会直接提示你切回「非实时」—— 而不是给你一段没声音的 null stream。

### 音色档案

页面中间那一块是**音色档案**：每套档案 = 名称 + 音色 ID + 模型，列表里点「启用」即可切换当前音色；「编辑」把它装进下面那三个输入框，「删除」移除。合成时**以启用的档案为准**，一套都没有才回落到上面的默认音色 ID —— 所以 v1 的用户升级上来不用重新配置。

档案存在 `~/.dsh/voice/profiles.json`（插件自管，不进 dsh 配置 schema：schemastery 的数组做增量写入不可靠，而克隆音色还要带 `pending → ready / failed` 状态机）。

### 音色克隆

上传一段 **10~20 秒的清晰人声**（建议 **48kHz 的 WAV**，单文件 ≤ 20MB），插件自动走完百炼的链路：

```
① POST /api/v1/files            上传音频         → file_id
② GET  /api/v1/files/{file_id}  取内网临时 URL   → url
③ POST /tts/customization       create_voice     → voice_id
④ POST /tts/customization       query_voice      → DEPLOYING → OK
```

> **② 不是多余的**：`create_voice` 的 `url` 只接受阿里云**内网可访问**的地址，公网直链会报 `AudioSilentError`。这正是必须走 Files 接口、也因此你不必自己准备 OSS 的原因。

上传后档案里会立刻出现一条「复刻中」，页面每 3 秒查一次状态；就绪后自动设为当前音色。**「从云端同步」**则把百炼控制台里已有的音色一键拉进档案。

约束：音色 **30 个 / 账号**（满了先删不用的）；文件名前缀只能是数字与小写字母（插件自动生成 `dsh******`）。

---

## 五、它是怎么工作的

### 非实时（整段，默认）

```
浏览器                                    宿主（Node）
──────                                    ──────────
播放键（slot: conversation.chat.
  assistant-actions）
  │ ① 从 chat 快照取该条消息的文本
  │ ② POST /dsh-cosyvoice/speak-message
  │    { messageId, sessionId, text }
  ├──────────────────────────────────────▶ ③ 清洗 Markdown
  │                                        ④ sha256(模型+音色+文本) 查缓存
  │                                        ⑤ 未命中 → POST 百炼 SpeechSynthesizer
  │                                        ⑥ 落盘 <hash>.mp3
  │◀──────────────────────────────────────  ⑦ { mode: 'one-shot', clip: { url } }
  │ ⑧ <audio> 整段播放
```

### 实时（流式）

```
浏览器                                    宿主（Node）                       百炼
──────                                    ──────────                       ────
播放键
  │ POST /speak-message
  ├──────────────────────────────────────▶ 查 <hash>.wav 缓存
  │                                        命中 → 直接回整段 clip（不握手 SSE）
  │                                        未命中 → POST + X-DashScope-SSE ──▶ 流式合成
  │◀── event: open ───────────────────────  已连上（还没出声）
  │◀── event: chunk { audio, sampleRate } ◀─ sentence-synthesis（每句一帧 PCM）
  │ 每一块到达就排进 Web Audio 的播放日程：  下一块排在**上一块结束的那一刻**
  │◀── event: done  { clip } ──────────────  全部合成完，整段已落盘成 <hash>.wav
  │ 播完最后一块 → 回到空闲
```

关键在于**中间的每一帧都不用等**：服务端的 SSE 解析是一边读一边写，客户端是一边收一边排，两端都没有"攒够再说"这一步。

### 为什么把"分句并行 + 按句依次播"回滚了

v2.0 用过那个方案：把回答切成若干句、并发合成、用 `<audio>` 依次播。它确实让首句出声更早，但听感上有两个硬伤：

1. **句间留白**：`<audio>` 切换一个 URL 就要付一次"加载完才能播"的往返；
2. **语速不连贯**：每句独立请求，云端不知道上下文，韵律对不上。

于是 v2.1 的取舍是：**要连贯就用整段**（默认），**要快就用云端自己的流式**（同一个请求、同一份上下文，由百炼侧决定怎么断句），而不是在客户端一层硬拼。

**取文本有两条路**，先走快的：

1. **客户端**：`useChat`（chat 为 session 级 slot 声明的标准 prop）直接从 chat 快照里取 —— 与"复制"按钮用的是同一份文本。
2. **宿主兜底**：消息不在已加载窗口时，客户端拿不到文本，宿主按 `messageId` 去 `$DSH_HOME/sessions` 的会话日志里解析；客户端给过的文本还会被记住，下次连 DOM 都不用读。

两条都落空才报"没找到这条回答的文本"，不会静默失败。

### 路由

| 路由 | 作用 |
| --- | --- |
| `GET /dsh-cosyvoice/status` | 是否已配置、**当前生效的**模型与音色、缓存数量、**当前合成方式** |
| `POST /dsh-cosyvoice/speak-message` | **播放键主入口**：按当前方式返回整段 JSON 或 SSE 流 |
| `POST /dsh-cosyvoice/speak` | 同上，给一段文本（设置页试听用） |
| `GET /dsh-cosyvoice/audio?name=` | 取音频字节（文件名是内容哈希，可永久缓存） |
| `GET /dsh-cosyvoice/profiles` | 音色档案列表 + 当前激活 + 回退值 |
| `POST /dsh-cosyvoice/profiles` | 新增/更新档案（给了 `id` 即更新） |
| `DELETE /dsh-cosyvoice/profiles` | 删除档案 |
| `POST /dsh-cosyvoice/profiles/activate` | 切换当前音色 |
| `POST /dsh-cosyvoice/clone` | **上传音频复刻音色**（body 为裸音频字节） |
| `GET /dsh-cosyvoice/clone/status?id=` | 查一个复刻音色的部署状态 |
| `GET /dsh-cosyvoice/cloud-voices` | 列出百炼账号上已有的音色 |
| `POST /dsh-cosyvoice/cloud-voices/import` | 把云端音色批量导入档案 |
| `GET /dsh-cosyvoice/boot` | 开机提示音 |
| `POST /dsh-cosyvoice/open` | 在文件管理器里打开输出目录 |
| `POST /dsh-cosyvoice/clear` | 清空缓存 |

有副作用的都过同源校验，挡住跨站驱动。同一条 `/profiles` 路径按方法分叉（GET/POST/DELETE）——
宿主的分发只看路径，方法由 handler 自己判。

`/speak` 与 `/speak-message` 同理：**路径和方法都不变**，变的是响应形态 —— 非实时回 JSON，实时回 SSE。客户端按响应头的 `content-type` 自己选路，所以 mode 在两次请求之间被改掉也不会错。

<details>
<summary>流式响应的帧格式</summary>

```
event: open
data: {"sampleRate":24000}

event: chunk
data: {"audio":"<base64 pcm>","sampleRate":24000}

event: done
data: {"clip":{"name":"…wav","url":"/dsh-cosyvoice/audio?name=…","characters":42},"characters":42}

event: error
data: {"message":"……"}
```

</details>

---

## 六、排错

| 现象 | 原因与处理 |
| --- | --- |
| 播放键没出现 | 跑 `dsh --profile web --dump-config \| grep cosyvoice` 确认插件进了配置树；再看启动日志的 `Failed plugins` 有没有 `cosyvoice`。 |
| 红色喇叭，提示「API Key 无效或无权限」 | HTTP 401/403：Key 填错，或该 Key 没开通百炼语音合成。 |
| 提示「合成模型与注册音色时的模型不一致」 | HTTP 418：音色是用另一个模型注册的。把「合成模型」改成注册时的那个。 |
| 提示「未配置音色 ID」 | 既没有启用的音色档案，也没填默认音色 ID。`cosyvoice-v3.5-plus/flash` 没有系统音色，去百炼控制台复刻一个，或直接在设置页上传音频克隆。 |
| 克隆提示「音频不符合复刻要求」 | 百炼报 `AudioSilentError` 一类：音频太短、静音、或采样率不对。换 48kHz 的 WAV、录 10~20 秒清晰人声。 |
| 克隆提示「配额已满」 | 音色上限 **30 个 / 账号**。去百炼控制台删掉不用的再试。 |
| 克隆一直显示「复刻中」 | 部署通常几秒到几分钟。页面会轮询两分钟；超时后列表里的状态仍在，稍后回到设置页即可看到结果。 |
| 换了音色档案，试听报 418 | 档案里的模型与音色 ID 注册时用的模型不一致。编辑那套档案，把模型改成注册时的那个。 |
| 提示「没找到这条回答的文本」 | 消息太旧、不在已加载窗口，且会话日志格式对不上。刷新页面让窗口覆盖它，或直接复制文本后在设置页试听验证链路。 |
| 提示音没响 | `assets/boot.mp3` 缺失，或浏览器不给自动播放。提示音不影响主功能。 |
| 设置页改了没生效 | 配置改动会让 cordis 重启本插件，路由随之重挂。若仍无效，看 `~/.dsh/logs/startup-*.log`。 |

---

## 七、目录结构

```
dsh-cosyvoice/
├── host/                宿主（Node）那一半
│   ├── index.js         apply 总装：Config + 路由
│   ├── settings.js      cosyvoice 配置 schema（apiKey 为密钥字段）
│   ├── speech.js        直调百炼 HTTP：整段 + SSE 流式（fetch 可注入）
│   ├── stream.js        SSE 帧解析、事件语义、PCM → WAV
│   ├── synth.js         合成编排：清洗 → 缓存键 → 查缓存 → 调云端 → 落盘
│   ├── profiles.js      音色档案（~/.dsh/voice/profiles.json）
│   ├── clone.js         百炼声音复刻：上传 → 内网 URL → create_voice → 轮询
│   ├── store.js         音频目录与内容哈希缓存
│   ├── texts.js         messageId → 文本（会话日志解析 + 内存记忆）
│   ├── routes.js        /dsh-cosyvoice/* 路由
│   └── harness.js       harness 包解析（本地路径安装也不炸）
├── client/              浏览器那一半（源码，需构建）
│   ├── shared.js        rpc、SSE 读取、播放器（整段 + Web Audio 流式）
│   ├── locales.js       中英字典
│   ├── message-button.js  播放键
│   ├── settings-page.js   设置页
│   └── index.js         apply 总装
├── lib/client.js        构建产物（勿手改）
├── assets/boot.mp3      开机提示音
├── build.mjs            纯拼接构建（无打包器）
├── verify.mjs           产物自检
└── test/                单测 + 集成测试
```

### 构建的两个约束

浏览器端产物必须是一个自包含的 classic script：

1. **纯拼接**，无打包器 —— `build.mjs` 按声明顺序把 `client/` 串起来。
2. **纯 ASCII** —— 所有中文/emoji 都转义成 `\uXXXX`，免得字符集被猜错变成乱码，`verify.mjs` 会断言还原后的文案正确。
3. 不得出现动态 `import()`、Node 内置模块 —— `verify.mjs` 同样会拦。

---

## 八、开发

```bash
npm test          # 110 个单测/集成用例 + 构建 + 41 项产物自检
node --test "test/*.test.mjs"
```

集成测试会真的起**两台** HTTP 服务器（同一个进程里按两种 `mode` 各注册一次插件）、把 `apply()` 注册的路由挂上去、再用真实 `fetch` 打它 —— 合成与复刻都走注入的假 fetch，所以不花钱也不联网。流式那条用例会把 SSE 响应切成两块投递，于是"一次读到半帧"也是被覆盖的。

产物自检（`verify.mjs`）除了静态检查，还会**真渲染一遍设置页**、**整段播放**跑一遍、并**真喂一条 SSE 进去驱动流式播放**：断言两块音频被排上日程、且第二块的开始时刻精确等于第一块的结束时刻（也就是"无缝"）—— 设置页里的崩溃、以及流式链路上的时序错误，都要到用户真的点下去那一刻才现形，注册期是安静的。

---

## 九、已知边界

- **只做 TTS**，不做语音输入。0.2.1 自带 `dsh-experimental-client-ui-voice-input`，后续若要双向对话，优先实现它的 provider 接口而不是另起炉灶。
- **消息文本依赖 chat 快照**：极老的消息滑出加载窗口后，只能靠宿主解析会话日志兜底，而日志格式不保证稳定。
- **宿主兜底需要 Node ≥ 23.8** 才能解 zstd 压缩的会话日志；低版本会跳过压缩文件。
- 播放键依赖 `conversation.chat.assistant-actions` 这个 slot；dsh 后续版本若改名，只需改 `client/index.js` 里的一个字符串。
- **流式要浏览器支持 Web Audio**（所有现代浏览器都有）。拿不到 `AudioContext` 时会在播放那一刻提示切回「非实时」，而不是静默失败。
- 流式音频**按句拼接**：云端一次 SSE 里按句返回，这里用 `AudioBufferSourceNode` 把它们排在一条时间轴上，所以听不出接缝；但**跨句的韵律仍略逊于整段合成** —— 这是云端的特性，不是这里的 bug。想要最连贯就用默认的非实时。
- 缓存下来的流式产物是 **WAV**（比 MP3 大，约 10 倍）；长期不用可以在设置页清空。
- 百炼这套接口的返回形状在不同版本间挪过位置，`clone.js` 里的状态字段按多处兜底取值；若将来固定下来可以收窄。
