/* ==========================================================================
   srs.js — 間隔重複（SM-2 簡化版）
   單字要真的記住，靠的不是看幾次，而是「在快忘掉的那一刻剛好複習到」。
   --------------------------------------------------------------------------
   評分 q： 0 = 完全忘記   1 = 想很久才答對   2 = 順利答對
   ========================================================================== */
(function (global) {
  'use strict';

  var FIRST_STEPS = [0, 1, 3];   // 前三次的間隔（天）：當天再看一次 → 隔天 → 三天後
  var MAX_IV = 240;              // 上限 8 個月

  function rec(id) {
    var s = State.data.srs;
    if (!s[id]) {
      s[id] = { ef: 2.5, iv: 0, rep: 0, due: State.dayStr(), lap: 0, n: 0 };
    }
    return s[id];
  }

  function has(id) { return !!State.data.srs[id]; }

  /** 記錄一次作答結果，更新下次複習日 */
  function grade(id, q) {
    var r = rec(id);
    r.n = (r.n || 0) + 1;

    if (q <= 0) {
      // 忘了 → 打回重來，當天再排一次
      r.lap = (r.lap || 0) + 1;
      r.rep = 0;
      r.iv = 0;
      r.ef = Math.max(1.3, r.ef - 0.2);
      r.due = State.dayStr();
    } else {
      if (r.rep < FIRST_STEPS.length) {
        r.iv = FIRST_STEPS[r.rep];
      } else {
        r.iv = Math.round(Math.max(1, r.iv) * r.ef);
      }
      if (q === 1) r.iv = Math.max(1, Math.round(r.iv * 0.6));   // 想很久 → 間隔打折
      r.iv = Math.min(MAX_IV, r.iv);
      r.rep++;
      // EF 調整
      r.ef = Math.max(1.3, Math.min(2.8, r.ef + (q === 2 ? 0.06 : -0.08)));
      r.due = State.addDays(State.dayStr(), r.iv);   // iv = 0 代表當天稍後再看一次
    }
    State.save();
    return r;
  }

  /** 到期需要複習的項目 id 清單（依逾期天數排序，逾期最久的先） */
  function dueIds(limit) {
    var today = State.dayStr();
    var s = State.data.srs;
    var out = [];
    for (var id in s) {
      if (!Object.prototype.hasOwnProperty.call(s, id)) continue;
      if (s[id].due <= today) out.push(id);
    }
    out.sort(function (a, b) {
      var d = State.daysBetween(s[b].due, today) - State.daysBetween(s[a].due, today);
      if (d !== 0) return d;
      return (s[a].ef || 2.5) - (s[b].ef || 2.5);   // 難的優先
    });
    return limit ? out.slice(0, limit) : out;
  }

  function dueCount() { return dueIds().length; }

  /** 未來 7 天的到期分布，給統計頁畫圖用 */
  function forecast(days) {
    days = days || 7;
    var out = [];
    var s = State.data.srs;
    for (var d = 0; d < days; d++) {
      var day = State.addDays(State.dayStr(), d);
      var c = 0;
      for (var id in s) {
        if (!Object.prototype.hasOwnProperty.call(s, id)) continue;
        if (d === 0 ? s[id].due <= day : s[id].due === day) c++;
      }
      out.push({ day: day, count: c });
    }
    return out;
  }

  /** 熟練度分級：用來算「已精熟單字數」 */
  function levelOf(id) {
    var r = State.data.srs[id];
    if (!r) return 0;                    // 沒學過
    if (r.iv >= 21) return 3;            // 精熟（間隔超過三週）
    if (r.iv >= 7) return 2;             // 熟悉
    return 1;                            // 學習中
  }

  function stats() {
    var s = State.data.srs;
    var o = { seen: 0, learning: 0, familiar: 0, mastered: 0 };
    for (var id in s) {
      if (!Object.prototype.hasOwnProperty.call(s, id)) continue;
      o.seen++;
      var l = levelOf(id);
      if (l === 3) o.mastered++;
      else if (l === 2) o.familiar++;
      else o.learning++;
    }
    return o;
  }

  /* ---------- 弱點怪獸（答錯的題目） ---------- */
  function weakKey(type, refId) { return type + ':' + refId; }

  function addWeak(type, refId, unitId) {
    var w = State.data.weak;
    var k = weakKey(type, refId);
    for (var i = 0; i < w.length; i++) {
      if (w[i].k === k) { w[i].n++; w[i].at = State.dayStr(); State.save(); return; }
    }
    w.push({ k: k, t: type, r: refId, u: unitId || '', n: 1, at: State.dayStr() });
    State.save();
  }

  function clearWeak(type, refId) {
    var k = weakKey(type, refId);
    var w = State.data.weak;
    for (var i = 0; i < w.length; i++) {
      if (w[i].k === k) { w.splice(i, 1); State.save(); return true; }
    }
    return false;
  }

  function weakList() { return State.data.weak.slice(); }
  function weakCount() { return State.data.weak.length; }

  global.SRS = {
    rec: rec, has: has, grade: grade,
    dueIds: dueIds, dueCount: dueCount, forecast: forecast,
    levelOf: levelOf, stats: stats,
    addWeak: addWeak, clearWeak: clearWeak, weakList: weakList, weakCount: weakCount
  };
})(window);
