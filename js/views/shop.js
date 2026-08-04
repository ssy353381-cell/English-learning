/* ==========================================================================
   views/shop.js — 寶石商店
   寶石只買「保護」與「便利」，不能拿來跳過學習。
   ========================================================================== */
(function (global) {
  'use strict';

  global.Views = global.Views || {};

  var ITEMS = [
    { id: 'freeze', icon: '🛡️', name: '連續天數護盾', cost: 40,
      desc: '斷一天不會歸零。最多存 3 個，斷線時自動使用。' },
    { id: 'double', icon: '⚡', name: '雙倍 XP（今日）', cost: 60,
      desc: '接下來到今天結束，所有 XP 加倍。' },
    { id: 'refill', icon: '🎲', name: '重抽每日挑戰', cost: 25,
      desc: '把今天已完成的每日挑戰重置，可以再刷一次。' }
  ];

  Views.shop = function () {
    var g = State.data.g;

    UI.$('#view').innerHTML =
      '<h1>寶石商店</h1>' +
      '<div class="card card-hl center">' +
        '<div style="font-size:2.6rem">💎</div>' +
        '<div class="huge text-blue">' + g.gems + '</div>' +
        '<p class="small muted mb0">通關、首次過關、連續 7 天都會拿到寶石</p>' +
      '</div>' +

      '<div class="card">' +
        '<div class="card-title">🛡️ 目前的護盾</div>' +
        '<div class="row" style="gap:10px;font-size:2rem">' +
          [0, 1, 2].map(function (i) {
            return '<span style="opacity:' + (i < g.freeze ? 1 : .25) + '">🛡️</span>';
          }).join('') +
          '<span class="grow small muted">' + g.freeze + ' / 3</span>' +
        '</div>' +
      '</div>' +

      ITEMS.map(itemCard).join('') +

      '<div class="hint-box">寶石不能用來跳過關卡或直接解鎖答案 — ' +
      '那樣只會騙到自己。它只買「別讓你放棄」的東西。</div>';

    bind();
  };

  function itemCard(it) {
    var afford = State.data.g.gems >= it.cost;
    return '<div class="card">' +
      '<div class="row">' +
        '<div style="font-size:2.2rem;line-height:1">' + it.icon + '</div>' +
        '<div class="grow"><div class="bold">' + UI.esc(it.name) + '</div>' +
        '<div class="small muted">' + UI.esc(it.desc) + '</div></div>' +
      '</div>' +
      '<button class="btn ' + (afford ? 'btn-blue' : 'btn-ghost') + ' btn-block btn-sm mt8" ' +
        'data-buy="' + it.id + '"' + (afford ? '' : ' disabled') + '>💎 ' + it.cost + '</button>' +
      '</div>';
  }

  function bind() {
    UI.$$('[data-buy]').forEach(function (b) {
      b.onclick = function () {
        var id = b.getAttribute('data-buy');
        var it = ITEMS.filter(function (x) { return x.id === id; })[0];
        if (!it) return;

        if (id === 'freeze') {
          if (Gamify.buyFreeze(it.cost)) Views.shop();
          return;
        }
        if (id === 'double') {
          if (State.data.g.doubleDay === State.dayStr()) { UI.toast('今天已經是雙倍了', 'bad'); return; }
          if (!Gamify.spendGems(it.cost)) { UI.toast('寶石不夠', 'bad'); return; }
          State.data.g.doubleDay = State.dayStr();
          State.save(true);
          UI.toast('⚡ 今天 XP 加倍！', 'gold');
          Views.shop();
          return;
        }
        if (id === 'refill') {
          if (!State.data.today.challenge) { UI.toast('今天的挑戰還沒做', 'bad'); return; }
          if (!Gamify.spendGems(it.cost)) { UI.toast('寶石不夠', 'bad'); return; }
          State.data.today.challenge = false;
          State.save(true);
          UI.toast('🎲 每日挑戰已重置', 'good');
          Views.shop();
        }
      };
    });
  }
})(window);
