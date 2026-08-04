/* ==========================================================================
   speech.js — 朗讀（TTS）、口說辨識（STT）、離線錄音降級
   --------------------------------------------------------------------------
   朗讀：speechSynthesis，Windows/Chrome/Edge 有本機語音，離線可用。
   辨識：SpeechRecognition 走雲端，必須連網；斷網時自動改成錄音回放 + 自評。
   ========================================================================== */
(function (global) {
  'use strict';

  var synth = global.speechSynthesis || null;
  var voices = [];
  var pickedVoice = null;

  /* ---------- 語音清單 ---------- */
  function loadVoices() {
    if (!synth) return;
    voices = synth.getVoices() || [];
    pickedVoice = chooseVoice();
  }

  function chooseVoice() {
    if (!voices.length) return null;
    var want = State.data.profile.voice;
    if (want) {
      var exact = voices.filter(function (v) { return v.name === want; })[0];
      if (exact) return exact;
    }
    var en = voices.filter(function (v) { return /^en(-|_|$)/i.test(v.lang); });
    if (!en.length) return null;
    // 優先順序：美式 > 自然音質關鍵字 > 其它英文
    var prefer = ['en-US', 'en_US'];
    var us = en.filter(function (v) { return prefer.indexOf(v.lang) >= 0; });
    var pool = us.length ? us : en;
    var nice = pool.filter(function (v) {
      return /natural|neural|online|aria|jenny|guy|zira|david|samantha/i.test(v.name);
    });
    return (nice[0] || pool[0]);
  }

  function voiceList() {
    return voices.filter(function (v) { return /^en(-|_|$)/i.test(v.lang); });
  }

  if (synth) {
    loadVoices();
    if (typeof synth.onvoiceschanged !== 'undefined') {
      synth.onvoiceschanged = loadVoices;
    }
    // 有些瀏覽器第一次 getVoices() 回空陣列，補一次
    setTimeout(loadVoices, 400);
    setTimeout(loadVoices, 1500);
  }

  /* ---------- 朗讀 ---------- */
  var currentBtn = null;

  function speak(text, opts) {
    opts = opts || {};
    if (!synth || !text) return Promise.resolve(false);

    try { synth.cancel(); } catch (e) {}
    if (currentBtn) { currentBtn.classList.remove('playing'); currentBtn = null; }

    var u = new SpeechSynthesisUtterance(String(text));
    if (!pickedVoice) loadVoices();
    if (pickedVoice) { u.voice = pickedVoice; u.lang = pickedVoice.lang; }
    else u.lang = 'en-US';
    u.rate = opts.rate != null ? opts.rate : (State.data.profile.rate || 0.85);
    u.pitch = opts.pitch != null ? opts.pitch : 1;
    u.volume = 1;

    if (opts.btn) { currentBtn = opts.btn; opts.btn.classList.add('playing'); }

    return new Promise(function (resolve) {
      var done = false;
      function finish(ok) {
        if (done) return; done = true;
        if (opts.btn) opts.btn.classList.remove('playing');
        if (currentBtn === opts.btn) currentBtn = null;
        resolve(ok);
      }
      u.onend = function () { finish(true); };
      u.onerror = function () { finish(false); };
      try { synth.speak(u); } catch (e) { finish(false); }
      // 保險：Chrome 偶爾不觸發 onend
      setTimeout(function () { finish(true); }, 1200 + String(text).length * 90);
    });
  }

  function stop() {
    try { if (synth) synth.cancel(); } catch (e) {}
    if (currentBtn) { currentBtn.classList.remove('playing'); currentBtn = null; }
  }

  function available() { return !!synth && voiceList().length > 0; }

  /** 產生一顆發音按鈕的 HTML（用 data-speak 讓事件代理接手） */
  function btn(text, slow, extraCls) {
    return '<button class="speak-btn ' + (slow ? 'slow ' : '') + (extraCls || '') +
      '" data-speak="' + UI.esc(text) + '"' + (slow ? ' data-slow="1"' : '') +
      ' aria-label="朗讀">' + (slow ? '0.5×' : '🔊') + '</button>';
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-speak]') : null;
    if (!b) return;
    e.preventDefault();
    var slow = b.getAttribute('data-slow') === '1';
    speak(b.getAttribute('data-speak'), {
      btn: b,
      rate: slow ? Math.max(0.4, (State.data.profile.rate || 0.85) * 0.55) : undefined
    });
  });

  /* ==========================================================================
     口說辨識
     ========================================================================== */
  var SR = global.SpeechRecognition || global.webkitSpeechRecognition || null;

  function sttSupported() { return !!SR; }
  function online() { return navigator.onLine !== false; }
  function sttUsable() { return sttSupported() && online(); }

  /**
   * 開始辨識。
   * @returns {object} { stop() } 控制器
   */
  function listen(handlers) {
    handlers = handlers || {};
    if (!SR) { if (handlers.onerror) handlers.onerror('unsupported'); return { stop: function () {} }; }

    var r = new SR();
    r.lang = 'en-US';
    r.interimResults = true;
    r.continuous = false;
    r.maxAlternatives = 3;

    var finalText = '';
    var alts = [];

    r.onresult = function (ev) {
      var interim = '';
      for (var i = ev.resultIndex; i < ev.results.length; i++) {
        var res = ev.results[i];
        if (res.isFinal) {
          finalText += res[0].transcript;
          for (var k = 0; k < res.length; k++) alts.push(res[k].transcript);
        } else {
          interim += res[0].transcript;
        }
      }
      if (handlers.oninterim) handlers.oninterim(finalText + interim);
    };
    r.onerror = function (ev) {
      if (handlers.onerror) handlers.onerror(ev.error || 'error');
    };
    r.onend = function () {
      if (handlers.onend) handlers.onend(finalText.trim(), alts);
    };

    try { r.start(); } catch (e) { if (handlers.onerror) handlers.onerror('start-failed'); }
    return { stop: function () { try { r.stop(); } catch (e) {} } };
  }

  /* ---------- 離線降級：錄音回放 ---------- */
  function recorderSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && global.MediaRecorder);
  }

  function record() {
    if (!recorderSupported()) return Promise.reject(new Error('unsupported'));
    return navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      var chunks = [];
      var mr = new MediaRecorder(stream);
      mr.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
      mr.start();
      return {
        stop: function () {
          return new Promise(function (resolve) {
            mr.onstop = function () {
              stream.getTracks().forEach(function (t) { t.stop(); });
              resolve(URL.createObjectURL(new Blob(chunks, { type: mr.mimeType || 'audio/webm' })));
            };
            try { mr.stop(); } catch (e) { resolve(null); }
          });
        }
      };
    });
  }

  /* ==========================================================================
     發音比對評分
     ========================================================================== */
  function normalize(s) {
    return String(s || '').toLowerCase()
      .replace(/[’']/g, "'")
      .replace(/[^a-z0-9'\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function words(s) { return normalize(s).split(' ').filter(Boolean); }

  /** Levenshtein，用來容忍辨識器聽錯一兩個字母 */
  function lev(a, b) {
    var m = a.length, n = b.length;
    if (!m) return n;
    if (!n) return m;
    var prev = new Array(n + 1), cur = new Array(n + 1);
    for (var j = 0; j <= n; j++) prev[j] = j;
    for (var i = 1; i <= m; i++) {
      cur[0] = i;
      for (var k = 1; k <= n; k++) {
        cur[k] = Math.min(prev[k] + 1, cur[k - 1] + 1, prev[k - 1] + (a[i - 1] === b[k - 1] ? 0 : 1));
      }
      var t = prev; prev = cur; cur = t;
    }
    return prev[n];
  }

  function similar(a, b) {
    if (a === b) return 1;
    var d = lev(a, b);
    return 1 - d / Math.max(a.length, b.length, 1);
  }

  /**
   * 比對「該唸的」與「聽到的」，回傳分數與逐字標記。
   * @returns {{score:number, marks:Array<{w:string, ok:boolean}>, hit:number, total:number}}
   */
  function scoreSpeech(target, heard) {
    var T = words(target), H = words(heard);
    var used = new Array(H.length);
    var marks = [], hit = 0;

    for (var i = 0; i < T.length; i++) {
      var best = -1, bestScore = 0;
      for (var j = 0; j < H.length; j++) {
        if (used[j]) continue;
        // 只在附近的位置找，避免整句亂配
        if (Math.abs(j - i) > 3) continue;
        var s = similar(T[i], H[j]);
        if (s > bestScore) { bestScore = s; best = j; }
      }
      var ok = bestScore >= 0.72;
      if (ok) { used[best] = true; hit++; }
      marks.push({ w: T[i], ok: ok });
    }

    var score = T.length ? hit / T.length : 0;
    // 唸了一堆多餘的字要稍微扣分
    var extra = Math.max(0, H.length - T.length);
    score = Math.max(0, score - extra * 0.04);
    return { score: score, marks: marks, hit: hit, total: T.length };
  }

  global.Speech = {
    speak: speak, stop: stop, available: available, btn: btn,
    voiceList: voiceList, reloadVoices: loadVoices,
    sttSupported: sttSupported, sttUsable: sttUsable, online: online, listen: listen,
    recorderSupported: recorderSupported, record: record,
    scoreSpeech: scoreSpeech, normalize: normalize, words: words, similar: similar
  };
})(window);
