/* ==========================================================================
   vocab-s5.js — Stage 5 單字（Unit 56、58、61、62、63）

   到 880 分以上，還會擋住人的字剩兩類：

     **把句子拉長的那些字**（U56）  comprise、whereas、notwithstanding、thereafter。
                    它們本身不難，難的是它們一出現，句子就多一層結構 ——
                    長難句拆解那一關要拆的東西，有一半是這些字牽出來的。
     **描述「話怎麼說」的字**（U58、U63）  discrepancy、plausible、infer、implication。
                    Part 7 的選項與題幹講的不是內容，是「文章對這件事的態度」，
                    看不懂題幹就算讀完文章也選不出來。

   中間夾一關純粹的低頻高階字（U61）：ambiguous、meticulous、stringent 這一批
   詞頻排到一萬名外，但多益的商務語境天天用。

   U62（倒裝與假設語氣進階）的字刻意少而準 —— 那一關真正要練的是句構，
   單字只是讓例句站得住。

   **同義字不同收**：infer 與 deduce、scarcely 與 hardly 中文寫出來一模一樣，
   湊進同一題會兩個選項都對（distractors() 只擋 zh 逐字相同，擋不掉「意思一樣但
   中文寫法不同」）。所以每一組只收一個，另一個留給詞庫去查。

   欄位同 vocab-s4：id / w / kk / pos / zh / ic / u / ex，外加 lure / col / rt。
   ========================================================================== */
window.DATA_VOCAB_S5 = [

/* ===================== U56 長難句拆解法 ===================== */
{id:'v5001',w:'comprise',kk:'kəmˈpraɪz',pos:'v.',zh:'由…組成',ic:'🧱',u:'s5u1',lure:['include','attach'],
 ex:[['The set comprises four books and a map.','這一套包含四本書和一張地圖。'],
     ['The committee comprises members from all five departments.','委員會由五個部門的成員組成。']]},
{id:'v5002',w:'constitute',kk:'ˈkɑnstəˌtjut',pos:'v.',zh:'構成・算是',ic:'🏗️',u:'s5u1',lure:['comprise','replace'],
 ex:[['Water constitutes most of the human body.','水構成人體的大部分。'],
     ['Late payment constitutes a breach of the contract.','逾期付款即構成違約。']]},
{id:'v5003',w:'stipulate',kk:'ˈstɪpjəˌlet',pos:'v.',zh:'明訂・規定',ic:'📜',u:'s5u1',lure:['suggest','request'],
 ex:[['The rules stipulate that guests must sign in.','規定明訂訪客必須簽到。'],
     ['The lease stipulates a two-month notice period.','租約明訂要提前兩個月通知。']]},
{id:'v5004',w:'clause',kk:'klɔz',pos:'n.',zh:'條款・子句',ic:'📑',u:'s5u1',lure:['detail','cause'],
 ex:[['Read the last clause before you sign.','簽名前先看最後一條條款。'],
     ['A clause in the agreement covers early cancellation.','協議中有一條條款處理提前解約。']]},
{id:'v5005',w:'respective',kk:'rɪˈspɛktɪv',pos:'adj.',zh:'各自的',ic:'👥',u:'s5u1',lure:['respectful','previous'],
 ex:[['They went back to their respective rooms.','他們各自回到自己的房間。'],
     ['The two teams presented their respective budgets.','兩個團隊各自提出了預算。']]},
{id:'v5006',w:'subsequent',kk:'ˈsʌbsɪˌkwɛnt',pos:'adj.',zh:'隨後的',ic:'➡️',u:'s5u1',lure:['previous','current'],
 ex:[['Subsequent visits will be shorter.','之後的幾次來訪會比較短。'],
     ['All subsequent invoices should be sent to the new address.','之後所有的請款單都請寄到新地址。']]},
{id:'v5007',w:'thereafter',kk:'ðɛrˈæftɚ',pos:'adv.',zh:'此後・從那時起',ic:'⏭️',u:'s5u1',lure:['therefore','recent'],
 ex:[['She stayed for a week and left thereafter.','她待了一週，之後就離開了。'],
     ['The trial period lasts 30 days; thereafter a monthly fee applies.','試用期三十天，此後開始收月費。']]},
{id:'v5008',w:'whereas',kk:'hwɛrˈæz',pos:'conj.',zh:'然而・相對地',ic:'⚖️',u:'s5u1',lure:['whenever','because'],
 ex:[['He likes tea, whereas I prefer coffee.','他喜歡茶，而我比較愛咖啡。'],
     ['Sales rose in the north, whereas they fell in the south.','北區業績上升，南區反而下滑。']]},
{id:'v5009',w:'notwithstanding',kk:'ˌnɑtwɪθˈstændɪŋ',pos:'prep.',zh:'儘管有…（後接名詞）',ic:'🧗',u:'s5u1',lure:['nonetheless','although'],
 ex:[['Notwithstanding the rain, the match went ahead.','儘管下雨，比賽照常進行。'],
     ['Notwithstanding the delay, the project stayed within budget.','儘管延誤了，這個案子仍在預算內。']]},
{id:'v5010',w:'pertain',kk:'pɚˈten',pos:'v.',zh:'與…有關',ic:'🔗',u:'s5u1',lure:['obtain','include'],
 ex:[['This rule does not pertain to visitors.','這條規定與訪客無關。'],
     ['Documents pertaining to the merger are confidential.','與這樁併購有關的文件皆為機密。']]},

/* ===================== U58 干擾選項的五種套路 ===================== */
{id:'v5101',w:'discrepancy',kk:'dɪˈskrɛpənsɪ',pos:'n.',zh:'不一致・出入',ic:'🔍',u:'s5u3',lure:['detail','difference'],
 ex:[['There is a discrepancy between the two lists.','兩份清單之間有出入。'],
     ['Please explain the discrepancy in last month\'s figures.','請說明上個月數字的落差。']]},
{id:'v5102',w:'plausible',kk:'ˈplɔzəbḷ',pos:'adj.',zh:'看似合理的',ic:'🎭',u:'s5u3',lure:['possible','reliable'],
 ex:[['That sounds plausible, but I want proof.','聽起來說得通，但我要證據。'],
     ['The report offers a plausible reason for the shortfall.','報告為短缺提出了一個看似合理的原因。']]},
{id:'v5103',w:'distort',kk:'dɪsˈtɔrt',pos:'v.',zh:'扭曲・曲解',ic:'🌀',u:'s5u3',lure:['describe','reduce'],
 ex:[['The mirror distorts your face.','那面鏡子把你的臉照歪了。'],
     ['Leaving out the date distorts the whole story.','把日期略掉會讓整件事完全變樣。']]},
{id:'v5104',w:'irrelevant',kk:'ɪˈrɛləvənt',pos:'adj.',zh:'不相干的',ic:'🚮',u:'s5u3',lure:['relevant','efficient'],
 ex:[['His age is irrelevant here.','他幾歲在這裡不重要。'],
     ['The final paragraph is interesting but irrelevant to the question.','最後一段很有趣，但和問題無關。']]},
{id:'v5105',w:'contradict',kk:'ˌkɑntrəˈdɪkt',pos:'v.',zh:'與…矛盾・反駁',ic:'❌',u:'s5u3',lure:['confirm','predict'],
 ex:[['Do not contradict yourself in the same letter.','別在同一封信裡自相矛盾。'],
     ['The second table contradicts the figure given on page one.','第二張表和第一頁的數字互相矛盾。']]},
{id:'v5106',w:'exaggerate',kk:'ɪɡˈzædʒəˌret',pos:'v.',zh:'誇大',ic:'🎈',u:'s5u3',lure:['estimate','increase'],
 ex:[['He always exaggerates when he tells that story.','他講那個故事總是誇大。'],
     ['The advertisement exaggerates how long the battery lasts.','廣告誇大了電池的續航力。']]},
{id:'v5107',w:'misleading',kk:'mɪsˈlidɪŋ',pos:'adj.',zh:'誤導的',ic:'🚸',u:'s5u3',lure:['helpful','careful'],
 ex:[['The sign was misleading, so we took the wrong road.','那個標誌會誤導人，所以我們走錯路了。'],
     ['A chart without a scale is misleading.','沒有標示刻度的圖表會誤導人。']]},
{id:'v5108',w:'subtle',kk:'ˈsʌtḷ',pos:'adj.',zh:'細微的・不易察覺的',ic:'🪶',u:'s5u3',lure:['explicit','obvious'],
 ex:[['There is a subtle difference between the two words.','這兩個字之間有細微的差別。'],
     ['The change in tone was subtle but deliberate.','語氣的轉變很細微，卻是刻意的。']]},
{id:'v5109',w:'omit',kk:'oˈmɪt',pos:'v.',zh:'略去・漏掉',ic:'🕳️',u:'s5u3',lure:['admit','include'],
 ex:[['You omitted the date on the form.','你漏填了表格上的日期。'],
     ['The summary omits the cost of installation.','摘要略去了安裝費用。']]},
{id:'v5110',w:'verbatim',kk:'vɚˈbetɪm',pos:'adv./adj.',zh:'逐字地・一字不改的',ic:'📝',u:'s5u3',lure:['exact','accurate'],
 ex:[['She repeated my words verbatim.','她一字不差地重複了我的話。'],
     ['A choice that copies the passage verbatim is usually the trap.','照抄原文的選項通常就是陷阱。']]},

/* ===================== U61 低頻高階字彙 ===================== */
{id:'v5201',w:'ambiguous',kk:'æmˈbɪɡjʊəs',pos:'adj.',zh:'模稜兩可的',ic:'🌫️',u:'s5u6',lure:['explicit','anonymous'],
 ex:[['His answer was ambiguous, so I asked again.','他的回答模稜兩可，所以我又問了一次。'],
     ['The wording of the clause is ambiguous and should be revised.','這一條的用字模稜兩可，應該修改。']]},
{id:'v5202',w:'arbitrary',kk:'ˈɑrbəˌtrɛrɪ',pos:'adj.',zh:'隨意的・武斷的',ic:'🎲',u:'s5u6',lure:['ordinary','necessary'],
 ex:[['The order of the names is arbitrary.','名字的順序是隨便排的。'],
     ['Staff complained that the new rule seemed arbitrary.','員工抱怨新規定看起來很武斷。']]},
{id:'v5203',w:'coherent',kk:'koˈhɪrənt',pos:'adj.',zh:'條理分明的',ic:'🧵',u:'s5u6',lure:['confident','current'],
 ex:[['Give me one coherent reason.','給我一個說得通的理由。'],
     ['The proposal needs a coherent plan for the first year.','這份提案需要一套條理分明的第一年計畫。']]},
{id:'v5204',w:'discretion',kk:'dɪˈskrɛʃən',pos:'n.',zh:'自行斟酌・判斷力',ic:'🤫',u:'s5u6',lure:['decision','description'],
 ex:[['I will leave it to your discretion.','這件事就由你自己判斷。'],
     ['Refunds are given at the manager\'s discretion.','是否退款由經理自行斟酌。']]},
{id:'v5205',w:'feasible',kk:'ˈfizəbḷ',pos:'adj.',zh:'可行的',ic:'✔️',u:'s5u6',lure:['possible','flexible'],
 ex:[['Is it feasible to finish by Friday?','星期五前做完可行嗎？'],
     ['The study concluded that the plan is technically feasible.','研究結論是這個計畫在技術上可行。']]},
{id:'v5206',w:'inherent',kk:'ɪnˈhɪrənt',pos:'adj.',zh:'固有的・天生的',ic:'🧬',u:'s5u6',lure:['inhabit','current'],
 ex:[['There is an inherent risk in every sport.','每一種運動都有其固有的風險。'],
     ['Delay is inherent in a supply chain this long.','這麼長的供應鏈本來就會有延遲。']]},
{id:'v5207',w:'lucrative',kk:'ˈlukrətɪv',pos:'adj.',zh:'賺錢的・獲利豐厚的',ic:'💰',u:'s5u6',lure:['expensive','creative'],
 ex:[['Selling coffee turned out to be lucrative.','賣咖啡結果很賺錢。'],
     ['The service contract is the most lucrative part of the deal.','服務合約是這筆交易中最賺錢的部分。']]},
{id:'v5208',w:'meticulous',kk:'məˈtɪkjələs',pos:'adj.',zh:'一絲不苟的',ic:'🔬',u:'s5u6',lure:['careful','ridiculous'],
 ex:[['She keeps meticulous notes.','她的筆記做得一絲不苟。'],
     ['The audit requires meticulous record keeping.','查核需要極為嚴謹的紀錄。']]},
{id:'v5209',w:'mitigate',kk:'ˈmɪtəˌɡet',pos:'v.',zh:'減輕・緩和',ic:'🛡️',u:'s5u6',lure:['reduce','imitate'],
 ex:[['A hat will mitigate the heat a little.','戴帽子多少能緩解一點熱。'],
     ['We keep extra stock to mitigate the risk of shortages.','我們多備庫存以降低缺貨的風險。']]},
{id:'v5210',w:'prudent',kk:'ˈprudṇt',pos:'adj.',zh:'審慎的',ic:'🧭',u:'s5u6',lure:['careful','present'],
 ex:[['It is prudent to keep the receipt.','留著收據比較保險。'],
     ['A prudent forecast assumes slower growth.','審慎的預測會假設成長趨緩。']]},
{id:'v5211',w:'redundant',kk:'rɪˈdʌndənt',pos:'adj.',zh:'多餘的・被裁撤的',ic:'♻️',u:'s5u6',lure:['reluctant','necessary'],
 ex:[['The last sentence is redundant.','最後那一句是多餘的。'],
     ['Two systems doing the same job are redundant.','兩套系統做同一件事就是重複。']]},
{id:'v5212',w:'stringent',kk:'ˈstrɪndʒənt',pos:'adj.',zh:'嚴格的',ic:'🔒',u:'s5u6',lure:['strange','urgent'],
 ex:[['The gym has stringent rules about shoes.','那間健身房對鞋子的規定很嚴。'],
     ['Food exporters face stringent safety checks.','食品出口商要面對嚴格的安全檢查。']]},
{id:'v5213',w:'oversight',kk:'ˈovɚˌsaɪt',pos:'n.',zh:'疏忽・沒注意到',ic:'🕳️',u:'s5u6',lure:['oversee','overall'],
 ex:[['The missing name was an oversight.','漏掉那個名字是一時疏忽。'],
     ['Two invoices went unpaid through an oversight in the filing.','因歸檔上的疏忽，有兩張請款單漏付了。']]},
{id:'v5214',w:'unprecedented',kk:'ʌnˈprɛsəˌdɛntɪd',pos:'adj.',zh:'前所未有的',ic:'🚀',u:'s5u6',lure:['unexpected','recent'],
 ex:[['We had an unprecedented number of visitors.','我們迎來前所未有的訪客人數。'],
     ['Demand reached an unprecedented level last quarter.','上一季的需求達到前所未有的高點。']]},

/* ===================== U62 倒裝與假設語氣進階 ===================== */
{id:'v5301',w:'scarcely',kk:'ˈskɛrslɪ',pos:'adv.',zh:'幾乎沒有・才剛',ic:'🪫',u:'s5u7',lure:['seldom','clearly'],
 ex:[['I had scarcely sat down when the phone rang.','我才剛坐下電話就響了。'],
     ['Scarcely had the notice gone out when questions started arriving.','公告才剛發出去，問題就湧進來了。']]},
{id:'v5302',w:'hypothetical',kk:'ˌhaɪpəˈθɛtɪkḷ',pos:'adj.',zh:'假設的',ic:'💭',u:'s5u7',lure:['practical','possible'],
 ex:[['Let me give you a hypothetical example.','我舉一個假設的例子。'],
     ['The question is hypothetical; no such order exists yet.','這個問題是假設性的，目前還沒有這樣的訂單。']]},
{id:'v5303',w:'presume',kk:'prɪˈzum',pos:'v.',zh:'推測・料想',ic:'🤔',u:'s5u7',lure:['assume','resume'],
 ex:[['I presume you have already eaten.','我猜你已經吃過了。'],
     ['We presumed the shipment had left, but it was still here.','我們原以為貨已經出了，結果還在這裡。']]},
{id:'v5304',w:'deem',kk:'dim',pos:'v.',zh:'認為・視為',ic:'⚖️',u:'s5u7',lure:['decide','seem'],
 ex:[['The referee deemed the goal valid.','裁判認定那球有效。'],
     ['Any application deemed incomplete will be returned.','任何被視為不完整的申請都會被退回。']]},
{id:'v5305',w:'contrary',kk:'ˈkɑntrɛrɪ',pos:'n./adj.',zh:'相反・相反的',ic:'↔️',u:'s5u7',lure:['contract','current'],
 ex:[['On the contrary, I liked it.','正好相反，我很喜歡。'],
     ['Contrary to the forecast, sales held steady.','與預測相反，業績維持穩定。']]},
{id:'v5306',w:'nonetheless',kk:'ˌnʌnðəˈlɛs',pos:'adv.',zh:'儘管如此（副詞）',ic:'🧱',u:'s5u7',lure:['notwithstanding','therefore'],
 ex:[['It rained; nonetheless, we had fun.','雖然下雨，我們還是玩得很開心。'],
     ['The costs rose; nonetheless the project finished on time.','成本上升，儘管如此案子仍準時完成。']]},
{id:'v5307',w:'undoubtedly',kk:'ʌnˈdaʊtɪdlɪ',pos:'adv.',zh:'無疑地',ic:'💯',u:'s5u7',lure:['certainly','probably'],
 ex:[['This is undoubtedly the best one.','這無疑是最好的一個。'],
     ['The delay was undoubtedly caused by the port closure.','延誤無疑是港口關閉造成的。']]},
{id:'v5308',w:'outset',kk:'ˈaʊtˌsɛt',pos:'n.',zh:'開端・一開始',ic:'🎬',u:'s5u7',lure:['outcome','output'],
 ex:[['I said so at the outset.','我一開始就這麼說了。'],
     ['Costs were underestimated from the outset.','成本從一開始就被低估了。']]},

/* ===================== U63 推論題專攻 ===================== */
{id:'v5401',w:'infer',kk:'ɪnˈfɝ',pos:'v.',zh:'推論・看出',ic:'🧠',u:'s5u8',lure:['imply','offer'],
 ex:[['From her face I inferred that something was wrong.','從她的表情我看出事情不對勁。'],
     ['What can be inferred about the writer\'s plan?','關於寫信者的計畫，可以推論出什麼？']]},
{id:'v5402',w:'implication',kk:'ˌɪmpləˈkeʃən',pos:'n.',zh:'言外之意・影響',ic:'💬',u:'s5u8',lure:['application','explanation'],
 ex:[['I did not like the implication of his question.','我不喜歡他那個問題的言外之意。'],
     ['The change has cost implications for every branch.','這項變動對每一家分店都有成本上的影響。']]},
{id:'v5403',w:'presumably',kk:'prɪˈzuməblɪ',pos:'adv.',zh:'想必・大概',ic:'🔮',u:'s5u8',lure:['certainly','previously'],
 ex:[['He is not here, so presumably he missed the bus.','他不在，想必是錯過公車了。'],
     ['The office is dark, so presumably everyone has gone home.','辦公室是暗的，大概大家都回家了。']]},
{id:'v5404',w:'allude',kk:'əˈlud',pos:'v.',zh:'暗指・間接提到',ic:'👉',u:'s5u8',lure:['include','conclude'],
 ex:[['She alluded to the problem without naming it.','她暗示了那個問題，卻沒有點名。'],
     ['The letter alludes to an earlier complaint.','這封信間接提到了先前的一則客訴。']]},
{id:'v5405',w:'context',kk:'ˈkɑntɛkst',pos:'n.',zh:'上下文・來龍去脈',ic:'🖼️',u:'s5u8',lure:['contact','content'],
 ex:[['Read the whole line to get the context.','把整行讀完才看得出上下文。'],
     ['Out of context, that sentence sounds rude.','脫離上下文，那句話聽起來很沒禮貌。']]},
{id:'v5406',w:'compelling',kk:'kəmˈpɛlɪŋ',pos:'adj.',zh:'有說服力的・引人入勝的',ic:'🧲',u:'s5u8',lure:['complete','competing'],
 ex:[['That is a compelling story.','那是個很吸引人的故事。'],
     ['There is no compelling reason to change suppliers.','沒有強而有力的理由要換供應商。']]},
{id:'v5407',w:'conclusive',kk:'kənˈklusɪv',pos:'adj.',zh:'確鑿的・決定性的',ic:'🔏',u:'s5u8',lure:['plausible','exclusive'],
 ex:[['The test was not conclusive.','那項檢驗沒有得出確定的結果。'],
     ['We need conclusive evidence before we act.','行動之前我們需要確鑿的證據。']]},
{id:'v5408',w:'justify',kk:'ˈdʒʌstəˌfaɪ',pos:'v.',zh:'證明…正當・說明理由',ic:'🧾',u:'s5u8',lure:['explain','specify'],
 ex:[['You must justify every expense.','每一筆支出你都要說明理由。'],
     ['The saving does not justify the extra travel time.','省下的錢不足以合理化多出來的通勤時間。']]},
{id:'v5409',w:'attribute',kk:'əˈtrɪbjut',pos:'v.',zh:'把…歸因於',ic:'🎯',u:'s5u8',lure:['refer','contribute'],
 ex:[['She attributes her health to walking.','她把自己的健康歸功於走路。'],
     ['The rise was attributed to a change in packaging.','這次成長被歸因於包裝的改變。']]},
{id:'v5410',w:'explicit',kk:'ɪkˈsplɪsɪt',pos:'adj.',zh:'明確的・講明的',ic:'📌',u:'s5u8',lure:['implicit','expensive'],
 ex:[['Give me explicit instructions.','給我明確的指示。'],
     ['The notice is explicit about who may attend.','公告明確說明了誰可以參加。']]}

];
