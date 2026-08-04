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

現有 14 種：intro flashcard recall spell listen dictate speak grammar build cloze read irregular photo respond。

`photo`（多益 Part 1 看圖聽描述）與 `respond`（Part 2 應答）在 `exercises/toeic.js`，共用一個「只靠耳朵作答」的骨架：選項文字預設 `display:none`，按「顯示英文」或作答後才出現。用 `display:none` 而非 `visibility:hidden` 是因為後者會保留折行高度，長選項的框變高等於用看的就知道哪個最長。沒有 TTS 語音時自動顯示文字，否則整題無法作答。

自由作答題（fix／trans／cloze／dictate）用 `ExUtil.matchAny()` 比對，已忽略大小寫、標點、彎引號與**縮寫**（I'm≡I am、don't≡do not）。`'s` 與 `'d` 有歧義故不展開。因此 `alt` 只需寫「真正不同的說法」，不必列縮寫或標點變體。

## 內容模型

`data/curriculum.js` 定義 Stage 0–6 共 75 關。關卡的 `plan` 只描述「出哪些題、各幾題」，挑哪些字句由 `scheduler.js` 決定。

`Content.isReady(uid)` = `stage.ready` && 有 `plan` && **自己**有內容（vocab／grammar／reading／photo／respond 任一）。缺一即鎖住並顯示「製作中」。

五種都要算進去，因為關卡的形態差很多：純聽力關（Part 1／Part 2）沒有單字也沒有文法；魔王關相反，題目全靠 `*UpTo()` 往前借，只有自己的短文。

`stage.ready` 只代表階段開放，**關卡可以分批補**：沒有 `plan` 的關卡顯示「製作中」，同階段其他關卡照常可玩。但解鎖是一條鏈（前一關至少一星才開下一關），所以可玩的關卡必須從頭連續 —— 中間空一關，後面的就永遠解不開。

資料 id 前綴必須互斥（vocab `v####`、grammar `g####`、reading `r####`、irregular `i####`、Part 1 `p####`、Part 2 `q####`）—— 共用同一個 `byId` 索引。

不規則動詞不綁關卡，用 `t` 分 A／B／C 三型（三態同形／過去式＝過去分詞／三態都不同）。關卡設 `irregular: true` 會得到一張教學卡，plan 加 `['irregular', n]` 會出三態練習。

## 起步取向

`profile.track`（`'phonics'` 預設／`'vocab'`）在 onboarding 問一題，設定頁隨時可改。它換的只有配方：發音關 s0u1–s0u5 各多寫一份 `planVocab`（新字加倍、第一關就出排句題、聽力與跟讀砍半），`Content.planOf(uid)` 依取向決定回傳哪一份。

`isReady`／`isUnlocked` 都不看 `planVocab`，**解鎖鏈完全不變** —— 兩種取向走的是同一串關卡，換的是同一關裡出哪些題。沒寫 `planVocab` 的關卡兩邊一模一樣。

要讀關卡配方一律走 `Content.planOf(uid)`，不要直接讀 `unit.plan`（`buildLesson` 與地圖的「這次會教幾個新字」都已改用）—— 直接讀 `plan` 的地方在 `vocab` 取向下會說謊。

## 跳關測驗

發音關（s0u1–s0u5）在地圖的關卡卡片上多一顆「跳關測驗」：`Scheduler.SKIP_N` 題（聽音 3、拼字 3、中英互選 2，可拼的字不夠就用互選補），全部出自**這一關自己的**單字，沒有教學卡也沒有單字卡 —— 先被教一次再答對，證明不了什麼。答對 `rules.skipPass`（0.85，8 題只能錯 1 題）就 `State.unit(id).s = 1`。

一顆星本來就是解鎖條件，所以 `isUnlocked` 一行都沒改：**使用者不是跳過，是證明不需要**。通過不給皇冠、不算通關次數，並記 `rec.skip = 1`，因為這一關的內容確實沒上過 —— 地圖要照實顯示「內容還沒上過」，之後回來打也還是當第一次教。

測驗不重排答錯的題（`session.noRetry`）：那是課堂的補救機制，在測驗裡等於送答案。但答錯照樣進 SRS 與弱點怪獸，跳掉的關卡才不會變成黑洞。

首頁的待辦卡只推給 `track === 'vocab'` 的人；地圖上兩種取向都找得到。選「先練發音」的人是自己要求練發音的，不該在首頁被慫恿跳過。

## 弱點怪獸

六種型別記的都是**來源**而非個別題目：

| type | 記的 id | 複習時出什麼 | 消滅條件 |
|---|---|---|---|
| vocab | 單字 | 中英互選 | 答對 |
| grammar | 文法點 | 從該點題庫抽一題，優先 mc／cloze | 答對 |
| reading | 文章 | 整篇重讀 | 所有小題全對 |
| irregular | 動詞 | 再問一次過去式或過去分詞 | 答對 |
| photo | 照片 | 同一張再聽一次四個描述 | 答對 |
| respond | 問句 | 同一句再聽一次三個回應 | 答對 |

`scheduler.weakQuestion()` 負責型別→題目的映射。**新增型別必須同步改它**，否則怪獸進得了清單卻永遠出不了題、也永遠消不掉。`test-logic.js` 會掃 `SRS.addWeak()` 的字串參數比對 `weakQuestion` 有沒有接 —— 所以呼叫時型別要寫**字面值**，包在變數裡就掃不到了（見 `toeic.js` 把評分交回各題型做的原因）。

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
| `node tools/test-logic.js` | `node --check`、ES5 語法、資料完整性、組題、跳關測驗、弱點怪獸對映、SRS 範圍、`matchAny` |

新增檢查時請一併確認「它真的會失敗」—— 故意改壞一個地方跑一次，不會紅的檢查沒有價值。

## 現況

- 可玩的是 Stage 0–2 共 35 關（1028 單字、27 文法點、54 篇短文、63 個不規則動詞、14 題 Part 1、22 題 Part 2）。Stage 2 已完整。
- Stage 3–6 共 40 關僅有標題，`ready: false`。

## 下一步 TODO

1. **Stage 3 的 10 關**（被動語態、商務字彙、Part 5 詞性判斷、Part 3/4 長對話）。Part 3/4 需要新的 `Ex` 模組（一段長音檔配多題），不是補資料就能解決。
2. **驗證口說的自動評分**。所有既有驗證都跑在 `file://`，而那裡瀏覽器擋麥克風，等於 `Speech.listen()` 與 `scoreSpeech()` 這條路從未被實際執行過。要走 Vercel preview 才驗得到。
3. **端對端測試進 CI**。目前 CI 只驗語法、資料與組題邏輯，畫面層（`views/*`、`exercises/*` 的 render）沒有任何自動檢查。要納入就得引入 Playwright，與零依賴衝突，得先想清楚值不值得。
