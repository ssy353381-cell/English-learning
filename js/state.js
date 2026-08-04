/* ==========================================================================
   state.js — 全域狀態、localStorage 存檔、匯出/匯入、進度碼
   使用方式：State.data 讀取，改完呼叫 State.save()
   ========================================================================== */
(function (global) {
  'use strict';

  var KEY = 'eq.save.v1';
  var VERSION = 1;

  /* ---------- 日期工具（一律用「本地時間」的 YYYY-MM-DD） ---------- */
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function dayStr(d) {
    d = d || new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function addDays(str, n) {
    var p = str.split('-');
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    d.setDate(d.getDate() + n);
    return dayStr(d);
  }

  function daysBetween(a, b) {
    var pa = a.split('-'), pb = b.split('-');
    var da = new Date(+pa[0], +pa[1] - 1, +pa[2]);
    var db = new Date(+pb[0], +pb[1] - 1, +pb[2]);
    return Math.round((db - da) / 86400000);
  }

  /* ---------- 預設存檔 ---------- */
  function blank() {
    return {
      v: VERSION,
      created: dayStr(),
      profile: {
        nickname: '',
        goalMin: 40,          // 每日目標分鐘數：20 / 40 / 60
        rate: 0.85,           // TTS 語速
        voice: '',            // 指定的語音名稱（空 = 自動挑）
        theme: 'auto',        // auto / light / dark
        sound: true,          // 音效
        autoPlay: true,       // 出現英文時自動朗讀
        showKK: true          // 顯示 KK 音標
      },
      // 關卡進度： { 's0u1': { s:2, best:0.92, n:3, at:'2026-08-04' } }  s=星數
      units: {},
      // 間隔重複： { 's0_001': { ef:2.5, iv:1, rep:2, due:'2026-08-06', lap:0 } }
      srs: {},
      // 弱點怪獸： [ { k:'v:s0_001', t:'vocab', u:'s0u7', n:2, at:'2026-08-04' } ]
      weak: [],
      // 遊戲化
      g: {
        xp: 0, lvl: 1, gems: 0,
        streak: 0, bestStreak: 0, freeze: 0,
        // shieldUsedN 是「還沒告訴使用者」的擋刀次數，Gamify.noticeShield() 報過就歸零
        lastDay: '', shieldUsedOn: '', shieldUsedN: 0, doubleDay: ''
      },
      // 今日
      today: {
        day: dayStr(), xp: 0, min: 0, lessons: 0, newWords: 0,
        correct: 0, total: 0, challenge: false
      },
      // 歷史： { '2026-08-04': { xp:120, min:38, l:3, c:56, t:62 } }
      hist: {},
      // 成就： { 'first_lesson': '2026-08-04' }
      ach: {},
      // 累計
      total: { correct: 0, answered: 0, min: 0, lessons: 0, sessions: 0 }
    };
  }

  /* ---------- 深層合併（讓舊存檔補上新欄位） ---------- */
  function fill(target, defaults) {
    for (var k in defaults) {
      if (!Object.prototype.hasOwnProperty.call(defaults, k)) continue;
      var dv = defaults[k];
      if (target[k] === undefined || target[k] === null) {
        target[k] = (dv && typeof dv === 'object' && !Array.isArray(dv)) ? fill({}, dv) : dv;
      } else if (dv && typeof dv === 'object' && !Array.isArray(dv) && typeof target[k] === 'object') {
        fill(target[k], dv);
      }
    }
    return target;
  }

  var data = blank();
  var listeners = [];

  /* ---------- 讀檔 / 存檔 ---------- */
  function load() {
    var raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) { /* 隱私模式 */ }
    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        data = fill(parsed, blank());
      } catch (e) {
        console.warn('存檔毀損，改用新檔', e);
        data = blank();
      }
    }
    rollDay();
    return data;
  }

  var saveTimer = null;
  function save(immediate) {
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
    if (immediate) { writeNow(); return; }
    saveTimer = setTimeout(writeNow, 250);   // 合併連續寫入
  }

  function writeNow() {
    saveTimer = null;
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      console.error('無法存檔（可能是空間已滿或瀏覽器封鎖）', e);
      if (global.UI && UI.toast) UI.toast('⚠️ 進度存檔失敗，請檢查瀏覽器設定', 'bad', 4000);
    }
    for (var i = 0; i < listeners.length; i++) { try { listeners[i](data); } catch (e) {} }
  }

  function onChange(fn) { listeners.push(fn); }

  /* ---------- 跨日處理：結算昨天、重置今天、判斷 streak ---------- */
  function rollDay() {
    var now = dayStr();
    if (data.today.day === now) return false;

    // 把昨天的成績寫進歷史
    if (data.today.day && (data.today.xp > 0 || data.today.total > 0)) {
      data.hist[data.today.day] = {
        xp: data.today.xp, min: Math.round(data.today.min),
        l: data.today.lessons, c: data.today.correct, t: data.today.total
      };
    }

    // streak 判定：昨天有達標才續，否則看有沒有護盾
    if (data.g.lastDay) {
      var gap = daysBetween(data.g.lastDay, now);
      if (gap > 1) {
        var missed = gap - 1;
        if (data.g.freeze >= missed) {
          data.g.freeze -= missed;                   // 護盾擋掉
          data.g.shieldUsedOn = now;
          data.g.shieldUsedN = (data.g.shieldUsedN || 0) + missed;
        } else {
          data.g.streak = 0;                         // 斷了
        }
      }
    }

    data.today = {
      day: now, xp: 0, min: 0, lessons: 0, newWords: 0,
      correct: 0, total: 0, challenge: false
    };
    save(true);
    return true;
  }

  /* ---------- 匯出 / 匯入 ---------- */
  function toJSON() { return JSON.stringify(data); }

  function download() {
    var blob = new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'EnglishQuest-進度-' + dayStr() + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  // UTF-8 安全的 base64（進度碼用，方便手機剪貼簿同步）
  function b64encode(str) {
    var bytes = new TextEncoder().encode(str);
    var bin = '';
    for (var i = 0; i < bytes.length; i += 8192) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192));
    }
    return btoa(bin);
  }

  function b64decode(b64) {
    var bin = atob(b64.replace(/\s+/g, ''));
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  function toCode() { return 'EQ1:' + b64encode(JSON.stringify(data)); }

  function fromCode(code) {
    code = (code || '').trim();
    if (code.indexOf('EQ1:') === 0) code = code.slice(4);
    return importJSON(b64decode(code));
  }

  function importJSON(text) {
    var incoming = JSON.parse(text);
    if (!incoming || typeof incoming !== 'object' || !incoming.v) {
      throw new Error('這不是有效的 English Quest 進度檔');
    }
    data = fill(incoming, blank());
    rollDay();
    save(true);
    return data;
  }

  function reset() {
    data = blank();
    save(true);
  }

  /* ---------- 常用小工具 ---------- */
  function unit(id) {
    if (!data.units[id]) data.units[id] = { s: 0, lv: 0, best: 0, n: 0, at: '' };
    if (data.units[id].lv === undefined) data.units[id].lv = data.units[id].s > 0 ? 1 : 0;
    return data.units[id];
  }

  function isUnitDone(id) { return !!(data.units[id] && data.units[id].s > 0); }

  function goalPct() {
    var target = data.profile.goalMin * 3;   // 每分鐘約 3 XP → 40 分鐘 = 120 XP
    if (target <= 0) return 1;
    return Math.min(1, data.today.xp / target);
  }

  function goalXP() { return data.profile.goalMin * 3; }

  /* ---------- 學習時間累計（每 10 秒 tick 一次） ---------- */
  var tickTimer = null;
  var lastActive = Date.now();

  function markActive() { lastActive = Date.now(); }

  function startClock() {
    if (tickTimer) return;
    tickTimer = setInterval(function () {
      // 只有近 90 秒內有互動才算「在學習」，避免掛著不動也在計時
      if (Date.now() - lastActive < 90000 && !document.hidden) {
        data.today.min += 10 / 60;
        data.total.min += 10 / 60;
        save();
      }
    }, 10000);
    ['click', 'keydown', 'touchstart', 'pointerdown'].forEach(function (ev) {
      document.addEventListener(ev, markActive, { passive: true });
    });
  }

  global.State = {
    VERSION: VERSION,
    get data() { return data; },
    load: load,
    save: save,
    onChange: onChange,
    rollDay: rollDay,
    dayStr: dayStr,
    addDays: addDays,
    daysBetween: daysBetween,
    toJSON: toJSON,
    toCode: toCode,
    fromCode: fromCode,
    importJSON: importJSON,
    download: download,
    reset: reset,
    unit: unit,
    isUnitDone: isUnitDone,
    goalPct: goalPct,
    goalXP: goalXP,
    startClock: startClock,
    markActive: markActive
  };
})(window);
