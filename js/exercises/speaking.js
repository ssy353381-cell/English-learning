/* ==========================================================================
   exercises/speaking.js — 口說跟讀
   --------------------------------------------------------------------------
   三種模式，依環境自動選：
     A. 連網 + 支援辨識 → 真的比對你唸的內容，逐字標紅
     B. 離線但可錄音     → 錄下來回放，跟原音對照後自評
     C. 兩者都不行       → 純跟讀，唸完按繼續（不擋學習）
   ========================================================================== */
(function (global) {
  'use strict';

  var esc = UI.esc;

  function header(host, s) {
    var isWord = s.kind === 'word';
    ExUtil.prompt(host, isWord ? '跟著唸這個字' : '跟著唸這句話');
    host.insertAdjacentHTML('beforeend',
      '<div class="wordcard">' +
        '<div class="' + (isWord ? 'word-main' : 'sentence-en big') + '">' + esc(s.en) + '</div>' +
        '<div class="sentence-zh mt8">' + esc(s.zh) + '</div>' +
        '<div class="row mt16" style="justify-content:center;gap:10px">' +
          Speech.btn(s.en) + Speech.btn(s.en, true) +
        '</div>' +
      '</div>');
  }

  function marksHTML(marks) {
    return marks.map(function (m) {
      return '<span class="' + (m.ok ? 'hit' : 'miss') + '">' + esc(m.w) + '</span>';
    }).join(' ');
  }

  Ex.speak = {
    scored: true,
    render: function (q, host, api) {
      var s = q.ref;
      header(host, s);

      var useSTT = Speech.sttUsable();
      var useRec = !useSTT && Speech.recorderSupported();

      /* ---------------- C. 兩者都不行：純跟讀 ---------------- */
      if (!useSTT && !useRec) {
        host.insertAdjacentHTML('beforeend',
          '<div class="hint-box">這個瀏覽器沒有麥克風功能可用，先用「聽 → 跟著唸出聲」的方式練習。' +
          '出聲唸出來比在心裡默念有效得多。</div>');
        api.setContinue('我唸過了');
        return;
      }

      var modeNote = useSTT
        ? '<p class="muted small center">按麥克風後對著它唸，唸完再按一次結束。</p>'
        : '<div class="hint-box">目前是離線狀態，無法自動評分。改成錄下你的聲音跟原音對照，' +
          '由你自己判斷像不像 — 這反而更能練出耳朵。</div>';

      host.insertAdjacentHTML('beforeend',
        modeNote +
        '<div class="center"><button class="mic-btn" id="mic">🎤</button></div>' +
        '<div id="heard" class="heard mt16 center muted">還沒開始</div>' +
        '<div id="playback" class="center mt8"></div>' +
        '<div class="center mt8"><button class="btn btn-ghost btn-sm" id="skip">這題先跳過</button></div>');

      var mic = UI.$('#mic', host);
      var heard = UI.$('#heard', host);
      var playback = UI.$('#playback', host);
      var recording = false;
      var ctl = null;
      var recCtl = null;
      var finished = false;

      UI.$('#skip', host).onclick = function () {
        if (finished) return;
        finished = true;
        api.result(true, { title: '跳過', detail: '沒關係，之後再回來練這句。', neutral: true });
      };

      /* ---------------- A. 語音辨識 ---------------- */
      function startSTT() {
        heard.textContent = '聽你唸…';
        heard.classList.remove('muted');
        ctl = Speech.listen({
          oninterim: function (t) { heard.textContent = t || '聽你唸…'; },
          onerror: function (err) {
            recording = false;
            mic.classList.remove('rec');
            if (err === 'not-allowed' || err === 'service-not-allowed') {
              heard.innerHTML = '<span class="text-red">麥克風被擋住了</span>';
              host.insertAdjacentHTML('beforeend',
                '<div class="warn-box">瀏覽器封鎖了麥克風。請點網址列左邊的鎖頭圖示 → 允許麥克風，' +
                '然後重新整理。<br>' +
                '（注意：用 file:// 直接開啟時，部分瀏覽器不允許麥克風，這種情況請按「跳過」，' +
                '或改用打包後的單檔版放到手機瀏覽器使用。）</div>');
            } else if (err === 'no-speech') {
              heard.innerHTML = '<span class="muted">沒聽到聲音，再試一次</span>';
            } else {
              heard.innerHTML = '<span class="muted">辨識失敗（' + esc(err) + '），可以按跳過</span>';
            }
          },
          onend: function (text) {
            recording = false;
            mic.classList.remove('rec');
            if (!text) { return; }
            judge(text);
          }
        });
      }

      function judge(text) {
        if (finished) return;
        finished = true;
        var r = Speech.scoreSpeech(s.en, text);
        var ok = r.score >= 0.6;
        heard.innerHTML = marksHTML(r.marks);

        var pctTxt = Math.round(r.score * 100);
        var v = Content.item(s.from);
        if (v && v.w) ExUtil.gradeVocab(v, ok, false, q.unitId);

        api.result(ok, {
          title: ok ? (r.score >= 0.9 ? '幾乎完美！' : '不錯，聽得出來了') : '再試一次會更好',
          detail:
            '<div class="row" style="gap:14px;align-items:center">' +
              '<div class="score-big ' + (ok ? 'text-green' : 'text-red') + '">' + pctTxt + '<span class="small">分</span></div>' +
              '<div class="grow"><div class="small muted">辨識結果</div>' +
              '<div class="heard" style="background:transparent;padding:0">' + marksHTML(r.marks) + '</div></div>' +
            '</div>' +
            '<div class="row mt8" style="gap:8px">' + Speech.btn(s.en) + Speech.btn(s.en, true) +
            '<span class="small muted">再聽一次標準音</span></div>'
        });
      }

      /* ---------------- B. 離線錄音 ---------------- */
      function startRec() {
        heard.textContent = '錄音中…';
        Speech.record().then(function (c) {
          recCtl = c;
        }).catch(function () {
          recording = false;
          mic.classList.remove('rec');
          heard.innerHTML = '<span class="text-red">無法開啟麥克風</span>';
        });
      }

      function stopRec() {
        if (!recCtl) { heard.textContent = '沒有錄到聲音'; return; }
        recCtl.stop().then(function (url) {
          recCtl = null;
          if (!url) { heard.textContent = '沒有錄到聲音'; return; }
          heard.innerHTML = '<span class="muted">聽聽看你自己的聲音，再跟原音比較</span>';
          playback.innerHTML =
            '<audio controls src="' + url + '" style="width:100%;max-width:320px"></audio>' +
            '<div class="row mt16" style="gap:8px;justify-content:center">' + Speech.btn(s.en) +
            '<span class="small muted">標準音</span></div>' +
            '<div class="mt16 bold">你覺得像不像？</div>' +
            '<div class="row mt8" style="gap:8px">' +
              '<button class="btn btn-ghost grow" data-self="0">還差很多</button>' +
              '<button class="btn btn-blue grow" data-self="1">還可以</button>' +
              '<button class="btn btn-primary grow" data-self="2">很像</button>' +
            '</div>';
          UI.$$('[data-self]', playback).forEach(function (b) {
            b.onclick = function () {
              if (finished) return;
              finished = true;
              var lv = +b.getAttribute('data-self');
              var v = Content.item(s.from);
              if (v && v.w) ExUtil.gradeVocab(v, lv >= 1, lv === 1, q.unitId);
              api.result(lv >= 1, {
                title: lv === 2 ? '很好，這句過關' : (lv === 1 ? '有抓到感覺了' : '沒關係，多聽幾次再唸'),
                detail: '<div class="row" style="gap:8px">' + Speech.btn(s.en) + Speech.btn(s.en, true) +
                  '<div class="sentence-en">' + esc(s.en) + '</div></div>' +
                  '<div class="small muted mt8">離線模式沒有自動評分。連上網路後，這一題會改成逐字比對。</div>'
              });
            };
          });
        });
      }

      mic.onclick = function () {
        if (finished) return;
        Speech.stop();
        recording = !recording;
        mic.classList.toggle('rec', recording);
        if (recording) { playback.innerHTML = ''; useSTT ? startSTT() : startRec(); }
        else { useSTT ? (ctl && ctl.stop()) : stopRec(); }
      };

      api.onCleanup(function () {
        if (ctl) ctl.stop();
        if (recCtl) recCtl.stop();
      });
    }
  };
})(window);
