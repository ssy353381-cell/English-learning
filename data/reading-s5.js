/* ==========================================================================
   reading-s5.js — Stage 5 短文（180–230 字）

   長度再往上推一級，但真正變難的是**句子**而不是篇幅：這一批文章刻意讓
   主詞與主要動詞隔得很開，塞進關係子句、同位語與句首分詞 —— U56 教的拆解法
   在這裡才有東西可拆。

   小題的設計跟著 U58、U63 走：每一篇至少一題是推論題（題幹寫 imply／infer／
   most likely），而且四個選項裡固定放一個「照抄原文只改一個字」的陷阱。
   選項一律換句話說，不照抄。

   體裁全部取自多益 Part 7 真的會出現的文件：董事會紀要、供應商評估、
   保險公告、內部政策、租約異動、產業新聞稿。
   ========================================================================== */
window.DATA_READING_S5 = [

/* ---------------- U56 長難句拆解法 ---------------- */
{
  id:'r5601', u:'s5u1', title:'Board Minutes: Supplier Review',
  text:'Minutes of the quarterly board meeting held on 14 May\n\nPresent: six directors; apologies from Ms. Haruna Ito.\n\nThe review of packaging suppliers that the operations team began in February was presented by Mr. Okonjo. The report, which compares four vendors on price, lead time and defect rate, recommends that the contract now held by Trellis Packaging be moved to Verano Materials at the end of the current term.\n\nDirectors noted that Verano, a smaller firm based in Tainan, quotes a unit price nine percent above the current supplier. Offsetting this, the defect rate recorded during the three-month trial was less than a third of the rate seen in the same period last year, and the savings from fewer replacement shipments are expected to exceed the additional unit cost within two quarters.\n\nMs. Delacroix asked whether Verano could handle a sudden increase in volume. Mr. Okonjo replied that the trial had covered only routine orders and that a stress test would be arranged before any contract is signed.\n\nNo decision was taken. The board asked for the stress test results and a revised cost model by the July meeting.',
  zh:'五月十四日季度董事會會議紀錄\n\n出席：六位董事；Haruna Ito 女士請假。\n\n營運團隊二月開始進行的包裝供應商評估，由 Okonjo 先生提出報告。該報告就價格、交期與不良率比較四家廠商，建議在現行合約期滿後，將目前由 Trellis Packaging 承接的合約轉給 Verano Materials。\n\n董事們注意到，Verano 是一家規模較小、位於台南的公司，報價的單價比現行供應商高出百分之九。相對地，三個月試用期間記錄到的不良率不到去年同期的三分之一，而減少補件出貨所省下的成本，預計在兩季內就會超過多出來的單價。\n\nDelacroix 女士詢問 Verano 是否應付得了突然增加的訂單量。Okonjo 先生回覆，試用只涵蓋一般訂單，簽約前會另行安排壓力測試。\n\n本次未做成決議。董事會要求在七月會議前提出壓力測試結果與修訂後的成本模型。',
  qs:[
    { q:'Who prepared the supplier review?', opts:['The board of directors','The operations team','Verano Materials','Ms. Delacroix'], a:1,
      why:'The review … that the operations team began in February —— 關係子句裡才是動作的主人。' },
    { q:'What is the main drawback of switching to Verano?', opts:['A longer lead time','A higher unit price','A worse defect rate','A distant location'], a:1,
      why:'quotes a unit price nine percent above the current supplier。不良率反而是優點。' },
    { q:'What does the report imply about replacement shipments?', opts:['They are currently free.','They currently cost money.','They will increase next year.','They are handled by Trellis.'], a:1,
      why:'the savings from fewer replacement shipments —— 會省下錢，代表現在正在花錢。' },
    { q:'What must happen before a contract is signed?', opts:['A price cut','A stress test','A board vote in May','A second trial of routine orders'], a:1,
      why:'a stress test would be arranged before any contract is signed。' }
  ]
},

/* ---------------- U58 干擾選項的五種套路 ---------------- */
{
  id:'r5801', u:'s5u3', title:'Notice: Cycle-to-Work Scheme',
  text:'To all staff at the Songshan site\n\nFrom 1 October the company will extend its cycle-to-work scheme. Staff who cycle to the office at least three days a week may apply for a free parking permit for the covered bicycle area behind Building C. Permits are issued for twelve months and are not transferable.\n\nThe scheme is open to permanent employees and to contractors whose contracts run for six months or longer. Interns are not eligible this year, although the committee has said it will review that decision in the spring.\n\nApplicants should complete the online form and upload a photograph of the bicycle they intend to register. Applications are usually approved within five working days; a small number may take longer if the details do not match the staff record.\n\nSome maintenance services will also be offered. A mechanic will visit the site on the first Tuesday of each month, and basic adjustments will be free of charge. Repairs requiring parts will be invoiced to the employee at cost.\n\nPlease note that the covered area is monitored but not staffed. The company cannot accept responsibility for bicycles left overnight.',
  zh:'致松山廠區全體同仁\n\n自十月一日起，公司將擴大自行車通勤方案。每週至少三天騎車上班的同仁，可申請 C 棟後方有頂棚自行車區的免費停車證。停車證效期十二個月，不得轉讓。\n\n本方案開放給正職員工，以及合約期六個月以上的約聘人員。實習生今年不符資格，但委員會表示明年春天會重新檢討這項決定。\n\n申請人請填寫線上表單，並上傳欲登記之自行車照片。申請通常於五個工作天內核准；若資料與人事紀錄不符，少數件可能需要較久。\n\n另將提供部分維修服務。技師將於每月第一個星期二到廠，基本調整免費。需要更換零件的維修將按成本向員工請款。\n\n請注意，該區域雖有監視但無人駐守。自行車若過夜停放，公司無法承擔責任。',
  qs:[
    { q:'Who may apply for a permit?', opts:['Anyone who works at the site','Interns on a summer placement','Contractors with a six-month contract','Visitors who arrive by bicycle'], a:2,
      why:'contractors whose contracts run for six months or longer。「所有在廠區工作的人」是範圍擴大型陷阱。' },
    { q:'How long is a permit valid?', opts:['Six months','Twelve months','Until the spring review','Five working days'], a:1,
      why:'Permits are issued for twelve months。five working days 是核准時間，不是效期 —— 照抄原文型陷阱。' },
    { q:'What is stated about repairs?', opts:['All repairs are free.','Basic adjustments are free.','Repairs are done every Tuesday.','Repairs are not available on site.'], a:1,
      why:'basic adjustments will be free of charge，但換零件要付費，所以 all repairs are free 講得太滿。' },
    { q:'What is implied about the bicycle area?', opts:['It is safer than the street.','It is not guarded at night.','It is open only in October.','It has room for every employee.'], a:1,
      why:'monitored but not staffed 加上不負保管責任 —— 推一步就是夜間無人看守。' }
  ]
},

/* ---------------- U60 全真模考 ① ---------------- */
{
  id:'r6001', u:'s5u5', title:'Press Release: Regional Rail Upgrade',
  text:'FOR IMMEDIATE RELEASE\n\nNorthline Rail today announced that the signalling upgrade begun in 2022 has entered its final phase. The work, which has been carried out at night to limit disruption, is scheduled for completion in November.\n\nOnce the new system is live, trains on the coastal route will be able to run at four-minute intervals during peak hours, compared with the seven-minute intervals possible today. The company estimates that this will add capacity for roughly eleven thousand passengers each weekday morning.\n\nPassengers should expect some changes before then. Between 8 and 22 September, services after ten in the evening will be replaced by buses on the section between Ruifang and Yilan. Tickets already purchased for those services will be honoured on the replacement buses, and passengers who prefer not to travel by bus may claim a full refund.\n\n"We know that late-evening travellers will find this inconvenient," said operations director Aroha Whitiora. "Doing the work in a single block, rather than one weekend a month for a year, means the disruption ends sooner."\n\nA detailed timetable for the September period is available at every staffed station and on the company website.',
  zh:'即時發布\n\nNorthline Rail 今日宣布，二〇二二年開始的號誌升級工程已進入最後階段。該工程為降低影響一律於夜間施作，預計十一月完工。\n\n新系統上線後，海線列車尖峰時段可縮短至四分鐘一班，目前則是七分鐘一班。公司估計此舉每個平日早晨可增加約一萬一千人次的運能。\n\n在此之前旅客仍會遇到一些變動。九月八日至二十二日間，瑞芳至宜蘭路段晚間十點以後的班次將改以公車接駁。已購買該時段車票者可持票搭乘接駁公車，不願搭乘公車的旅客亦可申請全額退費。\n\n「我們知道深夜出行的旅客會覺得不便，」營運總監 Aroha Whitiora 表示。「但集中在一個區間施作，而不是一年裡每月停一個週末，反而讓不便早點結束。」\n\n九月期間的詳細時刻表可於各有人站與公司網站取得。',
  qs:[
    { q:'What is the current peak-hour interval on the coastal route?', opts:['Four minutes','Seven minutes','Ten minutes','Eleven minutes'], a:1,
      why:'compared with the seven-minute intervals possible today —— four minutes 是完工後的目標。' },
    { q:'What happens to late-evening services in September?', opts:['They are cancelled with no alternative.','They are replaced by buses on one section.','They run more frequently.','They stop only at staffed stations.'], a:1,
      why:'services after ten in the evening will be replaced by buses on the section between Ruifang and Yilan。' },
    { q:'What can passengers with existing tickets do?', opts:['Only travel by bus','Only claim a refund','Use the bus or claim a refund','Exchange them for peak-hour tickets'], a:2,
      why:'兩個選項都給了：Tickets … will be honoured 與 may claim a full refund。' },
    { q:'Why was the work scheduled as a single block?', opts:['It is cheaper that way.','It ends the disruption sooner.','Buses are only available in September.','The new system requires it.'], a:1,
      why:'means the disruption ends sooner —— 引述裡直接給了理由。' }
  ]
},

/* ---------------- U61 低頻高階字彙 ---------------- */
{
  id:'r6101', u:'s5u6', title:'Policy: Expense Approval Thresholds',
  text:'Finance Policy 12b — revised January\n\nThis policy sets out who may approve expenditure and the records that must be kept. It applies to all departments, including those operating under a separate cost centre.\n\nAny single item below 3,000 dollars may be approved by a line manager at the manager\'s discretion, provided the spend is within the department\'s annual budget. Items between 3,000 and 20,000 dollars require the approval of a department head, who must record a short written justification. Anything above 20,000 dollars goes to the finance committee, which meets fortnightly.\n\nSplitting a purchase into smaller amounts in order to stay below a threshold is prohibited. Where a purchase is clearly one project delivered in stages, the total value determines the threshold, not the value of each stage.\n\nStringent record keeping is expected. Receipts must be uploaded within ten working days; claims submitted later than thirty days may be refused. Meticulous coding of each entry is essential, because the year-end audit samples entries at random and an ambiguous description is treated as a missing record.\n\nWhere a supplier offers a discount that makes an urgent purchase more lucrative than waiting, managers should still obtain written approval before committing funds. Verbal approval is not sufficient.',
  zh:'財務政策 12b —— 一月修訂\n\n本政策規範誰有權核准支出，以及必須保存哪些紀錄。適用於所有部門，包含以獨立成本中心運作者。\n\n單筆低於三千元的項目，只要在部門年度預算之內，可由直屬主管自行斟酌核准。三千至兩萬元之間的項目須經部門主管核准，並記錄一段簡短的理由說明。超過兩萬元者送財務委員會，該委員會每兩週開會一次。\n\n為了壓在門檻以下而把一筆採購拆成數筆是被禁止的。若一項採購明顯是同一個分階段交付的專案，則以總金額而非各階段金額認定門檻。\n\n紀錄必須嚴謹。收據須於十個工作天內上傳；逾三十天提出的申報可能不予受理。每一筆的分類編碼務必一絲不苟，因為年終查核是隨機抽樣，敘述含糊等同於沒有紀錄。\n\n若供應商提供折扣，使得立即採購比等待更划算，主管仍應在動用經費前取得書面核准。口頭同意不算數。',
  qs:[
    { q:'Who approves an item costing 15,000 dollars?', opts:['A line manager','A department head','The finance committee','No approval is needed'], a:1,
      why:'Items between 3,000 and 20,000 dollars require the approval of a department head。' },
    { q:'What is prohibited by the policy?', opts:['Buying from a single supplier','Dividing a purchase to stay under a limit','Using a separate cost centre','Claiming within ten days'], a:1,
      why:'Splitting a purchase into smaller amounts in order to stay below a threshold is prohibited。' },
    { q:'What does the policy say about an unclear description?', opts:['It will be corrected by finance.','It counts as no record at all.','It delays payment by ten days.','It is allowed for small items.'], a:1,
      why:'an ambiguous description is treated as a missing record。' },
    { q:'What can be inferred about verbal approval?', opts:['It is faster than written approval.','It carries no weight under this policy.','It is allowed for urgent discounts.','It must be recorded by the supplier.'], a:1,
      why:'Verbal approval is not sufficient —— 連有折扣的急件都不例外，所以在這份政策下形同無效。' }
  ]
},

/* ---------------- U62 倒裝與假設語氣進階 ---------------- */
{
  id:'r6201', u:'s5u7', title:'Letter: Lease Renewal Terms',
  text:'Dear Mr. Vasquez,\n\nThank you for your letter of 3 April regarding the lease on Unit 7, Harbourgate Business Park.\n\nHad we received your notice before the end of March, the renewal would have been processed at the current rate. As the notice arrived on 3 April, the terms set out in clause 9 now apply, and the rate for the coming year will be adjusted in line with the published index.\n\nNever before have we applied this clause to a long-standing tenant, and we are conscious that the increase falls at a difficult time for your business. Should you wish to discuss a phased increase, we would be glad to arrange a meeting. Only after such a discussion could we put a revised figure in writing.\n\nWe would also draw your attention to the condition survey carried out in February. Not until the roof repairs identified in that survey are complete will the outdoor storage area be available again. Our contractor expects to finish in late May.\n\nWere the works to overrun, we would extend your storage credit accordingly. Please let us know by 20 April how you wish to proceed.\n\nYours sincerely,\nPriya Raghunathan, Estates Office',
  zh:'親愛的 Vasquez 先生：\n\n感謝您四月三日關於 Harbourgate 商業園區 7 號單位租約的來信。\n\n若我們在三月底前收到您的通知，續約就會按現行費率辦理。由於通知於四月三日才送達，現在適用第九條所訂的條款，來年費率將依公布的指數調整。\n\n我們從未對長期承租戶適用過這一條，也明白這次調漲正逢貴公司的艱難時刻。若您希望討論分階段調漲，我們很樂意安排會面。唯有經過這樣的討論，我們才能以書面提出修訂後的數字。\n\n另請留意二月所做的建物狀況勘查。勘查中指出的屋頂修繕完成之前，戶外儲放區都無法使用。承包商預計五月下旬完工。\n\n萬一工程延宕，我們會相應延長您的儲放折抵。請於四月二十日前告知您的意向。\n\n敬祝商祺\n產業管理處　Priya Raghunathan',
  qs:[
    { q:'Why is the current rate NOT being applied?', opts:['The tenant refused it.','The notice arrived after March.','Clause 9 was removed.','The index has not been published.'], a:1,
      why:'Had we received your notice before the end of March —— 省略 if 的第三型，表示事實上沒有在三月底前收到。' },
    { q:'What is implied about clause 9?', opts:['It is used with every tenant.','It has rarely been used with this kind of tenant.','It was added this year.','It only applies to storage areas.'], a:1,
      why:'Never before have we applied this clause to a long-standing tenant。' },
    { q:'When will the outdoor storage area reopen?', opts:['On 20 April','After the roof repairs','In February','When the lease is renewed'], a:1,
      why:'Not until the roof repairs … are complete will the outdoor storage area be available again。' },
    { q:'What will happen if the works take longer than expected?', opts:['The lease will be cancelled.','The storage credit will be extended.','The rate will be reduced.','A new survey will be ordered.'], a:1,
      why:'Were the works to overrun, we would extend your storage credit accordingly。' }
  ]
},

/* ---------------- U63 推論題專攻 ---------------- */
{
  id:'r6301', u:'s5u8', title:'Email: Handover Notes',
  text:'From: Bilal Ferhaoui\nTo: Team distribution list\nSubject: Handover — Thursday onwards\nDate: 12 August\n\nHi everyone,\n\nAs most of you know, Thursday is my last day on the accounts side before I move across to the projects group. Rana will be picking up the day-to-day work from Friday, so please copy her on anything that is still open.\n\nA few things worth flagging. The Kestrel account has a credit note outstanding from June; the paperwork is in the shared folder but it has not been signed off, and their finance contact chases it every fortnight. The Almeida renewal is due in September and they have already asked twice for a call — I have not booked one, so that is the first thing in Rana\'s diary.\n\nThe monthly reconciliation is fully automated now, which was the main thing I wanted to leave in better shape than I found it. The only manual step left is the currency check on the two European accounts.\n\nI will still be in the building, so do stop by if something looks odd. It has been a good three years on this desk.\n\nBilal',
  zh:'寄件者：Bilal Ferhaoui\n收件者：團隊群組\n主旨：交接 —— 星期四之後\n日期：八月十二日\n\n各位好：\n\n如同大家所知，星期四是我在帳務這邊的最後一天，之後我會轉到專案組。Rana 會從星期五起接手日常工作，還沒結案的事情請把她加進副本。\n\n有幾件事想特別提醒。Kestrel 這個客戶有一張六月的折讓單還沒處理；文件放在共用資料夾，但一直沒有簽核，他們的財務窗口每兩週就來催一次。Almeida 的續約在九月到期，他們已經兩次要求通話 —— 我還沒有安排，所以那是 Rana 行事曆上的第一件事。\n\n每月對帳現在已經全自動化，那是我最想讓它比我接手時更好的一件事。唯一剩下的人工步驟是兩個歐洲帳戶的匯率確認。\n\n我還會在同一棟樓，覺得哪裡怪就過來找我。在這個位子上的三年很值得。\n\nBilal',
  qs:[
    { q:'What can be inferred about Bilal?', opts:['He is leaving the company.','He is changing roles within the company.','He is retiring on Thursday.','He is joining the finance team at Kestrel.'], a:1,
      why:'move across to the projects group 加上 I will still be in the building —— 換組不是離職。' },
    { q:'What is implied about the Kestrel credit note?', opts:['It has been paid.','It is causing repeated contact from the client.','It was cancelled in June.','Rana has already signed it.'], a:1,
      why:'their finance contact chases it every fortnight —— 沒簽核所以對方一直催。' },
    { q:'What should Rana most likely do first?', opts:['Sign the reconciliation','Arrange a call with Almeida','Move the files out of the shared folder','Automate the currency check'], a:1,
      why:'that is the first thing in Rana\'s diary，指的是那通還沒安排的電話。' },
    { q:'What is suggested about the monthly reconciliation?', opts:['It used to take more manual work.','It has never been automated.','It is done by the European offices.','It will be handed to a new system.'], a:0,
      why:'leave in better shape than I found it 加上 fully automated now —— 推一步就是以前要手動做。' }
  ]
},
{
  id:'r6302', u:'s5u8', title:'Web Notice: Membership Changes',
  text:'Changes to membership from 1 January — Harbourside Fitness\n\nWe are writing to let members know about three changes to the way memberships work next year.\n\nFirst, the off-peak category will be extended. Off-peak access currently ends at four in the afternoon; from January it will end at five, at no extra cost to existing off-peak members. Members who upgraded to full access last year purely to use the hour between four and five may wish to review their plan.\n\nSecond, the swimming pool will close for resurfacing between 6 and 27 February. During that period all members may use the pool at our Riverbend site, which is a twenty-minute walk away. No credit will be issued for the closure, as an alternative is being provided.\n\nThird, the guest policy is changing. Each member may currently bring one guest per month free of charge. From January guests will be charged 200 dollars, although members on the family plan will keep two free guest visits a month.\n\nMembers who wish to cancel rather than accept these changes may do so without the usual thirty days\' notice, provided they write to us before 15 December.',
  zh:'一月一日起會籍異動 —— Harbourside Fitness\n\n謹此告知會員明年會籍運作方式的三項變動。\n\n第一，離峰時段將延長。離峰使用權目前到下午四點結束，一月起延長至五點，現有離峰會員無須加價。去年單純為了使用四點到五點這一小時而升級為全時段的會員，或許可以重新檢視自己的方案。\n\n第二，游泳池將於二月六日至二十七日進行整修。該期間所有會員可改用步行二十分鐘可達的 Riverbend 館。因已提供替代方案，此次休館不另行折抵。\n\n第三，訪客規定將調整。目前每位會員每月可免費攜帶一位訪客。一月起訪客將收費兩百元，惟家庭方案會員仍保有每月兩次免費訪客名額。\n\n不願接受上述異動而希望終止會籍的會員，只要在十二月十五日前來函，即可免除平時三十天的通知期。',
  qs:[
    { q:'Who might want to review their plan?', opts:['Family plan members','Members who upgraded for the 4–5 pm hour','Members who never swim','New members joining in January'], a:1,
      why:'Members who upgraded to full access last year purely to use the hour between four and five。' },
    { q:'Why will no credit be given for the pool closure?', opts:['The closure is short.','Another pool is available.','Members were told in advance.','The work is free of charge.'], a:1,
      why:'No credit will be issued …, as an alternative is being provided。' },
    { q:'What is implied about family plan members?', opts:['They pay more from January.','They are less affected by the guest change.','They cannot use the Riverbend site.','They must cancel before December.'], a:1,
      why:'其他人每次訪客要兩百元，家庭方案仍有兩次免費 —— 推一步就是受影響較小。' },
    { q:'What is offered to members who do not accept the changes?', opts:['A refund of last year\'s fees','Cancellation without the usual notice','A free upgrade to full access','Two extra guest visits'], a:1,
      why:'may do so without the usual thirty days\' notice, provided they write before 15 December。' }
  ]
},

/* ---------------- U64 全真模考 ② ---------------- */
{
  id:'r6401', u:'s5u9', title:'Report Extract: Remote Working Survey',
  text:'Extract from the annual staff survey, section 4\n\nOf the 1,240 employees invited to take part, 812 responded, a rate slightly higher than last year. The questions on remote working were answered by everyone who responded, whereas the section on office facilities was optional and drew 604 answers.\n\nStaff who work remotely at least two days a week reported higher satisfaction with their working hours than those who attend the office every day. The gap, eleven percentage points, was the largest single difference in the survey. Satisfaction with communication, however, ran the other way: office-based staff rated it seven points higher.\n\nWritten comments pointed repeatedly to meetings. Several respondents noted that a meeting with one remote participant often works less well than a meeting where everyone is remote, because the person on the screen is easily forgotten. Two teams have already adopted a rule that if one person joins remotely, everyone joins remotely.\n\nThe committee will not recommend a company-wide policy this year. It suggests instead that each department agree its own meeting practice by the end of the quarter, and that the question be asked again in next year\'s survey.',
  zh:'年度員工問卷摘錄，第四節\n\n受邀填答的一千兩百四十位員工中有八百一十二位回覆，回覆率略高於去年。關於遠距工作的題目所有回覆者都作答，而辦公環境那一節屬選填，收到六百零四份回答。\n\n每週至少遠距工作兩天的員工，對工作時間的滿意度高於每天進辦公室的員工，兩者相差十一個百分點，是本次問卷中最大的單一差距。不過溝通面向剛好相反：辦公室工作者的評分高出七分。\n\n文字意見一再指向會議。多位受訪者提到，只有一位遠距參與者的會議，往往比全體都遠距的會議更不順利，因為螢幕上的那個人很容易被忘記。已有兩個團隊採行「只要有一人遠距，全員都遠距」的規則。\n\n委員會今年不會建議全公司統一政策，而是建議各部門於本季結束前議定自己的會議做法，並在明年問卷中再問一次這個問題。',
  qs:[
    { q:'How many people answered the section on office facilities?', opts:['1,240','812','604','Everyone who responded'], a:2,
      why:'the section on office facilities was optional and drew 604 answers。812 是總回覆數，是照抄原文型陷阱。' },
    { q:'On which point did office-based staff score higher?', opts:['Working hours','Communication','Meeting length','Overall satisfaction'], a:1,
      why:'Satisfaction with communication … office-based staff rated it seven points higher。' },
    { q:'What problem did written comments identify?', opts:['Meetings run too long.','A single remote participant is easily overlooked.','Remote staff miss too many meetings.','Office rooms are too small.'], a:1,
      why:'the person on the screen is easily forgotten。' },
    { q:'What does the committee recommend?', opts:['A company-wide policy this year','Department-level agreements','Ending remote work','Repeating the survey next quarter'], a:1,
      why:'each department agree its own meeting practice by the end of the quarter。' }
  ]
},

/* ---------------- U65 Stage 5 魔王測驗 ---------------- */
{
  id:'r6501', u:'s5u10', title:'Announcement: Warehouse Automation Trial',
  text:'To all distribution centre staff\n\nFrom Monday 4 November the north aisle of the Taoyuan centre will be used for a three-month automation trial. Two picking robots, supplied by a firm that already runs similar systems in Osaka and Rotterdam, will operate alongside the existing team.\n\nNot until the trial is complete will any decision be made about wider use. Nothing in this trial changes anyone\'s role, and no reduction in staff numbers is planned for this site.\n\nDuring the trial the north aisle will be marked with yellow floor tape. Staff who are not part of the trial team should not enter the taped area while the robots are moving, even to retrieve an item that has fallen. A supervisor can stop the system in under five seconds.\n\nThe trial team, comprising four pickers and one supervisor from each shift, will meet the engineers every Friday. Anyone interested in joining should speak to their shift leader this week; places are limited, and preference will be given to staff who have worked in the north aisle before.\n\nHad the equipment arrived on schedule, the trial would have begun in October. The delay means the review will now fall in February rather than January.',
  zh:'致配送中心全體同仁\n\n自十一月四日星期一起，桃園中心的北側走道將用於為期三個月的自動化試驗。兩台揀貨機器人由一家已在大阪與鹿特丹運行類似系統的廠商提供，將與現有團隊一同作業。\n\n試驗結束前不會做出任何擴大使用的決定。本次試驗不會改變任何人的職務，本廠區也沒有裁減人力的計畫。\n\n試驗期間北側走道將以黃色地貼標示。非試驗團隊的同仁在機器人移動時請勿進入標示區域，即使是為了撿拾掉落的物品也一樣。主管可在五秒內停止系統。\n\n試驗團隊由每個班別的四位揀貨員與一位主管組成，每週五與工程師開會。有興趣參加者請於本週向班長反映；名額有限，曾在北側走道工作過的同仁將優先錄取。\n\n設備若準時到貨，試驗十月就會開始。這次延遲代表檢討時間將從一月改到二月。',
  qs:[
    { q:'What is the main purpose of the announcement?', opts:['To announce job cuts','To describe a limited trial','To close the north aisle permanently','To introduce a new shift pattern'], a:1,
      why:'a three-month automation trial，而且明說 no reduction in staff numbers is planned。' },
    { q:'What must staff outside the trial team NOT do?', opts:['Speak to their shift leader','Walk past the yellow tape while robots move','Attend the Friday meetings','Report fallen items'], a:1,
      why:'should not enter the taped area while the robots are moving, even to retrieve an item。' },
    { q:'Who will be preferred for a place on the trial team?', opts:['Staff with the longest service','Staff who have worked in the north aisle','Supervisors only','Staff from the Osaka site'], a:1,
      why:'preference will be given to staff who have worked in the north aisle before。' },
    { q:'Why will the review take place in February?', opts:['The trial was extended.','The equipment arrived late.','February is the end of the quarter.','The engineers are unavailable in January.'], a:1,
      why:'Had the equipment arrived on schedule, the trial would have begun in October —— 省略 if 的倒裝，表示設備其實遲到了。' }
  ]
}

];
