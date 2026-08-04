# English Quest

零依賴純前端英語學習 App，繁中介面，Stage 0→6 對應零基礎到多益 990。無框架、無 npm、無 build step。

## 硬性限制

- **必須能用 `file://` 直接開啟**：禁用 fetch 與 ES modules；資料一律在 `data/*.js` 指派 `window.DATA_*`。
- **ES5 語法**，IIFE 掛全域：`State` `Content` `SRS` `Scheduler` `Gamify` `Sfx` `Speech` `UI` `Ex` `ExUtil` `Views`。
- `index.html` 的 script 順序即相依順序（data → 引擎 → 題型 → 畫面 → app.js）。新增檔案要手動加進去。

## 部署

除了 `file://` 與單檔版，這個 repo 還零設定部署在 Vercel（無 `vercel.json`，直接送根目錄靜態檔），PR 會產生 preview URL。

因此有兩條交付路徑，**兩條都要能動**。差別在於瀏覽器權限：`file://` 下部分瀏覽器擋麥克風，口說題會降級成錄音自評；HTTPS 下語音辨識才能真的自動評分。要驗口說功能得走部署版。

## 打包

`build.ps1`（Windows PowerShell）將 css/js 全部內嵌成單檔 `English-Learning.html`，供手機離線使用。

**改動任何 css/js/data 後必須重新打包**，否則單檔版落後於多檔版。無 PowerShell 時以等價轉換重跑：同樣的 link/script regex、區塊標頭 `/* ===== 相對路徑 ===== */`、`</script>` 轉義為 `<\/script>`、UTF-8 無 BOM、`<body>` 後插入時間戳。

## 架構

| 檔案 | 職責 |
|---|---|
| `state.js` | localStorage 存檔（key `eq.save.v1`）、跨日結算、匯出匯入、進度碼 |
| `content.js` | 合併 `data/*`、建索引、關卡解鎖判定 |
| `srs.js` | SM-2 簡化版間隔重複、弱點怪獸清單 |
| `scheduler.js` | 組題：關卡佇列、複習佇列、每日挑戰 |
| `gamify.js` | XP／等級／連續天數／寶石／成就，及 WebAudio 合成音效 |
| `speech.js` | TTS、語音辨識、離線錄音降級 |
| `ui.js` | DOM 工具、彈窗、toast、主題 |
| `views/*.js` | `Views[name]`，由 `app.js` 依 hash 路由呼叫 |
| `exercises/*.js` | `Ex[type]`，由 `views/lesson.js` 依題目 type 呼叫 |

## 題型模組契約

`Ex[type] = { scored: bool, render(q, host, api) }`。api：`ready(fn)` 設定檢查行為、`enableCheck(bool)`、`result(ok, opts)` 送出批改、`setContinue(text)` 供不計分卡片用、`onCleanup(fn)`。完整說明見 `exercises/common.js` 檔頭。

現有 12 種：intro flashcard recall spell listen dictate speak grammar build cloze read irregular。

自由作答題（fix／trans／cloze／dictate）用 `ExUtil.matchAny()` 比對，已忽略大小寫、標點、彎引號與**縮寫**（I'm≡I am、don't≡do not）。`'s` 與 `'d` 有歧義故不展開。因此 `alt` 只需寫「真正不同的說法」，不必列縮寫或標點變體。

## 內容模型

`data/curriculum.js` 定義 Stage 0–6 共 75 關。關卡的 `plan` 只描述「出哪些題、各幾題」，挑哪些字句由 `scheduler.js` 決定。

`Content.isReady(uid)` = `stage.ready` && 有 `plan` && 有 vocab 或 grammar。缺一即鎖住並顯示「製作中」。

資料 id 前綴必須互斥（vocab `v####`、grammar `g####`、reading `r####`、irregular `i####`）—— 共用同一個 `byId` 索引。

不規則動詞不綁關卡，用 `t` 分 A／B／C 三型（三態同形／過去式＝過去分詞／三態都不同）。關卡設 `irregular: true` 會得到一張教學卡，plan 加 `['irregular', n]` 會出三態練習。

## 弱點怪獸

四種型別記的都是**來源**而非個別題目：

| type | 記的 id | 複習時出什麼 | 消滅條件 |
|---|---|---|---|
| vocab | 單字 | 中英互選 | 答對 |
| grammar | 文法點 | 從該點題庫抽一題，優先 mc／cloze | 答對 |
| reading | 文章 | 整篇重讀 | 所有小題全對 |
| irregular | 動詞 | 再問一次過去式或過去分詞 | 答對 |

`scheduler.weakQuestion()` 負責型別→題目的映射。**新增型別必須同步改它**，否則怪獸進得了清單卻永遠出不了題、也永遠消不掉。

複習佇列中怪獸佔 40% 額度，以**實際排進去的題數**計算（出不了題的不佔名額）；依答錯次數排序；閱讀排在最後且每次至多一篇。

## SRS 範圍

間隔重複**僅涵蓋單字**。文法、閱讀、不規則動詞不寫入 `State.data.srs`（`buildReview` 的到期迴圈要求項目有 `.w`），只透過弱點怪獸清單回鍋。

## 存檔

在 `state.js` 的 `blank()` 增欄位即可，`fill()` 會把新欄位補進舊存檔，不需寫 migration。

## CSS 陷阱

自訂 `display` 會蓋掉瀏覽器內建的 `[hidden] { display: none }`。凡是用 `hidden` 屬性開關、又自帶 display 的元素，都要補 `[hidden] { display: none }`（見 `.modal-root`）—— 否則關掉的彈窗會留在畫面上擋住點擊。

## 慣例

- 註解與 commit 訊息用繁體中文；註解說明「為什麼」而非「做什麼」。
- 無測試框架（刻意維持零依賴）。驗證方式：node `vm` 載入模組測邏輯，Playwright + Chromium 開 `file://` 測端對端；測試腳本不進 repo。

## 現況

- 可玩的是 Stage 0–1 共 25 關（890 單字、20 文法點／292 題、39 篇短文、63 個不規則動詞）。
- Stage 2–6 共 50 關僅有標題，無 `plan` 與內容，`ready: false`。
- 多益題型（Part 1–7、模考）除補資料外，還需新的 `Ex` 模組與計時／分段機制。
