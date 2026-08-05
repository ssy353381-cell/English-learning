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

  /* ---------- 鷹架提示 ---------- */
  /**
   * 出現在題目上方的一句話概念。只有複習／每日挑戰／弱點怪獸會帶 —— 那三條路徑
   * 都沒有教學卡，答錯了也只知道自己錯，不知道規則長什麼樣。
   * teach.lead 是資料裡的信任 HTML（教學卡也直接吐），這裡不轉義。
   */
  function scaffold(host, text) {
    if (!text) return;
    host.insertAdjacentHTML('beforeend', '<div class="scaffold">💡 ' + text + '</div>');
  }

  /* ---------- 時態時間軸 ---------- */
  /**
   * 文法點的 tl 是一串標記，每個是 { a, b, t, hl }：
   *   a／b  過去 past ／ 現在 now ／ 未來 future，只寫 a 就是一個時間點，寫了 b 就是一段
   *   t     這段時間發生什麼事
   *   hl    要不要highlight（這一題考的就是它）
   * 答錯時才畫。公式（主詞＋have＋p.p.）能背，但背不出「到現在為止」的時間感，
   * 而錯的那一刻正好是最需要看到它的時候。
   */
  var TL_COL = { past: 1, now: 2, future: 3 };

  function timelineHTML(tl) {
    if (!tl || !tl.length) return '';
    var rows = tl.map(function (m) {
      var a = TL_COL[m.a] || 1;
      var b = TL_COL[m.b] || a;
      if (b < a) b = a;
      return '<div class="tl-row"><div class="tl-mark' +
        (m.hl ? ' hl' : '') + (m.b ? '' : ' pt') + '"' +
        ' style="grid-column:' + a + ' / ' + (b + 1) + '">' + esc(m.t) + '</div></div>';
    }).join('');
    return '<div class="tl-box">' +
      '<div class="tl-axis"><span>過去</span><span>現在</span><span>未來</span></div>' +
      rows + '</div>';
  }

  /* ---------- 例句區塊 ---------- */
  /**
   * 例句裡的每個字都是可以點開查的（Lexicon.markup）。
   * 這是單字卡上最容易被忽略的一段：真正卡住閱讀的往往不是正在教的那個字，
   * 而是例句裡順手用掉的另一個字。
   */
  function exampleHTML(v, showZh) {
    if (!v.ex || !v.ex.length) return '';
    var rows = v.ex.map(function (p, i) {
      return '<div class="ex-item">' +
        '<span class="ex-tag ' + (i === 0 ? 'daily">日常' : 'work">職場') + '</span> ' +
        Speech.btn(p[0], false, 'speak-inline') +
        '<div class="sentence-en">' + Lexicon.markup(p[0]) + '</div>' +
        (showZh === false ? '' : '<div class="sentence-zh">' + esc(p[1]) + '</div>') +
        '</div>';
    }).join('');
    return '<div class="ex-list">' + rows + '</div>';
  }

  /* ---------- 搭配詞 ---------- */
  /** 搭配詞題會挖空考，這裡是「先教一次」的地方 —— 沒教過就考等於猜謎 */
  function collocationHTML(v) {
    if (!v.col || !v.col.length) return '';
    return '<div class="col-box"><div class="col-lab">常見搭配</div>' +
      v.col.map(function (c) {
        return '<button class="col-chip" type="button" data-speak="' + esc(c[0]) + '">' +
          '<span class="en">' + esc(c[0]) + '</span>' +
          '<span class="col-zh">' + esc(c[1]) + '</span></button>';
      }).join('') + '</div>';
  }

  /* ---------- 字根字首拆解 ---------- */
  /**
   * rt 的每個欄位都是「英文 + 空格 + 中文」，例如 'pro- 向前'。
   * 兩段分開排是因為要對齊成 字首 ＋ 字根 ＋ 字尾 的積木，塞成一串就看不出結構。
   */
  function rootHTML(v) {
    if (!v.rt) return '';
    var parts = [];
    ['p', 'r', 's'].forEach(function (k) {
      if (!v.rt[k]) return;
      var t = String(v.rt[k]);
      var sp = t.indexOf(' ');
      var en = sp < 0 ? t : t.slice(0, sp);
      var zh = sp < 0 ? '' : t.slice(sp + 1);
      parts.push('<div class="root-part"><div class="root-en">' + esc(en) + '</div>' +
        (zh ? '<div class="root-zh">' + esc(zh) + '</div>' : '') + '</div>');
    });
    if (!parts.length) return '';
    return '<div class="root-box">' + parts.join('<div class="root-plus">＋</div>') + '</div>';
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
      (opts.hideZh ? '' : rootHTML(v)) +
      (opts.showEx === false ? '' : collocationHTML(v) + exampleHTML(v)) +
      '</div>';
  }

  /* ---------- 文字比對（寫作/聽寫用） ---------- */
  /**
   * 縮寫展開成完整寫法：I'm 和 I am、don't 和 do not 只是寫法不同，不該判錯。
   * 輸入與答案都會過這一關，所以只會讓比對更寬鬆，不會把對的判成錯的。
   * 's 與 'd 刻意不處理 — 它們有歧義（is/has、would/had），
   * 展開反而可能把 He's got 和 He has got 判成不一樣。
   */
  function expandContractions(s) {
    return s
      .replace(/\bwon't\b/g, 'will not')
      .replace(/\bcan't\b/g, 'can not')
      .replace(/\bcannot\b/g, 'can not')
      .replace(/\bshan't\b/g, 'shall not')
      .replace(/n't\b/g, ' not')
      .replace(/\blet's\b/g, 'let us')
      .replace(/'m\b/g, ' am')
      .replace(/'re\b/g, ' are')
      .replace(/'ll\b/g, ' will')
      .replace(/'ve\b/g, ' have');
  }

  function normalizeAns(s) {
    return expandContractions(
      String(s || '').toLowerCase()
        .replace(/[’‘]/g, "'").replace(/[“”]/g, '"'))
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
    scaffold: scaffold, timelineHTML: timelineHTML,
    exampleHTML: exampleHTML, wordCardHTML: wordCardHTML,
    collocationHTML: collocationHTML, rootHTML: rootHTML,
    normalizeAns: normalizeAns, expandContractions: expandContractions,
    sameText: sameText, matchAny: matchAny,
    nearMiss: nearMiss, tokenize: tokenize,
    gradeVocab: gradeVocab, gradeGrammar: gradeGrammar
  };
})(window);
