/* ==========================================================================
   curriculum.js — 課程總表：Stage 0–6、關卡、解鎖規則、練習配方
   --------------------------------------------------------------------------
   unit.plan 說明（每個關卡要出哪些題、各幾題）：
     intro     教學卡（發音表 / 不規則動詞表 / 文法概念，不計分）
               發音表看 unit.phonics，不規則動詞表看 unit.irregular
     flashcard 單字卡學習（新字）。有這一項就會自動配拼字題，不必另外寫
     irregular 不規則動詞三態（原形 → 過去式 / 過去分詞）
     phoneme   最小音對：聽一個字，選它是哪個音／哪種拼法（題目在 data/minimal-pairs.js）
     recall    看中文選英文 / 看英文選中文
     collocate 搭配詞：把詞組裡的動詞挖空（take a ___ break）。從這關以前學過的
               字裡抽有 col 的，不限這關新教的
     listen    聽音辨義
     dictate   聽寫填空
     speak     跟讀
     grammar   文法選擇 / 改錯 / 句型轉換
     build     拖曳單字排句
     cloze     句子填空
     read      短文閱讀 + 理解題
     photo     多益 Part 1：看圖聽描述（題目在 data/toeic-p1-*.js）
     respond   多益 Part 2：應答問題（題目在 data/toeic-p2-*.js）
     convo     多益 Part 3／4：一段對話或獨白配三題（題目在 data/toeic-p34-*.js）
   --------------------------------------------------------------------------
   unit.planVocab 是「單字優先」取向（profile.track = 'vocab'）改用的配方，
   目前只有 Stage 0 的五個發音關需要：解鎖是一條鏈，想快點學句子的人也得先走完
   s0u1–s0u5，所以換的不是關卡順序而是同一關裡出哪些題 —— 新字加倍、提早出現排句，
   聽力與跟讀砍半。沒寫 planVocab 的關卡兩種取向都用 plan。
   --------------------------------------------------------------------------
   stage.ready = true 只代表「這一階段開放了」，關卡本身要有 plan 與內容才可玩；
   沒有 plan 的關卡會顯示「製作中」並鎖住，所以階段可以分批開放。
   ========================================================================== */
window.DATA_CURRICULUM = {

  stages: [

  /* ================= STAGE 0 ================= */
  {
    id: 's0', n: 0, name: '開口第一步', icon: '🌱', color: 'green',
    sub: '字母・發音・你的第一句英文',
    level: '零基礎起跑',
    desc: '這個階段完全不碰考試。目標只有一個：讓 26 個字母在你嘴巴裡活起來，並且能講出第一批完整句子。',
    ready: true,
    units: [
      { id:'s0u1', n:1, title:'字母 A–Z', icon:'🔤', boss:false,
        goal:'認得 26 個字母的名字，以及它們各自發什麼音',
        phonics:'alphabet',
        plan:[['intro',1],['flashcard',6],['listen',6],['recall',4],['speak',2]],
        planVocab:[['intro',1],['flashcard',9],['recall',5],['build',2],['listen',2],['speak',1]] },

      { id:'s0u2', n:2, title:'短母音 a e i o u', icon:'🅰️', boss:false,
        goal:'看到 cat / pen / sit / dog / cup 就能直接拼出聲音',
        phonics:'shortVowels',
        plan:[['phoneme',3],['intro',1],['flashcard',8],['listen',6],['dictate',4],['speak',2],['recall',4]],
        planVocab:[['intro',1],['flashcard',11],['recall',5],['build',3],['listen',3],['dictate',2],['speak',1]] },

      { id:'s0u3', n:3, title:'子音組合 sh ch th ph ck', icon:'🔊', boss:false,
        goal:'兩個字母黏在一起會變成新的音，這關把五組最常見的搞定',
        phonics:'digraphs',
        plan:[['phoneme',3],['intro',1],['flashcard',8],['listen',6],['dictate',4],['speak',3],['recall',4]],
        planVocab:[['intro',1],['flashcard',11],['recall',5],['build',3],['listen',3],['dictate',2],['speak',1]] },

      { id:'s0u4', n:4, title:'長母音與魔法 e', icon:'✨', boss:false,
        goal:'cap → cape、hop → hope：字尾多一個 e，母音就唸自己的名字',
        phonics:'magicE',
        plan:[['phoneme',3],['intro',1],['flashcard',8],['listen',6],['dictate',4],['speak',3],['recall',4]],
        planVocab:[['intro',1],['flashcard',11],['recall',5],['build',3],['listen',3],['dictate',2],['speak',1]] },

      { id:'s0u5', n:5, title:'KK 音標與重音', icon:'📖', boss:true,
        goal:'看得懂字典裡的 [ ] 音標，並知道重音要放哪裡',
        phonics:'kk',
        plan:[['phoneme',2],['intro',1],['flashcard',6],['listen',8],['recall',6],['speak',3],['dictate',4]],
        planVocab:[['intro',1],['flashcard',11],['recall',6],['build',3],['listen',4],['dictate',2],['speak',1]] },

      { id:'s0u6', n:6, title:'詞性入門：名詞・動詞・形容詞', icon:'🧩', boss:false,
        goal:'知道一個英文字在句子裡「扮演什麼角色」，這是全部文法的地基',
        plan:[['intro',1],['flashcard',8],['grammar',6],['recall',5],['listen',3]] },

      { id:'s0u7', n:7, title:'be 動詞與人稱代名詞', icon:'👤', boss:false,
        goal:'I am / You are / He is — 講出你的第一個完整句子',
        plan:[['intro',1],['flashcard',8],['grammar',6],['build',4],['listen',3],['speak',2],['read',1]] },

      { id:'s0u8', n:8, title:'a / an / the 與單複數', icon:'🍎', boss:false,
        goal:'一個蘋果 an apple、兩個蘋果 two apples — 冠詞與 -s 的規則',
        plan:[['intro',1],['flashcard',8],['grammar',6],['cloze',4],['build',3],['read',1]] },

      { id:'s0u9', n:9, title:'this/that 與 what/who/where', icon:'❓', boss:false,
        goal:'會指東西、會問問題，日常對話就開得了口',
        plan:[['intro',1],['flashcard',8],['grammar',5],['build',4],['listen',4],['speak',2],['read',1]] },

      { id:'s0u10', n:10, title:'數字・星期・月份・時間', icon:'⏰', boss:true,
        goal:'講得出幾點、星期幾、幾月幾號 — 這是多益聽力最常出現的資訊',
        plan:[['intro',1],['flashcard',10],['listen',8],['dictate',5],['recall',6],['speak',2],['read',1]] }
    ]
  },

  /* ================= STAGE 1 ================= */
  {
    id: 's1', n: 1, name: '日常生存', icon: '🏙️', color: 'blue',
    sub: '六大時態・助動詞・介系詞',
    level: '約 TOEIC 350–450',
    desc: '把「時間」講清楚：現在、過去、未來、正在進行。這一階段結束，你就能看懂並寫出日常生活的完整句子。',
    ready: true,
    units: [
      { id:'s1u1', n:11, title:'一般動詞現在式', icon:'🏃', boss:false,
        goal:'I work / He works — 第三人稱單數那個 -s 是台灣人最常掉的分',
        plan:[['collocate',2],['intro',1],['flashcard',8],['grammar',6],['cloze',5],['build',3],['listen',3],['read',1]] },

      { id:'s1u2', n:12, title:'否定與疑問：don\'t / Does', icon:'🚫', boss:false,
        goal:'會說「我不…」和「你有沒有…？」',
        plan:[['intro',1],['flashcard',8],['grammar',6],['build',4],['listen',4],['speak',2],['read',1]] },

      { id:'s1u3', n:13, title:'現在進行式 be + Ving', icon:'⏳', boss:false,
        goal:'「他正在打電話」— 多益 Part 1 看圖題幾乎全用這個時態',
        plan:[['collocate',2],['intro',1],['flashcard',8],['grammar',6],['cloze',4],['listen',4],['build',3],['read',1]] },

      { id:'s1u4', n:14, title:'過去的 be 動詞 was / were', icon:'🕰️', boss:false,
        goal:'把 am/is/are 搬到過去',
        plan:[['intro',1],['flashcard',8],['grammar',6],['cloze',5],['build',3],['listen',3],['read',1]] },

      { id:'s1u5', n:15, title:'過去式與不規則動詞', icon:'📜', boss:true,
        goal:'規則加 -ed，不規則的 63 個只能背 — 這關是第一道真正的門檻',
        irregular:true,
        plan:[['collocate',2],['intro',1],['flashcard',10],['irregular',8],['grammar',8],['cloze',6],['dictate',4],['build',4],['read',1]] },

      { id:'s1u6', n:16, title:'未來式 will / be going to', icon:'🔮', boss:false,
        goal:'兩種未來的差別：臨時決定 vs 早就計畫好',
        plan:[['collocate',2],['intro',1],['flashcard',8],['grammar',6],['cloze',4],['build',4],['listen',3],['read',1]] },

      { id:'s1u7', n:17, title:'地方介系詞 in / on / at', icon:'📍', boss:false,
        goal:'in the room、on the desk、at the door — 小字最要命',
        plan:[['intro',1],['flashcard',8],['grammar',6],['cloze',6],['listen',4],['read',1]] },

      { id:'s1u8', n:18, title:'時間介系詞與頻率副詞', icon:'📅', boss:false,
        goal:'at 7:00 / on Monday / in May，加上 always・usually・never',
        plan:[['intro',1],['flashcard',8],['grammar',6],['cloze',6],['listen',4],['build',3],['read',1]] },

      { id:'s1u9', n:19, title:'助動詞 can / should / must', icon:'🔑', boss:false,
        goal:'能力、建議、義務 — 職場英文天天用',
        plan:[['collocate',2],['intro',1],['flashcard',8],['grammar',6],['cloze',5],['build',4],['speak',2],['read',1]] },

      { id:'s1u10', n:20, title:'形容詞・副詞・比較級', icon:'📊', boss:true,
        goal:'bigger / the biggest / more important — 加 -er 還是加 more？',
        plan:[['intro',1],['flashcard',10],['grammar',8],['cloze',6],['build',4],['listen',3],['read',1]] },

      { id:'s1u11', n:21, title:'連接詞 and / but / because / so', icon:'🔗', boss:false,
        goal:'把兩個短句黏成一個長句，文章立刻變順',
        plan:[['intro',1],['flashcard',8],['grammar',6],['build',5],['cloze',4],['read',1]] },

      { id:'s1u12', n:22, title:'There is / are 與數量詞', icon:'📦', boss:false,
        goal:'「有…」怎麼講，以及 many / much / a few / a little 的差別',
        plan:[['intro',1],['flashcard',8],['grammar',6],['cloze',5],['build',4],['listen',3],['read',1]] },

      { id:'s1u13', n:23, title:'所有格 my / mine / Tom\'s', icon:'🔖', boss:false,
        goal:'「誰的」三種寫法一次弄懂',
        plan:[['intro',1],['flashcard',8],['grammar',6],['cloze',5],['build',3],['read',1]] },

      { id:'s1u14', n:24, title:'祈使句・Let\'s・Would you like', icon:'🙋', boss:false,
        goal:'請求、提議、邀請 — 多益 Part 2 應答題的核心句型',
        plan:[['intro',1],['flashcard',8],['grammar',6],['build',4],['listen',4],['speak',3],['read',1]] },

      { id:'s1u15', n:25, title:'Stage 1 大魔王測驗', icon:'👑', boss:true,
        goal:'時態、介系詞、助動詞、比較級全部混在一起考',
        plan:[['collocate',2],['grammar',10],['cloze',8],['build',5],['listen',6],['dictate',4],['read',2],['recall',8]] }
    ]
  },

  /* ============ STAGE 2（開放中：U26–27 已完成，其餘製作中） ============ */
  {
    id: 's2', n: 2, name: '生活溝通', icon: '💬', color: 'purple',
    sub: '完成式・不定詞/動名詞・關係代名詞',
    level: '約 TOEIC 500–600',
    desc: '開始處理比較長的句子：現在完成式、to V 與 Ving 的取捨、用 who/which 把兩句合成一句。多益 Part 1、Part 2 正式登場。',
    ready: true,
    units: [
      { id:'s2u1', n:26, title:'現在完成式 have + p.p.', icon:'✅',
        goal:'搞懂「做完了」和「做過了」差在哪，並且會用 already / yet / just / ever',
        plan:[['collocate',2],['intro',1],['flashcard',10],['recall',6],['listen',5],['grammar',6],
              ['cloze',4],['build',3],['photo',2],['respond',2],['read',1]] },

      { id:'s2u2', n:27, title:'完成式 vs 過去式', icon:'⚖️',
        goal:'看到 yesterday 就用過去式、看到 since 就用完成式 —— 多益 Part 5 的常客',
        plan:[['intro',1],['flashcard',10],['recall',6],['listen',4],['grammar',7],
              ['cloze',4],['dictate',3],['photo',2],['respond',3],['read',1]] },
      { id:'s2u3', n:28, title:'不定詞 to V', icon:'🎯',
        goal:'搞懂哪些動詞後面要接 to V，以及「為了…」怎麼說',
        plan:[['collocate',2],['intro',1],['flashcard',10],['recall',6],['listen',4],['grammar',7],
              ['cloze',4],['build',3],['read',1]] },

      { id:'s2u4', n:29, title:'動名詞 Ving', icon:'🔁',
        goal:'記住接 Ving 的動詞，並學會「介系詞後面一律 Ving」這條鐵則',
        plan:[['intro',1],['flashcard',10],['recall',6],['listen',4],['grammar',7],
              ['cloze',4],['build',3],['read',1]] },

      { id:'s2u5', n:30, title:'to V 還是 Ving？', icon:'🤔', boss:true,
        goal:'兩種用法混在一起考，包括 remember／forget／stop／try 換意思的陷阱',
        plan:[['collocate',2],['intro',1],['flashcard',10],['recall',6],['grammar',9],['cloze',5],
              ['build',4],['dictate',3],['read',1]] },

      { id:'s2u6', n:31, title:'關係代名詞 who / which / that', icon:'🪢',
        goal:'用 who／which 把兩個短句合成一個長句，並且不要重複放代名詞',
        plan:[['intro',1],['flashcard',10],['recall',6],['listen',4],['grammar',7],
              ['cloze',4],['build',4],['read',2]] },

      { id:'s2u7', n:32, title:'間接問句', icon:'💭',
        goal:'把問句包進 Could you tell me… 之後，語序要變回主詞＋動詞',
        plan:[['intro',1],['flashcard',10],['recall',6],['listen',4],['grammar',7],
              ['cloze',4],['build',3],['respond',2],['read',2]] },

      { id:'s2u8', n:33, title:'多益 Part 1：看圖聽描述', icon:'🖼️',
        goal:'八張照片連續作答，訓練「只靠耳朵判斷動作與對象」',
        plan:[['photo',8],['recall',4],['listen',4]] },

      { id:'s2u9', n:34, title:'多益 Part 2：應答問題', icon:'🎧',
        goal:'聽開頭的疑問詞就決定答案，並認出 Yes/No 與同字陷阱',
        plan:[['respond',10],['recall',4],['listen',4]] },

      { id:'s2u10', n:35, title:'Stage 2 魔王測驗', icon:'👑', boss:true,
        goal:'完成式、不定詞、動名詞、關係代名詞、間接問句與 Part 1／Part 2 全部混合',
        plan:[['collocate',2],['grammar',10],['cloze',6],['build',4],['listen',5],['dictate',4],
              ['photo',2],['respond',3],['read',2],['recall',8]] }
    ]
  },
  {
    id: 's3', n: 3, name: '職場基礎', icon: '💼', color: 'blue',
    sub: '被動語態・商務字彙・Part 3/4/5',
    level: '約 TOEIC 650–750',
    desc: '正式進入多益的主戰場：辦公室、會議、訂單、出差、人事。被動語態與商務字彙是這一階段的兩根柱子。',
    ready: true,
    units: [
      { id:'s3u1', n:36, title:'被動語態 be + p.p.', icon:'🔄',
        goal:'公告與通知有一半是被動句 —— 先看懂「事情被做了」怎麼寫',
        plan:[['collocate',2],['intro',1],['flashcard',10],['recall',6],['listen',4],['grammar',7],
              ['cloze',4],['build',3],['read',1]] },

      { id:'s3u2', n:37, title:'主動改被動', icon:'↔️',
        goal:'認得出主動句與被動句是同一件事，並知道哪些動詞不能改被動',
        plan:[['intro',1],['flashcard',10],['recall',6],['listen',4],['grammar',7],
              ['cloze',4],['build',3],['dictate',3],['read',1]] },

      { id:'s3u3', n:38, title:'商務字彙：辦公室與設備', icon:'🖨️',
        goal:'影印機、檔案櫃、維修、權限 —— 辦公室情境的二十個高頻字',
        plan:[['collocate',2],['flashcard',12],['recall',7],['listen',5],['spell',4],
              ['cloze',3],['build',3],['respond',2],['read',1]] },

      { id:'s3u4', n:39, title:'商務字彙：會議與簡報', icon:'📊',
        goal:'議程、講義、會議紀錄、提案 —— 開會從頭到尾會用到的字',
        plan:[['collocate',2],['flashcard',12],['recall',7],['listen',5],['spell',4],
              ['cloze',3],['build',3],['respond',2],['read',1]] },

      { id:'s3u5', n:40, title:'商務字彙：訂單與付款', icon:'🧾', boss:true,
        goal:'invoice 與 receipt 差在哪、保固涵蓋什麼 —— 多益最常考的一組情境',
        plan:[['collocate',2],['flashcard',12],['recall',8],['listen',5],['spell',4],
              ['grammar',4],['cloze',4],['build',3],['photo',2],['respond',2],['read',1]] },

      { id:'s3u6', n:41, title:'商務字彙：出差與交通', icon:'✈️',
        goal:'行程表、登機、延誤、報帳 —— 出差一趟會遇到的所有字',
        plan:[['collocate',2],['flashcard',12],['recall',7],['listen',5],['spell',4],
              ['cloze',3],['build',3],['respond',2],['read',1]] },

      { id:'s3u7', n:42, title:'商務字彙：人事與招聘', icon:'👔',
        goal:'應徵者、面試、資歷、升遷 —— 徵才啟事與面試對話的核心字',
        plan:[['collocate',2],['flashcard',12],['recall',7],['listen',5],['spell',4],
              ['cloze',3],['build',3],['respond',2],['read',1]] },

      { id:'s3u8', n:43, title:'Part 5 詞性判斷題', icon:'🔍',
        goal:'四個選項是同一個字的四種詞性時，看字尾就能選，不必看懂句子',
        /* flashcard 是 11 不是 12：這一關只收了 11 個字，寫 12 只會少排一題 */
        plan:[['intro',1],['flashcard',11],['recall',6],['grammar',9],['cloze',5],
              ['listen',3],['build',2]] },

      { id:'s3u9', n:44, title:'Part 3/4 聽長對話', icon:'🗣️',
        goal:'一段對話配三個問題 —— 練「先看題目再聽」，而不是逐字聽懂',
        plan:[['convo',3],['recall',5],['listen',4],['respond',2]] },

      { id:'s3u10', n:45, title:'Stage 3 魔王測驗', icon:'👑', boss:true,
        goal:'被動語態、五組商務字彙、詞性判斷與 Part 3／4 全部混合',
        plan:[['collocate',2],['convo',2],['grammar',10],['cloze',6],['build',4],['listen',5],
              ['dictate',4],['photo',2],['respond',3],['recall',10],['read',1]] }
    ]
  },
  {
    id: 's4', n: 4, name: '多益核心', icon: '🎯', color: 'gold',
    sub: '假設語氣・分詞構句・Part 6/7',
    level: '約 TOEIC 800–860',
    desc: '句子開始變長變複雜。假設語氣、分詞構句、片語動詞，加上雙篇閱讀的跨篇找答案技巧。',
    ready: true,
    units: [
      { id:'s4u1', n:46, title:'假設語氣 if 三種型', icon:'🌀',
        goal:'分得出「有可能」「純假設」「後悔」三種 if，而且知道時態要往回退一格',
        plan:[['collocate',2],['intro',1],['flashcard',10],['recall',6],['listen',4],['grammar',8],
              ['cloze',4],['build',3],['read',1]] },

      { id:'s4u2', n:47, title:'分詞構句', icon:'✂️',
        goal:'看懂句首那串 -ing／-ed 是誰做的 —— 主詞被省略了，但它一定是後半句的主詞',
        plan:[['intro',1],['flashcard',10],['recall',6],['listen',4],['grammar',8],
              ['cloze',4],['build',3],['dictate',3],['read',1]] },

      { id:'s4u3', n:48, title:'片語動詞', icon:'🧷',
        goal:'動詞加一個介系詞就換一個意思 —— 這些字每個都認得，合起來卻看不懂',
        /* spell 寫 0：這一關的字全是片語動詞，中間有空格，
           用字母銀行拼「hand over」根本拼不出那個空格。不寫的話會被自動配上。 */
        plan:[['collocate',2],['intro',1],['flashcard',12],['recall',8],['listen',5],['spell',0],
              ['cloze',4],['build',3],['grammar',4],['read',1]] },

      { id:'s4u4', n:49, title:'易混淆字組', icon:'👯',
        goal:'長得像、詞性不同的字組 —— 多益 Part 5 有一整批題目就在考這個',
        plan:[['intro',1],['flashcard',12],['recall',8],['listen',5],['spell',4],
              ['grammar',5],['cloze',4],['build',3],['read',1]] },

      { id:'s4u5', n:50, title:'Part 6 段落填空', icon:'📝', boss:true,
        goal:'空格的答案在別的句子裡 —— 這是 Part 6 和 Part 5 唯一的差別',
        plan:[['part6',2],['grammar',5],['cloze',4],['recall',6],['listen',3],['read',1]] },

      { id:'s4u6', n:51, title:'Part 7 單篇閱讀', icon:'📄',
        goal:'一篇長文章配三到四題 —— 練「先看題目再回頭找」，不要從第一個字讀到最後',
        plan:[['read',2],['recall',6],['cloze',3],['listen',3],['grammar',3]] },

      { id:'s4u7', n:52, title:'Part 7 雙篇閱讀', icon:'📑',
        goal:'兩份文件配五題，其中一定有一題的答案要兩篇合起來看才找得到',
        plan:[['part7',1],['recall',6],['cloze',3],['listen',3],['grammar',3]] },

      { id:'s4u8', n:53, title:'同義改寫辨識', icon:'🔤',
        goal:'選項不會照抄原文 —— 認得出「同一件事換句話說」才選得對',
        plan:[['intro',1],['flashcard',10],['recall',7],['grammar',8],['cloze',4],
              ['listen',4],['build',3],['read',1]] },

      { id:'s4u9', n:54, title:'閱讀速度訓練', icon:'⚡',
        goal:'把速度推到多益要求的 150 字／分 —— 讀完一篇的時間比讀懂每個字重要',
        plan:[['read',3],['recall',8],['listen',4],['cloze',3]] },

      { id:'s4u10', n:55, title:'Stage 4 魔王測驗', icon:'👑', boss:true,
        goal:'假設語氣、分詞構句、片語動詞、易混淆字，加上 Part 6 與雙篇閱讀全部混合',
        plan:[['collocate',2],['part6',1],['part7',1],['grammar',10],['cloze',6],['build',4],
              ['listen',5],['dictate',4],['recall',10],['read',1]] }
    ]
  },
  {
    id: 's5', n: 5, name: '高分衝刺', icon: '🔥', color: 'red',
    sub: '長難句・倒裝・干擾選項・全真模考',
    level: '約 TOEIC 880–950',
    desc: '這裡開始練的不是「懂不懂」，而是「快不快、穩不穩」。長難句拆解、辨識出題者設的陷阱、完整模考節奏。',
    ready: true,
    units: [
      { id:'s5u1', n:56, title:'長難句拆解法', icon:'🪚',
        goal:'一個句子只有一個主要動詞 —— 找到它，三十個字的句子就縮成五個字',
        plan:[['intro',1],['flashcard',10],['parse',4],['recall',6],['listen',4],
              ['grammar',8],['cloze',4],['build',3],['read',1]] },

      { id:'s5u2', n:57, title:'Part 7 三篇閱讀', icon:'📚',
        goal:'三份文件配五題 —— 線索被拆成三段，有一題要對到第三份才湊得出答案',
        plan:[['part7',1],['recall',6],['cloze',3],['listen',3],['grammar',3]] },

      { id:'s5u3', n:58, title:'干擾選項的五種套路', icon:'🎭',
        goal:'錯的選項只有五種錯法 —— 認得出來，四選一就變成二選一',
        plan:[['intro',1],['flashcard',10],['recall',7],['listen',4],['grammar',8],
              ['cloze',3],['build',3],['read',1]] },

      { id:'s5u4', n:59, title:'聽力預讀技巧', icon:'👀',
        /* 這一關沒有自己的單字，所以配方不寫 flashcard —— 練的是聽之前那幾秒
           要做什麼，不是再背十個字。 */
        goal:'題目印在題本上，音檔開始前先讀完 —— 知道要找什麼才聽得出哪一句是答案',
        plan:[['intro',1],['convo',2],['recall',6],['listen',4],['dictate',3],
              ['grammar',5],['cloze',3]] },

      { id:'s5u5', n:60, title:'全真模考 ①', icon:'🧪', boss:true,
        goal:'Part 1 到 Part 7 全部混在一起跑一次，看自己在哪一段掉下來',
        plan:[['photo',2],['respond',3],['convo',1],['part6',1],['part7',1],
              ['grammar',5],['cloze',4],['recall',6],['listen',3],['read',1]] },

      { id:'s5u6', n:61, title:'低頻高階字彙', icon:'💠',
        goal:'詞頻排到一萬名外，但多益的商務語境天天用的那一批字',
        plan:[['flashcard',14],['recall',9],['spell',4],['listen',5],['cloze',4],
              ['build',3],['read',1]] },

      { id:'s5u7', n:62, title:'倒裝與假設語氣進階', icon:'🔄',
        goal:'句首放了否定副詞就要倒裝；if 可以省略，代價是把 had／were／should 提到最前面',
        plan:[['intro',1],['flashcard',8],['parse',3],['recall',6],['listen',4],
              ['grammar',8],['cloze',4],['build',3],['read',1]] },

      { id:'s5u8', n:63, title:'推論題專攻', icon:'🧠',
        goal:'問「可以推論出什麼」時答案不會照抄原文，但一定站在文章某一句話上',
        plan:[['intro',1],['flashcard',10],['recall',7],['listen',4],['grammar',6],
              ['cloze',3],['build',3],['read',2]] },

      { id:'s5u9', n:64, title:'全真模考 ②', icon:'🧪',
        goal:'第二次全科混考，這次加上聽寫 —— 聽得懂和寫得出來是兩件事',
        plan:[['photo',2],['respond',3],['convo',1],['part6',1],['part7',1],
              ['grammar',6],['cloze',5],['recall',8],['listen',4],['dictate',3],['read',1]] },

      { id:'s5u10', n:65, title:'Stage 5 魔王測驗', icon:'👑', boss:true,
        goal:'長難句、倒裝、假設語氣進階、干擾選項、推論題，加上 Part 6 與三篇閱讀全部混合',
        plan:[['parse',3],['part6',1],['part7',1],['convo',1],['grammar',10],['cloze',6],
              ['build',4],['listen',5],['dictate',4],['recall',10],['read',1]] }
    ]
  },
  {
    id: 's6', n: 6, name: '滿分狙擊', icon: '🏆', color: 'gold',
    sub: '極速閱讀・零失誤複習',
    level: 'TOEIC 950–990',
    desc: '只剩最後那幾題。這階段沒有新知識，只有把弱點一個一個狙掉，以及把速度推到 Part 7 剩 10 分鐘檢查。',
    ready: false,
    units: [
      { id:'s6u1', n:66, title:'Part 7 極速閱讀（55 分鐘）', icon:'⚡' },
      { id:'s6u2', n:67, title:'聽力零失誤訓練', icon:'🎧' },
      { id:'s6u3', n:68, title:'弱點狙擊：個人錯題重練', icon:'🎯' },
      { id:'s6u4', n:69, title:'罕見題型收集', icon:'🗃️' },
      { id:'s6u5', n:70, title:'滿分模考 ①', icon:'💯', boss:true },
      { id:'s6u6', n:71, title:'滿分模考 ②', icon:'💯' },
      { id:'s6u7', n:72, title:'考前 7 天複習表', icon:'📆' },
      { id:'s6u8', n:73, title:'考場節奏演練', icon:'⏱️' },
      { id:'s6u9', n:74, title:'滿分模考 ③', icon:'💯' },
      { id:'s6u10', n:75, title:'990', icon:'👑', boss:true }
    ]
  }

  ],

  /* ---------- 過關標準 ---------- */
  rules: {
    passRate: 0.7,        // 正確率 70% 以上才算過關
    skipPass: 0.85,       // 跳關測驗的及格線：要證明「這關不用上」就得比過關更嚴（8 題只能錯 1 題）
    star2: 0.85,          // 2 星
    star3: 1.0,           // 3 星（全對）
    xpPerCorrect: 4,
    xpPerLesson: 20,
    xpBossBonus: 30,
    xpPerfectBonus: 15,
    gemPerLesson: 2,
    gemPerBoss: 10,
    gemPerStreak7: 15
  }
};
