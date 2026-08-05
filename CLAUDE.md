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
| `content.js` | 合併 `data/*`、建索引、解鎖判定、`planOf()` 依取向給配方 |
| `srs.js` | SM-2 簡化版間隔重複、弱點怪獸清單 |
| `scheduler.js` | 組題：關卡、複習、每日挑戰、跳關測驗 |
| `gamify.js` | XP／等級／連續天數／寶石／成就、關卡與跳關測驗結算，及 WebAudio 合成音效 |
| `speech.js` | TTS、語音辨識、離線錄音降級 |
| `ui.js` | DOM 工具、彈窗、toast、主題 |
| `views/*.js` | `Views[name]`，由 `app.js` 依 hash 路由呼叫 |
| `exercises/*.js` | `Ex[type]`，由 `views/lesson.js` 依題目 type 呼叫 |

## 題型模組契約

`Ex[type] = { scored: bool, render(q, host, api) }`。api：`ready(fn)` 設定檢查行為、`enableCheck(bool)`、`result(ok, opts)` 送出批改、`setContinue(text)` 供不計分卡片用、`onCleanup(fn)`。完整說明見 `exercises/common.js` 檔頭。

現有 16 種：intro flashcard recall spell listen dictate speak grammar build cloze read irregular photo respond collocate phoneme。

`photo`（多益 Part 1 看圖聽描述）與 `respond`（Part 2 應答）在 `exercises/toeic.js`，共用一個「只靠耳朵作答」的骨架：選項文字預設 `display:none`，按「顯示英文」或作答後才出現。用 `display:none` 而非 `visibility:hidden` 是因為後者會保留折行高度，長選項的框變高等於用看的就知道哪個最長。沒有 TTS 語音時自動顯示文字，否則整題無法作答。

自由作答題（fix／trans／cloze／dictate）用 `ExUtil.matchAny()` 比對，已忽略大小寫、標點、彎引號與**縮寫**（I'm≡I am、don't≡do not）。`'s` 與 `'d` 有歧義故不展開。因此 `alt` 只需寫「真正不同的說法」，不必列縮寫或標點變體。

## 內容模型

`data/curriculum.js` 定義 Stage 0–6 共 75 關。關卡的 `plan` 只描述「出哪些題、各幾題」，挑哪些字句由 `scheduler.js` 決定。

`Content.isReady(uid)` = `stage.ready` && 有 `plan` && **自己**有內容（vocab／grammar／reading／photo／respond／minpair 任一）。缺一即鎖住並顯示「製作中」。

六種都要算進去，因為關卡的形態差很多：純聽力關（Part 1／Part 2）沒有單字也沒有文法；魔王關相反，題目全靠 `*UpTo()` 往前借，只有自己的短文。

`stage.ready` 只代表階段開放，**關卡可以分批補**：沒有 `plan` 的關卡顯示「製作中」，同階段其他關卡照常可玩。但解鎖是一條鏈（前一關至少一星才開下一關），所以可玩的關卡必須從頭連續 —— 中間空一關，後面的就永遠解不開。

資料 id 前綴必須互斥（vocab `v####`、grammar `g####`、reading `r####`、irregular `i####`、Part 1 `p####`、Part 2 `q####`、最小音對 `m####`）—— 共用同一個 `byId` 索引。

## 刻意誘答

選項與字塊裡「錯的那些」決定一題有沒有鑑別度。隨機抽舊字當誘答幾乎沒作用 —— 問 `take` 卻配上 office、very，看一眼就刪得掉。真正會錯的是母語干擾：中文說「吃藥」，所以 `eat` 才是那個陷阱。

兩層，都是可選欄位，沒寫就退回隨機：

- **字級** `lure:['eat','get']` 寫在單字上，選擇題（recall／listen）與排句題共用。
- **句級** 例句的第三個元素 `['She teaches English.','她教英文。',['studies']]`，只給排句題。字級誘答是原形，句子裡的動詞有變化時形態對不上，這時候才需要它。

出誘答的是 `Content.distractors()`（選項）與 `Content.tokenLures()`（字塊），兩個都在 content 層 —— 題型模組不自己挑誘答，否則 `test-logic.js` 測不到。

同形或同義的字一律不能當誘答：`job` 與 `work` 的 `zh` 都是「工作」，湊在同一題會出現兩個都對的選項（資料裡有 47 組這種字）。守衛在 `distractors()` 裡，寫進 `lure` 也一樣會被丟掉，所以測試直接把這種資料擋下來 —— 寫了卻永遠不生效比沒寫更糟。

排句誘答另外兩條：不能是句子裡已有的字（會多出一個正確解），也不能有空格（唯一有空格的字塊用看的就知道是多的，片語留給選擇題）。

## 搭配詞與字根字首

兩個可選欄位，都是純加法，沒寫的字完全不受影響。

- **`col`** 搭配詞 `col:[['take a break','休息一下'], …]`。單字卡先列出來教，`collocate` 題型再把動詞挖空考回去。
- **`rt`** 字根字首 `rt:{p:'pro- 向前', r:'gress 走', s:'-ment 名詞'}`，三個欄位都可省。每格都是「英文 空格 中文」，顯示時從第一個空格切成上下兩段排成積木 —— 沒有空格只會排出半塊。

`col` **只能掛在動詞上**：挖掉名詞（pay the ___）常常不只一個答案。詞組裡也一定要含目標字，否則挖不出空格，答案會直接印在題目上。兩條都有測試擋著。

搭配詞題的誘答走 `Content.colDistractors()`，只從**其他也有 `col` 的動詞**裡抽，不是一般的隨機誘答 —— 隨機抽到的動詞有機會剛好也配得起來（give a speech 抽到 make，可是 make a speech 也對），那題就沒有標準解。同理，寫資料時要避開「兩個都成立」的搭配：give、talk、receive、accept 就是因為和 make／speak／get 大量重疊而整組拿掉的。

`collocate` 從 `vocabUpTo()` 抽而不是只抽這一關的新字：高頻動詞集中在 Stage 0，但要等學過幾關、有東西可比較之後才練得起來。所以發音關卡不出這種題，配方寫在 Stage 1 以後的關卡上。

不規則動詞不綁關卡，用 `t` 分 A／B／C 三型（三態同形／過去式＝過去分詞／三態都不同）。關卡設 `irregular: true` 會得到一張教學卡，plan 加 `['irregular', n]` 會出三態練習。

## 最小音對

`phonics.js` 教了字母發什麼音，但一直沒有題目考回來 —— 聽力題考的是整個字的意思，拼字題是看中文拼，都不是「聽到這個音，它寫成哪個字母」。`phoneme` 補的就是這一段。

**刻意不播孤立音素。** `speechSynthesis` 唸 `/æ/` 會去唸斜線，單獨的 `/b/` 在不同語音引擎行為也不一樣，而語音是使用者系統上剛好裝了什麼就用什麼（見 `speech.js` 的 `chooseVoice()`）。改成整個字照唸，但同一組的候選字只差一個位置，要答對還是只能靠那個音。

`data/minimal-pairs.js` 的 `set` 是 `[單字, 標籤]`，標籤省略就用單字本身：短母音組選的是單一個字母（`['bag','a']`），魔法 e 組選的是整個字的拼法（`['cape']`）。標籤必須是那個單字裡真的有的一段，否則選項與答案對不起來 —— 有測試擋著。

沒有 TTS 時降級成看字辨形（直接露出單字）。這時候題目確實變簡單了，但至少還在練字母與音的對應，不會整題卡死。

配方只寫在 `plan`、**不寫進 `planVocab`** —— 選「先學單字」的人本來就是要跳過發音練習的。

## 鷹架提示與時間軸

兩件事都是為了「答錯的當下」，資料都可選。

**鷹架** 複習、每日挑戰、弱點怪獸這三條路徑都不經過教學卡，題目直接蓋臉丟過來。`scheduler.scaffoldOf()` 把文法點的 `teach.lead` 掛成 `q.scaffold`，題型端用 `ExUtil.scaffold()` 印在題目上方。**關卡裡不掛** —— 教學卡前面才整頁講完，再貼一次是雜訊，這條有測試釘住。

**時間軸** 文法點的 `tl` 是一串 `{a, b, t, hl}`：`a`／`b` 是 past／now／future，只寫 `a` 是一個時間點，寫了 `b` 是一段時間。答錯時才畫（`ExUtil.timelineHTML()`），畫在 `why` 後面。公式（主詞＋have＋p.p.）背得起來，但背不出「到現在為止」的時間感，而錯的那一刻正好是最需要看到它的時候。目前掛在七個時態文法點上。

## Stage 0 起步：取向與跳關測驗

前五關（s0u1–s0u5）全是發音，而解鎖是一條鏈，已經有底子的人會被卡住。兩個機制解這件事，**都不碰 `isUnlocked`**。

**起步取向** `profile.track`（`'phonics'` 預設／`'vocab'`），onboarding 問一題、設定頁可改。它只換配方：發音關另備一份 `planVocab`（新字加倍、第一關就出排句題、聽力與跟讀砍半）。讀配方一律走 `Content.planOf(uid)` —— 直接讀 `unit.plan` 在 `vocab` 取向下會說謊（`buildLesson` 與地圖的「這次會教幾個新字」都已改用）。`isReady`／`isUnlocked` 不看 `planVocab`，沒寫的關卡兩種取向一模一樣。

**跳關測驗** 只給發音關，入口在地圖的關卡卡片；首頁待辦卡只推給 `track === 'vocab'`（選「先練發音」的人不該被慫恿跳過）。`Scheduler.SKIP_N` = 8 題（聽音 3、拼字 3、中英互選 2，可拼的字不夠就用互選補），全部出自**這一關自己的**單字，沒有教學卡也沒有單字卡 —— 先教一次再答對，證明不了什麼。答對 `rules.skipPass`（0.85 → 8 題只能錯 1 題）就 `State.unit(id).s = 1`：一顆星本來就是解鎖條件，**使用者不是跳過，是證明不需要**。

通過不給皇冠、不算通關次數，另記 `rec.skip = 1`：這一關的內容確實沒上過，地圖要照實顯示，回頭再打也還是當第一次教。測驗不重排答錯的題（`session.noRetry`）—— 那是課堂的補救機制，在測驗裡等於送答案；但答錯照樣進 SRS 與弱點怪獸，跳掉的關卡才不會變成黑洞。

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
| phoneme | 音對整組 | 從整組再抽一個字聽一次 | 答對 |

`scheduler.weakQuestion()` 負責型別→題目的映射。**新增型別必須同步改它**，否則怪獸進得了清單卻永遠出不了題、也永遠消不掉。`test-logic.js` 會掃 `SRS.addWeak()` 的字串參數比對 `weakQuestion` 有沒有接 —— 所以呼叫時型別要寫**字面值**，包在變數裡就掃不到了（見 `toeic.js` 把評分交回各題型做的原因）。

複習佇列中怪獸佔 40% 額度，以**實際排進去的題數**計算（出不了題的不佔名額）；依答錯次數排序；閱讀排在最後且每次至多一篇。

## SRS 範圍

間隔重複**僅涵蓋單字**。文法、閱讀、不規則動詞、發音不寫入 `State.data.srs`（`buildReview` 的到期迴圈要求項目有 `.w`），只透過弱點怪獸清單回鍋。

## 存檔

在 `state.js` 的 `blank()` 增欄位即可，`fill()` 會把新欄位補進舊存檔，不需寫 migration。關卡紀錄不走 `blank()`，欄位加在 `State.unit()` 的預設物件裡（`s` 星數、`lv` 皇冠、`best`、`n`、`at`、`skip`）。

`g.shieldUsedN` 是「已扣護盾但還沒告知使用者」的計數：`rollDay()` 累加，`Gamify.noticeShield()` 報一次後歸零。任何靜靜改變存檔的機制都該配一個這樣的欄位，否則使用者不會知道自己被救了。

## CSS 陷阱

自訂 `display` 會蓋掉瀏覽器內建的 `[hidden] { display: none }`。凡是用 `hidden` 屬性開關、又自帶 display 的元素，都要補 `[hidden] { display: none }`（見 `.modal-root`）—— 否則關掉的彈窗會留在畫面上擋住點擊。

## 慣例

- 註解與 commit 訊息用繁體中文；註解說明「為什麼」而非「做什麼」。
- 無測試框架（刻意維持零依賴）。`node tools/test-logic.js` 用內建 `vm` 把 data 與引擎層（含 `gamify.js`，星數與解鎖要測得到）載進假的 window；提交前連同 `node tools/verify-bundle.js` 一起跑。
- 端對端（Playwright + Chromium 開 `file://`）仍是手動、腳本與 node_modules 都留在 repo 外 —— 進來就破壞零依賴。

## 測試

`tools/` 底下三支腳本，都只用 Node 內建模組：

| 指令 | 檢查什麼 |
|---|---|
| `node tools/build.js` | 重新打包（`--check` 只驗不寫檔） |
| `node tools/verify-bundle.js` | 單檔版與原始檔逐區塊比對 |
| `node tools/test-logic.js` | `node --check`、ES5 語法、資料完整性、組題、誘答、搭配詞、最小音對、時間軸、鷹架、跳關測驗、弱點怪獸對映、SRS 範圍、`matchAny` |

新增檢查時請一併確認「它真的會失敗」—— 故意改壞一個地方跑一次，不會紅的檢查沒有價值。

## 現況

- 可玩的是 Stage 0–2 共 35 關（1028 單字、27 文法點、54 篇短文、63 個不規則動詞、14 題 Part 1、22 題 Part 2）。Stage 2 已完整。
- 單字的可選欄位目前覆蓋率還低：`lure` 55 個字、`col` 12 個字（29 組）、`rt` 32 個字。都是純加法，補資料不必動程式。
- 最小音對 18 組（發音關 U2–U5）、時間軸 7 個文法點。
- Stage 3–6 共 40 關僅有標題，`ready: false`。

## 下一步 TODO

1. **Stage 3 的 10 關**（被動語態、商務字彙、Part 5 詞性判斷、Part 3/4 長對話）。Part 3/4 要新的 `Ex` 模組（一段長音檔配多題），不是補資料就能解決。
2. **兩條聲音的路都沒在真機上驗過**：驗證都跑在 `file://`。麥克風被擋，`Speech.listen()` 與 `scoreSpeech()` 要走 Vercel preview 才驗得到；`phoneme` 則是反過來 —— 邏輯與降級都測得到，但「TTS 唸出來的 bag／beg／big 到底分不分得出來」只有真機聽得出來，而語音是使用者系統上剛好裝了什麼就用什麼。
3. **畫面層沒有自動檢查**：CI 只驗語法、資料與組題，`views/*`／`exercises/*` 的 render 全靠手動。要納入就得引入 Playwright，與零依賴衝突，先想清楚值不值得。
