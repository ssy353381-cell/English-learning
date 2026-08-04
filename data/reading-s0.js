/* ==========================================================================
   reading-s0.js — Stage 0 短文（20–45 字，全部只用已學過的句型）
   欄位：id / u / title / text 英文 / zh 翻譯 / qs 理解題
   ========================================================================== */
window.DATA_READING_S0 = [

/* ---------------- U7　be 動詞 ---------------- */
{
  id:'r0701', u:'s0u7', title:'My Family',
  text:'Hello. My name is Amy. I am a student. My father is a driver. My mother is a nurse. I have one brother. He is an engineer. We are a happy family.',
  zh:'哈囉。我的名字是艾咪。我是學生。我爸爸是司機。我媽媽是護理師。我有一個哥哥。他是工程師。我們是一個快樂的家庭。',
  qs:[
    { q:'What is Amy\'s job?', opts:['She is a nurse.','She is a student.','She is a driver.','She is an engineer.'], a:1,
      why:'第二句說 I am a student。' },
    { q:'Who is an engineer?', opts:['Amy','Her father','Her mother','Her brother'], a:3,
      why:'He is an engineer 的 He 指的是前一句的 brother。' }
  ]
},
{
  id:'r0702', u:'s0u7', title:'A New Manager',
  text:'This is Mr. Lin. He is our new manager. He is from Taipei. He is very kind. His office is on the third floor. We are happy to work with him.',
  zh:'這位是林先生。他是我們的新經理。他來自台北。他人很親切。他的辦公室在三樓。我們很高興和他一起工作。',
  qs:[
    { q:'Where is Mr. Lin from?', opts:['Tokyo','Taipei','Hong Kong','New York'], a:1,
      why:'He is from Taipei.' },
    { q:'Where is his office?', opts:['On the first floor','On the second floor','On the third floor','In another building'], a:2,
      why:'His office is on the third floor.' }
  ]
},

/* ---------------- U8　冠詞與單複數 ---------------- */
{
  id:'r0801', u:'s0u8', title:'My Desk',
  text:'I work in a small office. I have a desk near the window. There is a computer on my desk. There are three books and two pens. I also have a photo of my family. I like my desk.',
  zh:'我在一間小辦公室工作。我有一張靠窗的桌子。我桌上有一台電腦。有三本書和兩支筆。我還有一張家人的照片。我喜歡我的桌子。',
  qs:[
    { q:'How many books are on the desk?', opts:['One','Two','Three','Four'], a:2,
      why:'There are three books.' },
    { q:'Where is the desk?', opts:['Near the door','Near the window','In the meeting room','At home'], a:1,
      why:'a desk near the window.' }
  ]
},
{
  id:'r0802', u:'s0u8', title:'The Coffee Shop',
  text:'There is a coffee shop near my office. It is small but very nice. They sell coffee, tea, and cakes. A cup of coffee is sixty dollars. Many office workers go there for lunch.',
  zh:'我辦公室附近有一家咖啡店。它很小但很不錯。他們賣咖啡、茶和蛋糕。一杯咖啡六十元。很多上班族中午會去那裡。',
  qs:[
    { q:'What do they sell?', opts:['Coffee, tea, and cakes','Books and pens','Bags and shoes','Only coffee'], a:0,
      why:'They sell coffee, tea, and cakes.' },
    { q:'How much is a cup of coffee?', opts:['Sixteen dollars','Sixty dollars','Six dollars','Six hundred dollars'], a:1,
      why:'A cup of coffee is sixty dollars.' }
  ]
},

/* ---------------- U9　疑問詞 ---------------- */
{
  id:'r0901', u:'s0u9', title:'At the Front Desk',
  text:'A: Excuse me. Where is the meeting room?\nB: It is on the second floor.\nA: Thank you. And who is the manager here?\nB: Mr. Wang is the manager. His office is next to the meeting room.\nA: That is very helpful. Thank you!',
  zh:'A：不好意思，請問會議室在哪裡？\nB：在二樓。\nA：謝謝。那這裡的經理是誰？\nB：王先生是經理。他的辦公室就在會議室隔壁。\nA：太有幫助了，謝謝！',
  qs:[
    { q:'Where is the meeting room?', opts:['On the first floor','On the second floor','On the third floor','Next to the front desk'], a:1,
      why:'It is on the second floor.' },
    { q:'Where is Mr. Wang\'s office?', opts:['Next to the meeting room','On the first floor','At the front desk','In another building'], a:0,
      why:'His office is next to the meeting room.' }
  ]
},
{
  id:'r0902', u:'s0u9', title:'What Is in the Box?',
  text:'A: What is in this box?\nB: These are the new samples.\nA: Who are they for?\nB: They are for the customer in Japan.\nA: When do we send them?\nB: We send them on Friday.',
  zh:'A：這個箱子裡是什麼？\nB：這些是新的樣品。\nA：這是要給誰的？\nB：要給日本的客戶。\nA：我們什麼時候寄出？\nB：我們星期五寄。',
  qs:[
    { q:'What is in the box?', opts:['Books','New samples','Coffee','Files'], a:1,
      why:'These are the new samples.' },
    { q:'When do they send the box?', opts:['On Monday','On Wednesday','On Friday','On Sunday'], a:2,
      why:'We send them on Friday.' }
  ]
},

/* ---------------- U10　時間 ---------------- */
{
  id:'r1001', u:'s0u10', title:'My Day',
  text:'I get up at seven in the morning. I start work at nine. I eat lunch at twelve. I finish work at six. I go home and eat dinner at seven. I go to bed at eleven. I am very busy every day.',
  zh:'我早上七點起床。我九點開始工作。我十二點吃午餐。我六點下班。我回家後七點吃晚餐。我十一點上床睡覺。我每天都很忙。',
  qs:[
    { q:'What time does the writer start work?', opts:['At seven','At nine','At twelve','At six'], a:1,
      why:'I start work at nine.' },
    { q:'What time does the writer go to bed?', opts:['At seven','At nine','At eleven','At twelve'], a:2,
      why:'I go to bed at eleven.' }
  ]
},
{
  id:'r1002', u:'s0u10', title:'The Weekly Schedule',
  text:'We have a team meeting on Monday morning at ten. On Wednesday, the training starts at two in the afternoon. The client visits on Thursday. On Friday, the report is due at noon. The office is closed on Saturday and Sunday.',
  zh:'我們星期一早上十點有團隊會議。星期三下午兩點開始訓練。客戶星期四來訪。星期五中午要交報告。辦公室週六和週日不開。',
  qs:[
    { q:'When is the team meeting?', opts:['Monday at ten','Wednesday at two','Thursday morning','Friday at noon'], a:0,
      why:'a team meeting on Monday morning at ten.' },
    { q:'When is the report due?', opts:['Monday morning','Wednesday afternoon','Thursday','Friday at noon'], a:3,
      why:'On Friday, the report is due at noon.' },
    { q:'Which days is the office closed?', opts:['Monday and Tuesday','Wednesday and Thursday','Friday and Saturday','Saturday and Sunday'], a:3,
      why:'The office is closed on Saturday and Sunday.' }
  ]
},
{
  id:'r1003', u:'s0u10', title:'A Short Note',
  text:'Hi Amy,\nThe meeting is at nine thirty on Tuesday, not at ten. The room is 302 on the third floor. Please bring the price list. Call me before nine if you are late.\nThanks,\nDavid',
  zh:'嗨 艾咪，\n會議是星期二九點半，不是十點。地點是三樓的 302 室。請帶價目表來。如果你會遲到，九點前打給我。\n謝謝，\n大衛',
  qs:[
    { q:'What time is the meeting?', opts:['Nine o\'clock','Nine thirty','Ten o\'clock','Ten thirty'], a:1,
      why:'The meeting is at nine thirty — 而且特別說明 not at ten。' },
    { q:'What should Amy bring?', opts:['The price list','Her computer','A photo','Coffee'], a:0,
      why:'Please bring the price list.' },
    { q:'What should Amy do if she is late?', opts:['Send an email','Call David before nine','Go to another room','Come on Wednesday'], a:1,
      why:'Call me before nine if you are late.' }
  ]
}

];
