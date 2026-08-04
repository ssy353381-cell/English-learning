/* ==========================================================================
   views/map.js — 關卡地圖（蜿蜒路徑，一格一格解鎖）
   ========================================================================== */
(function (global) {
  'use strict';

  var esc = UI.esc;
  global.Views = global.Views || {};

  Views.map = function () {
    var cur = Content.currentUnitId();
    var html = '<h1>學習地圖</h1>' +
      '<p class="muted">從 26 個字母到多益 990。一次只要打好眼前這一關。</p>' +
      overallBar();

    Content.stages().forEach(function (st) {
      html += stageBlock(st, cur);
    });

    html += '<div class="card mt24 center">' +
      '<div class="big">🏁</div><div class="bold">Stage 2–6 的內容陸續補上中</div>' +
      '<p class="small muted mb0">地圖與遊戲機制已經完成，先把 Stage 0–1 打穿，' +
      '後面的關卡會直接接上去，進度不會流失。</p></div>';

    UI.$('#view').innerHTML = html;

    // 捲到目前的關卡
    setTimeout(function () {
      var node = UI.$('[data-unit="' + cur + '"]');
      if (node) node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
  };

  function overallBar() {
    var ids = Content.orderedUnitIds().filter(Content.isReady);
    var done = ids.filter(State.isUnitDone).length;
    var s = SRS.stats();
    var c = Content.counts();
    return '<div class="card">' +
      '<div class="row-between mb8"><span class="bold">總進度</span>' +
      '<span class="small muted">' + done + ' / ' + ids.length + ' 關　・　' +
      s.seen + ' / ' + c.vocab + ' 字</span></div>' +
      UI.pbar(ids.length ? done / ids.length : 0) + '</div>';
  }

  function stageBlock(st, cur) {
    var ids = st.units.map(function (u) { return u.id; });
    var done = ids.filter(State.isUnitDone).length;
    var open = st.ready;

    var html = '<div class="stage-header ' + (open ? '' : 'locked') + '" ' +
      'style="' + (open ? 'background:var(--' + st.color + ')' : '') + '">' +
      '<div><div class="stage-sub">STAGE ' + st.n + '　' + esc(st.level) + '</div>' +
        '<h2>' + st.icon + ' ' + esc(st.name) + '</h2>' +
        '<div class="stage-sub">' + esc(st.sub) + '</div></div>' +
      '<div class="right"><div class="bold">' + done + '/' + ids.length + '</div>' +
        (open ? '' : '<div class="stage-sub">製作中</div>') + '</div>' +
      '</div>';

    if (st.desc) html += '<p class="small muted">' + esc(st.desc) + '</p>';

    html += '<div class="path">';
    st.units.forEach(function (u, i) {
      html += '<div class="path-row" data-off="' + (i % 8) + '">' + nodeHTML(u, cur) + '</div>';
    });
    html += '</div>';
    return html;
  }

  function nodeHTML(u, cur) {
    var ready = Content.isReady(u.id);
    var unlocked = ready && Content.isUnlocked(u.id);
    var rec = State.data.units[u.id];
    var doneN = rec && rec.s > 0;
    var isCur = u.id === cur;

    var cls = 'node';
    if (u.boss) cls += ' boss';
    if (doneN) cls += ' done';
    else if (isCur && unlocked) cls += ' current';
    if (!unlocked) cls += ' locked';
    // 階段可以分批開放，所以同一個階段裡「還沒解鎖」和「根本還沒做」會並存。
    // 兩者都畫成鎖頭的話，使用者會一路練上去撞牆卻不知道是撞到什麼。
    if (!ready) cls += ' wip';

    var crown = rec && rec.lv ? '<span class="node-crown">' +
      (rec.lv >= 5 ? '👑' : '⭐'.repeat(Math.min(3, rec.s || 1))) + '</span>' : '';

    var unseen = ready ? Scheduler.unseenOf(u.id).length : 0;
    var vocabTotal = ready ? Content.vocabOf(u.id).length : 0;
    var learned = vocabTotal - unseen;

    return '<button class="' + cls + '" data-unit="' + u.id + '" ' +
      (unlocked ? '' : 'disabled ') +
      'title="' + esc(u.title) + (ready ? '' : '（製作中）') + '">' +
      (unlocked ? (u.icon || '📘') : (ready ? '🔒' : '🚧')) + crown +
      '<span class="node-label">' + u.n + '. ' + esc(shortTitle(u.title)) +
      (vocabTotal && unlocked ? '　<span class="tiny faint">' + learned + '/' + vocabTotal + '字</span>' : '') +
      '</span>' +
      (isCur && unlocked ? '<span class="node-here">從這裡開始</span>' : '') +
      '</button>';
  }

  function shortTitle(t) {
    return t.length > 12 ? t.slice(0, 11) + '…' : t;
  }

  /* ---------- 點關卡 → 顯示說明卡 ---------- */
  document.addEventListener('click', function (e) {
    var n = e.target.closest ? e.target.closest('[data-unit]') : null;
    if (!n || n.disabled) return;
    var id = n.getAttribute('data-unit');
    var u = Content.unit(id);
    if (!u) return;

    var rec = State.data.units[id] || { s: 0, lv: 0, best: 0 };
    var unseen = Scheduler.unseenOf(id).length;
    var total = Content.vocabOf(id).length;
    var st = Content.stageOf(id);

    UI.modal(
      '<div class="center">' +
        '<div style="font-size:3rem">' + (u.icon || '📘') + '</div>' +
        '<div class="tag ' + (u.boss ? 'gold' : 'blue') + '">' +
          (u.boss ? '👑 魔王關' : st.name) + '</div>' +
        '<h2 class="mt8">第 ' + u.n + ' 關　' + esc(u.title) + '</h2>' +
        (u.goal ? '<p class="muted">' + esc(u.goal) + '</p>' : '') +
        (rec.s ? '<div style="font-size:1.5rem;letter-spacing:3px">' + UI.stars(rec.s) + '</div>' +
          '<p class="small muted">最佳成績 ' + Math.round(rec.best * 100) + '%　・　皇冠 Lv.' + (rec.lv || 0) + '</p>' : '') +
        (total ? '<div class="mt8">' + UI.pbar((total - unseen) / total) +
          '<div class="small muted mt8">單字 ' + (total - unseen) + ' / ' + total +
          (unseen ? '　（這次會教 ' + Math.min(unseen, planCount(u)) + ' 個新字）' : '　新字已學完') +
          '</div></div>' : '') +
        '<button class="btn btn-primary btn-lg mt16" id="go">' +
          (rec.s ? '再打一次' : '開始這一關') + '</button>' +
      '</div>'
    );
    UI.$('#go').onclick = function () { UI.closeModal(); location.hash = '#/lesson/' + id; };
  });

  function planCount(u) {
    var n = 0;
    (u.plan || []).forEach(function (p) { if (p[0] === 'flashcard') n = p[1]; });
    return n;
  }
})(window);
