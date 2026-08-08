/* ==========================================================================
   vocab-s4.js — Stage 4 單字（Unit 46–49、53）

   這一階段的字和前面幾階不一樣：不再是「還沒學過的新字」，而是
   **每個字都認得、合起來卻看不懂**的那兩類。

     片語動詞（U48）  put off、call off、turn down —— 三個字都是 Stage 0 教的，
                      湊起來的意思卻查不到。多益聽力最愛用它們替換掉正式動詞：
                      題目說 postpone，對話裡講的是 put off。
     易混淆字組（U49） 長得像、詞性不同：effect／affect、rise／raise。
                      Part 5 有一整批題目就在考這個，而且四個選項全是同一個字根。

   **片語動詞刻意成對收**：put off 的誘答只有 put on 有鑑別度，配上 office、very
   一眼就刪得掉。而誘答要能出現在選項裡，那個字本身就得是課程單字
   （distractors() 走 wordItem()，查不到的 lure 只能用在排句字塊）。
   所以這一關收的是八組對照，不是十六個各自獨立的片語。

   同理，易混淆字組一律收成對，兩個字互相當 lure。少數對照字前面幾階已經教過
   （raise 在 s1u6、successful 在 s1u15），那就不重收，直接拿來當誘答 ——
   同一個字重複收錄的話 byWord 只留先出現的那筆，這裡再寫一次是白寫。

   片語動詞的 w 有空格，所以：
     · 不會被排句題挑成字塊（tokenLures 會跳過有空格的字）
     · 拼字題也自動跳過（scheduler 的 spellPool 過濾 /\s/）
   兩件事都是既有機制，不必為這一階段特別處理。

   欄位同 vocab-s3：id / w / kk / pos / zh / ic / u / ex，外加 lure / col / rt。
   col 只掛動詞，而且詞組必須含目標字本身（挖空才挖得出來）。
   ========================================================================== */
window.DATA_VOCAB_S4 = [

/* ===================== U46 假設語氣 ===================== */
{id:'v4001',w:'otherwise',kk:'ˈʌðɚˌwaɪz',pos:'adv.',zh:'否則・不然',ic:'⚠️',u:'s4u1',lure:['instead','anyway'],
 ex:[['Leave now, otherwise you will be late.','現在就走，不然你會遲到。'],
     ['Confirm by Friday; otherwise the booking will be released.','請於星期五前確認，否則訂位會被釋出。']]},
{id:'v4002',w:'unless',kk:'ʌnˈlɛs',pos:'conj.',zh:'除非',ic:'🚫',u:'s4u1',lure:['until','although'],
 ex:[['I will not go unless you come with me.','除非你跟我去，不然我不去。'],
     ['The refund cannot be processed unless the receipt is attached.','除非附上收據，否則無法辦理退款。']]},
{id:'v4003',w:'circumstance',kk:'ˈsɝkəmˌstæns',pos:'n.',zh:'情況・情勢',ic:'🎯',u:'s4u1',lure:['situation','circulate'],
 ex:[['Under the circumstances, we had no choice.','在那種情況下我們別無選擇。'],
     ['Refunds are given only under exceptional circumstances.','只有在特殊情況下才會退款。']]},
{id:'v4004',w:'sufficient',kk:'səˈfɪʃənt',pos:'adj.',zh:'足夠的',ic:'✅',u:'s4u1',lure:['efficient','similar'],
 ex:[['We have sufficient time to finish.','我們有足夠的時間完成。'],
     ['If sufficient funds were available, the project would start now.','如果資金充足，這個案子現在就會開始。']]},
{id:'v4005',w:'alternative',kk:'ɔlˈtɝnətɪv',pos:'n./adj.',zh:'替代方案・另一種的',ic:'🔀',u:'s4u1',lure:['option','choice'],
 ex:[['Is there an alternative to this plan?','這個計畫有替代方案嗎？'],
     ['If the flight were cancelled, we would need an alternative route.','萬一班機取消，我們會需要另一條路線。']]},
{id:'v4006',w:'consequence',kk:'ˈkɑnsəˌkwɛns',pos:'n.',zh:'後果',ic:'🔗',u:'s4u1',lure:['result','conference'],
 ex:[['Every choice has consequences.','每個選擇都有後果。'],
     ['Missing the deadline had serious consequences for the team.','錯過期限對團隊造成了嚴重的後果。']]},
{id:'v4007',w:'waive',kk:'wev',pos:'v.',zh:'免除・放棄（權利）',ic:'🆓',u:'s4u1',lure:['refund','reduce'],
 col:[['waive a fee','免收費用']],
 ex:[['The bank waived the transfer fee this time.','銀行這次免收了轉帳手續費。'],
     ['If you book two rooms, the deposit is waived.','如果訂兩間房，訂金就免收。']]},
{id:'v4008',w:'prospective',kk:'prəˈspɛktɪv',pos:'adj.',zh:'潛在的・未來的',ic:'🔭',u:'s4u1',lure:['possible','expect'],
 ex:[['She showed the flat to a prospective buyer.','她帶一位可能的買家看了那間公寓。'],
     ['Prospective clients will receive a sample pack.','潛在客戶會收到一份樣品包。']]},
{id:'v4009',w:'entitle',kk:'ɪnˈtaɪtl',pos:'v.',zh:'給予資格・使有權利',ic:'🎫',u:'s4u1',lure:['title','entire'],
 ex:[['This ticket entitles you to one free drink.','這張票可以換一杯免費飲料。'],
     ['Members are entitled to a discount on all workshops.','會員有權享有所有工作坊的折扣。']]},
{id:'v4010',w:'contingency',kk:'kənˈtɪndʒənsɪ',pos:'n.',zh:'突發狀況・應變（方案）',ic:'🛟',u:'s4u1',lure:['circumstance','consequence'],
 ex:[['We kept some money aside for contingencies.','我們留了一些錢應付突發狀況。'],
     ['If the supplier failed, our contingency plan would take effect.','萬一供應商出問題，我們的應變計畫就會啟動。']]},

/* ===================== U47 分詞構句 ===================== */
{id:'v4011',w:'accompany',kk:'əˈkʌmpənɪ',pos:'v.',zh:'陪同・附隨',ic:'👥',u:'s4u2',lure:['company','accomplish'],
 ex:[['A friend accompanied me to the airport.','一個朋友陪我去機場。'],
     ['Receipts must accompany every expense claim.','每筆費用申請都必須附上收據。']]},
{id:'v4012',w:'seek',kk:'sik',pos:'v.',zh:'尋求',ic:'🔎',u:'s4u2',lure:['search','look for'],forms:{p:'sought',d:'sought'},
 ex:[['She is seeking a new job.','她正在找新工作。'],
     ['Seeking to cut costs, the company merged two departments.','為了節省成本，公司合併了兩個部門。']]},
{id:'v4013',w:'pursue',kk:'pɚˈsu',pos:'v.',zh:'追求・進行',ic:'🏃',u:'s4u2',lure:['purchase','promise'],
 ex:[['He decided to pursue a degree in design.','他決定攻讀設計學位。'],
     ['Pursuing a new market, the firm opened an office in Osaka.','為了開拓新市場，公司在大阪設了辦公室。']]},
{id:'v4014',w:'facilitate',kk:'fəˈsɪləˌtet',pos:'v.',zh:'促進・使順利進行',ic:'🤝',u:'s4u2',lure:['facility','fascinate'],
 ex:[['A good map facilitates travel.','一張好地圖讓旅行更順利。'],
     ['The new software facilitates communication between branches.','新軟體讓各分店之間的溝通更順暢。']]},
{id:'v4015',w:'undergo',kk:'ˌʌndɚˈgo',pos:'v.',zh:'經歷・接受（檢修）',ic:'🔧',u:'s4u2',lure:['under','undertake'],forms:{p:'underwent',d:'undergone'},
 ex:[['The building is undergoing repairs.','這棟大樓正在整修。'],
     ['Having undergone testing, the device is now ready to ship.','經過測試後，這台裝置現在可以出貨了。']]},
{id:'v4016',w:'anticipate',kk:'ænˈtɪsəˌpet',pos:'v.',zh:'預期',ic:'🔮',u:'s4u2',lure:['participate','appreciate'],
 ex:[['We anticipate a busy weekend.','我們預期這個週末會很忙。'],
     ['Anticipating heavy traffic, we left an hour early.','因為預期會塞車，我們提早一小時出發。']]},
{id:'v4017',w:'compile',kk:'kəmˈpaɪl',pos:'v.',zh:'彙整・編製',ic:'🗂️',u:'s4u2',lure:['complete','compare'],
 ex:[['She compiled a list of names.','她整理了一份名單。'],
     ['Compiled from six branches, the report took two weeks.','這份報告彙整六家分店的資料，做了兩週。']]},
{id:'v4018',w:'precede',kk:'prɪˈsid',pos:'v.',zh:'在…之前發生',ic:'⏮️',u:'s4u2',lure:['proceed','prepare'],
 ex:[['A short talk preceded the tour.','參觀前有一場簡短的談話。'],
     ['A safety briefing precedes every factory visit.','每次參觀工廠前都會先做安全簡報。']]},
{id:'v4019',w:'coincide',kk:'ˌkoɪnˈsaɪd',pos:'v.',zh:'同時發生・恰好一致',ic:'⏰',u:'s4u2',lure:['decide','consider'],
 ex:[['My holiday coincided with the festival.','我的假期剛好碰上那個節慶。'],
     ['The launch coincides with the trade fair in Taipei.','發表會剛好和台北的商展同時舉行。']]},
{id:'v4020',w:'thereby',kk:'ˌðɛrˈbaɪ',pos:'adv.',zh:'從而・藉此',ic:'➡️',u:'s4u2',lure:['therefore','thereafter'],
 ex:[['He arrived early, thereby avoiding the queue.','他早到了，因而避開了排隊。'],
     ['The plant was automated, thereby cutting labour costs.','工廠自動化了，從而降低了人力成本。']]},

/* ===================== U48 片語動詞 =====================
   八組對照，每組兩個字互相當 lure。
   hand in、set up、fill out、run out of 前面幾階已經教過，這裡不重收，
   直接拿來當對照組的誘答。 */
{id:'v4021',w:'put off',kk:'pʊt ɔf',pos:'v.',zh:'延期・拖延',ic:'📆',u:'s4u3',lure:['put on','call off'],
 ex:[['They put off the picnic because of rain.','他們因為下雨把野餐延期了。'],
     ['The meeting was put off until Thursday.','會議延到星期四了。']]},
{id:'v4022',w:'put on',kk:'pʊt ɑn',pos:'v.',zh:'穿上・戴上',ic:'🧥',u:'s4u3',lure:['put off','turn on'],
 ex:[['Put on your coat before you go out.','出門前把外套穿上。'],
     ['Visitors must put on a helmet in the plant.','訪客在廠區內必須戴上安全帽。']]},
{id:'v4023',w:'call off',kk:'kɔl ɔf',pos:'v.',zh:'取消',ic:'❌',u:'s4u3',lure:['call on','put off'],
 ex:[['We called off the trip.','我們取消了那趟旅行。'],
     ['The launch was called off after the test failed.','測試失敗後，發表會取消了。']]},
{id:'v4024',w:'call on',kk:'kɔl ɑn',pos:'v.',zh:'拜訪・點名請（某人發言）',ic:'🚪',u:'s4u3',lure:['call off','check in'],
 ex:[['She called on an old friend in Tainan.','她去台南拜訪了一位老朋友。'],
     ['The chair called on Ms. Ito to present the figures.','主席請伊藤小姐報告數字。']]},
{id:'v4025',w:'turn down',kk:'tɝn daʊn',pos:'v.',zh:'拒絕・調低',ic:'👎',u:'s4u3',lure:['turn up','turn off'],
 ex:[['Please turn down the music.','請把音樂關小聲。'],
     ['She turned down the offer because of the location.','她因為地點而婉拒了那份工作。']]},
{id:'v4026',w:'turn up',kk:'tɝn ʌp',pos:'v.',zh:'出現・調大',ic:'🔊',u:'s4u3',lure:['turn down','turn on'],
 ex:[['He turned up an hour late.','他遲了一小時才出現。'],
     ['Only half the guests turned up for the workshop.','工作坊只來了一半的來賓。']]},
{id:'v4027',w:'hand out',kk:'hænd aʊt',pos:'v.',zh:'發放',ic:'📤',u:'s4u3',lure:['hand in','hand over'],
 ex:[['They handed out free samples.','他們發送免費樣品。'],
     ['Agendas will be handed out at the door.','議程會在門口發放。']]},
{id:'v4028',w:'hand over',kk:'hænd ˈovɚ',pos:'v.',zh:'移交',ic:'🤲',u:'s4u3',lure:['hand out','hand in'],
 ex:[['He handed over the keys and left.','他把鑰匙交出去就走了。'],
     ['Please hand over the files to the new coordinator.','請把檔案移交給新的協調專員。']]},
{id:'v4029',w:'look into',kk:'lʊk ˈɪntu',pos:'v.',zh:'調查・研究',ic:'🔍',u:'s4u3',lure:['look after','look for'],
 ex:[['I will look into the problem.','我會查一下這個問題。'],
     ['Our team is looking into the billing error.','我們團隊正在調查那筆帳單錯誤。']]},
{id:'v4030',w:'look after',kk:'lʊk ˈæftɚ',pos:'v.',zh:'照顧・負責照料',ic:'👶',u:'s4u3',lure:['look into','look for'],
 ex:[['Can you look after my bag for a minute?','可以幫我看一下包包嗎？'],
     ['Ms. Rossi looks after the northern accounts.','Rossi 小姐負責北部的客戶。']]},
{id:'v4031',w:'carry out',kk:'ˈkærɪ aʊt',pos:'v.',zh:'執行',ic:'🛠️',u:'s4u3',lure:['carry on','set up'],
 ex:[['They carried out the plan perfectly.','他們把計畫執行得很完美。'],
     ['Safety checks are carried out every quarter.','安全檢查每季執行一次。']]},
{id:'v4032',w:'carry on',kk:'ˈkærɪ ɑn',pos:'v.',zh:'繼續進行',ic:'▶️',u:'s4u3',lure:['carry out','go through'],
 ex:[['Please carry on — I am listening.','請繼續，我在聽。'],
     ['The team carried on without the manager.','經理不在，團隊仍繼續進行。']]},
{id:'v4033',w:'take over',kk:'tek ˈovɚ',pos:'v.',zh:'接手・接管',ic:'🔁',u:'s4u3',lure:['take off','hand over'],
 ex:[['Can you take over for a minute?','你可以接手一下嗎？'],
     ['Ms. Chen will take over the account next month.','陳小姐下個月會接手這個客戶。']]},
{id:'v4034',w:'take off',kk:'tek ɔf',pos:'v.',zh:'起飛・脫下',ic:'🛫',u:'s4u3',lure:['take over','put on'],
 ex:[['The plane took off on time.','飛機準時起飛了。'],
     ['Please take off your badge before you leave.','離開前請把識別證取下。']]},
{id:'v4035',w:'go over',kk:'go ˈovɚ',pos:'v.',zh:'檢視・複習',ic:'👀',u:'s4u3',lure:['go through','look into'],
 ex:[['Let us go over the notes once more.','我們再把筆記看一遍。'],
     ['We went over the budget line by line.','我們逐項檢視了預算。']]},
{id:'v4036',w:'go through',kk:'go θru',pos:'v.',zh:'經歷・仔細審閱',ic:'📖',u:'s4u3',lure:['go over','carry on'],
 ex:[['We went through a difficult year.','我們度過了辛苦的一年。'],
     ['All bags must go through the X-ray machine.','所有行李都必須通過 X 光機。']]},

/* ===================== U49 易混淆字組 =====================
   一律成對收，兩個字互相當 lure —— 這一關的鑑別度全靠這個。
   raise（s1u6）與 successful（s1u15）前面已經教過，不重收，只當誘答。 */
{id:'v4037',w:'affect',kk:'əˈfɛkt',pos:'v.',zh:'影響（動詞）',ic:'➡️',u:'s4u4',lure:['effect','accept'],
 ex:[['The rain affected our plans.','下雨影響了我們的計畫。'],
     ['The delay affected every department.','那次延誤影響了每一個部門。']]},
{id:'v4038',w:'effect',kk:'ɪˈfɛkt',pos:'n.',zh:'影響・效果（名詞）',ic:'⭐',u:'s4u4',lure:['affect','result'],
 ex:[['The medicine had no effect.','那個藥沒有效果。'],
     ['The new policy takes effect on June 1.','新政策六月一日生效。']]},
{id:'v4039',w:'rise',kk:'raɪz',pos:'v./n.',zh:'上升（自己升，後面不接受詞）',ic:'📈',u:'s4u4',lure:['raise','arrive'],forms:{p:'rose',d:'risen'},
 ex:[['The sun rises at six.','太陽六點升起。'],
     ['Costs rose sharply last quarter.','上一季成本大幅上升。']]},
{id:'v4040',w:'lie',kk:'laɪ',pos:'v.',zh:'躺・位於（後面不接受詞）',ic:'🛏️',u:'s4u4',lure:['lay','line'],forms:{p:'lay',d:'lain'},
 ex:[['I want to lie down for a while.','我想躺一下。'],
     ['The warehouse lies just north of the plant.','倉庫就位在廠區北邊。']]},
{id:'v4041',w:'lay',kk:'le',pos:'v.',zh:'放置（後面要接受詞）',ic:'📥',u:'s4u4',lure:['lie','pay'],forms:{p:'laid',d:'laid'},
 ex:[['Lay the book on the table.','把書放在桌上。'],
     ['Please lay the samples out on the counter.','請把樣品攤在檯面上。']]},
{id:'v4042',w:'economic',kk:'ˌikəˈnɑmɪk',pos:'adj.',zh:'經濟的（跟經濟有關）',ic:'🏦',u:'s4u4',lure:['economical','economy'],
 ex:[['Economic news moves the market.','經濟新聞會牽動市場。'],
     ['The report reviews economic trends in the region.','這份報告檢視該地區的經濟趨勢。']]},
{id:'v4043',w:'economical',kk:'ˌikəˈnɑmɪkl',pos:'adj.',zh:'省錢的・划算的',ic:'🪙',u:'s4u4',lure:['economic','economy'],
 ex:[['This car is very economical.','這台車很省油。'],
     ['Shipping by sea is more economical but slower.','海運比較省錢，但速度較慢。']]},
{id:'v4044',w:'economy',kk:'ɪˈkɑnəmɪ',pos:'n.',zh:'經濟（名詞）',ic:'🌐',u:'s4u4',lure:['economic','economical'],
 ex:[['The economy is growing slowly.','經濟正在緩慢成長。'],
     ['A weak economy affected sales in every region.','經濟疲弱影響了各區的業績。']]},
{id:'v4045',w:'considerable',kk:'kənˈsɪdərəbl',pos:'adj.',zh:'相當大的',ic:'📊',u:'s4u4',lure:['considerate','consider'],
 ex:[['It took a considerable amount of time.','那花了相當多的時間。'],
     ['The merger brought considerable savings.','合併帶來了相當可觀的成本節省。']]},
{id:'v4046',w:'considerate',kk:'kənˈsɪdərɪt',pos:'adj.',zh:'體貼的',ic:'💗',u:'s4u4',lure:['considerable','consider'],
 ex:[['She is always considerate of others.','她總是很為別人著想。'],
     ['It was considerate of you to send the notice early.','你提早寄通知真是體貼。']]},
{id:'v4047',w:'successive',kk:'səkˈsɛsɪv',pos:'adj.',zh:'連續的',ic:'🔢',u:'s4u4',lure:['successful','succeed'],
 ex:[['It rained for three successive days.','連續下了三天雨。'],
     ['Sales grew for five successive quarters.','業績連續五季成長。']]},
{id:'v4048',w:'complement',kk:'ˈkɑmpləmənt',pos:'v./n.',zh:'補足・互補',ic:'🧩',u:'s4u4',lure:['compliment','complete'],
 ex:[['The scarf complements her coat.','那條圍巾和她的外套很搭。'],
     ['The two departments complement each other well.','這兩個部門互補得很好。']]},
{id:'v4049',w:'compliment',kk:'ˈkɑmpləmənt',pos:'n./v.',zh:'稱讚',ic:'👏',u:'s4u4',lure:['complement','complete'],
 ex:[['She paid me a nice compliment.','她稱讚了我一句。'],
     ['The chef received compliments from every table.','主廚收到每一桌的讚美。']]},

/* ===================== U53 同義改寫 ===================== */
{id:'v4050',w:'imply',kk:'ɪmˈplaɪ',pos:'v.',zh:'暗示・意味著',ic:'💡',u:'s4u8',lure:['apply','reply'],
 ex:[['His tone implied he disagreed.','他的語氣暗示他不同意。'],
     ['The memo implies that the deadline may move.','那份備忘錄暗示期限可能會變動。']]},
{id:'v4051',w:'state',kk:'stet',pos:'v.',zh:'陳述・明確表示',ic:'🗣️',u:'s4u8',lure:['stay','store'],
 ex:[['Please state your name clearly.','請清楚說出你的名字。'],
     ['The contract states that payment is due in thirty days.','合約載明款項應於三十天內支付。']]},
{id:'v4052',w:'summarize',kk:'ˈsʌməˌraɪz',pos:'v.',zh:'摘要・總結',ic:'📋',u:'s4u8',lure:['summary','similar'],
 ex:[['Can you summarize the story?','你可以把故事講個大概嗎？'],
     ['Please summarize the findings in one page.','請把調查結果摘要成一頁。']]},
{id:'v4053',w:'restate',kk:'riˈstet',pos:'v.',zh:'重新表述',ic:'🔄',u:'s4u8',lure:['state','repeat'],
 ex:[['Let me restate the question.','讓我把問題換個說法。'],
     ['The lawyer restated the terms in plain language.','律師用白話重新說明了條款。']]},
{id:'v4054',w:'equivalent',kk:'ɪˈkwɪvələnt',pos:'adj./n.',zh:'相等的・同等物',ic:'🟰',u:'s4u8',lure:['equipment','similar'],
 ex:[['Ten kilometers is equivalent to about six miles.','十公里大約等於六英里。'],
     ['The two offers are financially equivalent.','這兩個方案在財務上是相等的。']]},
{id:'v4055',w:'refer',kk:'rɪˈfɝ',pos:'v.',zh:'指的是・提及',ic:'📌',u:'s4u8',lure:['offer','prefer'],
 col:[['refer to a document','參照文件']],
 ex:[['What does this word refer to?','這個字指的是什麼？'],
     ['The notice refers to the policy announced in May.','這則公告指的是五月發布的政策。']]},
{id:'v4056',w:'paraphrase',kk:'ˈpærəˌfrez',pos:'v./n.',zh:'換句話說',ic:'🔤',u:'s4u8',lure:['phrase','summarize'],
 ex:[['Try to paraphrase it in your own words.','試著用自己的話換句話說。'],
     ['The answer choices paraphrase the passage instead of copying it.','選項是把文章換句話說，而不是照抄。']]},
{id:'v4057',w:'accurate',kk:'ˈækjərɪt',pos:'adj.',zh:'準確的',ic:'🎯',u:'s4u8',lure:['exact','adequate'],
 ex:[['Her guess was surprisingly accurate.','她猜得出奇準確。'],
     ['Please make sure the figures are accurate before sending.','寄出前請確認數字正確。']]},
{id:'v4058',w:'specify',kk:'ˈspɛsəˌfaɪ',pos:'v.',zh:'明確指出',ic:'📝',u:'s4u8',lure:['specific','simplify'],
 ex:[['Please specify the size you want.','請明確說出你要的尺寸。'],
     ['The order did not specify a delivery date.','那張訂單沒有註明送達日期。']]},
{id:'v4059',w:'outline',kk:'ˈaʊtˌlaɪn',pos:'v./n.',zh:'概述・大綱',ic:'🗒️',u:'s4u8',lure:['outcome','online'],
 ex:[['She outlined her plan in three minutes.','她三分鐘就把計畫講完了大綱。'],
     ['The email outlines the steps for claiming expenses.','那封信概述了申請費用的步驟。']]}

];
