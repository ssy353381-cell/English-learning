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
               m: 'minpair', c: 'convo', x: 'part6', d: 'part7', b: 'parse' };
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
var allPart6 = [], allPart7 = [], allParse = [];
Content.orderedUnitIds().forEach(function (uid) {
  allGrammar = allGrammar.concat(Content.grammarOf(uid));
  allReading = allReading.concat(Content.readingOf(uid));
  allPhoto = allPhoto.concat(Content.photoOf(uid));
  allRespond = allRespond.concat(Content.respondOf(uid));
  allMinPair = allMinPair.concat(Content.minPairsOf(uid));
  allConvo = allConvo.concat(Content.convoOf(uid));
  allPart6 = allPart6.concat(Content.part6Of(uid));
  allPart7 = allPart7.concat(Content.part7Of(uid));
  allParse = allParse.concat(Content.parseOf(uid));
});
checkIds(allGrammar, 'grammar');
checkIds(allReading, 'reading');
checkIds(Content.irregulars(), 'irregular');
checkIds(allPhoto, 'photo');
checkIds(allRespond, 'respond');
checkIds(allMinPair, 'minpair');
checkIds(allConvo, 'convo');
checkIds(allPart6, 'part6');
checkIds(allPart7, 'part7');
checkIds(allParse, 'parse');

ok(dupes.length === 0, 'id 全域唯一（四種資料共用 byId 索引）' + (dupes.length ? '：' + dupes.slice(0, 5).join('、') : ''));
ok(badPrefix.length === 0, 'id 前綴與型別相符（v/g/r/i/p/q/m/c/x/d/b）' + (badPrefix.length ? '：' + badPrefix.slice(0, 5).join('、') : ''));

var unitIds = {};
Content.orderedUnitIds().forEach(function (u) { unitIds[u] = 1; });
var orphan = [];
Content.allVocab().concat(allGrammar, allReading, allPhoto, allRespond, allMinPair, allConvo,
                          allPart6, allPart7, allParse).forEach(function (x) {
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
eq(Object.keys(exTypes).length, 20, '註冊了 20 種題型');

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
  convo: (allConvo[0] || {}).id,
  part6: (allPart6[0] || {}).id,
  part7: (allPart7[0] || {}).id,
  parse: (allParse[0] || {}).id
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

/* 詞庫特訓答錯時，存進弱點怪獸的是這一筆的 id。手寫層的資料裡沒有 id 欄
   （課程單字才有 v0001 這種），adopt() 忘了補的話存進去的是 undefined ——
   那隻怪獸從此出不了題也消不掉，而且畫面上完全看不出來。
   自動層在 makeAuto() 就配好了，所以只有手寫層會踩到，
   而測試又只從 byLevel() 抽前幾個，抽到自動層那筆就會假綠 —— 這裡直接掃全部。 */
var noId = lexAll.filter(function (e) { return !e.id; });
ok(noId.length === 0, '詞庫每一筆都有 id（弱點怪獸靠它才消得掉）' +
   (noId.length ? '，還缺 ' + noId.length + '：' + noId.slice(0, 5).map(function (e) {
     return e.w + '（' + e.src + '）';
   }).join('、') : ''));
var coreId = Lexicon.lookup('surveyor');
ok(coreId && Lexicon.item(coreId.entry.id) === coreId.entry,
   '手寫層的字用自己的 id 查得回同一筆（surveyor → ' + (coreId ? coreId.entry.id : '?') + '）');

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

/* 中英兩欄不能互相混進去。一句英文裡混進一個中文字（打字時輸入法沒切換），
   markup() 的 TOKEN_RE 會在那個字前面停住，於是句子照樣包得出 span、
   dead click 那項也照樣綠 —— 只有真的把卡片打開來看才會發現。
   反過來中譯整句忘了翻，也是同一種無聲的錯。
   不能改成「英文欄一律 ASCII」：café、résumé 是真的會出現的字。 */
var CJK = /[　-〿㐀-䶿一-鿿＀-￯]/;
var mixBad = [];
(app.DATA_LEXICON_CORE || []).forEach(function (v) {
  (v.ex || []).forEach(function (p) {
    if (!p) return;
    if (p[0] && CJK.test(p[0])) mixBad.push(v.w + ' 英文句混進中文：' + p[0]);
    if (p[1] && !CJK.test(p[1])) mixBad.push(v.w + ' 中譯沒有中文：' + p[1]);
  });
});
ok(mixBad.length === 0, '例句的英文欄沒混進中文、中譯欄沒漏翻' +
   (mixBad.length ? '，' + mixBad.length + ' 處：' + mixBad.slice(0, 3).join('、') : ''));

/* 商務字是這個 App 的目標，一個例句都給不出來的商務字就是查了也學不到東西 */
var bizDry = [];
Lexicon.byTag('biz').forEach(function (e) {
  var has = (e.ex || []).some(function (p) { return p && p[0]; }) || e.use;
  if (!has) bizDry.push(e.w);
});
ok(bizDry.length === 0, '商務標籤的字都給得出例句（' + Lexicon.byTag('biz').length + ' 字）' +
   (bizDry.length ? '，還缺 ' + bizDry.length + '：' + bizDry.slice(0, 8).join('、') : ''));

/* 補完一級就在這裡釘一級。第 1 級是詞頻最高的那一批（interest、case、power 這種
   一字多義的字沒有例句，詞義欄裡並排的三四個意思就分不出哪個常用在哪裡）；
   第 2 級是「看得懂、講不出來」的那一層；第 3 級再往外一圈，多半連看都不一定看得懂；
   第 4 級的字綁在特定領域上（醫療、法律、軍事、學科名），一篇文章裡卡住一個就讀不下去。
   補完的級數只會往下加，不會往回退。 */
[1, 2, 3, 4].forEach(function (lv) {
  var dry = [];
  Lexicon.byLevel(lv).forEach(function (e) {
    var has = (e.ex || []).some(function (p) { return p && p[0]; }) || e.use;
    if (!has) dry.push(e.w);
  });
  ok(dry.length === 0, '第 ' + lv + ' 級的字都給得出例句（' + Lexicon.byLevel(lv).length + ' 字）' +
     (dry.length ? '，還缺 ' + dry.length + '：' + dry.slice(0, 8).join('、') : ''));
});

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

/* 一個變化形被兩個字搶走時，兩筆都要留住。
   -f 名詞的複數剛好等於 -ve 動詞的第三人稱（leaves／lives／halves／shelves／calves），
   先進索引的贏 —— 贏的那一邊是對的，輸的那一邊也是對的，所以卡片上兩個都要出現。
   只檢查「有沒有第二筆」而不釘死誰先誰後：誰先進索引由詞頻決定，不是這一條在保證的事。 */
var oneWay = ['leaves', 'lives', 'halves'].filter(function (w) {
  var h = Lexicon.lookup(w);
  return !(h && h.alt && h.alt.w && h.alt.w !== h.entry.w);
});
ok(oneWay.length === 0, '被兩個字共用的變化形，查詢卡兩筆都列得出來' +
   (oneWay.length ? '：' + oneWay.join('、') + ' 只查得到一邊' : ''));

/* -f → -ves 的複數：課程單字沒有 forms 欄，規則推出來的是 shelfs，
   真正會被點到的 shelves 以前整個查不到（沒有第二個候選，就只是查得到而已） */
var shv = Lexicon.lookup('shelves');
ok(shv && shv.entry.w === 'shelf', 'shelves 查得回 shelf（課程單字的 -f 複數）');

/* 只有一個主人的變化形不該冒出第二筆 —— alt 要是真的有歧義才給 */
var solo = Lexicon.lookup('gone');
ok(solo && !solo.alt, '沒有歧義的變化形不會多出一筆候選');

/* markup：先轉義再包 span，實體不能被拆開 */
var mk = Lexicon.markup('Tom & Amy said "run".');
ok(mk.indexOf('&amp;') >= 0, 'markup 保留 HTML 實體（& 沒有被拆成 amp）');
ok(mk.indexOf('>amp<') < 0, 'markup 不會把實體裡的字母包成單字');
ok(/data-lexw="run"/.test(mk), 'markup 把句子裡的字包成可點的 span');
ok(Lexicon.markup('a<b>c').indexOf('<b>') < 0, 'markup 會轉義使用者資料裡的標籤');

/* 重音字母：課程例句裡就有 café 與 résumé。TOKEN_RE 少了重音範圍的話，
   café 會斷成可點的 caf 加一個掉在 span 外面的 é。 */
var mkAcc = Lexicon.markup('Meet me at the café.');
ok(/data-lexw="café"/.test(mkAcc), 'markup 把重音字母含進同一個字（café 不會斷成 caf）');
ok(mkAcc.indexOf('</span>é') < 0, 'é 沒有掉在 span 外面');
var accHit = Lexicon.lookup('café');
ok(accHit && accHit.entry.w === 'cafe', 'norm 把 é 摺成 e，café 查得到 cafe');

/* 縮寫：esc() 會把 ' 轉成 &#39;，TOKEN_RE 不把那個實體吃進單字裡的話，
   每一個縮寫都被切成兩半（doesn ／ t），兩半都查不到。 */
var mkC = Lexicon.markup("It doesn't work.");
ok(/data-lexw="doesn&#39;t"/.test(mkC), 'markup 不會在縮寫的那一撇切開（doesn\'t 是一個字）');
ok(mkC.indexOf('data-lexw="doesn"') < 0, '縮寫沒有留下查不到的半截');
var contr = [["can't", 'can'], ["won't", 'will'], ["I'm", 'I'], ["I'll", 'I'], ["didn't", 'do']];
var contrBad = [];
contr.forEach(function (p) {
  var h = Lexicon.lookup(p[0]);
  if (!h || h.entry.w.toLowerCase() !== p[1].toLowerCase()) {
    contrBad.push(p[0] + ' → ' + (h ? h.entry.w : '查不到'));
  }
});
ok(contrBad.length === 0, '縮寫查得回開頭那個字（ExUtil.matchAny 早就會展開，查詢這側也要）' +
   (contrBad.length ? '：' + contrBad.join('、') : ''));

/* ruleForms 推不出來的那幾類。每一個都在本 repo 的例句裡真的出現過。 */
var formCases = [['cheaper', 'cheap'], ['biggest', 'big'], ['busier', 'busy'], ['latest', 'late'],
                 ['photos', 'photo'], ['children', 'child'], ['men', 'man'], ['teeth', 'tooth'],
                 ['permitted', 'permit'], ['occurred', 'occur'], ['transferred', 'transfer'],
                 ['feelings', 'feel'], ['savings', 'save'], ['meant', 'mean'], ['hung', 'hang']];
var formBad = [];
formCases.forEach(function (p) {
  var h = Lexicon.lookup(p[0]);
  if (!h || h.entry.w.toLowerCase() !== p[1]) formBad.push(p[0] + ' → ' + (h ? h.entry.w : '查不到'));
});
ok(formBad.length === 0, '比較級、不規則複數、重複子音與動名詞複數都查得回原形' +
   (formBad.length ? '：' + formBad.join('、') : ''));

/* 課程單字沒有 forms 欄，自動層有的話要補進去。拿 oversee 測而不是 occur：
   occurred 靠重複子音的規則也推得出來，overseen／oversaw 只有 ECDICT 給得出，
   補不進去就只剩規則推得到的那幾種變化。 */
var ovs = Lexicon.lookup('overseen');
ok(ovs && ovs.entry.w === 'oversee' && ovs.entry.u,
   '課程單字補得到自動層的詞形變化（overseen → oversee，且 oversee 有綁關卡）');

/* 複數所有格只有一撇 */
var possP = Lexicon.lookup("weeks'");
ok(possP && possP.entry.w === 'week', '複數的所有格查得回原形（two weeks\' notice）');

/* 連字號複合字收不完，但拆開後每一段都查得到 —— 整串不可點才是最糟的 */
var mkH = Lexicon.markup('a two-year contract');
ok(/data-lexw="two"/.test(mkH) && /data-lexw="year"/.test(mkH),
   '查不到的連字號複合字拆成各段分別可點（two-year → two ／ year）');
ok(/class="lexw known" data-lexw="Wi-Fi"/.test(Lexicon.markup('free Wi-Fi here')),
   '整串查得到的連字號字不拆開（Wi-Fi 是一個詞條）');

/* 例句點字的覆蓋率。本 repo 手寫的例句掃一遍，包成 span 卻查不到的字全部撿出來，
   再只留「小寫開頭且不只一個字母」的 —— 剩下的專有名詞（Taipei、Amy、June）查不到
   是對的，a.m. 拆出來的孤字 m 也不是字。過濾完應該一個都不剩：留下來的每一個
   都是真的有人點得到、點開卻是空的字。
   數量門檻擋不住這種事（少一個字還在門檻內），所以這裡不設門檻，直接要求歸零。 */
var deadClicks = {};
var deadRe = /<span class="lexw" data-lexw="([^"]*)">/g;
function scanClicks(text) {
  if (!text) return;
  var html = Lexicon.markup(String(text)), m;
  deadRe.lastIndex = 0;
  while ((m = deadRe.exec(html))) deadClicks[m[1]] = 1;
}
Lexicon.all().forEach(function (e) {
  if (e.src === 'auto') return;             // WordNet 那批句子滿是專有名詞，不是本 repo 寫的
  (e.ex || []).forEach(function (p) { if (p && p[0]) scanClicks(p[0]); });
});
// 文法點的練習句與長難句的原句／骨架也走 markup()，一樣點得開。
// 短文與 Part 6／7 的內文刻意不掃：那些文件滿是虛構的人名地名，
// 而過濾條件是「小寫開頭」，擋不掉 the Kestrel account 這種夾在句中的專有名詞。
allGrammar.forEach(function (g) { (g.sents || []).forEach(function (p) { scanClicks(p[0]); }); });
allParse.forEach(function (b) { scanClicks(b.full); scanClicks(b.core[0]); });
var deadReal = Object.keys(deadClicks).filter(function (w) {
  return w.length > 1 && w.charAt(0) === w.charAt(0).toLowerCase();
});
ok(deadReal.length === 0, '手寫例句裡的一般字沒有一個點開是空的' +
   (deadReal.length ? '，還缺 ' + deadReal.length + '：' + deadReal.slice(0, 10).join('、') : ''));

/* 「同家族」那一排是按鈕，點下去就查那個字 —— 和例句裡的可點字是同一件事，
   只是它不經過 markup()，所以上面那項掃不到。手寫層寫 fam 時很容易順手寫出
   一個詞庫根本沒收的衍生字（bookkeeper、liquidate、February），卡片上照樣
   印成按鈕，點開卻是空的。 */
var famDead = [];
(app.DATA_LEXICON_CORE || []).forEach(function (v) {
  (v.fam || []).forEach(function (w) { if (!Lexicon.lookup(w)) famDead.push(v.w + ' → ' + w); });
});
ok(famDead.length === 0, '手寫層的「同家族」每一個字都查得到' +
   (famDead.length ? '，還缺 ' + famDead.length + '：' + famDead.slice(0, 8).join('、') : ''));

/* ==========================================================================
   Stage 4：Part 6 段落填空與 Part 7 雙篇閱讀
   ========================================================================== */
describe('Stage 4');

/* 每一個可玩的關卡，配方要的題數都要真的排得出來。
   這是最容易無聲壞掉的地方：出不來的題型不會噴錯，只是靜靜地不出現 ——
   魔王關寫了 recall 10 卻一題都沒有，玩起來只覺得「這關好短」。 */
var planShort = [];
Content.orderedUnitIds().forEach(function (uid) {
  if (!Content.isReady(uid)) return;
  var got = {};
  Scheduler.buildLesson(uid).forEach(function (q) { got[q.type] = (got[q.type] || 0) + 1; });
  (Content.planOf(uid) || []).forEach(function (p) {
    // intro 是教學卡，有幾個文法點就幾張，配方寫 1 只是「要不要」
    if (p[0] === 'intro') return;
    if ((got[p[0]] || 0) < p[1]) planShort.push(uid + ' 的 ' + p[0] + '（' + (got[p[0]] || 0) + '/' + p[1] + '）');
  });
});
ok(planShort.length === 0, '每個可玩關卡的配方都排得滿' +
   (planShort.length ? '：' + planShort.slice(0, 6).join('、') : ''));

/* Part 6 的空格標號要從 1 連號到 blanks.length —— 題型模組是照號碼把選到的字
   填回文章裡的，少一個號碼就會有一格永遠填不上，多一個則指向不存在的題目 */
var p6Bad = [];
allPart6.forEach(function (x) {
  var nums = (String(x.text).match(/___(\d+)___/g) || [])
    .map(function (m) { return +m.replace(/_/g, ''); });
  var want = (x.blanks || []).length;
  if (!want) { p6Bad.push(x.id + ' 沒有 blanks'); return; }
  if (nums.length !== want) { p6Bad.push(x.id + ' 文章有 ' + nums.length + ' 個空格但 blanks 有 ' + want + ' 題'); return; }
  nums.slice().sort(function (a, b) { return a - b; }).forEach(function (n, i) {
    if (n !== i + 1) p6Bad.push(x.id + ' 的空格標號不是 1..' + want);
  });
  (x.blanks || []).forEach(function (b, i) {
    if (!b.opts || b.opts.length < 2) p6Bad.push(x.id + ' 第 ' + (i + 1) + ' 格選項不足');
    else if (!(b.a >= 0 && b.a < b.opts.length)) p6Bad.push(x.id + ' 第 ' + (i + 1) + ' 格的答案索引超出範圍');
    if (!b.why) p6Bad.push(x.id + ' 第 ' + (i + 1) + ' 格沒有解析');
  });
});
ok(p6Bad.length === 0, 'Part 6 的空格標號連號、選項與解析齊全（' + allPart6.length + ' 篇）' +
   (p6Bad.length ? '：' + p6Bad.slice(0, 5).join('、') : ''));

/* 每篇 Part 6 都要有一題整句插入題 —— 那是這個題型和 Part 5 差最多的一種，
   而且真實測驗每篇必有一題 */
ok(allPart6.every(function (x) {
  return (x.blanks || []).some(function (b) { return b.kind === 'sentence'; });
}), '每篇 Part 6 都有一題整句插入題');

/* Part 7 雙篇的重點就是跨篇對照。沒有 both:true 的那一組，
   等於把兩篇單篇擺在一起，這個題型就白做了 */
var p7Bad = [];
allPart7.forEach(function (d) {
  if (!d.docs || d.docs.length < 2) { p7Bad.push(d.id + ' 不到兩份文件'); return; }
  d.docs.forEach(function (doc, i) {
    if (!doc.text) p7Bad.push(d.id + ' 第 ' + (i + 1) + ' 份文件沒有內文');
  });
  if (!(d.qs || []).length) { p7Bad.push(d.id + ' 沒有題目'); return; }
  if (!d.qs.some(function (q) { return q.both; })) p7Bad.push(d.id + ' 沒有任何跨篇題');
  d.qs.forEach(function (q, i) {
    if (!q.opts || q.opts.length < 2) p7Bad.push(d.id + ' 第 ' + (i + 1) + ' 題選項不足');
    else if (!(q.a >= 0 && q.a < q.opts.length)) p7Bad.push(d.id + ' 第 ' + (i + 1) + ' 題的答案索引超出範圍');
  });
});
ok(p7Bad.length === 0, 'Part 7 每組都有兩份文件與至少一題跨篇題（' + allPart7.length + ' 組）' +
   (p7Bad.length ? '：' + p7Bad.slice(0, 5).join('、') : ''));

/* Part 6／7 一題就要好幾分鐘，和閱讀、Part 3／4 一樣重。
   沒有一起限流的話，一輪複習可能排進兩篇雙篇閱讀，整個複習就毀了。
   用行為測而不是掃原始碼 —— 掃字串的話，兩張表只改對一張也會過。 */
function heavyCount(list) {
  State.data.srs = {};
  State.data.weak.length = 0;
  list.forEach(function (p, i) {
    State.data.weak.push({ k: p[0] + ':' + p[1], t: p[0], r: p[1], u: '', n: 9 - i, at: State.dayStr() });
  });
  var q = Scheduler.buildReview(20);
  State.data.weak.length = 0;
  return q.filter(function (x) {
    return x.type === 'read' || x.type === 'convo' || x.type === 'part6' || x.type === 'part7';
  }).length;
}
// part7 排在最前面（n 最大）是刻意的：它要先被處理，才驗得到「有沒有被放進 tail」。
// 放後面的話，前面那個 part6 已經佔滿 tail，後面全被擋掉，兩張表只改對一張也會過。
var heavyPairs = [];
if (allPart7.length >= 2) heavyPairs.push(['part7', allPart7[0].id], ['part7', allPart7[1].id]);
if (allPart6.length >= 2) heavyPairs.push(['part6', allPart6[0].id], ['part6', allPart6[1].id]);
if (allReading.length) heavyPairs.push(['reading', allReading[0].id]);
ok(heavyPairs.length >= 4 && heavyCount(heavyPairs) === 1,
   '一輪複習最多只排進一個「重」的項目（閱讀／Part 3・4／Part 6／Part 7 合計，實得 ' +
   heavyCount(heavyPairs) + '）');

/* 拼字題是字母銀行，有空格的字拼不出那個空格 —— 片語動詞那一關全部是這種字 */
var spellSpaced = [];
Content.orderedUnitIds().forEach(function (uid) {
  if (!Content.isReady(uid)) return;
  Scheduler.buildLesson(uid).forEach(function (q) {
    if (q.type === 'spell' && /\s/.test(q.ref.w)) spellSpaced.push(uid + ' → ' + q.ref.w);
  });
});
ok(spellSpaced.length === 0, '拼字題不會出有空格的字（字母銀行拼不出空格）' +
   (spellSpaced.length ? '：' + spellSpaced.slice(0, 5).join('、') : ''));

/* 弱點怪獸的型別在複習頁要有中文名字，否則畫面上會印出 part6 這種內部代號。
   掃 review.js 的對照表，和 addWeak 用到的型別比對。 */
var revSrc = fs.readFileSync(path.join(ROOT, 'js/views/review.js'), 'utf8');
var revBlock = revSrc.slice(revSrc.indexOf('var WEAK_LABEL'), revSrc.indexOf('var tab'));
var noLabel = Object.keys(weakTypes).filter(function (t) {
  return !new RegExp('(^|[^a-zA-Z])' + t + '\\s*:').test(revBlock);
});
ok(noLabel.length === 0, '每種弱點怪獸在複習頁都有中文名字' +
   (noLabel.length ? '：' + noLabel.join('、') + ' 會印出內部代號' : ''));

/* Stage 4 十關全部可玩 —— 解鎖是一條鏈，中間空一關後面就永遠開不了 */
var s4 = Content.orderedUnitIds().filter(function (u) { return u.indexOf('s4u') === 0; });
var s4NotReady = s4.filter(function (u) { return !Content.isReady(u); });
ok(s4.length === 10 && s4NotReady.length === 0,
   'Stage 4 十關都可玩' + (s4NotReady.length ? '：' + s4NotReady.join('、') + ' 還是製作中' : ''));

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
   Stage 5：長難句拆解與三篇閱讀
   ========================================================================== */
describe('Stage 5');

/* 十關全部可玩 —— 和 Stage 4 同一條規則：解鎖是一條鏈，中間空一關後面永遠開不了 */
var s5 = Content.orderedUnitIds().filter(function (u) { return u.indexOf('s5u') === 0; });
var s5NotReady = s5.filter(function (u) { return !Content.isReady(u); });
ok(s5.length === 10 && s5NotReady.length === 0,
   'Stage 5 十關都可玩' + (s5NotReady.length ? '：' + s5NotReady.join('、') + ' 還是製作中' : ''));

/* 長難句的 seg 用一個空格接起來要還原成 full。
   這是這個題型唯一會無聲壞掉的地方：少一個逗號、多一個空格，畫面照樣排得出來，
   但學的人讀到的就不是原句了 —— 而拆解練的正好是「照著原句找骨架」。 */
var parseBad = [];
allParse.forEach(function (b) {
  var seg = b.seg || [];
  if (seg.length < 3) { parseBad.push(b.id + ' 不到三段'); return; }
  var joined = seg.map(function (s) { return s[0]; }).join(' ');
  if (joined !== b.full) parseBad.push(b.id + ' 接不回 full');
  var roles = seg.map(function (s) { return s[1]; });
  if (roles.filter(function (r) { return r === 'S'; }).length !== 1) parseBad.push(b.id + ' 主詞不是剛好一段');
  if (roles.filter(function (r) { return r === 'V'; }).length !== 1) parseBad.push(b.id + ' 主要動詞不是剛好一段');
  if (roles.some(function (r) { return !r; })) parseBad.push(b.id + ' 有一段沒寫角色');
  if (!Array.isArray(b.core) || !b.core[0] || !b.core[1]) parseBad.push(b.id + ' 的 core 不是 [英, 中]');
  if (!b.why) parseBad.push(b.id + ' 沒有解析');
});
ok(parseBad.length === 0, '長難句的各段接得回原句，主詞與主要動詞各剛好一段（' +
   allParse.length + ' 句）' + (parseBad.length ? '：' + parseBad.slice(0, 5).join('、') : ''));

/* 骨架必須真的比原句短。core 直接照抄整句的話，這個題型就只剩「點兩下」，
   而它存在的理由就是「抽掉修飾語之後短得驚人」。 */
var coreLong = allParse.filter(function (b) {
  return b.core[0].split(/\s+/).length > b.full.split(/\s+/).length * 0.7;
});
ok(coreLong.length === 0, '骨架比原句短得夠明顯（不到七成長度）' +
   (coreLong.length ? '：' + coreLong.map(function (b) { return b.id; }).slice(0, 5).join('、') : ''));

/* Part 7 三篇：至少要有一組真的是三份文件，否則 Stage 5 那一關還在練雙篇 */
var triples = allPart7.filter(function (d) { return (d.docs || []).length >= 3; });
ok(triples.length >= 1, 'Part 7 有三篇閱讀的題組（' + triples.length + ' 組）');

/* 三篇的跨篇題要多於雙篇 —— 只在前兩份之間對照的話，第三份就只是裝飾 */
var thinTriple = triples.filter(function (d) {
  return d.qs.filter(function (q) { return q.both; }).length < 3;
});
ok(thinTriple.length === 0, '三篇的題組至少有三題跨篇' +
   (thinTriple.length ? '：' + thinTriple.map(function (d) { return d.id; }).join('、') : ''));

/* 長難句答錯後要出得了題。weakQuestion 漏接新型別的話，怪獸進得了清單卻永遠消不掉 ——
   前面那一項掃的是 SRS.addWeak 的字串參數，這裡直接把怪獸餵進去跑一次。 */
State.data.weak.length = 0;
SRS.addWeak('parse', allParse[0].id, allParse[0].u);
var parseWeak = Scheduler.buildReview(20).filter(function (q) { return q.type === 'parse'; });
ok(parseWeak.length > 0, '長難句變成弱點怪獸後出得了題');
ok(parseWeak.length === 0 || parseWeak[0].ref.id === allParse[0].id,
   '重問的是同一句（換一句只是再猜一次）');
State.data.weak.length = 0;

/* ==========================================================================
   結果
   ========================================================================== */
console.log('\n' + (fails.length ? '✗' : '✓') + ' 通過 ' + pass + ' 項' +
            (fails.length ? '，失敗 ' + fails.length + ' 項：' : '。'));
fails.forEach(function (f) { console.log('  - ' + f); });
process.exit(fails.length ? 1 : 0);
