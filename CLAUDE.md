# English Quest

零依賴純前端英語學習 App，繁中介面，Stage 0→6 對應零基礎到多益 990。無框架、無 npm、無編譯。

## 硬性限制

- **必須能用 `file://` 直接開啟**：禁用 fetch 與 ES modules；資料一律在 `data/*.js` 指派 `window.DATA_*`。
- **ES5 語法**，IIFE 掛全域：`State` `Content` `SRS` `Scheduler` `Gamify` `Sfx` `Speech` `UI` `Ex` `ExUtil` `Views`。
- `index.html` 的 script 順序即相依順序（data → 引擎 → 題型 → 畫面 → app.js）。新增檔案要手動加進去。

## 交付與打包

三條路徑都要能動：`file://`、單檔版 `English-Learning.html`、Vercel（零設定，PR 出 preview）。差別只在瀏覽器權限 —— `file://` 下麥克風常被擋，口說題降級成錄音自評。

**改動任何 css/js/data 後必須重新打包**：`node tools/build.js`（跨平台）或 `build.ps1`（Windows，免 Node），兩者輸出必須逐字元相同 —— 同樣的 link/script regex、區塊標頭 `/* ===== 相對路徑 ===== */`、`</script>` 轉義、UTF-8 無 BOM、`<body>` 後插時間戳。

`node tools/verify-bundle.js` 依區塊標頭拆回原始檔逐一比對，是唯一抓得到漂移的方法（檔案大小與時間戳都看不出來）。CI 每次 push 跑。

## 架構

| 檔案 | 職責 |
|---|---|
| `state.js` | localStorage 存檔（key `eq.save.v1`）、跨日結算、匯出匯入、進度碼 |
| `content.js` | 合併 `data/*`、建索引、解鎖判定、`planOf()` 依取向給配方、出誘答 |
| `lexicon.js` | 詞庫：三層合併、詞形還原、`markup()` 把句子包成可點的字、查詢卡 |
| `srs.js` | SM-2 簡化版間隔重複、弱點怪獸清單 |
| `scheduler.js` | 組題：關卡、複習、每日挑戰、跳關測驗 |
| `gamify.js` | XP／等級／連續天數／寶石／成就、關卡與跳關測驗結算，及 WebAudio 合成音效 |
| `speech.js` | TTS、語音辨識、離線錄音降級 |
| `ui.js` | DOM 工具、彈窗、toast、主題 |
| `views/*.js` | `Views[name]`，由 `app.js` 依 hash 路由呼叫 |
| `exercises/*.js` | `Ex[type]`，由 `views/lesson.js` 依題目 type 呼叫 |

## 題型模組契約

`Ex[type] = { scored, render(q, host, api) }`。api：`ready(fn)` 設定檢查行為、`enableCheck(bool)`、`result(ok, opts)` 送批改、`setContinue(text)` 給不計分卡片、`onCleanup(fn)`。詳見 `exercises/common.js` 檔頭。

16 種：intro flashcard recall spell listen dictate speak grammar build cloze read irregular photo respond collocate phoneme。

`photo`／`respond`（多益 Part 1／2，在 `toeic.js`）共用「只靠耳朵作答」骨架：選項文字預設 `display:none`，按鈕或作答後才顯示。不可改用 `visibility:hidden` —— 它保留折行高度，長選項的框變高就洩題。沒有 TTS 時自動顯示，否則整題無法作答。

自由作答（fix／trans／cloze／dictate）走 `ExUtil.matchAny()`，已忽略大小寫、標點、彎引號與縮寫（`'s`／`'d` 有歧義故不展開）。`alt` 只需寫真正不同的說法。

## 內容模型

`data/curriculum.js` 定義 Stage 0–6 共 75 關。`plan` 只描述「出哪些題、各幾題」，挑哪些字句由 `scheduler.js` 決定。

`Content.isReady(uid)` = `stage.ready` && 有 `plan` && 自己有六種內容任一（vocab／grammar／reading／photo／respond／minpair）。六種都要算：純聽力關沒有單字也沒有文法，魔王關相反 —— 題目全靠 `*UpTo()` 往前借，只有自己的短文。

`stage.ready` 只代表階段開放，關卡可分批補（沒 `plan` 就顯示「製作中」）。但解鎖是一條鏈，**可玩的關卡必須從頭連續** —— 中間空一關，後面永遠解不開。

id 前綴互斥（共用 `byId` 索引）：vocab `v` / grammar `g` / reading `r` / irregular `i` / Part 1 `p` / Part 2 `q` / 最小音對 `m`，各接四位數。

不規則動詞不綁關卡，用 `t` 分 A／B／C 三型（三態同形／過去式＝過去分詞／三態都不同）。關卡設 `irregular: true` 得到一張教學卡，`plan` 加 `['irregular', n]` 出三態練習。

## 詞庫：查得到的字

課程單字（`data/vocab-*.js`）是「教得到的字」—— 綁關卡、有圖示、有刻意誘答，全部手寫。
詞庫是「查得到的字」，不綁關卡，一萬一千筆，加上課程的一千多字剛好是多益的量級。

三層，愈上面愈優先（`js/lexicon.js` 的 `build()`）：

| 層 | 檔案 | 來源 |
|---|---|---|
| 課程單字 | `data/vocab-*.js` | 手寫，資料最完整 |
| 手寫詞庫 | `data/lexicon-core.js` | 手寫，補課程沒教到的多益字 |
| 自動詞庫 | `data/lexicon-1..6.js` | `tools/gen-lexicon.js` 產生，**不要手改** |

自動層的中文是照詞頻排的，而多益考的常常不是最常用的意思（`warranty` 排最前面的是
「正當理由」，考題只考「保固」）。手寫層就是為了蓋掉那些字。**要把某個字升級成手寫
品質，把它搬進 `lexicon-core.js` 即可**，不必動程式。

字**已經在課程裡**時（`address`、`order`、`last`…）不會被蓋掉 —— 課程那筆比較完整，
只有 `note`（延伸用法）與 `fam`（同家族）會補上去。`col` 刻意不合併：`collocate` 題型
直接把 vocab 的 `col` 當題庫抽，從詞庫塞進去等於繞過搭配詞那一串限制。

自動層一筆是一行 `\t` 分隔的字串而不是物件字面值：一萬多筆各背三十個位元組的鍵名就是
300KB，拆成字串陣列既省檔案也省瀏覽器的剖析時間。欄位順序見各檔案的檔頭。
索引是第一次查詢才建的 —— 大部分的人打開 App 是要練習，不是要查字典。

`tools/gen-lexicon.js` 需要兩份外部資料（體積太大，都不進 repo，URL 寫在檔頭）：
ECDICT（MIT，含 BNC／COCA 詞頻與詞形變化）與 OpenCC 的簡繁對照表（Apache-2.0），
另可選 WordNet 3.0 補英文用法示例。**簡轉繁的詞組表與單字表必須合成同一組做最長匹配**，
分兩輪跑會把「公里」轉成「公裡」——詞組表裡那些左右相同的項目就是用來擋單字表的。

挑字不能只看詞頻：`invoice` 的 COCA 排名一萬五、`itinerary` 更後面，但每回考題都在。
腳本裡的 `BIZ` 清單把多益主題字無條件拉進來，是整支腳本唯一需要人腦判斷的地方。

**例句是詞庫最弱的一環**：自動層的中英對照例句只有 256 筆（從 repo 自己寫過的句子比對
出來的），另有約四千筆 WordNet 的英文用法示例，其餘六千多字目前只有詞義、音標、詞形
變化與同家族。查詢卡在沒有例句時會照實說，不會假裝有。要補就是往 `lexicon-core.js` 寫。

## 例句點字

**每一句英文例句裡的每個字都可以點開查**（`Lexicon.markup()`）：真正卡住閱讀的往往不是
正在教的那個字，而是例句裡順手用掉的另一個字。查詢卡給詞義、詞形變化、同家族、搭配詞、
英英解釋與例句，而卡片裡的例句一樣可以再點下去（有返回鍵）。

原本只有閱讀題的文章能點字（邏輯寫在 `exercises/reading.js` 裡），現在整包搬到
`js/lexicon.js`。`lexicon.js` 在載入當下就取用 `UI.esc`，**所以它一定要排在 `ui.js` 之後**
（`index.html` 與 `tools/test-logic.js` 的載入順序都要顧到）。

只有「教學內容」與「批改後的詳解」用 `markup()`，**題目本身不包**：`recall` 的選項一點
就會跳出中文，等於直接送答案。

`markup()` 是先轉義再包 span，所以正規表示式必須先把 `&amp;` 這類實體整段吃掉，
否則實體裡的 `amp` 會被當成一個英文字包起來。

## 詞庫特訓

課程一關教六到十個字，一萬二千字這樣走完要好幾年，所以詞庫另開一條腿：
`#/words` 挑一批（分級或商務主題）→ `Scheduler.buildLexiconDrill()` → 走**同一套**
關卡畫面（`lesson` 的 `drill` 模式）。刻意不做新畫面 —— 練習節奏、批改、結算都調好了。

誘答從**同一批字**裡抽（題目上掛 `pool`，`flashcard`／`listening` 傳給 `distractors()`）。
同一級的字難度相近；拿課程裡的簡單字當誘答，這一批再難也會變成送分題。

詞庫的字 id 是 `lx:` 開頭，`Content.item()` 查不到。`scheduler.js` 的 `refItem()` 會再問
一次 `Lexicon.item()`，**`weakQuestion` 與 `buildReview` 兩處都要用它** —— 漏掉的話，
詞庫特訓答錯的字會變成進得了清單卻永遠出不了題的怪獸。

## 可選欄位

全部純加法，沒寫就退回預設行為。

| 欄位 | 掛在 | 形狀 | 作用 |
|---|---|---|---|
| `lure` | 單字 | `['eat','get']` | 刻意誘答，選擇題與排句題共用 |
| `ex[i][2]` | 例句第三元素 | `['studies']` | 句級誘答，只給排句題。字級誘答是原形，句中動詞有變化時形態對不上才需要它 |
| `col` | 動詞 | `[['take a break','休息一下']]` | 搭配詞：單字卡先教，`collocate` 挖空考回來 |
| `rt` | 單字 | `{p,r,s}`，每格「英文 空格 中文」 | 字根字首，從空格切成上下兩段排成積木（沒空格只排出半塊） |
| `tl` | 文法點 | `[{a,b,t,hl}]`，`a`／`b` ∈ past/now/future | 時態時間軸。只寫 `a` 是時間點，加 `b` 是一段時間 |

## 誘答守則

「錯的那些」決定一題有沒有鑑別度。隨機抽舊字幾乎沒作用 —— 問 `take` 卻配上 office、very，一眼就刪得掉；真正會錯的是母語干擾：中文說「吃藥」，所以 `eat` 才是陷阱。

出誘答的三支都在 content 層，題型模組不自己挑 —— 放進 `exercises/` 就測不到：

- **`distractors()`** 選項。排除同形／同義：`job` 與 `work` 的 `zh` 都是「工作」，湊同一題會兩個都對（資料裡有 47 組），寫進 `lure` 也照丟。
- **`tokenLures()`** 排句字塊。順序：句級 → 字級 → 隨機。不能是句中已有的字（會多一個正確解），不能有空格（唯一有空格的字塊一看就知道是多的，片語留給選擇題）。
- **`colDistractors()`** 搭配詞選項。只從其他有 `col` 的動詞抽 —— 隨機動詞有機會剛好也配得起來（give a speech 抽到 make，而 make a speech 也對），那題就沒有標準解。

`col` **只掛動詞**（挖名詞常不只一個答案），詞組必須含目標字（否則挖不出空格，答案會印在題目上）。寫資料時避開「兩個都成立」的搭配 —— give、talk、receive、accept 已因與 make／speak／get 大量重疊而整組移除。

`collocate` 從 `vocabUpTo()` 抽而非只抽本關新字：高頻動詞集中在 Stage 0，要學過幾關、有東西可比較才練得起來，所以配方只寫在 Stage 1 以後的關卡。

## 最小音對

`phonics.js` 教了字母發什麼音卻沒有題目考回來（聽力題考意思、拼字題看中文拼，都不是「聽到這個音寫成哪個字母」）。`phoneme` 補這一段。

**刻意不播孤立音素**：`speechSynthesis` 唸 `/æ/` 會去唸斜線，單獨的 `/b/` 各引擎行為不一，而語音是使用者系統上剛好裝了什麼就用什麼（`chooseVoice()`）。改成整個字照唸，同組候選只差一個位置。

`data/minimal-pairs.js` 的 `set` 是 `[單字, 標籤]`，標籤省略即用單字本身（短母音組選單一字母、魔法 e 組選整個拼法）。標籤必須是該單字裡真有的一段，否則選項與答案對不起來。沒有 TTS 時降級成看字辨形 —— 變簡單但仍在練字母與音的對應。

配方只寫 `plan`、**不寫 `planVocab`**：選「先學單字」的人本來就要跳過發音練習。

## 答錯的當下

**鷹架** 複習、每日挑戰、弱點怪獸都不經過教學卡。`Scheduler.scaffoldOf()` 把文法點的 `teach.lead` 掛成 `q.scaffold`，`ExUtil.scaffold()` 印在題目上方。**關卡裡不掛** —— 教學卡剛整頁講完，再貼一次是雜訊。

**時間軸** 答錯才畫（`ExUtil.timelineHTML()`，接在 `why` 之後）。公式背得起來，但背不出「到現在為止」的時間感，而錯的那一刻最需要看到它。

## Stage 0 起步：取向與跳關測驗

前五關（s0u1–s0u5）全是發音，而解鎖是一條鏈，有底子的人會被卡住。兩個機制解這件事，**都不碰 `isUnlocked`**。

**起步取向** `profile.track`（`'phonics'` 預設／`'vocab'`），onboarding 問一題、設定頁可改。它只換配方：發音關另備 `planVocab`（新字加倍、第一關就出排句題、聽力與跟讀砍半）。讀配方一律走 `Content.planOf(uid)` —— 直接讀 `unit.plan` 在 `vocab` 取向下會說謊。`isReady`／`isUnlocked` 不看 `planVocab`。

**跳關測驗** 只給發音關，入口在地圖卡片；首頁待辦只推給 `track === 'vocab'`。`Scheduler.SKIP_N` = 8 題（聽音 3、拼字 3、中英互選 2，可拼的字不夠就用互選補），全出自**本關自己的**單字，沒有教學卡也沒有單字卡 —— 先教一次再答對證明不了什麼。答對 `rules.skipPass`（0.85）就 `State.unit(id).s = 1`：一顆星本來就是解鎖條件，**使用者不是跳過，是證明不需要**。

通過不給皇冠、不算通關次數，另記 `rec.skip = 1`（內容確實沒上過，地圖照實顯示，回頭再打仍當第一次教）。測驗不重排答錯的題（`session.noRetry`）—— 那是課堂的補救機制，在測驗裡等於送答案；但答錯照樣進 SRS 與弱點怪獸，跳掉的關卡才不會變成黑洞。

## 弱點怪獸

七種型別記的都是**來源**而非個別題目：

| type | 記的 id | 複習時出什麼 | 消滅條件 |
|---|---|---|---|
| vocab | 單字 | 中英互選 | 答對 |
| grammar | 文法點 | 從該點題庫抽一題，優先 mc／cloze | 答對 |
| reading | 文章 | 整篇重讀 | 所有小題全對 |
| irregular | 動詞 | 再問一次過去式或過去分詞 | 答對 |
| photo | 照片 | 同一張再聽一次四個描述 | 答對 |
| respond | 問句 | 同一句再聽一次三個回應 | 答對 |
| phoneme | 音對整組 | 從整組再抽一個字聽一次 | 答對 |

`Scheduler.weakQuestion()` 負責型別→題目的映射。**新增型別必須同步改它**，否則怪獸進得了清單卻永遠出不了題、也永遠消不掉。`test-logic.js` 掃 `SRS.addWeak()` 的字串參數比對 `weakQuestion` 有沒有接 —— 呼叫時型別要寫**字面值**，包在變數裡就掃不到（見 `toeic.js` 把評分交回各題型的原因）。

複習佇列中怪獸佔 40% 額度，以**實際排進去的題數**計算（出不了題的不佔名額）；依答錯次數排序；閱讀排最後且每次至多一篇。

間隔重複**僅涵蓋單字**：文法、閱讀、不規則動詞、發音都不寫入 `State.data.srs`（`buildReview` 的到期迴圈要求項目有 `.w`），只透過弱點怪獸回鍋。

## 存檔

在 `state.js` 的 `blank()` 增欄位即可，`fill()` 會把新欄位補進舊存檔，不需 migration。關卡紀錄不走 `blank()`，欄位加在 `State.unit()` 的預設物件（`s` 星數、`lv` 皇冠、`best`、`n`、`at`、`skip`）。

`g.shieldUsedN` 是「已扣護盾但還沒告知使用者」的計數：`rollDay()` 累加，`Gamify.noticeShield()` 報一次後歸零。任何靜靜改變存檔的機制都該配一個這樣的欄位，否則使用者不會知道自己被救了。

## CSS 陷阱

自訂 `display` 會蓋掉瀏覽器內建的 `[hidden] { display: none }`。凡是用 `hidden` 屬性開關、又自帶 display 的元素都要補回這條（見 `.modal-root`），否則關掉的彈窗會留在畫面上擋住點擊。

## 慣例與測試

- 註解與 commit 訊息用繁體中文；註解說明「為什麼」而非「做什麼」。
- 無測試框架（刻意維持零依賴）。`tools/` 三支腳本只用 Node 內建模組：`build.js` 打包（`--check` 只驗不寫）、`verify-bundle.js` 單檔版逐區塊比對、`test-logic.js` 用 `vm` 把 data 與引擎層載進假 window。提交前三支都跑。
- `test-logic.js` 涵蓋：`node --check`、ES5 語法、資料完整性、組題、誘答、搭配詞、最小音對、時間軸、鷹架、跳關測驗、弱點怪獸對映、SRS 範圍、`matchAny`。上面各節的不變量都由它釘住。
- **新增檢查時務必確認它真的會失敗** —— 故意改壞一處跑一次。靠隨機抽樣的檢查特別容易假綠，要嘛重複抽幾十輪，要嘛把觸發條件直接餵進候選池。
- 端對端（Playwright + Chromium 開 `file://`）仍是手動，腳本與 node_modules 留在 repo 外 —— 進來就破壞零依賴。

## 現況

- 可玩 Stage 0–2 共 35 關（1028 單字、27 文法點、54 篇短文、63 個不規則動詞、14 題 Part 1、22 題 Part 2、18 組最小音對）。Stage 2 已完整。
- 可選欄位覆蓋率仍低：`lure` 55 字、`col` 12 字（29 組）、`rt` 32 字、`tl` 7 個文法點。純資料，補充不必動程式。
- Stage 3–6 共 40 關僅有標題，`ready: false`。

## 下一步 TODO

1. **Stage 3 的 10 關**（被動語態、商務字彙、Part 5 詞性判斷、Part 3/4 長對話）。Part 3/4 要新的 `Ex` 模組（一段長音檔配多題），不是補資料就能解決；Part 5 可直接吃 `rt` 的後綴詞性。
2. **兩條聲音的路都沒在真機驗過**。麥克風被 `file://` 擋住，`Speech.listen()`／`scoreSpeech()` 要走 Vercel preview；`phoneme` 反過來 —— 邏輯與降級都測得到，但「TTS 唸出來的 bag／beg／big 分不分得出來」只有真機聽得出來。
3. **畫面層零自動檢查**。CI 只驗語法、資料與組題，`views/*`／`exercises/*` 的 render 全靠手動，而題型模組已增至 16 種。要納入就得引入 Playwright，與零依賴衝突，先想清楚值不值得。
