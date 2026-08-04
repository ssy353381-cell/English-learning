/* ==========================================================================
   exercises/toeic.js — 多益聽力題型
     Ex.photo   Part 1 看圖聽描述（一張圖 + 四句描述，選出符合的那句）
     Ex.respond Part 2 應答問題（一句問句 + 三個回應，選出最合適的）
   --------------------------------------------------------------------------
   這兩種題的訓練重點是「只靠耳朵」，所以選項文字預設不顯示 —— 印出來就變成
   閱讀測驗了。但這是學習 App 不是模擬考，卡住的人可以按「顯示英文」把文字叫
   出來；沒有 TTS 語音時也會自動顯示，否則整題無法作答。
   ========================================================================== */
(function (global) {
  'use strict';

  var esc = UI.esc;
  var LETTERS = ['A', 'B', 'C', 'D'];

  function noVoiceWarning() {
    if (Speech.available()) return '';
    return '<div class="warn-box">找不到英文語音，這一題先用文字作答。' +
      '（Windows：設定 → 時間與語言 → 語音 → 新增語音 → English）</div>';
  }

  /**
   * 依序朗讀多段文字，正在唸的那一項會亮起來。
   * @returns {{stop:fn}} 控制器 —— 離開題目時要呼叫，否則語音會跟著跑到下一題
   */
  function playSeries(texts, nodes, onDone) {
    var i = 0, stopped = false;

    function unlight() {
      nodes.forEach(function (n) { if (n) n.classList.remove('opt-playing'); });
    }

    function step() {
      if (stopped) return;
      if (i >= texts.length) { unlight(); if (onDone) onDone(); return; }
      var n = nodes[i];
      if (n) n.classList.add('opt-playing');
      Speech.speak(texts[i]).then(function () {
        if (stopped) return;
        if (n) n.classList.remove('opt-playing');
        i++;
        setTimeout(step, 320);   // 選項之間留一點空隙，不然黏成一串聽不出斷句
      });
    }

    step();
    return { stop: function () { stopped = true; Speech.stop(); unlight(); } };
  }

  /** 「顯示英文」開關：預設藏起來，按了才露出 */
  function revealControl(host, onToggle) {
    var wrap = document.createElement('div');
    wrap.className = 'center mt8';
    wrap.innerHTML = '<button class="btn btn-ghost btn-sm" type="button">👁️ 顯示英文</button>';
    var b = wrap.firstChild;
    var shown = false;
    b.addEventListener('click', function () {
      shown = !shown;
      b.innerHTML = shown ? '🙈 隱藏英文' : '👁️ 顯示英文';
      onToggle(shown);
    });
    host.appendChild(wrap);
    return wrap;
  }

  /**
   * 兩種題型共用的骨架：一段音檔式的題幹 + 幾個只有字母的選項。
   * @param cfg {{ intro, sub, head, lead, texts, answer, grade, detail, host, api, q }}
   */
  function audioChoice(cfg) {
    var host = cfg.host, api = cfg.api, q = cfg.q;
    var texts = cfg.texts;
    var forceText = !Speech.available();
    var player = null;

    ExUtil.prompt(host, cfg.intro, cfg.sub);
    host.insertAdjacentHTML('beforeend', noVoiceWarning() + (cfg.head || ''));

    // 重播列：整組重播，或單獨重播某一個選項
    var barHTML = '<div class="center" style="padding:6px 0">' +
      '<button class="btn btn-primary" type="button" id="playall">🔊 播放</button>' +
      '<div class="mt8 row" style="gap:6px;justify-content:center;flex-wrap:wrap" id="replay"></div>' +
      '</div>';
    host.insertAdjacentHTML('beforeend', barHTML);

    var opts = texts.map(function (t, i) {
      return {
        html: '<span class="opt-letter">' + LETTERS[i] + '</span>' +
              '<span class="opt-say" data-i="' + i + '">' +
                '<span class="opt-text' + (forceText ? '' : ' is-hidden') + '">' + esc(t) + '</span>' +
              '</span>'
      };
    });

    var ctl = ExUtil.options(host, opts, { onPick: function () { api.enableCheck(true); } });
    // 選項顯示 A–D（多益的編號方式），但鍵盤快捷仍是 1–4，所以只把數字藏起來
    ctl.el.classList.add('opts-lettered');
    ExUtil.bindKeys(ctl, api);
    api.enableCheck(false);

    // 單獨重播的小按鈕
    var replay = UI.$('#replay', host);
    texts.forEach(function (t, i) {
      var b = document.createElement('button');
      b.className = 'btn btn-ghost btn-sm';
      b.type = 'button';
      b.textContent = LETTERS[i];
      b.addEventListener('click', function () {
        if (player) player.stop();
        player = playSeries([t], [ctl.nodes[i]]);
      });
      replay.appendChild(b);
    });

    if (!forceText) {
      revealControl(host, function (shown) {
        UI.$$('.opt-text, .ask-text', host).forEach(function (el) {
          if (shown) el.classList.remove('is-hidden');
          else el.classList.add('is-hidden');
        });
      });
    }

    function playAll() {
      if (player) player.stop();
      player = playSeries(cfg.lead ? [cfg.lead].concat(texts) : texts,
                          cfg.lead ? [null].concat(ctl.nodes) : ctl.nodes);
    }
    UI.$('#playall', host).addEventListener('click', playAll);
    api.onCleanup(function () { if (player) player.stop(); });

    if (Speech.available()) setTimeout(playAll, 400);

    api.ready(function () {
      if (player) player.stop();
      var picked = ctl.picked();
      if (picked < 0) return;
      var ok = picked === cfg.answer;
      ctl.lock(cfg.answer);

      // 作答後一律把文字露出來 —— 訂正時看不到原文等於白答
      UI.$$('.opt-text', host).forEach(function (el) { el.classList.remove('is-hidden'); });

      // 評分交給呼叫端做：弱點型別寫成字面值，才擋得住「新增型別忘了改
      // scheduler.weakQuestion」——那個檢查是靠掃描原始碼的字串跑的
      cfg.grade(ok);

      api.result(ok, {
        title: ok ? '答對了！' : '正確答案是 ' + LETTERS[cfg.answer],
        detail: cfg.detail()
      });
    });
  }

  /** 作答後的對照表：四個選項的英文與中文一起列出來 */
  function answerTable(texts, zhList, answer) {
    return '<div class="opt-review">' + texts.map(function (t, i) {
      return '<div class="opt-review-row' + (i === answer ? ' is-answer' : '') + '">' +
        '<span class="opt-letter">' + LETTERS[i] + '</span>' +
        Speech.btn(t, false, 'speak-inline') +
        '<div><div class="sentence-en">' + esc(t) + '</div>' +
        '<div class="sentence-zh">' + esc((zhList || [])[i] || '') + '</div></div>' +
        '</div>';
    }).join('') + '</div>';
  }

  /* ======================= Part 1：看圖聽描述 ======================= */
  Ex.photo = {
    scored: true,
    render: function (q, host, api) {
      var p = q.ref;

      audioChoice({
        host: host, api: api, q: q,
        grade: function (ok) {
          if (ok) SRS.clearWeak('photo', p.id);
          else SRS.addWeak('photo', p.id, q.unitId || p.u);
        },
        intro: '看圖，選出最符合的描述',
        sub: 'Part 1：四句描述只會唸一次，聽不清楚可以重播',
        head: '<div class="photo-frame">' + p.svg + '</div>',
        texts: p.opts,
        answer: p.a,
        detail: function () {
          return answerTable(p.opts, p.zh, p.a) +
            (p.why ? '<div class="check-detail">' + esc(p.why) + '</div>' : '');
        }
      });
    }
  };

  /* ======================= Part 2：應答問題 ======================= */
  Ex.respond = {
    scored: true,
    render: function (q, host, api) {
      var r = q.ref;
      var forceText = !Speech.available();

      audioChoice({
        host: host, api: api, q: q,
        grade: function (ok) {
          if (ok) SRS.clearWeak('respond', r.id);
          else SRS.addWeak('respond', r.id, q.unitId || r.u);
        },
        intro: '聽問句，選出最適合的回應',
        sub: 'Part 2：先聽懂開頭的疑問詞，答案通常就定了一半',
        head: '<div class="ask-card">' +
                '<div class="ask-label">問句</div>' +
                Speech.btn(r.ask) +
                '<div class="sentence-en ask-text' + (forceText ? '' : ' is-hidden') + '">' +
                  esc(r.ask) + '</div>' +
              '</div>',
        lead: r.ask,
        texts: r.opts,
        answer: r.a,
        detail: function () {
          // 問句本身也要露出來，不然使用者不知道自己聽錯的是哪個字
          UI.$$('.ask-text', host).forEach(function (el) { el.classList.remove('is-hidden'); });
          return '<div class="opt-review-row is-ask">' +
              Speech.btn(r.ask, false, 'speak-inline') +
              '<div><div class="sentence-en">' + esc(r.ask) + '</div>' +
              '<div class="sentence-zh">' + esc(r.askZh || '') + '</div></div>' +
            '</div>' +
            answerTable(r.opts, r.zh, r.a) +
            (r.why ? '<div class="check-detail">' + esc(r.why) + '</div>' : '');
        }
      });
    }
  };
})(window);
