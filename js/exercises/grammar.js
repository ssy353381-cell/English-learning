/* ==========================================================================
   exercises/grammar.js — 文法題
     mc    選擇題
     fix   改錯（把錯誤的句子改對）
     trans 中翻英造句
   ========================================================================== */
(function (global) {
  'use strict';

  var esc = UI.esc;

  Ex.grammar = {
    scored: true,
    render: function (q, host, api) {
      var c = q.ref;
      if (c.k === 'fix')   return renderFix(q, host, api);
      if (c.k === 'trans') return renderTrans(q, host, api);
      return renderMC(q, host, api);
    }
  };

  /* ---------------- 選擇題 ---------------- */
  function renderMC(q, host, api) {
    var c = q.ref;
    var order = Content.shuffle(c.opts.map(function (o, i) { return i; }));
    var correctIdx = order.indexOf(c.a);

    ExUtil.prompt(host, c.title || '選出正確的答案');
    host.insertAdjacentHTML('beforeend',
      '<div class="card"><div class="cloze-text">' +
        esc(c.q).replace(/_{2,}/g, '<b class="text-blue">＿＿＿</b>') + '</div>' +
      (c.zh ? '<div class="sentence-zh mt8">' + esc(c.zh) + '</div>' : '') + '</div>');

    var short = c.opts.every(function (o) { return String(o).length < 14; });
    var ctl = ExUtil.options(host,
      order.map(function (oi) { return { html: '<span class="en bold">' + esc(c.opts[oi]) + '</span>' }; }),
      { grid2: short && c.opts.length === 4, onPick: function () { api.enableCheck(true); } });
    ExUtil.bindKeys(ctl, api);
    api.enableCheck(false);

    api.ready(function () {
      var picked = ctl.picked();
      if (picked < 0) return;
      var ok = picked === correctIdx;
      ctl.lock(correctIdx);
      ExUtil.gradeGrammar(q.g, ok, q.unitId);
      var full = String(c.q).replace(/_{2,}/, c.opts[c.a]);
      api.result(ok, {
        title: ok ? '正確！' : '正確答案是 ' + c.opts[c.a],
        detail: '<div class="row" style="gap:8px">' + Speech.btn(full) +
          '<div class="sentence-en">' + esc(full) + '</div></div>' +
          (c.why ? '<div class="check-detail">' + c.why + '</div>' : '')
      });
    });
  }

  /* ---------------- 改錯 ---------------- */
  function renderFix(q, host, api) {
    var c = q.ref;
    ExUtil.prompt(host, '這句話有一個錯誤，把它改對', c.zh ? esc(c.zh) : '');
    host.insertAdjacentHTML('beforeend',
      '<div class="card card-tight center">' +
        '<div class="sentence-en big" style="text-decoration:underline wavy var(--red)">' + esc(c.q) + '</div>' +
      '</div>' +
      '<textarea class="textarea" id="fixin" placeholder="在這裡寫出正確的句子" ' +
        'autocapitalize="sentences" spellcheck="false"></textarea>' +
      '<div class="row mt8"><button class="btn btn-ghost btn-sm" id="hint">看提示</button></div>');

    var inp = UI.$('#fixin', host);
    inp.addEventListener('input', function () { api.enableCheck(!!inp.value.trim()); });
    api.enableCheck(false);
    setTimeout(function () { inp.focus(); }, 150);

    UI.$('#hint', host).onclick = function () {
      UI.toast('💡 ' + (c.hint || '注意動詞和主詞有沒有配好'), '', 3200);
    };

    api.ready(function () {
      var answers = [c.a].concat(c.alt || []);
      var ok = ExUtil.matchAny(inp.value, answers);
      inp.disabled = true;
      ExUtil.gradeGrammar(q.g, ok, q.unitId);
      api.result(ok, {
        title: ok ? '改對了！' : '正確的句子是',
        detail: '<div class="row" style="gap:8px">' + Speech.btn(c.a) +
          '<div><div class="sentence-en">' + esc(c.a) + '</div>' +
          (c.zh ? '<div class="sentence-zh">' + esc(c.zh) + '</div>' : '') + '</div></div>' +
          (ok ? '' : '<div class="small muted mt8">你寫的：' + esc(inp.value) + '</div>') +
          (c.why ? '<div class="check-detail">' + c.why + '</div>' : '')
      });
    });
  }

  /* ---------------- 中翻英 ---------------- */
  function renderTrans(q, host, api) {
    var c = q.ref;
    var answers = [c.a].concat(c.alt || []);

    ExUtil.prompt(host, '把這句中文翻成英文');
    host.insertAdjacentHTML('beforeend',
      '<div class="card card-tight center"><div class="big bold">' + esc(c.zh) + '</div></div>' +
      '<textarea class="textarea" id="transin" placeholder="Type in English…" ' +
        'autocapitalize="sentences" spellcheck="false"></textarea>' +
      '<div class="row mt8" style="gap:8px">' +
        '<button class="btn btn-ghost btn-sm" id="hint">看提示</button>' +
        '<span class="small muted">大小寫和句點不影響判分</span>' +
      '</div>');

    var inp = UI.$('#transin', host);
    inp.addEventListener('input', function () { api.enableCheck(!!inp.value.trim()); });
    api.enableCheck(false);
    setTimeout(function () { inp.focus(); }, 150);

    UI.$('#hint', host).onclick = function () {
      var first = c.a.split(/\s+/).slice(0, 2).join(' ');
      UI.toast('💡 開頭是「' + first + '…」', '', 3200);
    };

    api.ready(function () {
      var ok = ExUtil.matchAny(inp.value, answers);
      var near = !ok && ExUtil.nearMiss(inp.value, c.a);
      inp.disabled = true;
      ExUtil.gradeGrammar(q.g, ok, q.unitId);
      api.result(ok, {
        title: ok ? '翻得好！' : (near ? '很接近了，再看一次正確寫法' : '參考答案'),
        detail: '<div class="row" style="gap:8px">' + Speech.btn(c.a) +
          '<div><div class="sentence-en">' + esc(c.a) + '</div>' +
          '<div class="sentence-zh">' + esc(c.zh) + '</div></div></div>' +
          (c.alt && c.alt.length ? '<div class="small muted mt8">也可以說：' + esc(c.alt.join('　/　')) + '</div>' : '') +
          (ok ? '' : '<div class="small muted mt8">你寫的：' + esc(inp.value) + '</div>') +
          (c.why ? '<div class="check-detail">' + c.why + '</div>' : '')
      });
    });
  }
})(window);
