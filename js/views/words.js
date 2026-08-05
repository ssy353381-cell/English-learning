/* ==========================================================================
   views/words.js — 詞庫：一萬二千字的入口

   複習頁的「單字庫」分頁只列課程教過的字，因為那時候整個 App 的字就是課程。
   詞庫多了一萬多個不綁關卡的字，需要自己的頁面：查得到、找得到、背得起來。

   三種進法：
     搜尋   知道要查哪個字的時候（中英都能搜）
     分級   不知道從哪開始的時候，照詞頻由高到低一級一級啃
     主題   準備多益的時候，直接挑商務字
   ========================================================================== */
(function (global) {
  'use strict';

  var esc = UI.esc;
  global.Views = global.Views || {};

  var BATCH = 20;          // 一次特訓幾個字
  var PAGE = 60;           // 清單一次顯示幾筆

  var mode = 'level';      // level / biz / search
  var level = 1;
  var query = '';
  var shown = PAGE;

  Views.words = function (params) {
    if (params && params.q) { mode = 'search'; query = params.q; }
    if (params && params.lv) { mode = 'level'; level = parseInt(params.lv, 10) || 1; }
    render();
  };

  /* ---------- 目前這批字 ---------- */
  function currentList() {
    if (mode === 'search') return Lexicon.search(query, 400);
    if (mode === 'biz') return Lexicon.byTag('biz');
    return Lexicon.byLevel(level);
  }

  /** 這一批裡還沒學過的字 —— 特訓要從這些開始 */
  function unlearned(list) {
    return list.filter(function (e) { return !SRS.has(e.id); });
  }

  function progressOf(list) {
    var done = 0;
    for (var i = 0; i < list.length; i++) if (SRS.has(list[i].id)) done++;
    return { done: done, total: list.length };
  }

  /* ---------- 畫面 ---------- */
  function render() {
    var list = currentList();
    var p = progressOf(list);
    var total = Lexicon.count();

    var html =
      '<h1>詞庫</h1>' +
      '<p class="muted">' + total + ' 個字，涵蓋多益的字彙量級。' +
      '任何一句例句裡的字都可以直接點開來查，這裡是完整的清單。</p>' +

      '<div class="searchbar mb16">' +
        '<input id="lexq" class="input" type="search" placeholder="搜尋英文或中文…" ' +
          'value="' + esc(mode === 'search' ? query : '') + '" autocomplete="off">' +
      '</div>' +

      '<div class="seg mb16">' +
        '<button data-mode="level" class="' + (mode === 'level' ? 'on' : '') + '">📶 分級</button>' +
        '<button data-mode="biz" class="' + (mode === 'biz' ? 'on' : '') + '">💼 商務</button>' +
      '</div>' +

      (mode === 'level' ? levelPickerHTML() : '') +

      '<div class="card">' +
        '<div class="row-between">' +
          '<div><div class="bold">' + esc(batchName()) + '</div>' +
            '<div class="small muted">' + p.done + ' / ' + p.total + ' 已進入複習排程</div></div>' +
          '<div class="big">' + Math.round(p.total ? p.done / p.total * 100 : 0) + '%</div>' +
        '</div>' +
        UI.pbar(p.total ? p.done / p.total : 0) +
        (unlearned(list).length
          ? '<button class="btn btn-primary mt16" id="drill">開始特訓 ' +
            Math.min(BATCH, unlearned(list).length) + ' 個新字</button>'
          : '<p class="small muted mt8 mb0">這一批都排進複習了。到「複習」頁把它們練熟，或換下一級。</p>') +
      '</div>' +

      '<div id="lexlist" class="mt16"></div>';

    UI.$('#view').innerHTML = html;

    UI.$$('[data-mode]').forEach(function (b) {
      b.onclick = function () { mode = b.getAttribute('data-mode'); shown = PAGE; render(); };
    });
    UI.$$('[data-lv]').forEach(function (b) {
      b.onclick = function () { level = +b.getAttribute('data-lv'); mode = 'level'; shown = PAGE; render(); };
    });

    var box = UI.$('#lexq');
    var timer = null;
    box.oninput = function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        query = box.value.trim();
        mode = query ? 'search' : 'level';
        shown = PAGE;
        var keep = document.activeElement === box;
        render();
        if (keep) { var n = UI.$('#lexq'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }
      }, 220);
    };

    var drill = UI.$('#drill');
    if (drill) drill.onclick = function () { startDrill(list); };

    renderList(list);
  }

  function batchName() {
    if (mode === 'search') return '搜尋「' + query + '」';
    if (mode === 'biz') return '商務主題字';
    return '第 ' + level + ' 級 ・ ' + Lexicon.LEVEL_NAME[level];
  }

  function levelPickerHTML() {
    var out = '<div class="lvpick mb16">';
    for (var i = 1; i <= 6; i++) {
      var n = Lexicon.byLevel(i).length;
      out += '<button data-lv="' + i + '" class="lvbtn' + (i === level ? ' on' : '') + '">' +
        '<span class="lvbtn-n">' + i + '</span>' +
        '<span class="lvbtn-name">' + Lexicon.LEVEL_NAME[i] + '</span>' +
        '<span class="lvbtn-c">' + n + '</span></button>';
    }
    return out + '</div>';
  }

  function renderList(list) {
    var host = UI.$('#lexlist');
    if (!list.length) {
      host.innerHTML = '<div class="empty"><div class="empty-ico">🔍</div>' +
        '<p class="muted">找不到這個字。試試看只打前幾個字母。</p></div>';
      return;
    }

    var slice = list.slice(0, shown);
    host.innerHTML =
      '<div class="lexlist">' + slice.map(rowHTML).join('') + '</div>' +
      (list.length > shown
        ? '<button class="btn btn-ghost mt16" id="more">再看 ' +
          Math.min(PAGE, list.length - shown) + ' 個（還有 ' + (list.length - shown) + '）</button>'
        : '');

    var more = UI.$('#more');
    if (more) more.onclick = function () { shown += PAGE; renderList(list); };
  }

  function rowHTML(e) {
    var lvl = SRS.levelOf(e.id);
    return '<button class="lexrow-item" type="button" data-lexw="' + esc(e.w) + '">' +
      '<span class="lexrow-w">' + esc(e.w) + '</span>' +
      '<span class="lexrow-zh">' + esc(e.zh) + '</span>' +
      (lvl ? '<span class="lexrow-dot lv' + lvl + '" title="' +
        ['', '學習中', '熟悉', '精熟'][lvl] + '"></span>' : '') +
      '</button>';
  }

  /* ---------- 特訓 ---------- */
  /**
   * 詞庫特訓走的是和關卡一模一樣的課程畫面，只是題目來源換成詞庫。
   * 刻意不做成新的畫面 —— 練習的節奏、批改、結算都已經在那邊調好了。
   */
  function startDrill(list) {
    var pool = unlearned(list);
    if (!pool.length) { UI.toast('這一批已經沒有新字了', 'bad'); return; }
    Views.lessonStartLexicon(Content.sample(pool, BATCH), batchName());
  }

  global.ViewsWords = { BATCH: BATCH };
})(window);
