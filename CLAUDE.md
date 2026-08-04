# English Quest

零依賴純前端英語學習 App，繁中介面，Stage 0→6 對應零基礎到多益 990。無框架、無 npm、無編譯 —— 唯一的建置動作是把所有檔案內嵌成單檔（見「打包」）。

## 硬性限制

- **必須能用 `file://` 直接開啟**：禁用 fetch 與 ES modules；資料一律在 `data/*.js` 指派 `window.DATA_*`。
- **ES5 語法**，IIFE 掛全域：`State` `Content` `SRS` `Scheduler` `Gamify` `Sfx` `Speech` `UI` `Ex` `ExUtil` `Views`。
- `index.html` 的 script 順序即相依順序（data → 引擎 → 題型 → 畫面 → app.js）。新增檔案要手動加進去。

## 部署

除了 `file://` 與單檔版，這個 repo 還零設定部署在 Vercel（無 `vercel.json`，直接送根目錄靜態檔），PR 會產生 preview URL。

三條交付路徑（`file://`、單檔版、Vercel），**都要能動**。差別只在瀏覽器權限：`file://` 下部分瀏覽器擋麥克風，口說題降級成錄音自評；HTTPS 下語音辨識才會真的自動評分。

## 打包

把 css/js 全部內嵌成單檔 `English-Learning.html`，供手機離線使用。兩支腳本產出完全相同的結果：

- `node tools/build.js` —— 跨平台，CI 與非 Windows 環境用這支。
- `build.ps1` —— Windows PowerShell，不需要 Node。

**改動任何 css/js/data 後必須重新打包**，否則單檔版落後於多檔版（曾經發生過，且無聲上線）。兩邊的轉換規則必須一致：同樣的 link/script regex、區塊標頭 `/* ===== 相對路徑 ===== */`、`</script>` 轉義為 `<\/script>`、UTF-8 無 BOM、`<body>` 後插入時間戳。

驗證同步：`node tools/verify-bundle.js`。它用區塊標頭把單檔版拆回各區塊逐一與原始檔比對，這是唯一能抓到漂移的方法 —— 檔案大小與時間戳都看不出來。CI 每次 push 都會跑。

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

`g.shieldUsedN` 是「已扣護盾但還沒告知使用者」的計數：`rollDay()` 累加，`Gamify.noticeShield()` 報一次後歸零。任何靜靜改變存檔的機制都該配一個這樣的欄位，否則使用者不會知道自己被救了。

## CSS 陷阱

自訂 `display` 會蓋掉瀏覽器內建的 `[hidden] { display: none }`。凡是用 `hidden` 屬性開關、又自帶 display 的元素，都要補 `[hidden] { display: none }`（見 `.modal-root`）—— 否則關掉的彈窗會留在畫面上擋住點擊。

## 慣例

- 註解與 commit 訊息用繁體中文；註解說明「為什麼」而非「做什麼」。
- 無測試框架（刻意維持零依賴）。`node tools/test-logic.js` 用內建 `vm` 把 data 與引擎載進假的 window，驗語法、資料完整性與組題邏輯；提交前連同 `node tools/verify-bundle.js` 一起跑。
- 端對端（Playwright + Chromium 開 `file://`）仍是手動、腳本不進 repo —— 那會引入 npm 依賴。

## 測試

`tools/` 底下三支腳本，都只用 Node 內建模組：

| 指令 | 檢查什麼 |
|---|---|
| `node tools/build.js` | 重新打包（`--check` 只驗不寫檔） |
| `node tools/verify-bundle.js` | 單檔版與原始檔逐區塊比對 |
| `node tools/test-logic.js` | `node --check`、ES5 語法、資料完整性、組題、弱點怪獸對映、SRS 範圍、`matchAny` |

新增檢查時請一併確認「它真的會失敗」—— 故意改壞一個地方跑一次，不會紅的檢查沒有價值。

## 現況

- 可玩的是 Stage 0–1 共 25 關（890 單字、20 文法點／292 題、39 篇短文、63 個不規則動詞）。
- Stage 2–6 共 50 關僅有標題，無 `plan` 與內容，`ready: false`。

## 下一步 TODO

1. **Stage 2 的 10 關**。使用者打完第 25 關就撞牆，這是產品的關鍵路徑。除了補 vocab／grammar／reading，Part 1（看圖聽描述）與 Part 2（應答）需要新的 `Ex` 模組與圖片資產 —— 不是補資料就能解決。
2. **驗證口說的自動評分**。所有既有驗證都跑在 `file://`，而那裡瀏覽器擋麥克風，等於 `Speech.listen()` 與 `scoreSpeech()` 這條路從未被實際執行過。要走 Vercel preview 才驗得到。
3. **端對端測試進 CI**。目前 CI 只驗語法、資料與組題邏輯，畫面層（`views/*`、`exercises/*` 的 render）沒有任何自動檢查。要納入就得引入 Playwright，與零依賴衝突，得先想清楚值不值得。
