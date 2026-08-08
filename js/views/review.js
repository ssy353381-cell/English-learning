/* ==========================================================================
   views/review.js — 複習中心：到期單字、弱點怪獸、單字庫瀏覽
   ========================================================================== */
(function (global) {
  'use strict';

  var esc = UI.esc;
  global.Views = global.Views || {};

  /* 弱點怪獸的型別名稱。新增型別時這裡要一起加 —— 對不到就直接把
     part6、respond 這種內部代號印在畫面上。 */
  var WEAK_LABEL = {
    vocab: '單字', grammar: '文法', reading: '閱讀', irregular: '動詞三態',
    photo: 'Part 1 看圖', respond: 'Part 2 應答', phoneme: '最小音對',
    convo: 'Part 3／4 對話', part6: 'Part 6 填空', part7: 'Part 7 雙篇'
  };

  var tab = 'due';

  Views.review = function (params) {
    if (params && params.weak) tab = 'weak';
    render();
  };

  function render() {
    var due = SRS.dueIds();
    var weak = SRS.weakList();
    var st = SRS.stats();

    var html =
      '<h1>複習</h1>' +
      '<p class="muted">背單字唯一有效的方法，是在快忘掉的那一刻剛好複習到。</p>' +

      '<div class="kpi-grid mb16">' +
        '<div class="kpi"><div class="kpi-num text-red">' + due.length + '</div><div class="kpi-lab">今天到期</div></div>' +
        '<div class="kpi"><div class="kpi-num" style="color:var(--purple)">' + weak.length + '</div><div class="kpi-lab">弱點怪獸</div></div>' +
        '<div class="kpi"><div class="kpi-num text-green">' + st.mastered + '</div><div class="kpi-lab">已精熟</div></div>' +
        '<div class="kpi"><div class="kpi-num text-blue">' + st.seen + '</div><div class="kpi-lab">學過總數</div></div>' +
      '</div>' +

      (due.length
        ? '<button class="btn btn-primary btn-lg mb16" data-nav="#/lesson/review">開始複習 ' +
          Math.min(due.length, 20) + ' 個字</button>'
        : '<div class="card card-hl center"><span class="big">✨</span>' +
          '<div class="bold">今天沒有到期的單字</div>' +
          '<p class="small muted mb0">這是好事，代表排程正常運作。去打新關卡吧。</p></div>') +

      '<div class="seg mt16 mb16">' +
        '<button data-tab="due"  class="' + (tab === 'due' ? 'on' : '') + '">📅 排程</button>' +
        '<button data-tab="weak" class="' + (tab === 'weak' ? 'on' : '') + '">👾 怪獸</button>' +
        '<button data-tab="all"  class="' + (tab === 'all' ? 'on' : '') + '">📔 單字庫</button>' +
      '</div>' +
      '<div id="tabbody"></div>';

    UI.$('#view').innerHTML = html;
    UI.$$('[data-tab]').forEach(function (b) {
      b.onclick = function () { tab = b.getAttribute('data-tab'); render(); };
    });
    renderTab();
  }

  function renderTab() {
    var body = UI.$('#tabbody');
    if (tab === 'due') body.innerHTML = forecastHTML();
    else if (tab === 'weak') body.innerHTML = weakHTML();
    else body.innerHTML = allHTML();
  }

  /* ---------- 排程預測 ---------- */
  function forecastHTML() {
    var f = SRS.forecast(7);
    var max = Math.max.apply(null, f.map(function (x) { return x.count; }).concat([1]));
    var days = ['日', '一', '二', '三', '四', '五', '六'];

    var bars = f.map(function (x, i) {
      var p = x.count / max;
      var dt = x.day.split('-');
      var wd = new Date(+dt[0], +dt[1] - 1, +dt[2]).getDay();
      return '<div class="bar-col">' +
        '<div class="bar-lab">' + x.count + '</div>' +
        '<div class="bar ' + (i === 0 ? 'today' : '') + '" style="height:' + Math.round(p * 100) + '%"></div>' +
        '<div class="bar-lab">' + (i === 0 ? '今天' : days[wd]) + '</div></div>';
    }).join('');

    var st = SRS.stats();
    return '<div class="card">' +
      '<div class="card-title">📅 未來 7 天的複習量</div>' +
      '<div class="bars">' + bars + '</div>' +
      '<p class="small muted mt16 mb0">複習量會自己平衡：答對的字間隔會越拉越長，' +
      '答錯的會被拉回來。每天照做就好，不用自己排。</p>' +
      '</div>' +

      '<div class="card">' +
        '<div class="card-title">🧠 記憶狀態分布</div>' +
        levelBar('學習中', st.learning, 'var(--red)') +
        levelBar('熟悉（間隔 ≥ 7 天）', st.familiar, 'var(--blue)') +
        levelBar('精熟（間隔 ≥ 21 天）', st.mastered, 'var(--green)') +
      '</div>';
  }

  function levelBar(label, n, color) {
    var total = Math.max(1, SRS.stats().seen);
    return '<div class="mb8"><div class="row-between small"><span>' + label + '</span>' +
      '<span class="bold">' + n + '</span></div>' +
      '<div class="pbar pbar-sm"><div class="pbar-fill" style="width:' +
      Math.round(n / total * 100) + '%;background:' + color + '"></div></div></div>';
  }

  /* ---------- 弱點怪獸 ---------- */
  function weakHTML() {
    var list = SRS.weakList();
    if (!list.length) {
      return '<div class="empty"><div class="empty-ico">🛡️</div>' +
        '<div class="bold">目前沒有怪獸</div>' +
        '<p class="muted">答錯的題目會變成怪獸住在這裡，答對就消滅。</p></div>';
    }
    var rows = list.sort(function (a, b) { return b.n - a.n; }).map(function (w) {
      var it = Content.item(w.r);
      var word = it && (it.w || it.v);
      var label = it ? (word || it.title || it.id) : w.r;
      var sub = it
        ? (it.v ? it.v + ' → ' + it.p + ' → ' + it.pp
                : (it.zh || (it.title ? '閱讀理解' : '文法題')))
        : '';
      // 八種怪獸都要有中文名字 —— 對不到的話畫面上會直接印出 part6 這種內部代號
      var typeTag = WEAK_LABEL[w.t] || w.t;
      return '<div class="list-row">' +
        (word ? Speech.btn(word) : '<span style="font-size:1.4rem">👾</span>') +
        '<div class="grow"><div class="sentence-en">' + esc(label) + '</div>' +
        '<div class="sentence-zh">' + esc(sub) + '</div></div>' +
        '<div class="right"><span class="tag red">錯 ' + w.n + ' 次</span>' +
        '<div class="tiny muted mt8">' + typeTag + '</div></div></div>';
    }).join('');

    return '<div class="card">' +
      '<div class="card-title">👾 弱點怪獸 ' + list.length + ' 隻</div>' +
      '<p class="small muted">下次複習或打關卡時會優先出現，答對就消滅。</p>' +
      rows + '</div>' +
      '<button class="btn btn-purple btn-lg" data-nav="#/lesson/review">去打怪</button>';
  }

  /* ---------- 單字庫 ---------- */
  var filterUnit = 'all';

  function allHTML() {
    var units = Content.orderedUnitIds().filter(Content.isReady);
    var opts = '<option value="all">全部關卡</option>' + units.map(function (id) {
      var u = Content.unit(id);
      return '<option value="' + id + '"' + (filterUnit === id ? ' selected' : '') + '>' +
        u.n + '. ' + esc(u.title) + '</option>';
    }).join('');

    var list = filterUnit === 'all' ? Content.allVocab() : Content.vocabOf(filterUnit);

    var rows = list.map(function (v) {
      var lvl = SRS.levelOf(v.id);
      var mark = ['⚪', '🔴', '🔵', '🟢'][lvl];
      var r = State.data.srs[v.id];
      return '<div class="list-row">' + Speech.btn(v.w) +
        '<div class="grow"><div class="sentence-en">' + (v.ic ? v.ic + ' ' : '') + esc(v.w) +
        (State.data.profile.showKK && v.kk ? ' <span class="word-kk">[' + esc(v.kk) + ']</span>' : '') + '</div>' +
        '<div class="sentence-zh"><span class="word-pos">' + esc(v.pos) + '</span>' + esc(v.zh) + '</div></div>' +
        '<div class="right"><div>' + mark + '</div>' +
        '<div class="tiny muted">' + (r ? '下次 ' + r.due.slice(5) : '未學') + '</div></div></div>';
    }).join('');

    return '<div class="card">' +
      '<div class="row-between mb8"><div class="card-title mb0">📔 單字庫（' + list.length + '）</div>' +
      '<select id="ufilter" class="btn btn-sm btn-ghost">' + opts + '</select></div>' +
      '<p class="small muted">⚪未學　🔴學習中　🔵熟悉　🟢精熟</p>' +
      rows + '</div>';
  }

  document.addEventListener('change', function (e) {
    if (e.target && e.target.id === 'ufilter') {
      filterUnit = e.target.value;
      renderTab();
    }
  });
})(window);
