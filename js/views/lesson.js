/* ==========================================================================
   views/lesson.js — 關卡執行器
   負責：跑題目佇列、批改列、答錯重排、結算畫面
   ========================================================================== */
(function (global) {
  'use strict';

  var esc = UI.esc;
  global.Views = global.Views || {};

  var session = null;

  function bestStars(unitId) {
    var r = State.data.units[unitId];
    return (r && r.s) || 0;
  }

  /* ==========================================================================
     進入關卡
     mode: 'unit' | 'review' | 'challenge'
     ========================================================================== */
  function start(mode, unitId, opts) {
    opts = opts || {};
    var queue, title, sub;

    if (mode === 'challenge') {
      queue = Scheduler.buildChallenge();
      if (!queue || !queue.length) {
        UI.toast('先學一些單字再來挑戰吧', 'bad');
        location.hash = '#/home';
        return;
      }
      title = '每日挑戰';
      sub = '隨機小考';
    } else if (mode === 'review') {
      queue = Scheduler.buildReview(opts.limit || 20);
      if (!queue.length) {
        renderNothingToReview();
        return;
      }
      title = '複習';
      sub = '間隔重複';
    } else {
      var u = Content.unit(unitId);
      if (!u || !Content.isReady(unitId)) {
        UI.toast('這一關的內容還在製作中', 'bad');
        location.hash = '#/map';
        return;
      }
      if (!Content.isUnlocked(unitId)) {
        UI.toast('先過前一關才會解鎖喔', 'bad');
        location.hash = '#/map';
        return;
      }
      queue = Scheduler.buildLesson(unitId);
      title = '第 ' + u.n + ' 關　' + u.title;
      sub = u.goal || '';
    }

    session = {
      mode: mode, unitId: unitId, queue: queue, idx: 0,
      correct: 0, total: 0, missed: [], startedAt: Date.now(),
      title: title, sub: sub, cleanup: []
    };

    document.body.classList.add('in-lesson');
    renderShell();
    runCurrent();
  }

  /* ---------- 外殼 ---------- */
  function renderShell() {
    var view = UI.$('#view');
    view.innerHTML =
      '<div class="lesson-top">' +
        '<button class="lesson-quit" id="quit" aria-label="離開">✕</button>' +
        UI.pbar(0) +
        '<span class="small bold muted" id="qcount"></span>' +
      '</div>' +
      '<div class="q-body" id="q-host"></div>' +
      '<div class="checkbar" id="checkbar"></div>';

    UI.$('#quit').onclick = quitConfirm;
  }

  function quitConfirm() {
    if (session && session.total === 0) { exit(); return; }
    UI.confirm('要離開嗎？', '這一關的進度不會保留，但已經記住的單字會留在複習排程裡。',
      '離開', exit, true);
  }

  function exit() {
    cleanup();
    document.body.classList.remove('in-lesson');
    var back = session && session.mode === 'unit' ? '#/map' : '#/home';
    session = null;
    location.hash = back;
  }

  function cleanup() {
    if (!session) return;
    session.cleanup.forEach(function (fn) { try { fn(); } catch (e) {} });
    session.cleanup = [];
    Speech.stop();
  }

  /* ---------- 進度 ---------- */
  function updateProgress() {
    var fill = UI.$('#view .pbar-fill');
    if (fill) fill.style.width = Math.round(session.idx / Math.max(1, session.queue.length) * 100) + '%';
    var c = UI.$('#qcount');
    if (c) c.textContent = Math.min(session.idx + 1, session.queue.length) + '/' + session.queue.length;
  }

  /* ==========================================================================
     跑一題
     ========================================================================== */
  function runCurrent() {
    cleanup();
    if (!session) return;

    if (session.idx >= session.queue.length) { finish(); return; }

    var q = session.queue[session.idx];
    var mod = Ex[q.type];
    if (!mod) {
      console.warn('未知題型：' + q.type);
      session.idx++;
      runCurrent();
      return;
    }

    updateProgress();
    var host = UI.$('#q-host');
    host.innerHTML = '';
    host.classList.remove('anim-shake');

    var bar = UI.$('#checkbar');
    bar.className = 'checkbar';
    bar.innerHTML = '';

    var checkFn = null;
    var answered = false;

    var api = {
      q: q,

      ready: function (fn) {
        checkFn = fn;
        bar.innerHTML = '<button class="btn btn-primary btn-lg" id="checkbtn" disabled>檢查</button>';
        UI.$('#checkbtn').onclick = api.submit;
      },

      enableCheck: function (on) {
        var b = UI.$('#checkbtn');
        if (b) b.disabled = !on;
      },

      submit: function () {
        if (answered || !checkFn) return;
        var b = UI.$('#checkbtn');
        if (b && b.disabled) return;
        checkFn();
      },

      setContinue: function (text) {
        bar.innerHTML = '<button class="btn btn-primary btn-lg" id="contbtn">' + esc(text || '繼續') + '</button>';
        UI.$('#contbtn').onclick = function () { api.next(); };
      },

      result: function (ok, o) {
        if (answered) return;
        answered = true;
        o = o || {};

        var c = o.correct != null ? o.correct : (ok ? 1 : 0);
        var t = o.total != null ? o.total : 1;

        if (!q.retry && !o.neutral) {
          session.correct += c;
          session.total += t;
        }

        if (!ok) {
          if (!o.neutral) {
            session.missed.push(q);
            // 答錯的題排到最後再問一次（同一題最多重來一次）
            if (!q.retry) {
              var copy = {};
              for (var k in q) copy[k] = q[k];
              copy.retry = true;
              session.queue.push(copy);
            }
          }
          host.classList.add('anim-shake');
          Sfx.play('wrong');
        } else {
          Sfx.play('correct');
        }

        bar.className = 'checkbar ' + (o.neutral ? '' : (ok ? 'ok' : 'no'));
        bar.innerHTML =
          '<div class="check-msg ' + (ok ? 'text-green' : 'text-red') + '">' +
            '<span class="ico">' + (o.neutral ? '➡️' : (ok ? '✅' : '❌')) + '</span>' +
            '<span>' + (o.title || (ok ? '正確' : '再看一次')) + '</span>' +
          '</div>' +
          (o.detail ? '<div class="mb8">' + o.detail + '</div>' : '') +
          '<button class="btn ' + (ok ? 'btn-primary' : 'btn-danger') + ' btn-lg" id="contbtn">繼續</button>';
        UI.$('#contbtn').onclick = function () { api.next(); };
        UI.$('#contbtn').focus();
      },

      next: function () {
        session.idx++;
        runCurrent();
      },

      onCleanup: function (fn) { session.cleanup.push(fn); }
    };

    // Enter 鍵送出 / 繼續
    function onEnter(e) {
      if (e.key !== 'Enter') return;
      if (e.target && e.target.tagName === 'TEXTAREA' && !e.ctrlKey) return;
      var cont = UI.$('#contbtn');
      if (cont) { e.preventDefault(); cont.click(); return; }
      var chk = UI.$('#checkbtn');
      if (chk && !chk.disabled) { e.preventDefault(); api.submit(); }
    }
    document.addEventListener('keydown', onEnter);
    api.onCleanup(function () { document.removeEventListener('keydown', onEnter); });

    try {
      mod.render(q, host, api);
    } catch (err) {
      console.error('題目渲染失敗', q, err);
      host.innerHTML = '<div class="warn-box">這一題出了點問題，先跳過。</div>';
      api.setContinue('繼續');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    State.markActive();
  }

  /* ==========================================================================
     結算
     ========================================================================== */
  function finish() {
    cleanup();
    Sfx.play('finish');
    var s = session;
    var rate = s.total ? s.correct / s.total : 1;
    var mins = Math.max(1, Math.round((Date.now() - s.startedAt) / 60000));

    var res;
    if (s.mode === 'unit') {
      res = Gamify.finishLesson(s.unitId, s.correct, s.total);
    } else {
      // 複習與挑戰：直接給 XP，不動關卡星等
      var xp = s.correct * 3 + (s.mode === 'challenge' ? 15 : 8);
      State.data.today.correct += s.correct;
      State.data.today.total += s.total;
      State.data.total.correct += s.correct;
      State.data.total.answered += s.total;
      if (s.mode === 'challenge') {
        State.data.today.challenge = true;
        Gamify.addGems(3, '完成每日挑戰');
      }
      State.save(true);
      Gamify.addXP(xp);
      res = { passed: rate >= 0.6, stars: 0, rate: rate, xp: xp, gems: 0 };
      if (Gamify.goalMet()) res.streakFired = Gamify.touchStreak();
      Gamify.check();
    }

    document.body.classList.remove('in-lesson');

    var u = s.mode === 'unit' ? Content.unit(s.unitId) : null;
    var view = UI.$('#view');

    view.innerHTML =
      '<div class="center mt24 anim-pop">' +
        '<div style="font-size:4.4rem">' + (res.passed ? (res.stars === 3 ? '🏆' : '🎉') : '💪') + '</div>' +
        '<h1>' + (res.passed ? '過關！' : '再挑戰一次') + '</h1>' +
        (s.mode === 'unit'
          ? '<div style="font-size:1.8rem;letter-spacing:4px">' + UI.stars(res.stars) + '</div>' +
            (bestStars(s.unitId) > res.stars
              ? '<div class="small muted">本次成績（這一關的最佳紀錄是 ' + UI.stars(bestStars(s.unitId)) + '）</div>'
              : '') +
            (res.crownUp ? '<div class="tag gold mt8">👑 皇冠 Lv.' + res.crown + '</div>' : '')
          : '<p class="muted">' + esc(s.title) + '</p>') +
      '</div>' +

      '<div class="kpi-grid mt24">' +
        '<div class="kpi"><div class="kpi-num text-green" id="k-acc">0</div><div class="kpi-lab">正確率 %</div></div>' +
        '<div class="kpi"><div class="kpi-num text-gold" id="k-xp">0</div><div class="kpi-lab">獲得 XP</div></div>' +
        '<div class="kpi"><div class="kpi-num text-blue">' + s.correct + '/' + s.total + '</div><div class="kpi-lab">答對題數</div></div>' +
        '<div class="kpi"><div class="kpi-num">' + mins + '</div><div class="kpi-lab">花費分鐘</div></div>' +
      '</div>' +

      (res.gems ? '<div class="card card-hl center mt16">💎 +' + res.gems + '　' +
        (res.firstClear ? '首次通關獎勵' : '') + '</div>' : '') +

      missedHTML(s) +

      '<div class="stack mt24">' +
        (s.mode === 'unit'
          ? (res.passed
              ? '<button class="btn btn-primary btn-lg" data-nav="#/map">回到地圖</button>' +
                '<button class="btn btn-ghost btn-lg" id="again">再打一次（學更多新字）</button>'
              : '<button class="btn btn-primary btn-lg" id="again">再挑戰一次</button>' +
                '<button class="btn btn-ghost btn-lg" data-nav="#/map">回到地圖</button>')
          : '<button class="btn btn-primary btn-lg" data-nav="#/home">回到今日</button>') +
      '</div>';

    UI.countUp(UI.$('#k-acc'), Math.round(rate * 100), 700);
    UI.countUp(UI.$('#k-xp'), res.xp, 700);

    var again = UI.$('#again');
    if (again) again.onclick = function () { start('unit', s.unitId); };

    session = null;
    UI.refreshChips();
  }

  function missedHTML(s) {
    if (!s.missed.length) {
      return '<div class="card card-hl center mt16"><span class="big">🎯</span>' +
        '<div class="bold">全部答對，一題都沒錯</div></div>';
    }
    var rows = s.missed.slice(0, 8).map(function (q) {
      var label = '', sub = '';
      if (q.ref && q.ref.w) { label = q.ref.w; sub = q.ref.pos + ' ' + q.ref.zh; }
      else if (q.ref && q.ref.en) { label = q.ref.en; sub = q.ref.zh || ''; }
      else if (q.ref && q.ref.q) { label = String(q.ref.q).slice(0, 46); sub = q.ref.why ? String(q.ref.why).replace(/<[^>]+>/g, '').slice(0, 40) : ''; }
      else if (q.ref && q.ref.title) { label = q.ref.title; sub = '閱讀理解'; }
      return '<div class="list-row">' + Speech.btn(label) +
        '<div class="grow"><div class="sentence-en">' + esc(label) + '</div>' +
        '<div class="sentence-zh">' + esc(sub) + '</div></div></div>';
    }).join('');

    return '<div class="card mt16">' +
      '<div class="card-title">👾 這些變成了弱點怪獸</div>' +
      '<p class="small muted">它們會排進複習，答對就消滅。</p>' + rows + '</div>';
  }

  function renderNothingToReview() {
    document.body.classList.remove('in-lesson');
    UI.$('#view').innerHTML =
      '<div class="empty"><div class="empty-ico">✨</div>' +
      '<h2>今天沒有要複習的東西</h2>' +
      '<p>間隔重複的重點就是「不用複習的時候就別複習」。去打新關卡吧。</p>' +
      '<button class="btn btn-primary btn-lg mt16" data-nav="#/map">前往地圖</button></div>';
  }

  /* ---------- 路由入口 ---------- */
  Views.lesson = function (params) {
    var id = params.id;
    if (id === 'challenge') return start('challenge');
    if (id === 'review') return start('review', null, params);
    return start('unit', id);
  };

  Views.lessonExit = function () {
    if (session) { cleanup(); session = null; }
    document.body.classList.remove('in-lesson');
  };
})(window);
