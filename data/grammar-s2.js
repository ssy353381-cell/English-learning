/* ==========================================================================
   grammar-s2.js — Stage 2 文法點（Unit 26–27）
   完成式是中文母語者的第一個大坎：中文沒有這個時態，只能靠「這件事跟現在
   有沒有關係」來判斷，所以教學卡把重點放在時間軸而不是公式。
   ========================================================================== */
window.DATA_GRAMMAR_S2 = [

/* ================================================== U26 現在完成式 */
{
  id:'g2601', u:'s2u1', title:'現在完成式 have / has + p.p.',
  teach:{
    title:'現在完成式：過去發生，但重點在現在',
    lead:'中文沒有完成式，所以這個時態不能用翻譯來記。判斷方法只有一個：這件事「跟現在還有沒有關係」。有關係就用完成式，純粹講過去就用過去式。',
    sections:[
      { formula:'have / has ＋ 過去分詞（p.p.）',
        formulaNote:'I / You / We / They ＋ have　　He / She / It ＋ has' },
      { h:'三種一定用完成式的情況',
        list:['<b>剛剛完成、現在還看得到結果</b>：I <b>have lost</b> my key.（鑰匙現在還沒找到）',
              '<b>從過去到現在的經驗</b>：She <b>has worked</b> here for five years.（現在還在這裡）',
              '<b>問「有沒有做過」</b>：<b>Have</b> you <b>ever been</b> to Japan?'],
        ex:[['I have finished the report.','我把報告做完了。（現在可以交了）'],
            ['She has worked here since 2020.','她從 2020 年就在這裡工作。（現在還在）'],
            ['Have you ever tried oysters?','你吃過牡蠣嗎？']] },
      { h:'配套的四個字（多益必考）',
        table:{ head:['字','位置','意思','例句'],
          rows:[['already','have 之後','已經（比預期早）','I have <b>already</b> sent it.'],
                ['yet','句尾','還沒 / 了嗎（否定與疑問）','She hasn\'t called <b>yet</b>.'],
                ['just','have 之後','剛剛','He has <b>just</b> left.'],
                ['ever','have 之後','曾經（用在疑問句）','Have you <b>ever</b> flown business class?']] } },
      { h:'for 還是 since？',
        table:{ head:['','接什麼','例子'],
          rows:[['for','一段時間長度','for three years、for two hours、for a long time'],
                ['since','起點的時間點','since 2020、since March、since I was ten']] },
        ex:[['I have studied English for six years.','我學英文六年了。'],
            ['I have studied English since 2019.','我從 2019 年開始學英文。']] },
      { warn:'完成式後面接的是<b>過去分詞</b>，不是過去式。<b>I have went.</b> ❌ → <b>I have gone.</b> ✅　go-went-gone 的第三格，這就是為什麼上一階段要背不規則動詞三態。' },
      { tip:'has 只跟 he / she / it 走。主詞是 my manager、the company、everyone 這種單數名詞時，一樣用 has。' }
    ]
  },
  sents:[['I have finished my work.','我做完工作了。'],
         ['She has just left the office.','她剛離開辦公室。'],
         ['We have already received your email.','我們已經收到你的信了。'],
         ['They have not replied yet.','他們還沒回覆。'],
         ['Have you ever worked abroad?','你在國外工作過嗎？'],
         ['He has lived here for ten years.','他在這裡住了十年。'],
         ['The manager has approved the plan.','經理核准這個計畫了。'],
         ['I have made a reservation for two.','我訂了兩個人的位子。']],
  qs:[
    { k:'mc', q:'I ___ already sent the invitation.', opts:['have','has','am','did'], a:0, zh:'我已經把邀請函寄出去了。', why:'主詞 I 用 <b>have</b>。' },
    { k:'mc', q:'She ___ just finished the report.', opts:['have','has','is','was'], a:1, zh:'她剛把報告做完。', why:'主詞 She 是第三人稱單數，用 <b>has</b>。' },
    { k:'mc', q:'We have ___ the payment already.', opts:['receive','received','receiving','receives'], a:1, zh:'我們已經收到款項了。', why:'have 後面要接過去分詞 received。' },
    { k:'mc', q:'They have not ___ a decision yet.', opts:['make','made','makes','making'], a:1, zh:'他們還沒做出決定。', why:'make-made-made，過去分詞是 made。' },
    { k:'mc', q:'Have you ___ been to Japan?', opts:['already','ever','yet','just'], a:1, zh:'你去過日本嗎？', why:'問經驗用 <b>ever</b>；already 用在肯定句、yet 放句尾。' },
    { k:'mc', q:'The shipment has not arrived ___.', opts:['already','ever','yet','just'], a:2, zh:'貨還沒到。', why:'否定句講「還沒」用 <b>yet</b>，而且放句尾。' },
    { k:'mc', q:'He has worked here ___ 2020.', opts:['for','since','from','in'], a:1, zh:'他從 2020 年就在這裡工作。', why:'2020 是時間點，用 <b>since</b>。' },
    { k:'mc', q:'She has studied English ___ six years.', opts:['for','since','from','at'], a:0, zh:'她學英文六年了。', why:'six years 是一段長度，用 <b>for</b>。' },
    { k:'mc', q:'My manager ___ approved my leave.', opts:['have','has','are','were'], a:1, zh:'我的經理已經核准我的假了。', why:'My manager 是單數，用 has。' },
    { k:'fix', q:'I have went to the bank already.', a:'I have gone to the bank already.', zh:'我已經去過銀行了。', hint:'go 的第三格是哪一個？', why:'go-went-<b>gone</b>，完成式要用過去分詞 gone。' },
    { k:'fix', q:'She have just left the office.', a:'She has just left the office.', zh:'她剛離開辦公室。', hint:'主詞是第三人稱單數', why:'She 要配 <b>has</b>。' },
    { k:'fix', q:'Have you finished the report yet ?', a:'Have you finished the report yet?', zh:'你報告做完了嗎？', hint:'看看標點', why:'問號前面不空格；yet 放句尾是對的。' },
    { k:'cloze', q:'We ___ ___ received your application. (already)', a:'have already', zh:'我們已經收到你的申請了。', why:'already 夾在 have 和過去分詞中間。' },
    { k:'cloze', q:'He ___ just ___ the office. (leave)', a:'has left', zh:'他剛離開辦公室。', why:'He 配 has；leave 的過去分詞是 left。' },
    { k:'trans', q:'', a:'I have already sent the email.', alt:['I have sent the email already.'], zh:'我已經把那封信寄出去了。', why:'already 放 have 之後或句尾都可以。' },
    { k:'trans', q:'', a:'Have you ever worked abroad?', alt:['Have you ever worked overseas?'], zh:'你在國外工作過嗎？', why:'問經驗：Have + 主詞 + ever + p.p.' }
  ]
},

/* ================================================== U27 完成式 vs 過去式 */
{
  id:'g2701', u:'s2u2', title:'現在完成式 vs 過去簡單式',
  teach:{
    title:'完成式 vs 過去式：看句子裡有沒有「結案的時間」',
    lead:'兩個時態講的都是過去發生的事，差別只有一個：句子裡有沒有指明「那件事已經結束在某個時間點」。有明確的過去時間 → 過去式；沒有、或還連著現在 → 完成式。',
    sections:[
      { formula:'yesterday / last week / in 2019 / ago　→　過去式<br>since / for / already / yet / just / ever　→　完成式',
        formulaNote:'看到這些字，時態幾乎就決定了' },
      { h:'同一件事，兩種說法',
        table:{ speak:true, head:['句子','時態','言下之意'],
          rows:[['I lost my key yesterday.','過去式','昨天弄丟了（可能後來找到了）'],
                ['I have lost my key.','完成式','弄丟了，<b>現在還沒找到</b>'],
                ['She worked here for five years.','過去式','她<b>已經離職了</b>'],
                ['She has worked here for five years.','完成式','她<b>現在還在職</b>']] } },
      { h:'最常見的組合：先完成式開場，再過去式補細節',
        list:['A: <b>Have</b> you <b>been</b> to Japan?（有沒有這個經驗）',
              'B: Yes, I <b>went</b> there last spring.（講到確切時間，換過去式）'],
        ex:[['I have visited Tokyo three times.','我去過東京三次。'],
            ['I visited Tokyo in 2019.','我 2019 年去了東京。'],
            ['Our company has expanded a lot.','我們公司擴展了很多。'],
            ['Our company expanded into Vietnam in 2019.','我們公司 2019 年拓展到越南。']] },
      { warn:'有明確過去時間就<b>不能</b>用完成式：<b>I have finished it yesterday.</b> ❌ → <b>I finished it yesterday.</b> ✅　這是多益 Part 5 最愛的陷阱。' },
      { tip:'ago 一定配過去式（three days ago），lately / recently 一定配完成式。看到 ago 就別想完成式了。' }
    ]
  },
  sents:[['I finished the report yesterday.','我昨天把報告做完了。'],
         ['I have finished the report.','我把報告做完了。'],
         ['She resigned last month.','她上個月辭職了。'],
         ['She has resigned.','她辭職了。'],
         ['He graduated in 2018.','他 2018 年畢業。'],
         ['He has graduated from a business school.','他從商學院畢業了。'],
         ['We expanded overseas three years ago.','我們三年前拓展到海外。'],
         ['Sales have continued to grow since March.','業績從三月起持續成長。']],
  qs:[
    { k:'mc', q:'I ___ the report yesterday.', opts:['finish','finished','have finished','has finished'], a:1, zh:'我昨天把報告做完了。', why:'有 yesterday 這個明確的過去時間，用<b>過去式</b>。' },
    { k:'mc', q:'I ___ the report, so you can read it now.', opts:['finish','finished','have finished','had finish'], a:2, zh:'我把報告做完了，你現在可以看。', why:'沒有過去時間點，而且跟現在有關 → 完成式。' },
    { k:'mc', q:'She ___ for this company since 2020.', opts:['works','worked','has worked','is working'], a:2, zh:'她從 2020 年起在這家公司上班。', why:'since + 完成式，表示現在還在職。' },
    { k:'mc', q:'He ___ his previous job three years ago.', opts:['leaves','left','has left','have left'], a:1, zh:'他三年前離開了上一份工作。', why:'ago 一定配過去式。' },
    { k:'mc', q:'Our manager ___ to Tainan last April.', opts:['transfers','transferred','has transferred','have transferred'], a:1, zh:'我們經理去年四月調到台南。', why:'last April 是明確過去時間。' },
    { k:'mc', q:'Sales ___ a lot lately.', opts:['improve','improved','have improved','improves'], a:2, zh:'業績最近改善很多。', why:'lately / recently 配完成式。' },
    { k:'mc', q:'A: Have you ever been to Kyoto?　B: Yes, I ___ there in 2022.', opts:['go','went','have gone','has been'], a:1, zh:'A：你去過京都嗎？B：有，我 2022 年去的。', why:'問經驗用完成式，回答講到年份就換<b>過去式</b>。' },
    { k:'mc', q:'The company ___ overseas offices since 2019.', opts:['opens','opened','has opened','open'], a:2, zh:'這家公司從 2019 年起陸續開設海外辦公室。', why:'since 起點到現在還在延續 → 完成式。' },
    { k:'mc', q:'I ___ my keys. I still can\'t find them.', opts:['lose','lost','have lost','had lost'], a:2, zh:'我把鑰匙弄丟了，到現在還找不到。', why:'「現在還沒找到」是結果延續到現在 → 完成式。' },
    { k:'fix', q:'I have finished the project last Friday.', a:'I finished the project last Friday.', zh:'我上週五把專案做完了。', hint:'句子裡有明確的過去時間', why:'last Friday 是結案時間，不能用完成式。' },
    { k:'fix', q:'She has resigned two months ago.', a:'She resigned two months ago.', zh:'她兩個月前辭職了。', hint:'ago 要配什麼時態？', why:'ago 一律配過去式。' },
    { k:'fix', q:'He works here since 2020.', a:'He has worked here since 2020.', zh:'他從 2020 年起在這裡工作。', hint:'since 要配什麼時態？', why:'since 要配現在完成式。' },
    { k:'cloze', q:'We ___ our overseas office in 2019. (open)', a:'opened', zh:'我們 2019 年開了海外辦公室。', why:'in 2019 是明確過去時間 → 過去式。' },
    { k:'cloze', q:'Sales ___ ___ since March. (grow)', a:'have grown', zh:'業績從三月起成長。', why:'since 配現在完成式，grow-grew-grown。' },
    { k:'trans', q:'', a:'She resigned last month.', alt:['She quit last month.'], zh:'她上個月辭職了。', why:'last month 是明確過去時間 → 過去式。' },
    { k:'trans', q:'', a:'I have worked here for five years.', alt:['I have worked here for 5 years.'], zh:'我在這裡工作五年了。', why:'for + 一段時間，配現在完成式表示現在還在。' }
  ]
}

];
