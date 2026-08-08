/* ==========================================================================
   toeic-p6-s4.js — 多益 Part 6：段落填空（Unit 50、55）
   id 前綴 x（與 v/g/r/i/p/q/m/c/d 互斥）

   Part 6 和 Part 5 只差一件事，而那件事就是這一關要練的：
   **空格的答案往往不在那一句裡面**。時態要看前後文哪個時間點、代名詞要看
   前面提過誰、連接詞要看兩句的邏輯關係 —— 只讀空格所在的那一行一定會選錯。

   所以資料的形狀是「一篇文章 ＋ 四個空格」，而不是四個獨立句子。
   文章用 ___1___ 標出空格位置，題型模組照這個標記把文章切開。
   標號一定要從 1 連號到 blanks.length，模組是照號碼對回題目的。

   blanks[i]：
     opts  四個選項
     a     正解的索引
     why   解析。**一定要寫出「線索在哪一句」**，因為 Part 6 的重點就是
           「答案在別的地方」—— 只說「這裡要用過去式」等於沒教到那一點。
     kind  'sentence' 表示這一格是整句插入題（多益每篇必有一題）。
           模組會把選項排成直式，四個句子並排成一列會擠到讀不了。

   文章長度控制在 90–130 字，和真實 Part 6 一致。
   ========================================================================== */
window.DATA_PART6_S4 = [

{
  id:'x5001', u:'s4u5', title:'Email: Office Move',
  text:'To: All Staff\nSubject: Moving day\n\nAs you know, our department ___1___ to the fourth floor next Friday. Packing crates will be delivered on Wednesday morning, and each person is responsible for their own desk.\n\nPlease label every box with your name and your new room number. ___2___ Boxes without labels will be left in the corridor until they can be identified.\n\nThe lift will be reserved for the movers between nine and one. ___3___ that period, please use the stairs. Computers will be disconnected by the IT team on Thursday evening and reconnected on Monday, so plan to work from home on Friday ___4___ you need equipment that stays behind.',
  zh:'收件者：全體同仁\n主旨：搬遷日\n\n如各位所知，我們部門下週五將搬到四樓。包裝箱會在星期三早上送達，每個人負責自己的桌位。\n\n請在每個箱子上標明姓名與新的房號。這一點特別重要，因為三個部門同一天搬遷。沒有標籤的箱子會留在走廊，直到能辨識為止。\n\n電梯在九點到一點之間保留給搬運人員。在那段期間請走樓梯。IT 部門會在星期四晚上拔除電腦，星期一重新接上，所以除非你需要留在原地的設備，否則星期五請安排在家工作。',
  blanks:[
    { opts:['moved','will move','has moved','moving'], a:1,
      why:'線索是同一句的 next Friday 與下一句的 Wednesday —— 整封信講的都是還沒發生的事，要用未來式。' },
    { kind:'sentence',
      opts:['This is especially important because three departments are moving on the same day.',
            'The old room numbers will remain on the doors.',
            'Packing materials can be recycled at the loading dock.',
            'Most staff have already returned their old keys.'], a:0,
      why:'前一句要人標名字與房號，後一句說沒標籤的箱子會被丟在走廊 —— 中間要一句「為什麼非標不可」，只有 A 接得起來。' },
    { opts:['During','While','Since','Until'], a:0,
      why:'後面接的是名詞片語 that period，只有 During 可以接名詞；While 與 Since 後面要接子句。' },
    { opts:['unless','if','because','so'], a:0,
      why:'前半句叫人在家工作，後半句是「需要留在原地的設備」—— 那是例外情況，用 unless（除非）。' }
  ]
},

{
  id:'x5002', u:'s4u5', title:'Notice: Water Shut-off',
  text:'NOTICE TO TENANTS\n\nWater to the building will be shut off on Tuesday, 12 March, from 8:00 a.m. until approximately 2:00 p.m. while the main valve ___1___. The work was originally scheduled for last month but was delayed by heavy rain.\n\nRestrooms on all floors will be closed during this time. ___2___ are available in the lobby of the neighbouring building, which has agreed to help.\n\nWe recommend filling a bottle of water before eight if you take medication or make tea at your desk. ___3___\n\nWe apologise for the ___4___ and thank you for your patience.',
  zh:'住戶通知\n\n本大樓將於三月十二日（星期二）早上八點至下午約兩點停水，以便更換主閥。這項工程原訂上個月進行，因大雨而延期。\n\n停水期間各樓層洗手間將關閉。隔壁大樓的大廳有洗手間可以使用，該大樓已同意提供協助。\n\n若您需服藥或在座位泡茶，建議在八點前先裝一瓶水。此外，販賣機將免費補充額外的瓶裝水。\n\n造成不便，敬請見諒，感謝您的耐心。',
  blanks:[
    { opts:['replaces','is replaced','replacing','will replace'], a:1,
      why:'閥不會自己換自己，主詞是被動作的一方 —— 用被動。線索是主詞 the main valve 本身。' },
    { opts:['Restrooms','Elevators','Parking spaces','Meeting rooms'], a:0,
      why:'答案在前一句：各樓層洗手間會關閉，所以隔壁大樓提供的當然是洗手間。這一格只讀本句是選不出來的。' },
    { kind:'sentence',
      opts:['In addition, the vending machines will be stocked with extra bottled water at no charge.',
            'The main valve was installed when the building opened.',
            'Tenants may park in the visitor spaces on that day.',
            'Please report any leaks to the building office.'], a:0,
      why:'前一句建議自己先裝水，後一句是道歉收尾 —— 中間要一句同樣在講「怎麼解決沒水」的話。B 講閥的歷史、C 講停車、D 講漏水，都跟缺水這條線接不上。' },
    { opts:['inconvenience','invitation','instruction','investment'], a:0,
      why:'apologise for 後面接的是造成的困擾。整篇講的是停水造成不便，其餘三個字跟前文接不上。' }
  ]
},

{
  id:'x5501', u:'s4u10', title:'Letter: Membership Renewal',
  text:'Dear Ms. Adeyemi,\n\nYour membership at Riverside Fitness ___1___ on 31 May. We hope you have enjoyed the past year with us.\n\nMembers who renew before 15 May keep this year\'s rate of 1,800 dollars. ___2___ After that date the rate will rise to 2,100 dollars, in line with the cost of the new equipment installed in March.\n\nIf you renew online, you will also receive two guest passes, ___3___ can be used at any time during the following year. Guests must be signed in at the front desk.\n\nWe would be sorry to see you go. ___4___ you decide not to renew, please return your locker key so that it can be reassigned.\n\nWarm regards,\nRiverside Fitness',
  zh:'親愛的 Adeyemi 女士：\n\n您在 Riverside Fitness 的會籍將於五月三十一日到期。希望這一年您在這裡過得愉快。\n\n五月十五日前續約的會員可維持今年的費率一千八百元。這是我們兩年來第一次調整價格。該日期之後費率將調升為兩千一百元，以反映三月新設備的成本。\n\n若您線上續約，還可獲得兩張訪客券，這些券在接下來一年內隨時可以使用。訪客須在櫃檯登記。\n\n我們很捨不得您離開。若您決定不續約，請歸還置物櫃鑰匙以便重新分配。\n\n誠摯問候\nRiverside Fitness',
  blanks:[
    { opts:['expires','expired','has expired','would expire'], a:0,
      why:'五月三十一日還沒到（信裡在勸五月十五日前續約），所以不是過去式；講已排定的日程用現在式。線索是後面那句的 before 15 May。' },
    { kind:'sentence',
      opts:['This is the first price change we have made in two years.',
            'Lockers are assigned on the first day of each month.',
            'Our opening hours will not change this year.',
            'Guest passes are available at the front desk.'], a:0,
      why:'前後兩句都在講價格（今年費率、之後調漲），中間要一句同樣關於價格的話。其餘三句雖然都跟健身房有關，但把價格那條線打斷了。' },
    { opts:['which','who','where','what'], a:0,
      why:'先行詞是 two guest passes（東西不是人），所以用 which；who 只能接人。' },
    { opts:['Should','Unless','Despite','Whether'], a:0,
      why:'Should 開頭是 If you should 的倒裝，正式書信常用。Unless 意思相反（除非不續約就還鑰匙，講不通）。' }
  ]
}

];
