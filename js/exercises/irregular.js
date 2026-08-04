/* ==========================================================================
   exercises/irregular.js — 不規則動詞三態
   給原形與中文，問過去式或過去分詞。這些字沒有規則可循，只能靠反覆問。
   ========================================================================== */
(function (global) {
  'use strict';

  var esc = UI.esc;

  var LABEL = { p: '過去式', pp: '過去分詞' };

  /** be 的過去式是 was/were，兩個都算對，寫成 was/were 也算 */
  function answersFor(iv, ask) {
    var raw = String(iv[ask] || '');
    var out = raw.indexOf('/') >= 0 ? raw.split('/') : [];
    out.push(raw);
    return out;
  }

  Ex.irregular = {
    scored: true,
    render: function (q, host, api) {
      var iv = q.ref;
      var ask = q.ask === 'pp' ? 'pp' : 'p';
      var answers = answersFor(iv, ask);

      ExUtil.prompt(host, '寫出 ' + LABEL[ask], esc(iv.zh));

      host.insertAdjacentHTML('beforeend',
        '<div class="wordcard">' +
          '<div class="word-main">' + esc(iv.v) + '</div>' +
          '<div class="row" style="justify-content:center;gap:8px;margin-top:10px">' +
            Speech.btn(iv.v) +
          '</div>' +
          '<div class="cloze-text mt16">' + esc(iv.v) + ' → ' +
            '<input class="blank-input" id="ivin" size="10" autocomplete="off" ' +
            'autocapitalize="off" spellcheck="false">' +
          '</div>' +
        '</div>' +
        '<div class="row mt8"><button class="btn btn-ghost btn-sm" id="hint">看提示</button></div>');

      var inp = UI.$('#ivin', host);
      inp.addEventListener('input', function () { api.enableCheck(!!inp.value.trim()); });
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); api.submit(); }
      });
      api.enableCheck(false);
      setTimeout(function () { inp.focus(); }, 120);

      UI.$('#hint', host).onclick = function () {
        var a = answers[0];
        UI.toast('💡 開頭是「' + a.charAt(0) + '」，共 ' + a.length + ' 個字母', '', 3000);
      };

      api.ready(function () {
        var ok = ExUtil.matchAny(inp.value, answers);
        inp.disabled = true;
        inp.classList.add(ok ? 'correct' : 'wrong');
        if (!ok) inp.value = iv[ask];

        if (ok) SRS.clearWeak('irregular', iv.id);
        else SRS.addWeak('irregular', iv.id, q.unitId);

        api.result(ok, {
          title: ok ? '正確！' : LABEL[ask] + '是 ' + iv[ask],
          detail: '<div class="row" style="gap:8px">' + Speech.btn(iv[ask].replace('/', ' or ')) +
            '<div class="grow"><div class="sentence-en">' +
              esc(iv.v) + ' → ' + esc(iv.p) + ' → ' + esc(iv.pp) + '</div>' +
            '<div class="sentence-zh">' + esc(iv.zh) + '</div></div></div>'
        });
      });
    }
  };
})(window);
