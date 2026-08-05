/* ==========================================================================
   exercises/convo.js — 多益 Part 3／4：聽長對話與獨白
     Ex.convo   一段兩到三人的對話（Part 3）或一段獨白（Part 4），配三個問題

   和 Part 1／2 的關鍵差別：**題目與選項要印出來**。
   真實測驗裡 Part 3／4 的題目本來就印在題本上，考生一邊聽一邊看題目 ——
   把選項藏起來反而是在練一種考場上不存在的能力。要藏的是「對話腳本」，
   那才是耳朵的工作。

   三題一起作答、一起批改，和閱讀題同一個節奏：一段內容問三個面向，
   分開批改會讓人邊聽邊回頭猜，失去「聽完整段再判斷」的訓練。
   ========================================================================== */
(function (global) {
  'use strict';

  var esc = UI.esc;
  var LETTERS = ['A', 'B', 'C', 'D'];

  /**
   * 依序唸完整段對話，正在唸的那一行亮起來。
   * 換人說話時改變音高 —— 瀏覽器的 TTS 只保證有一個英文語音可用
   * （chooseVoice 挑的是使用者系統上剛好裝了什麼），沒辦法真的換人。
   * 音高差 0.25 已經足以讓人聽出「換人了」，這是能穩定做到的極限。
   */
  function playScript(lines, nodes, onDone) {
    var i = 0, stopped = false;

    function unlight() {
      nodes.forEach(function (n) { if (n) n.classList.remove('opt-playing'); });
    }

    function step() {
      if (stopped) return;
      if (i >= lines.length) { unlight(); if (onDone) onDone(); return; }
      var n = nodes[i];
      if (n) n.classList.add('opt-playing');
      Speech.speak(lines[i][1], { pitch: speakerPitch(lines, i) }).then(function () {
        if (stopped) return;
        if (n) n.classList.remove('opt-playing');
        i++;
        setTimeout(step, 260);
      });
    }

    step();
    return { stop: function () { stopped = true; Speech.stop(); unlight(); } };
  }

  /** 第一位說話者用正常音高，之後每多一位就降一階 */
  function speakerPitch(lines, i) {
    var order = [];
    lines.forEach(function (l) { if (order.indexOf(l[0]) < 0) order.push(l[0]); });
    var k = order.indexOf(lines[i][0]);
    return Math.max(0.6, 1.1 - k * 0.25);
  }

  function noVoiceWarning() {
    if (Speech.available()) return '';
    return '<div class="warn-box">找不到英文語音，這一題會直接顯示對話原文。' +
      '（Windows：設定 → 時間與語言 → 語音 → 新增語音 → English）</div>';
  }

  function scriptHTML(c, forceText) {
    return '<div class="script' + (forceText ? '' : ' is-hidden') + '" id="script">' +
      c.lines.map(function (l) {
        return '<div class="script-line">' +
          '<span class="script-who">' + esc(l[0]) + '</span>' +
          '<span class="sentence-en">' + Lexicon.markup(l[1]) + '</span></div>';
      }).join('') + '</div>';
  }

  Ex.convo = {
    scored: true,
    render: function (q, host, api) {
      var c = q.ref;
      var forceText = !Speech.available();
      var player = null;
      var isTalk = c.kind === 'talk';

      ExUtil.prompt(host,
        isTalk ? '聽一段獨白，回答下面的問題' : '聽一段對話，回答下面的問題',
        isTalk ? 'Part 4：公告、廣播、留言 —— 先看題目再聽，才知道要抓什麼'
               : 'Part 3：兩個人的對話 —— 三題通常照對話順序出現');

      host.insertAdjacentHTML('beforeend',
        noVoiceWarning() +
        '<div class="convo-head">' +
          '<div class="tag blue">' + esc(c.title || (isTalk ? '獨白' : '對話')) + '</div>' +
          '<div class="center" style="padding:8px 0">' +
            '<button class="btn btn-primary" type="button" id="playall">🔊 播放</button>' +
          '</div>' +
        '</div>' +
        scriptHTML(c, forceText) +
        '<div id="qzone"></div>');

      var lineNodes = UI.$$('.script-line', host);

      function playAll() {
        if (player) player.stop();
        player = playScript(c.lines, lineNodes);
      }
      UI.$('#playall', host).addEventListener('click', playAll);
      api.onCleanup(function () { if (player) player.stop(); Lexicon.close(); });
      if (Speech.available()) setTimeout(playAll, 400);

      /* --- 題目：文字照印，這是 Part 3／4 本來的樣子 --- */
      var qs = c.qs || [];
      var picks = [];
      for (var z = 0; z < qs.length; z++) picks.push(-1);
      var zone = UI.$('#qzone', host);

      qs.forEach(function (qq, qi) {
        var box = document.createElement('div');
        box.className = 'card';
        box.innerHTML = '<div class="q-prompt" style="font-size:1rem">' +
          (qi + 1) + '. ' + esc(qq.q) + '</div>';
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
        if (player) player.stop();

        var correct = 0;
        qs.forEach(function (qq, qi) {
          var ok = picks[qi] === qq.a;
          if (ok) correct++;
          qq._ctl.lock(qq._order.indexOf(qq.a));
        });
        var allOk = correct === qs.length;

        // 作答後把腳本露出來 —— 訂正時看不到原文等於白答
        var sc = UI.$('#script', host);
        if (sc) sc.classList.remove('is-hidden');

        // 型別寫成字面值：scheduler.weakQuestion 的對映檢查是掃字串跑的
        if (allOk) SRS.clearWeak('convo', c.id);
        else SRS.addWeak('convo', c.id, q.unitId || c.u);

        api.result(allOk, {
          correct: correct, total: qs.length,
          title: allOk ? '三題全對！' : '答對 ' + correct + ' / ' + qs.length + ' 題',
          detail:
            (c.zh ? '<details class="mt8"><summary class="bold" style="cursor:pointer">看中文翻譯</summary>' +
              '<div class="sentence-zh mt8">' + esc(c.zh).replace(/\n/g, '<br>') + '</div></details>' : '') +
            (qs.some(function (qq) { return qq.why; })
              ? '<div class="check-detail">' + qs.filter(function (qq) { return qq.why; })
                  .map(function (qq) { return '・' + esc(qq.why); }).join('<br>') + '</div>'
              : '')
        });
      });
    }
  };
})(window);
