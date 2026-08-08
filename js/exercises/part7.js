/* ==========================================================================
   exercises/part7.js — 多益 Part 7：雙篇閱讀
     Ex.part7   兩份文件配五題，其中至少一題要兩篇合起來看

   這一題型唯一的訓練目標是**跨篇對照**：規則寫在公告裡，這個人的情況寫在
   信裡，兩邊各有一半答案。所以畫面上**兩份文件一定要同時看得見** ——
   做成分頁或一次顯示一篇，練到的就只剩單篇閱讀，這一關等於不存在。
   寬畫面並排、窄畫面上下疊，但都不折疊、不隱藏。

   需要跨篇的題目掛 both:true，畫面上標一個「跨篇」的記號。標出來不是提示，
   是告訴他「找不到答案是正常的，因為你只看了一篇」—— 真實測驗不標，
   但真實測驗也不是拿來學的。

   五題一起批改，和閱讀題同一個節奏。計時與 wpm 沿用閱讀題的做法：
   Part 7 的失分有一半是時間不夠，看不到自己的速度就改不了。
   ========================================================================== */
(function (global) {
  'use strict';

  var esc = UI.esc;
  var markup = Lexicon.markup;
  var LETTERS = ['A', 'B', 'C', 'D'];

  function docHTML(d, i) {
    return '<div class="p7doc">' +
      '<div class="p7doc-h">' +
        '<span class="tag blue">' + esc(d.label || ('文件 ' + (i + 1))) + '</span>' +
        (d.title ? '<b>' + esc(d.title) + '</b>' : '') +
      '</div>' +
      '<div class="p7doc-body">' + markup(d.text) + '</div>' +
    '</div>';
  }

  Ex.part7 = {
    scored: true,
    render: function (q, host, api) {
      var a = q.ref;
      var docs = a.docs || [];
      var qs = a.qs || [];
      var t0 = Date.now();
      var wordCount = docs.reduce(function (n, d) {
        return n + String(d.text || '').split(/\s+/).filter(Boolean).length;
      }, 0);

      ExUtil.prompt(host, '讀完兩份文件，回答下面的問題',
        'Part 7 雙篇：標著「跨篇」的題目，答案要兩份合起來才找得到');

      host.insertAdjacentHTML('beforeend',
        '<div class="row-between">' +
          '<div class="tag blue">雙篇 ・ ' + wordCount + ' 字</div>' +
          '<div class="readtimer" id="p7timer">00:00</div>' +
        '</div>' +
        '<div class="p7docs mt8">' + docs.map(docHTML).join('') + '</div>' +
        '<div class="row" style="gap:8px">' +
          '<span class="small muted">點文件裡任何一個字可以查意思</span>' +
        '</div>' +
        '<div id="p7qs"></div>');

      var timer = UI.$('#p7timer', host);
      var tick = setInterval(function () {
        var s = Math.floor((Date.now() - t0) / 1000);
        timer.textContent = ('0' + Math.floor(s / 60)).slice(-2) + ':' + ('0' + (s % 60)).slice(-2);
      }, 500);
      api.onCleanup(function () { clearInterval(tick); Lexicon.close(); });

      var picks = [];
      for (var z = 0; z < qs.length; z++) picks.push(-1);
      var zone = UI.$('#p7qs', host);
      zone.innerHTML = '<div class="divider"></div>';

      qs.forEach(function (qq, qi) {
        var box = document.createElement('div');
        box.className = 'card';
        box.innerHTML = '<div class="q-prompt" style="font-size:1rem">' +
          (qi + 1) + '. ' + esc(qq.q) +
          (qq.both ? ' <span class="p7both">跨篇</span>' : '') + '</div>';
        zone.appendChild(box);

        var order = Content.shuffle(qq.opts.map(function (o, i) { return i; }));
        var ctl = ExUtil.options(box,
          order.map(function (oi, i) {
            return { html: '<span class="opt-letter">' + LETTERS[i] + '</span>' + esc(qq.opts[oi]) };
          }),
          { onPick: function (idx) {
              picks[qi] = order[idx];
              api.enableCheck(picks.every(function (p) { return p >= 0; }));
            } });
        ctl.el.classList.add('opts-lettered');
        qq._ctl = ctl;
        qq._order = order;
      });

      api.enableCheck(false);

      api.ready(function () {
        clearInterval(tick);
        var secs = Math.max(1, Math.round((Date.now() - t0) / 1000));
        var wpm = Math.round(wordCount / (secs / 60));

        var correct = 0, bothTotal = 0, bothOk = 0;
        qs.forEach(function (qq, qi) {
          var ok = picks[qi] === qq.a;
          if (ok) correct++;
          if (qq.both) { bothTotal++; if (ok) bothOk++; }
          qq._ctl.lock(qq._order.indexOf(qq.a));
        });
        var allOk = correct === qs.length;

        // 型別寫成字面值：scheduler.weakQuestion 的對映檢查是掃字串跑的
        if (allOk) SRS.clearWeak('part7', a.id);
        else SRS.addWeak('part7', a.id, q.unitId || a.u);

        api.result(allOk, {
          correct: correct, total: qs.length,
          title: allOk ? '五題全對！' : '答對 ' + correct + ' / ' + qs.length + ' 題',
          detail:
            '<div class="row wrap" style="gap:14px">' +
              '<div><div class="small muted">閱讀時間</div><div class="bold">' + secs + ' 秒</div></div>' +
              '<div><div class="small muted">閱讀速度</div><div class="bold">' + wpm + ' 字/分</div></div>' +
              // 跨篇題單獨算一次：整體答對率看不出「有沒有真的去對照兩篇」
              '<div><div class="small muted">跨篇題</div><div class="bold">' +
                bothOk + ' / ' + bothTotal + '</div></div>' +
            '</div>' +
            '<div class="check-detail">' +
              qs.map(function (qq, qi) {
                return '<div class="mt8"><b>' + (qi + 1) + '. ' +
                  (qq.both ? '［跨篇］' : '') + esc(qq.opts[qq.a]) + '</b><br>' +
                  esc(qq.why || '') + '</div>';
              }).join('') +
            '</div>' +
            (docs.some(function (d) { return d.zh; })
              ? '<details class="mt8"><summary class="bold" style="cursor:pointer">看中文翻譯</summary>' +
                docs.map(function (d) {
                  return '<div class="sentence-zh mt8">' + esc(d.zh || '').replace(/\n/g, '<br>') + '</div>';
                }).join('<div class="divider"></div>') + '</details>'
              : '')
        });
      });
    }
  };
})(window);
