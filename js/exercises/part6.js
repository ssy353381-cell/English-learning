/* ==========================================================================
   exercises/part6.js — 多益 Part 6：段落填空
     Ex.part6   一篇文章挖四個空，四題一起作答、一起批改

   和 Part 5（單句填空，走 Ex.cloze）唯一的差別，也是這一關存在的理由：
   **空格的答案常常不在那一句裡面**。時態要看前後文的時間點、代名詞要看
   前面提過誰、連接詞要看兩句的邏輯關係。

   所以這裡刻意**不把空格抽成獨立的題目卡**。空格留在文章原本的位置上，
   選項列在文章下方，作答時整篇都看得見 —— 把句子抽出來單獨問，等於把
   Part 6 降級成 Part 5，這一關就白做了。

   四題一起批改，和閱讀題、Part 3／4 同一個節奏：一篇文章問四個面向，
   分開批改會讓人做完一題就回頭改上一題，失去「讀完整篇再判斷」的訓練。

   批改後空格會填上正解並標紅綠 —— 訂正 Part 6 一定要看著整篇看，
   只列一行「第 3 題答案是 During」對下一次沒有幫助。
   ========================================================================== */
(function (global) {
  'use strict';

  var esc = UI.esc;
  var LETTERS = ['A', 'B', 'C', 'D'];

  /* 文章裡的空格標記：___1___ */
  var SLOT_RE = /___(\d+)___/g;

  /**
   * 把文章切成「文字段落 ＋ 空格」，文字段落走 markup() 變成可點的字。
   * 空格是一個 <span>，批改時直接改它的內容與顏色。
   *
   * 不能整篇 markup() 之後再換空格 —— markup 會把 ___1___ 裡的數字與底線
   * 原樣留著，但那時候字串已經是 HTML，再做字串取代會切到標籤裡面。
   */
  function passageHTML(text) {
    var out = '', last = 0, m;
    SLOT_RE.lastIndex = 0;
    while ((m = SLOT_RE.exec(text))) {
      out += Lexicon.markup(text.slice(last, m.index));
      out += '<span class="p6slot" id="p6slot' + m[1] + '" data-slot="' + m[1] + '">(' + m[1] + ')</span>';
      last = m.index + m[0].length;
    }
    out += Lexicon.markup(text.slice(last));
    return out;
  }

  Ex.part6 = {
    scored: true,
    render: function (q, host, api) {
      var a = q.ref;
      var blanks = a.blanks || [];
      var picks = [];
      for (var z = 0; z < blanks.length; z++) picks.push(-1);

      ExUtil.prompt(host, '讀完整篇，再選出每個空格該填什麼',
        'Part 6：答案常常不在空格那一句裡 —— 先把整篇看過一遍');

      host.insertAdjacentHTML('beforeend',
        '<div class="article p6article mt8">' +
          (a.title ? '<h3>' + esc(a.title) + '</h3>' : '') +
          '<div id="p6body">' + passageHTML(a.text) + '</div>' +
        '</div>' +
        '<div class="row" style="gap:8px">' +
          Speech.btn(String(a.text).replace(SLOT_RE, 'blank')) +
          '<span class="small muted">整篇朗讀（點文章裡任何一個字可以查意思）</span>' +
        '</div>' +
        '<div id="p6qs"></div>');

      var zone = UI.$('#p6qs', host);
      zone.innerHTML = '<div class="divider"></div>';

      blanks.forEach(function (b, bi) {
        var box = document.createElement('div');
        box.className = 'card';
        box.innerHTML = '<div class="q-prompt" style="font-size:1rem">第 ' + (bi + 1) + ' 格</div>';
        zone.appendChild(box);

        // 選項順序照資料寫的，不打亂：整句插入題的四個選項有閱讀順序，
        // 而且文章裡的標號是固定的，打亂只會讓人對不上編號。
        var ctl = ExUtil.options(box,
          b.opts.map(function (o, i) {
            return { html: '<span class="opt-letter">' + LETTERS[i] + '</span>' + esc(o) };
          }),
          { onPick: function (idx) {
              picks[bi] = idx;
              fillSlot(bi, b.opts[idx], '');
              api.enableCheck(picks.every(function (p) { return p >= 0; }));
            } });
        ctl.el.classList.add('opts-lettered');
        // 整句插入題排成一列會擠到讀不了，強制直式
        if (b.kind === 'sentence') ctl.el.classList.add('opts-stack');
        b._ctl = ctl;
      });

      /** 把選到的字填回文章裡的空格 —— 看著上下文檢查，才是 Part 6 的作答方式 */
      function fillSlot(bi, text, cls) {
        var el = UI.$('#p6slot' + (bi + 1), host);
        if (!el) return;
        var short = String(text);
        if (short.length > 22) short = short.slice(0, 20) + '…';
        el.textContent = short;
        el.className = 'p6slot filled' + (cls ? ' ' + cls : '');
      }

      api.enableCheck(false);
      api.onCleanup(function () { Lexicon.close(); });

      api.ready(function () {
        var correct = 0;
        blanks.forEach(function (b, bi) {
          var ok = picks[bi] === b.a;
          if (ok) correct++;
          b._ctl.lock(b.a);
          fillSlot(bi, b.opts[b.a], ok ? 'good' : 'bad');
        });
        var allOk = correct === blanks.length;

        // 型別寫成字面值：scheduler.weakQuestion 的對映檢查是掃字串跑的
        if (allOk) SRS.clearWeak('part6', a.id);
        else SRS.addWeak('part6', a.id, q.unitId || a.u);

        api.result(allOk, {
          correct: correct, total: blanks.length,
          title: allOk ? '四格全對！' : '答對 ' + correct + ' / ' + blanks.length + ' 格',
          detail:
            '<div class="check-detail">' +
              blanks.map(function (b, bi) {
                return '<div class="mt8"><b>第 ' + (bi + 1) + ' 格：' + esc(b.opts[b.a]) + '</b><br>' +
                  esc(b.why || '') + '</div>';
              }).join('') +
            '</div>' +
            (a.zh ? '<details class="mt8"><summary class="bold" style="cursor:pointer">看中文翻譯</summary>' +
              '<div class="sentence-zh mt8">' + esc(a.zh).replace(/\n/g, '<br>') + '</div></details>' : '')
        });
      });
    }
  };
})(window);
