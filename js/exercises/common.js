/* ==========================================================================
   exercises/common.js — 題型共用工具
   --------------------------------------------------------------------------
   題型模組契約：
     Ex[type] = {
       scored: true/false,            // 是否計分
       render: function (q, host, api) { ... }
     }
   api 提供：
     api.ready(fn)          設定「檢查」按鈕要執行什麼（fn 自行呼叫 api.result）
     api.enableCheck(bool)  啟用/停用檢查按鈕
     api.result(ok, opts)   送出結果 → 顯示批改列
     api.setContinue(text)  不計分的卡片用：直接顯示「繼續」按鈕
     api.next()             進下一題
   ========================================================================== */
(function (global) {
  'use strict';

  global.Ex = global.Ex || {};

  var esc = UI.esc;

  /* ---------- 選項清單 ---------- */
  /**
   * @param {Array} opts   [{html, value, correct}]
   * @param {object} cfg   { grid2:bool, onPick:fn(idx, optEl) }
   */
  function options(host, opts, cfg) {
    cfg = cfg || {};
    var wrap = document.createElement('div');
    wrap.className = 'opts' + (cfg.grid2 ? ' grid2' : '');
    var nodes = [];

    opts.forEach(function (o, i) {
      var b = document.createElement('button');
      b.className = 'opt';
      b.type = 'button';
      b.innerHTML = (cfg.grid2 ? '' : '<span class="opt-kbd">' + (i + 1) + '</span>') + o.html;
      b.addEventListener('click', function () {
        if (wrap.dataset.locked) return;
        nodes.forEach(function (n) { n.classList.remove('sel'); });
        b.classList.add('sel');
        wrap.dataset.picked = i;
        Sfx.play('click');
        if (cfg.onPick) cfg.onPick(i, b);
      });
      nodes.push(b);
      wrap.appendChild(b);
    });

    host.appendChild(wrap);

    return {
      el: wrap,
      nodes: nodes,
      picked: function () {
        return wrap.dataset.picked === undefined ? -1 : +wrap.dataset.picked;
      },
      lock: function (correctIdx) {
        wrap.dataset.locked = '1';
        nodes.forEach(function (n, i) {
          n.classList.add('opt-locked');
          n.classList.remove('sel');
          if (i === correctIdx) n.classList.add('correct');
          else if (String(i) === wrap.dataset.picked) n.classList.add('wrong');
        });
      }
    };
  }

  /* ---------- 鍵盤 1–9 選項快捷 ---------- */
  function bindKeys(optCtl, api) {
    function onKey(e) {
      if (e.target && /input|textarea/i.test(e.target.tagName)) return;
      var n = parseInt(e.key, 10);
      if (n >= 1 && n <= optCtl.nodes.length) {
        optCtl.nodes[n - 1].click();
        e.preventDefault();
      }
    }
    document.addEventListener('keydown', onKey);
    api.onCleanup(function () { document.removeEventListener('keydown', onKey); });
  }

  /* ---------- 題目標題 ---------- */
  function prompt(host, text, sub) {
    var d = document.createElement('div');
    d.innerHTML = '<div class="q-prompt">' + text + '</div>' +
      (sub ? '<p class="muted small mt0">' + sub + '</p>' : '');
    host.appendChild(d);
    return d;
  }

  /* ---------- 例句區塊 ---------- */
  function exampleHTML(v, showZh) {
    if (!v.ex || !v.ex.length) return '';
    var rows = v.ex.map(function (p, i) {
      return '<div class="ex-item">' +
        '<span class="ex-tag ' + (i === 0 ? 'daily">日常' : 'work">職場') + '</span> ' +
        Speech.btn(p[0], false, 'speak-inline') +
        '<div class="sentence-en">' + esc(p[0]) + '</div>' +
        (showZh === false ? '' : '<div class="sentence-zh">' + esc(p[1]) + '</div>') +
        '</div>';
    }).join('');
    return '<div class="ex-list">' + rows + '</div>';
  }

  /* ---------- 單字卡 HTML ---------- */
  function wordCardHTML(v, opts) {
    opts = opts || {};
    var showKK = State.data.profile.showKK && v.kk;
    return '<div class="wordcard">' +
      (v.ic ? '<div class="word-icon">' + v.ic + '</div>' : '') +
      '<div class="word-main">' + esc(v.w) + '</div>' +
      (showKK ? '<div class="word-kk">[' + esc(v.kk) + ']</div>' : '') +
      '<div class="row" style="justify-content:center;gap:8px;margin-top:10px">' +
        Speech.btn(v.w) + Speech.btn(v.w, true) +
      '</div>' +
      (opts.hideZh ? '' :
        '<div class="word-zh"><span class="word-pos">' + esc(v.pos) + '</span>' + esc(v.zh) + '</div>') +
      (opts.showEx === false ? '' : exampleHTML(v)) +
      '</div>';
  }

  /* ---------- 文字比對（寫作/聽寫用） ---------- */
  function normalizeAns(s) {
    return String(s || '').toLowerCase()
      .replace(/[’‘]/g, "'").replace(/[“”]/g, '"')
      .replace(/[.,!?;:]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function sameText(a, b) { return normalizeAns(a) === normalizeAns(b); }

  /** 接受多個正確答案 */
  function matchAny(input, answers) {
    for (var i = 0; i < answers.length; i++) {
      if (sameText(input, answers[i])) return true;
    }
    return false;
  }

  /** 差一兩個字母時提示「很接近」 */
  function nearMiss(input, answer) {
    var a = normalizeAns(input), b = normalizeAns(answer);
    if (!a || !b) return false;
    return Speech.similar(a, b) >= 0.82;
  }

  /* ---------- 把句子切成可拖曳的字塊 ---------- */
  function tokenize(sentence) {
    return sentence.trim().split(/\s+/);
  }

  /* ---------- 標記單字答對/答錯，餵給 SRS ---------- */
  function gradeVocab(v, ok, slow, unitId) {
    if (!v || !v.id) return;
    SRS.grade(v.id, ok ? (slow ? 1 : 2) : 0);
    if (ok) SRS.clearWeak('vocab', v.id);
    else SRS.addWeak('vocab', v.id, unitId || v.u);
  }

  function gradeGrammar(g, ok, unitId) {
    if (!g || !g.id) return;
    if (ok) SRS.clearWeak('grammar', g.id);
    else SRS.addWeak('grammar', g.id, unitId || g.u);
  }

  global.ExUtil = {
    options: options, bindKeys: bindKeys, prompt: prompt,
    exampleHTML: exampleHTML, wordCardHTML: wordCardHTML,
    normalizeAns: normalizeAns, sameText: sameText, matchAny: matchAny,
    nearMiss: nearMiss, tokenize: tokenize,
    gradeVocab: gradeVocab, gradeGrammar: gradeGrammar
  };
})(window);
