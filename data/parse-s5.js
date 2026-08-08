/* ==========================================================================
   parse-s5.js — 長難句拆解（Unit 56、62）
   id 前綴 b（break down，與 v/g/r/i/p/q/m/c/x/d 互斥）

   Stage 5 的閱讀卡住的地方不是生字，是**主詞和主要動詞被拆開了**。
   Part 7 的長句常常長成這樣：主詞後面接一串關係子句或分詞，讀到動詞時
   已經忘了主詞是誰，於是把修飾語裡的動詞當成主要動詞，整句就理解反了。

   所以這一題型只問兩件事：**哪一段是主詞、哪一段是主要動詞**。
   其餘各段在批改後才標出它們的身分 —— 先讓他自己找骨架，再告訴他那些
   卡住他的東西各叫什麼名字。

   seg[i] = [這一段的字, 角色]
     角色 'S' 主詞、'V' 主要動詞、'O' 受詞／補語，
     其他一律當修飾語，字串本身就是要印出來的中文名字（'關係子句'、'分詞片語'…）。
     空字串代表連接詞之類沒有名字的零件，批改後不標。

   **各段照原句順序寫，用一個空格接起來就要還原成完整句子**（標點跟著前一段），
   test-logic.js 會把 seg 接回來跟 full 逐字比對 —— 少一個逗號都會被抓出來。

   core 是抽掉全部修飾語之後剩下的骨架，[英文, 中文]。骨架要能單獨成句：
   拆解的目的就是「先看懂這一句在講什麼」，骨架讀起來不通順就等於沒拆出來。
   ========================================================================== */
window.DATA_PARSE_S5 = [

/* ============================================ U56 長難句拆解法 */
{
  id:'b5601', u:'s5u1', title:'主詞後面夾了一段關係子句',
  seg:[
    ['The proposal','S'],
    ['that the consultants submitted last month','關係子句'],
    ['recommends','V'],
    ['three changes to the approval process.','O']
  ],
  full:'The proposal that the consultants submitted last month recommends three changes to the approval process.',
  zh:'顧問上個月提出的那份提案，建議對核准流程做三項改變。',
  core:['The proposal recommends three changes.','那份提案建議三項改變。'],
  why:'submitted 在關係子句裡，主詞是 the consultants，不是 the proposal。真正的主要動詞是 recommends —— 它前面那個 -s 就是跟單數主詞 The proposal 對上的。'
},
{
  id:'b5602', u:'s5u1', title:'分詞片語插在主詞與動詞之間',
  seg:[
    ['All employees','S'],
    ['working at the Kaohsiung branch,','分詞片語'],
    ['including part-time staff,','插入語'],
    ['must complete','V'],
    ['the safety course before 30 June.','O']
  ],
  full:'All employees working at the Kaohsiung branch, including part-time staff, must complete the safety course before 30 June.',
  zh:'所有在高雄分公司上班的員工，包含兼職人員，都必須在六月三十日前完成安全課程。',
  core:['All employees must complete the safety course.','所有員工都必須完成安全課程。'],
  why:'working 沒有主詞也沒有時態，它不可能是主要動詞 —— 只是在說明「哪一群員工」。兩個逗號中間的 including… 整段抽掉句子照樣成立，這是插入語最好認的特徵。'
},
{
  id:'b5603', u:'s5u1', title:'句首一長串介系詞片語',
  seg:[
    ['Despite the delay caused by the port closure in February,','介系詞片語'],
    ['the shipment','S'],
    ['arrived','V'],
    ['two days ahead of the revised schedule.','副詞片語']
  ],
  full:'Despite the delay caused by the port closure in February, the shipment arrived two days ahead of the revised schedule.',
  zh:'儘管二月的港口關閉造成延誤，那批貨仍比修訂後的時程提早兩天抵達。',
  core:['The shipment arrived.','貨到了。'],
  why:'句首到逗號為止全是背景說明，主詞在逗號之後才出現。caused 是 the delay 的分詞修飾，不是主要動詞 —— 主要動詞是 arrived。'
},
{
  id:'b5604', u:'s5u1', title:'主詞是一個名詞子句',
  seg:[
    ['What the survey revealed about customer expectations','S'],
    ['surprised','V'],
    ['the entire marketing team.','O']
  ],
  full:'What the survey revealed about customer expectations surprised the entire marketing team.',
  zh:'那份調查揭露的顧客期待，讓整個行銷團隊大吃一驚。',
  core:['What the survey revealed surprised the team.','調查揭露的事讓團隊很意外。'],
  why:'What 開頭的一整段就是主詞，裡面自帶一組主詞動詞（the survey revealed）—— 這是最容易誤判的一種，因為 revealed 看起來很像主要動詞。真正的主要動詞是後面那個 surprised。'
},
{
  id:'b5605', u:'s5u1', title:'被動語態把主詞推得很遠',
  seg:[
    ['Applications submitted after the posted deadline','S'],
    ['will not be considered','V'],
    ['unless a written explanation is attached.','副詞子句']
  ],
  full:'Applications submitted after the posted deadline will not be considered unless a written explanation is attached.',
  zh:'公告期限之後才送出的申請不予受理，除非附上書面說明。',
  core:['Applications will not be considered.','申請不予受理。'],
  why:'submitted 是分詞（申請「被」送出），不是主要動詞。主要動詞是 will not be considered —— 助動詞 will 出現的地方才是主要子句的時態所在。'
},
{
  id:'b5606', u:'s5u1', title:'同位語把主詞解釋了一遍',
  seg:[
    ['Ms. Okafor,','S'],
    ['the regional director who joined the company in 2019,','同位語'],
    ['will oversee','V'],
    ['the transition to the new supplier.','O']
  ],
  full:'Ms. Okafor, the regional director who joined the company in 2019, will oversee the transition to the new supplier.',
  zh:'2019 年進公司的區域總監 Okafor 女士，將負責監督更換供應商的過程。',
  core:['Ms. Okafor will oversee the transition.','Okafor 女士將監督這次轉換。'],
  why:'兩個逗號中間那一整段只是在說「她是誰」，抽掉句子還是完整的。同位語裡面還藏了一個關係子句（who joined…），所以看起來特別長。'
},
{
  id:'b5607', u:'s5u1', title:'兩個對等子句，各有各的骨架',
  seg:[
    ['The renovation of the lobby','S'],
    ['has been completed,','V'],
    ['but','連接詞'],
    ['the elevators on the east side remain out of service until Monday.','對等子句']
  ],
  full:'The renovation of the lobby has been completed, but the elevators on the east side remain out of service until Monday.',
  zh:'大廳整修已經完工，但東側的電梯要到星期一才會恢復使用。',
  core:['The renovation has been completed.','整修已經完工。'],
  why:'but 前後是兩個對等的完整句子。這一題只問前半的骨架 —— 遇到 and／but／so 就先把它當成句號，一次拆一半，是長難句最省力的讀法。'
},
{
  id:'b5608', u:'s5u1', title:'主詞很短，修飾語全掛在後面',
  seg:[
    ['A copy of the signed agreement','S'],
    ['was forwarded','V'],
    ['to the legal department','介系詞片語'],
    ['for review before the funds were released.','介系詞片語']
  ],
  full:'A copy of the signed agreement was forwarded to the legal department for review before the funds were released.',
  zh:'簽署後的合約副本已送交法務部審閱，之後才撥款。',
  core:['A copy was forwarded to the legal department.','一份副本送交法務部。'],
  why:'主詞是 A copy，不是 the signed agreement —— of 後面那一段只是在說「什麼的副本」。介系詞後面的名詞永遠不會是主詞，這一條可以省掉很多猶豫。'
},
{
  id:'b5609', u:'s5u1', title:'that 子句當受詞，裡面又有一組主詞動詞',
  seg:[
    ['The finance committee','S'],
    ['announced','V'],
    ['that the budget for overseas travel would be reduced by fifteen percent.','O']
  ],
  full:'The finance committee announced that the budget for overseas travel would be reduced by fifteen percent.',
  zh:'財務委員會宣布，海外差旅的預算將刪減百分之十五。',
  core:['The committee announced a reduction.','委員會宣布刪減。'],
  why:'that 後面整段是 announced 的受詞，裡面的 would be reduced 是子句的動詞。一個句子只有一個主要動詞，其餘的都被某個連接詞管著。'
},
{
  id:'b5610', u:'s5u1', title:'主詞是動名詞',
  seg:[
    ['Replacing the aging servers in all three offices','S'],
    ['will cost','V'],
    ['more than the department budgeted for this year.','O']
  ],
  full:'Replacing the aging servers in all three offices will cost more than the department budgeted for this year.',
  zh:'把三個辦公室的老舊伺服器全部汰換，花費將超過該部門今年編列的預算。',
  core:['Replacing the servers will cost more.','汰換伺服器會花更多錢。'],
  why:'Replacing 是動名詞，整段當主詞用 —— 它不是主要動詞，因為它沒有時態。有 will 的那個才是。'
},

/* ============================================ U62 倒裝與假設語氣進階 */
{
  id:'b6201', u:'s5u7', title:'否定副詞開頭，主詞動詞倒過來',
  seg:[
    ['Not until the audit was completed','副詞子句'],
    ['did','V'],
    ['the board','S'],
    ['approve the revised figures.','O']
  ],
  full:'Not until the audit was completed did the board approve the revised figures.',
  zh:'一直到查核完成，董事會才核准修訂後的數字。',
  core:['The board approved the figures.','董事會核准了那些數字。'],
  why:'Not until 開頭就要倒裝，助動詞 did 被拉到主詞前面。倒裝之後 approve 變回原形 —— 時態全部由 did 承擔，這是倒裝句唯一會動到的地方。'
},
{
  id:'b6202', u:'s5u7', title:'省略 if 的倒裝',
  seg:[
    ['Had the supplier notified us earlier,','副詞子句'],
    ['we','S'],
    ['would have arranged','V'],
    ['an alternative delivery route.','O']
  ],
  full:'Had the supplier notified us earlier, we would have arranged an alternative delivery route.',
  zh:'供應商若早點通知我們，我們就會安排別的送貨路線了。',
  core:['We would have arranged another route.','我們就會安排別條路線。'],
  why:'Had 開頭 ＝ If the supplier had notified us。if 被省略之後 had 補到句首，這是書面英文很常見的寫法，看到句首的 Had／Were／Should 就把 if 補回去。'
},
{
  id:'b6203', u:'s5u7', title:'Only 片語開頭的倒裝',
  seg:[
    ['Only after three rounds of testing','介系詞片語'],
    ['was','V'],
    ['the software','S'],
    ['released to customers.','被動的過去分詞']
  ],
  full:'Only after three rounds of testing was the software released to customers.',
  zh:'經過三輪測試之後，這套軟體才對外釋出。',
  core:['The software was released.','軟體釋出了。'],
  why:'Only ＋ 時間片語開頭要倒裝，be 動詞跑到主詞 the software 前面。released 是被動語態的過去分詞，跟著 was 一起算主要動詞的一部分。'
},
{
  id:'b6204', u:'s5u7', title:'not only 開頭，兩半都要看',
  seg:[
    ['Not only','否定副詞'],
    ['did','V'],
    ['the new packaging','S'],
    ['reduce shipping costs,','O'],
    ['but it also cut the damage rate by half.','對等子句']
  ],
  full:'Not only did the new packaging reduce shipping costs, but it also cut the damage rate by half.',
  zh:'新包裝不只降低了運費，還把破損率砍了一半。',
  core:['The new packaging reduced shipping costs.','新包裝降低了運費。'],
  why:'Not only 開頭一樣倒裝出一個 did，後半用 but also 接。前半倒裝、後半不倒裝 —— 只有句首那個否定詞會造成倒裝。'
}

];
