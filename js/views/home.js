/* ==========================================================================
   views/home.js — 今日首頁：今天該做什麼，一眼看完
   ========================================================================== */
(function (global) {
  'use strict';

  var esc = UI.esc;
  global.Views = global.Views || {};

  function greeting() {
    var h = new Date().getHours();
    if (h < 5)  return '夜深了，快速練一下就去睡';
    if (h < 11) return '早安';
    if (h < 14) return '午安';
    if (h < 18) return '下午好';
    if (h < 22) return '晚安';
    return '睡前 10 分鐘也算數';
  }

  Views.home = function () {
    var d = State.data;
    var plan = Scheduler.todayPlan();
    var lv = Gamify.levelInfo();
    var pct = plan.pct;
    var name = d.profile.nickname ? '，' + esc(d.profile.nickname) : '';

    var html =
      '<div class="row-between">' +
        '<div><h1 class="mb0">' + greeting() + name + '</h1>' +
        '<p class="muted small">' + todayLine() + '</p></div>' +
      '</div>' +

      /* --- 每日目標 --- */
      '<div class="card ' + (pct >= 1 ? 'card-hl' : '') + '">' +
        '<div class="row-between mb8">' +
          '<div class="card-title mb0">' + (pct >= 1 ? '🎉 今日目標已達成' : '🎯 今日目標') + '</div>' +
          '<div class="small bold">' + d.today.xp + ' / ' + plan.goalXP + ' XP</div>' +
        '</div>' +
        UI.pbar(pct, pct >= 1 ? 'gold' : '') +
        '<div class="row-between mt8 small muted">' +
          '<span>約 ' + Math.round(d.today.min) + ' 分鐘　・　' + d.today.newWords + ' 個新字</span>' +
          '<span>Lv.' + lv.level + '（' + lv.into + '/' + lv.need + '）</span>' +
        '</div>' +
      '</div>' +

      /* --- 今日待辦 --- */
      '<h2 class="mt24">今天的安排</h2>' +
      (plan.items.length
        ? plan.items.map(taskCard).join('')
        : '<div class="empty"><div class="empty-ico">🎊</div><div class="bold">今天全部做完了！</div>' +
          '<p class="muted">明天再來，連續天數就會 +1。</p></div>') +

      /* --- 連續天數 --- */
      streakCard(d) +

      /* --- 學習總覽 --- */
      overviewCard();

    UI.$('#view').innerHTML = html;
  };

  function todayLine() {
    var s = SRS.stats();
    var c = Content.counts();
    return '已學 ' + s.seen + ' / ' + c.vocab + ' 字　・　精熟 ' + s.mastered + ' 字';
  }

  function taskCard(t) {
    return '<button class="card" style="display:block;width:100%;text-align:left" data-nav="' + t.hash + '">' +
      '<div class="row">' +
        '<div style="font-size:2.1rem;line-height:1">' + t.icon + '</div>' +
        '<div class="grow">' +
          '<div class="bold">' + esc(t.title) + '</div>' +
          '<div class="small muted">' + esc(t.desc) + '</div>' +
        '</div>' +
        '<div class="right">' +
          '<div class="tag green">' + esc(t.cta) + '</div>' +
          '<div class="tiny muted mt8">' + esc(t.hint) + '</div>' +
        '</div>' +
      '</div></button>';
  }

  function streakCard(d) {
    var g = d.g;
    var days = ['日', '一', '二', '三', '四', '五', '六'];
    var today = new Date();
    var cells = '';
    for (var i = 6; i >= 0; i--) {
      var dt = new Date(today.getTime() - i * 86400000);
      var key = State.dayStr(dt);
      var studied = key === d.today.day ? d.today.xp > 0 : !!d.hist[key];
      cells += '<div class="bar-col" style="justify-content:center">' +
        '<div style="width:30px;height:30px;border-radius:50%;display:grid;place-items:center;' +
        'background:' + (studied ? 'var(--orange)' : 'var(--border)') + ';color:#fff;font-weight:800">' +
        (studied ? '🔥' : '') + '</div>' +
        '<div class="bar-lab">' + days[dt.getDay()] + '</div></div>';
    }

    return '<div class="card">' +
      '<div class="row-between mb8">' +
        '<div class="card-title mb0">🔥 連續 ' + g.streak + ' 天</div>' +
        '<div class="small muted">最佳 ' + g.bestStreak + ' 天' +
          (g.freeze ? '　🛡️ ×' + g.freeze : '') + '</div>' +
      '</div>' +
      '<div class="row" style="gap:4px">' + cells + '</div>' +
      (g.streak === 0
        ? '<p class="small muted mt8 mb0">今天達成目標就會點燃第一天。</p>'
        : '<p class="small muted mt8 mb0">別讓它熄掉 — ' +
          (Gamify.goalMet() ? '今天已經保住了 ✅' : '今天還沒達標') + '</p>') +
      '</div>';
  }

  function overviewCard() {
    var st = SRS.stats();
    var c = Content.counts();
    var doneUnits = 0;
    for (var k in State.data.units) if (State.data.units[k].s > 0) doneUnits++;

    return '<div class="card">' +
      '<div class="card-title">📚 學習總覽</div>' +
      '<div class="kpi-grid">' +
        '<div class="kpi"><div class="kpi-num text-green">' + st.mastered + '</div><div class="kpi-lab">精熟單字</div></div>' +
        '<div class="kpi"><div class="kpi-num text-blue">' + st.familiar + '</div><div class="kpi-lab">熟悉中</div></div>' +
        '<div class="kpi"><div class="kpi-num text-gold">' + doneUnits + '/' + c.units + '</div><div class="kpi-lab">通關數</div></div>' +
        '<div class="kpi"><div class="kpi-num">' + Math.round(State.data.total.min) + '</div><div class="kpi-lab">累計分鐘</div></div>' +
      '</div>' +
      '<button class="btn btn-ghost btn-block btn-sm mt16" data-nav="#/stats">看完整統計</button>' +
      '</div>';
  }
})(window);
