/* ==========================================================================
   reading-s1.js — Stage 1 短文（40–90 字）
   句型只用該關卡（含之前）教過的內容，主題逐步往職場靠攏。
   ========================================================================== */
window.DATA_READING_S1 = [

/* ---------------- U11 現在式 ---------------- */
{
  id:'r1101', u:'s1u1', title:'A Day at the Office',
  text:'Kevin works at a small trading company. He starts work at nine and finishes at six. Every morning he checks his email and answers customer calls. At noon he eats lunch with his colleagues. On Friday he prepares the weekly report. He likes his job because the team is friendly.',
  zh:'凱文在一家小貿易公司上班。他九點開始工作，六點下班。每天早上他會檢查信箱並回覆客戶來電。中午他和同事一起吃午餐。星期五他會準備週報。他喜歡這份工作，因為團隊很友善。',
  qs:[
    { q:'What time does Kevin finish work?', opts:['At nine','At noon','At six','On Friday'], a:2, why:'finishes at six。' },
    { q:'What does Kevin do on Friday?', opts:['He answers calls.','He prepares the weekly report.','He eats with clients.','He starts a new job.'], a:1, why:'On Friday he prepares the weekly report.' },
    { q:'Why does Kevin like his job?', opts:['The pay is high.','The office is new.','The team is friendly.','The hours are short.'], a:2, why:'because the team is friendly.' }
  ]
},
{
  id:'r1102', u:'s1u1', title:'Amy\'s Routine',
  text:'Amy lives near the station, so she walks to work. She usually arrives at eight thirty. She drinks one cup of coffee and reads the news. She never eats breakfast at the office. After work she studies English for one hour. She says a little practice every day works better than a long class once a week.',
  zh:'艾咪住在車站附近，所以她走路上班。她通常八點半到。她會喝一杯咖啡並看新聞。她從不在辦公室吃早餐。下班後她讀一小時英文。她說每天練一點，比一週上一次長課有效。',
  qs:[
    { q:'How does Amy go to work?', opts:['By bus','By car','On foot','By train'], a:2, why:'she walks to work.' },
    { q:'What does Amy never do at the office?', opts:['Drink coffee','Read the news','Eat breakfast','Study English'], a:2, why:'She never eats breakfast at the office.' }
  ]
},

/* ---------------- U12 否定與疑問 ---------------- */
{
  id:'r1201', u:'s1u2', title:'A Phone Call',
  text:'A: Good morning. Does Mr. Lin work in this department?\nB: No, he doesn\'t. He works in the sales department on the fifth floor.\nA: I see. Do you have his number?\nB: I don\'t have it, but the front desk does. Would you like me to transfer you?\nA: Yes, please. Thank you.',
  zh:'A：早安。林先生在這個部門工作嗎？\nB：不，他不在。他在五樓的業務部。\nA：了解。你有他的電話嗎？\nB：我沒有，但櫃檯有。要我幫你轉接嗎？\nA：好的，麻煩你。謝謝。',
  qs:[
    { q:'Where does Mr. Lin work?', opts:['In this department','In the sales department','At the front desk','On the first floor'], a:1, why:'He works in the sales department.' },
    { q:'Who has Mr. Lin\'s number?', opts:['Speaker B','The front desk','Mr. Lin\'s assistant','Nobody'], a:1, why:'the front desk does（省略了 have it）。' }
  ]
},
{
  id:'r1202', u:'s1u2', title:'The Store Hours',
  text:'The store opens at ten and closes at nine. It doesn\'t open on national holidays. We don\'t accept returns after thirty days. If you don\'t have a receipt, we can\'t give you a refund, but we can offer an exchange. Do you have any questions? Please ask any staff member.',
  zh:'本店十點開門，九點打烊。國定假日不營業。超過三十天不接受退貨。如果您沒有收據，我們無法退款，但可以換貨。有任何問題嗎？請詢問任何一位店員。',
  qs:[
    { q:'When is the store closed?', opts:['On Sundays','On national holidays','Before ten','After thirty days'], a:1, why:'It doesn\'t open on national holidays.' },
    { q:'What can a customer without a receipt get?', opts:['A refund','An exchange','Nothing','A discount'], a:1, why:'we can offer an exchange。' }
  ]
},

/* ---------------- U13 現在進行式 ---------------- */
{
  id:'r1301', u:'s1u3', title:'In the Lobby',
  text:'It is nine in the morning and the lobby is busy. A woman is standing at the counter. She is holding a folder. Two men are shaking hands near the door. A worker is pushing a cart of boxes toward the elevator. Outside, a truck is waiting. The receptionist is answering the phone.',
  zh:'現在是早上九點，大廳很忙碌。一名女子站在櫃檯前，手上拿著一個資料夾。兩名男子在門邊握手。一名工人正推著一車箱子往電梯走。外面有一輛卡車在等。櫃檯人員正在接電話。',
  qs:[
    { q:'What is the woman at the counter doing?', opts:['Answering the phone','Holding a folder','Pushing a cart','Shaking hands'], a:1, why:'She is holding a folder.' },
    { q:'Where is the worker going?', opts:['To the door','To the counter','Toward the elevator','Outside'], a:2, why:'pushing a cart of boxes toward the elevator.' },
    { q:'What is waiting outside?', opts:['A truck','A bus','A taxi','A client'], a:0, why:'Outside, a truck is waiting.' }
  ]
},
{
  id:'r1302', u:'s1u3', title:'The Warehouse',
  text:'Right now the team is working in the warehouse. Two workers are loading a truck. Another worker is checking the boxes and writing numbers on a list. The manager is talking on the phone near the door. Nobody is taking a break because the shipment leaves at four.',
  zh:'此刻團隊正在倉庫工作。兩名工人正在裝貨上車。另一名工人正在檢查箱子並在清單上寫數字。經理在門邊講電話。沒有人在休息，因為貨物四點要出。',
  qs:[
    { q:'What are two workers doing?', opts:['Checking boxes','Loading a truck','Talking on the phone','Taking a break'], a:1, why:'Two workers are loading a truck.' },
    { q:'Why is nobody taking a break?', opts:['The manager is angry.','The warehouse is closed.','The shipment leaves at four.','It is too early.'], a:2, why:'because the shipment leaves at four.' }
  ]
},

/* ---------------- U14 was / were ---------------- */
{
  id:'r1401', u:'s1u4', title:'Yesterday\'s Meeting',
  text:'The meeting yesterday was long. There were twelve people in the room, and two of them were from the head office. The air conditioner was broken, so the room was very warm. The presentation was interesting, but the last part was boring. Everyone was tired at the end.',
  zh:'昨天的會議很長。房間裡有十二個人，其中兩位來自總部。冷氣壞了，所以房間很熱。簡報很有趣，但最後一段很無聊。結束時大家都很累。',
  qs:[
    { q:'How many people were in the room?', opts:['Two','Ten','Twelve','Twenty'], a:2, why:'There were twelve people in the room.' },
    { q:'Why was the room warm?', opts:['It was summer.','The windows were closed.','The air conditioner was broken.','There were too many people.'], a:2, why:'The air conditioner was broken.' }
  ]
},
{
  id:'r1402', u:'s1u4', title:'A Business Trip',
  text:'Last week I was in Osaka for a business trip. The flight was on time, but the train from the airport was very crowded. My hotel was near the office, so I walked every morning. The client was friendly and the food was delicious. It was a short trip, but it was successful.',
  zh:'上週我到大阪出差。班機準時，但從機場來的電車很擠。我的飯店離辦公室很近，所以我每天早上都走路過去。客戶很親切，食物也很好吃。這是一趟短暫但成功的出差。',
  qs:[
    { q:'How was the flight?', opts:['Delayed','On time','Canceled','Crowded'], a:1, why:'The flight was on time.' },
    { q:'Why did the writer walk every morning?', opts:['The train was expensive.','The hotel was near the office.','There were no taxis.','He wanted exercise.'], a:1, why:'My hotel was near the office, so I walked.' }
  ]
},

/* ---------------- U15 過去式 ---------------- */
{
  id:'r1501', u:'s1u5', title:'What Happened to the Order',
  text:'The customer called on Monday morning. He said he did not receive the order. I checked the system and found the problem. We sent the package to the old address. I called the delivery company and they told me the package was still at the local office. I asked them to send it again, and it arrived on Wednesday.',
  zh:'客戶星期一早上打來，說他沒收到訂單。我查了系統並找到問題：我們把包裹寄到舊地址了。我打給貨運公司，他們告訴我包裹還在當地站點。我請他們重寄，包裹星期三送到了。',
  qs:[
    { q:'What was the problem?', opts:['The order was never made.','The package went to the old address.','The customer paid late.','The item was out of stock.'], a:1, why:'We sent the package to the old address.' },
    { q:'When did the package arrive?', opts:['On Monday','On Tuesday','On Wednesday','On Friday'], a:2, why:'it arrived on Wednesday.' },
    { q:'Who did the writer call?', opts:['The customer','The manager','The delivery company','The local office'], a:2, why:'I called the delivery company.' }
  ]
},
{
  id:'r1502', u:'s1u5', title:'My First Week',
  text:'I started my new job last month. On the first day I met the team and my manager showed me the office. I did not understand the system at first, so a colleague taught me. I made a few mistakes, but nobody was angry. By Friday I finished my first small project. I felt tired but happy.',
  zh:'我上個月開始新工作。第一天我認識了團隊，經理帶我看了辦公室。一開始我看不懂系統，所以一位同事教我。我犯了幾個錯，但沒有人生氣。到星期五我完成了第一個小專案。我覺得累但開心。',
  qs:[
    { q:'Who taught the writer the system?', opts:['The manager','A colleague','A customer','Nobody'], a:1, why:'a colleague taught me.' },
    { q:'What happened by Friday?', opts:['The writer quit.','The writer met the team.','The writer finished a small project.','The writer made no mistakes.'], a:2, why:'By Friday I finished my first small project.' }
  ]
},

/* ---------------- U16 未來式 ---------------- */
{
  id:'r1601', u:'s1u6', title:'Notice: Office Move',
  text:'Dear all,\nOur office will move to the tenth floor next month. The move is going to happen over the weekend, so we will not lose any working days. Please pack your personal items by Friday. IT will set up the computers on Saturday. If you have any questions, please contact the office manager.\nThank you.',
  zh:'各位同仁：\n我們的辦公室下個月將搬到十樓。搬遷會在週末進行，因此不會影響上班日。請在星期五前打包好個人物品。資訊部會在星期六架設電腦。若有任何問題，請聯絡辦公室主管。\n謝謝。',
  qs:[
    { q:'When will the move happen?', opts:['On Friday','Over the weekend','Next year','On Monday'], a:1, why:'The move is going to happen over the weekend.' },
    { q:'What must employees do by Friday?', opts:['Set up computers','Contact IT','Pack personal items','Move to the tenth floor'], a:2, why:'Please pack your personal items by Friday.' },
    { q:'Who will set up the computers?', opts:['The employees','IT','The office manager','A moving company'], a:1, why:'IT will set up the computers on Saturday.' }
  ]
},
{
  id:'r1602', u:'s1u6', title:'Plans for Next Quarter',
  text:'Next quarter we are going to launch two new products. We will hire three more people for the sales team. The training will start in April, and the products will be ready in May. Costs will probably increase, but we expect higher sales. The director will confirm the budget next week.',
  zh:'下一季我們要推出兩項新產品。我們會為業務團隊再請三個人。訓練四月開始，產品五月準備好。成本可能會增加，但我們預期業績會更高。總監下週會確認預算。',
  qs:[
    { q:'How many people will they hire?', opts:['Two','Three','Four','Five'], a:1, why:'We will hire three more people.' },
    { q:'When will the products be ready?', opts:['In April','In May','Next week','Next year'], a:1, why:'the products will be ready in May.' }
  ]
},

/* ---------------- U17 地方介系詞 ---------------- */
{
  id:'r1701', u:'s1u7', title:'Finding the Meeting Room',
  text:'The meeting room is on the third floor. When you come out of the elevator, turn left. Walk along the hallway and go past the printer. The room is between the kitchen and the manager\'s office. If the door is closed, wait on the bench across from the room. The restroom is at the end of the hallway.',
  zh:'會議室在三樓。出電梯後左轉，沿著走廊走，經過印表機。會議室在茶水間和經理辦公室之間。如果門是關的，請在對面的長椅上等。洗手間在走廊底。',
  qs:[
    { q:'Where is the meeting room?', opts:['Next to the elevator','Between the kitchen and the manager\'s office','At the end of the hallway','Across from the printer'], a:1, why:'between the kitchen and the manager\'s office.' },
    { q:'What should you do if the door is closed?', opts:['Knock','Go back downstairs','Wait on the bench across from the room','Call the manager'], a:2, why:'wait on the bench across from the room.' }
  ]
},
{
  id:'r1702', u:'s1u7', title:'The New Office',
  text:'Our new office is in a tall building near the station. The lobby is on the ground floor, and there is a coffee shop next to the entrance. Our department is on the eighth floor. My desk is by the window, across from my manager\'s desk. The parking lot is behind the building, and the warehouse is about ten minutes away by car.',
  zh:'我們的新辦公室在車站附近的一棟高樓。大廳在一樓，入口旁邊有一家咖啡店。我們部門在八樓。我的座位在窗邊，在經理座位的對面。停車場在大樓後面，倉庫開車約十分鐘。',
  qs:[
    { q:'Where is the coffee shop?', opts:['On the eighth floor','Next to the entrance','Behind the building','In the warehouse'], a:1, why:'a coffee shop next to the entrance.' },
    { q:'Where is the writer\'s desk?', opts:['Next to the door','By the window','In the lobby','Near the parking lot'], a:1, why:'My desk is by the window.' }
  ]
},

/* ---------------- U18 時間介系詞 ---------------- */
{
  id:'r1801', u:'s1u8', title:'Weekly Schedule',
  text:'We hold a team meeting on Monday at nine thirty. The weekly report is due by Wednesday noon. Training takes place in the afternoon on Thursday. The office is open from eight to six, but on Friday we close at five. During December the office closes early on all days.',
  zh:'我們星期一九點半開團隊會議。週報星期三中午前要交。訓練在星期四下午進行。辦公室從八點開到六點，但星期五五點就關。十二月期間每天都提早關門。',
  qs:[
    { q:'When is the weekly report due?', opts:['Monday at nine thirty','By Wednesday noon','Thursday afternoon','Friday at five'], a:1, why:'due by Wednesday noon.' },
    { q:'What time does the office close on Friday?', opts:['At five','At six','At eight','At noon'], a:0, why:'on Friday we close at five.' },
    { q:'What happens during December?', opts:['The office closes early.','Training stops.','Meetings move to Tuesday.','The office opens later.'], a:0, why:'During December the office closes early.' }
  ]
},
{
  id:'r1802', u:'s1u8', title:'A Reminder Email',
  text:'Hi team,\nThis is a reminder that the safety training is on Tuesday at two. Please sign up by Monday. The session lasts about ninety minutes. If you cannot attend, let me know in advance and we will schedule another session within two weeks. We rarely offer extra sessions, so please try to come on Tuesday.\nThanks.',
  zh:'團隊你好：\n提醒大家安全訓練在星期二下午兩點。請在星期一前報名。課程約九十分鐘。如果無法參加，請提前告知，我們會在兩週內安排另一場。我們很少加開場次，所以請盡量星期二出席。\n謝謝。',
  qs:[
    { q:'When should people sign up?', opts:['By Monday','On Tuesday','Within two weeks','In advance of the second session'], a:0, why:'Please sign up by Monday.' },
    { q:'How long is the session?', opts:['Two hours','Ninety minutes','Two weeks','Thirty minutes'], a:1, why:'The session lasts about ninety minutes.' }
  ]
},

/* ---------------- U19 助動詞 ---------------- */
{
  id:'r1901', u:'s1u9', title:'Visitor Rules',
  text:'All visitors must sign in at the front desk and wear a badge. You should keep the badge visible at all times. Visitors cannot enter the factory area without a staff member. You do not have to wear a helmet in the office, but you must wear one on the factory floor. If you have any questions, you may ask any staff member.',
  zh:'所有訪客必須在櫃檯簽到並配戴識別證。識別證應隨時保持可見。訪客不得在沒有員工陪同下進入廠區。在辦公室不需要戴安全帽，但在廠房內必須戴。若有任何問題，可詢問任何一位員工。',
  qs:[
    { q:'What must all visitors do?', opts:['Wear a helmet','Sign in and wear a badge','Bring a staff member','Enter the factory'], a:1, why:'All visitors must sign in and wear a badge.' },
    { q:'Where is a helmet required?', opts:['In the office','At the front desk','On the factory floor','Everywhere'], a:2, why:'you must wear one on the factory floor.' },
    { q:'What does "You do not have to wear a helmet in the office" mean?', opts:['Wearing one is forbidden.','Wearing one is not necessary.','You must wear one.','Only staff wear one.'], a:1, why:'don\'t have to = 不需要，不是禁止。' }
  ]
},
{
  id:'r1902', u:'s1u9', title:'Asking for Help',
  text:'A: Could you help me with the printer? It is not working.\nB: Sure. You should check the paper first. It often runs out.\nA: I checked. There is paper, but nothing prints.\nB: Then you may need to restart it. If that does not work, you must call IT. They can usually fix it in an hour.\nA: Thanks. I will try that.',
  zh:'A：可以幫我看一下印表機嗎？它不能用。\nB：當然。你應該先檢查紙。它常常用完。\nA：我檢查過了，有紙，但印不出來。\nB：那你可能需要重新啟動它。如果沒用，就必須打給資訊部。他們通常一小時內能修好。\nA：謝謝，我試試看。',
  qs:[
    { q:'What should A check first?', opts:['The power','The paper','The cable','The software'], a:1, why:'You should check the paper first.' },
    { q:'What must A do if restarting does not work?', opts:['Buy a new printer','Call IT','Wait an hour','Ask the manager'], a:1, why:'you must call IT.' }
  ]
},

/* ---------------- U20 比較級 ---------------- */
{
  id:'r2001', u:'s1u10', title:'Comparing Two Suppliers',
  text:'We compared two suppliers last month. Supplier A is cheaper, but delivery is slower. Supplier B is more expensive; however, the quality is better and shipping is faster. Supplier A had fewer complaints last year, but Supplier B has more experience. In the end we chose Supplier B because quality matters most to our customers.',
  zh:'我們上個月比較了兩家供應商。A 比較便宜，但出貨較慢。B 比較貴，然而品質較好、出貨較快。A 去年的客訴較少，但 B 經驗較豐富。最後我們選了 B，因為品質對我們的客戶最重要。',
  qs:[
    { q:'Which supplier is cheaper?', opts:['Supplier A','Supplier B','Both are the same','The text does not say'], a:0, why:'Supplier A is cheaper.' },
    { q:'Why did they choose Supplier B?', opts:['It is cheaper.','It had fewer complaints.','Quality matters most.','It is closer.'], a:2, why:'because quality matters most to our customers.' },
    { q:'Which supplier had fewer complaints last year?', opts:['Supplier A','Supplier B','Neither','Both'], a:0, why:'Supplier A had fewer complaints last year.' }
  ]
},
{
  id:'r2002', u:'s1u10', title:'The New System',
  text:'The new system is faster than the old one, and it is easier to use. Most staff learned it within a week. It costs more, but we spend less time on data entry. The biggest benefit is fewer mistakes. Overall, it is the best change our department made this year.',
  zh:'新系統比舊的快，也比較好用。多數員工一週內就學會了。它比較貴，但我們花在資料輸入的時間變少了。最大的好處是錯誤變少。整體來說，這是我們部門今年做過最好的改變。',
  qs:[
    { q:'What is the biggest benefit of the new system?', opts:['Lower cost','Fewer mistakes','More staff','Faster hiring'], a:1, why:'The biggest benefit is fewer mistakes.' },
    { q:'How long did most staff need to learn it?', opts:['One day','Within a week','One month','A year'], a:1, why:'Most staff learned it within a week.' }
  ]
},

/* ---------------- U21 連接詞 ---------------- */
{
  id:'r2101', u:'s1u11', title:'A Delayed Shipment',
  text:'The shipment was late because of bad weather. We called the customer and explained the situation. Although the customer was not happy, he agreed to wait. We offered free shipping on the next order, so he stayed with us. However, we must find a better plan, because this is the second delay this year.',
  zh:'這批貨因為天氣不好而延誤。我們打給客戶說明狀況。雖然客戶不太高興，但他同意等待。我們提供下一筆訂單免運，所以他繼續和我們合作。然而我們必須找出更好的辦法，因為這已經是今年第二次延誤。',
  qs:[
    { q:'Why was the shipment late?', opts:['Bad weather','A wrong address','No stock','The customer canceled'], a:0, why:'because of bad weather.' },
    { q:'What did the company offer?', opts:['A refund','A discount','Free shipping on the next order','A new product'], a:2, why:'We offered free shipping on the next order.' },
    { q:'Why must they find a better plan?', opts:['The customer left.','This is the second delay this year.','The weather is always bad.','Shipping costs rose.'], a:1, why:'because this is the second delay this year.' }
  ]
},
{
  id:'r2102', u:'s1u11', title:'Why I Study at Night',
  text:'I study English at night because I am too busy in the morning. I usually read for twenty minutes and then listen to a short talk. Although I am tired after work, I still do it, because a small habit is easier to keep than a big plan. In addition, I sleep better when I stop looking at my phone.',
  zh:'我晚上讀英文，因為早上太忙。我通常先讀二十分鐘，然後聽一段短講。雖然下班後很累，我還是會做，因為小習慣比大計畫容易維持。此外，不看手機後我睡得比較好。',
  qs:[
    { q:'Why does the writer study at night?', opts:['It is quieter.','He is busy in the morning.','His class is at night.','He works at night.'], a:1, why:'because I am too busy in the morning.' },
    { q:'What does the writer say about habits?', opts:['Big plans work better.','A small habit is easier to keep.','Studying is not useful.','Reading is boring.'], a:1, why:'a small habit is easier to keep than a big plan.' }
  ]
},

/* ---------------- U22 There is/are ---------------- */
{
  id:'r2201', u:'s1u12', title:'The Supply Room',
  text:'There is a supply room next to the kitchen. There are three shelves inside. On the top shelf there is a box of pens and some folders. There are a few boxes of paper on the middle shelf, but there is not much ink left. If there is nothing you need, please write it on the list by the door.',
  zh:'茶水間旁邊有一間用品室，裡面有三個架子。最上層有一盒筆和一些資料夾。中層有幾箱紙，但墨水剩不多了。如果沒有你需要的東西，請寫在門邊的清單上。',
  qs:[
    { q:'Where is the supply room?', opts:['Next to the kitchen','On the top shelf','By the door','Near the printer'], a:0, why:'There is a supply room next to the kitchen.' },
    { q:'What is running low?', opts:['Paper','Pens','Ink','Folders'], a:2, why:'there is not much ink left.' }
  ]
},
{
  id:'r2202', u:'s1u12', title:'Booking a Room',
  text:'A: Are there any meeting rooms available on Friday?\nB: There is one at ten, but there are no rooms after lunch.\nA: How many seats are there in the room?\nB: There are twelve seats, and there is a projector.\nA: That is enough. We only have eight people. Please book it.\nB: No problem. I will send you a confirmation.',
  zh:'A：星期五有空的會議室嗎？\nB：十點有一間，但午餐後都沒有了。\nA：那間有幾個座位？\nB：有十二個座位，還有一台投影機。\nA：夠了，我們只有八個人。請幫我訂。\nB：沒問題，我會寄確認信給你。',
  qs:[
    { q:'When is a room available?', opts:['At ten','After lunch','All day','On Thursday'], a:0, why:'There is one at ten.' },
    { q:'How many people will attend?', opts:['Eight','Ten','Twelve','Twenty'], a:0, why:'We only have eight people.' }
  ]
},

/* ---------------- U23 所有格 ---------------- */
{
  id:'r2301', u:'s1u13', title:'Lost and Found',
  text:'Someone left a black umbrella in the meeting room. It is not mine, and my colleague says it is not hers either. The manager thinks it may be the client\'s, because he visited yesterday. We put it in the lost and found box by the front desk. If it is yours, please ask the receptionist.',
  zh:'有人把一把黑色雨傘留在會議室。那不是我的，我同事說也不是她的。經理認為可能是客戶的，因為他昨天來過。我們把它放到櫃檯旁的失物招領箱。如果是你的，請詢問櫃檯人員。',
  qs:[
    { q:'Whose umbrella might it be?', opts:['The writer\'s','The colleague\'s','The client\'s','The receptionist\'s'], a:2, why:'it may be the client\'s.' },
    { q:'Where is the umbrella now?', opts:['In the meeting room','In the lost and found box','With the manager','At the client\'s office'], a:1, why:'We put it in the lost and found box.' }
  ]
},
{
  id:'r2302', u:'s1u13', title:'Company Equipment',
  text:'Every employee gets a company laptop and a key card. The laptop is not yours; it belongs to the company. You must return it when you leave. Please keep your key card with you at all times and do not lend it to anyone. If you lose yours, report it to the office manager on the same day.',
  zh:'每位員工都會拿到一台公司筆電和一張感應卡。筆電不是你的，它屬於公司。離職時必須歸還。請隨身攜帶感應卡，不要借給任何人。若遺失，請當天向辦公室主管回報。',
  qs:[
    { q:'Who owns the laptop?', opts:['The employee','The company','The office manager','Nobody'], a:1, why:'it belongs to the company.' },
    { q:'What should you do if you lose your key card?', opts:['Buy a new one','Borrow a colleague\'s','Report it the same day','Wait until Monday'], a:2, why:'report it to the office manager on the same day.' }
  ]
},

/* ---------------- U24 祈使句 ---------------- */
{
  id:'r2401', u:'s1u14', title:'Before You Leave',
  text:'Please follow these steps before you leave the office. Turn off your computer and the lights. Close all the windows. Do not leave documents on your desk. Put confidential papers in the cabinet and lock it. If you are the last person, please set the alarm at the main door. Thank you for your help.',
  zh:'離開辦公室前請依照以下步驟：關閉電腦和燈。關上所有窗戶。不要把文件留在桌上。把機密文件放進櫃子並鎖好。如果你是最後一個離開的人，請在大門設定警報。謝謝配合。',
  qs:[
    { q:'What should you NOT do?', opts:['Turn off the lights','Close the windows','Leave documents on your desk','Lock the cabinet'], a:2, why:'Do not leave documents on your desk.' },
    { q:'What should the last person do?', opts:['Turn on the lights','Set the alarm','Open the windows','Call the manager'], a:1, why:'please set the alarm at the main door.' }
  ]
},
{
  id:'r2402', u:'s1u14', title:'Making Plans',
  text:'A: Let\'s have the review meeting this week.\nB: Sure. How about Thursday afternoon?\nA: I\'m afraid I can\'t. I have a client visit. Why don\'t we meet on Friday morning?\nB: Friday sounds good. Shall we start at ten?\nA: Could we make it nine thirty? I have another call at eleven.\nB: No problem. I will book the room and send an invite.',
  zh:'A：我們這週來開檢討會吧。\nB：好啊。星期四下午如何？\nA：恐怕不行，我有客戶來訪。我們何不改星期五早上？\nB：星期五可以。十點開始好嗎？\nA：可以改九點半嗎？我十一點還有另一通電話。\nB：沒問題，我會訂會議室並寄邀請。',
  qs:[
    { q:'Why can\'t A meet on Thursday afternoon?', opts:['He is on vacation.','He has a client visit.','The room is booked.','He has a call at eleven.'], a:1, why:'I have a client visit.' },
    { q:'What time will the meeting start?', opts:['Nine','Nine thirty','Ten','Eleven'], a:1, why:'Could we make it nine thirty? — No problem.' }
  ]
},

/* ---------------- U25 總複習 ---------------- */
{
  id:'r2501', u:'s1u15', title:'A Message from the Manager',
  text:'Hi everyone,\nLast month was our best month this year. Sales were higher than last quarter, and we received fewer complaints than before. Right now the team is preparing for the May launch. Next week we will hold a short meeting to discuss the plan. Please read the attached file before Monday and send me your questions by Friday. Thank you for your hard work.',
  zh:'大家好：\n上個月是我們今年最好的一個月。業績高於上一季，客訴也比以前少。目前團隊正在為五月的發表做準備。下週我們會開一場簡短會議討論計畫。請在星期一前閱讀附件，並在星期五前把問題寄給我。謝謝大家的努力。',
  qs:[
    { q:'How were last month\'s sales?', opts:['Lower than last quarter','Higher than last quarter','The same as last year','Not mentioned'], a:1, why:'Sales were higher than last quarter.' },
    { q:'What is the team doing right now?', opts:['Holding a meeting','Preparing for the May launch','Reading the attached file','Hiring new staff'], a:1, why:'Right now the team is preparing for the May launch.' },
    { q:'When should questions be sent?', opts:['Before Monday','By Friday','Next week','In May'], a:1, why:'send me your questions by Friday.' }
  ]
},
{
  id:'r2502', u:'s1u15', title:'Customer Service Notice',
  text:'Thank you for shopping with us. If there is a problem with your order, please contact customer service within seven days. You must have your receipt or order number. We will send a replacement or give you a refund. Shipping is free, and there is no extra fee. Our team is available from nine to six, Monday to Friday. We do not answer calls on weekends, but you may leave a message and we will reply on the next working day.',
  zh:'感謝您的惠顧。若您的訂單有問題，請於七天內聯絡客服。您必須提供收據或訂單編號。我們會寄出替換品或退款。運費免費，也沒有額外費用。我們的團隊服務時間為週一至週五九點到六點。週末不接聽電話，但您可以留言，我們會在下一個工作日回覆。',
  qs:[
    { q:'How long do customers have to report a problem?', opts:['Three days','Seven days','Thirty days','No limit'], a:1, why:'within seven days.' },
    { q:'What must the customer have?', opts:['The original box','A receipt or order number','A membership card','A photo'], a:1, why:'You must have your receipt or order number.' },
    { q:'What happens if you call on Saturday?', opts:['Nobody answers, but you can leave a message.','You pay an extra fee.','You get a refund.','The line is always busy.'], a:0, why:'We do not answer calls on weekends, but you may leave a message.' }
  ]
}

];
