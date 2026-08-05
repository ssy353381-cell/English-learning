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
     · 跳關測驗沒把星寫進去：解鎖鏈靠那顆星，測驗過了卻卡在原地
     · 弱點怪獸新型別沒同步改 weakQuestion：怪獸進得了清單卻永遠消不掉
     · SRS 只涵蓋單字：文法/閱讀/不規則動詞寫進 srs 會讓複習佇列壞掉
     · 詞庫三層的優先序：手寫層蓋不過自動層的話，寫了也沒用
     · 詞庫的字（lx: 開頭）Content.item 查不到：漏了 refItem 就變成消不掉的怪獸
     · markup 先轉義再包 span：正規表示式沒吃掉 HTML 實體會把 amp 當成單字

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
  sb.addEventListener = function () {};
  sb.removeEventListener = function () {};
  sb.innerWidth = 900;
  sb.document = {
    hidden: false, body: stubEl(),
    addEventListener: function () {}, removeEventListener: function () {},
    createElement: function () { return stubEl(); },
    getElementById: function () { return null; },
    querySelector: function () { return null; },
    querySelectorAll: function () { return []; }
  };
  // 只測邏輯，畫面/語音/音效用最小門面替代
  // esc 要和 ui.js 的實作一致 —— 詞庫的 markup 是「先轉義再包 span」，
  // 門面如果不轉義，跳脫相關的測試就會用錯的理由通過
  sb.UI = {
    esc: function (s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    },
    toast: function () {}, modal: function () {}, refreshChips: function () {}
  };
  sb.Speech = { btn: function () { return ''; }, similar: function () { return 0; }, say: function () {} };
  sb.Sfx = { play: function () {} };

  vm.createContext(sb);

  // 順序即相依順序，和 index.html 一致
  // lexicon 在載入當下就取用 UI.esc，所以一定要排在 UI 門面備妥之後
  var files = listJs('data').concat([
    'js/state.js', 'js/content.js', 'js/srs.js', 'js/gamify.js', 'js/lexicon.js',
    'js/scheduler.js', 'js/exercises/common.js'
  ]);
  files.forEach(function (rel) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, rel), 'utf8'), sb, { filename: rel });
  });
  return sb;
}

var app = loadApp();
var Content = app.Content, Scheduler = app.Scheduler, SRS = app.SRS, State = app.State,
    ExUtil = app.ExUtil, Gamify = app.Gamify, Lexicon = app.Lexicon;

/* ==========================================================================
   3. 資料完整性
   ========================================================================== */
describe('資料完整性');

var PREFIX = { v: 'vocab', g: 'grammar', r: 'reading', i: 'irregular', p: 'photo', q: 'respond',
               m: 'minpair', c: 'convo' };
var seen = {}, dupes = [], badPrefix = [];

function checkIds(list, kind) {
  (list || []).forEach(function (x) {
    if (seen[x.id]) dupes.push(x.id + '（' + seen[x.id] + ' / ' + kind + '）');
    seen[x.id] = kind;
    if (PREFIX[x.id[0]] !== kind) badPrefix.push(x.id + ' 應該是 ' + kind);
  });
}
checkIds(Content.allVocab(), 'vocab');
var allGrammar = [], allReading = [], allPhoto = [], allRespond = [], allMinPair = [], allConvo = [];
Content.orderedUnitIds().forEach(function (uid) {
  allGrammar = allGrammar.concat(Content.grammarOf(uid));
  allReading = allReading.concat(Content.readingOf(uid));
  allPhoto = allPhoto.concat(Content.photoOf(uid));
  allRespond = allRespond.concat(Content.respondOf(uid));
  allMinPair = allMinPair.concat(Content.minPairsOf(uid));
  allConvo = allConvo.concat(Content.convoOf(uid));
});
checkIds(allGrammar, 'grammar');
checkIds(allReading, 'reading');
checkIds(Content.irregulars(), 'irregular');
checkIds(allPhoto, 'photo');
checkIds(allRespond, 'respond');
checkIds(allMinPair, 'minpair');
checkIds(allConvo, 'convo');

ok(dupes.length === 0, 'id 全域唯一（四種資料共用 byId 索引）' + (dupes.length ? '：' + dupes.slice(0, 5).join('、') : ''));
ok(badPrefix.length === 0, 'id 前綴與型別相符（v/g/r/i/p/q/m）' + (badPrefix.length ? '：' + badPrefix.slice(0, 5).join('、') : ''));

var unitIds = {};
Content.orderedUnitIds().forEach(function (u) { unitIds[u] = 1; });
var orphan = [];
Content.allVocab().concat(allGrammar, allReading, allPhoto, allRespond, allMinPair, allConvo).forEach(function (x) {
  if (!unitIds[x.u]) orphan.push(x.id + ' → ' + x.u);
});
ok(orphan.length === 0, '每筆資料的 u 都指到存在的關卡' + (orphan.length ? '：' + orphan.slice(0, 5).join('、') : ''));

var badVocab = [];
Content.allVocab().forEach(function (v) {
  if (!v.w || !v.zh || !v.pos || !v.u) badVocab.push(v.id + ' 缺欄位');
  (v.ex || []).forEach(function (p) {
    if (!Array.isArray(p) || p.length < 2 || !p[0] || !p[1]) badVocab.push(v.id + ' 例句格式錯誤');
    else if (p[2] !== undefined && !Array.isArray(p[2])) badVocab.push(v.id + ' 例句的誘答不是陣列');
  });
});
ok(badVocab.length === 0, '單字欄位齊全、例句為 [英, 中]' + (badVocab.length ? '：' + badVocab.slice(0, 5).join('、') : ''));

/* ---------- 刻意誘答 ----------
   誘答寫壞不會噴錯，只會靜靜地變回隨機字或（更糟）產生兩個都對的選項。 */
var badLure = [];
function tokWords(s) { return s.toLowerCase().replace(/[^a-z'\- ]/g, '').split(/\s+/); }

Content.allVocab().forEach(function (v) {
  if (v.lure !== undefined) {
    if (!Array.isArray(v.lure) || !v.lure.length) { badLure.push(v.id + ' 的 lure 不是非空陣列'); return; }
    var seenL = {};
    v.lure.forEach(function (w) {
      if (typeof w !== 'string' || !w.trim()) { badLure.push(v.id + ' 的 lure 有空值'); return; }
      if (seenL[w]) badLure.push(v.id + ' 的 lure 重複列了 ' + w);
      seenL[w] = 1;
      if (w.toLowerCase() === v.w.toLowerCase()) badLure.push(v.id + ' 拿自己 ' + w + ' 當誘答');
      // 字庫裡查不到的誘答仍可用於排句字塊，但同形／同義的會被 distractors 的守衛
      // 丟掉 —— 寫了等於沒寫，而且沒有任何跡象
      var hit = Content.wordItem(w);
      if (hit && (hit.w === v.w || hit.zh === v.zh)) {
        badLure.push(v.id + '（' + v.w + '）的誘答 ' + w + ' 與它同形或同義，永遠不會被採用');
      }
    });
  }
  // 句級誘答如果本來就在句子裡，排句題會多出一個正確解
  (v.ex || []).forEach(function (p) {
    if (!Array.isArray(p[2])) return;
    var inSent = {};
    tokWords(String(p[0])).forEach(function (t) { inSent[t] = 1; });
    p[2].forEach(function (w) {
      if (typeof w !== 'string' || !w.trim()) { badLure.push(v.id + ' 的例句誘答有空值'); return; }
      if (inSent[w.toLowerCase()]) {
        badLure.push(v.id + ' 的例句誘答 ' + w + ' 已經在句子裡，排句題會有兩個解');
      }
    });
  });
});
ok(badLure.length === 0, '刻意誘答（lure）都是可用的' +
   (badLure.length ? '：' + badLure.slice(0, 5).join('、') : ''));

var lureWords = Content.allVocab().filter(function (v) { return v.lure; }).length;
ok(lureWords > 0, '有標記刻意誘答的單字（' + lureWords + ' 個）');

/* ---------- 搭配詞與字根字首 ---------- */
var badCol = [], badRt = [], colWords = 0, rtWords = 0;
Content.allVocab().forEach(function (v) {
  if (v.col !== undefined) {
    colWords++;
    if (!Array.isArray(v.col) || !v.col.length) { badCol.push(v.id + ' 的 col 不是非空陣列'); return; }
    // 搭配詞只掛動詞：挖掉名詞（pay the ___）常常不只一個答案，題目就沒有標準解
    if (v.pos.indexOf('v.') < 0) badCol.push(v.id + '（' + v.w + ' ' + v.pos + '）不是動詞卻有搭配詞');
    v.col.forEach(function (c) {
      if (!Array.isArray(c) || c.length < 2 || !c[0] || !c[1]) {
        badCol.push(v.id + ' 的搭配詞格式不是 [英, 中]'); return;
      }
      // 詞組裡沒有目標字就挖不出空格，題目會把答案直接印在題目上
      if (!new RegExp('\\b' + v.w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i').test(c[0])) {
        badCol.push(v.id + ' 的「' + c[0] + '」不含 ' + v.w + '，挖不出空格');
      }
    });
  }
  if (v.rt !== undefined) {
    rtWords++;
    if (!v.rt || typeof v.rt !== 'object' || Array.isArray(v.rt)) { badRt.push(v.id + ' 的 rt 不是物件'); return; }
    if (!v.rt.p && !v.rt.r && !v.rt.s) badRt.push(v.id + ' 的 rt 三個欄位都空的');
    ['p', 'r', 's'].forEach(function (k) {
      if (v.rt[k] === undefined) return;
      // 顯示時用第一個空格切成「英文／中文」兩段，沒有空格就只會排出半塊積木
      if (typeof v.rt[k] !== 'string' || v.rt[k].indexOf(' ') <= 0) {
        badRt.push(v.id + ' 的 rt.' + k + '「' + v.rt[k] + '」不是「英文 空格 中文」');
      }
    });
  }
});
ok(badCol.length === 0, '搭配詞格式正確且都挖得出空格（' + colWords + ' 個字）' +
   (badCol.length ? '：' + badCol.slice(0, 5).join('、') : ''));
ok(badRt.length === 0, '字根字首拆得成積木（' + rtWords + ' 個字）' +
   (badRt.length ? '：' + badRt.slice(0, 5).join('、') : ''));
ok(colWords > 0 && rtWords > 0, '搭配詞與字根都有資料');

/* ---------- 最小音對 ---------- */
var badMp = [];
allMinPair.forEach(function (m) {
  if (!m.ask) badMp.push(m.id + ' 沒有題目問法');
  if (!Array.isArray(m.set) || m.set.length < 3) { badMp.push(m.id + ' 的候選少於 3 個'); return; }
  var seenW = {}, seenL = {};
  m.set.forEach(function (x) {
    if (!Array.isArray(x) || !x[0]) { badMp.push(m.id + ' 的候選格式錯誤'); return; }
    var w = String(x[0]), lab = x[1] === undefined ? w : String(x[1]);
    if (seenW[w]) badMp.push(m.id + ' 有兩個 ' + w);
    if (seenL[lab]) badMp.push(m.id + ' 的選項 ' + lab + ' 重複，會出現兩個一樣的選項');
    seenW[w] = seenL[lab] = 1;
    // 標籤是「這個字裡的哪一段」，不在字裡面就對不起來 —— 拼錯了也只會靜靜出錯題
    if (w.toLowerCase().indexOf(lab.toLowerCase()) < 0) {
      badMp.push(m.id + ' 的 ' + w + ' 標成「' + lab + '」，但字裡沒有這一段');
    }
  });
});
ok(badMp.length === 0, '最小音對的候選與標籤對得起來（' + allMinPair.length + ' 組）' +
   (badMp.length ? '：' + badMp.slice(0, 5).join('、') : ''));
ok(allMinPair.length > 0, '有最小音對資料');

/* ---------- 時態時間軸 ---------- */
var TL_AT = { past: 1, now: 1, future: 1 };
var badTl = [], tlPoints = 0;
allGrammar.forEach(function (g) {
  if (g.tl === undefined) return;
  tlPoints++;
  if (!Array.isArray(g.tl) || !g.tl.length) { badTl.push(g.id + ' 的 tl 不是非空陣列'); return; }
  g.tl.forEach(function (m) {
    if (!m || !m.t) { badTl.push(g.id + ' 的標記沒有文字'); return; }
    if (!TL_AT[m.a]) badTl.push(g.id + ' 的 a=' + m.a + ' 不是 past/now/future');
    if (m.b !== undefined && !TL_AT[m.b]) badTl.push(g.id + ' 的 b=' + m.b + ' 不是 past/now/future');
  });
});
ok(badTl.length === 0, '時間軸標記都落在 過去／現在／未來 上（' + tlPoints + ' 個文法點）' +
   (badTl.length ? '：' + badTl.slice(0, 5).join('、') : ''));
ok(tlPoints > 0, '有時間軸資料');

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
eq(Object.keys(exTypes).length, 17, '註冊了 17 種題型');

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

// 搭配詞是從 vocabUpTo 抽的，不是這一關新教的字 —— 早期關卡累積的搭配詞不夠時
// 會靜靜地少出題，所以課表寫幾題就要驗幾題
var colShort = [], colDup = [];
Content.stages().forEach(function (st) {
  (st.units || []).forEach(function (u) {
    var want = 0;
    (u.plan || []).forEach(function (p) { if (p[0] === 'collocate') want = p[1]; });
    if (!want || !Content.isReady(u.id)) return;
    var qs = Scheduler.buildLesson(u.id).filter(function (q) { return q.type === 'collocate'; });
    if (qs.length !== want) colShort.push(u.id + ' 要 ' + want + ' 題卻只出了 ' + qs.length);
    qs.forEach(function (q) {
      if (!q.col || !q.col[0]) colShort.push(u.id + ' 出的搭配詞題沒有詞組');
    });
    // 一次只抽兩題，光看一次跑不出重複（機率大概 7%）—— 多抽幾輪才測得到守衛
    for (var r = 0; r < 25 && !colDup.length; r++) {
      var seenCol = {};
      Scheduler.buildLesson(u.id).forEach(function (q) {
        if (q.type !== 'collocate') return;
        if (seenCol[q.ref.id]) colDup.push(u.id + ' 重複問 ' + q.ref.w);
        seenCol[q.ref.id] = 1;
      });
    }
  });
});
ok(colShort.length === 0, '課表寫幾題搭配詞就出得了幾題' +
   (colShort.length ? '：' + colShort.slice(0, 5).join('、') : ''));
ok(colDup.length === 0, '同一課不會重複問同一個字的搭配' +
   (colDup.length ? '：' + colDup.slice(0, 5).join('、') : ''));

// 課表寫了 phoneme 就要出得了題（發音關考回自己教過的音，抽不到會靜靜地少考）
var phShort = [];
Content.stages().forEach(function (st) {
  (st.units || []).forEach(function (u) {
    var want = 0;
    (u.plan || []).forEach(function (p) { if (p[0] === 'phoneme') want = p[1]; });
    if (!want || !Content.isReady(u.id)) return;
    var n = Scheduler.buildLesson(u.id).filter(function (q) { return q.type === 'phoneme'; }).length;
    if (n !== want) phShort.push(u.id + ' 要 ' + want + ' 題卻只出了 ' + n);
  });
});
ok(phShort.length === 0, '課表寫幾題最小音對就出得了幾題' +
   (phShort.length ? '：' + phShort.slice(0, 5).join('、') : ''));

// 鷹架提示：複習／每日挑戰／弱點怪獸都沒有教學卡，文法題必須自己帶一句話概念。
// 關卡裡則不能帶 —— 教學卡前面才剛整頁講完，再貼一次是雜訊。
var weakG = allGrammar.filter(function (g) {
  return (g.qs || []).length && g.teach && g.teach.lead;
})[0];
if (weakG) {
  State.data.srs = {};
  State.data.weak.length = 0;
  State.data.weak.push({ k: 'grammar:' + weakG.id, t: 'grammar', r: weakG.id, u: weakG.u, n: 1, at: State.dayStr() });
  var wq = Scheduler.buildReview(20)[0];
  State.data.weak.length = 0;
  ok(!!(wq && wq.scaffold), '弱點怪獸的文法題帶著一句話概念（' + weakG.id + '）');
}
var lessonG = [];
readyUnits.forEach(function (uid) {
  Scheduler.buildLesson(uid).forEach(function (q) {
    if ((q.type === 'grammar' || q.type === 'cloze') && q.scaffold) lessonG.push(uid);
  });
});
ok(lessonG.length === 0, '關卡裡的文法題不重複貼概念（教學卡已經講過）' +
   (lessonG.length ? '：' + lessonG.slice(0, 3).join('、') : ''));

// 教學卡不計分，但關卡不能只有教學卡
var onlyIntro = readyUnits.filter(function (uid) {
  return Scheduler.buildLesson(uid).every(function (q) { return q.type === 'intro'; });
});
ok(onlyIntro.length === 0, '沒有只剩教學卡的關卡' + (onlyIntro.length ? '：' + onlyIntro.join('、') : ''));

/* ==========================================================================
   5.5 誘答
   選項與字塊裡「錯的那些」決定一題有沒有鑑別度。這一段全部是無聲的失效：
   誘答挑錯不會噴錯，只會讓題目變簡單，或變成兩個答案都對。
   ========================================================================== */
describe('誘答');

// 同義字當誘答 = 兩個都對（job 與 work 的 zh 都是「工作」）。
// 隨機抽樣只會偶爾撞到，所以直接把「目標 + 它的同義字」當候選池餵進去：
// 守衛沒擋住就一定會抽到那一個，這樣才是每次都會紅的檢查。
var byZhMap = {}, byWMap = {};
Content.allVocab().forEach(function (v) {
  (byZhMap[v.zh] = byZhMap[v.zh] || []).push(v);
  (byWMap[v.w] = byWMap[v.w] || []).push(v);
});
var twins = [];
[byZhMap, byWMap].forEach(function (map) {
  for (var k in map) {
    if (Object.prototype.hasOwnProperty.call(map, k) && map[k].length > 1) {
      twins.push([map[k][0], map[k][1]]);
    }
  }
});
var leaked = [];
twins.forEach(function (p) {
  Content.distractors(p[0], 1, [p[0], p[1]]).forEach(function (d) {
    if (d.id === p[1].id) leaked.push(p[0].w + '「' + p[0].zh + '」配上 ' + p[1].w + '「' + p[1].zh + '」');
  });
});
ok(twins.length > 0, '資料裡有同形／同義的字組（' + twins.length + ' 組），守衛不是空轉');
ok(leaked.length === 0, '同義字不會被當成誘答（選項不會兩個都對）' +
   (leaked.length ? '：' + leaked.slice(0, 3).join('、') : ''));

var selfLure = Content.allVocab().filter(function (v) {
  return Content.distractors(v, 3).some(function (d) { return d.id === v.id; });
});
ok(selfLure.length === 0, '誘答不會包含正確答案本身' +
   (selfLure.length ? '：' + selfLure.slice(0, 3).map(function (v) { return v.id; }).join('、') : ''));

// 有標 lure 的字，誘答要真的用上它 —— 否則整份誘答表等於沒接
var lureSample = Content.allVocab().filter(function (v) { return v.lure && v.lure.length; });
var lureMissed = lureSample.filter(function (v) {
  var got = Content.distractors(v, 3).map(function (d) { return d.w.toLowerCase(); });
  return !v.lure.some(function (w) { return got.indexOf(w.toLowerCase()) >= 0; });
});
ok(lureMissed.length === 0, '標了 lure 的字，選項一定包含刻意誘答' +
   (lureMissed.length ? '：' + lureMissed.slice(0, 5).map(function (v) { return v.id + ' ' + v.w; }).join('、') : ''));

// 搭配詞題的誘答不能是隨機動詞 —— 抽到剛好也配得起來的字（give a speech 抽到 make，
// 而 make a speech 也是對的）那題就沒有標準解。合法來源只有其他搭配詞動詞與自己的 lure。
var colSet = {};
Content.allVocab().forEach(function (v) { if (v.col && v.col.length) colSet[v.id] = 1; });
var wildCol = [];
Content.allVocab().forEach(function (v) {
  if (!colSet[v.id]) return;
  for (var r = 0; r < 20 && !wildCol.length; r++) {
    Content.colDistractors(v, 3).forEach(function (d) {
      var isLure = (v.lure || []).some(function (w) { return w.toLowerCase() === d.w.toLowerCase(); });
      if (!colSet[d.id] && !isLure) wildCol.push(v.w + ' 抽到 ' + d.w);
    });
  }
});
ok(wildCol.length === 0, '搭配詞題的誘答只來自搭配詞字組或自己的 lure' +
   (wildCol.length ? '：' + wildCol.slice(0, 3).join('、') : ''));

// 排句字塊：誘答不能是句子裡本來就有的字，否則會排得出第二個正確解
var dupTok = [];
Content.orderedUnitIds().filter(Content.isReady).forEach(function (uid) {
  Scheduler.sentencesFrom(Content.vocabOf(uid)).forEach(function (s) {
    var correct = ExUtil.tokenize(s.en);
    var norm = {};
    correct.forEach(function (t) { norm[t.toLowerCase().replace(/[^a-z'\-]/g, '')] = 1; });
    Content.tokenLures(s, correct, { n: 2, unitId: uid }).forEach(function (w) {
      if (norm[w.toLowerCase()]) dupTok.push(uid + '「' + s.en + '」→ ' + w);
      if (/\s/.test(w)) dupTok.push(uid + '「' + s.en + '」的字塊 ' + w + ' 有空格');
    });
  });
});
ok(dupTok.length === 0, '排句誘答字塊不會與句子裡的字重複' +
   (dupTok.length ? '（' + dupTok.length + ' 筆）：' + dupTok.slice(0, 3).join('、') : ''));

// 上面那一輪掃的是現有資料，而現有資料本來就是乾淨的 —— 守衛本身要單獨戳一次，
// 否則哪天它被拿掉，掃描還是全綠。
var guardEn = 'She teaches English.';
var guarded = Content.tokenLures(
  { en: guardEn, lure: ['English', 'studies'] }, ExUtil.tokenize(guardEn), { n: 2, random: false });
ok(guarded.indexOf('English') < 0 && guarded.indexOf('studies') >= 0,
   '句子裡已經有的字會被踢出誘答字塊（得到 ' + JSON.stringify(guarded) + '）');

var phraseEn = 'Please close the door.';
var phraseOut = Content.tokenLures(
  { en: phraseEn, lure: ['turn off', 'opens'] }, ExUtil.tokenize(phraseEn), { n: 2, random: false });
ok(phraseOut.indexOf('turn off') < 0 && phraseOut.indexOf('opens') >= 0,
   '有空格的片語不會被排進字塊（得到 ' + JSON.stringify(phraseOut) + '）');

// 句級誘答優先於字級：例句寫了形態正確的版本，就不該被原形蓋過
var sentLure = null;
Content.allVocab().some(function (v) {
  return (v.ex || []).some(function (p) {
    if (Array.isArray(p[2]) && p[2].length) { sentLure = { v: v, p: p }; return true; }
    return false;
  });
});
if (sentLure) {
  var sObj = { en: sentLure.p[0], zh: sentLure.p[1], from: sentLure.v.id, lure: sentLure.p[2] };
  var got = Content.tokenLures(sObj, ExUtil.tokenize(sObj.en), { n: 1, unitId: sentLure.v.u });
  eq(got[0], sentLure.p[2][0], '句級誘答優先於字級誘答（' + sentLure.v.w + '）');
}

/* ==========================================================================
   6. 跳關測驗
   ========================================================================== */
describe('跳關測驗');

var RULES = Content.rules();
ok(RULES.skipPass > RULES.passRate,
   '跳關的及格線比一般過關嚴（' + RULES.skipPass + ' > ' + RULES.passRate + '）');

State.data.units = {};
State.data.srs = {};
ok(Scheduler.skipTestable('s0u1'), '第一關（發音）可以考跳關測驗');
ok(!Scheduler.skipTestable('s0u2'), '還沒解鎖的關卡不能先跳');

// 光看「s0u6 沒有測驗」會通過得太廉價 —— 它本來就鎖著。
// 先把前五關標成過關讓它解鎖，這時候唯一擋得住它的理由就只剩「不是發音關」。
Content.orderedUnitIds().slice(0, 5).forEach(function (uid) { State.unit(uid).s = 1; });
ok(Content.isUnlocked('s0u6'), '（前置）s0u6 解鎖了');
ok(!Scheduler.skipTestable('s0u6'), '非發音關沒有跳關測驗');
State.data.units = {};

var skipQ = Scheduler.buildSkipTest('s0u1');
eq(skipQ.length, Scheduler.SKIP_N, '測驗題數固定（及格線才有一致的意義）');
ok(skipQ.every(function (q) { return ['listen', 'spell', 'recall'].indexOf(q.type) >= 0; }),
   '測驗只出計分題 —— 被教過再答對證明不了什麼');
var ownVocab = {};
Content.vocabOf('s0u1').forEach(function (v) { ownVocab[v.id] = 1; });
ok(skipQ.every(function (q) { return q.ref && ownVocab[q.ref.id]; }), '考的全是這一關自己的單字');
var seenRef = {}, dupRef = false;
skipQ.forEach(function (q) { if (seenRef[q.ref.id]) dupRef = true; seenRef[q.ref.id] = 1; });
ok(!dupRef, '同一個字不會在測驗裡出現兩次');

// 通過 → 一顆星 → 既有的解鎖鏈自己往前推（isUnlocked 一行都沒改）
State.data.units = {};
var passRes = Gamify.finishSkipTest('s0u1', Scheduler.SKIP_N, Scheduler.SKIP_N);
ok(passRes.passed, '全對算通過');
eq(State.unit('s0u1').s, 1, '通過給一顆星');
eq(State.unit('s0u1').lv, 0, '不給皇冠（這一關的內容其實沒上過）');
ok(!!State.unit('s0u1').skip, '存檔記得這顆星是測驗換來的');
ok(Content.isUnlocked('s0u2'), '下一關跟著解鎖');
ok(!Scheduler.skipTestable('s0u1'), '過了的關卡不再提供測驗');

// 及格線正好那一題：錯 1 題還能跳，錯 2 題就不行
State.data.units = {};
ok(Gamify.finishSkipTest('s0u1', Scheduler.skipPassCount(Scheduler.SKIP_N), Scheduler.SKIP_N).passed,
   '剛好答對及格題數算通過（' + Scheduler.skipPassCount(Scheduler.SKIP_N) + '/' + Scheduler.SKIP_N + '）');

// 差一題就是沒過：不給星，也不解鎖
State.data.units = {};
var failRes = Gamify.finishSkipTest('s0u1', Scheduler.skipPassCount(Scheduler.SKIP_N) - 1, Scheduler.SKIP_N);
ok(!failRes.passed, '差一題不算通過');
eq(State.unit('s0u1').s, 0, '沒通過不給星');
ok(!Content.isUnlocked('s0u2'), '沒通過就不解鎖下一關');
State.data.units = {};

/* ==========================================================================
   7. 弱點怪獸
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
  respond: (allRespond[0] || {}).id,
  phoneme: (allMinPair[0] || {}).id,
  convo: (allConvo[0] || {}).id
};
Object.keys(weakTypes).forEach(function (t) {
  var refId = samples[t];
  ok(refId ? !!weakQ(t, refId) : false,
     t + ' 型怪獸出得了題' + (refId ? '（' + refId + '）' : '：找不到樣本資料'));
});

/* ==========================================================================
   8. SRS 範圍：只有單字進 srs
   ========================================================================== */
describe('SRS 範圍');

State.data.srs = {};
State.data.weak.length = 0;
var g0 = allGrammar[0], r0 = allReading[0], i0 = Content.irregulars()[0];
ExUtil.gradeGrammar(g0, false, g0.u);
SRS.addWeak('reading', r0.id, r0.u);
SRS.addWeak('irregular', i0.id, '');
SRS.addWeak('phoneme', allMinPair[0].id, allMinPair[0].u);
eq(Object.keys(State.data.srs).length, 0, '文法/閱讀/不規則動詞/發音不會寫進 srs');
eq(State.data.weak.length, 4, '它們改為進弱點怪獸清單');

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
   9. 自由作答比對
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
   10. 詞庫
   ========================================================================== */
describe('詞庫');

var lexAll = Lexicon.all();
ok(lexAll.length >= 11000, '詞庫達到多益的字彙量級（' + lexAll.length + ' 字）');

var lexBad = [];
lexAll.forEach(function (e) {
  if (!e.w || !e.zh) lexBad.push(e.w || '(空)');
  else if (/\t/.test(e.w) || /\t/.test(e.zh)) lexBad.push(e.w + ' 欄位錯位');
});
ok(lexBad.length === 0, '每筆都有英文與中文，欄位沒有錯位' +
   (lexBad.length ? '：' + lexBad.slice(0, 5).join('、') : ''));

var lexDup = {}, dupWord = [];
lexAll.forEach(function (e) {
  var k = e.w.toLowerCase();
  if (lexDup[k]) dupWord.push(k);
  lexDup[k] = 1;
});
ok(dupWord.length === 0, '同一個字只會有一筆（三層合併時取最上層）' +
   (dupWord.length ? '：' + dupWord.slice(0, 5).join('、') : ''));

// 課程單字必須查得到，否則例句點字會把已經教過的字標成「不認識」
var missTaught = [];
Content.allVocab().slice(0, 400).forEach(function (v) {
  if (!Lexicon.lookup(v.w)) missTaught.push(v.w);
});
ok(missTaught.length === 0, '課程教過的字都查得到' +
   (missTaught.length ? '：' + missTaught.slice(0, 5).join('、') : ''));

// 手寫層要蓋得過自動層，否則寫了也沒用
var wr = Lexicon.lookup('warranty');
ok(wr && wr.entry.zh.indexOf('保固') >= 0,
   '手寫層蓋掉自動層（warranty 是保固，不是字典排第一的「正當理由」）');
ok(wr && wr.entry.note, '手寫層帶得出延伸用法');

/* 手寫層是為了改詞義與補例句才存在的，不該連帶把自動層的音標、英英與詞形變化
   一起蓋掉 —— 那樣「把字搬進 lexicon-core.js」這個補例句的標準做法，
   等於每補一個字就讓那個字的卡片變薄一半。 */
/* 自動層是原始字串陣列，合併時不會被改到，拿它當「本來有什麼」的基準 */
var autoRaw = {};
for (var lvA = 1; lvA <= 6; lvA++) {
  (app['DATA_LEXICON_' + lvA] || []).forEach(function (rec) {
    var f = String(rec).split('\t');
    autoRaw[f[0].toLowerCase()] = { ph: f[3] || '', en: f[4] || '', fm: f[5] || '', tag: f[6] || '' };
  });
}
function hasForm(e) {
  for (var k in e.forms) { if (Object.prototype.hasOwnProperty.call(e.forms, k)) return true; }
  return false;
}
var thin = { kk: [], en: [], forms: [] };
lexAll.forEach(function (e) {
  if (e.src !== 'core') return;
  var raw = autoRaw[e.w.toLowerCase()];
  if (!raw) return;                       // 自動層根本沒收這個字，沒得補
  if (raw.ph && !e.kk) thin.kk.push(e.w);
  if (raw.en && !e.en) thin.en.push(e.w);
  if (raw.fm && !hasForm(e)) thin.forms.push(e.w);
});
ok(thin.kk.length === 0, '手寫層沒寫音標時，自動層的音標補得回來' +
   (thin.kk.length ? '：' + thin.kk.slice(0, 5).join('、') : ''));
ok(thin.en.length === 0, '手寫層沒寫英英解釋時，自動層的補得回來' +
   (thin.en.length ? '：' + thin.en.slice(0, 5).join('、') : ''));
ok(thin.forms.length === 0, '手寫層沒寫詞形變化時，自動層的補得回來' +
   (thin.forms.length ? '：' + thin.forms.slice(0, 5).join('、') : ''));
var bal = Lexicon.lookup('balance');
ok(bal && bal.entry.forms && bal.entry.forms.p === 'balanced',
   '手寫層的字也吃得到自動層的詞形變化（balance → balanced）');
// 挑 curricula 而不是 balancing：後者 ruleForms() 自己就推得出來，
// 補沒補回來都會過，等於白測。不規則複數只有自動層那筆給得出。
var curForm = Lexicon.lookup('curricula');
ok(curForm && curForm.entry.w === 'curriculum',
   '補回來的詞形變化真的進了索引（查 curricula 回得到 curriculum）');

/* biz 標籤決定一個字進不進「商務主題」那批特訓。手寫時漏標，
   那個字就從那批裡消失了 —— 自動層標過的一定要留著。 */
var tagLost = [];
lexAll.forEach(function (e) {
  if (e.src !== 'core') return;
  var raw = autoRaw[e.w.toLowerCase()];
  if (raw && /(^| )biz( |$)/.test(raw.tag) && (e.tags || []).indexOf('biz') < 0) tagLost.push(e.w);
});
ok(tagLost.length === 0, '自動層標過 biz 的字，進了手寫層也還在商務主題裡' +
   (tagLost.length ? '：' + tagLost.slice(0, 5).join('、') : ''));

/* 手寫層存在的理由就是例句 —— 少寫一句，那個字留在自動層還比較好 */
var exBad = [];
(app.DATA_LEXICON_CORE || []).forEach(function (v) {
  if (!v.ex || v.ex.length < 2) { exBad.push(v.w + ' 例句不足兩句'); return; }
  v.ex.forEach(function (p) {
    if (!p || !p[0] || !p[1]) exBad.push(v.w + ' 例句缺英文或中譯');
  });
});
ok(exBad.length === 0, '手寫層每一筆都有日常與職場兩句中英對照例句' +
   (exBad.length ? '：' + exBad.slice(0, 5).join('、') : ''));

/* 商務字是這個 App 的目標，一個例句都給不出來的商務字就是查了也學不到東西 */
var bizDry = [];
Lexicon.byTag('biz').forEach(function (e) {
  var has = (e.ex || []).some(function (p) { return p && p[0]; }) || e.use;
  if (!has) bizDry.push(e.w);
});
ok(bizDry.length === 0, '商務標籤的字都給得出例句（' + Lexicon.byTag('biz').length + ' 字）' +
   (bizDry.length ? '，還缺 ' + bizDry.length + '：' + bizDry.slice(0, 8).join('、') : ''));

/* 第 1 級是詞頻最高的那一批，interest、case、power 這種一字多義的字沒有例句，
   詞義欄裡並排的三四個意思就分不出哪個常用在哪裡。這一級已經補完，別讓它退回去。 */
var lv1Dry = [];
Lexicon.byLevel(1).forEach(function (e) {
  var has = (e.ex || []).some(function (p) { return p && p[0]; }) || e.use;
  if (!has) lv1Dry.push(e.w);
});
ok(lv1Dry.length === 0, '第 1 級的字都給得出例句（' + Lexicon.byLevel(1).length + ' 字）' +
   (lv1Dry.length ? '，還缺 ' + lv1Dry.length + '：' + lv1Dry.slice(0, 8).join('、') : ''));

// 手寫層碰上課程已經教過的字：詞義以課程為準，但延伸用法要補上去
var ad = Lexicon.lookup('address');
ok(ad && ad.entry.u, 'address 用的是課程那筆（有綁關卡）');
ok(ad && ad.entry.note && ad.entry.note.indexOf('演說') >= 0,
   '課程的字也吃得到手寫層的延伸用法（否則為已教的字寫 note 等於白寫）');
// col 不能從手寫層流進課程單字 —— collocate 題型會直接把它當題庫
var colLeak = [];
Content.allVocab().forEach(function (v) {
  (v.col || []).forEach(function (c) {
    if (String(c[0]).toLowerCase().indexOf(v.w.toLowerCase()) < 0) colLeak.push(v.w + ' → ' + c[0]);
  });
});
ok(colLeak.length === 0, '搭配詞一律含目標字（挖空才挖得出來）' +
   (colLeak.length ? '：' + colLeak.slice(0, 5).join('、') : ''));

// 詞形變化還原
var infl = [['abandoned', 'abandon'], ['negotiating', 'negotiate'], ['shipments', 'shipment']];
var inflBad = [];
infl.forEach(function (p) {
  var h = Lexicon.lookup(p[0]);
  if (!h || h.entry.w !== p[1]) inflBad.push(p[0] + ' → ' + (h ? h.entry.w : '查不到'));
  else if (!h.via) inflBad.push(p[0] + ' 沒說明這是變化形');
});
ok(inflBad.length === 0, '變化形查得回原形，而且說得出是哪一種變化' +
   (inflBad.length ? '：' + inflBad.join('、') : ''));

// went 本身是課程單字（s1u5 教過去式時單獨教過），所以拿 gone 來測
var irr = Lexicon.lookup('gone');
ok(irr && irr.entry.w === 'go', '不規則動詞的過去分詞查得回原形（gone → go）');
var irr2 = Lexicon.lookup('said');
ok(irr2 && irr2.entry.w === 'say', '不規則動詞的過去式查得回原形（said → say）');

// 詞條本身優先於別人的變化形：left 是獨立的字，不該被 leave 蓋掉
var lf = Lexicon.lookup('left');
ok(lf && lf.entry.w === 'left' && !lf.via, '自己就是詞條的字不會被當成別人的變化形');

/* markup：先轉義再包 span，實體不能被拆開 */
var mk = Lexicon.markup('Tom & Amy said "run".');
ok(mk.indexOf('&amp;') >= 0, 'markup 保留 HTML 實體（& 沒有被拆成 amp）');
ok(mk.indexOf('>amp<') < 0, 'markup 不會把實體裡的字母包成單字');
ok(/data-lexw="run"/.test(mk), 'markup 把句子裡的字包成可點的 span');
ok(Lexicon.markup('a<b>c').indexOf('<b>') < 0, 'markup 會轉義使用者資料裡的標籤');

/* 詞庫特訓 */
var drillWords = Lexicon.byLevel(3).slice(0, 8);
var drill = Scheduler.buildLexiconDrill(drillWords);
ok(drill.length > 0, '詞庫特訓組得出題目（' + drill.length + ' 題）');
ok(drill.some(function (q) { return q.type === 'flashcard'; }), '特訓有單字卡（沒教過就直接考等於猜謎）');
ok(drill.every(function (q) { return q.ref && q.ref.w; }), '特訓每一題都掛得到單字');
eq(Scheduler.buildLexiconDrill([]).length, 0, '沒有字就不組題');

/* 詞庫的字答錯後要出得了題 —— Content.item 查不到 lx: 開頭的 id */
var lxWord = drillWords[0];
ok(Lexicon.item(lxWord.id) === lxWord, 'Lexicon.item 認得 lx: 開頭的 id');
State.data.weak.length = 0;
SRS.addWeak('vocab', lxWord.id, '');
var lxWeak = Scheduler.buildReview(20).filter(function (q) {
  return q.ref && q.ref.id === lxWord.id;
});
ok(lxWeak.length > 0, '詞庫的字變成弱點怪獸後出得了題（否則永遠消不掉）');

State.data.weak.length = 0;
State.data.srs[lxWord.id] = { ef: 2.5, iv: 1, rep: 1, due: State.dayStr(), lap: 0, n: 1 };
var lxDue = Scheduler.buildReview(20).filter(function (q) {
  return q.ref && q.ref.id === lxWord.id;
});
ok(lxDue.length > 0, '詞庫的字到期後排得進複習佇列');
delete State.data.srs[lxWord.id];

/* ==========================================================================
   結果
   ========================================================================== */
console.log('\n' + (fails.length ? '✗' : '✓') + ' 通過 ' + pass + ' 項' +
            (fails.length ? '，失敗 ' + fails.length + ' 項：' : '。'));
fails.forEach(function (f) { console.log('  - ' + f); });
process.exit(fails.length ? 1 : 0);
