/* ==========================================================================
   reading-s4.js — Stage 4 短文（130–190 字）

   長度從 Stage 3 的 80–120 字拉到 Part 7 單篇的真實長度。變長的不只是字數，
   還有**答案的位置**：Stage 3 的題目答案幾乎都在對應的那一句，這裡開始出現
   要跨段落合起來看、或是要從語氣推論的題目。

   小題刻意不照文章順序出，而且選項一律「換句話說」而不照抄原文 ——
   U53 教的就是這件事，這裡是把它考回來的地方。

   體裁全部取自多益 Part 7 真的會出現的文件：徵才啟事、退換貨政策、
   會議紀錄、客訴回覆、產品公告、租約通知。
   ========================================================================== */
window.DATA_READING_S4 = [

/* ---------------- U46 假設語氣 ---------------- */
{
  id:'r4601', u:'s4u1', title:'Email: Conference Registration',
  text:'Dear Ms. Fujita,\nThank you for your interest in the Regional Logistics Forum. Registration closes on 15 September. If you register before 1 September, the fee is 4,000 dollars; after that date it rises to 5,500. Unless payment is received by the closing date, your place cannot be held.\nIf you had registered last year, you would already qualify for the returning-member discount. As this is your first year, we can instead offer a complimentary workshop pass, which normally costs 800 dollars.\nShould your plans change, cancellations made before 10 September receive a full refund. After that, half the fee is returned. Please do not hesitate to contact me if anything is unclear.\nBest regards,\nDaniel Okonkwo, Registration Office',
  zh:'親愛的 Fujita 女士：\n感謝您對區域物流論壇的關注。報名於九月十五日截止。若您在九月一日前報名，費用為四千元；之後調漲為五千五百元。除非在截止日前收到款項，否則無法為您保留名額。\n如果您去年就報名過，現在已經符合舊會員折扣的資格。由於今年是您第一次參加，我們改為提供一張原價八百元的免費工作坊入場券。\n若您的計畫有變，九月十日前取消可全額退費，之後則退回一半費用。如有任何不清楚的地方，請隨時與我聯絡。\n敬祝順心\n報名組　Daniel Okonkwo',
  qs:[
    { q:'What happens if payment arrives after 15 September?', opts:['The fee is reduced.','The place is not held.','A workshop pass is added.','The registration is moved to next year.'], a:1,
      why:'Unless payment is received by the closing date, your place cannot be held. —— unless ＝ 如果沒有。' },
    { q:'Why is Ms. Fujita NOT getting the returning-member discount?', opts:['She paid too late.','She cancelled last year.','This is her first year.','She chose the workshop instead.'], a:2,
      why:'As this is your first year —— 折扣是給去年就參加過的人。' },
    { q:'What is offered in place of the discount?', opts:['A free workshop pass','A lower registration fee','An extra week to pay','A full refund'], a:0,
      why:'we can instead offer a complimentary workshop pass。complimentary ＝ free。' },
    { q:'What does a member who cancels on 12 September receive?', opts:['Nothing','Half the fee','The full fee','A credit for next year'], a:1,
      why:'九月十日之後取消退一半 —— 12 日在那之後。' }
  ]
},

/* ---------------- U47 分詞構句 ---------------- */
{
  id:'r4701', u:'s4u2', title:'Notice: Warehouse Relocation',
  text:'To all staff:\nHaving reviewed our storage needs, management has decided to move the main warehouse from Zhonghe to a larger site in Taoyuan. Located twenty minutes from the airport, the new building offers nearly twice the floor space and a loading dock that can serve four trucks at once.\nThe move will take place over three weekends in November. Operating on a reduced schedule during this period, the shipping team will process only urgent orders. Customers have already been informed.\nStaff currently based at Zhonghe will be offered either a transfer to Taoyuan with a travel allowance, or a position at the Banqiao office. Please indicate your preference on the form attached to this notice and return it to human resources by 20 October. Those who do not respond will be assumed to prefer Banqiao.',
  zh:'致全體同仁：\n在檢視過我們的倉儲需求後，管理層決定將主倉庫從中和遷至桃園一處更大的場地。新建築距離機場二十分鐘，樓地板面積接近原本的兩倍，裝卸區可同時停靠四輛卡車。\n搬遷將於十一月分三個週末進行。這段期間出貨組採縮減班表運作，只處理急件訂單。客戶已經收到通知。\n目前在中和上班的同仁可選擇調往桃園並領取交通津貼，或改至板橋辦公室任職。請在本通知所附的表格上勾選您的意願，並於十月二十日前送回人資。未回覆者將視為選擇板橋。',
  qs:[
    { q:'What is mentioned about the new warehouse?', opts:['It is closer to the city center.','It is near the airport.','It has the same floor space.','It has one loading bay.'], a:1,
      why:'Located twenty minutes from the airport。' },
    { q:'What will the shipping team do during the move?', opts:['Stop working completely','Handle only urgent orders','Work extra weekends','Move to Banqiao'], a:1,
      why:'the shipping team will process only urgent orders。' },
    { q:'What happens to staff who do not return the form?', opts:['They will be transferred to Taoyuan.','They will be placed at Banqiao.','They will receive a travel allowance.','They will be contacted again.'], a:1,
      why:'Those who do not respond will be assumed to prefer Banqiao。' },
    { q:'What is suggested about the customers?', opts:['They have not been told yet.','They already know about the move.','They must approve the move.','They will visit the new site.'], a:1,
      why:'Customers have already been informed。' }
  ]
},

/* ---------------- U48 片語動詞 ---------------- */
{
  id:'r4801', u:'s4u3', title:'Meeting Minutes: Product Launch',
  text:'Minutes — Marketing Team, 14 March\nPresent: R. Mehta (chair), S. Lindqvist, T. Abara, J. Wu\n1. The spring launch has been put off until 6 May. The design files arrived two weeks late, and the team agreed that rushing the campaign would do more harm than a short delay.\n2. The photo shoot planned for 20 March was called off. T. Abara will look into hiring a studio closer to the office, as travel costs made up nearly a third of the previous budget.\n3. J. Wu will carry out a short survey of existing customers before the new date. Draft questions are to be handed in by 25 March.\n4. The team turned down the proposal to run print advertisements, agreeing that the same money would reach more readers online.\n5. S. Lindqvist will take over the social media schedule while R. Mehta is on leave in April.\nNext meeting: 28 March, 10:00, Room 4B.',
  zh:'會議紀錄 —— 行銷團隊，三月十四日\n出席：R. Mehta（主席）、S. Lindqvist、T. Abara、J. Wu\n1. 春季發表會延至五月六日。設計檔案晚了兩週才到，團隊同意趕工的傷害會比短暫延期更大。\n2. 原訂三月二十日的拍攝取消。T. Abara 將研究租用離辦公室較近的攝影棚，因為交通費占了上次預算將近三分之一。\n3. J. Wu 將在新日期前對現有客戶做一份簡短問卷，題目草稿須於三月二十五日前繳交。\n4. 團隊否決了刊登平面廣告的提案，一致認為同樣的錢在網路上能接觸到更多讀者。\n5. R. Mehta 四月休假期間，社群媒體排程由 S. Lindqvist 接手。\n下次會議：三月二十八日十點，4B 會議室。',
  qs:[
    { q:'Why was the launch delayed?', opts:['The budget was cut.','Design files were late.','The studio was closed.','A team member is on leave.'], a:1,
      why:'The design files arrived two weeks late。' },
    { q:'What is T. Abara going to investigate?', opts:['A nearer studio','A new survey tool','Print advertising rates','A later launch date'], a:0,
      why:'look into hiring a studio closer to the office —— look into ＝ 調查、研究。' },
    { q:'What did the team decide about print advertisements?', opts:['To approve them','To reject them','To postpone them','To reduce them'], a:1,
      why:'turned down the proposal —— turn down ＝ 拒絕。' },
    { q:'What will S. Lindqvist do in April?', opts:['Run the customer survey','Manage social media','Chair the meeting','Book the studio'], a:1,
      why:'take over the social media schedule while R. Mehta is on leave in April。' }
  ]
},

/* ---------------- U49 易混淆字組 ---------------- */
{
  id:'r4901', u:'s4u4', title:'Report Summary: Regional Sales',
  text:'Summary of Findings — Q3 Regional Review\nSales rose in four of our six regions during the third quarter. The strongest growth came from the southern region, where revenue increased for the fifth successive quarter. Northern sales fell slightly; the report indicates that road works near two of our stores affected foot traffic between July and September.\nThe most considerable change was in shipping costs, which dropped after we moved to a more economical carrier in August. The new contract raised delivery times by roughly one day, but customer complaints did not increase.\nManagement has not yet decided whether to renew the carrier contract. A considerate approach would be to survey store managers first, since they deal with delivery problems directly. A decision is expected before the end of November.',
  zh:'調查結果摘要 —— 第三季區域檢討\n第三季有四個區域業績成長，其中南區成長最強，營收連續第五季上升。北區業績小幅下滑；報告指出七月到九月間有兩家店附近在施工，影響了來客量。\n變化最大的是運費，八月改用較便宜的貨運商後運費下降。新合約把配送時間拉長了大約一天，但客訴並未增加。\n管理層尚未決定是否續約。比較體貼的做法是先詢問店長的意見，因為處理配送問題的是他們。決定預計於十一月底前做出。',
  qs:[
    { q:'What happened in the southern region?', opts:['Sales fell slightly.','Growth continued for a fifth quarter.','A store was closed.','Shipping costs rose.'], a:1,
      why:'revenue increased for the fifth successive quarter —— successive ＝ 連續。' },
    { q:'What caused the drop in northern sales?', opts:['Higher prices','Road works near stores','A carrier change','Fewer staff'], a:1,
      why:'road works near two of our stores affected foot traffic。' },
    { q:'What was the result of changing carriers?', opts:['Costs fell but delivery took longer.','Costs rose and delivery was faster.','Both costs and complaints rose.','Nothing changed.'], a:0,
      why:'moved to a more economical carrier … raised delivery times by roughly one day。' },
    { q:'What is suggested before renewing the contract?', opts:['Asking store managers','Raising prices','Closing two stores','Extending delivery times'], a:0,
      why:'survey store managers first, since they deal with delivery problems directly。' }
  ]
},

/* ---------------- U50 Part 6 那一關的收尾閱讀 ---------------- */
{
  id:'r5001', u:'s4u5', title:'Policy: Equipment Requests',
  text:'Equipment Request Policy — effective 1 February\nAll requests for new office equipment must be submitted through the online form. Requests sent by email will no longer be processed, as they were difficult to track and often arrived without the required cost estimate.\nEach request must include a short reason and at least one quotation. If the item costs more than 15,000 dollars, two quotations are required. Requests under 3,000 dollars can be approved by a department head; anything above that goes to the finance committee, which meets on the first Tuesday of each month.\nStaff should allow three weeks between submitting a request and receiving the item. Urgent requests can be marked as such, but approval is still needed before any purchase is made. Employees who buy equipment first and request approval afterwards may not be reimbursed.',
  zh:'設備申請政策 —— 二月一日起實施\n所有新辦公設備的申請都必須透過線上表單提出。以電子郵件寄出的申請將不再受理，因為那些申請難以追蹤，而且常常沒有附上必要的估價。\n每一筆申請都必須包含簡短理由與至少一份報價。若品項超過一萬五千元，則需要兩份報價。三千元以下的申請由部門主管核准；超過的則送財務委員會，該委員會每月第一個星期二開會。\n同仁應預留三週的時間，從送出申請到收到品項為止。急件可加註標示，但購買前仍須取得核准。先買了設備再申請核准的同仁，可能無法獲得核銷。',
  qs:[
    { q:'Why are email requests no longer accepted?', opts:['They were too slow to write.','They were hard to track.','They were sent to the wrong office.','They cost more to process.'], a:1,
      why:'they were difficult to track and often arrived without the required cost estimate。' },
    { q:'How many quotations are needed for an item costing 20,000 dollars?', opts:['None','One','Two','Three'], a:2,
      why:'超過一萬五千元需要兩份報價，兩萬元在那之上。' },
    { q:'Who approves a request for 2,500 dollars?', opts:['A department head','The finance committee','The online system','Human resources'], a:0,
      why:'Requests under 3,000 dollars can be approved by a department head。' },
    { q:'What may happen to staff who buy equipment before approval?', opts:['They receive it faster.','They may not get their money back.','They must submit two forms.','They are given a warning only.'], a:1,
      why:'may not be reimbursed —— reimburse ＝ 核銷、退還費用。' }
  ]
},

/* ---------------- U51 Part 7 單篇（這一關出兩篇） ---------------- */
{
  id:'r5101', u:'s4u6', title:'Job Posting: Operations Coordinator',
  text:'Operations Coordinator — Kaohsiung Office\nHarborline Freight is seeking an operations coordinator to join our southern team. The successful applicant will schedule daily deliveries, respond to customer inquiries, and prepare weekly reports for the regional manager.\nRequirements: at least three years of experience in logistics or a related field; confident written English; familiarity with scheduling software. A degree is preferred but candidates with equivalent work experience will be considered.\nThis is a full-time position, Monday to Friday, with occasional Saturday cover during peak season. We offer a travel allowance, fourteen days of paid leave in the first year, and support for professional training.\nTo apply, send a resume and a short cover letter to careers@harborline.example by 30 April. Please do not attach certificates at this stage; shortlisted candidates will be asked for them later. Interviews will be held during the first week of May.',
  zh:'營運協調專員 —— 高雄辦公室\nHarborline 貨運誠徵營運協調專員加入南部團隊。錄取者將負責安排每日配送、回覆客戶詢問，並為區經理製作週報。\n條件：物流或相關領域三年以上經驗；具備良好的英文書寫能力；熟悉排程軟體。具學位者尤佳，但同等工作經驗者亦在考慮之列。\n本職為全職，週一至週五，旺季偶爾需支援週六。我們提供交通津貼、第一年十四天有薪假，以及專業訓練補助。\n應徵請於四月三十日前將履歷與簡短求職信寄至 careers@harborline.example。此階段請勿附上證書；進入複試者屆時會另行索取。面試將於五月第一週舉行。',
  qs:[
    { q:'What is NOT listed as a duty of the position?', opts:['Scheduling deliveries','Answering customer questions','Writing weekly reports','Training new drivers'], a:3,
      why:'前三項都在第一段，訓練駕駛沒有提到。' },
    { q:'What is said about educational qualifications?', opts:['A degree is required.','Experience can replace a degree.','No degree is accepted.','A degree must be verified first.'], a:1,
      why:'candidates with equivalent work experience will be considered。' },
    { q:'What should applicants NOT send with the application?', opts:['A resume','A cover letter','Certificates','An email address'], a:2,
      why:'Please do not attach certificates at this stage。' },
    { q:'What is indicated about weekend work?', opts:['It is never required.','It may happen in busy periods.','It is paid double.','It replaces a weekday.'], a:1,
      why:'occasional Saturday cover during peak season。' }
  ]
},
{
  id:'r5102', u:'s4u6', title:'Customer Letter: Delayed Order',
  text:'Dear Mr. Oyelaran,\nI am writing about order 88-2140, which you placed on 3 June. I am sorry to tell you that the shelving units you ordered are temporarily out of stock. Our supplier has told us that the next production run will be completed in early July, and we expect to ship your order during the week of 10 July.\nI understand this is later than the date given when you ordered. You have three options. First, we can hold the order and ship it in July at no extra cost, and we will remove the delivery charge. Second, we can send the similar model in grey, which is in stock now, at the same price. Third, we can cancel the order and refund you in full within five working days.\nPlease reply by 20 June so that we can act on your choice. If we have not heard from you by then, we will hold the order rather than cancel it.\nSincerely,\nPriya Raghunathan, Customer Service',
  zh:'親愛的 Oyelaran 先生：\n關於您六月三日下的訂單 88-2140，很遺憾通知您，您訂購的層架暫時缺貨。供應商告知下一批生產將於七月初完成，我們預計在七月十日那一週為您出貨。\n我了解這比您下單時得到的日期要晚。您有三個選擇：第一，我們保留訂單，七月出貨且不加收費用，並免除運費；第二，我們寄出目前有現貨的灰色類似款，價格相同；第三，取消訂單並於五個工作天內全額退款。\n請於六月二十日前回覆，以便我們依您的選擇處理。若屆時未收到回覆，我們將保留訂單而非取消。\n敬祝順心\n客服部　Priya Raghunathan',
  qs:[
    { q:'Why is the order delayed?', opts:['The item is out of stock.','The address was wrong.','Payment was not received.','The warehouse is closed.'], a:0,
      why:'the shelving units you ordered are temporarily out of stock。' },
    { q:'What is offered if the customer waits until July?', opts:['A different colour','Free delivery','A partial refund','A larger unit'], a:1,
      why:'we will remove the delivery charge —— 也就是免運費。' },
    { q:'What will happen if Mr. Oyelaran does not reply?', opts:['The order will be cancelled.','The grey model will be sent.','The order will be kept.','He will be charged extra.'], a:2,
      why:'we will hold the order rather than cancel it。' },
    { q:'What is true about the grey model?', opts:['It costs more.','It is available now.','It ships in July.','It has been discontinued.'], a:1,
      why:'the similar model in grey, which is in stock now, at the same price。' }
  ]
},

/* ---------------- U53 同義改寫 ---------------- */
{
  id:'r5301', u:'s4u8', title:'Notice: Library Access Changes',
  text:'From 1 April, access to the technical library will require a staff card. The room will no longer be left unlocked overnight.\nBorrowing remains free of charge for all employees. Items may be kept for four weeks, and a further four weeks may be granted on request unless another reader has reserved the title. Overdue items do not incur a fine, but borrowing rights are suspended until they are returned.\nThe reference shelves near the window hold material that may not be taken out of the room. This includes standards, bound journals and the map collection. Photocopying of these items is permitted for personal study.\nStaff who need a title the library does not hold may submit a purchase suggestion. Roughly half of the suggestions received last year were bought.',
  zh:'自四月一日起，進入技術圖書室須刷員工卡，該室夜間不再保持未上鎖狀態。\n全體員工借閱仍然免費。書籍可借四週，若無其他讀者預約，可申請再延四週。逾期不罰款，但在歸還前會暫停借閱權限。\n窗邊的參考書架陳列不得攜出室外的資料，包括標準規範、合訂期刊與地圖收藏。這些資料可為個人研讀之用影印。\n若需要圖書室未收藏的書目，同仁可提出採購建議。去年收到的建議約有一半獲得採購。',
  qs:[
    { q:'What is required to enter the library from 1 April?', opts:['A reservation','A staff card','A purchase suggestion','Payment of a fee'], a:1,
      why:'require a staff card。' },
    { q:'What does the notice say about borrowing costs?', opts:['There is no charge.','A small fee applies.','Only members pay.','Fines are charged daily.'], a:0,
      why:'free of charge 換句話說就是 no charge —— 選項不會照抄原文。' },
    { q:'When can a loan NOT be extended?', opts:['After four weeks','If the item is overdue','If someone else has reserved it','If it is a journal'], a:2,
      why:'unless another reader has reserved the title —— unless 帶出的就是那個例外。' },
    { q:'What happens if an item is returned late?', opts:['A fine is charged.','Borrowing is paused.','The card is cancelled.','Nothing happens.'], a:1,
      why:'borrowing rights are suspended —— suspended 換句話說就是暫停，不是罰款。' }
  ]
},

/* ---------------- U54 閱讀速度訓練（出三篇，刻意短而密） ---------------- */
{
  id:'r5401', u:'s4u9', title:'Announcement: Cafeteria Hours',
  text:'Beginning Monday, the staff cafeteria will open from 7:30 a.m. to 3:00 p.m., one hour later in the morning and one hour later in the afternoon than at present. The change follows a survey in which most respondents said they rarely used the cafeteria before eight but often wanted coffee in the early afternoon.\nHot meals will still be served between eleven and two. Outside those hours, sandwiches, fruit and drinks will be available from the counter near the entrance. The vending machines on floors three and five will continue to operate at all times.\nThe cafeteria will close for one day, 14 August, while the new counter is installed. On that day only, lunch vouchers for the ground-floor bakery will be handed out at reception.',
  zh:'自星期一起，員工餐廳的營業時間為早上七點半到下午三點，比目前早上晚一小時、下午也晚一小時。這項調整是根據一份問卷的結果：多數填答者表示八點前很少使用餐廳，但下午稍早常想喝咖啡。\n熱食供應時間仍為十一點到兩點。其他時段可在入口旁的櫃檯購買三明治、水果與飲料。三樓與五樓的販賣機則全時段照常運作。\n餐廳將於八月十四日因安裝新櫃檯休息一天。僅限當天，接待處會發放一樓麵包店的午餐券。',
  qs:[
    { q:'What time will the cafeteria open after the change?', opts:['6:30 a.m.','7:30 a.m.','8:00 a.m.','11:00 a.m.'], a:1,
      why:'open from 7:30 a.m. —— 第一句就有。' },
    { q:'Why was the change made?', opts:['To save money','Because of survey results','Because of building work','To match the bakery hours'], a:1,
      why:'The change follows a survey。' },
    { q:'What is available at reception on 14 August?', opts:['Hot meals','Vending machine tokens','Lunch vouchers','Coffee'], a:2,
      why:'lunch vouchers for the ground-floor bakery will be handed out at reception。' }
  ]
},
{
  id:'r5402', u:'s4u9', title:'Notice: Parking Permits',
  text:'All parking permits expire on 30 September. Renewal forms are available from the security desk and must be returned with a copy of your vehicle registration. Permits issued this year will be valid for eighteen months rather than twelve, so the next renewal will not be until March of the year after next.\nSpaces in the covered garage are limited and are assigned by seniority. Staff who do not receive a garage space will be given a permit for the open lot behind Building C, which is a five-minute walk from the main entrance. A shuttle runs between the lot and the entrance every fifteen minutes before nine and after five.\nVisitors do not need permits but must sign in at the gate. Cars parked without a valid permit after 1 October will be towed at the owner\'s expense.',
  zh:'所有停車證將於九月三十日到期。續證表格可在警衛台索取，繳回時須附上行照影本。今年核發的停車證效期為十八個月而非十二個月，因此下次續證要到後年三月。\n室內車庫車位有限，依年資分配。未分配到車庫車位的同仁將取得 C 棟後方露天停車場的停車證，該處距離大門步行五分鐘。九點前與五點後每十五分鐘有接駁車往返停車場與大門。\n訪客不需停車證，但須在大門登記。十月一日後未持有效停車證停放的車輛將被拖吊，費用由車主負擔。',
  qs:[
    { q:'What must be submitted with the renewal form?', opts:['A photo','Vehicle registration','A parking fee','A manager\'s signature'], a:1,
      why:'must be returned with a copy of your vehicle registration。' },
    { q:'How are garage spaces decided?', opts:['First come, first served','By seniority','By a lottery','By department'], a:1,
      why:'are assigned by seniority。' },
    { q:'What happens to cars without a permit after 1 October?', opts:['They are fined.','They are towed.','They are moved to Building C.','They are reported to security.'], a:1,
      why:'will be towed at the owner\'s expense。' }
  ]
},
{
  id:'r5403', u:'s4u9', title:'Email: Training Session Moved',
  text:'Team,\nThe software training originally set for Wednesday afternoon has been moved to Friday at 9:00 a.m. The trainer\'s flight was rebooked and she will not reach the city until late Wednesday evening.\nThe session will now run for two hours instead of three. To make up for the shorter time, she has sent a set of practice files, which I have placed in the shared folder. Please open them and try the first two exercises before Friday. Those who come without having looked at the files will find the pace fast.\nRoom 6A holds twenty people and we have twenty-three registered. If you have already used this software at a previous job, consider giving up your place — a recording will be posted the following week and will cover everything.\nLet me know by Thursday noon if you can no longer attend.\nMarcus',
  zh:'各位：\n原訂星期三下午的軟體訓練改到星期五早上九點。講師的班機改期了，她要到星期三深夜才會抵達。\n課程時間由三小時縮短為兩小時。為了彌補時間變短，她寄來了一組練習檔案，我已放在共用資料夾。請在星期五前打開並試做前兩個練習。沒看過檔案就來的人會覺得節奏很快。\n6A 會議室只能容納二十人，而目前有二十三人報名。如果你在前一份工作用過這套軟體，請考慮讓出名額 —— 下週會放上錄影，內容完全一樣。\n若你無法出席，請在星期四中午前告訴我。\nMarcus',
  qs:[
    { q:'Why was the session moved?', opts:['The room was too small.','The trainer\'s flight changed.','Too few people registered.','The files were not ready.'], a:1,
      why:'The trainer\'s flight was rebooked。' },
    { q:'What are participants asked to do before Friday?', opts:['Book a seat','Try two exercises','Watch the recording','Bring a laptop'], a:1,
      why:'try the first two exercises before Friday。' },
    { q:'Who is asked to consider giving up a place?', opts:['New employees','People who used the software before','Those who cannot come Friday','Anyone in Room 6A'], a:1,
      why:'If you have already used this software at a previous job。' }
  ]
},

/* ---------------- U55 魔王關的收尾閱讀 ---------------- */
{
  id:'r5501', u:'s4u10', title:'Press Release: Store Opening',
  text:'FOR IMMEDIATE RELEASE\nTaichung — Brightleaf Home will open its eighth Taiwan store on 3 October at the Wenxin Road shopping centre. Having operated in the north for nine years, the company is now expanding into central Taiwan, where it plans two further stores by the end of next year.\nThe new store will carry the full furniture range plus a garden section not found at other branches. If the garden section performs well, similar sections will be added elsewhere. "We would have opened here sooner," said regional director Amara Bello, "but we wanted a site large enough to test the new format."\nTo mark the opening, the first two hundred customers each day during the opening week will receive a complimentary plant. Delivery within Taichung will be free on orders over 3,000 dollars until the end of October; after that the usual charge applies unless the order exceeds 8,000 dollars.\nStore hours will be 10:00 to 21:30 daily. Media enquiries should be directed to press@brightleaf.example.',
  zh:'即時發布\n台中 —— Brightleaf Home 將於十月三日在文心路購物中心開設台灣第八家門市。該公司在北部經營九年後，如今跨足中台灣，並計畫在明年底前再開兩家門市。\n新店將販售完整家具系列，另設有其他分店沒有的園藝區。若園藝區表現良好，其他門市也會加設類似專區。區域總監 Amara Bello 表示：「我們本來可以更早開幕，但我們想找一個大到足以測試新型態的場地。」\n為慶祝開幕，開幕週每日前兩百名顧客可獲贈植物一盆。十月底前台中市區滿三千元免運，之後恢復原本運費，除非訂單超過八千元。\n營業時間為每日十點到二十一點三十分。媒體詢問請寄至 press@brightleaf.example。',
  qs:[
    { q:'What is new about this store compared with other branches?', opts:['It is larger overall.','It has a garden section.','It opens earlier each day.','It offers free delivery always.'], a:1,
      why:'a garden section not found at other branches。' },
    { q:'Why did the company not open in Taichung earlier?', opts:['It lacked staff.','It was waiting for a large enough site.','Sales in the north were poor.','The centre was not built.'], a:1,
      why:'we wanted a site large enough to test the new format。' },
    { q:'What do the first two hundred daily customers receive?', opts:['A discount voucher','A free plant','Free delivery','A garden tool'], a:1,
      why:'will receive a complimentary plant。complimentary ＝ free。' },
    { q:'What is the delivery policy in November?', opts:['Always free in Taichung','Free over 3,000 dollars','Free over 8,000 dollars','Never free'], a:2,
      why:'十月底後恢復原運費，除非超過八千元 —— 也就是超過八千才免運。' }
  ]
}

];
