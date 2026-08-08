/* ==========================================================================
   toeic-p7-s4.js — 多益 Part 7：雙篇閱讀（Unit 52、55）
   id 前綴 d（double，與 v/g/r/i/p/q/m/c/x 互斥）

   雙篇閱讀考的不是「讀得懂」，是**把兩份文件對起來**。所以每一組資料至少要有
   一題的答案「單看任何一篇都找不到」—— 那一題掛 both:true。
   沒有 both 的題目那組就不算雙篇，只是兩篇單篇擺在一起。

   典型的組合（多益一直在用這幾種）：
     公告 ＋ 回覆的信       規則寫在公告，這個人的情況寫在信裡
     價目表 ＋ 訂單         單價寫在表上，數量寫在單上，要自己乘
     行程表 ＋ 更改通知     原時間在表上，異動在通知上，問「最後幾點」

   docs[i]：{ label 文件類型（Email／Notice…）, title, text, zh }
   qs[i]：  { q, opts, a, why, both }
            both:true 表示這一題要兩篇合起來看 —— 畫面上會標出來，
            批改時的解析也要說清楚「哪一篇提供哪一半」。
   ========================================================================== */
window.DATA_PART7_S4 = [

{
  id:'d5201', u:'s4u7', title:'研討會報名與確認信',
  docs:[
    { label:'Notice', title:'Autumn Skills Workshops — Registration',
      text:'Four half-day workshops will run at the Nanjing Road training centre this autumn. Places are limited to twenty per session.\n\n  W1  Data Reporting        5 October,  09:00-12:30   2,400 dollars\n  W2  Negotiation Basics    12 October, 13:30-17:00   2,800 dollars\n  W3  Technical Writing     19 October, 09:00-12:30   2,400 dollars\n  W4  Project Scheduling    26 October, 13:30-17:00   3,200 dollars\n\nStaff of member companies receive a 25 percent discount on any single workshop. Anyone registering for three or more workshops pays a flat 7,500 dollars for all of them, and the member discount does not apply on top of this. Materials are included in every price.\n\nRegister at least ten days before the session date. Transfers to another session are permitted once, at no charge.',
      zh:'今年秋季將於南京東路訓練中心舉辦四場半日工作坊，每場名額限二十人。\n\n  W1  數據報告      十月五日  09:00-12:30  2,400 元\n  W2  談判基礎      十月十二日 13:30-17:00  2,800 元\n  W3  技術寫作      十月十九日 09:00-12:30  2,400 元\n  W4  專案排程      十月二十六日 13:30-17:00 3,200 元\n\n會員公司員工單場報名享七五折。報名三場以上者一律收取七千五百元，且不再另行折扣。所有價格均含教材。\n\n請於課程日期前至少十天報名。可免費轉換場次一次。' },
    { label:'Email', title:'Re: Workshop places',
      text:'From: Hana Lindgren, Office Manager\nTo: training@centre.example\nDate: 20 September\n\nHello,\n\nI would like to register three colleagues from Meridian Components. We are a member company.\n\nPlease sign up Ravi Chandrasekaran for the data reporting session and the technical writing session. Both are in the morning, which suits him.\n\nDaniela Sorrentino would like the negotiation workshop, and Tomás Ferreira wants project scheduling. Tomás has asked whether he can switch to a later date if a client meeting is confirmed — he should know by the first week of October.\n\nCould you confirm the total before we raise the purchase order? We would prefer a single invoice for all four places.\n\nThanks,\nHana',
      zh:'寄件者：Hana Lindgren，辦公室經理\n收件者：training@centre.example\n日期：九月二十日\n\n您好：\n\n我想為 Meridian Components 的三位同事報名。我們是會員公司。\n\n請為 Ravi Chandrasekaran 報名數據報告與技術寫作兩場，兩場都在上午，時間對他來說剛好。\n\nDaniela Sorrentino 想上談判工作坊，Tomás Ferreira 要專案排程。Tomás 想問如果客戶會議確定了，他能不能改到比較晚的日期 —— 他十月第一週就會知道。\n\n可以請您在我們開採購單前先確認總金額嗎？我們希望四個名額開一張發票。\n\n謝謝\nHana' }
  ],
  qs:[
    { q:'How many workshop places does Ms. Lindgren request in total?',
      opts:['Three','Four','Five','Six'], a:1,
      why:'Ravi 報兩場、Daniela 一場、Tomás 一場 —— 三個人共四個名額，信末的 all four places 也對得上。' },
    { q:'Which workshop is the most expensive on its own?',
      opts:['Data Reporting','Negotiation Basics','Technical Writing','Project Scheduling'], a:3,
      why:'公告的表格裡 W4 是 3,200 元，四場之中最高。' },
    { both:true,
      q:'Which price applies to Ravi Chandrasekaran\'s registration?',
      opts:['The flat rate of 7,500 dollars','The member discount on two workshops','Full price on two workshops','A single member-discounted place'], a:1,
      why:'要兩篇合起來：信裡說 Ravi 報兩場、公司是會員；公告說三場以上才適用一律 7,500，兩場則照單場打七五折。' },
    { both:true,
      q:'What is the deadline for Tomás Ferreira to register for his session?',
      opts:['1 October','5 October','16 October','26 October'], a:2,
      why:'信裡說他要的是專案排程（十月二十六日），公告說至少要提前十天 —— 兩個資訊各在一篇裡，相減得到十月十六日。' },
    { both:true,
      q:'What does the notice say about the change Tomás asks for?',
      opts:['It is not allowed.','It is allowed once for free.','It costs an extra fee.','It requires ten days\' notice.'], a:1,
      why:'信裡問的是能不能改期，答案在公告最後一句：Transfers to another session are permitted once, at no charge。' }
  ]
},

{
  id:'d5501', u:'s4u10', title:'退換貨政策與客訴信',
  docs:[
    { label:'Web page', title:'Returns and Exchanges — Alderport Outdoor',
      text:'We want you to be happy with your purchase.\n\nUnworn items may be returned within 30 days of delivery for a full refund. Items that have been worn or washed can be exchanged, but not refunded, within 30 days.\n\nFootwear is covered by a separate 12-month guarantee against manufacturing faults such as separating soles or broken eyelets. Wear to the tread is not considered a fault. Faulty footwear is replaced with the same model where possible; if the model is no longer made, a credit note for the original price is issued.\n\nTo start a return, complete the online form and print the label that follows. Return postage is free for faulty goods and for orders over 2,000 dollars. Otherwise 160 dollars is deducted from the refund.\n\nSale items marked "final" cannot be returned or exchanged.',
      zh:'我們希望您對購買的商品滿意。\n\n未穿著的商品可於送達後三十天內退回並全額退款。已穿過或洗過的商品可於三十天內換貨，但不予退款。\n\n鞋類另有十二個月的製造瑕疵保固，例如鞋底脫膠或鞋帶孔斷裂。鞋底磨損不算瑕疵。瑕疵鞋款盡可能以同款替換；若該款已停產，則開立原價的抵用券。\n\n辦理退貨請填寫線上表單並列印隨後產生的標籤。瑕疵品與滿兩千元的訂單免退貨運費，否則將從退款中扣除一百六十元。\n\n標示為「最終出清」的特價品不接受退貨或換貨。' },
    { label:'Email', title:'Order 51-9930 — boots',
      text:'From: Wiremu Ngata\nTo: help@alderport.example\nDate: 8 February\n\nHello,\n\nI bought a pair of Ridgeline walking boots from you on 14 November. The order came to 3,150 dollars and the boots were not on sale.\n\nI have used them most weekends since then. Last Saturday the sole on the left boot began to come away from the upper along the outside edge. The tread is worn, which I would expect after three months, but the sole separating seems different.\n\nI still have the box and the order confirmation. Ideally I would like the same boots again — they fit well and I have just got used to them. If that is not possible I will take whatever you can offer.\n\nCould you tell me what to do next, and whether I need to pay to send them back?\n\nRegards,\nWiremu',
      zh:'寄件者：Wiremu Ngata\n收件者：help@alderport.example\n日期：二月八日\n\n您好：\n\n我在十一月十四日向貴公司購買了一雙 Ridgeline 登山靴，訂單金額三千一百五十元，該商品非特價品。\n\n從那時起我大部分週末都穿著它。上星期六左腳鞋底外緣開始與鞋面分離。鞋底是磨損了，三個月後我想這是正常的，但鞋底脫開似乎是另一回事。\n\n鞋盒與訂單確認我都還留著。最理想的是能換同一雙 —— 它很合腳，我也剛穿習慣。若無法如此，貴公司能提供什麼我都接受。\n\n可以請您告訴我接下來該怎麼做，以及退回時我是否需要負擔運費嗎？\n\n順頌時祺\nWiremu' }
  ],
  qs:[
    { q:'When did Mr. Ngata buy the boots?',
      opts:['8 February','14 November','Last Saturday','Three months ago exactly'], a:1,
      why:'信的第二段第一句：I bought a pair … on 14 November。' },
    { q:'According to the web page, what is NOT treated as a manufacturing fault?',
      opts:['A separating sole','A broken eyelet','Worn tread','A split upper'], a:2,
      why:'Wear to the tread is not considered a fault。' },
    { both:true,
      q:'Why can Mr. Ngata NOT get a refund under the 30-day policy?',
      opts:['The boots were on sale.','He no longer has the box.','He bought them nearly three months ago.','He has worn them.'], a:2,
      why:'政策說三十天內才能退；信裡的購買日十一月十四日到寫信的二月八日已將近三個月 —— 日期在信裡，期限在政策裡。' },
    { both:true,
      q:'What is Mr. Ngata most likely entitled to?',
      opts:['A full refund','A replacement pair of the same boots','A credit note only','Nothing, as the tread is worn'], a:1,
      why:'政策說鞋類十二個月保固、瑕疵盡量換同款；信裡說是鞋底脫膠（屬於保固範圍）且購買不到十二個月。' },
    { both:true,
      q:'Will Mr. Ngata have to pay return postage?',
      opts:['Yes, 160 dollars','No, on two separate grounds','Yes, because the boots were used','Only if the model is discontinued'], a:1,
      why:'政策免運有兩個條件：瑕疵品，或訂單滿兩千元。信裡兩個都符合 —— 鞋底脫膠是瑕疵，訂單三千一百五十元。' }
  ]
}

];
