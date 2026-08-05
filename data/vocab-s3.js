/* ==========================================================================
   vocab-s3.js — Stage 3 單字（Unit 36–43）

   進到多益的主戰場。這一階段的字全部照「情境」分組，因為多益題目本來就是
   照情境出的：一段對話從頭到尾都在講出貨，會用到的字就是那二十幾個。

   選字時先扣掉 Stage 0–2 教過的 —— 商務字彙從 Stage 1 就開始鋪，
   invoice、supplier、interview 這些早就上過了，這裡只收真正還沒教到的。

   例句一律日常一句、職場一句，職場那句刻意大量用被動語態 ——
   這一階段的文法點就是被動，字和句型互相撐住。

   欄位同 vocab-s0：id / w / kk / pos / zh / ic / u / ex，
   外加可選的 lure（刻意誘答）、col（搭配詞，只掛動詞且詞組必須含目標字）、
   rt（字根字首）。
   ========================================================================== */
window.DATA_VOCAB_S3 = [

/* ===================== U36 被動語態 ===================== */
{id:'v3001',w:'dispatch',kk:'dɪˈspætʃ',pos:'v./n.',zh:'派送・調度',ic:'🚚',u:'s3u1',lure:['deliver','send'],col:[['dispatch a technician','派技師過去']],ex:[['They dispatched a repair van right away.','他們馬上派了一台維修車。'],['The parts were dispatched from the Taichung depot.','零件從台中集散站發出了。']]},
{id:'v3002',w:'authorize',kk:'ˈɔθəˌraɪz',pos:'v.',zh:'授權・批准',ic:'🔓',u:'s3u1',lure:['allow','approve'],col:[['authorize a payment','核准一筆付款']],ex:[['Only my mother can authorize the payment.','只有我媽可以批准這筆付款。'],['Access to this floor is authorized by security.','這一層樓的進出由保全授權。']]},
{id:'v3003',w:'inspect',kk:'ɪnˈspɛkt',pos:'v.',zh:'檢查・視察',ic:'🔎',u:'s3u1',lure:['check','watch'],rt:{p:'in- 向內',r:'spect 看'},col:[['inspect the site','視察現場']],ex:[['A doctor inspected my throat.','醫生檢查了我的喉嚨。'],['The machines are inspected twice a year.','機器每年檢查兩次。']]},
{id:'v3004',w:'install',kk:'ɪnˈstɔl',pos:'v.',zh:'安裝',ic:'🔧',u:'s3u1',lure:['replace','repair'],col:[['install software','安裝軟體']],ex:[['I installed a new app last night.','我昨晚裝了一個新的應用程式。'],['The new system will be installed over the weekend.','新系統會在週末安裝好。']]},
{id:'v3005',w:'enclose',kk:'ɪnˈkloz',pos:'v.',zh:'隨函附上・圍住',ic:'📎',u:'s3u1',lure:['send','contact'],rt:{p:'en- 使進入',r:'close 關'},col:[['enclose a copy','附上一份副本']],ex:[['A high wall encloses the garden.','一道高牆圍住了花園。'],['A copy of the receipt is enclosed with this letter.','本信隨函附上收據影本。']]},
{id:'v3006',w:'circulate',kk:'ˈsɝkjəˌlet',pos:'v.',zh:'傳閱・流通',ic:'🔄',u:'s3u1',lure:['deliver','send'],col:[['circulate a memo','傳閱通知']],ex:[['Fresh air circulates through the room.','新鮮空氣在房裡流通。'],['The revised policy was circulated to all departments.','修訂後的政策已傳閱到各部門。']]},
{id:'v3007',w:'validate',kk:'ˈvæləˌdet',pos:'v.',zh:'驗證・使生效',ic:'🎟️',u:'s3u1',lure:['confirm','check'],col:[['validate a ticket','驗票']],ex:[['Remember to validate your parking ticket.','記得把停車票蓋章。'],['All entries are validated before the results are announced.','所有報名資料在公布結果前都會查核。']]},
{id:'v3008',w:'assemble',kk:'əˈsɛmbl',pos:'v.',zh:'組裝・集合',ic:'🧱',u:'s3u1',lure:['complete','join'],col:[['assemble the parts','組裝零件']],ex:[['We assembled the bookshelf in an hour.','我們一小時就把書架組好了。'],['The units are assembled at our Kaohsiung plant.','機組在我們高雄廠組裝。']]},
{id:'v3009',w:'oversee',kk:'ˌovɚˈsi',pos:'v.',zh:'監督・管理',ic:'👁️',u:'s3u1',lure:['handle','watch'],col:[['oversee a project','監督專案']],ex:[['My aunt oversees the whole kitchen.','我阿姨管理整個廚房。'],['The renovation is overseen by an outside consultant.','整修工程由外部顧問監督。']]},
{id:'v3010',w:'discard',kk:'dɪsˈkɑrd',pos:'v.',zh:'丟棄・捨棄',ic:'🗑️',u:'s3u1',lure:['cancel','replace'],ex:[['Do not discard the box yet.','先不要把箱子丟掉。'],['Damaged items are discarded after inspection.','損壞的品項在檢查後會被丟棄。']]},

/* ===================== U37 主動改被動 ===================== */
{id:'v3011',w:'announce',kk:'əˈnaʊns',pos:'v.',zh:'宣布・公告',ic:'📣',u:'s3u2',lure:['tell','say'],col:[['announce the results','公布結果']],ex:[['They announced the winner last night.','他們昨晚宣布了得獎者。'],['The merger was announced this morning.','合併案今天早上公布了。']]},
{id:'v3012',w:'assign',kk:'əˈsaɪn',pos:'v.',zh:'指派・分配',ic:'📌',u:'s3u2',lure:['give','choose'],col:[['assign a task','指派工作']],ex:[['The teacher assigned us a project.','老師指派我們一個專題。'],['She was assigned to the Osaka branch.','她被派到大阪分公司。']]},
{id:'v3013',w:'solve',kk:'sɑlv',pos:'v.',zh:'解決',ic:'🧩',u:'s3u2',lure:['answer','repair'],ex:[['She solved the puzzle in five minutes.','她五分鐘就解開了那個謎題。'],['The technical problem was solved overnight.','技術問題一夜之間解決了。']]},
{id:'v3014',w:'reject',kk:'rɪˈdʒɛkt',pos:'v.',zh:'退回・否決',ic:'🚫',u:'s3u2',lure:['refuse','remain'],rt:{p:'re- 往回',r:'ject 丟'},ex:[['They rejected my idea.','他們否決了我的想法。'],['The application was rejected due to missing documents.','申請因文件不齊被退回。']]},
{id:'v3015',w:'occur',kk:'əˈkɝ',pos:'v.',zh:'發生',ic:'⚡',u:'s3u2',lure:['remain','stay'],ex:[['The accident occurred at noon.','意外發生在中午。'],['If any error occurs, contact the help desk.','如果發生任何錯誤，請聯絡服務台。']]},
{id:'v3016',w:'amend',kk:'əˈmɛnd',pos:'v.',zh:'修訂・修正',ic:'✏️',u:'s3u2',lure:['change','complete'],col:[['amend a contract','修訂合約']],ex:[['I amended my answer after checking.','我查過之後改了答案。'],['The safety rules were amended last year.','安全規範去年修訂過。']]},
{id:'v3017',w:'streamline',kk:'ˈstrimˌlaɪn',pos:'v.',zh:'簡化・使有效率',ic:'🏎️',u:'s3u2',lure:['complete','process'],col:[['streamline the process','簡化流程']],ex:[['We streamlined our morning routine.','我們把早上的流程簡化了。'],['The approval process has been streamlined.','核准流程已經簡化了。']]},
{id:'v3018',w:'unveil',kk:'ʌnˈvel',pos:'v.',zh:'公開發表・揭幕',ic:'🎭',u:'s3u2',lure:['announce','notice'],ex:[['They unveiled the statue on Sunday.','他們星期天為雕像揭幕。'],['A new model will be unveiled at the trade show.','新款會在商展上發表。']]},
{id:'v3019',w:'implement',kk:'ˈɪmpləmənt',pos:'v.',zh:'實施・執行',ic:'⚙️',u:'s3u2',lure:['process','complete'],col:[['implement a policy','實施政策']],ex:[['They implemented the new rule last week.','他們上週開始實施新規定。'],['The system will be implemented in three phases.','系統會分三階段導入。']]},
{id:'v3020',w:'exceed',kk:'ɪkˈsid',pos:'v.',zh:'超過・超出',ic:'📈',u:'s3u2',lure:['increase','complete'],rt:{p:'ex- 向外',r:'ceed 走'},col:[['exceed expectations','超乎預期']],ex:[['Do not exceed the speed limit.','不要超速。'],['Sales exceeded our target by fifteen percent.','業績超出目標一成五。']]},

/* ===================== U38 辦公室與設備 ===================== */
{id:'v3021',w:'copier',kk:'ˈkɑpɪɚ',pos:'n.',zh:'影印機',ic:'🖨️',u:'s3u3',lure:['machine','equipment'],ex:[['The copier is out of paper again.','影印機又沒紙了。'],['The copier on the third floor is being repaired.','三樓的影印機正在維修。']]},
{id:'v3022',w:'stationery',kk:'ˈsteʃənˌɛrɪ',pos:'n.',zh:'文具',ic:'✏️',u:'s3u3',lure:['equipment','tool'],ex:[['I bought some stationery for school.','我買了一些上學用的文具。'],['Stationery is stored in the supply room.','文具存放在用品室。']]},
{id:'v3023',w:'storage',kk:'ˈstorɪdʒ',pos:'n.',zh:'儲存空間・倉儲',ic:'📥',u:'s3u3',lure:['warehouse','cabinet'],ex:[['I put the winter clothes in storage.','我把冬衣收起來了。'],['Extra chairs are kept in the storage room.','多的椅子放在儲藏室。']]},
{id:'v3024',w:'access',kk:'ˈæksɛs',pos:'n./v.',zh:'使用權・存取',ic:'🔑',u:'s3u3',lure:['entrance','approval'],ex:[['I cannot access my email.','我打不開我的信箱。'],['Only managers are given access to this folder.','只有經理有這個資料夾的權限。']]},
{id:'v3025',w:'facility',kk:'fəˈsɪlətɪ',pos:'n.',zh:'設施・廠房',ic:'🏭',u:'s3u3',lure:['equipment','lobby'],ex:[['The gym facilities are free for guests.','健身設施對房客免費。'],['The new facility will be opened in June.','新廠房六月啟用。']]},
{id:'v3026',w:'maintenance',kk:'ˈmentənəns',pos:'n.',zh:'維修保養',ic:'🛠️',u:'s3u3',lure:['repair','equipment'],ex:[['The car needs regular maintenance.','這台車需要定期保養。'],['The elevator is closed for maintenance today.','電梯今天因保養暫停使用。']]},
{id:'v3027',w:'thermostat',kk:'ˈθɝməˌstæt',pos:'n.',zh:'溫控器',ic:'🌡️',u:'s3u3',lure:['machine','equipment'],ex:[['Please turn down the thermostat.','請把溫度調低一點。'],['The thermostat was set to twenty-five degrees.','溫控器設定在二十五度。']]},
{id:'v3028',w:'janitor',kk:'ˈdʒænɪtɚ',pos:'n.',zh:'清潔管理員',ic:'🧹',u:'s3u3',lure:['supervisor','colleague'],ex:[['The janitor opens the gate at six.','管理員六點開門。'],['The spill was cleaned up by the janitor.','灑出來的東西由清潔人員清理了。']]},
{id:'v3029',w:'signage',kk:'ˈsaɪnɪdʒ',pos:'n.',zh:'標示牌',ic:'🪧',u:'s3u3',lure:['notice','entrance'],ex:[['The signage here is confusing.','這裡的指標很難懂。'],['New signage was installed near the entrance.','入口附近裝了新的標示牌。']]},
{id:'v3030',w:'outage',kk:'ˈaʊtɪdʒ',pos:'n.',zh:'停電・斷線',ic:'🔌',u:'s3u3',lure:['delay','notice'],ex:[['The outage lasted two hours.','停電持續了兩小時。'],['A power outage was reported on the fifth floor.','五樓通報停電。']]},
{id:'v3031',w:'workplace',kk:'ˈwɝkˌples',pos:'n.',zh:'職場・工作場所',ic:'🏢',u:'s3u3',lure:['facility','lobby'],ex:[['A tidy workplace helps me think.','整齊的工作環境讓我思緒清楚。'],['Safety rules are posted throughout the workplace.','安全規定張貼在工作場所各處。']]},
{id:'v3032',w:'paperwork',kk:'ˈpepɚˌwɝk',pos:'n.',zh:'文書作業',ic:'🗃️',u:'s3u3',lure:['handout','stationery'],ex:[['I hate doing paperwork on Sunday.','我討厭星期天處理文件。'],['All paperwork must be completed before the deadline.','所有文書作業必須在期限前完成。']]},

/* ===================== U39 會議與簡報 ===================== */
{id:'v3033',w:'agenda',kk:'əˈdʒɛndə',pos:'n.',zh:'議程',ic:'🗒️',u:'s3u4',lure:['schedule','summary'],ex:[['What is on the agenda tonight?','今晚有什麼安排？'],['The agenda was sent out yesterday.','議程昨天寄出了。']]},
{id:'v3034',w:'presentation',kk:'ˌprɛznˈteʃən',pos:'n.',zh:'簡報',ic:'📊',u:'s3u4',rt:{r:'present 呈現',s:'-ation 名詞'},ex:[['Her presentation was really clear.','她的簡報很清楚。'],['The presentation has been moved to Room B.','簡報已改到 B 會議室。']]},
{id:'v3035',w:'handout',kk:'ˈhændˌaʊt',pos:'n.',zh:'講義',ic:'📄',u:'s3u4',lure:['summary','paperwork'],ex:[['The teacher gave us a handout.','老師發了一張講義。'],['Handouts are placed on every seat.','講義放在每個座位上。']]},
{id:'v3036',w:'keynote',kk:'ˈkiˌnot',pos:'n.',zh:'主題演說',ic:'🎤',u:'s3u4',lure:['presentation','summary'],ex:[['The keynote starts at nine.','主題演說九點開始。'],['The keynote was given by the founder.','主題演說由創辦人主講。']]},
{id:'v3037',w:'seminar',kk:'ˈsɛməˌnɑr',pos:'n.',zh:'研習會',ic:'🧑‍🏫',u:'s3u4',lure:['conference','interview'],ex:[['I joined a cooking seminar last month.','我上個月參加了一場烹飪講座。'],['The seminar was held in the main hall.','研習會在大廳舉行。']]},
{id:'v3038',w:'workshop',kk:'ˈwɝkˌʃɑp',pos:'n.',zh:'工作坊',ic:'🧰',u:'s3u4',lure:['seminar','facility'],ex:[['The pottery workshop was fun.','那個陶藝工作坊很好玩。'],['A safety workshop is held every quarter.','每季都會舉辦一次安全工作坊。']]},
{id:'v3039',w:'memorandum',kk:'ˌmɛməˈrændəm',pos:'n.',zh:'備忘錄・通知單',ic:'📋',u:'s3u4',lure:['notice','summary'],ex:[['He left a short memorandum on my desk.','他在我桌上留了一張便條。'],['A memorandum was circulated to all staff.','一份備忘錄傳閱給了全體同仁。']]},
{id:'v3040',w:'minutes',kk:'ˈmɪnɪts',pos:'n.',zh:'會議紀錄',ic:'📝',u:'s3u4',lure:['summary','agenda'],ex:[['Wait five minutes, please.','請等五分鐘。'],['The minutes were circulated to all attendees.','會議紀錄發送給了所有與會者。']]},
{id:'v3041',w:'summary',kk:'ˈsʌmərɪ',pos:'n.',zh:'摘要',ic:'🧾',u:'s3u4',lure:['minutes','handout'],ex:[['Give me a short summary of the book.','幫我簡短講一下這本書。'],['A summary of the results was attached.','結果摘要附在信裡。']]},
{id:'v3042',w:'proposal',kk:'prəˈpozl',pos:'n.',zh:'提案',ic:'📑',u:'s3u4',rt:{r:'propose 提議',s:'-al 名詞'},lure:['agenda','summary'],ex:[['He turned down my proposal.','他拒絕了我的提議。'],['The proposal was rejected by the committee.','提案被委員會否決了。']]},
{id:'v3043',w:'attendee',kk:'əˌtɛnˈdi',pos:'n.',zh:'與會者',ic:'👥',u:'s3u4',rt:{r:'attend 出席',s:'-ee 被動的人'},lure:['candidate','colleague'],ex:[['Every attendee gets a name tag.','每位與會者都有名牌。'],['Attendees will be notified by Friday.','與會者將於星期五前收到通知。']]},
{id:'v3044',w:'brief',kk:'brif',pos:'adj./v.',zh:'簡短的・作簡報說明',ic:'⏱️',u:'s3u4',lure:['short','summary'],ex:[['Let\'s take a brief break.','我們稍微休息一下。'],['The team was briefed on the new policy.','團隊已就新政策接受了簡報。']]},

/* ===================== U40 訂單與付款 ===================== */
{id:'v3045',w:'quotation',kk:'kwoˈteʃən',pos:'n.',zh:'報價單',ic:'💬',u:'s3u5',lure:['invoice','receipt'],ex:[['I asked three shops for a quotation.','我跟三家店要了報價。'],['A quotation was sent to the client yesterday.','報價單昨天寄給客戶了。']]},
{id:'v3046',w:'deposit',kk:'dɪˈpɑzɪt',pos:'n./v.',zh:'訂金・押金',ic:'💵',u:'s3u5',lure:['payment','refund'],col:[['deposit a check','存入支票']],ex:[['I deposited the money this morning.','我今天早上把錢存進去了。'],['A deposit of twenty percent is required.','需支付兩成訂金。']]},
{id:'v3047',w:'installment',kk:'ɪnˈstɔlmənt',pos:'n.',zh:'分期付款',ic:'🗓️',u:'s3u5',lure:['payment','deposit'],ex:[['I pay for my phone in installments.','我的手機是分期付的。'],['The balance may be paid in six installments.','餘額可分六期支付。']]},
{id:'v3048',w:'surcharge',kk:'ˈsɝˌtʃɑrdʒ',pos:'n.',zh:'附加費',ic:'➕',u:'s3u5',lure:['discount','fee'],ex:[['There is a small surcharge for delivery.','外送要加一點費用。'],['A surcharge is added to weekend bookings.','週末訂位會加收附加費。']]},
{id:'v3049',w:'rebate',kk:'ˈribet',pos:'n.',zh:'折扣退款',ic:'💸',u:'s3u5',lure:['refund','discount'],ex:[['I got a rebate on my electricity bill.','我的電費帳單拿到了退費。'],['A rebate is offered on all floor models.','所有展示機都提供折扣退款。']]},
{id:'v3050',w:'voucher',kk:'ˈvaʊtʃɚ',pos:'n.',zh:'兌換券',ic:'🎟️',u:'s3u5',lure:['receipt','discount'],ex:[['I have a voucher for a free coffee.','我有一張免費咖啡券。'],['Each attendee is given a meal voucher.','每位與會者都會拿到一張餐券。']]},
{id:'v3051',w:'warranty',kk:'ˈwɔrəntɪ',pos:'n.',zh:'保固',ic:'🛡️',u:'s3u5',lure:['receipt','approval'],ex:[['The laptop still has a warranty.','這台筆電還在保固期內。'],['Parts are covered by a two-year warranty.','零件享有兩年保固。']]},
{id:'v3052',w:'merchandise',kk:'ˈmɝtʃənˌdaɪz',pos:'n.',zh:'商品',ic:'🛍️',u:'s3u5',lure:['package','supply'],ex:[['The store sells sports merchandise.','那家店賣運動商品。'],['Damaged merchandise will be replaced free of charge.','損壞的商品會免費更換。']]},
{id:'v3053',w:'inventory',kk:'ˈɪnvənˌtorɪ',pos:'n.',zh:'庫存',ic:'📦',u:'s3u5',lure:['warehouse','supply'],ex:[['We take inventory every Sunday.','我們每個星期天盤點。'],['The item is not in our inventory right now.','這個品項目前沒有庫存。']]},
{id:'v3054',w:'shipment',kk:'ˈʃɪpmənt',pos:'n.',zh:'貨件・出貨',ic:'🚢',u:'s3u5',rt:{r:'ship 運送',s:'-ment 名詞'},lure:['package','supplier'],ex:[['The shipment arrived this morning.','那批貨今天早上到了。'],['Your shipment has been delayed by two days.','您的貨件延遲了兩天。']]},
{id:'v3055',w:'transaction',kk:'trænˈzækʃən',pos:'n.',zh:'交易',ic:'💳',u:'s3u5',lure:['payment','order'],ex:[['The transaction took only a second.','那筆交易只花了一秒。'],['All transactions are recorded automatically.','所有交易都會自動記錄。']]},
{id:'v3056',w:'overdue',kk:'ˌovɚˈdu',pos:'adj.',zh:'逾期的',ic:'⏳',u:'s3u5',lure:['delay','complete'],ex:[['My library book is overdue.','我的圖書館書逾期了。'],['The overdue balance must be settled this week.','逾期款項必須在本週結清。']]},

/* ===================== U41 出差與交通 ===================== */
{id:'v3057',w:'itinerary',kk:'aɪˈtɪnəˌrɛrɪ',pos:'n.',zh:'旅遊行程表',ic:'🗺️',u:'s3u6',ex:[['I printed out our itinerary.','我把我們的行程表印出來了。'],['The itinerary was updated with the new flight.','行程表已更新為新的航班。']]},
{id:'v3058',w:'boarding',kk:'ˈbordɪŋ',pos:'n.',zh:'登機',ic:'🎫',u:'s3u6',lure:['departure','transit'],ex:[['Boarding starts in ten minutes.','十分鐘後開始登機。'],['Boarding passes are issued at the counter.','登機證在櫃檯領取。']]},
{id:'v3059',w:'departure',kk:'dɪˈpɑrtʃɚ',pos:'n.',zh:'出發',ic:'🛫',u:'s3u6',rt:{r:'depart 離開',s:'-ure 名詞'},lure:['boarding','destination'],ex:[['Our departure is at six.','我們六點出發。'],['The departure time was changed to 8:40.','出發時間改成八點四十分。']]},
{id:'v3060',w:'destination',kk:'ˌdɛstəˈneʃən',pos:'n.',zh:'目的地',ic:'📍',u:'s3u6',lure:['departure','terminal'],ex:[['Kyoto is my favorite destination.','京都是我最喜歡的目的地。'],['The destination was changed at the last minute.','目的地在最後一刻更改了。']]},
{id:'v3061',w:'terminal',kk:'ˈtɝmənl',pos:'n.',zh:'航廈・轉運站',ic:'🛄',u:'s3u6',lure:['destination','entrance'],ex:[['We waited at terminal two.','我們在第二航廈等。'],['Shuttle buses are provided between terminals.','航廈之間有提供接駁車。']]},
{id:'v3062',w:'transit',kk:'ˈtrænsɪt',pos:'n.',zh:'轉機・運輸',ic:'🚏',u:'s3u6',lure:['transfer','boarding'],ex:[['We have a six-hour transit in Bangkok.','我們在曼谷轉機六小時。'],['The goods were damaged in transit.','貨物在運送途中損壞了。']]},
{id:'v3063',w:'shuttle',kk:'ˈʃʌtl',pos:'n.',zh:'接駁車',ic:'🚐',u:'s3u6',lure:['transit','terminal'],ex:[['The shuttle runs every fifteen minutes.','接駁車每十五分鐘一班。'],['A shuttle is provided from the airport.','機場有提供接駁車。']]},
{id:'v3064',w:'fare',kk:'fɛr',pos:'n.',zh:'車資・票價',ic:'💴',u:'s3u6',lure:['fee','price'],ex:[['The bus fare went up again.','公車票價又漲了。'],['Fares are refunded if the train is cancelled.','列車取消時票價會退還。']]},
{id:'v3065',w:'accommodation',kk:'əˌkɑməˈdeʃən',pos:'n.',zh:'住宿',ic:'🏩',u:'s3u6',lure:['reservation','facility'],ex:[['The accommodation was better than expected.','住宿比預期的好。'],['Accommodation will be arranged by the company.','公司會安排住宿。']]},
{id:'v3066',w:'mileage',kk:'ˈmaɪlɪdʒ',pos:'n.',zh:'里程・里程數',ic:'🧭',u:'s3u6',lure:['fare','transit'],ex:[['This car has low mileage.','這台車里程數很低。'],['Mileage is reimbursed at ten dollars per kilometer.','里程以每公里十元核銷。']]},
{id:'v3067',w:'reimburse',kk:'ˌriɪmˈbɝs',pos:'v.',zh:'報銷・償還',ic:'🧾',u:'s3u6',lure:['refund','payment'],col:[['reimburse expenses','報銷費用']],ex:[['My friend reimbursed me for the tickets.','我朋友把票錢還我了。'],['Travel costs are reimbursed within thirty days.','差旅費用三十天內核銷。']]},
{id:'v3068',w:'allowance',kk:'əˈlaʊəns',pos:'n.',zh:'津貼・額度',ic:'💰',u:'s3u6',lure:['salary','benefit'],ex:[['My weekly allowance is small.','我每週的零用錢不多。'],['A daily meal allowance is provided during business trips.','出差期間提供每日餐費津貼。']]},

/* ===================== U42 人事與招聘 ===================== */
{id:'v3069',w:'qualification',kk:'ˌkwɑləfəˈkeʃən',pos:'n.',zh:'資格・學經歷',ic:'📜',u:'s3u7',lure:['experience','approval'],ex:[['She has the right qualifications.','她具備合適的資格。'],['Qualifications are verified before hiring.','錄取前會核實學經歷。']]},
{id:'v3070',w:'recruit',kk:'rɪˈkrut',pos:'v./n.',zh:'招募・新進人員',ic:'🎯',u:'s3u7',lure:['interview','employer'],col:[['recruit new staff','招募新人']],ex:[['The team is recruiting volunteers.','那個團隊正在招募志工。'],['Ten engineers were recruited last quarter.','上一季招募了十位工程師。']]},
{id:'v3071',w:'intern',kk:'ˈɪntɝn',pos:'n.',zh:'實習生',ic:'🧑‍🎓',u:'s3u7',lure:['candidate','colleague'],ex:[['My cousin is an intern at a hospital.','我表弟在醫院實習。'],['Interns are supervised by a senior engineer.','實習生由資深工程師帶。']]},
{id:'v3072',w:'personnel',kk:'ˌpɝsnˈɛl',pos:'n.',zh:'人員・人事部',ic:'👔',u:'s3u7',lure:['colleague','supervisor'],ex:[['Only authorized personnel may enter.','僅限授權人員進入。'],['Personnel records are kept confidential.','人事紀錄一律保密。']]},
{id:'v3073',w:'vacancy',kk:'ˈvekənsɪ',pos:'n.',zh:'職缺・空房',ic:'🪑',u:'s3u7',lure:['interview','entrance'],ex:[['The hotel has no vacancies tonight.','飯店今晚客滿。'],['A vacancy in the marketing team was posted online.','行銷團隊的職缺已在網路上公告。']]},
{id:'v3074',w:'credential',kk:'krɪˈdɛnʃəl',pos:'n.',zh:'資歷證明',ic:'🪪',u:'s3u7',lure:['qualification','approval'],ex:[['She showed her credentials at the door.','她在門口出示了證件。'],['All credentials are checked by human resources.','所有資歷證明都由人資查核。']]},
{id:'v3075',w:'retirement',kk:'rɪˈtaɪrmənt',pos:'n.',zh:'退休',ic:'🌴',u:'s3u7',rt:{r:'retire 退休',s:'-ment 名詞'},lure:['promotion','benefit'],ex:[['My father enjoys his retirement.','我爸很享受退休生活。'],['A retirement party was held on Friday.','星期五辦了一場歡送退休派對。']]},
{id:'v3076',w:'layoff',kk:'ˈleˌɔf',pos:'n.',zh:'裁員',ic:'📉',u:'s3u7',lure:['promotion','retirement'],ex:[['The layoffs were announced in May.','裁員在五月宣布。'],['No layoffs are planned for this year.','今年沒有裁員計畫。']]},
{id:'v3077',w:'workforce',kk:'ˈwɝkˌfors',pos:'n.',zh:'勞動力・全體員工',ic:'👷',u:'s3u7',lure:['personnel','workplace'],ex:[['The town has a young workforce.','這個鎮的勞動人口很年輕。'],['Half of the workforce was trained last month.','上個月有一半的員工受了訓。']]},
{id:'v3078',w:'incentive',kk:'ɪnˈsɛntɪv',pos:'n.',zh:'獎勵・誘因',ic:'🏅',u:'s3u7',lure:['benefit','salary'],ex:[['A free coffee is a good incentive.','一杯免費咖啡就是很好的誘因。'],['Sales incentives are paid every quarter.','業績獎金每季發放。']]},
{id:'v3079',w:'appraisal',kk:'əˈprezl',pos:'n.',zh:'考核・評估',ic:'📊',u:'s3u7',lure:['approval','interview'],ex:[['The house appraisal came back high.','房屋估價出來很高。'],['Annual appraisals are conducted every December.','年度考核在每年十二月進行。']]},
{id:'v3080',w:'staffing',kk:'ˈstæfɪŋ',pos:'n.',zh:'人力配置',ic:'🧑‍🤝‍🧑',u:'s3u7',lure:['workforce','personnel'],ex:[['Weekend staffing is always tight.','週末人手總是很緊。'],['Staffing levels were increased before the holiday.','假期前增加了人力配置。']]},
{id:'v3081',w:'resignation',kk:'ˌrɛzɪgˈneʃən',pos:'n.',zh:'辭呈・辭職',ic:'👋',u:'s3u7',lure:['retirement','layoff'],ex:[['He handed in his resignation on Monday.','他星期一遞了辭呈。'],['Her resignation was accepted by the director.','她的辭呈被總監接受了。']]},

/* ===================== U43 Part 5 詞性判斷 ===================== */
{id:'v3082',w:'significant',kk:'sɪgˈnɪfəkənt',pos:'adj.',zh:'顯著的・重大的',ic:'📶',u:'s3u8',ex:[['There was a significant change.','有一個明顯的改變。'],['Sales showed a significant increase this quarter.','本季業績顯著成長。']]},
{id:'v3083',w:'efficient',kk:'ɪˈfɪʃənt',pos:'adj.',zh:'有效率的',ic:'⚡',u:'s3u8',lure:['effective','significant'],ex:[['This is a more efficient route.','這條路線比較有效率。'],['The new system is more efficient than the old one.','新系統比舊系統更有效率。']]},
{id:'v3084',w:'reliable',kk:'rɪˈlaɪəbl',pos:'adj.',zh:'可靠的',ic:'🤝',u:'s3u8',rt:{r:'rely 依靠',s:'-able 可…的'},lure:['durable','efficient'],ex:[['He is a reliable friend.','他是個可靠的朋友。'],['We need a reliable supplier for this part.','這個零件我們需要可靠的供應商。']]},
{id:'v3085',w:'durable',kk:'ˈdʊrəbl',pos:'adj.',zh:'耐用的',ic:'🧱',u:'s3u8',lure:['reliable','faulty'],ex:[['These boots are very durable.','這雙靴子很耐穿。'],['The case is made of a durable material.','這個外殼是用耐用的材質做的。']]},
{id:'v3086',w:'faulty',kk:'ˈfɔltɪ',pos:'adj.',zh:'有瑕疵的',ic:'⚠️',u:'s3u8',lure:['durable','overdue'],ex:[['The faulty cable was the problem.','問題出在那條壞掉的線。'],['Faulty items are returned to the manufacturer.','有瑕疵的品項會退回製造商。']]},
{id:'v3087',w:'mandatory',kk:'ˈmændəˌtorɪ',pos:'adj.',zh:'強制的',ic:'❗',u:'s3u8',lure:['eligible','significant'],ex:[['Helmets are mandatory on this site.','這個工地強制配戴安全帽。'],['Attendance at the briefing is mandatory.','簡報必須出席。']]},
{id:'v3088',w:'eligible',kk:'ˈɛlɪdʒəbl',pos:'adj.',zh:'符合資格的',ic:'✅',u:'s3u8',lure:['mandatory','reliable'],ex:[['Are you eligible for a discount?','你符合折扣資格嗎？'],['Employees are eligible for the bonus after one year.','員工滿一年後即有資格領獎金。']]},
{id:'v3089',w:'professional',kk:'prəˈfɛʃənl',pos:'adj./n.',zh:'專業的・專業人士',ic:'💼',u:'s3u8',lure:['reliable','efficient'],ex:[['She looks very professional.','她看起來很專業。'],['The complaint was handled in a professional manner.','客訴以專業的方式處理了。']]},
{id:'v3090',w:'regional',kk:'ˈridʒənl',pos:'adj.',zh:'區域的',ic:'🌏',u:'s3u8',rt:{r:'region 區域',s:'-al 形容詞'},ex:[['This is a regional dish.','這是道地方菜。'],['Our regional office will be opened in Osaka.','我們的區域辦公室將在大阪開幕。']]},
{id:'v3091',w:'informative',kk:'ɪnˈfɔrmətɪv',pos:'adj.',zh:'資訊豐富的',ic:'💡',u:'s3u8',rt:{r:'inform 告知',s:'-ative 形容詞'},ex:[['That video was really informative.','那部影片很有料。'],['The workshop was informative and well organized.','工作坊內容豐富又安排得宜。']]},
{id:'v3092',w:'carefully',kk:'ˈkɛrfəlɪ',pos:'adv.',zh:'仔細地',ic:'🔍',u:'s3u8',ex:[['Drive carefully.','小心開車。'],['Please read the terms carefully before signing.','簽名前請仔細閱讀條款。']]}

];
