/* ==========================================================================
   exercises/parse.js — 長難句拆解
     Ex.parse   把一個長句切成幾段，點出「主詞」與「主要動詞」

   Stage 5 的閱讀不是敗在生字。Part 7 的長句常常把主詞和主要動詞拆得很開，
   中間塞一串關係子句或分詞，讀到動詞時已經忘了主詞是誰 —— 於是把修飾語裡
   那個動詞當成主要動詞，整句就理解反了。

   所以這一題只問兩件事：**哪一段是主詞、哪一段是主要動詞**。其餘各段的身分
   （關係子句、同位語、分詞片語…）批改後才標出來 —— 先讓他自己找骨架，
   再告訴他剛剛卡住他的那幾段各叫什麼名字。

   **句子本身不包 markup()**：整句都是可點的字塊，再讓每個字也能點開查，
   兩層點擊會打架。查字的機會留在批改後的骨架與解析那一段。

   兩個空格（主詞／主要動詞）刻意做成可以回頭改的：拆句本來就是猜一次、
   看看讀不讀得通、再改一次的過程，鎖死第一個選擇等於在考反應而不是理解。
   ========================================================================== */
(function (global) {
  'use strict';

  var esc = UI.esc;

  /* 角色代號 → 畫面上的名字。其餘角色字串本身就是名字（資料直接寫中文）。 */
  var ROLE = { S: '主詞', V: '主要動詞', O: '受詞／補語' };
  var SLOTS = [
    { key: 'S', name: '主詞',     hint: '這句在講「誰／什麼」' },
    { key: 'V', name: '主要動詞', hint: '有時態的那一個，不在任何子句裡' }
  ];

  function roleName(r) { return ROLE[r] || r || ''; }

  Ex.parse = {
    scored: true,
    render: function (q, host, api) {
      var a = q.ref;
      var seg = a.seg || [];
      var answer = { S: -1, V: -1 };
      seg.forEach(function (s, i) {
        if (s[1] === 'S' && answer.S < 0) answer.S = i;
        if (s[1] === 'V' && answer.V < 0) answer.V = i;
      });

      ExUtil.prompt(host, '先點出主詞，再點出主要動詞',
        a.title ? esc(a.title) : '整句先不用看懂，找到骨架就會通了');
      ExUtil.scaffold(host, q.scaffold);

      host.insertAdjacentHTML('beforeend',
        '<div class="parse-slots">' +
          SLOTS.map(function (s, i) {
            return '<button class="parse-slot" type="button" data-slot="' + i + '">' +
              '<span class="parse-slot-lab">' + s.name + '</span>' +
              '<span class="parse-slot-val muted">點下面的句段</span>' +
            '</button>';
          }).join('') +
        '</div>' +
        '<div class="parse-hint muted small" id="parse-hint">' + esc(SLOTS[0].hint) + '</div>' +
        '<div class="parse-sent" id="parse-sent">' +
          seg.map(function (s, i) {
            return '<button class="seg" type="button" data-seg="' + i + '">' + esc(s[0]) + '</button>';
          }).join(' ') +
        '</div>');

      var slotEls = UI.$$('.parse-slot', host);
      var segEls = UI.$$('.seg', host);
      var hintEl = UI.$('#parse-hint', host);
      var picks = { S: -1, V: -1 };
      var active = 0;
      var locked = false;

      function paint() {
        slotEls.forEach(function (el, i) {
          var key = SLOTS[i].key;
          el.classList.toggle('on', !locked && i === active);
          var val = el.querySelector('.parse-slot-val');
          if (picks[key] >= 0) {
            val.textContent = seg[picks[key]][0];
            val.classList.remove('muted');
          } else {
            val.textContent = '點下面的句段';
            val.classList.add('muted');
          }
        });
        segEls.forEach(function (el, i) {
          el.classList.toggle('sel-s', picks.S === i);
          el.classList.toggle('sel-v', picks.V === i);
        });
        if (!locked) hintEl.textContent = SLOTS[active].hint;
      }

      slotEls.forEach(function (el, i) {
        el.addEventListener('click', function () {
          if (locked) return;
          active = i;
          Sfx.play('click');
          paint();
        });
      });

      segEls.forEach(function (el, i) {
        el.addEventListener('click', function () {
          if (locked) return;
          var key = SLOTS[active].key;
          var other = SLOTS[1 - active].key;
          // 同一段不能既是主詞又是主要動詞：改點到對方那一格上就把對方清掉，
          // 否則兩格顯示同一段，使用者會以為自己兩題都答了
          if (picks[other] === i) picks[other] = -1;
          picks[key] = i;
          Sfx.play('click');
          // 剛填好主詞就自動跳到主要動詞那一格，少一次點擊
          if (active === 0 && picks.V < 0) active = 1;
          paint();
          api.enableCheck(picks.S >= 0 && picks.V >= 0);
        });
      });

      paint();
      api.enableCheck(false);

      api.ready(function () {
        locked = true;
        var okS = picks.S === answer.S;
        var okV = picks.V === answer.V;
        var ok = okS && okV;

        segEls.forEach(function (el, i) {
          el.classList.add('seg-locked');
          el.classList.remove('sel-s', 'sel-v');
          var role = seg[i][1];
          if (i === answer.S || i === answer.V) el.classList.add('seg-core');
          if ((i === picks.S && !okS) || (i === picks.V && !okV)) el.classList.add('seg-bad');
          if (role) {
            el.insertAdjacentHTML('beforeend',
              '<span class="seg-lab">' + esc(roleName(role)) + '</span>');
          }
        });
        slotEls.forEach(function (el, i) {
          el.classList.remove('on');
          el.classList.add(SLOTS[i].key === 'S' ? (okS ? 'ok' : 'bad') : (okV ? 'ok' : 'bad'));
        });

        // 型別寫成字面值：scheduler.weakQuestion 的對映檢查是掃字串跑的
        if (ok) SRS.clearWeak('parse', a.id);
        else SRS.addWeak('parse', a.id, q.unitId || a.u);

        api.result(ok, {
          title: ok ? '骨架抓對了！' : (okS ? '主詞對了，主要動詞不是那一段' :
                       okV ? '主要動詞對了，主詞不是那一段' : '再看一次：誰做了什麼'),
          detail:
            '<div class="parse-core">' +
              '<div class="small muted">抽掉修飾語之後</div>' +
              '<div class="sentence-en">' + Lexicon.markup(a.core[0]) + '</div>' +
              '<div class="sentence-zh">' + esc(a.core[1]) + '</div>' +
            '</div>' +
            (a.why ? '<div class="check-detail mt8">' + esc(a.why) + '</div>' : '') +
            '<details class="mt8"><summary class="bold" style="cursor:pointer">看整句翻譯</summary>' +
              '<div class="sentence-en mt8">' + Lexicon.markup(a.full) + '</div>' +
              '<div class="sentence-zh">' + esc(a.zh || '') + '</div>' +
            '</details>'
        });
      });

      api.onCleanup(function () { Lexicon.close(); });
    }
  };
})(window);
