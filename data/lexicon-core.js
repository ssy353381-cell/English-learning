/* ==========================================================================
   lexicon-core.js — 詞庫手寫層

   自動層（lexicon-1..6.js）的中文詞義是照詞頻排的，而多益考的常常不是最常
   用的那個意思：address 的第一個意思是「地址」，但多益整天在考「演說」和
   「處理」；warranty 排最前面的是「正當理由」，考題只考「保固」。
   這一層就是為了蓋掉那些字 —— 引擎查到同一個字時，手寫層永遠贏過自動層。

   除了改對詞義，這裡還多寫了自動層生不出來的兩樣東西：
     note  「延伸用法」：這個字在多益裡的陷阱是什麼
     ex    中英對照的雙例句（日常一句、職場一句，和 vocab 一致）

   欄位：
     w 英文 / kk 音標 / pos 詞性 / zh 中文 / lv 級數 1–6 / tags 標籤
     note 延伸用法（繁中散文）/ col 常見搭配 / fam 同家族 / forms 不規則變化
     ex[0] 日常例句　ex[1] 職場例句

   如果這個字課程已經教過（address、order、last…），詞義與例句一律以
   data/vocab-*.js 為準，這裡只有 note 與 fam 會被採用 —— 那兩欄是純顯示的。
   col 刻意不合併：collocate 題型直接把 vocab 的 col 當題庫抽，
   從這裡塞進去等於繞過 CLAUDE.md 對搭配詞的那一串限制。
   ========================================================================== */
window.DATA_LEXICON_CORE = [

/* ===================== 一字多義：多益最愛考的陷阱 ===================== */
{w:'address',kk:'əˈdrɛs',pos:'n./v.',zh:'地址・演說・處理・稱呼',lv:2,tags:['biz'],
 note:'「地址」是最常見的意思，卻是多益最少考的那個。考題裡 address 幾乎都是動詞「處理（問題）」或名詞「演說」——看到 address the issue 不要翻成「問題的地址」。',
 col:[['address an issue','處理問題'],['keynote address','主題演說']],
 ex:[['Please write your address here.','請在這裡寫下你的地址。'],
     ['The manager will address the delay at the meeting.','經理會在會議上處理延遲的問題。']]},

{w:'board',kk:'bɔrd',pos:'n./v.',zh:'董事會・板子・登機・上車',lv:2,tags:['biz'],
 note:'三個意思在多益都會出現：the board（董事會）、on board（在機上／加入團隊）、board the flight（登機）。聽力 Part 2 問 “When does the flight board?” 問的是登機時間，不是木板。',
 col:[['board of directors','董事會'],['board a flight','登機'],['on board','在機上・加入']],
 ex:[['We board the plane at gate 12.','我們在十二號登機門登機。'],
     ['The board approved the new budget.','董事會核准了新預算。']]},

{w:'charge',kk:'tʃɑrdʒ',pos:'n./v.',zh:'收費・費用・負責・充電',lv:2,tags:['biz'],
 note:'in charge of 是「負責」，free of charge 是「免費」，兩個都常考而且都不是「充電」。注意 in charge of（負責）和 in the charge of（被…負責）差一個 the，意思相反。',
 col:[['in charge of','負責'],['free of charge','免費'],['extra charge','額外費用']],
 ex:[['My phone is charging.','我的手機在充電。'],
     ['Who is in charge of the project?','誰負責這個專案？']]},

{w:'cover',kk:'ˈkʌvɚ',pos:'v./n.',zh:'涵蓋・代班・報導・封面',lv:2,tags:['biz'],
 note:'職場上最常用的是「代班」：Can you cover for me on Friday? 另外保險的「理賠範圍」也用 cover——The warranty covers parts only。',
 col:[['cover for someone','幫某人代班'],['cover letter','求職信']],
 ex:[['The book has a red cover.','這本書的封面是紅色的。'],
     ['Can you cover my shift on Friday?','星期五可以幫我代班嗎？']]},

{w:'fine',kk:'faɪn',pos:'adj./n./v.',zh:'好的・罰款・處以罰款',lv:2,tags:['biz'],
 note:'“I am fine” 的 fine 和 “a parking fine”（停車罰單）是同一個字。多益閱讀常在公告裡用名詞的罰款義：Late returns are subject to a fine。',
 col:[['pay a fine','繳罰款'],['parking fine','停車罰單']],
 ex:[['The weather is fine today.','今天天氣很好。'],
     ['Late payments are subject to a fine.','逾期付款會被罰款。']]},

{w:'issue',kk:'ˈɪʃju',pos:'n./v.',zh:'問題・發行・核發・期號',lv:2,tags:['biz'],
 note:'名詞是「問題」或雜誌的「期」，動詞是「核發」——issue a refund（退款）、issue an invoice（開發票）。Part 5 很愛用 issue 當動詞考時態。',
 col:[['issue a refund','辦理退款'],['technical issue','技術問題'],['latest issue','最新一期']],
 ex:[['There is an issue with my order.','我的訂單有問題。'],
     ['The bank will issue a new card next week.','銀行下週會核發新卡。']]},

{w:'last',kk:'læst',pos:'adj./adv./v.',zh:'最後的・上一個・持續',lv:1,tags:[],
 note:'動詞的「持續」最容易漏掉：The meeting lasted two hours（會議持續了兩小時）。看到 last 後面接時間長度，就是持續而不是「最後」。',
 col:[['last long','持續很久'],['at last','終於']],
 ex:[['This is the last one.','這是最後一個。'],
     ['The training session lasts three hours.','這場訓練持續三小時。']]},

{w:'matter',kk:'ˈmætɚ',pos:'n./v.',zh:'事情・要緊・關係',lv:2,tags:[],
 note:'動詞 matter 是「要緊」，常見於 It doesn’t matter（沒關係）。名詞在商務信裡是「事項」：I am writing regarding this matter。',
 col:[['no matter','無論'],['a matter of time','時間問題']],
 ex:[['It doesn\'t matter.','沒關係。'],
     ['I will look into the matter today.','我今天會查一下這件事。']]},

{w:'order',kk:'ˈɔrdɚ',pos:'n./v.',zh:'訂單・順序・命令・訂購',lv:1,tags:['biz'],
 note:'多益的 order 九成是「訂單／訂購」。片語要一起記：in order to（為了）、out of order（故障）——後者常出現在 Part 1 的公告牌上。',
 col:[['place an order','下訂單'],['out of order','故障'],['in order to','為了']],
 ex:[['I would like to order a coffee.','我想點一杯咖啡。'],
     ['Your order will arrive within three days.','您的訂單三天內會送達。']]},

{w:'party',kk:'ˈpɑrtɪ',pos:'n.',zh:'派對・一方・當事人・一行人',lv:2,tags:['biz'],
 note:'合約裡的 both parties 是「雙方當事人」，餐廳的 a party of four 是「四位客人」。多益從來不考生日派對。',
 col:[['third party','第三方'],['a party of four','四人一行']],
 ex:[['We are having a party on Saturday.','我們星期六要辦派對。'],
     ['Both parties signed the agreement.','雙方都簽了協議。']]},

{w:'plant',kk:'plænt',pos:'n./v.',zh:'植物・工廠・種植',lv:2,tags:['biz'],
 note:'製造業的 plant 是「廠房」，和 factory 同義。Part 1 的照片描述常說 workers at the plant。',
 col:[['manufacturing plant','製造廠'],['power plant','發電廠']],
 ex:[['She waters the plants every morning.','她每天早上澆花。'],
     ['The new plant opens in March.','新廠三月啟用。']]},

{w:'post',kk:'post',pos:'n./v.',zh:'職位・郵寄・張貼・貼文',lv:2,tags:['biz'],
 note:'徵才啟事裡的 post 是「職缺」（＝position），公布欄上的 post 是「張貼」。英式英文還用來指「郵寄」。',
 col:[['post a notice','張貼公告'],['apply for the post','應徵這個職位']],
 ex:[['I will post the photos tonight.','我今晚會把照片貼上去。'],
     ['She applied for the post of sales manager.','她應徵了業務經理的職位。']]},

{w:'present',kk:'ˈprɛznt',pos:'adj./n./v.',zh:'出席的・目前的・禮物・提出',lv:2,tags:['biz'],
 note:'重音不同意思也不同：名詞「禮物」唸 PRE-sent，動詞「提出／簡報」唸 pre-SENT。會議紀錄裡的 those present 是「出席者」。',
 col:[['present a report','提出報告'],['at present','目前']],
 ex:[['I bought a present for my sister.','我買了禮物給我妹妹。'],
     ['She will present the results on Monday.','她星期一會報告結果。']]},

{w:'raise',kk:'rez',pos:'v./n.',zh:'提高・舉起・加薪・募集',lv:2,tags:['biz'],
 note:'美式英文的名詞 a raise 就是「加薪」（英式用 a rise）。另外 raise 一定要接受詞，rise 不能——這一組是 Part 5 的常客。',
 col:[['ask for a raise','要求加薪'],['raise funds','募款']],
 forms:{p:'raised',d:'raised',i:'raising','3':'raises'},
 ex:[['Please raise your hand.','請舉手。'],
     ['He got a raise after two years.','他兩年後加薪了。']]},

{w:'run',kk:'rʌn',pos:'v./n.',zh:'跑・經營・運作・持續播出',lv:1,tags:['biz'],
 note:'多益的 run 大多是「經營」或「運轉」：She runs a small shop、The machine is running。run out of 是「用完」，也很常考。',
 col:[['run a business','經營生意'],['run out of','用完']],
 forms:{p:'ran',d:'run',i:'running','3':'runs'},
 ex:[['I run every morning.','我每天早上跑步。'],
     ['We have run out of printer paper.','影印紙用完了。']]},

{w:'second',kk:'ˈsɛkənd',pos:'num./n./v.',zh:'第二・秒・附議',lv:2,tags:['biz'],
 note:'會議英文裡 I second that 是「我附議」，動詞用法在多益的會議情境偶爾出現，看到會愣住的人很多。',
 ex:[['Wait a second, please.','請等一下。'],
     ['I second the motion.','我附議這項提案。']]},

{w:'settle',kk:'ˈsɛtl',pos:'v.',zh:'解決・結清・安頓',lv:3,tags:['biz'],
 note:'settle an account 是「結清帳款」，settle a dispute 是「解決爭議」。和 settle down（安頓下來）意思差很多。',
 col:[['settle an account','結清帳款'],['settle a dispute','解決爭議']],
 ex:[['They settled in a small town.','他們在小鎮定居。'],
     ['Please settle the invoice by Friday.','請在星期五前付清這張帳單。']]},

{w:'stand',kk:'stænd',pos:'v./n.',zh:'站・忍受・攤位・立場',lv:2,tags:['biz'],
 note:'展覽情境的 stand 是「攤位」（＝booth），口語的 can\'t stand 是「受不了」。Part 1 的照片也常出現 a stand of books。',
 col:[['can\'t stand','受不了'],['exhibition stand','展覽攤位']],
 forms:{p:'stood',d:'stood',i:'standing','3':'stands'},
 ex:[['Please stand over there.','請站在那邊。'],
     ['Our stand is next to the entrance.','我們的攤位在入口旁邊。']]},

{w:'subject',kk:'ˈsʌbdʒɪkt',pos:'n./adj./v.',zh:'主題・科目・受制於',lv:3,tags:['biz'],
 note:'be subject to 是多益公告題的固定句型：「須視…而定／可能會被…」。Prices are subject to change without notice 幾乎每回都出現一次。',
 col:[['subject to change','可能變動'],['subject line','信件主旨']],
 ex:[['Math is my favorite subject.','數學是我最喜歡的科目。'],
     ['All prices are subject to change without notice.','所有價格可能隨時變動，恕不另行通知。']]},

{w:'suit',kk:'sut',pos:'n./v.',zh:'西裝・訴訟・適合',lv:2,tags:['biz'],
 note:'動詞的「適合」在多益比名詞常見：Does Tuesday suit you?（星期二方便嗎？）別和 suite（套房、套裝軟體）搞混，兩個字唸法完全不同。',
 col:[['suit your needs','符合你的需求']],
 ex:[['He wore a black suit.','他穿了一套黑色西裝。'],
     ['Would Tuesday afternoon suit you?','星期二下午方便嗎？']]},

{w:'table',kk:'ˈtebl',pos:'n./v.',zh:'桌子・表格・擱置',lv:1,tags:['biz'],
 note:'閱讀題的 the table below 指的是「下表」而不是桌子。動詞 table a proposal 在美式英文是「擱置提案」，在英式反而是「提出」——多益考的是美式。',
 col:[['see the table below','見下表']],
 ex:[['Put the box on the table.','把箱子放在桌上。'],
     ['The figures are shown in the table below.','數字列在下表中。']]},

{w:'term',kk:'tɝm',pos:'n.',zh:'條款・期間・術語・學期',lv:3,tags:['biz'],
 note:'合約的 terms and conditions 是「條款」，financial terms 是「付款條件」。長期短期用 long-term／short-term，作形容詞時要加連字號。',
 col:[['terms and conditions','條款與細則'],['long-term','長期的']],
 ex:[['The spring term starts in March.','春季學期三月開始。'],
     ['Please read the terms before signing.','簽名前請詳閱條款。']]},

{w:'tip',kk:'tɪp',pos:'n./v.',zh:'小費・訣竅・尖端・傾斜',lv:2,tags:['biz'],
 note:'旅遊情境是「小費」，文章標題常用「訣竅」：Five tips for a better presentation。兩個都考。',
 col:[['leave a tip','給小費'],['useful tips','實用訣竅']],
 ex:[['I left a tip for the waiter.','我留了小費給服務生。'],
     ['Here are five tips for writing better emails.','這裡有五個寫好email的訣竅。']]},

{w:'yield',kk:'jild',pos:'v./n.',zh:'產生・讓步・收益',lv:4,tags:['biz'],
 note:'財經文章的 yield 是「收益率」，交通標誌的 yield 是「讓路」。動詞「產生」常和 results、profits 搭配。',
 col:[['yield results','產生成果'],['high yield','高收益']],
 ex:[['You must yield to traffic on the main road.','你必須禮讓主幹道的車。'],
     ['The new strategy yielded strong results.','新策略帶來了亮眼的成果。']]},

/* ===================== 單據與金流 ===================== */
{w:'invoice',kk:'ˈɪnvɔɪs',pos:'n./v.',zh:'發票・請款單・開立請款單',lv:3,tags:['biz'],
 note:'invoice 是「請款用的單據」，receipt 是「付完錢的收據」——中文都可能講成「發票」，多益就靠這個分。看到 settle / pay an invoice 就是還沒付錢。',
 col:[['issue an invoice','開立請款單'],['pay an invoice','支付帳款']],
 fam:['invoicing'],
 ex:[['I keep every invoice in this folder.','我把每張請款單都放在這個資料夾。'],
     ['Please send the invoice to our accounting department.','請把請款單寄給我們會計部。']]},

{w:'receipt',kk:'rɪˈsit',pos:'n.',zh:'收據・收到',lv:3,tags:['biz'],
 note:'p 不發音。除了「收據」，商務信常用 upon receipt of（一收到…就…），這個用法在 Part 7 常出現。',
 col:[['keep the receipt','保留收據'],['upon receipt','一收到']],
 ex:[['Can I have a receipt, please?','可以給我收據嗎？'],
     ['We will ship the goods upon receipt of payment.','一收到款項我們就會出貨。']]},

{w:'refund',kk:'ˈrifʌnd',pos:'n./v.',zh:'退款・退還',lv:3,tags:['biz'],
 note:'退貨政策題的關鍵字。full refund（全額退款）、store credit（商店購物金）常一起出現當誘答——只有前者拿得回現金。',
 col:[['full refund','全額退款'],['request a refund','要求退款']],
 fam:['refundable'],
 ex:[['I would like a refund for this shirt.','這件襯衫我想退款。'],
     ['Refunds are available within thirty days of purchase.','購買後三十天內可辦理退款。']]},

{w:'warranty',kk:'ˈwɔrəntɪ',pos:'n.',zh:'保固・保固書',lv:4,tags:['biz'],
 note:'多益只考「保固」這個意思。under warranty 是「在保固期內」，考題最愛問哪些東西 covered by the warranty。',
 col:[['under warranty','保固期內'],['extend the warranty','延長保固']],
 ex:[['The laptop still has a warranty.','這台筆電還在保固期內。'],
     ['The warranty covers parts but not labor.','保固涵蓋零件但不含工資。']]},

{w:'voucher',kk:'ˈvaʊtʃɚ',pos:'n.',zh:'兌換券・折價券・憑證',lv:4,tags:['biz'],
 note:'多益的 voucher 是「兌換券」，不是字典排第一的「保證人」。和 coupon 幾乎同義，飯店情境常用 meal voucher（餐券）。',
 col:[['gift voucher','禮券'],['meal voucher','餐券']],
 ex:[['I have a voucher for a free coffee.','我有一張免費咖啡兌換券。'],
     ['Each attendee will receive a meal voucher.','每位與會者都會拿到一張餐券。']]},

{w:'reimburse',kk:'ˌriɪmˈbɝs',pos:'v.',zh:'報銷・償還',lv:4,tags:['biz'],
 note:'出差費用的固定用字：reimburse someone for something。名詞 reimbursement 在報帳表單上一定看得到。',
 col:[['reimburse expenses','報銷費用']],
 fam:['reimbursement'],
 ex:[['My friend reimbursed me for the tickets.','我朋友把票錢還我了。'],
     ['The company will reimburse you for travel expenses.','公司會幫你報銷差旅費。']]},

{w:'deposit',kk:'dɪˈpɑzɪt',pos:'n./v.',zh:'訂金・存款・存入',lv:3,tags:['biz'],
 note:'租屋與訂房情境的關鍵字：security deposit（押金）。動詞是「存錢」，和 withdraw（提款）成對出現。',
 col:[['pay a deposit','付訂金'],['security deposit','押金']],
 ex:[['I deposited the money this morning.','我今天早上把錢存進去了。'],
     ['A deposit of 20% is required to confirm the booking.','需支付兩成訂金才能確認訂位。']]},

{w:'expense',kk:'ɪkˈspɛns',pos:'n.',zh:'費用・開銷',lv:3,tags:['biz'],
 note:'幾乎都用複數 expenses（開銷）。at the expense of 是「以…為代價」，閱讀題會用來考語氣。',
 col:[['travel expenses','差旅費'],['cut expenses','削減開銷']],
 fam:['expensive'],
 ex:[['Living expenses are high in this city.','這座城市的生活開銷很高。'],
     ['Please submit your expenses by the fifth.','請在五號前送出你的費用報表。']]},

{w:'estimate',kk:'ˈɛstəˌmet',pos:'n./v.',zh:'估價單・估計',lv:3,tags:['biz'],
 note:'名詞在維修情境是「估價單」（＝quote）。名詞唸 -mət，動詞唸 -met，重音位置一樣但尾音不同。',
 col:[['a free estimate','免費估價'],['rough estimate','粗估']],
 ex:[['I estimate it will take two hours.','我估計要兩小時。'],
     ['The contractor sent us an estimate for the repairs.','承包商寄來了維修估價單。']]},

{w:'quote',kk:'kwot',pos:'n./v.',zh:'報價・報價單・引述',lv:3,tags:['biz'],
 note:'商務上的 quote 是「報價」，正式寫法是 quotation。閱讀題常見 request a quote（索取報價）。',
 col:[['request a quote','索取報價'],['quote a price','報價']],
 fam:['quotation'],
 ex:[['She quoted a line from the book.','她引用了書裡的一句話。'],
     ['Could you quote us a price for 500 units?','五百件的報價可以給我們嗎？']]},

{w:'budget',kk:'ˈbʌdʒɪt',pos:'n./v.',zh:'預算・編列預算・經濟實惠的',lv:3,tags:['biz'],
 note:'當形容詞是「平價的」：a budget hotel（平價旅館）。over budget（超出預算）在專案情境常考。',
 col:[['within budget','預算內'],['budget cut','預算刪減']],
 ex:[['We stayed at a budget hotel.','我們住了一間平價旅館。'],
     ['The project came in under budget.','這個專案沒有超出預算。']]},

/* ===================== 人事與職場 ===================== */
{w:'applicant',kk:'ˈæpləkənt',pos:'n.',zh:'應徵者・申請人',lv:3,tags:['biz'],
 note:'徵才題的三個角色要分清楚：applicant（應徵者）、candidate（候選人，已進入評選）、employer（雇主）。',
 fam:['application','apply'],
 ex:[['Every applicant must fill in this form.','每位申請人都要填這份表格。'],
     ['We received over fifty applicants for the position.','這個職缺我們收到超過五十位應徵者。']]},

{w:'colleague',kk:'ˈkɑlig',pos:'n.',zh:'同事',lv:2,tags:['biz'],
 note:'gue 不發音。比 co-worker 正式，多益書信裡幾乎只用 colleague。',
 ex:[['I had lunch with a colleague.','我和同事吃了午餐。'],
     ['Please forward this to your colleagues.','請把這個轉寄給你的同事。']]},

{w:'supervisor',kk:'ˈsupɚˌvaɪzɚ',pos:'n.',zh:'主管・督導',lv:3,tags:['biz'],
 note:'直屬上司用 supervisor 或 manager；boss 太口語，多益書信不會用。',
 fam:['supervise'],
 ex:[['Ask your supervisor before you leave early.','早退前先問你的主管。'],
     ['All requests must be approved by a supervisor.','所有申請都需要主管核准。']]},

{w:'personnel',kk:'ˌpɝsnˈɛl',pos:'n.',zh:'人員・人事部門',lv:4,tags:['biz'],
 note:'集合名詞，沒有複數 s，動詞卻常用複數：All personnel are required to…。和 personal（個人的）只差一個字母，重音也不同，是經典混淆組。',
 col:[['personnel department','人事部門']],
 ex:[['Only authorized personnel may enter.','僅限授權人員進入。'],
     ['Personnel records are kept confidential.','人事紀錄一律保密。']]},

{w:'resume',kk:'ˈrɛzʊˌme',pos:'n./v.',zh:'履歷・恢復・繼續',lv:3,tags:['biz'],
 note:'兩個唸法兩個意思：名詞履歷唸 REZ-oo-may（常寫成 résumé），動詞「恢復」唸 ri-ZOOM。停電後的公告最愛用 Service will resume shortly。',
 col:[['submit a resume','投履歷'],['resume operations','恢復營運']],
 ex:[['I sent my resume yesterday.','我昨天寄了履歷。'],
     ['Normal service will resume at 9 a.m.','正常服務將於早上九點恢復。']]},

{w:'promotion',kk:'prəˈmoʃən',pos:'n.',zh:'升遷・促銷活動',lv:3,tags:['biz'],
 note:'兩個意思在多益都很常見：人事的「升遷」與行銷的「促銷」。看上下文是人還是商品就分得出來。',
 col:[['get a promotion','升職'],['sales promotion','促銷活動']],
 fam:['promote'],
 ex:[['She got a promotion last month.','她上個月升職了。'],
     ['The store is running a summer promotion.','這家店正在做夏季促銷。']]},

{w:'shift',kk:'ʃɪft',pos:'n./v.',zh:'輪班・班次・轉移',lv:3,tags:['biz'],
 note:'工廠與服務業情境的「班」：the night shift（夜班）。動詞是「轉移」，a shift in policy（政策轉向）。',
 col:[['night shift','夜班'],['cover a shift','代班']],
 ex:[['My shift ends at six.','我的班六點結束。'],
     ['There has been a shift in customer demand.','客戶需求出現了轉變。']]},

{w:'vacancy',kk:'ˈvekənsɪ',pos:'n.',zh:'職缺・空房',lv:4,tags:['biz'],
 note:'飯店的 No Vacancy 是「客滿」，徵才的 vacancy 是「職缺」。兩個情境多益都考。',
 col:[['fill a vacancy','補上職缺'],['no vacancy','客滿']],
 fam:['vacant'],
 ex:[['The hotel has no vacancies tonight.','飯店今晚客滿。'],
     ['There is a vacancy in the marketing team.','行銷團隊有一個職缺。']]},

{w:'attendance',kk:'əˈtɛndəns',pos:'n.',zh:'出席・出席率',lv:4,tags:['biz'],
 note:'attend（出席）不需要介系詞：attend the meeting，不是 attend to the meeting。attend to 是「處理」，意思完全不同。',
 col:[['take attendance','點名'],['in attendance','出席']],
 fam:['attend','attendee'],
 ex:[['Attendance is required for all staff.','全體員工都必須出席。'],
     ['Attendance at the workshop was higher than expected.','工作坊的出席人數比預期高。']]},

/* ===================== 會議與行程 ===================== */
{w:'agenda',kk:'əˈdʒɛndə',pos:'n.',zh:'議程・議題',lv:3,tags:['biz'],
 note:'on the agenda 是「列在議程上」。原本是複數形（單數 agendum），但現代英文一律當單數用。',
 col:[['on the agenda','列入議程'],['meeting agenda','會議議程']],
 ex:[['What is on the agenda for today?','今天的議程有什麼？'],
     ['Please review the agenda before the meeting.','開會前請先看過議程。']]},

{w:'itinerary',kk:'aɪˈtɪnəˌrɛrɪ',pos:'n.',zh:'行程表・旅行計畫',lv:5,tags:['biz'],
 note:'出差情境的固定字。多益 Part 7 常給一張 itinerary 再問「幾點在哪」，是圖表題的常客。',
 col:[['travel itinerary','旅行行程表']],
 ex:[['I printed out our itinerary.','我把我們的行程表印出來了。'],
     ['Your itinerary has been updated with the new flight.','您的行程表已更新為新的航班。']]},

{w:'tentative',kk:'ˈtɛntətɪv',pos:'adj.',zh:'暫定的・試探性的',lv:5,tags:['biz'],
 note:'a tentative date 是「暫定日期」，等於還沒確定（＝not confirmed）。多益很愛拿它和 confirmed 做對比。',
 col:[['tentative schedule','暫定行程']],
 fam:['tentatively'],
 ex:[['We made a tentative plan for Sunday.','我們對星期天做了暫定的安排。'],
     ['The meeting is tentatively scheduled for Thursday.','會議暫定在星期四。']]},

{w:'postpone',kk:'postˈpon',pos:'v.',zh:'延期・延後',lv:3,tags:['biz'],
 note:'後面接動名詞：postpone meeting → postpone meeting the client。同義字 put off、delay、reschedule 常互為誘答。',
 col:[['postpone a meeting','延後會議']],
 ex:[['We postponed the trip until spring.','我們把旅行延到春天。'],
     ['The launch has been postponed until further notice.','發表會延期，時間另行通知。']]},

{w:'reschedule',kk:'riˈskɛdʒul',pos:'v.',zh:'重新安排時間',lv:3,tags:['biz'],
 note:'比 postpone 更精確：postpone 只是往後延，reschedule 是「改到另一個時間」，可能提前。Part 2 的常見回應。',
 ex:[['Can we reschedule dinner?','晚餐可以改時間嗎？'],
     ['I need to reschedule our call to Friday.','我需要把我們的通話改到星期五。']]},

{w:'venue',kk:'ˈvɛnju',pos:'n.',zh:'場地・會場',lv:4,tags:['biz'],
 note:'活動辦在哪裡就是 venue。多益的活動通知常寫 The venue has been changed to…，是換場地題的關鍵字。',
 col:[['change the venue','更換場地']],
 ex:[['The venue is close to the station.','會場離車站很近。'],
     ['We are looking for a larger venue for the conference.','我們正在找更大的研討會場地。']]},

{w:'attendee',kk:'əˌtɛnˈdi',pos:'n.',zh:'與會者・出席者',lv:4,tags:['biz'],
 note:'-ee 結尾表示「被動的那一方」：employee（受僱者）、interviewee（受訪者）、trainee（受訓者）。這個字尾是 Part 5 詞性題的送分點。',
 fam:['attend','attendance'],
 ex:[['Every attendee gets a name tag.','每位與會者都會拿到名牌。'],
     ['Attendees should register at the front desk.','與會者請至櫃檯報到。']]},

/* ===================== 物流與設備 ===================== */
{w:'shipment',kk:'ˈʃɪpmənt',pos:'n.',zh:'貨運・出貨・整批貨',lv:4,tags:['biz'],
 note:'ship 當動詞是「運送」，不限船運——空運陸運都能說 ship。shipment 是「那一批貨」或「出貨這件事」。',
 col:[['delayed shipment','延遲出貨'],['track a shipment','追蹤貨件']],
 fam:['shipping','ship'],
 ex:[['The shipment arrived this morning.','那批貨今天早上到了。'],
     ['Your shipment has been delayed by two days.','您的貨件延遲了兩天。']]},

{w:'inventory',kk:'ˈɪnvənˌtorɪ',pos:'n.',zh:'庫存・存貨清單',lv:4,tags:['biz'],
 note:'take inventory 是「盤點」。零售情境常見 out of stock（缺貨）與 low inventory（庫存不足）互相改寫。',
 col:[['take inventory','盤點庫存'],['inventory system','庫存系統']],
 ex:[['We take inventory every Sunday.','我們每個星期天盤點。'],
     ['The item is currently out of our inventory.','這個品項目前沒有庫存。']]},

{w:'warehouse',kk:'ˈwɛrˌhaʊs',pos:'n.',zh:'倉庫',lv:4,tags:['biz'],
 note:'Part 1 照片題的高頻場景字，常和 forklift（堆高機）、pallet（棧板）、loading dock（裝卸區）一起出現。',
 ex:[['The warehouse is behind the store.','倉庫在店後面。'],
     ['Goods are stored in the warehouse until shipment.','貨物出貨前存放在倉庫。']]},

{w:'maintenance',kk:'ˈmentənəns',pos:'n.',zh:'維修・保養',lv:4,tags:['biz'],
 note:'動詞是 maintain，名詞拼法會掉一個 a（maintainance ❌）。公告題常見 scheduled maintenance（例行維修）。',
 col:[['routine maintenance','例行保養'],['under maintenance','維修中']],
 fam:['maintain'],
 ex:[['The car needs regular maintenance.','這台車需要定期保養。'],
     ['The elevator is closed for maintenance.','電梯因維修暫停使用。']]},

{w:'facility',kk:'fəˈsɪlətɪ',pos:'n.',zh:'設施・場館',lv:4,tags:['biz'],
 note:'複數 facilities 指整套設施（健身房、停車場…）。單數常指單一場館：a manufacturing facility（製造廠）。',
 col:[['sports facilities','運動設施'],['parking facilities','停車設施']],
 ex:[['The hotel has excellent facilities.','這家飯店設施很好。'],
     ['Our new facility opens next quarter.','我們的新廠下一季啟用。']]},

{w:'equipment',kk:'ɪˈkwɪpmənt',pos:'n.',zh:'設備・器材',lv:3,tags:['biz'],
 note:'不可數名詞：沒有 equipments，要數就說 a piece of equipment。這是 Part 5 名詞單複數題的固定考點。',
 col:[['office equipment','辦公設備'],['a piece of equipment','一件設備']],
 ex:[['The gym has new equipment.','健身房有新器材。'],
     ['All safety equipment must be inspected monthly.','所有安全設備都要每月檢查。']]},

/* ===================== 公告與規範 ===================== */
{w:'notify',kk:'ˈnotəˌfaɪ',pos:'v.',zh:'通知・告知',lv:4,tags:['biz'],
 note:'notify somebody of something。比 tell 正式，公告與信件裡幾乎只用它和 inform。',
 col:[['notify in advance','事先通知']],
 fam:['notification'],
 ex:[['Please notify me if you cannot come.','不能來的話請通知我。'],
     ['Employees will be notified of the change by email.','員工會透過電子郵件收到變更通知。']]},

{w:'mandatory',kk:'ˈmændəˌtorɪ',pos:'adj.',zh:'強制的・必須的',lv:5,tags:['biz'],
 note:'和 optional（可選的）成對出現，是公告題最愛的對比。同義字 required、compulsory 常當改寫。',
 col:[['mandatory training','強制訓練']],
 ex:[['Helmets are mandatory on this site.','這個工地強制配戴安全帽。'],
     ['Attendance at the safety briefing is mandatory.','安全簡報必須出席。']]},

{w:'complimentary',kk:'ˌkɑmpləˈmɛntərɪ',pos:'adj.',zh:'免費招待的・讚美的',lv:5,tags:['biz'],
 note:'飯店與航空的「免費贈送」＝free of charge。注意和 complementary（互補的）只差一個字母，多益真的拿這組當誘答。',
 col:[['complimentary breakfast','免費早餐']],
 ex:[['The hotel offers a complimentary breakfast.','飯店提供免費早餐。'],
     ['All guests receive a complimentary drink on arrival.','所有房客抵達時都會獲贈一杯飲料。']]},

{w:'prior',kk:'ˈpraɪɚ',pos:'adj.',zh:'事先的・優先的',lv:4,tags:['biz'],
 note:'prior to 就是 before 的正式說法，後面接名詞或動名詞。公告題常寫 prior notice（事先通知）。',
 col:[['prior to','在…之前'],['prior notice','事先通知']],
 fam:['priority'],
 ex:[['I have a prior engagement.','我有事先約好的行程。'],
     ['Please submit the form prior to the deadline.','請在期限前送出表格。']]},

{w:'temporarily',kk:'ˈtɛmpəˌrɛrəlɪ',pos:'adv.',zh:'暫時地',lv:4,tags:['biz'],
 note:'停業公告的固定字：temporarily closed（暫停營業）。和 permanently（永久地）成對考。',
 fam:['temporary'],
 ex:[['The road is temporarily closed.','這條路暫時封閉。'],
     ['Our office will be temporarily relocated during renovations.','裝修期間我們辦公室會暫時搬遷。']]},

{w:'renovation',kk:'ˌrɛnəˈveʃən',pos:'n.',zh:'翻修・整修',lv:5,tags:['biz'],
 note:'店面或辦公室整修，公告題的常客：closed for renovation。動詞 renovate，形容詞 renovated。',
 col:[['under renovation','整修中']],
 fam:['renovate'],
 ex:[['The kitchen is under renovation.','廚房正在整修。'],
     ['The lobby will reopen after the renovation.','大廳整修後會重新開放。']]},

/* ===================== 高頻動詞 ===================== */
{w:'appreciate',kk:'əˈpriʃɪˌet',pos:'v.',zh:'感謝・欣賞・增值',lv:3,tags:['biz'],
 note:'商務信的客氣說法：I would appreciate it if you could…（若您能…我會很感激）。這裡的 it 不能省略，是常見錯誤。',
 col:[['I would appreciate it if','若您能…我將感激']],
 ex:[['I really appreciate your help.','真的很感謝你的幫忙。'],
     ['We would appreciate a reply by Friday.','若能在星期五前回覆，我們將不勝感激。']]},

{w:'confirm',kk:'kənˈfɝm',pos:'v.',zh:'確認・證實',lv:2,tags:['biz'],
 note:'訂位、訂房、會議都用它。名詞 confirmation（確認函）在 Part 7 常當文件標題。',
 col:[['confirm a reservation','確認訂位']],
 fam:['confirmation'],
 ex:[['Can you confirm the time?','你可以確認一下時間嗎？'],
     ['Please confirm your attendance by Friday.','請在星期五前確認出席。']]},

{w:'submit',kk:'səbˈmɪt',pos:'v.',zh:'繳交・提交',lv:3,tags:['biz'],
 note:'submit 後面直接接文件，不加 to 給文件：submit the report to your manager。名詞是 submission。',
 col:[['submit an application','提交申請']],
 fam:['submission'],
 forms:{p:'submitted',d:'submitted',i:'submitting','3':'submits'},
 ex:[['I submitted my homework late.','我作業遲交了。'],
     ['All forms must be submitted by the end of the month.','所有表格必須在月底前繳交。']]},

{w:'purchase',kk:'ˈpɝtʃəs',pos:'v./n.',zh:'購買・採購',lv:3,tags:['biz'],
 note:'比 buy 正式，多益書面文件一律用 purchase。收據上的 date of purchase（購買日期）是退換貨題的關鍵。',
 col:[['proof of purchase','購買證明'],['purchase order','採購單']],
 ex:[['I purchased this online.','我在網路上買的。'],
     ['Keep your proof of purchase for the warranty.','請保留購買證明以便申請保固。']]},

{w:'confirmation',kk:'ˌkɑnfɚˈmeʃən',pos:'n.',zh:'確認・確認函',lv:3,tags:['biz'],
 note:'訂房訂票後收到的 confirmation email 裡有 confirmation number（訂位代號），Part 7 常拿它出題。',
 col:[['confirmation number','訂位代號']],
 ex:[['I got a confirmation by email.','我收到了確認信。'],
     ['Please bring your confirmation number to the counter.','請攜帶您的訂位代號到櫃檯。']]},

{w:'inquire',kk:'ɪnˈkwaɪr',pos:'v.',zh:'詢問・查詢',lv:4,tags:['biz'],
 note:'inquire about something。名詞 inquiry（詢問）在客服信裡常見：Thank you for your inquiry。英式拼作 enquire。',
 col:[['inquire about','詢問關於']],
 fam:['inquiry'],
 ex:[['I called to inquire about the price.','我打電話去問價格。'],
     ['Thank you for your inquiry about our services.','感謝您對我們服務的詢問。']]},

{w:'assign',kk:'əˈsaɪn',pos:'v.',zh:'指派・分配',lv:3,tags:['biz'],
 note:'assign somebody to something 或 assign something to somebody，兩種語序都對。名詞 assignment 是「被指派的工作」。',
 col:[['assign a task','指派工作']],
 fam:['assignment'],
 ex:[['The teacher assigned us a project.','老師指派我們一個專題。'],
     ['She was assigned to the Tokyo office.','她被派到東京辦公室。']]},

{w:'implement',kk:'ˈɪmpləmənt',pos:'v./n.',zh:'實施・執行・工具',lv:4,tags:['biz'],
 note:'名詞是「器具」，但多益幾乎只考動詞「實施（政策、系統）」。名詞形 implementation 在報告裡很常見。',
 col:[['implement a policy','實施政策']],
 fam:['implementation'],
 ex:[['They implemented the new rule last week.','他們上週開始實施新規定。'],
     ['The system will be implemented in phases.','系統會分階段導入。']]},

{w:'exceed',kk:'ɪkˈsid',pos:'v.',zh:'超過・超出',lv:4,tags:['biz'],
 note:'exceed expectations（超乎預期）是業績報告的固定搭配。形容詞 exceeding 少用，副詞 exceedingly 是「極為」。',
 col:[['exceed expectations','超乎預期'],['exceed the limit','超過限制']],
 ex:[['Do not exceed the speed limit.','不要超速。'],
     ['Sales exceeded our target by 15%.','業績超出目標一成五。']]},

{w:'comply',kk:'kəmˈplaɪ',pos:'v.',zh:'遵守・遵從',lv:5,tags:['biz'],
 note:'一定接 with：comply with the regulations。名詞 compliance（合規）在法遵文件裡到處都是。',
 col:[['comply with','遵守']],
 fam:['compliance'],
 ex:[['Everyone must comply with the rules.','每個人都必須遵守規定。'],
     ['All suppliers must comply with our safety standards.','所有供應商都必須遵守我們的安全標準。']]},

{w:'negotiate',kk:'nɪˈgoʃɪˌet',pos:'v.',zh:'協商・談判',lv:4,tags:['biz'],
 note:'negotiate a contract（談合約）、negotiate with a supplier（和供應商協商）。名詞 negotiation 常用複數。',
 col:[['negotiate a contract','協商合約']],
 fam:['negotiation'],
 ex:[['They negotiated for hours.','他們談判了好幾個小時。'],
     ['We are negotiating better terms with the supplier.','我們正在和供應商協商更好的條件。']]},

{w:'anticipate',kk:'ænˈtɪsəˌpet',pos:'v.',zh:'預期・預料',lv:5,tags:['biz'],
 note:'比 expect 正式。後面接動名詞不接不定詞：anticipate receiving（✓）、anticipate to receive（✗）。',
 col:[['anticipate a delay','預期延遲']],
 fam:['anticipated'],
 ex:[['We anticipate a busy weekend.','我們預期這個週末會很忙。'],
     ['We anticipate receiving the parts next week.','我們預期下週收到零件。']]},

/* ===================== 形容詞與副詞 ===================== */
{w:'outstanding',kk:'aʊtˈstændɪŋ',pos:'adj.',zh:'傑出的・未付清的',lv:4,tags:['biz'],
 note:'兩個意思差很遠：稱讚人是「傑出的」，帳款是「未付清的」。an outstanding balance 是「未結清餘額」，不是「傑出的餘額」。',
 col:[['outstanding balance','未結清餘額'],['outstanding performance','傑出表現']],
 ex:[['Her performance was outstanding.','她的表現很傑出。'],
     ['Please settle the outstanding balance this week.','請在本週結清未付款項。']]},

{w:'eligible',kk:'ˈɛlɪdʒəbl',pos:'adj.',zh:'符合資格的',lv:5,tags:['biz'],
 note:'be eligible for（有資格獲得）或 be eligible to do。福利與優惠題的關鍵字，常和 qualify 互相改寫。',
 col:[['eligible for','有…資格']],
 fam:['eligibility'],
 ex:[['Are you eligible for a discount?','你符合折扣資格嗎？'],
     ['Employees are eligible for the bonus after one year.','員工滿一年後即有資格領獎金。']]},

{w:'available',kk:'əˈveləbl',pos:'adj.',zh:'可用的・有空的・買得到的',lv:2,tags:['biz'],
 note:'多益裡最常見的形容詞之一，三個意思都考：人有空、東西有貨、服務可使用。反義是 unavailable。',
 col:[['readily available','隨時可取得'],['available on request','應要求提供']],
 fam:['availability','unavailable'],
 ex:[['Are you available on Monday?','你星期一有空嗎？'],
     ['The report is available on our website.','報告可在我們網站上取得。']]},

{w:'responsible',kk:'rɪˈspɑnsəbl',pos:'adj.',zh:'負責的',lv:3,tags:['biz'],
 note:'be responsible for + 名詞／動名詞。和 in charge of 同義，兩個常互為 Part 7 的改寫答案。',
 col:[['responsible for','負責']],
 fam:['responsibility'],
 ex:[['You are responsible for your own bag.','你要為自己的包包負責。'],
     ['She is responsible for training new staff.','她負責訓練新進員工。']]},

{w:'accordingly',kk:'əˈkɔrdɪŋlɪ',pos:'adv.',zh:'因此・照著',lv:5,tags:['biz'],
 note:'連接副詞，前面通常要句號或分號。Part 6 段落填空最愛考這一類：therefore、however、meanwhile、accordingly。',
 ex:[['Read the rules and act accordingly.','讀完規則並照著做。'],
     ['Demand has risen; we have adjusted production accordingly.','需求上升，我們也因此調整了產量。']]},

{w:'promptly',kk:'ˈprɑmptlɪ',pos:'adv.',zh:'迅速地・準時地',lv:4,tags:['biz'],
 note:'兩個意思：「立刻」與「準時」。The meeting starts promptly at nine 是「九點準時開始」，遲到不等人。',
 fam:['prompt'],
 ex:[['She replied promptly.','她很快就回覆了。'],
     ['The session will begin promptly at 9 a.m.','會議將於早上九點準時開始。']]}

];
