/* ==========================================================================
   gamify.js — XP、等級、連續天數、寶石、成就
   設計原則：只給獎勵，不砍血。成人自學最大的敵人是「今天不想開」，
   所以所有機制都往「回來就有好事發生」的方向設計。
   ========================================================================== */
(function (global) {
  'use strict';

  /* ---------- 等級曲線：越後面越慢，但永遠看得到下一級 ---------- */
  function xpForLevel(lv) { return Math.round(60 * Math.pow(lv, 1.45)); }

  function levelInfo() {
    var xp = State.data.g.xp;
    var lv = 1, need = xpForLevel(1), acc = 0;
    while (xp >= acc + need && lv < 200) {
      acc += need; lv++; need = xpForLevel(lv);
    }
    return { level: lv, into: xp - acc, need: need, pct: need ? (xp - acc) / need : 0 };
  }

  /* ---------- 加經驗 ---------- */
  function addXP(n, why) {
    if (!n) return;
    if (State.data.g.doubleDay === State.dayStr()) n *= 2;   // 商店買的雙倍 XP
    var before = levelInfo().level;
    State.data.g.xp += n;
    State.data.today.xp += n;
    var after = levelInfo().level;
    State.data.g.lvl = after;
    State.save();
    if (global.UI) UI.refreshChips();
    if (after > before) {
      Sfx.play('levelup');
      UI.modal(
        '<div class="center">' +
        '<div style="font-size:4rem">🎉</div>' +
        '<h2>升級了！Lv.' + after + '</h2>' +
        '<p class="muted">' + (why || '繼續保持這個節奏') + '</p>' +
        '<button class="btn btn-primary btn-lg mt16" data-modal-close>太棒了</button>' +
        '</div>'
      );
    }
  }

  function addGems(n, why) {
    if (!n) return;
    State.data.g.gems += n;
    State.save();
    if (global.UI) {
      UI.refreshChips();
      UI.toast('💎 +' + n + (why ? '　' + why : ''), 'gold');
    }
  }

  function spendGems(n) {
    if (State.data.g.gems < n) return false;
    State.data.g.gems -= n;
    State.save();
    if (global.UI) UI.refreshChips();
    return true;
  }

  /* ---------- 連續天數 ---------- */
  /** 今天達成每日目標時呼叫；同一天只會生效一次 */
  function touchStreak() {
    var g = State.data.g;
    var today = State.dayStr();
    if (g.lastDay === today) return false;

    var gap = g.lastDay ? State.daysBetween(g.lastDay, today) : 1;
    g.streak = (gap === 1 || !g.lastDay) ? g.streak + 1 : 1;
    g.lastDay = today;
    if (g.streak > g.bestStreak) g.bestStreak = g.streak;
    State.save();

    if (global.UI) {
      UI.refreshChips();
      UI.modal(
        '<div class="center">' +
        '<div style="font-size:4.2rem">🔥</div>' +
        '<h2>連續 ' + g.streak + ' 天！</h2>' +
        '<p class="muted">今天的目標達成了。明天再來，火苗就不會熄。</p>' +
        (g.streak === g.bestStreak && g.streak > 1
          ? '<p class="tag gold">個人新紀錄</p>' : '') +
        '<button class="btn btn-primary btn-lg mt16" data-modal-close>繼續</button>' +
        '</div>'
      );
    }

    // 每 7 天送寶石
    if (g.streak % 7 === 0) addGems(Content.rules().gemPerStreak7 || 15, '連續 ' + g.streak + ' 天獎勵');
    check();
    return true;
  }

  /** 每日目標是否已達成 */
  function goalMet() { return State.data.today.xp >= State.goalXP(); }

  /* ---------- 關卡結算 ---------- */
  /**
   * @param {string} unitId
   * @param {number} correct 答對題數
   * @param {number} total   總題數（不含教學卡）
   * @returns {object} 結算結果
   */
  function finishLesson(unitId, correct, total) {
    var R = Content.rules();
    var u = Content.unit(unitId) || {};
    var rate = total > 0 ? correct / total : 0;
    var passed = rate >= R.passRate;

    var stars = 0;
    if (passed) stars = rate >= R.star3 ? 3 : (rate >= R.star2 ? 2 : 1);

    var xp = correct * R.xpPerCorrect + (passed ? R.xpPerLesson : 0);
    if (passed && u.boss) xp += R.xpBossBonus;
    if (stars === 3) xp += R.xpPerfectBonus;

    var gems = 0;
    var rec = State.unit(unitId);
    var firstClear = passed && rec.s === 0;
    if (firstClear) gems = u.boss ? (R.gemPerBoss || 10) : (R.gemPerLesson || 2);

    // 寫進度
    rec.n = (rec.n || 0) + 1;
    rec.best = Math.max(rec.best || 0, rate);
    if (stars > (rec.s || 0)) rec.s = stars;
    if (passed && !rec.at) rec.at = State.dayStr();

    // 皇冠等級：每通關一次 +1（上限 5），代表這一關被刷了幾輪
    var crownUp = false;
    if (passed && (rec.lv || 0) < 5) { rec.lv = (rec.lv || 0) + 1; crownUp = true; }

    State.data.today.lessons++;
    State.data.today.correct += correct;
    State.data.today.total += total;
    State.data.total.correct += correct;
    State.data.total.answered += total;
    State.data.total.lessons++;
    State.save(true);

    addXP(xp);
    if (gems) addGems(gems, firstClear ? '首次通關' : '');

    var streakFired = false;
    if (goalMet()) streakFired = touchStreak();
    check();

    return {
      passed: passed, stars: stars, rate: rate, crown: rec.lv, crownUp: crownUp,
      xp: xp, gems: gems, firstClear: firstClear, streakFired: streakFired
    };
  }

  /* ---------- 護盾 ---------- */
  /**
   * 護盾是靜靜生效的（rollDay 裡扣掉），不講的話使用者根本不知道自己被救了 —
   * 那 40 顆寶石就白花了。回報一次就把計數歸零。
   */
  function noticeShield() {
    var g = State.data.g;
    if (!g.shieldUsedN) return false;
    var n = g.shieldUsedN;
    g.shieldUsedN = 0;
    State.save(true);
    if (global.UI) {
      UI.modal(
        '<div class="center">' +
        '<div style="font-size:4rem">🛡️</div>' +
        '<h2>護盾幫你擋下來了</h2>' +
        '<p class="muted">你有 ' + n + ' 天沒出現，連續 ' + g.streak + ' 天原本會歸零。' +
        '護盾用掉 ' + n + ' 個，還剩 ' + g.freeze + ' 個。</p>' +
        '<p class="small muted">今天達成目標，火苗就會繼續。</p>' +
        '<button class="btn btn-primary btn-lg mt16" data-modal-close>知道了</button>' +
        '</div>'
      );
    }
    return true;
  }

  function buyFreeze(cost) {
    cost = cost || 40;
    if (State.data.g.freeze >= 3) { UI.toast('護盾最多存 3 個', 'bad'); return false; }
    if (!spendGems(cost)) { UI.toast('寶石不夠', 'bad'); return false; }
    State.data.g.freeze++;
    State.save();
    UI.toast('🛡️ 護盾 +1，斷一天也不會歸零', 'good');
    return true;
  }

  /* ---------- 成就 ---------- */
  function has(id) { return !!State.data.ach[id]; }

  function grant(id) {
    if (has(id)) return false;
    var def = (global.DATA_ACHIEVEMENTS || []).filter(function (a) { return a.id === id; })[0];
    State.data.ach[id] = State.dayStr();
    State.save();
    if (def) {
      if (def.gems) addGems(def.gems, '');
      Sfx.play('badge');
      UI.toast(def.icon + ' 解鎖成就：' + def.name, 'gold', 3200);
    }
    return true;
  }

  /** 掃描所有成就條件，該給的就給 */
  function check() {
    var list = global.DATA_ACHIEVEMENTS || [];
    var ctx = buildCtx();
    for (var i = 0; i < list.length; i++) {
      var a = list[i];
      if (has(a.id)) continue;
      try { if (a.test(ctx)) grant(a.id); } catch (e) { /* 條件寫錯不該擋住學習 */ }
    }
  }

  function buildCtx() {
    var d = State.data;
    var s = SRS.stats();
    var unitsDone = 0, stars = 0, perfect = 0;
    for (var k in d.units) {
      if (!Object.prototype.hasOwnProperty.call(d.units, k)) continue;
      if (d.units[k].s > 0) unitsDone++;
      stars += d.units[k].s || 0;
      if (d.units[k].s === 3) perfect++;
    }
    return {
      d: d, srs: s,
      unitsDone: unitsDone, stars: stars, perfectUnits: perfect,
      streak: d.g.streak, bestStreak: d.g.bestStreak,
      level: levelInfo().level, xp: d.g.xp,
      totalMin: d.total.min, totalAnswered: d.total.answered,
      accuracy: d.total.answered ? d.total.correct / d.total.answered : 0,
      daysStudied: Object.keys(d.hist).length + (d.today.xp > 0 ? 1 : 0)
    };
  }

  function earned() {
    return (global.DATA_ACHIEVEMENTS || []).map(function (a) {
      return { def: a, got: State.data.ach[a.id] || null };
    });
  }

  global.Gamify = {
    xpForLevel: xpForLevel, levelInfo: levelInfo,
    addXP: addXP, addGems: addGems, spendGems: spendGems,
    touchStreak: touchStreak, goalMet: goalMet,
    finishLesson: finishLesson, buyFreeze: buyFreeze, noticeShield: noticeShield,
    has: has, grant: grant, check: check, earned: earned
  };

  /* ==========================================================================
     Sfx — 用 WebAudio 直接合成音效，不需要任何音檔（維持單資料夾可攜）
     ========================================================================== */
  var actx = null;
  function ac() {
    if (!actx) {
      var C = global.AudioContext || global.webkitAudioContext;
      if (!C) return null;
      actx = new C();
    }
    if (actx.state === 'suspended') actx.resume();
    return actx;
  }

  function tone(freq, start, dur, type, vol) {
    var a = ac(); if (!a) return;
    var o = a.createOscillator(), g = a.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, a.currentTime + start);
    g.gain.setValueAtTime(0.0001, a.currentTime + start);
    g.gain.exponentialRampToValueAtTime(vol || 0.16, a.currentTime + start + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + start + dur);
    o.connect(g); g.connect(a.destination);
    o.start(a.currentTime + start);
    o.stop(a.currentTime + start + dur + 0.02);
  }

  var Sfx = {
    play: function (name) {
      if (!State.data.profile.sound) return;
      try {
        switch (name) {
          case 'correct': tone(660, 0, .12, 'triangle'); tone(880, .09, .16, 'triangle'); break;
          case 'wrong':   tone(190, 0, .18, 'sawtooth', .10); break;
          case 'click':   tone(520, 0, .05, 'sine', .07); break;
          case 'levelup': [523, 659, 784, 1047].forEach(function (f, i) { tone(f, i * .09, .22, 'triangle'); }); break;
          case 'badge':   [784, 988, 1319].forEach(function (f, i) { tone(f, i * .08, .25, 'sine'); }); break;
          case 'finish':  [523, 659, 784].forEach(function (f, i) { tone(f, i * .11, .3, 'sine'); }); break;
        }
      } catch (e) { /* 音效失敗不影響學習 */ }
    }
  };
  global.Sfx = Sfx;

})(window);
