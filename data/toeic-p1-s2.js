/* ==========================================================================
   toeic-p1-s2.js — 多益 Part 1：看圖聽描述（Stage 2）
   --------------------------------------------------------------------------
   圖片直接以 SVG 內嵌在資料裡，不走外部檔案：
     · file:// 下沒有 fetch，外部圖片路徑在單檔版也會斷掉
     · 內嵌 SVG 跟著打包一起走，離線也看得到
   場景刻意畫得簡單，但「誰在做什麼」必須一眼分辨得出來 —— 那正是 Part 1
   要考的能力。四個選項的差異都落在動作或對象上，不是字彙難度。
   ========================================================================== */
window.DATA_PHOTO_S2 = [

/* ---------------- U26 ---------------- */
{
  id:'p2601', u:'s2u1',
  svg:'<svg viewBox="0 0 400 240" role="img" aria-label="辦公室裡一名男子站在影印機旁，一名女子坐在桌前使用筆電">' +
      '<rect width="400" height="240" fill="#eef3f7"/><rect y="188" width="400" height="52" fill="#dbe4ec"/>' +
      '<rect x="286" y="38" width="88" height="60" rx="4" fill="#cfe8f7" stroke="#b6ccd9" stroke-width="3"/>' +
      '<line x1="330" y1="38" x2="330" y2="98" stroke="#b6ccd9" stroke-width="3"/>' +
      '<rect x="38" y="116" width="76" height="72" rx="6" fill="#b7c5d1"/>' +
      '<rect x="46" y="126" width="60" height="22" rx="3" fill="#7f909e"/>' +
      '<rect x="50" y="158" width="52" height="7" rx="2" fill="#ffffff"/>' +
      '<circle cx="104" cy="122" r="4" fill="#5aa02c"/>' +
      '<circle cx="152" cy="84" r="15" fill="#f4cba6"/>' +
      '<path d="M138 82a14 14 0 0 1 28 0z" fill="#4a3b30"/>' +
      '<path d="M135 188 L135 106 Q152 96 169 106 L169 188 Z" fill="#4a7fb5"/>' +
      '<path d="M169 118 L193 130" stroke="#f4cba6" stroke-width="10" stroke-linecap="round"/>' +
      '<rect x="183" y="119" width="28" height="20" rx="2" fill="#ffffff" stroke="#c3cdd6" stroke-width="2"/>' +
      '<rect x="248" y="146" width="126" height="9" rx="2" fill="#c98b5a"/>' +
      '<rect x="256" y="155" width="9" height="33" fill="#a8703f"/>' +
      '<rect x="357" y="155" width="9" height="33" fill="#a8703f"/>' +
      '<rect x="262" y="120" width="10" height="68" rx="3" fill="#8b9aa5"/>' +
      '<circle cx="296" cy="96" r="14" fill="#f4cba6"/>' +
      '<path d="M282 96a14 14 0 0 1 28 0l3 13h-34z" fill="#6b4a3a"/>' +
      '<path d="M283 146 L283 116 Q296 107 309 116 L309 146 Z" fill="#c8677f"/>' +
      '<rect x="314" y="126" width="34" height="20" rx="2" fill="#63737f"/>' +
      '<rect x="317" y="129" width="28" height="14" fill="#cfe6f5"/>' +
      '<rect x="310" y="146" width="42" height="4" rx="2" fill="#8b9aa5"/></svg>',
  opts:['A man is standing next to a copy machine.',
        'A woman is talking on the phone.',
        'They are leaving the office.',
        'The copy machine has been moved outside.'],
  a:0,
  zh:['一名男子站在影印機旁。','一名女子正在講電話。','他們正要離開辦公室。','影印機已經被搬到外面了。'],
  why:'男子站在影印機旁邊拿著紙 → A。女子在用筆電不是講電話，兩個人都還在辦公室裡。'
},
{
  id:'p2602', u:'s2u1',
  svg:'<svg viewBox="0 0 400 240" role="img" aria-label="咖啡店裡服務生端著托盤，兩位客人坐在桌邊">' +
      '<rect width="400" height="240" fill="#f6efe6"/><rect y="190" width="400" height="50" fill="#e6d8c6"/>' +
      '<rect x="20" y="46" width="90" height="58" rx="4" fill="#c8a97e"/>' +
      '<rect x="26" y="54" width="34" height="18" rx="2" fill="#fff4e2"/>' +
      '<rect x="68" y="54" width="34" height="18" rx="2" fill="#fff4e2"/>' +
      '<rect x="26" y="80" width="76" height="16" rx="2" fill="#a98559"/>' +
      '<circle cx="88" cy="96" r="15" fill="#f4cba6"/>' +
      '<path d="M74 94a14 14 0 0 1 28 0z" fill="#2f2a26"/>' +
      '<path d="M71 190 L71 118 Q88 108 105 118 L105 190 Z" fill="#3f5a4a"/>' +
      '<path d="M105 130 L131 138" stroke="#f4cba6" stroke-width="10" stroke-linecap="round"/>' +
      '<rect x="118" y="128" width="42" height="8" rx="3" fill="#b98d5b"/>' +
      '<circle cx="130" cy="123" r="6" fill="#ffffff"/><circle cx="148" cy="123" r="6" fill="#ffffff"/>' +
      '<ellipse cx="286" cy="168" rx="76" ry="12" fill="#c8a97e"/>' +
      '<rect x="282" y="168" width="8" height="26" fill="#a98559"/>' +
      '<circle cx="238" cy="104" r="14" fill="#f4cba6"/>' +
      '<path d="M224 104a14 14 0 0 1 28 0l3 12h-34z" fill="#7a4b2a"/>' +
      '<path d="M225 162 L225 124 Q238 115 251 124 L251 162 Z" fill="#4a7fb5"/>' +
      '<path d="M251 136 L266 152" stroke="#f4cba6" stroke-width="9" stroke-linecap="round"/>' +
      '<rect x="262" y="146" width="14" height="14" rx="2" fill="#ffffff" stroke="#d9c6ae" stroke-width="2"/>' +
      '<circle cx="336" cy="104" r="14" fill="#f4cba6"/>' +
      '<path d="M322 102a14 14 0 0 1 28 0z" fill="#3b3229"/>' +
      '<path d="M323 162 L323 124 Q336 115 349 124 L349 162 Z" fill="#d4a33e"/>' +
      '<rect x="300" y="150" width="16" height="12" rx="2" fill="#ffffff" stroke="#d9c6ae" stroke-width="2"/></svg>',
  opts:['The customers are standing in line.',
        'A waiter is carrying a tray.',
        'A man is washing the dishes.',
        'All the tables have been cleared.'],
  a:1,
  zh:['客人正在排隊。','一名服務生端著托盤。','一名男子正在洗碗。','所有桌子都已經收拾乾淨了。'],
  why:'服務生手上端著托盤 → B。兩位客人是坐著的，桌上還有杯子。'
},
{
  id:'p2603', u:'s2u1',
  svg:'<svg viewBox="0 0 400 240" role="img" aria-label="倉庫裡一名戴安全帽的工人推著裝滿箱子的推車，後方是放滿貨物的層架">' +
      '<rect width="400" height="240" fill="#eff0ea"/><rect y="192" width="400" height="48" fill="#d9dbd2"/>' +
      '<rect x="232" y="52" width="150" height="140" fill="none" stroke="#9aa08f" stroke-width="6"/>' +
      '<line x1="232" y1="98" x2="382" y2="98" stroke="#9aa08f" stroke-width="6"/>' +
      '<line x1="232" y1="145" x2="382" y2="145" stroke="#9aa08f" stroke-width="6"/>' +
      '<rect x="242" y="62" width="40" height="32" rx="2" fill="#d9a441"/>' +
      '<rect x="290" y="66" width="34" height="28" rx="2" fill="#c98b5a"/>' +
      '<rect x="332" y="60" width="44" height="34" rx="2" fill="#d9a441"/>' +
      '<rect x="244" y="110" width="48" height="33" rx="2" fill="#c98b5a"/>' +
      '<rect x="300" y="112" width="38" height="31" rx="2" fill="#d9a441"/>' +
      '<rect x="344" y="108" width="34" height="35" rx="2" fill="#c98b5a"/>' +
      '<rect x="246" y="158" width="42" height="32" rx="2" fill="#d9a441"/>' +
      '<rect x="298" y="156" width="46" height="34" rx="2" fill="#c98b5a"/>' +
      '<rect x="96" y="150" width="86" height="10" rx="3" fill="#6b7a86"/>' +
      '<rect x="100" y="118" width="74" height="32" rx="2" fill="#c98b5a"/>' +
      '<rect x="108" y="92" width="56" height="26" rx="2" fill="#d9a441"/>' +
      '<circle cx="112" cy="182" r="13" fill="#3d4750"/><circle cx="112" cy="182" r="5" fill="#8b9aa5"/>' +
      '<circle cx="168" cy="182" r="13" fill="#3d4750"/><circle cx="168" cy="182" r="5" fill="#8b9aa5"/>' +
      '<path d="M182 155 L196 130" stroke="#6b7a86" stroke-width="7" stroke-linecap="round"/>' +
      '<circle cx="212" cy="96" r="15" fill="#f4cba6"/>' +
      '<path d="M196 92a16 15 0 0 1 32 0z" fill="#ffb020"/>' +
      '<rect x="194" y="90" width="36" height="5" rx="2" fill="#e09400"/>' +
      '<path d="M195 192 L195 118 Q212 108 229 118 L229 192 Z" fill="#e2762f"/>' +
      '<path d="M196 124 L182 136" stroke="#f4cba6" stroke-width="10" stroke-linecap="round"/></svg>',
  opts:['The shelves have been emptied.',
        'A man is climbing a ladder.',
        'A worker is pushing a cart.',
        'The boxes are being loaded into a truck.'],
  a:2,
  zh:['層架已經被清空了。','一名男子正在爬梯子。','一名工人正在推推車。','箱子正被裝上卡車。'],
  why:'戴安全帽的工人推著堆滿箱子的推車 → C。後面的層架是滿的，畫面裡沒有梯子也沒有卡車。'
},

/* ---------------- U27 ---------------- */
{
  id:'p2604', u:'s2u2',
  svg:'<svg viewBox="0 0 400 240" role="img" aria-label="會議室裡三人坐在桌邊，一人站著指向牆上的圖表">' +
      '<rect width="400" height="240" fill="#eef3f7"/><rect y="196" width="400" height="44" fill="#dbe4ec"/>' +
      '<rect x="36" y="36" width="120" height="82" rx="4" fill="#ffffff" stroke="#b6ccd9" stroke-width="3"/>' +
      '<rect x="50" y="88" width="14" height="20" fill="#4a7fb5"/><rect x="70" y="72" width="14" height="36" fill="#4a7fb5"/>' +
      '<rect x="90" y="58" width="14" height="50" fill="#58cc02"/><rect x="110" y="80" width="14" height="28" fill="#4a7fb5"/>' +
      '<polyline points="50,96 77,80 97,62 124,70" fill="none" stroke="#ff7a45" stroke-width="3"/>' +
      '<circle cx="186" cy="82" r="14" fill="#f4cba6"/>' +
      '<path d="M172 82a14 14 0 0 1 28 0l3 12h-34z" fill="#6b4a3a"/>' +
      '<path d="M172 196 L172 104 Q186 94 200 104 L200 196 Z" fill="#8a63c0"/>' +
      '<path d="M172 110 L150 92" stroke="#f4cba6" stroke-width="9" stroke-linecap="round"/>' +
      '<ellipse cx="300" cy="168" rx="92" ry="16" fill="#c98b5a"/>' +
      '<rect x="296" y="168" width="9" height="28" fill="#a8703f"/>' +
      '<circle cx="248" cy="112" r="13" fill="#f4cba6"/>' +
      '<path d="M235 110a13 13 0 0 1 26 0z" fill="#3b3229"/>' +
      '<path d="M236 162 L236 130 Q248 122 260 130 L260 162 Z" fill="#4a7fb5"/>' +
      '<circle cx="316" cy="108" r="13" fill="#f4cba6"/>' +
      '<path d="M303 108a13 13 0 0 1 26 0l3 11h-32z" fill="#7a4b2a"/>' +
      '<path d="M304 160 L304 126 Q316 118 328 126 L328 160 Z" fill="#c8677f"/>' +
      '<circle cx="374" cy="118" r="12" fill="#f4cba6"/>' +
      '<path d="M362 116a12 12 0 0 1 24 0z" fill="#2f2a26"/>' +
      '<path d="M363 164 L363 134 Q374 127 385 134 L385 164 Z" fill="#d4a33e"/>' +
      '<rect x="262" y="150" width="30" height="8" rx="2" fill="#ffffff" stroke="#c3cdd6" stroke-width="2"/>' +
      '<rect x="330" y="152" width="26" height="7" rx="2" fill="#ffffff" stroke="#c3cdd6" stroke-width="2"/></svg>',
  opts:['The room has been left empty.',
        'They are eating lunch together.',
        'Everyone is standing up.',
        'One of them is pointing at a chart.'],
  a:3,
  zh:['房間已經被清空了。','他們正在一起吃午餐。','所有人都站著。','其中一人正指著一張圖表。'],
  why:'站著的人伸手指向牆上的長條圖 → D。另外三人是坐著的，桌上沒有食物。'
},
{
  id:'p2605', u:'s2u2',
  svg:'<svg viewBox="0 0 400 240" role="img" aria-label="公車站牌旁一名女子提著行李箱等車，公車正駛近">' +
      '<rect width="400" height="240" fill="#e9f1f6"/><rect y="186" width="400" height="54" fill="#c9d2d8"/>' +
      '<rect y="186" width="400" height="5" fill="#9aa6ae"/>' +
      '<line x1="20" y1="214" x2="70" y2="214" stroke="#ffffff" stroke-width="5"/>' +
      '<line x1="110" y1="214" x2="160" y2="214" stroke="#ffffff" stroke-width="5"/>' +
      '<rect x="52" y="60" width="9" height="126" fill="#7d8f9e"/>' +
      '<rect x="30" y="52" width="54" height="34" rx="4" fill="#1cb0f6"/>' +
      '<text x="57" y="75" font-size="20" text-anchor="middle" fill="#ffffff">🚌</text>' +
      '<circle cx="150" cy="82" r="15" fill="#f4cba6"/>' +
      '<path d="M136 82a14 14 0 0 1 28 0l4 16h-36z" fill="#5b4636"/>' +
      '<path d="M136 186 L136 104 Q150 94 164 104 L164 186 Z" fill="#e2762f"/>' +
      '<path d="M164 116 L178 140" stroke="#f4cba6" stroke-width="9" stroke-linecap="round"/>' +
      '<rect x="172" y="140" width="34" height="46" rx="4" fill="#3f5a4a"/>' +
      '<rect x="172" y="156" width="34" height="5" fill="#2c4034"/>' +
      '<rect x="183" y="132" width="12" height="10" rx="3" fill="none" stroke="#3f5a4a" stroke-width="3"/>' +
      '<rect x="248" y="92" width="140" height="76" rx="8" fill="#ffc800"/>' +
      '<rect x="258" y="104" width="34" height="26" rx="3" fill="#cfe6f5"/>' +
      '<rect x="300" y="104" width="34" height="26" rx="3" fill="#cfe6f5"/>' +
      '<rect x="342" y="104" width="36" height="26" rx="3" fill="#cfe6f5"/>' +
      '<rect x="248" y="140" width="140" height="8" fill="#e0a800"/>' +
      '<circle cx="282" cy="172" r="16" fill="#3d4750"/><circle cx="282" cy="172" r="6" fill="#8b9aa5"/>' +
      '<circle cx="356" cy="172" r="16" fill="#3d4750"/><circle cx="356" cy="172" r="6" fill="#8b9aa5"/></svg>',
  opts:['A woman is waiting with a suitcase.',
        'She is getting off a train.',
        'The bus stop is empty.',
        'She is riding a bicycle.'],
  a:0,
  zh:['一名女子帶著行李箱在等車。','她正從火車上下來。','公車站空無一人。','她正在騎腳踏車。'],
  why:'女子站在公車站牌旁，手邊有一個行李箱 → A。車子是公車不是火車，她也還沒上車。'
},
{
  id:'p2606', u:'s2u2',
  svg:'<svg viewBox="0 0 400 240" role="img" aria-label="茶水間裡一名男子在水槽邊洗杯子，流理台上有一盆植物">' +
      '<rect width="400" height="240" fill="#f2f6f3"/><rect y="192" width="400" height="48" fill="#dde5df"/>' +
      '<rect x="24" y="40" width="120" height="46" rx="4" fill="#c6d3cb"/>' +
      '<line x1="84" y1="40" x2="84" y2="86" stroke="#a9b8af" stroke-width="3"/>' +
      '<rect x="20" y="146" width="360" height="14" rx="3" fill="#b9c7bf"/>' +
      '<rect x="20" y="160" width="360" height="32" fill="#cdd9d2"/>' +
      '<rect x="146" y="148" width="104" height="28" rx="4" fill="#8fa39a"/>' +
      '<rect x="154" y="154" width="88" height="18" rx="3" fill="#6e837a"/>' +
      // 水龍頭放在人的右側，不能被身體擋住 —— 擋住就看不出他在水槽邊
      '<path d="M258 148 L258 116 Q258 108 246 108 L232 108" fill="none" stroke="#7d8f9e" stroke-width="7" stroke-linecap="round"/>' +
      '<line x1="232" y1="114" x2="232" y2="152" stroke="#7fc6ec" stroke-width="5"/>' +
      '<circle cx="186" cy="80" r="15" fill="#f4cba6"/>' +
      '<path d="M171 78a15 15 0 0 1 30 0z" fill="#3b3229"/>' +
      '<path d="M170 148 L170 102 Q186 92 202 102 L202 148 Z" fill="#4a7fb5"/>' +
      '<path d="M200 112 L214 148" stroke="#f4cba6" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M172 112 L182 148" stroke="#f4cba6" stroke-width="9" stroke-linecap="round"/>' +
      '<circle cx="198" cy="152" r="9" fill="#ffffff" stroke="#c3cdd6" stroke-width="2"/>' +
      '<rect x="300" y="122" width="30" height="24" rx="4" fill="#c98b5a"/>' +
      '<path d="M315 122 C300 108 302 92 315 88 C328 92 330 108 315 122 Z" fill="#5aa02c"/>' +
      '<path d="M315 120 C328 112 340 114 344 122 C336 130 322 128 315 120 Z" fill="#46a302"/>' +
      '<rect x="52" y="126" width="18" height="20" rx="3" fill="#ffffff" stroke="#c3cdd6" stroke-width="2"/>' +
      '<rect x="78" y="126" width="18" height="20" rx="3" fill="#ffffff" stroke="#c3cdd6" stroke-width="2"/></svg>',
  opts:['He is drinking from a cup.',
        'He is watering the plant.',
        'He is washing cups at the sink.',
        'The sink has been removed.'],
  a:2,
  zh:['他正在用杯子喝東西。','他正在幫植物澆水。','他正在水槽邊洗杯子。','水槽已經被拆掉了。'],
  why:'男子雙手伸在水槽上方，水龍頭的水是開著的 → C。植物在流理台的另一端，他沒有碰到。'
}

];
