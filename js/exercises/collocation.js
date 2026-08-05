/* ==========================================================================
   exercises/collocation.js — 搭配詞（collocate）
   --------------------------------------------------------------------------
   單字認得、句子看得懂，寫出來還是錯，通常錯在搭配：中文說「吃藥」，
   於是寫成 eat medicine。這種錯背單字表救不了，只能一組一組記。
   出題方式是把詞組裡的目標字挖掉讓人選，誘答就是 lure 那組母語干擾字 ——
   問 take a break 時配上 eat / get / carry 才有鑑別度。
   搭配詞只掛在動詞上：挖掉名詞的話（pay the ___）常常不只一個答案。
   ========================================================================== */
(function (global) {
  'use strict';

  var esc = UI.esc;

  /** 這個字的其他搭配，批改後一起露出來 —— 錯的那一次是最想看的時候 */
  function othersHTML(v, skip) {
    var rest = (v.col || []).filter(function (c) { return c[0] !== skip; });
    if (!rest.length) return '';
    return '<div class="ex-list"><div class="small muted">' + esc(v.w) + ' 的其他常見搭配</div>' +
      rest.map(function (c) {
        return '<div class="ex-item">' + Speech.btn(c[0], false, 'speak-inline') +
          '<div class="sentence-en">' + Lexicon.markup(c[0]) + '</div>' +
          '<div class="sentence-zh">' + esc(c[1]) + '</div></div>';
      }).join('') + '</div>';
  }

  Ex.collocate = {
    scored: true,
    render: function (q, host, api) {
      var v = q.ref;
      var phrase = q.col[0], zh = q.col[1];
      var t0 = Date.now();

      var re = new RegExp('\\b' + v.w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
      var blanked = esc(phrase).replace(re, '<b class="text-blue">＿＿＿</b>');

      ExUtil.prompt(host, '哪個字才配得上這個詞組？');
      host.insertAdjacentHTML('beforeend',
        '<div class="card center">' +
          '<div class="cloze-text">' + blanked + '</div>' +
          '<div class="sentence-zh mt8">' + esc(zh) + '</div>' +
        '</div>');

      var pool = Content.shuffle([v].concat(Content.colDistractors(v, 3)));
      var correctIdx = pool.indexOf(v);

      var ctl = ExUtil.options(host, pool.map(function (x) {
        return { html: '<span class="en bold">' + esc(x.w) + '</span>' +
          '<span class="muted small">　' + esc(x.zh) + '</span>' };
      }), { onPick: function () { api.enableCheck(true); } });
      ExUtil.bindKeys(ctl, api);
      api.enableCheck(false);

      api.ready(function () {
        var picked = ctl.picked();
        if (picked < 0) return;
        var ok = picked === correctIdx;
        ctl.lock(correctIdx);
        ExUtil.gradeVocab(v, ok, (Date.now() - t0) > 9000, q.unitId);

        api.result(ok, {
          title: ok ? '搭配正確！' : '這個詞組要用 ' + v.w,
          detail: '<div class="row" style="gap:8px">' + Speech.btn(phrase) +
            '<div><div class="sentence-en">' + Lexicon.markup(phrase) + '</div>' +
            '<div class="sentence-zh">' + esc(zh) + '</div></div></div>' +
            (ok ? '' : '<div class="check-detail">' + esc(pool[picked].w) + ' 的意思沒錯，' +
              '但英文不這樣配。</div>') +
            othersHTML(v, phrase)
        });
      });
    }
  };
})(window);
