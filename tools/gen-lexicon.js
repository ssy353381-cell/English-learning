#!/usr/bin/env node
/* ==========================================================================
   tools/gen-lexicon.js — 產生 data/lexicon-*.js

   詞庫（lexicon）和課程單字（data/vocab-*.js）是兩件事：
     · vocab   「教得到的字」—— 綁關卡、有圖示、有刻意誘答，全部手寫
     · lexicon 「查得到的字」—— 不綁關卡，供例句點字查詢與詞庫特訓使用

   多益的字彙量級是一萬二，手寫不可能寫完，所以詞庫分兩層：
     · data/lexicon-core.js  手寫核心層，欄位與 vocab 同級（雙例句、延伸用法）
     · data/lexicon-N.js     這支腳本產生的自動層，永遠不要手改，改了會被蓋掉
   要把某個字升級成手寫品質，就把它搬進 lexicon-core.js —— 引擎以手寫層為準。

   ---------------------------------------------------------------------------
   外部輸入（體積太大，都不進 repo，用前自行下載）：

     ecdict.csv   https://raw.githubusercontent.com/skywind3000/ECDICT/master/ecdict.csv
                  MIT。77 萬筆英漢詞典，帶 BNC／COCA 詞頻、詞形變化、考試標籤。
                  中文是簡體，所以才需要下面那份對照表。

     opencc/      https://github.com/BYVoid/OpenCC → data/dictionary/
                  Apache-2.0。需要 STPhrases.txt、STCharacters.txt、
                  TWPhrases.txt、TWVariants.txt 四份。
                  詞組表要在字元表之前套用，否則「软件」會變成「軟件」而不是「軟體」。

     wn/          選用。WordNet 3.0 的 data.noun / data.verb / data.adj / data.adv，
                  https://raw.githubusercontent.com/nltk/nltk_data/gh-pages/packages/corpora/wordnet.zip
                  只拿它 gloss 裡引號包起來的英文例句 —— 自動層的字大多沒有中文例句，
                  有一句真的英文例句總好過只有一個中文詞義。

   用法：
     node tools/gen-lexicon.js --csv <ecdict.csv> --opencc <dir> [--wn <dir>] [--n 11000]

   零依賴，只用 Node 內建模組。
   ========================================================================== */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var ROOT = path.resolve(__dirname, '..');

/* ---------- 參數 ---------- */
function arg(name, def) {
  var i = process.argv.indexOf('--' + name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : def;
}

var CSV_PATH = arg('csv', '');
var OPENCC_DIR = arg('opencc', '');
var WN_DIR = arg('wn', '');
var TARGET = parseInt(arg('n', '11000'), 10);
var OUT_DIR = path.resolve(ROOT, arg('out', 'data'));

if (!CSV_PATH || !OPENCC_DIR) {
  console.error('用法：node tools/gen-lexicon.js --csv <ecdict.csv> --opencc <dir> [--wn <dir>] [--n 11000]');
  process.exit(1);
}

/* ==========================================================================
   1. 簡轉繁
   OpenCC 的做法是「長詞優先」：在每個位置試最長的詞組，配不到才退回單字。
   這裡照抄那個規則，四份表依序套用（詞組 → 單字 → 台灣詞組 → 台灣異體字）。
   ========================================================================== */
/**
 * 一個轉換回合 = 一組對照表合起來做最長匹配，先列的表優先。
 *
 * 兩件事看起來多餘但缺一不可：
 *   · 詞組表與單字表必須合成同一組，不能一組一組輪流跑。「公里」在詞組表裡
 *     是「公里 → 公里」的原樣對映，作用是攔住單字表的「里 → 裏」；分兩輪跑，
 *     第二輪照樣會把它改成「公裡」。
 *   · 左右相同的項目要留著，理由同上 —— 它們不是廢資料，是擋路用的。
 */
function loadGroup(files) {
  var map = {}, maxLen = 1, found = 0;
  files.forEach(function (file) {
    var abs = path.join(OPENCC_DIR, file);
    if (!fs.existsSync(abs)) return;
    found++;
    fs.readFileSync(abs, 'utf8').split('\n').forEach(function (line) {
      if (!line || line.charAt(0) === '#') return;
      var parts = line.split('\t');
      if (parts.length < 2) return;
      var k = parts[0];
      var v = parts[1].split(' ')[0];      // 一對多時取第一個候選，OpenCC 預設也是這樣
      if (!k || !v || Object.prototype.hasOwnProperty.call(map, k)) return;
      map[k] = v;
      if (k.length > maxLen) maxLen = k.length;
    });
  });
  return found ? { map: map, maxLen: maxLen } : null;
}

/* s2twp 的轉換鏈：簡轉繁 → 台灣詞彙 → 台灣異體字 */
var ROUNDS = [
  loadGroup(['STPhrases.txt', 'STCharacters.txt']),
  loadGroup(['TWPhrases.txt', 'TWPhrasesIT.txt', 'TWPhrasesName.txt', 'TWPhrasesOther.txt']),
  loadGroup(['TWVariants.txt'])
].filter(Boolean);

if (!ROUNDS.length || !ROUNDS[0]) {
  console.error('找不到 OpenCC 對照表，請確認 --opencc 指到 data/dictionary');
  process.exit(1);
}

function applyRound(s, t) {
  var out = '', i = 0, n = s.length;
  while (i < n) {
    var hit = null, len = Math.min(t.maxLen, n - i);
    for (; len >= 1; len--) {
      var seg = s.substr(i, len);
      if (Object.prototype.hasOwnProperty.call(t.map, seg)) { hit = t.map[seg]; break; }
    }
    if (hit !== null) { out += hit; i += len; }   // 配到就整段跳過，不再重掃
    else { out += s.charAt(i); i++; }
  }
  return out;
}

var s2tCache = {};
function s2t(s) {
  if (!s) return '';
  if (s2tCache[s] !== undefined) return s2tCache[s];
  var out = s;
  for (var i = 0; i < ROUNDS.length; i++) out = applyRound(out, ROUNDS[i]);
  s2tCache[s] = out;
  return out;
}

/* ==========================================================================
   2. 讀 repo 自己的資料
   要兩樣東西：
     · 課程已經教過的字 —— 詞庫不重複收（引擎查得到 vocab，那邊資料更好）
     · 已經寫好的中英例句 —— 自動層的字如果剛好出現在這些句子裡，就有例句可用
   ========================================================================== */
function loadRepoData() {
  var win = {};
  fs.readdirSync(path.join(ROOT, 'data')).sort().forEach(function (f) {
    if (f.slice(-3) !== '.js' || f.indexOf('lexicon-') === 0) return;
    var code = fs.readFileSync(path.join(ROOT, 'data', f), 'utf8');
    vm.runInNewContext(code, { window: win });
  });
  return win;
}

var REPO = loadRepoData();

var KNOWN = {};        // 課程已教的字
var CORPUS = [];       // [英文句, 中文句]

Object.keys(REPO).forEach(function (k) {
  var v = REPO[k];
  if (k.indexOf('DATA_VOCAB_') === 0 && v && v.length) {
    v.forEach(function (w) {
      KNOWN[String(w.w).toLowerCase()] = 1;
      (w.ex || []).forEach(function (p) { if (p[0] && p[1]) CORPUS.push([p[0], p[1]]); });
    });
  }
  if (k.indexOf('DATA_GRAMMAR_') === 0 && v && v.length) {
    v.forEach(function (g) {
      (g.sents || []).forEach(function (p) { if (p[0] && p[1]) CORPUS.push([p[0], p[1]]); });
      ((g.teach && g.teach.sections) || []).forEach(function (s) {
        (s.ex || []).forEach(function (p) { if (p[0] && p[1]) CORPUS.push([p[0], p[1]]); });
      });
    });
  }
});

/* 例句索引：句子裡出現過的每個字 → 句子編號。挑例句時用最短的那一句。 */
var CORPUS_BY_WORD = {};
CORPUS.forEach(function (pair, idx) {
  var seen = {};
  String(pair[0]).toLowerCase().replace(/[a-z']+/g, function (m) {
    var t = m.replace(/'s$/, '');
    if (t.length > 1 && !seen[t]) { seen[t] = 1; (CORPUS_BY_WORD[t] = CORPUS_BY_WORD[t] || []).push(idx); }
    return m;
  });
});

/* ==========================================================================
   3. 多益主題字
   純靠詞頻會漏掉多益的招牌字：invoice 的 COCA 排名一萬五，itinerary 更後面，
   但這兩個字每回考題都在。這份清單把它們無條件拉進來，是這支腳本裡
   唯一需要人腦判斷的部分。
   ========================================================================== */
var BIZ = ('accountant accounting acquisition adjourn advertisement agenda agreement allocate ' +
  'allowance amend amenity applicant appliance appointment appraisal apprentice assembly asset ' +
  'assignment attendee attorney auction audit authorize backlog balance bankruptcy bargain ' +
  'benchmark beneficiary bidder billing biography boardroom bonus bookkeeping booth branch ' +
  'brochure budget bulletin bureau cafeteria campaign cancellation candidate capacity cargo ' +
  'catalog certification checkout circulation clearance clerical client clientele closure ' +
  'commission commodity compensation competitor complimentary compliance component concourse ' +
  'conference confirmation consignment consultant consumer contractor contribution convention ' +
  'coordinator copier corporate correspondence coupon courier coverage credential creditor ' +
  'curriculum custodian customs deadline dealership debit deduction deficit delegate delegation ' +
  'delinquent departure deposit depreciation dermatologist directory disburse discontinue ' +
  'dispatch distributor dividend dossier downsizing downtime draft dues durable earnings ' +
  'efficiency eligibility employer enclosure endorsement enrollment entitle entrepreneur ' +
  'envelope equity ergonomic escort estimate excursion executive exempt exhibit expenditure ' +
  'expiration expertise expire fare faulty feasibility filing fiscal fleet forecast forfeit ' +
  'formality franchise freight fulfillment furnishing gratuity grievance handout headquarters ' +
  'hospitality hourly housekeeping identification implement incentive incorporate incur ' +
  'indemnity inflation initiative innovation inquiry inspection installment institution ' +
  'insurance intern inventory invoice itemize itinerary janitor keynote laborer landlord ' +
  'layoff lease ledger legislation liability licensing liquidation logistics luncheon ' +
  'maintenance mandatory manufacturer markup memorandum merchandise merger mileage mortgage ' +
  'negotiation newsletter nomination notify obsolete occupancy offset onsite operational ' +
  'ordinance outage outlet outsource overdue overhaul overhead oversee overtime packaging ' +
  'paperwork parcel patron payable payroll pension personnel petition pharmacist pledge ' +
  'portfolio postage postpone practitioner preliminary premise premium prescription ' +
  'presentation prestigious procurement productivity proficiency projection promotion ' +
  'proposal proprietor prospectus provider proximity publicity purchaser quota quotation ' +
  'reasonable rebate receipt receptionist recipient recruitment redeem redundancy referral ' +
  'refund refurbish regulation reimburse reimbursement relocation remittance renewal renovation ' +
  'rental reputable requisition reschedule reservation residence restructure resume retail ' +
  'retention retirement revenue reviewer roster royalty salary salesperson sanitation ' +
  'scaffolding scenario schedule secretarial sector seminar shareholder shipment shipping ' +
  'shortage showroom sightseeing signage solicit specification spokesperson staffing stationery ' +
  'statistic stipulate stockholder storage streamline subcontractor submission subscriber ' +
  'subscription subsidiary subsidy supervisor supplier surcharge surplus surveyor sustainable ' +
  'tariff taxation technician telecommuting tenant tentative terminal termination testimonial ' +
  'thermostat timetable transaction transcript transit transportation turnover typo undergo ' +
  'unveil upgrade utility vacancy valid validate vending vendor venue verification veteran ' +
  'vicinity vocational voucher warehouse warranty waive warranty wholesale withdrawal workforce ' +
  'workload workplace workshop').split(/\s+/);

var BIZ_SET = {};
BIZ.forEach(function (w) { if (w) BIZ_SET[w] = 1; });

/* ==========================================================================
   4. 讀 ECDICT
   ========================================================================== */
function parseCsv(text, onRow) {
  var i = 0, n = text.length, row = [], field = '', inQuote = false, header = null;
  function endField() { row.push(field); field = ''; }
  function endRow() {
    endField();
    if (!header) header = row;
    else if (row.length >= header.length - 2) {
      var o = {};
      for (var k = 0; k < header.length; k++) o[header[k]] = row[k] === undefined ? '' : row[k];
      onRow(o);
    }
    row = [];
  }
  while (i < n) {
    var c = text.charAt(i);
    if (inQuote) {
      if (c === '"') {
        if (text.charAt(i + 1) === '"') { field += '"'; i += 2; continue; }
        inQuote = false; i++; continue;
      }
      field += c; i++; continue;
    }
    if (c === '"') { inQuote = true; i++; continue; }
    if (c === ',') { endField(); i++; continue; }
    if (c === '\r') { i++; continue; }
    if (c === '\n') { endRow(); i++; continue; }
    field += c; i++;
  }
  if (field || row.length) endRow();
}

/* ---------- 詞性代號正規化 ---------- */
var POS_MAP = {
  'n': 'n.', 'v': 'v.', 'vt': 'v.', 'vi': 'v.', 'aux': 'aux.',
  'a': 'adj.', 'adj': 'adj.', 'ad': 'adv.', 'adv': 'adv.',
  'prep': 'prep.', 'conj': 'conj.', 'pron': 'pron.', 'num': 'num.',
  'int': 'int.', 'interj': 'int.', 'excl': 'int.',
  'art': 'art.', 'abbr': 'abbr.', 'pl': 'n.',
  // WordNet 自己的單字母詞性碼，出現在 definition 欄：s 是形容詞衛星節點，r 是副詞
  's': 'adj.', 'r': 'adv.'
};

/* 虛詞不需要詞形變化欄 —— ECDICT 會給 me → mes、them → thems 這種不存在的複數 */
var CLOSED_POS = { 'pron.': 1, 'prep.': 1, 'conj.': 1, 'art.': 1, 'int.': 1, 'aux.': 1 };

/**
 * 把一行詞義切成幾個小詞義。
 * 不能直接 split 逗號 —— 「(表示驚訝, 恐怖)」會被切成兩半，留下沒收尾的括號。
 */
function splitGlosses(body) {
  var out = [], cur = '', depth = 0;
  for (var i = 0; i < body.length; i++) {
    var ch = body.charAt(i);
    if (ch === '(' || ch === '（' || ch === '[') depth++;
    else if (ch === ')' || ch === '）' || ch === ']') depth = Math.max(0, depth - 1);
    if (depth === 0 && /[,，;；、]/.test(ch)) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  out.push(cur);
  return out.map(function (g) { return g.replace(/\s+/g, ' ').trim(); });
}

/* ---------- 中文詞義：挑出最有用的幾個，其餘丟掉 ---------- */
function cleanZh(raw) {
  if (!raw) return { zh: '', pos: '' };
  var lines = String(raw).split(/\\n|\n/);
  var groups = [], posSeen = [], plain = [];

  lines.forEach(function (line) {
    line = line.trim();
    if (!line) return;
    // [医] [经] [化] 這類專業領域標記：一般學習者用不到，有別的詞義就丟掉
    var tech = /^\[/.test(line);
    var m = /^([a-zA-Z]+)\.\s*(.+)$/.exec(line);
    var pos = '', body = line;
    if (m && POS_MAP[m[1].toLowerCase()]) { pos = POS_MAP[m[1].toLowerCase()]; body = m[2]; }
    var glosses = splitGlosses(body).filter(function (g) {
      // 括號沒收尾代表切壞了，寧可不要
      return g && g.length <= 14 && !/^\[/.test(g) &&
             (g.split('(').length === g.split(')').length) &&
             (g.split('（').length === g.split('）').length);
    });
    if (!glosses.length) return;
    (tech ? plain : groups).push({ pos: pos, glosses: glosses });
    if (pos && !tech && posSeen.indexOf(pos) < 0) posSeen.push(pos);
  });

  var use = groups.length ? groups : plain;
  if (!use.length) return { zh: '', pos: '' };

  var picked = [], seen = {};
  for (var i = 0; i < use.length && picked.length < 4; i++) {
    for (var j = 0; j < use[i].glosses.length && picked.length < 4; j++) {
      var g = use[i].glosses[j];
      if (seen[g]) continue;
      seen[g] = 1;
      picked.push(g);
      if (j >= 1) break;          // 同一個詞性最多取兩個，留位置給別的詞性
    }
  }
  return {
    zh: s2t(picked.join('・')).replace(/\.\.\./g, '…'),
    pos: posSeen.slice(0, 2).join('/')
  };
}

/**
 * 英英解釋。
 * ECDICT 的 definition 是把所有同名詞條疊在一起的，第一行常常是別的意思：
 * as 的第一行是「砷」（元素符號 As）、me 是「緬因州」、its 是「資訊科技」。
 * 所以要挑「詞性和中文詞義對得上」的那一行，對不上就寧可不給。
 */
var EN_JUNK = /^(see\b|of\b|a form of|imp\.|p\. p\.|pl\. of|obs\.|same as)/i;

function cleanEn(raw, posStr) {
  if (!raw) return '';
  var want = String(posStr || '').split('/').filter(Boolean);
  var lines = String(raw).split(/\\n|\n/);
  var best = '';

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (!line) continue;
    var m = /^([a-zA-Z]+)\.?\s+(.+)$/.exec(line);
    var pos = m && POS_MAP[m[1].toLowerCase()] ? POS_MAP[m[1].toLowerCase()] : '';
    var body = pos ? m[2] : line;
    if (EN_JUNK.test(body) || body.length < 14) continue;
    if (!want.length || !pos) { if (!best) best = body; continue; }
    if (want.indexOf(pos) >= 0) { best = body; break; }
  }
  if (!best) return '';

  var cut = best.indexOf(';');
  if (cut > 24) best = best.slice(0, cut);
  best = best.replace(/\s+/g, ' ').trim();
  if (best.length > 78) best = best.slice(0, 76).replace(/\s+\S*$/, '') + '…';
  return best;
}

/* ---------- 音標：ECDICT 用的是 IPA，schwa 混進了西里爾字母 ---------- */
function cleanPhonetic(raw) {
  var p = String(raw || '').trim().replace(/^[\[\/]|[\]\/]$/g, '').trim();
  if (!p || p.length > 32) return '';
  return p.replace(/ә/g, 'ə').replace(/ɑ/g, 'ɑ');
}

/* ---------- 詞形變化：ECDICT 的 exchange 欄 ---------- */
/* p:過去式 d:過去分詞 i:現在分詞 3:第三人稱 s:複數 r:比較級 t:最高級 0:原形 1:原形的變化型 */
function parseExchange(raw) {
  var out = {};
  String(raw || '').split('/').forEach(function (seg) {
    var k = seg.charAt(0), v = seg.slice(2);
    if (k && v) out[k] = v;
  });
  return out;
}

var FORM_KEYS = ['p', 'd', 'i', '3', 's', 'r', 't'];

function packForms(ex, word, pos) {
  if (String(pos || '').split('/').every(function (p) { return CLOSED_POS[p]; }) && pos) return '';
  var parts = [];
  FORM_KEYS.forEach(function (k) {
    if (ex[k] && ex[k] !== word) parts.push(k + ':' + ex[k]);
  });
  return parts.join(';');
}

/* ---------- 讀檔並初步過濾 ---------- */
console.log('讀 ' + CSV_PATH + ' …');
var raw = fs.readFileSync(CSV_PATH, 'utf8');
console.log('  ' + (raw.length / 1048576).toFixed(1) + ' MB');

var cands = [];        // 候選詞
var lemmaOf = {};      // 變化型 → 原形（ECDICT 自己標的，比猜字尾可靠）
var total = 0;

parseCsv(raw, function (r) {
  total++;
  var w = String(r.word || '').trim();
  if (!/^[a-z][a-z-]*$/.test(w) || w.length < 2 || w.length > 18) return;

  var ex = parseExchange(r.exchange);
  if (ex['0'] && ex['0'] !== w) { lemmaOf[w] = ex['0']; return; }   // 這是變化型，不是詞條

  if (!r.translation) return;

  var bnc = parseInt(r.bnc, 10) || 0;
  var frq = parseInt(r.frq, 10) || 0;
  var tag = String(r.tag || '').trim();
  var collins = parseInt(r.collins, 10) || 0;
  var oxford = parseInt(r.oxford, 10) || 0;
  var biz = BIZ_SET[w] ? 1 : 0;

  // 完全沒有頻率、沒有考試標籤、也不是商務字 → 是冷僻詞，不收
  if (!bnc && !frq && !tag && !collins && !biz) return;

  cands.push({
    w: w, bnc: bnc, frq: frq, tag: tag, collins: collins, oxford: oxford, biz: biz,
    translation: r.translation, definition: r.definition, phonetic: r.phonetic, ex: ex
  });
});

console.log('  總筆數 ' + total + '，通過初篩 ' + cands.length);

/* ==========================================================================
   5. 排序與挑選
   rank 越小越常用。兩份詞頻取比較樂觀的那個，再依「多益會不會考」往前調。
   ========================================================================== */
var TAG_BOOST = { zk: 0.55, gk: 0.6, cet4: 0.6, cet6: 0.7, ky: 0.75, toefl: 0.85, ielts: 0.85, gre: 1.0 };

function score(c) {
  var r = Math.min(c.bnc || 999999, c.frq || 999999);
  if (r === 999999) r = 30000;                       // 沒詞頻的字先排到後面
  if (c.oxford) r *= 0.4;                            // Oxford 3000
  if (c.collins) r *= (1.05 - c.collins * 0.1);      // 五星最常用
  var best = 1;
  c.tag.split(/\s+/).forEach(function (t) {
    if (TAG_BOOST[t] && TAG_BOOST[t] < best) best = TAG_BOOST[t];
  });
  r *= best;
  if (c.biz) r *= 0.25;                              // 多益主題字無論多冷都要進來
  return r;
}

cands.forEach(function (c) { c.score = score(c); });
cands.sort(function (a, b) { return a.score - b.score || a.w.localeCompare(b.w); });

var NAME_ZH = /(男子名|女子名|男名|女名|姓氏|人名|地名|\[人\]|\[地\])/;

var picked = [], pickedSet = {}, skippedKnown = 0, skippedName = 0;
for (var ci = 0; ci < cands.length && picked.length < TARGET; ci++) {
  var c = cands[ci];
  if (KNOWN[c.w]) { skippedKnown++; continue; }       // 課程已經教過，vocab 那邊資料更好
  var z = cleanZh(c.translation);
  if (!z.zh) continue;
  // ECDICT 的人名地名有些是小寫收錄的（mario、sydney），詞庫不需要它們
  if (NAME_ZH.test(z.zh)) { skippedName++; continue; }
  c.zh = z.zh;
  c.pos = z.pos || '';
  picked.push(c);
  pickedSet[c.w] = c;
}

console.log('  選出 ' + picked.length + ' 字（跳過課程已教的 ' + skippedKnown +
            ' 字、人名地名 ' + skippedName + ' 字）');

/* ==========================================================================
   6. 衍生字
   同一個字根長出來的一串字（apply → application → applicant）擺在一起，
   背一個就順手認得其他三個 —— 這是詞庫相對於單字表唯一能多給的東西。
   逐字去試字尾，而不是兩兩比對：12000 × 30 個候選遠比 12000² 便宜。
   ========================================================================== */
var SUFFIXES = ['ment', 'tion', 'sion', 'ation', 'ition', 'ness', 'ity', 'ance', 'ence',
  'ancy', 'ency', 'er', 'or', 'ar', 'ist', 'ism', 'ive', 'able', 'ible', 'al', 'ial',
  'ful', 'less', 'ous', 'ious', 'ly', 'ize', 'ise', 'ify', 'en', 'ship', 'hood', 'age',
  'ee', 'ant', 'ent', 'ary', 'ory', 'ic', 'ical', 'ish', 'y'];

/**
 * 只掛否定字首，而且只往長的方向加。
 * re-／over-／pre- 加上去太常撞到不相干的字（sign → resign、port → report），
 * 反過來拆字首更糟 —— redeem 會被拆成 deem。否定字首至少 happy／unhappy
 * 是真的成對，學一個等於學兩個。
 */
var PREFIXES = ['un', 'in', 'im', 'il', 'ir', 'dis', 'non'];

function variants(stem) {
  var out = [stem];
  if (/e$/.test(stem)) out.push(stem.slice(0, -1));            // create → creation
  if (/y$/.test(stem)) out.push(stem.slice(0, -1) + 'i');      // apply → applicable
  return out;
}

/**
 * 太短的字不做衍生：be + ar 會配到 bear、man + y 會配到 many，
 * 三四個字母的字加一個字尾幾乎都會誤中別的字。
 */
function familyOf(w) {
  var out = [], seen = {};
  seen[w] = 1;
  if (w.length < 5) return out;
  function add(x) {
    if (!x || seen[x] || !pickedSet[x] || out.length >= 4) return;
    if (Math.abs(x.length - w.length) < 2) return;
    seen[x] = 1; out.push(x);
  }
  // 往長的方向：加字尾
  variants(w).forEach(function (base) {
    SUFFIXES.forEach(function (sfx) { add(base + sfx); });
  });
  // 往短的方向：拆字尾
  for (var i = 0; i < SUFFIXES.length; i++) {
    var sfx = SUFFIXES[i];
    if (w.length > sfx.length + 2 && w.slice(-sfx.length) === sfx) {
      var stem = w.slice(0, -sfx.length);
      add(stem); add(stem + 'e'); add(stem.replace(/i$/, 'y'));
    }
  }
  PREFIXES.forEach(function (p) { add(p + w); });
  return out;
}

/* ==========================================================================
   7. 例句
   優先用 repo 自己寫過的中英對照句 —— 使用者在別的關卡真的讀過那句話。
   沒有才退回 WordNet 的英文例句（只有英文，UI 會標示）。
   ========================================================================== */
/**
 * 每個字形是誰的。lives 同時是 life 的複數和 live 的三單，
 * 拿它去撈例句會讓 life 配到「She lives in Taipei.」—— 有歧義的字形一律不用。
 */
var FORM_OWNERS = {};
function indexForms(list) {
  list.forEach(function (c) {
    FORM_KEYS.forEach(function (k) {
      var f = c.ex[k];
      if (f && f !== c.w) (FORM_OWNERS[f] = FORM_OWNERS[f] || []).push(c.w);
    });
  });
}

function corpusExample(c) {
  var best = -1, bestLen = 1e9;
  function tryForm(f) {
    (CORPUS_BY_WORD[f] || []).forEach(function (idx) {
      var len = CORPUS[idx][0].length;
      if (len < bestLen) { bestLen = len; best = idx; }
    });
  }
  tryForm(c.w);                         // 原形優先：一定是這個字
  if (best >= 0) return CORPUS[best];
  FORM_KEYS.forEach(function (k) {
    var f = c.ex[k];
    // 這個字形只有它自己會產生，才敢拿來對句子
    if (f && f !== c.w && (FORM_OWNERS[f] || []).length === 1 && !KNOWN[f]) tryForm(f);
  });
  return best < 0 ? null : CORPUS[best];
}

/**
 * WordNet 的 gloss 尾巴常有引號括起來的示例，但它們多半是詞組而不是完整句子
 * （"tyrannical government"、"the current state of knowledge"）。
 * 與其硬把詞組當例句，不如當成「用法示例」另外顯示 —— 那正是搭配詞該有的樣子。
 */
var WN_EX = {};
if (WN_DIR) {
  ['data.noun', 'data.verb', 'data.adj', 'data.adv'].forEach(function (f) {
    var abs = path.join(WN_DIR, f);
    if (!fs.existsSync(abs)) return;
    fs.readFileSync(abs, 'utf8').split('\n').forEach(function (line) {
      if (!line || line.charAt(0) === ' ') return;
      var bar = line.indexOf('| ');
      if (bar < 0) return;
      var head = line.slice(0, bar), gloss = line.slice(bar + 2);
      var quoted = gloss.match(/"([^"]{10,80})"/);
      if (!quoted) return;
      var sent = quoted[1].replace(/\s+/g, ' ').trim();
      if (!/^[A-Za-z]/.test(sent) || sent.split(/\s+/).length < 3) return;
      var fields = head.split(' ');
      var wCount = parseInt(fields[3], 16);
      if (!wCount) return;
      for (var k = 0; k < wCount; k++) {
        var word = (fields[4 + k * 2] || '').toLowerCase();
        if (!/^[a-z]+$/.test(word)) continue;
        if (!WN_EX[word] || WN_EX[word].length > sent.length) WN_EX[word] = sent;
      }
    });
  });
  console.log('  WordNet 用法示例 ' + Object.keys(WN_EX).length + ' 字');
}

/**
 * WordNet 的例句是掛在「同義詞集」上的，同一句會被整組共用，
 * 於是 instruct 拿到「I taught them French」、leash 拿到「rope the bag securely」——
 * 句子裡根本沒有那個字。要求例句真的含有這個字（或它的變化形），
 * 撈到的量會少一些，但剩下的每一句都對得上。
 */
function usableUsage(c) {
  var s = WN_EX[c.w];
  if (!s) return false;
  var forms = [c.w];
  FORM_KEYS.forEach(function (k) { if (c.ex[k]) forms.push(c.ex[k]); });
  var low = ' ' + s.toLowerCase().replace(/[^a-z']+/g, ' ') + ' ';
  for (var i = 0; i < forms.length; i++) {
    if (low.indexOf(' ' + forms[i] + ' ') >= 0) return true;
  }
  return false;
}

/* ==========================================================================
   8. 分級與輸出
   ========================================================================== */
function levelOf(c, idx) {
  if (idx < 1200) return 1;
  if (idx < 3000) return 2;
  if (idx < 5000) return 3;
  if (idx < 7500) return 4;
  if (idx < 9500) return 5;
  return 6;
}

var TAG_KEEP = { zk: 1, gk: 1, cet4: 1, cet6: 1, ky: 1, toefl: 1, ielts: 1, gre: 1 };

/* 欄位內容不能自己夾帶分隔字元，否則整筆會錯位 */
function field(s) {
  return String(s == null ? '' : s).replace(/[\t\r\n]+/g, ' ').trim();
}

/* 反引號來自 WordNet 的排版習慣（followed by `as'），留著只會讓資料看起來像壞掉。
   分隔用的 tab 寫成 \t 逸出序列，直接放原始 tab 在檔案裡看不出來。 */
function jsStr(s) {
  return "'" + String(s).replace(/\\/g, '\\\\').replace(/`/g, "'").replace(/'/g, "\\'")
    .replace(/\t/g, '\\t') + "'";
}

/* 一筆一行、欄位用 \t 隔開。
   物件字面值每筆要多背 30 個位元組的鍵名，一萬多筆就是 300KB；
   拆成字串陣列既省檔案又省瀏覽器的剖析時間，代價是要在引擎那邊 split 回來。 */
var FIELD_DOC =
  '   欄位順序（以 \\t 分隔，空字串代表沒有這一項）：\n' +
  '     0 w   單字\n' +
  '     1 pos 詞性\n' +
  '     2 zh  繁中詞義（・分隔）\n' +
  '     3 ph  音標（IPA）\n' +
  '     4 en  英英解釋\n' +
  '     5 fm  詞形變化 p:過去式;d:過去分詞;i:現在分詞;3:三單;s:複數;r:比較級;t:最高級\n' +
  '     6 tag 考試／主題標籤\n' +
  '     7 xe  例句英文（來自本 repo 手寫的句子）\n' +
  '     8 xz  例句中文\n' +
  '     9 use 用法示例（WordNet，只有英文，多半是詞組不是句子）\n' +
  '    10 fam 衍生字（,分隔）';

var buckets = {};
var stat = { corpusEx: 0, wnEx: 0, noEx: 0, fam: 0 };

indexForms(picked);

picked.forEach(function (c, idx) {
  var lv = levelOf(c, idx);
  var tags = c.tag.split(/\s+/).filter(function (t) { return TAG_KEEP[t]; });
  if (c.biz) tags.push('biz');

  var xe = '', xz = '', use = '';
  var hit = corpusExample(c);
  if (hit) { xe = hit[0]; xz = hit[1]; stat.corpusEx++; }
  if (usableUsage(c)) { use = WN_EX[c.w]; if (!xe) stat.wnEx++; }
  if (!xe && !use) stat.noEx++;

  var fam = familyOf(c.w);
  if (fam.length) stat.fam++;

  var rec = [
    c.w, c.pos, c.zh, cleanPhonetic(c.phonetic), cleanEn(c.definition, c.pos),
    packForms(c.ex, c.w, c.pos), tags.join(' '), xe, xz, use, fam.join(',')
  ].map(field).join('\t').replace(/\t+$/, '');   // 尾端空欄位不必寫出來

  (buckets[lv] = buckets[lv] || []).push(rec);
});

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

var written = [], totalBytes = 0;
Object.keys(buckets).sort().forEach(function (lv) {
  var recs = buckets[lv];
  var body =
    '/* ==========================================================================\n' +
    '   lexicon-' + lv + '.js — 詞庫自動層 第 ' + lv + ' 級（' + recs.length + ' 字）\n' +
    '\n' +
    '   由 tools/gen-lexicon.js 產生，請不要手改 —— 下次重跑就沒了。\n' +
    '   要把某個字升級成手寫品質，把它搬到 data/lexicon-core.js，引擎以那邊為準。\n' +
    '\n' +
    '   資料來源：ECDICT（MIT）＋ OpenCC 簡轉繁（Apache-2.0）＋ WordNet 3.0 例句\n' +
    '\n' +
    FIELD_DOC + '\n' +
    '   ========================================================================== */\n' +
    'window.DATA_LEXICON_' + lv + ' = [\n' +
    recs.map(function (r) { return jsStr(r); }).join(',\n') + '\n];\n';
  var file = path.join(OUT_DIR, 'lexicon-' + lv + '.js');
  fs.writeFileSync(file, body, { encoding: 'utf8' });
  written.push('lexicon-' + lv + '.js（' + recs.length + ' 字，' + (body.length / 1024).toFixed(0) + ' KB）');
  totalBytes += body.length;
});

console.log('\n產出：');
written.forEach(function (w) { console.log('  ' + w); });
console.log('  合計 ' + (totalBytes / 1048576).toFixed(2) + ' MB');
console.log('\n例句來源：repo 語料 ' + stat.corpusEx + '、WordNet ' + stat.wnEx + '、沒有例句 ' + stat.noEx);
console.log('有衍生字的 ' + stat.fam + ' 字');
