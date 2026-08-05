/* ==========================================================================
   toeic-p34-s3.js — 多益 Part 3／4（Unit 44）
   id 前綴 c（與 v/g/r/i/p/q/m 互斥）

   kind: 'convo' 兩人對話（Part 3）／'talk' 一人獨白（Part 4）
   lines: [[說話者, 英文]]　—— 說話者名稱只用來標示與換音高，不會被唸出來
   qs:    三題，照對話順序出現（多益的實際出題習慣）

   句子刻意控制在這一階段學過的字與句型內，被動語態出現得比平常密 ——
   Stage 3 的文法點就是被動，聽力題順便把它考回來。
   ========================================================================== */
window.DATA_CONVO_S3 = [

{
  id:'c4401', u:'s3u9', kind:'convo', title:'影印機壞了',
  lines:[
    ['M','Hi, Sandra. The copier on the third floor is not working again. I have a presentation at two.'],
    ['W','I know. Maintenance was called this morning, but the technician cannot come until four.'],
    ['M','That is too late. Is there another one I can use?'],
    ['W','There is one in the mail room on the first floor. It was serviced last week, so it should be fine.']
  ],
  zh:'男：嗨，Sandra。三樓的影印機又壞了，我兩點有簡報。\n女：我知道。今天早上已經叫維修了，但技師四點才能來。\n男：那太晚了。還有別台可以用嗎？\n女：一樓收發室有一台，上週剛保養過，應該沒問題。',
  qs:[
    { q:'What is the man\'s problem?', opts:['He is late for a meeting.','A machine is broken.','He cannot find the mail room.','His presentation was cancelled.'], a:1,
      why:'男士第一句就說 The copier is not working。' },
    { q:'When will the technician arrive?', opts:['At two','At four','This morning','Next week'], a:1,
      why:'the technician cannot come until four。' },
    { q:'What does the woman suggest?', opts:['Calling maintenance again','Postponing the presentation','Using a copier on another floor','Buying a new machine'], a:2,
      why:'There is one in the mail room on the first floor。' }
  ]
},

{
  id:'c4402', u:'s3u9', kind:'convo', title:'訂單延遲',
  lines:[
    ['W','Good morning. I am calling about order 4471. It was supposed to arrive on Monday.'],
    ['M','Let me check. I am sorry — the shipment was delayed because our warehouse was closed for maintenance.'],
    ['W','We need those parts by Thursday. Can that be arranged?'],
    ['M','Yes. I will send them by express delivery today, and the shipping fee will be removed from your invoice.']
  ],
  zh:'女：早安，我想問訂單 4471，原本應該星期一到的。\n男：我查一下。很抱歉，因為倉庫維修關閉，出貨延遲了。\n女：我們星期四前需要那些零件，可以安排嗎？\n男：可以。我今天用快遞寄出，運費也會從您的請款單上扣除。',
  qs:[
    { q:'Why was the order delayed?', opts:['The parts were out of stock.','The warehouse was closed.','The address was wrong.','The payment was late.'], a:1,
      why:'the shipment was delayed because our warehouse was closed for maintenance。' },
    { q:'When does the woman need the parts?', opts:['On Monday','On Thursday','Today','Next month'], a:1,
      why:'We need those parts by Thursday。' },
    { q:'What will the man do for the woman?', opts:['Cancel the order','Offer a full refund','Remove the shipping fee','Visit the warehouse'], a:2,
      why:'the shipping fee will be removed from your invoice。' }
  ]
},

{
  id:'c4403', u:'s3u9', kind:'convo', title:'面試安排',
  lines:[
    ['M','Ms. Chen, three candidates have been selected for the sales position. When would you like to meet them?'],
    ['W','Tuesday afternoon works for me. Have they all been contacted?'],
    ['M','Two have. The third one has not replied yet, so I will call her this afternoon.'],
    ['W','Thank you. Please book the small conference room and send me their resumes before Monday.']
  ],
  zh:'男：陳女士，業務職缺已經選出三位人選。您想什麼時候見他們？\n女：星期二下午我可以。他們都聯絡過了嗎？\n男：兩位聯絡過了。第三位還沒回覆，我下午會打給她。\n女：謝謝。請訂小會議室，並在星期一前把他們的履歷寄給我。',
  qs:[
    { q:'What are the speakers mainly discussing?', opts:['A training session','Job interviews','A sales report','An office renovation'], a:1,
      why:'整段都在講 candidates、meet them、resumes。' },
    { q:'What has not been done yet?', opts:['Selecting the candidates','Contacting one candidate','Booking a flight','Approving the budget'], a:1,
      why:'The third one has not replied yet。' },
    { q:'What does the woman ask the man to do?', opts:['Reschedule the interviews','Interview the candidates himself','Reserve a room and send resumes','Post the job online'], a:2,
      why:'book the small conference room and send me their resumes。' }
  ]
},

{
  id:'c4404', u:'s3u9', kind:'talk', title:'公司公告：系統維護',
  lines:[
    ['Announcer','Attention, all staff. The accounting system will be upgraded this Friday evening.'],
    ['Announcer','The system will be unavailable from six p.m. until midnight, so all invoices must be submitted before five.'],
    ['Announcer','If you have questions, please contact the IT help desk at extension 220. Thank you for your cooperation.']
  ],
  zh:'各位同仁請注意。會計系統將於本週五晚間升級。\n系統將於晚間六點至午夜停止服務，所有請款單必須在五點前送出。\n如有問題，請撥分機 220 聯絡資訊服務台。感謝配合。',
  qs:[
    { q:'What is the purpose of the announcement?', opts:['To introduce new staff','To announce a system upgrade','To report a power failure','To change the office hours'], a:1,
      why:'The accounting system will be upgraded this Friday evening。' },
    { q:'What must employees do before five?', opts:['Turn off their computers','Submit their invoices','Call the help desk','Leave the building'], a:1,
      why:'all invoices must be submitted before five。' },
    { q:'What should listeners do if they have questions?', opts:['Send an email to accounting','Wait until Monday','Call extension 220','Visit the front desk'], a:2,
      why:'contact the IT help desk at extension 220。' }
  ]
},

{
  id:'c4405', u:'s3u9', kind:'talk', title:'機場廣播：班機延誤',
  lines:[
    ['Announcer','Ladies and gentlemen, this is an announcement for passengers on flight BR 108 to Singapore.'],
    ['Announcer','Departure has been delayed by about ninety minutes because of bad weather. Boarding will now begin at nine fifteen.'],
    ['Announcer','Meal vouchers are available at the service counter near gate twelve. We apologize for the inconvenience.']
  ],
  zh:'各位旅客請注意，這是飛往新加坡的 BR 108 班機廣播。\n因天候不佳，出發時間延誤約九十分鐘，登機時間改為九點十五分。\n十二號登機門旁的服務櫃檯提供餐券。造成不便，敬請見諒。',
  qs:[
    { q:'Why is the flight delayed?', opts:['A mechanical problem','Bad weather','A missing crew member','Heavy traffic'], a:1,
      why:'delayed by about ninety minutes because of bad weather。' },
    { q:'When will boarding begin?', opts:['At nine fifteen','At ninety minutes','At twelve','At eight'], a:0,
      why:'Boarding will now begin at nine fifteen。' },
    { q:'What is available at the service counter?', opts:['Boarding passes','Meal vouchers','Luggage tags','Hotel rooms'], a:1,
      why:'Meal vouchers are available at the service counter。' }
  ]
},

{
  id:'c4406', u:'s3u9', kind:'convo', title:'出差報帳',
  lines:[
    ['W','Daniel, your travel expenses from the Osaka trip have not been submitted yet.'],
    ['M','I know. I lost one of the receipts — the one for the airport shuttle.'],
    ['W','That is fine. Small amounts under twenty dollars can be claimed without a receipt.'],
    ['M','That helps. Then I will complete the form this afternoon and leave it on your desk.']
  ],
  zh:'女：Daniel，你大阪出差的差旅費還沒送出。\n男：我知道。我弄丟了一張收據，機場接駁車那張。\n女：沒關係。二十美元以下的小額可以不用收據申請。\n男：那太好了。那我下午把表格填完，放到你桌上。',
  qs:[
    { q:'What is the problem?', opts:['A flight was cancelled.','A receipt is missing.','The trip was too expensive.','A form was rejected.'], a:1,
      why:'I lost one of the receipts。' },
    { q:'What does the woman say about small amounts?', opts:['They cannot be claimed.','They need a supervisor\'s approval.','They can be claimed without a receipt.','They are paid in cash.'], a:2,
      why:'Small amounts under twenty dollars can be claimed without a receipt。' },
    { q:'What will the man do this afternoon?', opts:['Book another flight','Complete the expense form','Call the shuttle company','Meet his supervisor'], a:1,
      why:'I will complete the form this afternoon。' }
  ]
}

];
