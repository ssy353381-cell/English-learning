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
},

/* ---------------- U34 多益 Part 2 專門關 ---------------- */
{
  id:'q3401', u:'s2u9',
  ask:'Who is going to lead the training session?', askZh:'誰要帶這場訓練？',
  opts:['In the main conference room.',
        'Someone from the Taipei office.',
        'Yes, next Monday.'],
  a:1,
  zh:['在大會議室。','台北辦公室的人。','是的，下週一。'],
  why:'Who 問人。A 答地點、C 用 Yes 回答 WH 問句，兩個都被 session 這個字誤導。'
},
{
  id:'q3402', u:'s2u9',
  ask:'Why has the shipment been delayed?', askZh:'貨為什麼延誤了？',
  opts:['Because the road was closed.',
        'By truck.',
        'Last Wednesday.'],
  a:0,
  zh:['因為道路封閉了。','用卡車。','上週三。'],
  why:'Why 問原因，用 Because 回答。B 答方式（How）、C 答時間（When）。'
},
{
  id:'q3403', u:'s2u9',
  ask:'Would you rather meet on Tuesday or Thursday?', askZh:'你比較想約星期二還是星期四？',
  opts:['Yes, that works.',
        'Thursday is better for me.',
        'In the afternoon.'],
  a:1,
  zh:['好的，可以。','星期四對我比較方便。','下午。'],
  why:'A 或 B 的選擇疑問句要選一個，不能用 Yes 回答。C 答的是時段不是哪一天。'
},
{
  id:'q3404', u:'s2u9',
  ask:'Could you tell me where the elevator is?', askZh:'可以告訴我電梯在哪裡嗎？',
  opts:['It is around the corner.',
        'Yes, I could.',
        'About ten minutes.'],
  a:0,
  zh:['就在轉角。','是的，我可以。','大約十分鐘。'],
  why:'Could you tell me… 是客氣的問法，真正要問的是<b>地點</b>。照字面回 Yes, I could 反而沒回答問題。'
},
{
  id:'q3405', u:'s2u9',
  ask:'How often do you visit the factory?', askZh:'你多久去一次工廠？',
  opts:['It is quite far.',
        'Yes, I do.',
        'About twice a month.'],
  a:2,
  zh:['那裡蠻遠的。','是的，我有。','大概一個月兩次。'],
  why:'How often 問<b>頻率</b>，答案要是次數。A 答距離、B 用 Yes 回答 WH 問句。'
},
{
  id:'q3406', u:'s2u9',
  ask:'You have already sent the invoice, haven\'t you?', askZh:'你已經把發票寄出去了，對吧？',
  opts:['No, the invoice.',
        'Yes, this morning.',
        'To the accounting office.'],
  a:1,
  zh:['不，是發票。','對，今天早上寄的。','寄到會計部。'],
  why:'附加問句回答 Yes/No 再補細節最自然。C 只是重複了 invoice 相關的字（同字陷阱）。'
},
{
  id:'q3407', u:'s2u9',
  ask:'I am afraid the printer is out of paper.', askZh:'印表機好像沒紙了。',
  opts:['I will refill it.',
        'Yes, it is a printer.',
        'On the second floor.'],
  a:0,
  zh:['我來補。','對，那是印表機。','在二樓。'],
  why:'這不是問句而是<b>陳述</b>，最好的回應是提出行動。Part 2 有不少題是這種「不是問句」的題目。'
},
{
  id:'q3408', u:'s2u9',
  ask:'Do you know whether the store opens on Sunday?', askZh:'你知道那家店星期天有沒有開嗎？',
  opts:['At the shopping mall.',
        'Yes, I know the store.',
        'I think it does.'],
  a:2,
  zh:['在購物中心。','對，我知道那家店。','我想有開。'],
  why:'問的是「有沒有開」，不是「你知不知道那家店」。B 是照字面回答的陷阱。'
},
{
  id:'q3409', u:'s2u9',
  ask:'Where should I leave the documents?', askZh:'我該把文件放哪裡？',
  opts:['This afternoon.',
        'On the desk by the window.',
        'Yes, please do.'],
  a:1,
  zh:['今天下午。','放在窗邊那張桌上。','好的，請。'],
  why:'Where 問地點。A 答時間、C 用 Yes 回答 WH 問句。'
},
{
  id:'q3410', u:'s2u9',
  ask:'How long will the repair take?', askZh:'修理要多久？',
  opts:['A technician will come.',
        'It is broken again.',
        'About two hours.'],
  a:2,
  zh:['技師會過來。','它又壞了。','大約兩小時。'],
  why:'How long 問<b>時間長度</b>。A、B 雖然都和修理有關，但沒有回答「多久」。'
},
{
  id:'q3411', u:'s2u9',
  ask:'Why don\'t we take the earlier train?', askZh:'我們搭早一點的班次好不好？',
  opts:['At the station.',
        'No, I didn\'t.',
        'That is a good idea.'],
  a:2,
  zh:['在車站。','不，我沒有。','好主意。'],
  why:'Why don\'t we… 不是在問原因，而是<b>提議</b>，要回答接不接受。'
},
{
  id:'q3412', u:'s2u9',
  ask:'Who should I contact about the parking permit?', askZh:'停車證的事我該找誰？',
  opts:['In the basement.',
        'Try the front desk.',
        'Since last month.'],
  a:1,
  zh:['在地下室。','問問櫃檯。','從上個月開始。'],
  why:'Who 問人（或單位）。A 答地點、C 答時間，兩個都被 parking 誤導。'
}

];
