#!/usr/bin/env node
/* ==========================================================================
   tools/test-logic.js — 邏輯與資料的回歸測試

   沒有測試框架是刻意的（零依賴）。這裡用 Node 內建的 vm 把 data/ 與引擎層
   載進一個假的 window，就能在沒有瀏覽器的情況下驗證組題邏輯與資料完整性。
   畫面層不測 —— 那要 Playwright 開 file://，不屬於這支腳本。

   涵蓋的回歸（每一項都對應一個真的會無聲壞掉的地方）：
     · ES5 語法：箭頭函式之類的東西一旦混進去，舊手機瀏覽器整包不執行
     · id 前綴互斥：四種資料共用同一個 byId 索引，撞號會直接蓋掉
     · 課表宣稱 ready 卻沒內容：關卡會鎖住並顯示「製作中」
     · plan 出現 scheduler 不認得的題型：靜靜地少出題
     · 起步取向（profile.track）換掉配方後組不出題：只有選那個取向的人會遇到
     · 弱點怪獸新型別沒同步改 weakQuestion：怪獸進得了清單卻永遠消不掉
     · SRS 只涵蓋單字：文法/閱讀/不規則動詞寫進 srs 會讓複習佇列壞掉

   用法：node tools/test-logic.js
   ========================================================================== */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');
var execFileSync = require('child_process').execFileSync;

var ROOT = path.resolve(__dirname, '..');

/* ---------- 迷你測試工具 ---------- */
var pass = 0, fails = [];
var group = '';

function describe(name) { group = name; console.log('\n' + name); }

function ok(cond, msg) {
  if (cond) { pass++; console.log('  ✓ ' + msg); }
  else { fails.push(group + ' → ' + msg); console.log('  ✗ ' + msg); }
}

function eq(a, b, msg) {
  ok(a === b, msg + (a === b ? '' : '（得到 ' + JSON.stringify(a) + '，預期 ' + JSON.stringify(b) + '）'));
}

/* ---------- 收集檔案 ---------- */
function listJs(dir) {
  var out = [];
  fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).forEach(function (e) {
    if (e.isDirectory()) out = out.concat(listJs(path.join(dir, e.name)));
    else if (e.name.slice(-3) === '.js') out.push(path.join(dir, e.name));
  });
  return out.sort();
}

var SHIPPED = listJs('data').concat(listJs('js'));   // 會送到瀏覽器的檔案
var ALL_JS = SHIPPED.concat(listJs('tools'));

/* ==========================================================================
   1. 語法
   ========================================================================== */
describe('語法');

var syntaxBad = [];
ALL_JS.forEach(function (rel) {
  try { execFileSync(process.execPath, ['--check', path.join(ROOT, rel)], { stdio: 'pipe' }); }
  catch (e) { syntaxBad.push(rel + '：' + String(e.stderr).split('\n').slice(0, 3).join(' ').trim()); }
});
ok(syntaxBad.length === 0, 'node --check 全數通過（' + ALL_JS.length + ' 個檔案）' +
   (syntaxBad.length ? '\n      ' + syntaxBad.join('\n      ') : ''));

/**
 * 把註解、字串、正規表示式的「內容」抹成空白，但保留每個字元的位置。
 * 逐字元掃描而非 regex —— 正規表示式裡的引號（例如 /['’]/）會騙過 regex。
 * 長度不變是刻意的：行號仍然正確，切出來的區間也能直接對應回原始碼。
 */
function blankLiterals(src) {
  var out = src.split(''), i = 0, n = src.length;
  var prev = '';   // 最後一個有意義的字元，用來判斷 / 是除號還是正規表示式
  function blank(from, to) {
    for (var k = from; k < to && k < n; k++) if (out[k] !== '\n') out[k] = ' ';
  }
  while (i < n) {
    var c = src[i], d = src[i + 1];
    if (c === '/' && d === '/') { var e = src.indexOf('\n', i); e = e < 0 ? n : e; blank(i, e); i = e; continue; }
    if (c === '/' && d === '*') { var e2 = src.indexOf('*/', i + 2); e2 = e2 < 0 ? n : e2 + 2; blank(i, e2); i = e2; continue; }
    if (c === '"' || c === "'" || c === '`') {
      var q = c, s = i; i++;
      while (i < n && src[i] !== q) { if (src[i] === '\\') i++; i++; }
      i++;
      blank(s + 1, i);         // 保留前後引號（反引號要留著給 ES6 偵測）
      prev = q;
      continue;
    }
    if (c === '/' && prev && '(,=:[!&|?{};+-*%~^'.indexOf(prev) >= 0) {
      var rs = i; i++;         // 正規表示式字面值
      while (i < n && src[i] !== '/') {
        if (src[i] === '\\') i++;
        else if (src[i] === '[') { while (i < n && src[i] !== ']') { if (src[i] === '\\') i++; i++; } }
        i++;
      }
      i++;
      while (i < n && /[gimsuy]/.test(src[i])) i++;
      blank(rs, i);
      prev = 'x';
      continue;
    }
    if (!/\s/.test(c)) prev = c;
    i++;
  }
  return out.join('');
}

/** 切出某個函式的原始碼（大括號配對在抹掉字串後才可靠） */
function fnSource(src, name) {
  var clean = blankLiterals(src);
  var i = clean.indexOf('function ' + name);
  if (i < 0) return '';
  var s = clean.indexOf('{', i), depth = 0, j = s;
  for (; j < clean.length; j++) {
    if (clean[j] === '{') depth++;
    else if (clean[j] === '}' && --depth === 0) break;
  }
  return src.slice(s, j + 1);
}

var ES6 = [
  [/=>/, '箭頭函式 =>'],
  [/`/, '樣板字串 `'],
  [/\bconst\b/, 'const'],
  [/\blet\b/, 'let'],
  [/\bclass\b/, 'class'],
  [/\.\.\./, '展開運算子 ...'],
  [/\basync\b/, 'async'],
  [/\bawait\b/, 'await']
];

var es6Bad = [];
SHIPPED.forEach(function (rel) {
  var code = blankLiterals(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
  ES6.forEach(function (p) {
    var m = p[0].exec(code);
    if (m) {
      var line = code.slice(0, m.index).split('\n').length;
      es6Bad.push(rel + ':' + line + ' 出現 ' + p[1]);
    }
  });
});
ok(es6Bad.length === 0, '沒有 ES6 語法（file:// 舊瀏覽器相容）' +
   (es6Bad.length ? '\n      ' + es6Bad.join('\n      ') : ''));

/* ==========================================================================
   2. 把 App 載進假的 window
   ========================================================================== */
function memStorage() {
  var m = {};
  return {
    getItem: function (k) { return Object.prototype.hasOwnProperty.call(m, k) ? m[k] : null; },
    setItem: function (k, v) { m[k] = String(v); },
    removeItem: function (k) { delete m[k]; }
  };
}

function stubEl() {
  return {
    style: {}, dataset: {}, classList: { add: function () {}, remove: function () {} },
    appendChild: function () {}, removeChild: function () {}, addEventListener: function () {},
    innerHTML: '', set textContent(v) {}, get textContent() { return ''; }
  };
}

function loadApp() {
  var sb = {
    console: console, JSON: JSON, Math: Math, Date: Date, isNaN: isNaN, parseInt: parseInt,
    parseFloat: parseFloat, String: String, Number: Number, Object: Object, Array: Array,
    Error: Error, RegExp: RegExp, TextEncoder: TextEncoder, TextDecoder: TextDecoder,
    setTimeout: setTimeout, clearTimeout: clearTimeout, setInterval: function () {}, clearInterval: function () {},
    localStorage: memStorage()
  };
  sb.window = sb;
  sb.self = sb;
  sb.document = {
    hidden: false, body: stubEl(),
    addEventListener: function () {}, removeEventListener: function () {},
    createElement: function () { return stubEl(); },
    getElementById: function () { return null; },
    querySelector: function () { return null; },
    querySelectorAll: function () { return []; }
  };
  // 只測邏輯，畫面/語音/音效用最小門面替代
  sb.UI = { esc: function (s) { return String(s === undefined ? '' : s); }, toast: function () {} };
  sb.Speech = { btn: function () { return ''; }, similar: function () { return 0; }, say: function () {} };
  sb.Sfx = { play: function () {} };

  vm.createContext(sb);

  // 順序即相依順序，和 index.html 一致
  var files = listJs('data').concat([
    'js/state.js', 'js/content.js', 'js/srs.js', 'js/scheduler.js', 'js/exercises/common.js'
  ]);
  files.forEach(function (rel) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, rel), 'utf8'), sb, { filename: rel });
  });
  return sb;
}

var app = loadApp();
var Content = app.Content, Scheduler = app.Scheduler, SRS = app.SRS, State = app.State, ExUtil = app.ExUtil;

/* ==========================================================================
   3. 資料完整性
   ========================================================================== */
describe('資料完整性');

var PREFIX = { v: 'vocab', g: 'grammar', r: 'reading', i: 'irregular', p: 'photo', q: 'respond' };
var seen = {}, dupes = [], badPrefix = [];

function checkIds(list, kind) {
  (list || []).forEach(function (x) {
    if (seen[x.id]) dupes.push(x.id + '（' + seen[x.id] + ' / ' + kind + '）');
    seen[x.id] = kind;
    if (PREFIX[x.id[0]] !== kind) badPrefix.push(x.id + ' 應該是 ' + kind);
  });
}
checkIds(Content.allVocab(), 'vocab');
var allGrammar = [], allReading = [], allPhoto = [], allRespond = [];
Content.orderedUnitIds().forEach(function (uid) {
  allGrammar = allGrammar.concat(Content.grammarOf(uid));
  allReading = allReading.concat(Content.readingOf(uid));
  allPhoto = allPhoto.concat(Content.photoOf(uid));
  allRespond = allRespond.concat(Content.respondOf(uid));
});
checkIds(allGrammar, 'grammar');
checkIds(allReading, 'reading');
checkIds(Content.irregulars(), 'irregular');
checkIds(allPhoto, 'photo');
checkIds(allRespond, 'respond');

ok(dupes.length === 0, 'id 全域唯一（四種資料共用 byId 索引）' + (dupes.length ? '：' + dupes.slice(0, 5).join('、') : ''));
ok(badPrefix.length === 0, 'id 前綴與型別相符（v/g/r/i）' + (badPrefix.length ? '：' + badPrefix.slice(0, 5).join('、') : ''));

var unitIds = {};
Content.orderedUnitIds().forEach(function (u) { unitIds[u] = 1; });
var orphan = [];
Content.allVocab().concat(allGrammar, allReading, allPhoto, allRespond).forEach(function (x) {
  if (!unitIds[x.u]) orphan.push(x.id + ' → ' + x.u);
});
ok(orphan.length === 0, '每筆資料的 u 都指到存在的關卡' + (orphan.length ? '：' + orphan.slice(0, 5).join('、') : ''));

var badVocab = [];
Content.allVocab().forEach(function (v) {
  if (!v.w || !v.zh || !v.pos || !v.u) badVocab.push(v.id + ' 缺欄位');
  (v.ex || []).forEach(function (p) {
    if (!Array.isArray(p) || p.length < 2 || !p[0] || !p[1]) badVocab.push(v.id + ' 例句格式錯誤');
  });
});
ok(badVocab.length === 0, '單字欄位齊全、例句為 [英, 中]' + (badVocab.length ? '：' + badVocab.slice(0, 5).join('、') : ''));

// t 分型不只是標籤：irregular 題會依它決定要不要問過去分詞（A 型問了沒鑑別度）
var badIrr = [];
Content.irregulars().forEach(function (iv) {
  if (!iv.v || !iv.p || !iv.pp || !iv.zh) { badIrr.push(iv.id + ' 欄位不齊'); return; }
  var sameAll = iv.v === iv.p && iv.p === iv.pp;
  var samePast = iv.p === iv.pp;
  if (iv.t === 'A' && !sameAll) badIrr.push(iv.id + '（' + iv.v + '）標 A 型但三態不同形');
  else if (iv.t === 'B' && (!samePast || sameAll)) badIrr.push(iv.id + '（' + iv.v + '）標 B 型但過去式≠過去分詞');
  else if (iv.t === 'C' && samePast) badIrr.push(iv.id + '（' + iv.v + '）標 C 型但過去式＝過去分詞');
  else if (['A', 'B', 'C'].indexOf(iv.t) < 0) badIrr.push(iv.id + ' 的 t=' + iv.t);
});
ok(badIrr.length === 0, '不規則動詞三態齊全且與 t 分型相符' + (badIrr.length ? '：' + badIrr.slice(0, 5).join('、') : ''));

// 多益 Part 1／Part 2：答案索引越界或中譯數量對不上，作答後的對照表就會缺一塊
var badChoice = [];
function checkChoice(list, kind, extra) {
  list.forEach(function (x) {
    if (!x.opts || x.opts.length < 3) badChoice.push(x.id + ' 選項不足');
    else if (!(x.a >= 0 && x.a < x.opts.length)) badChoice.push(x.id + ' 的 a=' + x.a + ' 超出選項範圍');
    if (x.zh && x.zh.length !== (x.opts || []).length) badChoice.push(x.id + ' 中譯數量與選項不符');
    if (extra) extra(x);
  });
}
checkChoice(allPhoto, 'photo', function (p) {
  if (!/^<svg[\s>]/.test(p.svg || '')) badChoice.push(p.id + ' 缺少內嵌 SVG');
  if ((p.svg || '').indexOf('</svg>') < 0) badChoice.push(p.id + ' 的 SVG 沒有收尾');
});
checkChoice(allRespond, 'respond', function (r) {
  if (!r.ask) badChoice.push(r.id + ' 沒有問句');
});
ok(badChoice.length === 0, 'Part 1／Part 2 題目的選項、答案索引與中譯齊全' +
   (badChoice.length ? '：' + badChoice.slice(0, 5).join('、') : ''));

/* ==========================================================================
   4. 課表與 plan
   ========================================================================== */
describe('課表');

// 階段可以分批開放，所以「ready 階段裡有製作中的關卡」是正常的。
// 真正的錯誤是：關卡寫了 plan（宣稱可玩）卻沒有內容 —— 那會鎖住而且沒人知道為什麼。
var readyUnits = [], plannedButEmpty = [];
Content.stages().forEach(function (st) {
  (st.units || []).forEach(function (u) {
    if (!st.ready) return;
    if (Content.isReady(u.id)) readyUnits.push(u.id);
    else if (u.plan && u.plan.length) plannedButEmpty.push(u.id);
  });
});
ok(plannedButEmpty.length === 0, '有 plan 的關卡都真的有內容（可玩 ' + readyUnits.length + ' 關）' +
   (plannedButEmpty.length ? '：' + plannedButEmpty.join('、') + ' 寫了 plan 卻會顯示「製作中」' : ''));
ok(readyUnits.length > 0, '至少有一關可玩');

// 解鎖是一條鏈：前一關沒過就進不了下一關，所以可玩的關卡必須從第一關起連續
var order = Content.orderedUnitIds();
var firstGap = -1, unreachable = [];
order.forEach(function (uid, i) {
  if (!Content.isReady(uid)) { if (firstGap < 0) firstGap = i; }
  else if (firstGap >= 0) unreachable.push(uid);
});
ok(unreachable.length === 0, '可玩的關卡沒有被製作中的關卡卡住' +
   (unreachable.length ? '：' + unreachable.join('、') + ' 永遠解鎖不了（前面有製作中的關卡）' : ''));

// plan 出現 scheduler 不處理的題型 → 那些題會靜靜地不出現
var schedSrc = fs.readFileSync(path.join(ROOT, 'js/scheduler.js'), 'utf8');
var handled = {};
(schedSrc.match(/plan\.(\w+)/g) || []).forEach(function (m) { handled[m.slice(5)] = 1; });
var unknownPlan = {};
Content.stages().forEach(function (st) {
  (st.units || []).forEach(function (u) {
    (u.plan || []).concat(u.planVocab || []).forEach(function (p) { if (!handled[p[0]]) unknownPlan[p[0]] = 1; });
  });
});
ok(Object.keys(unknownPlan).length === 0,
   'plan 的題型 scheduler 都處理得到' + (Object.keys(unknownPlan).length ? '：' + Object.keys(unknownPlan).join('、') + ' 沒人接' : ''));

// planVocab 只是同一關的另一種配方。isReady 看的是 plan，只寫 planVocab 的關卡會被當成「製作中」
var vocabOnly = [];
Content.stages().forEach(function (st) {
  (st.units || []).forEach(function (u) {
    if (u.planVocab && u.planVocab.length && !(u.plan && u.plan.length)) vocabOnly.push(u.id);
  });
});
ok(vocabOnly.length === 0, '有 planVocab 的關卡也有 plan' +
   (vocabOnly.length ? '：' + vocabOnly.join('、') + ' 只寫了 planVocab，會顯示「製作中」' : ''));

/* ==========================================================================
   5. 組題
   ========================================================================== */
describe('組題');

// index.html 載入的題型模組 = 可以被 lesson.js 派發的 type
var exTypes = {};
listJs('js/exercises').forEach(function (rel) {
  var src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  (src.match(/^\s*Ex\.(\w+)\s*=/gm) || []).forEach(function (m) {
    exTypes[m.replace(/^\s*Ex\./, '').replace(/\s*=$/, '')] = 1;
  });
});
eq(Object.keys(exTypes).length, 14, '註冊了 14 種題型');

// 兩種起步取向都要組得出題 —— planVocab 只有選「先學單字」的人會走到，壞了不會有人發現
var emptyLesson = [], badType = [];
['phonics', 'vocab'].forEach(function (track) {
  State.data.profile.track = track;
  readyUnits.forEach(function (uid) {
    var q = Scheduler.buildLesson(uid);
    if (!q.length) emptyLesson.push(uid + '（' + track + '）');
    q.forEach(function (item) { if (!exTypes[item.type]) badType.push(uid + ' 出現 ' + item.type); });
  });
});
ok(emptyLesson.length === 0, '兩種取向下每個可玩關卡都組得出題目' + (emptyLesson.length ? '：' + emptyLesson.join('、') : ''));
ok(badType.length === 0, '出的題都有對應的 Ex 模組' + (badType.length ? '：' + badType.slice(0, 5).join('、') : ''));

// 取向換的是配方而不是關卡：發音關要真的多教新字，沒有 planVocab 的關卡則完全不受影響
function cardsOf(uid, track) {
  State.data.profile.track = track;
  return Scheduler.buildLesson(uid).filter(function (q) { return q.type === 'flashcard'; }).length;
}
var pCards = cardsOf('s0u1', 'phonics'), vCards = cardsOf('s0u1', 'vocab');
ok(vCards > pCards, '「先學單字」在發音關教更多新字（' + pCards + ' → ' + vCards + '）');
eq(cardsOf('s0u6', 'vocab'), cardsOf('s0u6', 'phonics'), '沒有 planVocab 的關卡不受取向影響');
State.data.profile.track = 'phonics';

// 教學卡不計分，但關卡不能只有教學卡
var onlyIntro = readyUnits.filter(function (uid) {
  return Scheduler.buildLesson(uid).every(function (q) { return q.type === 'intro'; });
});
ok(onlyIntro.length === 0, '沒有只剩教學卡的關卡' + (onlyIntro.length ? '：' + onlyIntro.join('、') : ''));

/* ==========================================================================
   6. 弱點怪獸
   ========================================================================== */
describe('弱點怪獸');

// 靜態：程式裡 addWeak 用到的型別，weakQuestion 都要認得
var weakTypes = {};
listJs('js').forEach(function (rel) {
  var src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  (src.match(/addWeak\(\s*'(\w+)'/g) || []).forEach(function (m) {
    weakTypes[m.replace(/.*'(\w+)'/, '$1')] = 1;
  });
});
// 只看 weakQuestion 內部：buildReview 裡也有 w.t === 'reading' 的判斷，
// 掃整個檔案會讓「型別對映漏掉」這件事被那一行掩蓋過去
var wqSrc = fnSource(schedSrc, 'weakQuestion');
ok(!!wqSrc, '找得到 weakQuestion（改名的話這裡要跟著改）');
var mapped = {};
(wqSrc.match(/w\.t === '(\w+)'/g) || []).forEach(function (m) { mapped[m.replace(/.*'(\w+)'/, '$1')] = 1; });
var unmapped = Object.keys(weakTypes).filter(function (t) { return !mapped[t]; });
ok(unmapped.length === 0,
   'addWeak 的每種型別 weakQuestion 都接得住' +
   (unmapped.length ? '：' + unmapped.join('、') + ' 的怪獸永遠出不了題也消不掉' : ''));

// 功能：拿真資料各建一隻怪獸，確認真的排得進複習佇列。
// weakQuestion 沒有掛在 Scheduler 上，透過 buildReview 間接測。
function weakQ(type, refId) {
  State.data.srs = {};
  State.data.weak.length = 0;
  State.data.weak.push({ k: type + ':' + refId, t: type, r: refId, u: '', n: 1, at: State.dayStr() });
  var q = Scheduler.buildReview(20)[0] || null;
  State.data.weak.length = 0;
  return q;
}

var samples = {
  vocab: (Content.allVocab()[0] || {}).id,
  grammar: (allGrammar.filter(function (g) { return (g.qs || []).length; })[0] || {}).id,
  reading: (allReading[0] || {}).id,
  irregular: (Content.irregulars()[0] || {}).id,
  photo: (allPhoto[0] || {}).id,
  respond: (allRespond[0] || {}).id
};
Object.keys(weakTypes).forEach(function (t) {
  var refId = samples[t];
  ok(refId ? !!weakQ(t, refId) : false,
     t + ' 型怪獸出得了題' + (refId ? '（' + refId + '）' : '：找不到樣本資料'));
});

/* ==========================================================================
   7. SRS 範圍：只有單字進 srs
   ========================================================================== */
describe('SRS 範圍');

State.data.srs = {};
State.data.weak.length = 0;
var g0 = allGrammar[0], r0 = allReading[0], i0 = Content.irregulars()[0];
ExUtil.gradeGrammar(g0, false, g0.u);
SRS.addWeak('reading', r0.id, r0.u);
SRS.addWeak('irregular', i0.id, '');
eq(Object.keys(State.data.srs).length, 0, '文法/閱讀/不規則動詞不會寫進 srs');
eq(State.data.weak.length, 3, '它們改為進弱點怪獸清單');

var v0 = Content.allVocab()[0];
ExUtil.gradeVocab(v0, true, v0.u);
ok(!!State.data.srs[v0.id], '單字答對會寫進 srs');

// buildReview 的到期迴圈要求項目有 .w，混進非單字會出錯
State.data.weak.length = 0;
State.data.srs[r0.id] = { ef: 2.5, iv: 1, rep: 1, due: State.dayStr(), lap: 0, n: 1 };
var rv = Scheduler.buildReview(20);
ok(rv.every(function (q) { return q.type !== 'recall' || (q.ref && q.ref.w); }),
   '複習佇列不會把沒有 .w 的項目當單字出題');

/* ==========================================================================
   8. 自由作答比對
   ========================================================================== */
describe('自由作答比對');

ok(ExUtil.matchAny("I'm fine", ['I am fine']), "I'm ≡ I am");
ok(ExUtil.matchAny("don't go", ['do not go']), "don't ≡ do not");
ok(ExUtil.matchAny("we won't", ['we will not']), "won't ≡ will not");
ok(ExUtil.matchAny("I can't swim", ['I cannot swim']), "can't ≡ cannot");
ok(ExUtil.matchAny('they’re here', ["they are here"]), '彎引號視同直引號');
ok(ExUtil.matchAny('Hello, world!', ['hello world']), '忽略大小寫與標點');
ok(ExUtil.matchAny('  she   is  late ', ['she is late']), '忽略多餘空白');
ok(!ExUtil.matchAny('he is tall', ['he is short']), '真的不同就是錯');
// 's 與 'd 有歧義（is/has、would/had），刻意不展開
ok(!ExUtil.sameText("he's got it", ['he has got it'][0]), "'s 不展開（歧義）");

/* ==========================================================================
   結果
   ========================================================================== */
console.log('\n' + (fails.length ? '✗' : '✓') + ' 通過 ' + pass + ' 項' +
            (fails.length ? '，失敗 ' + fails.length + ' 項：' : '。'));
fails.forEach(function (f) { console.log('  - ' + f); });
process.exit(fails.length ? 1 : 0);
