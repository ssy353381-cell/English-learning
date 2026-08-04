#!/usr/bin/env node
/* ==========================================================================
   tools/verify-bundle.js — 檢查單檔版有沒有落後於多檔版

   為什麼需要這支腳本：
     改完 css/js/data 卻忘了重新打包，單檔版就會停在舊版本。
     檔案大小、修改時間、甚至肉眼看首頁都看不出來 —— 曾經無聲上線過一次。
     唯一可靠的方法是把單檔版按區塊標頭拆回去，逐一與原始檔比對。

   檢查三件事：
     1. index.html 引用的每個檔案都真的存在
     2. 單檔版的區塊清單與順序，和 index.html 的引用順序一致
        （抓「新增了檔案卻沒重新打包」與「加進 index.html 時漏排順序」）
     3. 每個區塊的內容與原始檔逐字元相同

   用法：node tools/verify-bundle.js
   ========================================================================== */
'use strict';

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var SRC = path.join(ROOT, 'index.html');
var OUT = path.join(ROOT, 'English-Learning.html');

/* 和 build.js 同一組樣式；改一邊就要改另一邊，否則驗證會失去意義 */
var LINK_RE = /<link[^>]*rel\s*=\s*"stylesheet"[^>]*href\s*=\s*"([^"]+)"[^>]*>/g;
var SCRIPT_RE = /<script[^>]*src\s*=\s*"([^"]+)"[^>]*>\s*<\/script>/g;
var BLOCK_RE = /<(style|script)>\n\/\* ===== (.+?) ===== \*\/\n([\s\S]*?)\n<\/\1>/g;

var errors = [];
function fail(msg) { errors.push(msg); }

/** index.html 的引用順序（CSS 在前、JS 在後，和打包順序一致） */
function referenced() {
  var html = fs.readFileSync(SRC, 'utf8');
  var css = [], js = [], m;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(html))) css.push(m[1].replace(/\?.*$/, ''));
  SCRIPT_RE.lastIndex = 0;
  while ((m = SCRIPT_RE.exec(html))) js.push(m[1].replace(/\?.*$/, ''));
  return css.concat(js);
}

/** 單檔版拆回各區塊 */
function blocks() {
  var html = fs.readFileSync(OUT, 'utf8');
  var out = [], m;
  BLOCK_RE.lastIndex = 0;
  while ((m = BLOCK_RE.exec(html))) {
    var body = m[3];
    // 打包時把 </script> 轉義過，比對前要還原
    if (m[1] === 'script') body = body.replace(/<\\\/script>/g, '</script>');
    out.push({ rel: m[2], body: body });
  }
  return out;
}

/** 回報第一個不同的位置，比「內容不同」有用得多 */
function firstDiff(a, b) {
  var i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  var line = a.slice(0, i).split('\n').length;
  return { line: line, a: JSON.stringify(a.substr(i, 40)), b: JSON.stringify(b.substr(i, 40)) };
}

function main() {
  if (!fs.existsSync(OUT)) {
    console.error('找不到 English-Learning.html，請先執行 node tools/build.js。');
    process.exit(1);
  }

  var refs = referenced();
  var bs = blocks();

  // 1. 引用的檔案都存在
  refs.forEach(function (rel) {
    if (!fs.existsSync(path.join(ROOT, rel))) fail('index.html 引用了不存在的檔案：' + rel);
  });

  // 2. 區塊清單與順序
  var refKey = refs.join('|'), blockKey = bs.map(function (b) { return b.rel; }).join('|');
  if (refKey !== blockKey) {
    fail('單檔版的區塊與 index.html 的引用不一致（順序或檔案數不同）。');
    refs.filter(function (r) { return blockKey.indexOf(r) < 0; })
        .forEach(function (r) { fail('  單檔版缺少：' + r + '（新增檔案後要重新打包）'); });
    bs.map(function (b) { return b.rel; })
      .filter(function (r) { return refKey.indexOf(r) < 0; })
      .forEach(function (r) { fail('  單檔版多出：' + r + '（index.html 已移除）'); });
  }

  // 3. 逐區塊比對內容
  var same = 0;
  bs.forEach(function (b) {
    var abs = path.join(ROOT, b.rel);
    if (!fs.existsSync(abs)) { fail(b.rel + '：原始檔已不存在'); return; }
    var src = fs.readFileSync(abs, 'utf8');
    if (src === b.body) { same++; return; }
    var d = firstDiff(src, b.body);
    fail(b.rel + '：內容不同步（第 ' + d.line + ' 行起）\n' +
         '        原始檔 ' + d.a + '\n' +
         '        單檔版 ' + d.b);
  });

  if (errors.length) {
    console.error('✗ 單檔版與原始檔不同步：\n');
    errors.forEach(function (e) { console.error('  ' + e); });
    console.error('\n請執行 node tools/build.js 重新打包後再提交。');
    process.exit(1);
  }

  console.log('✓ 單檔版同步：' + same + ' 個區塊逐字元相同。');
}

main();
