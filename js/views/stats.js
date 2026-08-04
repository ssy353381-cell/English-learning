/* ==========================================================================
   views/stats.js — 統計與成就：跟過去的自己比
   ========================================================================== */
(function (global) {
  'use strict';

  var esc = UI.esc;
  global.Views = global.Views || {};

  Views.stats = function () {
    var d = State.data;
    var lv = Gamify.levelInfo();
    var st = SRS.stats();

    UI.$('#view').innerHTML =
      '<h1>學習統計</h1>' +

      /* 等級 */
      '<div class="card">' +
        '<div class="row-between mb8">' +
          '<div><div class="card-title mb0">⚡ Lv.' + lv.level + '</div>' +
          '<div class="small muted">總經驗 ' + d.g.xp + ' XP</div></div>' +
          '<div class="right small muted">再 ' + (lv.need - lv.into) + ' XP 升級</div>' +
        '</div>' +
        UI.pbar(lv.pct, 'gold') +
      '</div>' +

      /* 核心數字 */
      '<div class="kpi-grid mb16">' +
        '<div class="kpi"><div class="kpi-num" style="color:var(--orange)">' + d.g.streak + '</div><div class="kpi-lab">連續天數</div></div>' +
        '<div class="kpi"><div class="kpi-num text-green">' + st.mastered + '</div><div class="kpi-lab">精熟單字</div></div>' +
        '<div class="kpi"><div class="kpi-num text-blue">' + Math.round(d.total.min) + '</div><div class="kpi-lab">累計分鐘</div></div>' +
        '<div class="kpi"><div class="kpi-num">' + accPct(d) + '%</div><div class="kpi-lab">總正確率</div></div>' +
      '</div>' +

      week14() +
      compareCard() +
      toeicEstimate() +
      achievementsCard();
  };

  function accPct(d) {
    return d.total.answered ? Math.round(d.total.correct / d.total.answered * 100) : 0;
  }

  /* ---------- 近 14 天 XP ---------- */
  function week14() {
    var d = State.data;
    var days = [], max = 1;
    for (var i = 13; i >= 0; i--) {
      var key = State.addDays(d.today.day, -i);
      var xp = key === d.today.day ? d.today.xp : ((d.hist[key] && d.hist[key].xp) || 0);
      max = Math.max(max, xp);
      days.push({ key: key, xp: xp, today: i === 0 });
    }
    var goal = State.goalXP();
    var bars = days.map(function (x) {
      return '<div class="bar-col" title="' + x.key + '：' + x.xp + ' XP">' +
        '<div class="bar ' + (x.today ? 'today' : '') + '" style="height:' +
          Math.round(x.xp / max * 100) + '%"></div>' +
        '<div class="bar-lab">' + x.key.slice(8) + '</div></div>';
    }).join('');

    var hit = days.filter(function (x) { return x.xp >= goal; }).length;

    return '<div class="card">' +
      '<div class="row-between mb8"><div class="card-title mb0">📈 近 14 天</div>' +
      '<span class="small muted">達標 ' + hit + ' / 14 天</span></div>' +
      '<div class="bars">' + bars + '</div>' +
      '</div>';
  }

  /* ---------- 跟上週的自己比 ---------- */
  function compareCard() {
    var d = State.data;
    function sum(fromIdx, toIdx) {
      var o = { xp: 0, min: 0, c: 0, t: 0, days: 0 };
      for (var i = fromIdx; i <= toIdx; i++) {
        var key = State.addDays(d.today.day, -i);
        var h = key === d.today.day
          ? { xp: d.today.xp, min: d.today.min, c: d.today.correct, t: d.today.total }
          : d.hist[key];
        if (!h) continue;
        o.xp += h.xp || 0; o.min += h.min || 0; o.c += h.c || 0; o.t += h.t || 0;
        if ((h.xp || 0) > 0) o.days++;
      }
      return o;
    }
    var thisW = sum(0, 6), lastW = sum(7, 13);

    function delta(a, b, unit) {
      var diff = a - b;
      if (!b && !a) return '<span class="muted">—</span>';
      var sign = diff > 0 ? '▲' : (diff < 0 ? '▼' : '＝');
      var cls = diff > 0 ? 'text-green' : (diff < 0 ? 'text-red' : 'muted');
      return '<span class="' + cls + ' bold">' + sign + ' ' + Math.abs(Math.round(diff)) + (unit || '') + '</span>';
    }

    return '<div class="card">' +
      '<div class="card-title">🪞 跟上週的自己比</div>' +
      '<table class="tbl"><tbody>' +
      '<tr><td>學習天數</td><td class="right bold">' + thisW.days + ' 天</td><td class="right">' + delta(thisW.days, lastW.days, ' 天') + '</td></tr>' +
      '<tr><td>累計 XP</td><td class="right bold">' + thisW.xp + '</td><td class="right">' + delta(thisW.xp, lastW.xp) + '</td></tr>' +
      '<tr><td>學習時間</td><td class="right bold">' + Math.round(thisW.min) + ' 分</td><td class="right">' + delta(thisW.min, lastW.min, ' 分') + '</td></tr>' +
      '<tr><td>正確率</td><td class="right bold">' + (thisW.t ? Math.round(thisW.c / thisW.t * 100) : 0) + '%</td>' +
        '<td class="right">' + delta(thisW.t ? thisW.c / thisW.t * 100 : 0, lastW.t ? lastW.c / lastW.t * 100 : 0, '%') + '</td></tr>' +
      '</tbody></table>' +
      '<p class="small muted mt8 mb0">沒有排行榜，因為單機學習真正的對手只有上禮拜的你。</p>' +
      '</div>';
  }

  /* ---------- 粗略的多益落點 ---------- */
  function toeicEstimate() {
    var st = SRS.stats();
    var known = st.mastered + st.familiar * 0.6 + st.learning * 0.25;
    var acc = State.data.total.answered ? State.data.total.correct / State.data.total.answered : 0;

    // 非常粗略的估算：字彙量是主軸，正確率做微調。只當作方向感，不是預測分數。
    var base = 150 + known * 0.42;
    var est = Math.round(Math.min(990, base * (0.85 + acc * 0.3)) / 5) * 5;
    if (known < 30) est = null;

    var stages = [
      { s: 0, t: '開口第一步', to: 250 },
      { s: 1, t: '日常生存', to: 450 },
      { s: 2, t: '生活溝通', to: 600 },
      { s: 3, t: '職場基礎', to: 750 },
      { s: 4, t: '多益核心', to: 860 },
      { s: 5, t: '高分衝刺', to: 950 },
      { s: 6, t: '滿分狙擊', to: 990 }
    ];
    var rows = stages.map(function (x) {
      var reached = est != null && est >= x.to;
      return '<div class="list-row"><span style="font-size:1.1rem">' + (reached ? '✅' : '⬜') + '</span>' +
        '<div class="grow"><span class="bold">Stage ' + x.s + '　' + x.t + '</span></div>' +
        '<span class="tag ' + (reached ? 'green' : '') + '">~' + x.to + '</span></div>';
    }).join('');

    return '<div class="card">' +
      '<div class="card-title">🎯 目前的落點（粗估）</div>' +
      (est == null
        ? '<p class="muted">再多學一些單字，這裡就會出現估算值。</p>'
        : '<div class="center"><div class="huge text-blue">' + est + '</div>' +
          '<div class="small muted">依已精熟字彙量與整體正確率推算</div></div>') +
      '<div class="mt16">' + rows + '</div>' +
      '<div class="warn-box mt16">這只是「方向感」，不是模考成績。真正的分數要靠完整的計時模考，' +
      '那會在 Stage 5 出現。到 990 大約需要 2–4 年，重點是每天都打開它。</div>' +
      '</div>';
  }

  /* ---------- 成就 ---------- */
  function achievementsCard() {
    var list = Gamify.earned();
    var got = list.filter(function (x) { return x.got; }).length;
    var cells = list.map(function (x) {
      return '<div class="badge ' + (x.got ? 'got' : 'locked') + '" title="' + esc(x.def.desc) + '">' +
        '<div class="badge-ico">' + x.def.icon + '</div>' +
        '<div class="badge-name">' + esc(x.def.name) + '</div>' +
        (x.got ? '<div class="tiny faint">' + x.got.slice(5) + '</div>' : '') +
        '</div>';
    }).join('');

    return '<div class="card">' +
      '<div class="row-between mb8"><div class="card-title mb0">🏅 成就</div>' +
      '<span class="small muted">' + got + ' / ' + list.length + '</span></div>' +
      '<div class="badges">' + cells + '</div></div>';
  }
})(window);
