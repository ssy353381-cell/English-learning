/* ==========================================================================
   exercises/flashcard.js — 單字卡（新字教學）＋ recall（中英互選）
   ========================================================================== */
(function (global) {
  'use strict';

  var esc = UI.esc;

  /* ======================= 單字卡：教新字，不計分 ======================= */
  Ex.flashcard = {
    scored: false,
    render: function (q, host, api) {
      var v = q.ref;
      host.innerHTML =
        '<div class="tag green">新單字</div>' +
        ExUtil.wordCardHTML(v);

      // 第一次見到就建立 SRS 紀錄，讓它明天排進複習
      if (!SRS.has(v.id)) {
        SRS.rec(v.id);
        State.data.today.newWords++;
        State.save();
      }

      if (State.data.profile.autoPlay) {
        setTimeout(function () { Speech.speak(v.w); }, 250);
      }
      api.setContinue('記起來了');
    }
  };

  /* ======================= recall：看中文選英文 / 看英文選中文 ======================= */
  Ex.recall = {
    scored: true,
    render: function (q, host, api) {
      var v = q.ref;
      var zh2en = q.dir === 'zh2en';
      var t0 = Date.now();

      // 詞庫特訓會帶 q.pool（同一批、難度相近的字）；關卡沒帶就用學過的字
      var wrongs = Content.distractors(v, 3, q.pool);
      var pool = Content.shuffle([v].concat(wrongs));
      var correctIdx = pool.indexOf(v);

      ExUtil.prompt(host,
        zh2en ? '「' + esc(v.zh) + '」的英文是？' : '這個字是什麼意思？',
        zh2en ? '<span class="word-pos">' + esc(v.pos) + '</span>' : '');

      if (!zh2en) {
        host.insertAdjacentHTML('beforeend',
          '<div class="wordcard" style="padding:16px">' +
            (v.ic ? '<div class="word-icon">' + v.ic + '</div>' : '') +
            '<div class="word-main">' + esc(v.w) + '</div>' +
            (State.data.profile.showKK && v.kk ? '<div class="word-kk">[' + esc(v.kk) + ']</div>' : '') +
            '<div class="mt8">' + Speech.btn(v.w) + '</div>' +
          '</div>');
      }

      var opts = pool.map(function (x) {
        return { html: zh2en
          ? '<span class="en bold">' + esc(x.w) + '</span>'
          : '<span class="bold">' + esc(x.zh) + '</span>' };
      });

      var ctl = ExUtil.options(host, opts, {
        onPick: function () { api.enableCheck(true); }
      });
      ExUtil.bindKeys(ctl, api);
      api.enableCheck(false);

      api.ready(function () {
        var picked = ctl.picked();
        if (picked < 0) return;
        var ok = picked === correctIdx;
        var slow = (Date.now() - t0) > 9000;
        ctl.lock(correctIdx);
        ExUtil.gradeVocab(v, ok, slow, q.unitId);
        if (q.weak && ok) SRS.clearWeak('vocab', v.id);

        api.result(ok, {
          title: ok ? (slow ? '答對了，但想久了一點' : '答對！') : '正確答案是',
          detail: '<div class="row" style="gap:8px">' + Speech.btn(v.w) +
            '<div><div class="sentence-en">' + esc(v.w) +
            (v.kk ? ' <span class="word-kk">[' + esc(v.kk) + ']</span>' : '') + '</div>' +
            '<div class="sentence-zh">' + esc(v.pos) + ' ' + esc(v.zh) + '</div></div></div>' +
            (v.ex && v.ex[0] ? '<div class="sentence-en mt8">' + Lexicon.markup(v.ex[0][0]) + '</div>' +
              '<div class="sentence-zh">' + esc(v.ex[0][1]) + '</div>' : '')
        });
      });
    }
  };
})(window);
