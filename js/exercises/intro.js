/* ==========================================================================
   exercises/intro.js — 教學卡（發音表 / 文法概念）
   不計分，讀完按「我懂了」進下一題。
   ========================================================================== */
(function (global) {
  'use strict';

  var esc = UI.esc;

  /** 通用區塊渲染器：發音表與文法卡共用同一套語法 */
  function renderSections(sections) {
    return (sections || []).map(function (s) {
      var out = '';
      if (s.h)  out += '<h3 class="mt16">' + s.h + '</h3>';
      if (s.p)  out += '<p>' + s.p + '</p>';

      if (s.formula) {
        out += '<div class="rule-box"><div class="rule-formula">' + s.formula + '</div>' +
               (s.formulaNote ? '<div class="small muted center">' + s.formulaNote + '</div>' : '') +
               '</div>';
      }

      if (s.list) {
        out += '<ul>' + s.list.map(function (li) { return '<li>' + li + '</li>'; }).join('') + '</ul>';
      }

      if (s.table) {
        out += '<div style="overflow-x:auto"><table class="tbl"><thead><tr>' +
          s.table.head.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') +
          '</tr></thead><tbody>' +
          s.table.rows.map(function (r) {
            return '<tr>' + r.map(function (c, ci) {
              var cell = String(c);
              // 第一欄如果是英文，加上發音按鈕
              if (ci === 0 && s.table.speak && /[A-Za-z]/.test(cell)) {
                var plain = cell.replace(/<[^>]+>/g, '').replace(/[^A-Za-z' ]/g, '').trim();
                return '<td class="en">' + cell +
                  (plain ? ' ' + Speech.btn(plain, false, 'speak-mini') : '') + '</td>';
              }
              return '<td' + (ci === 0 ? ' class="en"' : '') + '>' + cell + '</td>';
            }).join('') + '</tr>';
          }).join('') +
          '</tbody></table></div>';
      }

      if (s.words) {
        out += '<div class="row wrap mt8" style="gap:8px">' + s.words.map(function (w) {
          var word = typeof w === 'string' ? w : w.w;
          var zh = typeof w === 'string' ? '' : w.zh;
          var ic = typeof w === 'string' ? '' : (w.ic || '');
          return '<button class="tok" data-speak="' + esc(word) + '">' +
            (ic ? ic + ' ' : '') + esc(word) +
            (zh ? ' <span class="muted small">' + esc(zh) + '</span>' : '') + '</button>';
        }).join('') + '</div>';
      }

      if (s.ex) {
        out += '<div class="ex-list">' + s.ex.map(function (p) {
          return '<div class="ex-item">' + Speech.btn(p[0], false, 'speak-inline') +
            '<div class="sentence-en">' + esc(p[0]) + '</div>' +
            '<div class="sentence-zh">' + esc(p[1]) + '</div></div>';
        }).join('') + '</div>';
      }

      if (s.tip)  out += '<div class="hint-box">💡 ' + s.tip + '</div>';
      if (s.warn) out += '<div class="warn-box">⚠️ ' + s.warn + '</div>';

      return out;
    }).join('');
  }

  Ex.intro = {
    scored: false,
    render: function (q, host, api) {
      var d = q.ref;
      var teach = q.kind === 'grammar' ? d.teach : d;
      var title = teach.title || d.title || '學習重點';

      host.innerHTML =
        '<div class="tag ' + (q.kind === 'grammar' ? 'blue' : 'green') + '">' +
          (q.kind === 'grammar' ? '文法' : '發音') + '</div>' +
        '<h2 class="mt8">' + esc(title) + '</h2>' +
        (teach.lead ? '<p class="muted">' + teach.lead + '</p>' : '') +
        '<div class="card">' + renderSections(teach.sections) + '</div>';

      api.setContinue('我懂了 👍');
    }
  };

  global.ExIntro = { renderSections: renderSections };
})(window);
