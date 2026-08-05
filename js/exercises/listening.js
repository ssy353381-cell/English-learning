/* ==========================================================================
   exercises/listening.js — 聽力：聽音辨義（單字/句子）與聽寫填空
   ========================================================================== */
(function (global) {
  'use strict';

  var esc = UI.esc;

  function playerHTML(text) {
    return '<div class="center" style="padding:12px 0">' +
      '<button class="speak-btn" data-speak="' + esc(text) + '" ' +
        'style="width:88px;height:88px;font-size:2.4rem">🔊</button>' +
      '<div class="mt8">' +
        '<button class="btn btn-ghost btn-sm" data-speak="' + esc(text) + '" data-slow="1">🐢 慢速重播</button>' +
      '</div></div>';
  }

  function autoplay(text) {
    if (!Speech.available()) return;
    setTimeout(function () { Speech.speak(text); }, 300);
  }

  function noVoiceWarning() {
    if (Speech.available()) return '';
    return '<div class="warn-box">找不到英文語音。請確認系統已安裝英語語音套件' +
      '（Windows：設定 → 時間與語言 → 語音 → 新增語音 → English）。' +
      '在語音修好之前，這一題可以看文字作答。</div>';
  }

  /* ======================= 聽音辨義 ======================= */
  Ex.listen = {
    scored: true,
    render: function (q, host, api) {
      var isWord = q.mode === 'word';
      var target = isWord ? q.ref.w : q.ref.en;
      var t0 = Date.now();

      ExUtil.prompt(host, isWord ? '聽到的是哪個字？' : '這句話的意思是？');
      host.insertAdjacentHTML('beforeend', noVoiceWarning() + playerHTML(target));

      // 沒有語音時直接把文字露出來，避免整題卡死
      if (!Speech.available()) {
        host.insertAdjacentHTML('beforeend',
          '<div class="card card-tight center sentence-en">' + esc(target) + '</div>');
      }

      var pool, correctIdx, opts;

      if (isWord) {
        var v = q.ref;
        pool = Content.shuffle([v].concat(Content.distractors(v, 3, q.pool)));
        correctIdx = pool.indexOf(v);
        opts = pool.map(function (x) {
          return { html: '<span class="en bold">' + esc(x.w) + '</span>' +
            '<span class="muted small">　' + esc(x.zh) + '</span>' };
        });
      } else {
        // 句子題：從同關卡其他句子抽誘答
        var all = Scheduler.sentencesFrom(Content.vocabUpTo(q.unitId), { maxWords: 14 })
          .filter(function (s) { return s.zh !== q.ref.zh; });
        var wrong = Content.sample(all, 3);
        pool = Content.shuffle([q.ref].concat(wrong));
        correctIdx = pool.indexOf(q.ref);
        opts = pool.map(function (x) { return { html: esc(x.zh) }; });
      }

      var ctl = ExUtil.options(host, opts, { onPick: function () { api.enableCheck(true); } });
      ExUtil.bindKeys(ctl, api);
      api.enableCheck(false);
      autoplay(target);

      api.ready(function () {
        var picked = ctl.picked();
        if (picked < 0) return;
        var ok = picked === correctIdx;
        ctl.lock(correctIdx);
        if (isWord) ExUtil.gradeVocab(q.ref, ok, (Date.now() - t0) > 9000, q.unitId);
        api.result(ok, {
          title: ok ? '聽對了！' : '再聽一次',
          detail: '<div class="row" style="gap:8px">' + Speech.btn(target) +
            '<div><div class="sentence-en">' + esc(target) + '</div>' +
            '<div class="sentence-zh">' + esc(isWord ? q.ref.zh : q.ref.zh) + '</div></div></div>'
        });
      });
    }
  };

  /* ======================= 聽寫填空 ======================= */
  Ex.dictate = {
    scored: true,
    render: function (q, host, api) {
      var s = q.ref;
      var toks = ExUtil.tokenize(s.en);

      // 挑 1–2 個「有內容」的字挖空
      var candidates = [];
      toks.forEach(function (t, i) {
        var clean = t.replace(/[^A-Za-z']/g, '');
        if (clean.length >= 3) candidates.push(i);
      });
      var blanks = Content.sample(candidates.length ? candidates : [0], toks.length > 7 ? 2 : 1);
      blanks.sort(function (a, b) { return a - b; });

      ExUtil.prompt(host, '聽寫：把空格補完');
      host.insertAdjacentHTML('beforeend', noVoiceWarning() + playerHTML(s.en));

      var html = '<div class="cloze-text center">';
      toks.forEach(function (t, i) {
        if (blanks.indexOf(i) >= 0) {
          var clean = t.replace(/[^A-Za-z']/g, '');
          var punct = t.replace(/[A-Za-z']/g, '');
          html += '<input class="blank-input" data-i="' + i + '" data-a="' + esc(clean) +
                  '" size="' + Math.max(4, clean.length) + '" autocomplete="off" ' +
                  'autocapitalize="off" spellcheck="false"> ' + esc(punct) + ' ';
        } else {
          html += esc(t) + ' ';
        }
      });
      html += '</div>';
      host.insertAdjacentHTML('beforeend', html);
      host.insertAdjacentHTML('beforeend',
        '<p class="muted small center mt8">' + esc(s.zh) + '</p>');

      var inputs = UI.$$('.blank-input', host);
      inputs.forEach(function (inp) {
        inp.addEventListener('input', function () {
          var any = inputs.some(function (x) { return x.value.trim(); });
          api.enableCheck(any);
        });
        inp.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') { e.preventDefault(); api.submit(); }
        });
      });
      api.enableCheck(false);
      if (inputs[0]) setTimeout(function () { inputs[0].focus(); }, 120);
      autoplay(s.en);

      api.ready(function () {
        var allOk = true;
        inputs.forEach(function (inp) {
          var ok = ExUtil.sameText(inp.value, inp.getAttribute('data-a'));
          inp.classList.add(ok ? 'correct' : 'wrong');
          inp.disabled = true;
          if (!ok) { allOk = false; inp.value = inp.getAttribute('data-a'); }
        });
        var v = Content.item(s.from);
        if (v && v.w) ExUtil.gradeVocab(v, allOk, false, q.unitId);
        api.result(allOk, {
          title: allOk ? '全對！耳朵很準' : '正確的句子是',
          detail: '<div class="row" style="gap:8px">' + Speech.btn(s.en) +
            '<div><div class="sentence-en">' + Lexicon.markup(s.en) + '</div>' +
            '<div class="sentence-zh">' + esc(s.zh) + '</div></div></div>'
        });
      });
    }
  };
})(window);
