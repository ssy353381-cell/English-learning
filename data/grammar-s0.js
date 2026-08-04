/* ==========================================================================
   grammar-s0.js — Stage 0 文法點
   欄位：id / u 關卡 / title
        teach  教學卡（sections 語法與 phonics.js 相同）
        sents  練習句（給拖曳排句、聽寫、聽力用）
        qs     題目：k = mc 選擇 / cloze 填空 / fix 改錯 / trans 中翻英
   ========================================================================== */
window.DATA_GRAMMAR_S0 = [

/* ============================================================ U6 詞性 */
{
  id:'g0601', u:'s0u6', title:'名詞、動詞、形容詞',
  teach:{
    title:'一個字在句子裡扮演什麼角色',
    lead:'學文法之前，得先知道每個字「是做什麼的」。英文句子就像一齣戲，每種詞性有固定的位置。搞懂這件事，後面所有規則都會變簡單。',
    sections:[
      { h:'三種最重要的詞性',
        table:{ head:['詞性','是什麼','中文怎麼想','例子'],
          rows:[
            ['名詞 <b>n.</b>','人、事、物、地方','可以「指得出來」的東西','teacher 老師、water 水、city 城市'],
            ['動詞 <b>v.</b>','動作或狀態','「做什麼」','walk 走、drink 喝、is 是'],
            ['形容詞 <b>adj.</b>','形容名詞','「怎麼樣的」','happy 快樂的、new 新的、big 大的']
          ] } },
      { h:'還有兩種常出現的',
        table:{ head:['詞性','功用','例子'],
          rows:[
            ['副詞 <b>adv.</b>','形容動詞：「怎麼做」','quickly 快速地、slowly 慢慢地、well 很好地'],
            ['代名詞 <b>pron.</b>','代替名詞','I 我、she 她、it 它']
          ] } },
      { h:'英文句子的基本骨架',
        formula:'誰（名詞） ＋ 做什麼（動詞） ＋ 什麼（名詞）',
        formulaNote:'中文也是一樣：「我 / 喝 / 水」',
        ex:[
          ['I drink water.','我喝水。'],
          ['She teaches English.','她教英文。'],
          ['The manager opens the door.','經理打開門。']
        ] },
      { h:'形容詞放在名詞「前面」',
        p:'這是中文和英文最像的地方之一：<b>a new car</b>（一台新車）、<b>a busy day</b>（忙碌的一天）。',
        ex:[
          ['I have a new bag.','我有一個新包包。'],
          ['It is a busy morning.','這是個忙碌的早上。']
        ],
        tip:'多益 Part 5 有大量題目就是在考「這個空格該填名詞、動詞、形容詞還是副詞」。現在打好底，那時候會輕鬆很多。' },
      { h:'副詞通常放在句尾或動詞後面',
        ex:[
          ['She speaks slowly.','她說得很慢。'],
          ['He works hard every day.','他每天努力工作。']
        ],
        warn:'注意：<b>hard</b> 是「努力地」，<b>hardly</b> 是「幾乎不」。意思完全相反，多益很愛考。' }
    ]
  },
  sents:[
    ['I drink water.','我喝水。'],
    ['She teaches English.','她教英文。'],
    ['He works hard.','他努力工作。'],
    ['We have a new manager.','我們有一位新經理。'],
    ['The city is very big.','這座城市很大。'],
    ['Please speak slowly.','請說慢一點。'],
    ['The store opens早','']
  ],
  qs:[
    { k:'mc', q:'She is a good ___.', opts:['teach','teacher','teaching','taught'], a:1,
      zh:'她是一位好老師。', why:'冠詞 a 和形容詞 good 後面要接<b>名詞</b>，teacher（老師）才是名詞。' },
    { k:'mc', q:'He ___ to work every day.', opts:['walk','walks','walking','walked'], a:1,
      zh:'他每天走路上班。', why:'主詞 He 是第三人稱單數，現在式動詞要加 -s。' },
    { k:'mc', q:'This is a ___ computer.', opts:['new','newly','news','newer'], a:0,
      zh:'這是一台新電腦。', why:'形容名詞 computer 要用<b>形容詞</b> new。newly 是副詞。' },
    { k:'mc', q:'Please speak ___.', opts:['slow','slowly','slower','slowness'], a:1,
      zh:'請說慢一點。', why:'形容動詞 speak 要用<b>副詞</b>，slow 加 -ly 變 slowly。' },
    { k:'mc', q:'The manager ___ the door.', opts:['open','opens','opening','opener'], a:1,
      zh:'經理打開門。', why:'The manager 是單數第三人稱，動詞要加 -s。' },
    { k:'mc', q:'我 / 喝 / 水 的英文順序是？', opts:['Water I drink.','I water drink.','I drink water.','Drink I water.'], a:2,
      zh:'我喝水。', why:'英文的骨架是「主詞 + 動詞 + 受詞」，跟中文一樣。' },
    { k:'fix', q:'She is a very good teach.', a:'She is a very good teacher.',
      zh:'她是一位非常好的老師。', hint:'a 後面要接名詞', why:'teach 是動詞，名詞要用 teacher。' },
    { k:'fix', q:'He works very hardly.', a:'He works very hard.',
      zh:'他工作非常努力。', hint:'hardly 不是「努力地」', why:'hard 本身就是副詞「努力地」；hardly 意思是「幾乎不」。' },
    { k:'cloze', q:'She ___ English at a high school.', a:'teaches', alt:['teach'],
      zh:'她在高中教英文。', why:'She 是第三人稱單數，teach 要變成 teaches。' },
    { k:'cloze', q:'It is a ___ day today.', a:'busy',
      zh:'今天是忙碌的一天。', why:'day 前面要放形容詞。' },
    { k:'cloze', q:'The bus moves very ___.', a:'slowly', alt:['slow'],
      zh:'公車開得很慢。', why:'形容動詞 moves 要用副詞 slowly。' },
    { k:'trans', zh:'我喜歡我的新工作。', a:'I like my new job.', alt:['I like my new job'],
      why:'形容詞 new 放在名詞 job 前面。' }
  ]
},

/* ============================================================ U7 be 動詞 */
{
  id:'g0701', u:'s0u7', title:'be 動詞與人稱代名詞',
  teach:{
    title:'am / is / are — 你的第一個完整句子',
    lead:'be 動詞就是中文的「是」。它是英文裡最常用的動詞，也是最容易錯的。規則只有三行，但一定要背到反射動作。',
    sections:[
      { formula:'I → am　　　he / she / it → is　　　you / we / they → are',
        formulaNote:'口訣：「我 am，你們我們他們 are，剩下都是 is」' },
      { h:'完整對照表',
        table:{ speak:true, head:['主詞','be 動詞','例句','中文'],
          rows:[
            ['I','am','I am a student.','我是學生。'],
            ['You','are','You are my friend.','你是我的朋友。'],
            ['He','is','He is a manager.','他是經理。'],
            ['She','is','She is busy.','她很忙。'],
            ['It','is','It is a good idea.','那是個好主意。'],
            ['We','are','We are ready.','我們準備好了。'],
            ['They','are','They are in the office.','他們在辦公室。']
          ] } },
      { h:'be 動詞不只是「是」，也可以是「在」',
        ex:[
          ['I am in the office.','我在辦公室。'],
          ['The report is on your desk.','報告在你桌上。'],
          ['They are at the airport.','他們在機場。']
        ],
        tip:'看到 be 動詞後面接地點，就翻成「在」；接名詞或形容詞，就翻成「是」。' },
      { h:'否定：be 動詞後面加 not',
        formula:'I am not　/　He is not (isn\'t)　/　They are not (aren\'t)',
        ex:[
          ['I am not busy.','我不忙。'],
          ['She is not in the office.','她不在辦公室。'],
          ['They are not ready.','他們還沒準備好。']
        ] },
      { h:'疑問：把 be 動詞搬到最前面',
        formula:'You are ready.　→　Are you ready?',
        ex:[
          ['Are you a student?','你是學生嗎？'],
          ['Is she in the meeting?','她在開會嗎？'],
          ['Are they from Japan?','他們來自日本嗎？']
        ],
        warn:'台灣人最常犯的錯：<b>I am agree.</b> ❌　→　<b>I agree.</b> ✅　agree 本身就是動詞，不需要 be 動詞。一個句子只能有一個主要動詞。' },
      { h:'所有格：誰的東西',
        table:{ head:['人','所有格','例子'],
          rows:[['I','my','my bag 我的包包'],['you','your','your desk 你的桌子'],
                ['he','his','his job 他的工作'],['she','her','her car 她的車'],
                ['we','our','our office 我們的辦公室'],['they','their','their team 他們的團隊']] } }
    ]
  },
  sents:[
    ['I am a student.','我是學生。'],
    ['She is my sister.','她是我姊姊。'],
    ['We are ready.','我們準備好了。'],
    ['He is not busy today.','他今天不忙。'],
    ['Are you a manager?','你是經理嗎？'],
    ['They are in the meeting room.','他們在會議室。'],
    ['My name is Amy.','我的名字是艾咪。'],
    ['The report is on my desk.','報告在我桌上。'],
    ['Is she from Taiwan?','她來自台灣嗎？'],
    ['You are very kind.','你人真好。']
  ],
  qs:[
    { k:'mc', q:'I ___ a student.', opts:['am','is','are','be'], a:0,
      zh:'我是學生。', why:'主詞是 I，一定配 am。' },
    { k:'mc', q:'She ___ my sister.', opts:['am','is','are','be'], a:1,
      zh:'她是我姊姊。', why:'She 是第三人稱單數，配 is。' },
    { k:'mc', q:'They ___ in the office now.', opts:['am','is','are','be'], a:2,
      zh:'他們現在在辦公室。', why:'They 是複數，配 are。' },
    { k:'mc', q:'___ you ready?', opts:['Am','Is','Are','Do'], a:2,
      zh:'你準備好了嗎？', why:'You 配 are，疑問句把 are 提到最前面。' },
    { k:'mc', q:'This is ___ bag.', opts:['I','me','my','mine bag'], a:2,
      zh:'這是我的包包。', why:'名詞前面要用所有格 my。' },
    { k:'mc', q:'He ___ not the new manager.', opts:['am','is','are','do'], a:1,
      zh:'他不是新來的經理。', why:'He 配 is，否定就是 is not。' },
    { k:'mc', q:'The keys ___ on the desk.', opts:['is','am','are','be'], a:2,
      zh:'鑰匙在桌上。', why:'keys 是複數，配 are。' },
    { k:'fix', q:'I am agree with you.', a:'I agree with you.',
      zh:'我同意你。', hint:'agree 已經是動詞了', why:'一個句子只能有一個主要動詞，agree 前面不能加 be 動詞。' },
    { k:'fix', q:'She are my manager.', a:'She is my manager.',
      zh:'她是我的經理。', hint:'She 要配哪個 be 動詞？', why:'第三人稱單數配 is。' },
    { k:'fix', q:'Is you from Taiwan?', a:'Are you from Taiwan?',
      zh:'你來自台灣嗎？', hint:'you 配哪一個？', why:'you 一律配 are，即使只有一個人。' },
    { k:'cloze', q:'I ___ very tired today.', a:'am',
      zh:'我今天很累。', why:'I 配 am。' },
    { k:'cloze', q:'He ___ an engineer.', a:'is',
      zh:'他是工程師。', why:'He 配 is。engineer 是母音開頭，所以用 an。' },
    { k:'cloze', q:'We ___ not ready yet.', a:'are',
      zh:'我們還沒準備好。', why:'We 配 are。' },
    { k:'cloze', q:'This is ___ office. (我們的)', a:'our',
      zh:'這是我們的辦公室。', why:'we 的所有格是 our。' },
    { k:'cloze', q:'___ she in the meeting?', a:'Is',
      zh:'她在開會嗎？', why:'She 配 is，疑問句放句首並大寫。' },
    { k:'trans', zh:'我是一位工程師。', a:'I am an engineer.', alt:['I\'m an engineer.'],
      why:'engineer 是母音開頭，冠詞用 an。' },
    { k:'trans', zh:'他們不在辦公室。', a:'They are not in the office.', alt:['They aren\'t in the office.'],
      why:'be 動詞後面加 not 表示否定。' },
    { k:'trans', zh:'你是新來的經理嗎？', a:'Are you the new manager?', alt:['Are you a new manager?'],
      why:'疑問句把 are 提到句首。' }
  ]
},

/* ============================================================ U8 冠詞與單複數 */
{
  id:'g0801', u:'s0u8', title:'a / an / the 與單複數',
  teach:{
    title:'一個、兩個、還是「那一個」',
    lead:'中文不太在意「一個」還是「兩個」，但英文非常在意。名詞前面幾乎一定要有東西，這是台灣人最容易漏掉的地方。',
    sections:[
      { h:'a 還是 an？看「聲音」不是看字母',
        formula:'子音開頭 → a　　母音開頭 → an',
        table:{ speak:true, head:['a（子音音開頭）','an（母音音開頭）'],
          rows:[['a book 一本書','an apple 一顆蘋果'],
                ['a car 一台車','an email 一封信'],
                ['a manager 一位經理','an engineer 一位工程師'],
                ['a university 一所大學','an hour 一小時']] },
        warn:'university 雖然是 u 開頭，但唸起來是 /ju/（有子音音），所以用 <b>a</b>。hour 的 h 不發音，唸起來是母音，所以用 <b>an</b>。判斷標準永遠是<b>發音</b>。' },
      { h:'a/an 和 the 的差別',
        table:{ head:['','用法','例子'],
          rows:[
            ['a / an','隨便一個，第一次提到','I need <b>a</b> pen.（我需要一支筆，哪支都行）'],
            ['the','特定的那一個，雙方都知道','Pass me <b>the</b> pen.（把那支筆給我）']
          ] },
        ex:[
          ['I have a question. The question is about the price.','我有個問題。這個問題是關於價格的。'],
          ['She works in an office. The office is downtown.','她在一間辦公室工作。那間辦公室在市中心。']
        ] },
      { h:'複數：大部分加 -s',
        table:{ head:['規則','怎麼加','例子'],
          rows:[
            ['一般','+ s','book → books、car → cars'],
            ['s, x, sh, ch 結尾','+ es','bus → buses、box → boxes、watch → watches'],
            ['子音 + y 結尾','y → ies','city → cities、company → companies'],
            ['f / fe 結尾','→ ves','life → lives、knife → knives']
          ] } },
      { h:'不規則複數：只能背',
        table:{ speak:true, head:['單數','複數','中文'],
          rows:[['man','men','男人'],['woman','women','女人'],['child','children','小孩'],
                ['person','people','人'],['foot','feet','腳'],['tooth','teeth','牙齒']] } },
      { h:'不可數名詞：不能加 s，也不能用 a',
        p:'水、錢、資訊、建議這類「無法一個一個數」的東西：',
        table:{ head:['❌ 錯','✅ 對'],
          rows:[['a water','some water 一些水'],
                ['two informations','two pieces of information 兩則資訊'],
                ['many moneys','a lot of money 很多錢'],
                ['an advice','some advice 一些建議']] },
        tip:'多益很愛考 information、advice、equipment、furniture、news — 這些全部<b>不可數</b>，永遠不加 s。' }
    ]
  },
  sents:[
    ['I need a pen.','我需要一支筆。'],
    ['She is an engineer.','她是工程師。'],
    ['The office is closed today.','辦公室今天沒開。'],
    ['We have three meetings today.','我們今天有三場會議。'],
    ['There are many people here.','這裡有很多人。'],
    ['I want some water.','我想要一些水。'],
    ['The boxes are in the car.','箱子在車上。'],
    ['Two children are waiting.','兩個小孩在等。']
  ],
  qs:[
    { k:'mc', q:'She is ___ engineer.', opts:['a','an','the','—'], a:1,
      zh:'她是一位工程師。', why:'engineer 是母音開頭，用 an。' },
    { k:'mc', q:'I need ___ pen.', opts:['a','an','some','the a'], a:0,
      zh:'我需要一支筆。', why:'pen 是子音開頭的單數可數名詞，用 a。' },
    { k:'mc', q:'We waited for ___ hour.', opts:['a','an','the','two'], a:1,
      zh:'我們等了一小時。', why:'hour 的 h 不發音，唸起來像母音，用 an。' },
    { k:'mc', q:'There are three ___ in the office.', opts:['box','boxs','boxes','boxies'], a:2,
      zh:'辦公室裡有三個箱子。', why:'x 結尾的名詞複數加 -es。' },
    { k:'mc', q:'Ten ___ joined the meeting.', opts:['person','persons','people','peoples'], a:2,
      zh:'十個人參加了會議。', why:'person 的複數是不規則的 people。' },
    { k:'mc', q:'We need more ___ about the product.', opts:['information','informations','an information','a information'], a:0,
      zh:'我們需要更多關於這個產品的資訊。', why:'information 是不可數名詞，不加 s，也不用 a。' },
    { k:'mc', q:'Our company has five ___.', opts:['citys','cities','citys\'','city'], a:1,
      zh:'我們公司有五個據點城市。', why:'子音 + y 結尾，y 改成 ies。' },
    { k:'fix', q:'I have a informations for you.', a:'I have some information for you.',
      alt:['I have information for you.'],
      zh:'我有一些資訊要給你。', hint:'information 可以數嗎？', why:'information 不可數，不能用 a，也不加 s。' },
    { k:'fix', q:'There are three childs in the room.', a:'There are three children in the room.',
      zh:'房間裡有三個小孩。', hint:'child 的複數是不規則的', why:'child → children。' },
    { k:'fix', q:'She works in a office downtown.', a:'She works in an office downtown.',
      zh:'她在市中心的一間辦公室工作。', hint:'office 是什麼開頭？', why:'office 母音開頭，要用 an。' },
    { k:'cloze', q:'I saw ___ apple on the desk.', a:'an', alt:['a'],
      zh:'我看到桌上有一顆蘋果。', why:'apple 母音開頭，用 an。' },
    { k:'cloze', q:'Please close ___ door.', a:'the',
      zh:'請把門關上。', why:'雙方都知道是哪扇門，用 the。' },
    { k:'cloze', q:'We have two ___ this afternoon. (meeting)', a:'meetings',
      zh:'我們今天下午有兩場會議。', why:'two 後面要用複數。' },
    { k:'cloze', q:'There are many ___ in the store. (box)', a:'boxes',
      zh:'店裡有很多箱子。', why:'x 結尾加 -es。' },
    { k:'trans', zh:'我需要一些水。', a:'I need some water.', alt:['I want some water.'],
      why:'water 不可數，用 some 而不是 a。' },
    { k:'trans', zh:'她是一位新來的經理。', a:'She is a new manager.', alt:['She\'s a new manager.'],
      why:'new 是子音開頭，用 a。' }
  ]
},

/* ============================================================ U9 指示詞與疑問詞 */
{
  id:'g0901', u:'s0u9', title:'this / that 與 wh- 疑問詞',
  teach:{
    title:'指東西，還有問問題',
    lead:'能指出東西、能問出問題，就能開口對話了。這一關的句型在多益 Part 2（應答問題）幾乎每次都出現。',
    sections:[
      { h:'四個指示詞',
        table:{ speak:true, head:['','近（這）','遠（那）'],
          rows:[['單數','this 這個','that 那個'],['複數','these 這些','those 那些']] },
        ex:[
          ['This is my desk.','這是我的桌子。'],
          ['That is her car.','那是她的車。'],
          ['These are the new samples.','這些是新的樣品。'],
          ['Those boxes go to the warehouse.','那些箱子送去倉庫。']
        ] },
      { h:'六個核心疑問詞',
        table:{ speak:true, head:['疑問詞','問什麼','例句'],
          rows:[
            ['What','什麼','What is this? 這是什麼？'],
            ['Who','誰','Who is the manager? 誰是經理？'],
            ['Where','哪裡','Where is the meeting room? 會議室在哪？'],
            ['When','什麼時候','When does it start? 什麼時候開始？'],
            ['Why','為什麼','Why is he late? 他為什麼遲到？'],
            ['How','如何・多麼','How do I use this? 這個怎麼用？']
          ] } },
      { h:'疑問句的語序：疑問詞 + be 動詞 + 主詞',
        formula:'What　＋　is　＋　this?',
        formulaNote:'跟中文語序不一樣：中文是「這是什麼」，英文是「什麼 是 這」',
        ex:[
          ['Where is my bag?','我的包包在哪？'],
          ['Who is that woman?','那位女士是誰？'],
          ['When is the deadline?','截止日是什麼時候？']
        ],
        warn:'常見錯誤：<b>Where my bag is?</b> ❌　疑問句一定要把 be 動詞放到主詞<b>前面</b>。' },
      { h:'How 的家族（多益高頻）',
        table:{ head:['問法','問什麼','例句'],
          rows:[
            ['How much','多少錢／多少量','How much is it? 多少錢？'],
            ['How many','多少個','How many people? 幾個人？'],
            ['How long','多久','How long is the meeting? 會議多久？'],
            ['How often','多常','How often do you travel? 你多常出差？'],
            ['How far','多遠','How far is the airport? 機場多遠？']
          ] },
        tip:'Part 2 的陷阱就是「用 What 開頭的問題，卻選了 Yes/No 的答案」。記住：<b>wh- 開頭的問題永遠不能用 Yes / No 回答</b>。' }
    ]
  },
  sents:[
    ['This is my desk.','這是我的桌子。'],
    ['What is your name?','你叫什麼名字？'],
    ['Where is the meeting room?','會議室在哪裡？'],
    ['Who is the new manager?','誰是新來的經理？'],
    ['These are the new samples.','這些是新的樣品。'],
    ['How much is this?','這個多少錢？'],
    ['When does the store open?','商店什麼時候開門？'],
    ['Why is the order late?','訂單為什麼延遲？']
  ],
  qs:[
    { k:'mc', q:'___ is your name?', opts:['What','Who','Where','How'], a:0,
      zh:'你叫什麼名字？', why:'問「名字是什麼」用 What。' },
    { k:'mc', q:'___ is the meeting room?', opts:['What','Who','Where','When'], a:2,
      zh:'會議室在哪裡？', why:'問地點用 Where。' },
    { k:'mc', q:'___ are the new samples.', opts:['This','That','These','It'], a:2,
      zh:'這些是新的樣品。', why:'samples 是複數，且 are 也是複數動詞，要用 These。' },
    { k:'mc', q:'___ people came to the meeting?', opts:['How much','How many','How long','How far'], a:1,
      zh:'有多少人來開會？', why:'people 可數，用 How many。' },
    { k:'mc', q:'___ is the total?', opts:['How much','How many','How often','How far'], a:0,
      zh:'總共多少錢？', why:'問金額用 How much。' },
    { k:'mc', q:'___ is he always late?', opts:['What','Who','Why','Where'], a:2,
      zh:'他為什麼老是遲到？', why:'問原因用 Why。' },
    { k:'mc', q:'"Where is the file?" 最合理的回答是：', opts:['Yes, it is.','On your desk.','At three o\'clock.','No, thanks.'], a:1,
      zh:'檔案在哪？—— 在你桌上。', why:'Where 問地點，不能用 Yes / No 回答。' },
    { k:'fix', q:'Where my bag is?', a:'Where is my bag?',
      zh:'我的包包在哪裡？', hint:'be 動詞要放哪？', why:'疑問句要把 be 動詞提到主詞前面。' },
    { k:'fix', q:'This are my books.', a:'These are my books.',
      zh:'這些是我的書。', hint:'books 是單數還是複數？', why:'複數要用 These。' },
    { k:'fix', q:'How many money do you need?', a:'How much money do you need?',
      zh:'你需要多少錢？', hint:'money 可以數嗎？', why:'money 不可數，用 How much。' },
    { k:'cloze', q:'___ is that woman? She is our client.', a:'Who',
      zh:'那位女士是誰？她是我們的客戶。', why:'問人用 Who。' },
    { k:'cloze', q:'___ does the meeting start? At nine.', a:'When',
      zh:'會議什麼時候開始？九點。', why:'問時間用 When。' },
    { k:'cloze', q:'___ boxes are heavy. (那些)', a:'Those',
      zh:'那些箱子很重。', why:'遠的複數用 Those。' },
    { k:'trans', zh:'會議室在哪裡？', a:'Where is the meeting room?',
      why:'Where + is + 主詞。' },
    { k:'trans', zh:'這個多少錢？', a:'How much is this?', alt:['How much is it?'],
      why:'問價格用 How much。' }
  ]
},

/* ============================================================ U10 時間表達 */
{
  id:'g1001', u:'s0u10', title:'數字、日期與時間的說法',
  teach:{
    title:'幾點、星期幾、幾月幾號',
    lead:'多益聽力的每一個部分都會出現時間和數字。聽不懂時間，等於直接放棄一大票分數。這一關把它一次講完。',
    sections:[
      { h:'幾點鐘：兩種說法',
        table:{ speak:true, head:['時間','直唸法（最常用）','傳統說法'],
          rows:[
            ['3:00','three o\'clock','three o\'clock'],
            ['3:15','three fifteen','a quarter past three'],
            ['3:30','three thirty','half past three'],
            ['3:45','three forty-five','a quarter to four'],
            ['3:05','three oh five','five past three']
          ] },
        tip:'多益裡最常聽到的是「直唸法」：nine thirty（9:30）、ten forty-five（10:45）。先把這個練熟。' },
      { h:'a.m. 和 p.m.',
        ex:[
          ['The meeting is at 9 a.m.','會議在早上九點。'],
          ['The store closes at 9 p.m.','商店晚上九點關門。']
        ],
        warn:'12 a.m. 是<b>半夜</b>，12 p.m. 是<b>中午</b>。容易搞混，多益也考過。安全講法是 midnight 和 noon。' },
      { h:'介系詞：at / on / in',
        table:{ head:['介系詞','用在','例子'],
          rows:[
            ['<b>at</b>','幾點鐘','at seven / at noon / at 3:30'],
            ['<b>on</b>','星期幾、日期','on Monday / on May 5 / on Friday morning'],
            ['<b>in</b>','月份、年份、季節、早中晚','in May / in 2026 / in the morning']
          ] },
        formula:'at 點　→　on 日　→　in 月',
        formulaNote:'口訣：範圍越小用 at，越大用 in',
        ex:[
          ['The meeting is at ten on Monday.','會議在星期一十點。'],
          ['We start the project in March.','我們三月開始這個專案。'],
          ['She arrives on May 5.','她五月五號到。']
        ] },
      { h:'日期怎麼唸',
        table:{ head:['寫法','唸法'],
          rows:[
            ['May 5 / May 5th','May fifth'],
            ['March 1','March first'],
            ['July 23','July twenty-third'],
            ['2026','twenty twenty-six']
          ] },
        warn:'美式是「月/日」（5/12 = 五月十二日），英式是「日/月」。多益用美式，看到 5/12 請讀成 May 12。' },
      { h:'序數：第幾',
        table:{ speak:true, head:['數字','序數','數字','序數'],
          rows:[['1','first','5','fifth'],['2','second','8','eighth'],
                ['3','third','9','ninth'],['4','fourth','12','twelfth'],
                ['20','twentieth','21','twenty-first']] } },
      { h:'常聽到的時間片語',
        ex:[
          ['The meeting starts at nine thirty.','會議九點半開始。'],
          ['Please reply by Friday.','請在星期五之前回覆。'],
          ['We meet every Monday morning.','我們每週一早上開會。'],
          ['The store is open from nine to six.','店裡從九點開到六點。']
        ],
        tip:'<b>by</b> Friday 是「星期五（含）之前」，<b>until</b> Friday 是「一直到星期五」。多益 Part 5 很愛考這組。' }
    ]
  },
  sents:[
    ['The meeting is at ten.','會議十點。'],
    ['I get up at seven.','我七點起床。'],
    ['We meet on Monday.','我們星期一見。'],
    ['The store opens at nine thirty.','商店九點半開門。'],
    ['Please reply by Friday.','請在星期五前回覆。'],
    ['My birthday is in January.','我生日在一月。'],
    ['The office closes at six.','辦公室六點關門。'],
    ['See you on Friday afternoon.','星期五下午見。']
  ],
  qs:[
    { k:'mc', q:'The meeting is ___ nine o\'clock.', opts:['at','on','in','by'], a:0,
      zh:'會議九點開始。', why:'幾點鐘用 at。' },
    { k:'mc', q:'We have a call ___ Monday.', opts:['at','on','in','to'], a:1,
      zh:'我們星期一有通電話會議。', why:'星期幾用 on。' },
    { k:'mc', q:'The project starts ___ March.', opts:['at','on','in','by'], a:2,
      zh:'專案三月開始。', why:'月份用 in。' },
    { k:'mc', q:'9:30 唸作：', opts:['nine thirty','thirty nine','nine and half','nine o\'clock thirty'], a:0,
      zh:'九點三十分。', why:'直接唸「小時 + 分鐘」是最常見的說法。' },
    { k:'mc', q:'Please send it ___ Friday.（星期五之前）', opts:['by','until','on','from'], a:0,
      zh:'請在星期五之前寄出。', why:'by = 在某時間點之前完成；until = 持續到某時間。' },
    { k:'mc', q:'12 p.m. 是：', opts:['半夜','中午','早上','傍晚'], a:1,
      zh:'中午十二點。', why:'p.m. 從中午開始，所以 12 p.m. 是中午；12 a.m. 才是半夜。' },
    { k:'mc', q:'May 5 唸作：', opts:['May five','May fifth','Five May','Fifth of the May'], a:1,
      zh:'五月五日。', why:'日期要用序數 fifth。' },
    { k:'fix', q:'The meeting is in Monday.', a:'The meeting is on Monday.',
      zh:'會議在星期一。', hint:'星期幾要用哪個介系詞？', why:'星期幾用 on。' },
    { k:'fix', q:'I get up on seven every day.', a:'I get up at seven every day.',
      zh:'我每天七點起床。', hint:'幾點鐘用什麼？', why:'鐘點時間用 at。' },
    { k:'cloze', q:'The store opens ___ nine and closes at six.', a:'at',
      zh:'商店九點開門，六點關門。', why:'鐘點用 at。' },
    { k:'cloze', q:'My birthday is ___ July.', a:'in',
      zh:'我生日在七月。', why:'月份用 in。' },
    { k:'cloze', q:'The client arrives ___ Friday morning.', a:'on',
      zh:'客戶星期五早上到。', why:'指定某天的早上，用 on。' },
    { k:'trans', zh:'會議在星期一早上十點。', a:'The meeting is at ten on Monday morning.',
      alt:['The meeting is at 10 on Monday morning.',
           'The meeting is at ten o\'clock on Monday morning.'],
      why:'at 配鐘點，on 配星期。' },
    { k:'trans', zh:'請在星期五之前回覆我。', a:'Please reply to me by Friday.', alt:['Please reply by Friday.'],
      why:'「之前完成」用 by。' }
  ]
}

];
