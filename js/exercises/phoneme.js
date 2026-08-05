/* ==========================================================================
   exercises/phoneme.js — 最小音對（phoneme）
   --------------------------------------------------------------------------
   聽一個字，選出它是哪一個音／哪一種拼法。四個候選只差一個位置，
   所以答對的唯一依據就是那個音 —— 這是發音關卡唯一會「考回來」的題型。
   沒有語音時降級成看字辨形（露出單字本身），至少還在練字母與音的對應，
   而不是整題卡死。
   ========================================================================== */
(function (global) {
  'use strict';

  var esc = UI.esc;

  function labelOf(pair) { return pair[1] === undefined ? pair[0] : pair[1]; }

  Ex.phoneme = {
    scored: true,
    render: function (q, host, api) {
      var p = q.ref;
      var idx = q.pick === undefined ? Math.floor(Math.random() * p.set.length) : q.pick;
      var target = p.set[idx];
      var word = target[0];
      var hasVoice = Speech.available();

      ExUtil.prompt(host, p.ask || '你聽到的是哪一個？');

      if (!hasVoice) {
        host.insertAdjacentHTML('beforeend',
          '<div class="warn-box">找不到英文語音，這一題改成看字作答。' +
          '裝好語音套件之後它才會變成真正的聽力題。</div>' +
          '<div class="card card-tight center"><div class="word-main">' + esc(word) + '</div></div>');
      } else {
        host.insertAdjacentHTML('beforeend',
          '<div class="center" style="padding:12px 0">' +
            '<button class="speak-btn" data-speak="' + esc(word) + '" ' +
              'style="width:88px;height:88px;font-size:2.4rem">🔊</button>' +
            '<div class="mt8"><button class="btn btn-ghost btn-sm" data-speak="' + esc(word) +
              '" data-slow="1">🐢 慢速重播</button></div>' +
          '</div>');
        setTimeout(function () { Speech.speak(word); }, 300);
      }

      var order = Content.shuffle(p.set.map(function (x, i) { return i; }));
      var correctIdx = order.indexOf(idx);
      var ctl = ExUtil.options(host,
        order.map(function (oi) {
          return { html: '<span class="en bold">' + esc(labelOf(p.set[oi])) + '</span>' };
        }),
        { grid2: true, onPick: function () { api.enableCheck(true); } });
      ExUtil.bindKeys(ctl, api);
      api.enableCheck(false);

      api.ready(function () {
        var picked = ctl.picked();
        if (picked < 0) return;
        var ok = picked === correctIdx;
        ctl.lock(correctIdx);

        // 發音不進 SRS（那只涵蓋單字），錯了靠弱點怪獸帶回來
        if (ok) SRS.clearWeak('phoneme', p.id);
        else SRS.addWeak('phoneme', p.id, q.unitId || p.u);

        // 整組都列出來對照：知道自己聽成了哪一個，比只知道答錯有用
        var table = p.set.map(function (x) {
          var isAns = x[0] === word;
          return '<div class="ex-item' + (isAns ? ' bold' : '') + '">' +
            Speech.btn(x[0], false, 'speak-inline') +
            '<span class="en">' + esc(x[0]) + '</span>' +
            '<span class="muted small">　' + esc(labelOf(x)) + '</span>' +
            (isAns ? '<span class="tag green" style="margin-left:6px">這一題</span>' : '') +
            '</div>';
        }).join('');

        api.result(ok, {
          title: ok ? '聽對了！' : '這個字是 ' + word,
          detail: '<div class="ex-list">' + table + '</div>' +
            '<div class="small muted mt8">整組唸過一遍，差別只在那一個音。</div>'
        });
      });
    }
  };
})(window);
