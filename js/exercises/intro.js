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

  /** 不規則動詞表：從資料現組一張教學卡，依詞型分三組呈現 */
  var IRREG_GROUPS = [
    { t: 'A', h: 'A 型：三態同形', p: '最好背的一組 — 三個形態長得一模一樣。' },
    { t: 'B', h: 'B 型：過去式＝過去分詞', p: '只要記兩個形態，數量最多。' },
    { t: 'C', h: 'C 型：三態都不同', p: '最容易錯的一組，多益也考最兇。' }
  ];

  function irregularTeach(list) {
    return {
      title: '不規則動詞 ' + list.length + ' 個',
      lead: '規則動詞加 -ed 就好，這些不行。但它們不是亂長的 — 按變化形態分成三組，要背的量立刻少一半。',
      sections: IRREG_GROUPS.map(function (g) {
        var rows = list.filter(function (iv) { return iv.t === g.t; })
          .map(function (iv) { return [iv.v, iv.p, iv.pp, iv.zh]; });
        return {
          h: g.h + '（' + rows.length + ' 個）',
          p: g.p,
          table: { head: ['原形', '過去式', '過去分詞', '中文'], rows: rows, speak: true }
        };
      })
    };
  }

  var TAGS = {
    grammar:   ['blue',  '文法'],
    irregular: ['gold',  '不規則動詞'],
    phonics:   ['green', '發音']
  };

  Ex.intro = {
    scored: false,
    render: function (q, host, api) {
      var d = q.ref;
      var teach = q.kind === 'grammar' ? d.teach
                : q.kind === 'irregular' ? irregularTeach(d)
                : d;
      var title = teach.title || d.title || '學習重點';
      var tag = TAGS[q.kind] || TAGS.phonics;

      host.innerHTML =
        '<div class="tag ' + tag[0] + '">' + tag[1] + '</div>' +
        '<h2 class="mt8">' + esc(title) + '</h2>' +
        (teach.lead ? '<p class="muted">' + teach.lead + '</p>' : '') +
        '<div class="card">' + renderSections(teach.sections) + '</div>';

      api.setContinue('我懂了 👍');
    }
  };

  global.ExIntro = { renderSections: renderSections };
})(window);
