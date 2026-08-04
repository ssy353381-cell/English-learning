/* ==========================================================================
   toeic-p2-s2.js — 多益 Part 2：應答問題（Stage 2）
   --------------------------------------------------------------------------
   Part 2 的送分關鍵不是聽懂整句，而是聽懂<b>開頭那一個字</b>：
   Where 問地點、When 問時間、Who 問人、Why 問原因、How long 問多久。
   所以誘答刻意放兩種最常見的陷阱：
     1. WH 問句配 Yes / No 的回答（一定錯）
     2. 用了問句裡出現過的字，但答非所問（同字陷阱）
   ========================================================================== */
window.DATA_RESPOND_S2 = [

/* ---------------- U26 ---------------- */
{
  id:'q2601', u:'s2u1',
  ask:'Have you finished the sales report?', askZh:'你把業績報告做完了嗎？',
  opts:['Not yet, I need one more hour.',
        'Yes, I have finished it yesterday.',
        'It is on the third floor.'],
  a:0,
  zh:['還沒，我還需要一小時。','（文法錯）我昨天已經做完了。','在三樓。'],
  why:'完成式的問句可以用 Not yet 回答。B 的 yesterday 不能和完成式並用，C 答的是地點。'
},
{
  id:'q2602', u:'s2u1',
  ask:'Where have you put the contract?', askZh:'你把合約放到哪裡了？',
  opts:['Yes, I have.',
        'On your desk, next to the printer.',
        'About two hours ago.'],
  a:1,
  zh:['是的，我有。','在你桌上，印表機旁邊。','大約兩小時前。'],
  why:'Where 問地點。WH 問句<b>不能</b>用 Yes / No 回答，C 回答的是時間。'
},
{
  id:'q2603', u:'s2u1',
  ask:'Has Ms. Lin approved the budget yet?', askZh:'林女士核准預算了嗎？',
  opts:['She approved it this morning.',
        'The budget is very large.',
        'No, she has not approve.'],
  a:0,
  zh:['她今天早上核准了。','這筆預算很大。','（文法錯）不，她還沒核准。'],
  why:'A 直接回答「已經核准，時間是今早」。B 只是重複 budget 這個字（同字陷阱），C 的 approve 應該用過去分詞 approved。'
},
{
  id:'q2604', u:'s2u1',
  ask:'How long have you worked here?', askZh:'你在這裡工作多久了？',
  opts:['Since I graduated.',
        'Yes, for a long time.',
        'I work in the marketing department.'],
  a:0,
  zh:['從我畢業之後就在這裡了。','是的，很久了。','我在行銷部工作。'],
  why:'How long 問時間長度，用 since / for 回答。B 用 Yes 開頭就錯了，C 答的是部門。'
},
{
  id:'q2605', u:'s2u1',
  ask:'Would you like coffee or tea?', askZh:'你要咖啡還是茶？',
  opts:['Yes, please.',
        'Tea, thanks.',
        'In the break room.'],
  a:1,
  zh:['好的，麻煩你。','茶，謝謝。','在茶水間。'],
  why:'A 或 B 的選擇疑問句要<b>選一個</b>，不能用 Yes / No 回答。'
},

/* ---------------- U27 ---------------- */
{
  id:'q2701', u:'s2u2',
  ask:'When did you send the invitations?', askZh:'你什麼時候把邀請函寄出去的？',
  opts:['I have already sent them.',
        'Last Tuesday.',
        'To all our clients.'],
  a:1,
  zh:['我已經寄出去了。','上週二。','寄給我們所有的客戶。'],
  why:'When 問的是<b>哪一天</b>，要給時間點。A 雖然句子對，但沒回答「什麼時候」，C 回答的是對象。'
},
{
  id:'q2702', u:'s2u2',
  ask:'Why has the meeting been moved to Friday?', askZh:'會議為什麼改到星期五？',
  opts:['To the tenth floor.',
        'At three o\'clock.',
        'Because the client\'s flight was delayed.'],
  a:2,
  zh:['到十樓。','三點鐘。','因為客戶的班機延誤了。'],
  why:'Why 問原因，用 Because 回答。A 答地點、B 答時間 —— 兩個都被 moved 這個字誤導了。'
},
{
  id:'q2703', u:'s2u2',
  ask:'You have already met our new manager, haven\'t you?', askZh:'你已經見過我們的新經理了，對吧？',
  opts:['Yes, we talked last week.',
        'No, he has not.',
        'The manager\'s office is upstairs.'],
  a:0,
  zh:['對，我們上週聊過。','不，他沒有。','經理的辦公室在樓上。'],
  why:'附加問句問的是「你」，回答的主詞要是 I / we。B 的主詞變成 he 就對不上了。'
},
{
  id:'q2704', u:'s2u2',
  ask:'Who has the key to the storage room?', askZh:'誰有倉庫的鑰匙？',
  opts:['It is next to the elevator.',
        'Peter usually keeps it.',
        'Since this morning.'],
  a:1,
  zh:['它在電梯旁邊。','通常在彼得那裡。','從今天早上開始。'],
  why:'Who 問人，答案要是一個人。A 答地點、C 答時間。'
},
{
  id:'q2705', u:'s2u2',
  ask:'How many applications have we received so far?', askZh:'我們到目前為止收到幾份申請？',
  opts:['Over fifty.',
        'Yes, we have.',
        'They applied online.'],
  a:0,
  zh:['五十多份。','是的，我們有。','他們是線上申請的。'],
  why:'How many 問數量，答案要是數字。B 用 Yes 回答 WH 問句就錯了，C 答的是方式。'
}

];
