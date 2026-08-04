/* ==========================================================================
   app.js — 啟動與路由
   路由格式： #/home  #/map  #/lesson/s0u1  #/review?weak=1  #/stats  #/settings  #/shop
   ========================================================================== */
(function (global) {
  'use strict';

  function parseHash() {
    var h = (location.hash || '#/home').replace(/^#/, '');
    var qIdx = h.indexOf('?');
    var query = {};
    if (qIdx >= 0) {
      h.slice(qIdx + 1).split('&').forEach(function (kv) {
        var p = kv.split('=');
        query[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || '1');
      });
      h = h.slice(0, qIdx);
    }
    var parts = h.split('/').filter(Boolean);
    return { name: parts[0] || 'home', id: parts[1] || '', query: query, raw: h };
  }

  var lastRoute = '';

  function route() {
    var r = parseHash();

    // 離開課程時把狀態清乾淨
    if (lastRoute === 'lesson' && r.name !== 'lesson') Views.lessonExit();
    lastRoute = r.name;

    State.rollDay();
    UI.refreshChips();
    UI.setNavActive('#/' + r.name);
    UI.closeModal();

    var params = { id: r.id };
    for (var k in r.query) params[k] = r.query[k];

    var fn = Views[r.name];
    if (!fn) { location.hash = '#/home'; return; }

    try {
      fn(params);
    } catch (err) {
      console.error('畫面渲染失敗：' + r.name, err);
      UI.$('#view').innerHTML =
        '<div class="empty"><div class="empty-ico">😵</div>' +
        '<h2>這一頁出了點問題</h2>' +
        '<p class="muted small">' + UI.esc(err.message) + '</p>' +
        '<button class="btn btn-primary mt16" data-nav="#/home">回到首頁</button></div>';
    }

    if (r.name !== 'lesson') window.scrollTo(0, 0);
  }

  /* ---------- 首次啟動的歡迎流程 ---------- */
  function welcome() {
    var c = Content.counts();
    UI.modal(
      '<div class="center">' +
        '<div style="font-size:3.4rem">🚀</div>' +
        '<h2>歡迎來到 English Quest</h2>' +
        '<p class="muted">從 26 個字母出發，目標多益 990。</p>' +
      '</div>' +
      '<div class="card mt16">' +
        '<div class="card-title">先講三件老實話</div>' +
        '<ul class="small" style="padding-left:1.2em">' +
          '<li><b>這是一條 2–4 年的路。</b>沒有捷徑，但每天 30 分鐘就夠。</li>' +
          '<li><b>前兩個階段完全不碰考題。</b>先把發音和基本句子練熟，考試技巧之後才有用。</li>' +
          '<li><b>能不能成功，看的是連續天數。</b>所以這個 App 只有一個目標：讓你明天還想打開它。</li>' +
        '</ul>' +
      '</div>' +
      '<div class="card">' +
        '<div class="card-title">每天想學多久？</div>' +
        '<div class="seg" id="wgoal">' +
          '<button data-g="20">20 分</button>' +
          '<button data-g="40" class="on">40 分</button>' +
          '<button data-g="60">60 分</button>' +
        '</div>' +
        '<p class="small muted mt8 mb0">之後可以在設定裡改。</p>' +
      '</div>' +
      '<p class="center small muted">目前內容：' + c.vocab + ' 個單字　・　' +
        c.units + ' 個可玩關卡</p>' +
      '<button class="btn btn-primary btn-lg" id="wstart">開始第一關</button>'
    );

    UI.$$('#wgoal [data-g]').forEach(function (b) {
      b.onclick = function () {
        UI.$$('#wgoal [data-g]').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        State.data.profile.goalMin = +b.getAttribute('data-g');
        State.save(true);
        UI.refreshChips();
      };
    });

    UI.$('#wstart').onclick = function () {
      State.data.g.welcomed = true;
      State.save(true);
      UI.closeModal();
      location.hash = '#/lesson/' + Content.currentUnitId();
    };
  }

  /* ---------- 啟動 ---------- */
  function boot() {
    State.load();
    UI.applyTheme();
    UI.refreshChips();
    State.startClock();

    // 系統主題變更時跟著切
    if (global.matchMedia) {
      var mq = matchMedia('(prefers-color-scheme: dark)');
      if (mq.addEventListener) mq.addEventListener('change', UI.applyTheme);
    }

    // 分頁切回來時檢查有沒有跨日
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) { State.rollDay(); UI.refreshChips(); }
    });

    global.addEventListener('hashchange', route);

    if (!location.hash) location.hash = '#/home';
    route();

    if (!State.data.g.welcomed) setTimeout(welcome, 350);

    // 內容檢查：資料檔沒載到時給清楚的訊息，而不是整頁空白
    var c = Content.counts();
    if (!c.vocab) {
      console.warn('沒有載入到任何單字資料');
      UI.toast('⚠️ 單字資料沒有載入，請確認 data/ 資料夾完整', 'bad', 6000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window);
