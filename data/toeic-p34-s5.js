/* ==========================================================================
   toeic-p34-s5.js — 多益 Part 3／4（Unit 59、64）
   id 前綴 c，與 Stage 3 的長對話同一個資料集

   Stage 3 那六段練的是「聽得懂」。這一階段換成練 U59 教的**預讀**，
   所以題目刻意做成「不先看題就抓不到」的樣子：

     · 每一段都有一個**被更正的數字或日期**（原本的那個一定會變成選項）
     · 每一段都有一題問**弦外之音**（imply／suggest），字面上找不到答案
     · 三人對話（第三個說話者在中途才出現）—— 換人靠音高，多一個人就更需要
       先知道要聽誰。真機聽不聽得出分界，是 TODO 裡還沒驗過的那一項。

   三題仍照對話順序出現：第一題的線索在前段、第三題在後段。這是多益的實際
   出題習慣，也是預讀技巧站得住的前提。
   ========================================================================== */
window.DATA_CONVO_S5 = [

{
  id:'c5901', u:'s5u4', kind:'convo', title:'展場攤位改期',
  lines:[
    ['W','Marco, the organisers just called about our stand at the trade fair. They want to move us from row C to row F.'],
    ['M','Row F is the far corner, isn\'t it? Did they say why?'],
    ['W','A sponsor took the whole of row C. They are offering us two extra square metres and a listing in the printed guide to make up for it.'],
    ['M','Two metres is not nothing. But the guide closes on the fifteenth — no, sorry, they moved that to the eighteenth.'],
    ['W','Either way we would need the artwork done by then. Priya, you have the files, haven\'t you?'],
    ['F','I do, but the large format version was never finished. Give me until Friday and I can have it ready.']
  ],
  zh:'女：Marco，主辦單位剛打來說我們在商展的攤位，他們想把我們從 C 排移到 F 排。\n男：F 排是最角落那邊吧？有說原因嗎？\n女：有個贊助商把整個 C 排包下來了。他們願意多給我們兩平方公尺，還會在紙本手冊上列名作為補償。\n男：兩平方公尺不算少。不過手冊十五號截稿 —— 不對，抱歉，他們改到十八號了。\n女：不管哪一天，我們都得在那之前把美術稿弄好。Priya，檔案在你那裡對吧？\n女2：在我這裡，但大尺寸那版一直沒做完。給我到星期五，我可以弄好。',
  qs:[
    { q:'What are the speakers mainly discussing?', opts:['A cancelled trade fair','A change to their stand location','A new sponsor contract','A printing error in the guide'], a:1,
      why:'第一句就說 They want to move us from row C to row F。' },
    { q:'What is the deadline for the printed guide?', opts:['The fifteenth','The eighteenth','Friday','The end of the month'], a:1,
      why:'男士自己更正：no, sorry, they moved that to the eighteenth —— 十五號是被更正掉的那個數字。' },
    { q:'What does the man imply about the offer?', opts:['It is not worth considering.','It has some value.','It was made too late.','It should be refused.'], a:1,
      why:'Two metres is not nothing 是雙重否定 —— 字面沒說「不錯」，意思就是「還可以」。' }
  ]
},

{
  id:'c5902', u:'s5u4', kind:'convo', title:'系統上線前的最後檢查',
  lines:[
    ['M','Before we sign off on Monday\'s launch, is the data migration finished?'],
    ['W','Ninety-four percent. The last batch is the archived orders, and those are the ones nobody looks at.'],
    ['M','Nobody looks at them until an auditor does. Can it be done by Sunday?'],
    ['W','Technically yes. Whether I want to be running a migration the night before we go live is another question.'],
    ['M','Fair enough. Karim, what did support say about the extra cover?'],
    ['N','Two people on the phones from seven, and one of them stays until eight in the evening. I asked for nine, but the budget only stretched to eight.']
  ],
  zh:'男：星期一上線前我們簽核之前，資料轉移完成了嗎？\n女：百分之九十四。最後一批是封存的訂單，那些平常沒有人會看。\n男：沒有人會看，直到查核人員來看。星期日前弄得完嗎？\n女：技術上可以。至於我想不想在上線前一晚跑資料轉移，那是另一回事。\n男：說得也是。Karim，客服那邊對加班人力怎麼說？\n男2：早上七點起兩個人接電話，其中一位留到晚上八點。我本來要求九點，但預算只夠到八點。',
  qs:[
    { q:'What is the main topic of the conversation?', opts:['A budget cut','Final checks before a launch','A customer complaint','A recruitment plan'], a:1,
      why:'開場 Before we sign off on Monday\'s launch，整段都在確認上線前的事。' },
    { q:'Until what time will support cover be available?', opts:['Seven','Eight','Nine','Ten'], a:1,
      why:'I asked for nine, but the budget only stretched to eight —— nine 是被否定掉的那個數字。' },
    { q:'What does the woman imply about finishing the migration on Sunday?', opts:['It is impossible.','She would rather not.','It has already been done.','Someone else should do it.'], a:1,
      why:'Whether I want to … is another question —— 技術上做得到，但她不願意，屬於婉轉的反對。' }
  ]
},

{
  id:'c5903', u:'s5u4', kind:'talk', title:'公司廣播：停車場整修',
  lines:[
    ['Announcer','Good morning. This is a reminder about the car park resurfacing, which begins next Monday and not next Wednesday as the first notice said.'],
    ['Announcer','Levels two and three will be closed for the first fortnight, and level one for the second. At no point will the whole car park be shut.'],
    ['Announcer','Staff with a reserved bay on level two have been allocated a temporary bay on level four. You do not need to apply; the new bay number is on the card in your pigeonhole.'],
    ['Announcer','We have also arranged an extra shuttle from the station at ten past eight. Those of you who normally drive in may find that easier than circling for a space.'],
    ['Announcer','Finally, the contractor asks that nobody leave a vehicle overnight during the works. Cars left after seven in the evening may be towed to the overflow area at the owner\'s expense.']
  ],
  zh:'各位早安。提醒大家停車場重鋪工程將於下週一開始，而非第一次通知所寫的下週三。\n二樓與三樓將於前兩週關閉，一樓則於後兩週關閉。任何時候都不會整座停車場都關。\n在二樓有固定車位的同仁，已在四樓分配到臨時車位。不需另外申請，新的車位號碼放在您的信件格裡。\n我們也加開了一班八點十分從車站出發的接駁車。平常開車來的同仁或許會覺得這比繞著找位子輕鬆。\n最後，承包商要求施工期間不要有車輛過夜。晚上七點以後仍停放的車輛可能被拖到臨時區，費用由車主自付。',
  qs:[
    { q:'When does the work begin?', opts:['Next Monday','Next Wednesday','In a fortnight','After seven in the evening'], a:0,
      why:'begins next Monday and not next Wednesday as the first notice said —— Wednesday 是被更正的舊資訊。' },
    { q:'What must staff with a reserved bay on level two do?', opts:['Apply for a new bay','Nothing — a bay has been allocated','Park at the station','Use the shuttle instead'], a:1,
      why:'You do not need to apply; the new bay number is on the card in your pigeonhole。' },
    { q:'What is implied about parking during the works?', opts:['It will be free of charge.','Spaces will be harder to find.','Level four will also close.','Only visitors may park.'], a:1,
      why:'easier than circling for a space —— 講到「繞圈找位子」就代表車位會變得難找。' }
  ]
},

{
  id:'c6401', u:'s5u9', kind:'convo', title:'客戶提前驗收',
  lines:[
    ['W','Daniel, the client wants to bring the site inspection forward to the twelfth.'],
    ['M','The twelfth? We agreed the twenty-second. The second coat of paint will not even be dry.'],
    ['W','I know. They say their director is only in the country that week.'],
    ['M','Then let them come and look at an unfinished building. I would rather they saw it honestly than we rushed the finish.'],
    ['W','That is more or less what I told them. Su-yin, could you check whether the electrical certificate will be issued by then?'],
    ['F','It was submitted last Tuesday. The office says ten working days, so the twelfth is tight but possible — the twenty-second would be certain.']
  ],
  zh:'女：Daniel，客戶想把現場驗收提前到十二號。\n男：十二號？我們談好的是二十二號。第二層漆那時候連乾都還沒乾。\n女：我知道。他們說他們的總監那一週才會在國內。\n男：那就讓他們來看一棟還沒完工的房子。我寧可他們看到真實的樣子，也不要我們趕工收尾。\n女：我跟他們講的差不多就是這個意思。Su-yin，你能不能確認一下電氣證明那時候發得下來？\n女2：上週二送件的。主管機關說十個工作天，所以十二號很趕但有機會 —— 二十二號就一定沒問題。',
  qs:[
    { q:'What change does the client want?', opts:['A different site','An earlier inspection','A cheaper contract','A new director'], a:1,
      why:'the client wants to bring the site inspection forward to the twelfth。' },
    { q:'What does the man suggest doing?', opts:['Refusing the visit','Letting the client see unfinished work','Rushing the second coat','Postponing to next month'], a:1,
      why:'let them come and look at an unfinished building。' },
    { q:'What does the third speaker imply about the certificate?', opts:['It has been refused.','The later date is safer.','It was never submitted.','It arrives on the twelfth.'], a:1,
      why:'the twelfth is tight but possible — the twenty-second would be certain，字面沒說「建議延後」，意思很清楚。' }
  ]
}

];
