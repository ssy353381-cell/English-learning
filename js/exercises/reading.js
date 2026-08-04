/* ==========================================================================
   exercises/reading.js — 短文閱讀
   讀完 → 作答 → 一次批改。文章可點任一個字查意思、可整篇朗讀、有計時。
   ========================================================================== */
(function (global) {
  'use strict';

  var esc = UI.esc;

  /* ---------- 建一份「單字表」供點字查詢 ---------- */
  var lex = null;
  function lexicon() {
    if (lex) return lex;
    lex = {};
    Content.allVocab().forEach(function (v) {
      lex[v.w.toLowerCase()] = v;
      // 常見變化形也對得到
      var w = v.w.toLowerCase();
      [w + 's', w + 'es', w + 'ed', w + 'ing', w + 'd'].forEach(function (f) {
        if (!lex[f]) lex[f] = v;
      });
    });
    (Content.irregulars() || []).forEach(function (iv) {
      var base = lex[iv.v];
      if (!base) return;
      if (!lex[iv.p]) lex[iv.p] = base;
      if (!lex[iv.pp]) lex[iv.pp] = base;
    });
    return lex;
  }

  /** 把文章切成可點的字 */
  function markup(text) {
    return esc(text).replace(/([A-Za-z][A-Za-z'’-]*)/g, function (m) {
      var known = lexicon()[m.toLowerCase()];
      return '<span class="w' + (known ? ' known' : '') + '" data-w="' + m + '">' + m + '</span>';
    }).replace(/\n/g, '<br>');
  }

  /* ---------- 點字彈窗 ---------- */
  var pop = null;
  function closePop() { if (pop && pop.parentNode) pop.parentNode.removeChild(pop); pop = null; }

  function showPop(target, word) {
    closePop();
    var v = lexicon()[word.toLowerCase()];
    pop = document.createElement('div');
    pop.className = 'wordpop';
    pop.innerHTML =
      '<div class="row" style="gap:8px">' + Speech.btn(word) +
        '<div class="grow"><div class="sentence-en bold">' + esc(word) + '</div>' +
        (v
          ? (State.data.profile.showKK && v.kk ? '<div class="word-kk">[' + esc(v.kk) + ']</div>' : '') +
            '<div class="sentence-zh"><span class="word-pos">' + esc(v.pos) + '</span>' + esc(v.zh) + '</div>'
          : '<div class="sentence-zh muted">這個字還沒收進單字庫，先聽發音</div>') +
        '</div></div>';
    document.body.appendChild(pop);

    var r = target.getBoundingClientRect();
    var w = pop.offsetWidth, h = pop.offsetHeight;
    var left = Math.max(8, Math.min(window.innerWidth - w - 8, r.left + r.width / 2 - w / 2));
    var top = r.top - h - 8;
    if (top < 8) top = r.bottom + 8;
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
    Speech.speak(word, { rate: 0.8 });
  }

  document.addEventListener('click', function (e) {
    var w = e.target.closest ? e.target.closest('.w') : null;
    if (w) { showPop(w, w.getAttribute('data-w')); return; }
    if (pop && !(e.target.closest && e.target.closest('.wordpop'))) closePop();
  });

  /* ======================= 閱讀題 ======================= */
  Ex.read = {
    scored: true,
    render: function (q, host, api) {
      var a = q.ref;
      var t0 = Date.now();
      var wordCount = (a.text || '').split(/\s+/).filter(Boolean).length;

      host.innerHTML =
        '<div class="row-between">' +
          '<div class="tag blue">閱讀 ・ ' + wordCount + ' 字</div>' +
          '<div class="readtimer" id="rtimer">00:00</div>' +
        '</div>' +
        '<div class="article mt8">' +
          (a.title ? '<h3>' + esc(a.title) + '</h3>' : '') +
          '<div id="artbody">' + markup(a.text) + '</div>' +
        '</div>' +
        '<div class="row" style="gap:8px">' +
          Speech.btn(a.text) +
          '<span class="small muted">整篇朗讀（點文章裡任何一個字可以查意思）</span>' +
        '</div>' +
        '<div id="qzone"></div>';

      var timer = UI.$('#rtimer', host);
      var tick = setInterval(function () {
        var s = Math.floor((Date.now() - t0) / 1000);
        timer.textContent = ('0' + Math.floor(s / 60)).slice(-2) + ':' + ('0' + (s % 60)).slice(-2);
      }, 500);
      api.onCleanup(function () { clearInterval(tick); closePop(); });

      /* --- 問題區 --- */
      var qs = a.qs || [];
      var picks = new Array(qs.length).fill(-1);
      var zone = UI.$('#qzone', host);

      zone.innerHTML = '<div class="divider"></div><h3>讀完了嗎？回答下面的問題</h3>';

      qs.forEach(function (qq, qi) {
        var box = document.createElement('div');
        box.className = 'card';
        box.innerHTML = '<div class="q-prompt" style="font-size:1rem">' +
          (qi + 1) + '. ' + esc(qq.q) + '</div>';
        zone.appendChild(box);

        var order = Content.shuffle(qq.opts.map(function (o, i) { return i; }));
        var ctl = ExUtil.options(box,
          order.map(function (oi) { return { html: esc(qq.opts[oi]) }; }),
          { onPick: function (idx) {
              picks[qi] = order[idx];
              api.enableCheck(picks.every(function (p) { return p >= 0; }));
            } });
        qq._ctl = ctl;
        qq._order = order;
      });

      api.enableCheck(false);

      api.ready(function () {
        clearInterval(tick);
        var secs = Math.max(1, Math.round((Date.now() - t0) / 1000));
        var wpm = Math.round(wordCount / (secs / 60));
        var correct = 0;

        qs.forEach(function (qq, qi) {
          var ok = picks[qi] === qq.a;
          if (ok) correct++;
          qq._ctl.lock(qq._order.indexOf(qq.a));
          if (!ok) SRS.addWeak('reading', a.id, q.unitId);
        });
        if (correct === qs.length) SRS.clearWeak('reading', a.id);

        var allOk = correct === qs.length;
        api.result(allOk, {
          correct: correct, total: qs.length,
          title: allOk ? '全部答對！' : '答對 ' + correct + ' / ' + qs.length + ' 題',
          detail:
            '<div class="row wrap" style="gap:14px">' +
              '<div><div class="small muted">閱讀時間</div><div class="bold">' + secs + ' 秒</div></div>' +
              '<div><div class="small muted">閱讀速度</div><div class="bold">' + wpm + ' 字/分</div></div>' +
              '<div><div class="small muted">多益目標</div><div class="bold">150 字/分</div></div>' +
            '</div>' +
            (a.zh ? '<details class="mt8"><summary class="bold" style="cursor:pointer">看中文翻譯</summary>' +
              '<div class="sentence-zh mt8">' + esc(a.zh).replace(/\n/g, '<br>') + '</div></details>' : '') +
            (qs.some(function (qq) { return qq.why; })
              ? '<div class="check-detail">' + qs.filter(function (qq) { return qq.why; })
                  .map(function (qq, i) { return '・' + qq.why; }).join('<br>') + '</div>'
              : '')
        });
      });
    }
  };
})(window);
