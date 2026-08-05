/* ==========================================================================
   exercises/reading.js — 短文閱讀
   讀完 → 作答 → 一次批改。文章可點任一個字查意思、可整篇朗讀、有計時。

   點字查詢原本是這個檔案自己做的，現在整包搬到 js/lexicon.js —— 那時候只有
   閱讀題有長句子，如今每張單字卡、每張教學卡都有例句，全部都要能點。
   ========================================================================== */
(function (global) {
  'use strict';

  var esc = UI.esc;
  var markup = Lexicon.markup;

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
      api.onCleanup(function () { clearInterval(tick); Lexicon.close(); });

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
