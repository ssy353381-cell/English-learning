/* ==========================================================================
   reading-s3.js — Stage 3 短文（80–120 字）

   體裁開始換成多益 Part 7 真正會出現的東西：公告、電子郵件、通知、政策說明。
   這些文件本來就大量使用被動語態，剛好把這一階段的文法點考回來。
   ========================================================================== */
window.DATA_READING_S3 = [

/* ---------------- U36 被動語態 ---------------- */
{
  id:'r3601', u:'s3u1', title:'Notice: Elevator Maintenance',
  text:'Please be advised that the east elevator will be closed for maintenance from Monday, March 4, to Wednesday, March 6. During this period, the west elevator and the stairs may be used. The work is expected to be completed by Wednesday evening. Deliveries should be received at the side entrance, as the main lobby will be partly blocked. We apologize for any inconvenience. Questions can be directed to the building office at extension 145.',
  zh:'謹此通知，東側電梯將於三月四日（星期一）至三月六日（星期三）因維修關閉。期間可使用西側電梯與樓梯。工程預計於星期三晚間完成。由於主大廳會有部分區域被擋住，送貨請改至側門收取。造成不便，敬請見諒。有問題請撥分機 145 洽大樓辦公室。',
  qs:[
    { q:'How long will the east elevator be closed?', opts:['One day','Three days','One week','Until further notice'], a:1, why:'March 4 到 March 6，共三天。' },
    { q:'Where should deliveries be received?', opts:['In the main lobby','At the side entrance','On the third floor','At the building office'], a:1, why:'Deliveries should be received at the side entrance.' },
    { q:'What should people do if they have questions?', opts:['Use the stairs','Wait until Wednesday','Call extension 145','Email the manager'], a:2, why:'Questions can be directed to the building office at extension 145.' }
  ]
},
{
  id:'r3602', u:'s3u1', title:'New Security Badges',
  text:'Starting next month, all employees will be issued new security badges. The old badges will be deactivated on April 30 and must be returned to the human resources office. Photographs will be taken in the second-floor meeting room between nine and eleven on Tuesday and Thursday. Staff who cannot attend at those times should contact Ms. Lin to arrange another appointment. Badges are required for entry to the building after seven p.m.',
  zh:'自下個月起，全體員工都會拿到新的識別證。舊識別證將於四月三十日停用，且必須繳回人資辦公室。拍照時間為星期二與星期四上午九點到十一點，地點在二樓會議室。無法在該時段前往的同仁請聯絡林小姐另約時間。晚上七點後進入大樓需要識別證。',
  qs:[
    { q:'What must employees do with their old badges?', opts:['Keep them at home','Return them to human resources','Throw them away','Give them to Ms. Lin'], a:1, why:'must be returned to the human resources office.' },
    { q:'When are photographs taken?', opts:['Every morning','On Tuesday and Thursday','Only on April 30','After seven p.m.'], a:1, why:'between nine and eleven on Tuesday and Thursday.' }
  ]
},

/* ---------------- U37 主動改被動 ---------------- */
{
  id:'r3701', u:'s3u2', title:'Email: Order Confirmation',
  text:'Dear Mr. Alvarez,\nThank you for your order. Your payment has been received and your order is now being processed. The items will be shipped from our Kaohsiung warehouse within two business days. A tracking number will be sent to you once the package leaves our facility.\nPlease note that the blue model was discontinued last month and has been replaced with the newer version at no extra charge. If this is not acceptable, the order can be cancelled before it is shipped.\nBest regards,\nCustomer Service',
  zh:'親愛的 Alvarez 先生：\n感謝您的訂購。我們已收到您的付款，訂單正在處理中。商品將於兩個工作天內從高雄倉庫出貨。包裹離開我們的倉儲後，追蹤號碼會寄給您。\n請注意，藍色款上個月已停產，已為您更換為較新的版本，不加收費用。若您無法接受，訂單可在出貨前取消。\n敬祝順心\n客服部',
  qs:[
    { q:'What has already happened?', opts:['The order was shipped.','The payment was received.','The tracking number was sent.','The order was cancelled.'], a:1, why:'Your payment has been received.' },
    { q:'Why was the model changed?', opts:['It was out of stock.','It was discontinued.','It was too expensive.','The customer requested it.'], a:1, why:'the blue model was discontinued last month.' },
    { q:'What can the customer do if he is not satisfied?', opts:['Return the item after delivery','Cancel the order before shipping','Ask for a different warehouse','Pay an extra charge'], a:1, why:'the order can be cancelled before it is shipped.' }
  ]
},

/* ---------------- U38 辦公室與設備 ---------------- */
{
  id:'r3801', u:'s3u3', title:'Office Supply Request',
  text:'All requests for office supplies must be submitted through the online form by Wednesday of each week. Orders are placed with our supplier every Thursday and are usually delivered the following Monday. Items that are not on the standard list, such as special stationery or new equipment, require approval from a supervisor. Supplies are stored in the room next to the mail room on the first floor. Please do not take items from the storage room without recording them in the log book.',
  zh:'所有辦公用品申請必須於每週三前透過線上表單提出。訂單每週四向供應商下單，通常隔週一送達。不在標準清單上的品項，例如特殊文具或新設備，需要主管核准。用品存放在一樓收發室旁的房間。請勿在未登記於登記簿的情況下自行取用儲藏室的物品。',
  qs:[
    { q:'When are orders placed with the supplier?', opts:['Every Wednesday','Every Thursday','Every Monday','Twice a month'], a:1, why:'Orders are placed with our supplier every Thursday.' },
    { q:'What needs a supervisor\'s approval?', opts:['All supply requests','Items not on the standard list','Deliveries on Monday','Using the log book'], a:1, why:'Items that are not on the standard list … require approval.' },
    { q:'What must staff do when taking supplies?', opts:['Ask the mail room','Record them in the log book','Submit an online form','Pay for them'], a:1, why:'without recording them in the log book.' }
  ]
},

/* ---------------- U39 會議與簡報 ---------------- */
{
  id:'r3901', u:'s3u4', title:'Meeting Agenda: Quarterly Review',
  text:'The quarterly review will be held on Friday, June 14, from ten to twelve in Conference Room B. The agenda was sent to all department heads last week. Each department is asked to prepare a short presentation of no more than ten minutes. Handouts should be emailed to Ms. Wu by Wednesday so that copies can be prepared in advance. The minutes of the previous meeting are attached. Participants who cannot attend should send a representative.',
  zh:'季度檢討會將於六月十四日（星期五）十點至十二點在 B 會議室舉行。議程上週已寄給所有部門主管。各部門請準備不超過十分鐘的簡短簡報。講義請於星期三前以電子郵件寄給吳小姐，以便事先印製。上次會議紀錄附於信中。無法出席者請派代表參加。',
  qs:[
    { q:'How long should each presentation be?', opts:['No more than ten minutes','Two hours','Until twelve','One week'], a:0, why:'a short presentation of no more than ten minutes.' },
    { q:'Why should handouts be sent by Wednesday?', opts:['To be translated','So copies can be prepared','To be approved','To be posted online'], a:1, why:'so that copies can be prepared in advance.' },
    { q:'What should people do if they cannot attend?', opts:['Cancel the meeting','Send a representative','Email the minutes','Call Ms. Wu'], a:1, why:'should send a representative.' }
  ]
},

/* ---------------- U40 訂單與付款 ---------------- */
{
  id:'r4001', u:'s3u5', title:'Return and Refund Policy',
  text:'Items may be returned within thirty days of purchase. A receipt or other proof of purchase is required. Refunds are issued to the original payment method within seven business days after the returned item has been inspected. Items that have been used or damaged cannot be refunded, but they may be repaired if they are still under warranty. Shipping fees are not refunded unless the wrong item was sent. For large orders, a restocking fee of ten percent may be charged.',
  zh:'商品可於購買後三十天內退貨，需要收據或其他購買證明。退款會在退回商品經檢查後七個工作天內退回原付款方式。已使用或損壞的商品無法退款，但若仍在保固期內可以維修。運費不予退還，除非是寄錯商品。大量訂購可能會收取一成的重新上架費。',
  qs:[
    { q:'What is needed to return an item?', opts:['A warranty card','Proof of purchase','A supervisor\'s approval','The original box'], a:1, why:'A receipt or other proof of purchase is required.' },
    { q:'When are refunds issued?', opts:['Immediately','Within thirty days','Within seven business days after inspection','After the item is repaired'], a:2, why:'within seven business days after the returned item has been inspected.' },
    { q:'When are shipping fees refunded?', opts:['Never','If the wrong item was sent','For large orders','If the item is under warranty'], a:1, why:'unless the wrong item was sent.' }
  ]
},

/* ---------------- U41 出差與交通 ---------------- */
{
  id:'r4101', u:'s3u6', title:'Travel Policy Update',
  text:'Effective July 1, all business travel must be approved by a supervisor before tickets are booked. Economy class should be selected for flights under six hours. Accommodation is arranged by the administration team; employees are asked not to book hotels themselves. Travel expenses are reimbursed within thirty days after the expense form and receipts have been submitted. Receipts are not required for amounts under twenty dollars. Airport shuttle service is provided free of charge and should be used instead of taxis when available.',
  zh:'自七月一日起，所有商務差旅都必須先經主管核准才能訂票。六小時以內的航班應選擇經濟艙。住宿由行政團隊安排，請員工不要自行訂房。差旅費在費用表與收據送出後三十天內核銷。二十美元以下的金額不需收據。機場接駁服務免費提供，可用時應搭乘接駁車而非計程車。',
  qs:[
    { q:'What must happen before tickets are booked?', opts:['Hotels must be reserved.','A supervisor must approve the trip.','Receipts must be submitted.','A shuttle must be arranged.'], a:1, why:'must be approved by a supervisor before tickets are booked.' },
    { q:'Who arranges accommodation?', opts:['The employee','The administration team','The supervisor','The travel agency'], a:1, why:'Accommodation is arranged by the administration team.' },
    { q:'When are receipts not required?', opts:['For flights under six hours','For amounts under twenty dollars','For shuttle service','For hotel bookings'], a:1, why:'Receipts are not required for amounts under twenty dollars.' }
  ]
},

/* ---------------- U42 人事與招聘 ---------------- */
{
  id:'r4201', u:'s3u7', title:'Job Posting: Sales Coordinator',
  text:'Our regional office is looking for a sales coordinator. The successful candidate will support the sales team, prepare monthly reports, and handle customer inquiries. At least three years of experience in a similar position is required, and a bachelor\'s degree is preferred. Applications must be submitted online by May 20. Selected candidates will be contacted within two weeks for a first interview. The salary will be discussed at the second interview. This position is based in Taichung and some travel is expected.',
  zh:'我們的區域辦公室正在招募業務協調專員。錄取者將協助業務團隊、製作月報並處理客戶詢問。需要至少三年相關職務經驗，具學士學位者尤佳。申請必須於五月二十日前線上送出。入選者將在兩週內接到第一次面試通知。薪資將於第二次面試時討論。此職位駐點台中，需要部分出差。',
  qs:[
    { q:'What is required for this position?', opts:['A bachelor\'s degree','Three years of experience','Fluent Japanese','A driver\'s license'], a:1, why:'At least three years of experience … is required；學位只是 preferred。' },
    { q:'When will the salary be discussed?', opts:['In the job posting','At the first interview','At the second interview','After May 20'], a:2, why:'The salary will be discussed at the second interview.' },
    { q:'What is true about the position?', opts:['It is based in Taipei.','It requires some travel.','It is a part-time job.','No experience is needed.'], a:1, why:'some travel is expected.' }
  ]
},

/* ---------------- U45 魔王關 ---------------- */
{
  id:'r4501', u:'s3u10', title:'Memo: Office Relocation',
  text:'To: All Staff\nFrom: Facilities Management\nOur Taichung office will be relocated to the new building on Zhongming Road during the last week of August. Packing materials will be delivered to each floor on August 26. All personal items must be packed and labelled by five p.m. on August 28. Computers and other equipment will be moved by the IT team and should not be disconnected by staff. The new office will be opened on September 2. Parking permits for the new building can be collected from the reception desk after August 30. Employees who require access outside normal hours should submit a request to their supervisor before the move.',
  zh:'致：全體同仁\n來自：設施管理部\n我們的台中辦公室將於八月最後一週搬遷至中明路的新大樓。八月二十六日會將打包材料送到各樓層。所有個人物品必須在八月二十八日下午五點前打包並貼上標籤。電腦與其他設備由資訊團隊搬運，員工請勿自行拆線。新辦公室將於九月二日啟用。新大樓的停車證可於八月三十日後至接待櫃檯領取。需要在正常時間以外進出的同仁，請於搬遷前向主管提出申請。',
  qs:[
    { q:'What must staff do by August 28?', opts:['Collect parking permits','Pack and label personal items','Disconnect their computers','Move to the new building'], a:1, why:'All personal items must be packed and labelled by five p.m. on August 28.' },
    { q:'Who will move the equipment?', opts:['Each employee','The IT team','Facilities Management','The reception desk'], a:1, why:'will be moved by the IT team.' },
    { q:'When can parking permits be collected?', opts:['On August 26','After August 30','On September 2','Before the move'], a:1, why:'can be collected from the reception desk after August 30.' },
    { q:'What should employees needing after-hours access do?', opts:['Call the IT team','Submit a request to their supervisor','Wait until September 2','Visit the new building'], a:1, why:'should submit a request to their supervisor before the move.' }
  ]
}

];
