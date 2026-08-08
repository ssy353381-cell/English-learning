/* ==========================================================================
   toeic-p7-s5.js — 多益 Part 7：三篇閱讀（Unit 57、65）
   id 前綴 d，與雙篇同一個資料集（Ex.part7 的 docs 本來就是陣列）

   三篇和雙篇的差別不是「多一份文件」，是**線索被拆成三段**：
   規則在公告、這個人的情況在信裡、最後的結果在第三份（回覆、發票、時刻表）。
   雙篇的跨篇題只要對兩處，三篇常常要對三處才湊得出一個答案。

   所以這裡的 both:true 至少要有一題**真的用到第三份文件** ——
   只在前兩份之間對照的話，第三份就只是裝飾，這一關等於還在練雙篇。

   docs[i]／qs[i] 的欄位與 toeic-p7-s4.js 完全相同，畫面差別只有欄數。
   ========================================================================== */
window.DATA_PART7_S5 = [

{
  id:'d5701', u:'s5u2', title:'研討會議程、報名信與確認回覆',
  docs:[
    { label:'Programme', title:'Pacific Supply Chain Forum — 3 October',
      text:'All sessions take place at the Meridian Conference Centre.\n\n  09:00-10:15  S1  Port Congestion in 2026        Hall A\n  10:45-12:00  S2  Contract Clauses That Fail      Room 4\n  13:00-14:15  S3  Warehouse Automation            Hall A\n  14:45-16:00  S4  Supplier Risk Scoring           Room 4\n\nStandard registration is 3,600 dollars and covers all four sessions, lunch and materials.\n\nMembers of the Pacific Trade Association pay 2,700 dollars. Anyone booking four or more places from the same organisation pays the member rate regardless of membership.\n\nSessions in Room 4 are capped at forty seats and are allocated in the order payment is received. Delegates who cannot attend a Room 4 session they booked will be moved to the Hall A session running at the same time.\n\nThe deadline for name changes is 26 September.',
      zh:'所有場次皆於 Meridian 會議中心舉行。\n\n  09:00-10:15  S1  2026 年的港口壅塞      A 廳\n  10:45-12:00  S2  失效的合約條款        4 號室\n  13:00-14:15  S3  倉儲自動化            A 廳\n  14:45-16:00  S4  供應商風險評分        4 號室\n\n一般報名費三千六百元，涵蓋四個場次、午餐與教材。\n\n太平洋貿易協會會員為兩千七百元。同一機構報名四位以上者，不論是否為會員，一律適用會員價。\n\n4 號室的場次限四十席，依收到款項的先後順序分配。已報名 4 號室場次卻無法入場的與會者，將改排到同時段的 A 廳場次。\n\n更改與會者姓名的截止日為九月二十六日。' },
    { label:'Email', title:'Registration — Calderwood Logistics',
      text:'From: Nuria Bastida, Operations\nTo: forum@meridiancentre.example\nDate: 18 September\n\nGood morning,\n\nPlease register five people from Calderwood Logistics. We are not association members.\n\nFour of us — myself, Tomás Iriarte, Wen-hsin Chao and Adaeze Nnamdi — want the full day. Our fifth colleague, Rafael Boaventura, can only join after lunch.\n\nThe two afternoon sessions are the priority for everyone. If Room 4 is already full for the afternoon session, please tell me before you take payment; we would rather send fewer people than split the group across two rooms.\n\nOne more thing: Adaeze may be replaced by a colleague if her site visit is confirmed. She should know by the 24th.\n\nCould you send the invoice today so that our finance team can pay this week?\n\nBest regards,\nNuria',
      zh:'寄件者：Nuria Bastida，營運部\n收件者：forum@meridiancentre.example\n日期：九月十八日\n\n早安：\n\n請為 Calderwood Logistics 的五位同仁報名。我們不是協會會員。\n\n其中四位 —— 我本人、Tomás Iriarte、趙文歆與 Adaeze Nnamdi —— 要參加全天。第五位同事 Rafael Boaventura 只能在午餐後加入。\n\n下午的兩個場次是所有人的優先選項。若下午的 4 號室場次已額滿，請在收款前先告訴我；我們寧可少去幾個人，也不想讓整組人被拆到兩個房間。\n\n另外一件事：如果 Adaeze 的廠區訪視確定了，可能會由另一位同事替補。她二十四日前會知道。\n\n可以請您今天就開發票，讓我們財務本週付款嗎？\n\n謹此\nNuria' },
    { label:'Reply', title:'Re: Registration — Calderwood Logistics',
      text:'From: Meridian Conference Centre\nTo: Nuria Bastida\nDate: 18 September\n\nDear Ms. Bastida,\n\nThank you. Five places are held under your organisation\'s name and the invoice is attached.\n\nRoom 4 has eleven seats left for the afternoon session, so all five of your colleagues are confirmed there. Payment reached us this morning for two other organisations, so I would not delay.\n\nPlease note that four of your delegates are booked for the whole day and one from 13:00. The invoice reflects this: the afternoon-only place is charged at half the applicable rate.\n\nName changes can be made free of charge up to the published deadline. After that a 400-dollar administration fee applies to each change.\n\nKind regards,\nJoachim Petrescu, Delegate Services',
      zh:'寄件者：Meridian 會議中心\n收件者：Nuria Bastida\n日期：九月十八日\n\n親愛的 Bastida 女士：\n\n感謝來信。已以貴機構名義保留五個名額，發票如附件。\n\n4 號室下午場次尚餘十一席，貴公司五位同仁均已確認入座。今天早上另有兩家機構完成付款，建議不要拖延。\n\n請注意，貴公司有四位報名全天、一位自十三時起。發票已反映此點：僅參加下午者按適用費率的半價計收。\n\n更改姓名於公告截止日前免費。截止日之後每次更改酌收四百元行政費。\n\n順頌時祺\n與會服務組　Joachim Petrescu' }
  ],
  qs:[
    { q:'Which two sessions take place in Room 4?',
      opts:['S1 and S2','S2 and S4','S3 and S4','S1 and S3'], a:1,
      why:'議程表上 Room 4 的是 S2（10:45）與 S4（14:45）。' },
    { q:'What does Ms. Bastida ask the centre to do before taking payment?',
      opts:['Confirm the lunch menu','Warn her if the afternoon Room 4 session is full','Move everyone to Hall A','Delay the invoice until October'], a:1,
      why:'If Room 4 is already full for the afternoon session, please tell me before you take payment。' },
    { both:true,
      q:'Which rate applies to Calderwood Logistics?',
      opts:['3,600 dollars, as they are not members','2,700 dollars, because they booked five places','3,600 dollars for four and 2,700 for one','A rate agreed by email'], a:1,
      why:'信裡說不是會員、但報名五位；議程說同機構四位以上一律適用會員價 —— 兩篇合起來才選得出 2,700。' },
    { both:true,
      q:'What can be concluded about Mr. Boaventura\'s place?',
      opts:['It was cancelled.','It is charged at half the member rate.','It covers all four sessions.','It is on the waiting list.'], a:1,
      why:'要三篇：信說他只到下午，回覆說 the afternoon-only place is charged at half the applicable rate，而適用費率由議程的「四位以上」規則定為會員價。' },
    { both:true,
      q:'If Adaeze Nnamdi is replaced on 28 September, what will happen?',
      opts:['The change will be free.','A 400-dollar fee will apply.','The place will be cancelled.','She will be moved to Hall A.'], a:1,
      why:'議程說改名截止日是九月二十六日，回覆說截止後每次改名收四百元 —— 日期在一篇、金額在另一篇。' }
  ]
},

{
  id:'d6501', u:'s5u10', title:'徵才啟事、應徵信與面試安排',
  docs:[
    { label:'Job posting', title:'Inventory Analyst — Halvard Distribution',
      text:'Location: Taichung distribution centre\nContract: permanent, full time\n\nThe inventory analyst reports to the planning manager and is responsible for stock accuracy across three warehouses.\n\nEssential:\n  - at least three years in a stock control or planning role\n  - advanced spreadsheet skills, including pivot tables\n  - experience of at least one warehouse management system\n\nDesirable:\n  - a second language, particularly Japanese or Vietnamese\n  - experience of a stock count in a live warehouse\n\nApplications close on 30 April. Candidates who are shortlisted will be asked to complete a two-hour data exercise before any interview; the exercise is sent by email and must be returned within four days.\n\nInterviews will be held during the week of 19 May at the Taichung site. We are unable to reimburse travel for first interviews.',
      zh:'地點：台中配送中心\n職務性質：正職，全職\n\n庫存分析師向規劃經理呈報，負責三座倉庫的庫存準確度。\n\n必要條件：\n  - 庫存管理或規劃職務三年以上經驗\n  - 進階試算表能力，包含樞紐分析表\n  - 至少一套倉儲管理系統的使用經驗\n\n加分條件：\n  - 第二外語，尤以日文或越南文為佳\n  - 在營運中的倉庫執行過盤點\n\n應徵於四月三十日截止。進入複選的應徵者需先完成兩小時的資料測驗，測驗以電子郵件寄出，須於四天內繳回。\n\n面試將於五月十九日該週於台中廠區舉行。首次面試恕不補助交通費。' },
    { label:'Email', title:'Application — Inventory Analyst',
      text:'From: Sithembile Dlamini\nTo: careers@halvard.example\nDate: 27 April\n\nDear Hiring Team,\n\nI am applying for the inventory analyst position advertised on your site.\n\nI have spent four years as a stock controller at a food importer in Kaohsiung, where I ran the weekly cycle counts and rebuilt our reorder points after we changed warehouse systems in 2024. I have used two such systems and am comfortable building pivot tables and lookup formulas.\n\nI have not taken part in a full stock count while a warehouse was operating — our counts were always done on a closed Sunday — but I have planned them.\n\nI should mention that I will be out of the country from 6 to 12 May with limited email access. If anything needs to reach me in that window, my mobile number is below.\n\nI can relocate to Taichung and could start with four weeks\' notice.\n\nSincerely,\nSithembile Dlamini',
      zh:'寄件者：Sithembile Dlamini\n收件者：careers@halvard.example\n日期：四月二十七日\n\n敬啟者：\n\n我想應徵貴公司網站上刊登的庫存分析師職缺。\n\n我在高雄一家食品進口商擔任庫存管理員四年，負責每週循環盤點，並在二〇二四年更換倉儲系統後重建了再訂購點。我使用過兩套這類系統，也能熟練建立樞紐分析表與查表公式。\n\n我沒有在倉庫營運中參與過完整盤點 —— 我們的盤點一律安排在週日休館日 —— 但我規劃過。\n\n另需說明，五月六日至十二日我人在國外，收信不便。若那段期間有事需要聯繫，我的手機號碼列於下方。\n\n我可以搬到台中，並可在四週通知期後到職。\n\n此致\nSithembile Dlamini' },
    { label:'Email', title:'Next steps',
      text:'From: Halvard Distribution, Recruitment\nTo: Sithembile Dlamini\nDate: 2 May\n\nDear Ms. Dlamini,\n\nThank you for your application, which has been shortlisted.\n\nThe data exercise is attached to this message. Please note the standard return window given in the advertisement. If that is difficult, reply today and we will reissue it on 13 May instead.\n\nAssuming the exercise is returned, we would like to see you on Wednesday 21 May at 10:00. The session lasts about ninety minutes and includes a short tour of the warehouse floor, so please wear flat shoes.\n\nYou mentioned relocation. Successful candidates are offered a relocation allowance, but this is confirmed only at offer stage and is not discussed at interview.\n\nRegards,\nMarguerite Achterberg, Recruitment',
      zh:'寄件者：Halvard Distribution 招募組\n收件者：Sithembile Dlamini\n日期：五月二日\n\n親愛的 Dlamini 女士：\n\n感謝您的應徵，您已進入複選。\n\n資料測驗附於本信。請留意徵才啟事中所載的標準繳回期限。若有困難，請於今日回覆，我們改在五月十三日重新寄出。\n\n若測驗如期繳回，我們希望於五月二十一日星期三上午十點與您見面。面談約九十分鐘，含倉庫現場的簡短參觀，請穿平底鞋。\n\n您提到搬遷。錄取者可獲搬遷津貼，惟此事僅於發出錄取通知階段確認，面試時不予討論。\n\n謹此\n招募組　Marguerite Achterberg' }
  ],
  qs:[
    { q:'What is listed as a desirable rather than essential requirement?',
      opts:['Three years in stock control','Advanced spreadsheet skills','A second language','Experience of a warehouse system'], a:2,
      why:'第二外語列在 Desirable 那一段。' },
    { q:'What does Ms. Dlamini say about her availability in May?',
      opts:['She can start immediately.','She is abroad from 6 to 12 May.','She cannot travel to Taichung.','She is unavailable all month.'], a:1,
      why:'I will be out of the country from 6 to 12 May。' },
    { both:true,
      q:'Why does the recruiter offer to reissue the exercise on 13 May?',
      opts:['The exercise is being rewritten.','The four-day window falls while she is away.','Interviews were postponed.','She asked for more time.'], a:1,
      why:'啟事說測驗四天內繳回，測驗五月二日寄出；信裡說她六到十二日在國外 —— 兩篇相加才看得出時間撞在一起。' },
    { both:true,
      q:'Which requirement does Ms. Dlamini NOT fully meet?',
      opts:['Years of experience','Spreadsheet skills','A stock count in a live warehouse','Use of a warehouse system'], a:2,
      why:'啟事把 a stock count in a live warehouse 列為加分條件；她信裡明說盤點都在休館日做。' },
    { both:true,
      q:'What will Ms. Dlamini most likely have to pay for herself?',
      opts:['The data exercise','Travel to the 21 May interview','The warehouse tour','Her relocation to Taichung'], a:1,
      why:'啟事說首次面試不補助交通，第三封信確認面試就是五月二十一日的第一次見面 —— 搬遷津貼則是錄取後才談，不是自付。' }
  ]
}

];
