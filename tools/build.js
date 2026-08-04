#!/usr/bin/env node
/* ==========================================================================
   tools/build.js — 單檔打包（跨平台）

   把 index.html 引用的 css/js 全部內嵌，產出 English-Learning.html。
   與 build.ps1 產出相同的結果 —— 之所以要有 Node 版本，是因為 build.ps1
   只能在 Windows 跑，CI 與非 Windows 環境改完檔案後無從重新打包，
   單檔版就會靜靜地落後於多檔版。

   用法：
     node tools/build.js            打包
     node tools/build.js --check    只檢查是否已同步，不寫檔（CI 用）

   零依賴，只用 Node 內建模組。
   ========================================================================== */
'use strict';

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var SRC = path.join(ROOT, 'index.html');
var OUT = path.join(ROOT, 'English-Learning.html');

/* 這兩個樣式必須和 verify-bundle.js 完全一致，否則驗證會抓不到漂移 */
var LINK_RE = /<link[^>]*rel\s*=\s*"stylesheet"[^>]*href\s*=\s*"([^"]+)"[^>]*>/g;
var SCRIPT_RE = /<script[^>]*src\s*=\s*"([^"]+)"[^>]*>\s*<\/script>/g;

function header(rel) { return '/* ===== ' + rel + ' ===== */'; }

/** 內容裡如果出現 </script> 會提早關掉標籤，先拆開 */
function escapeScript(body) { return body.replace(/<\/script>/g, '<\\/script>'); }

function stamp(d) {
  function p(n) { return (n < 10 ? '0' : '') + n; }
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) +
         ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
}

/**
 * 把 index.html 攤平成單檔。
 * @returns {{html:string, css:string[], js:string[], missing:string[]}}
 */
function bundle(opts) {
  opts = opts || {};
  var html = fs.readFileSync(SRC, 'utf8');
  var css = [], js = [], missing = [];

  function read(rel) {
    var clean = rel.replace(/\?.*$/, '');
    var abs = path.join(ROOT, clean);
    if (!fs.existsSync(abs)) { missing.push(clean); return null; }
    return { rel: clean, body: fs.readFileSync(abs, 'utf8') };
  }

  html = html.replace(LINK_RE, function (m, href) {
    var f = read(href);
    if (!f) return m;                    // 找不到就保留原本的連結，和 build.ps1 一致
    css.push(f.rel);
    return '<style>\n' + header(f.rel) + '\n' + f.body + '\n</style>';
  });

  html = html.replace(SCRIPT_RE, function (m, src) {
    var f = read(src);
    if (!f) return m;
    js.push(f.rel);
    return '<script>\n' + header(f.rel) + '\n' + escapeScript(f.body) + '\n</script>';
  });

  // 加一行註記，方便日後辨認這是打包版
  html = html.replace('<body>', '<body>\n<!-- 單檔打包版 build: ' + stamp(opts.now || new Date()) + ' -->');

  return { html: html, css: css, js: js, missing: missing };
}

/* ---------- CLI ---------- */
if (require.main === module) {
  var checkOnly = process.argv.indexOf('--check') >= 0;
  var r = bundle();

  if (r.missing.length) {
    console.error('以下檔案找不到，已保留原本的連結：');
    r.missing.forEach(function (m) { console.error('  - ' + m); });
    process.exit(1);
  }

  if (checkOnly) {
    // 只比對內容，時間戳每次都不同故略過
    var cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
    var strip = function (s) { return s.replace(/\n<!-- 單檔打包版 build: [^>]*-->/, ''); };
    if (strip(cur) === strip(r.html)) { console.log('單檔版已是最新。'); process.exit(0); }
    console.error('單檔版與原始檔不同步，請重新執行 node tools/build.js。');
    process.exit(1);
  }

  // 用「無 BOM 的 UTF-8」寫出：某些手機瀏覽器看到 BOM 會顯示怪字元
  fs.writeFileSync(OUT, r.html, { encoding: 'utf8' });
  console.log('完成！內嵌 ' + r.css.length + ' 個 CSS、' + r.js.length + ' 個 JS');
  console.log('產出 English-Learning.html（' +
    (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB）');
}

module.exports = { bundle: bundle, header: header, escapeScript: escapeScript,
                  LINK_RE: LINK_RE, SCRIPT_RE: SCRIPT_RE, ROOT: ROOT, SRC: SRC, OUT: OUT };
