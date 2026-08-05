/* ==========================================================================
   exercises/writing.js — 寫作：拖曳排句（build）與句子填空（cloze）
   排句採「點選」而非拖曳：手機上更好按，桌機也一樣快。
   ========================================================================== */
(function (global) {
  'use strict';

  var esc = UI.esc;

  /* ======================= build：把單字排成正確的句子 ======================= */
  Ex.build = {
    scored: true,
    render: function (q, host, api) {
      var s = q.ref;
      var correct = ExUtil.tokenize(s.en);

      // 誘答字塊：優先用資料標明的母語干擾組，沒寫才退回隨機舊字。
      // 長句本身已經夠難，隨機誘答只是加噪音，所以亂數補只開放給短句；
      // 刻意誘答不受此限 —— 它是這一句真正要考的辨析。
      var extras = Content.tokenLures(s, correct, {
        n: correct.length >= 6 ? 2 : 1,
        unitId: q.unitId,
        random: correct.length <= 8
      });

      var bankWords = Content.shuffle(correct.concat(extras));

      ExUtil.prompt(host, '把單字排成正確的句子');
      host.insertAdjacentHTML('beforeend',
        '<div class="card card-tight center">' +
          '<div class="sentence-zh big bold">' + esc(s.zh) + '</div>' +
        '</div>' +
        '<div class="build-area" id="build"></div>' +
        '<div class="bank" id="bank"></div>');

      var build = UI.$('#build', host);
      var bank = UI.$('#bank', host);

      bankWords.forEach(function (w, i) {
        var b = document.createElement('button');
        b.className = 'tok';
        b.type = 'button';
        b.textContent = w;
        b.dataset.k = i;
        b.onclick = function () { moveToBuild(b); };
        bank.appendChild(b);
      });

      function moveToBuild(b) {
        if (b.classList.contains('used')) return;
        Sfx.play('click');
        var c = b.cloneNode(true);
        c.classList.remove('used');
        c.onclick = function () {
          Sfx.play('click');
          build.removeChild(c);
          b.classList.remove('used');
          sync();
        };
        build.appendChild(c);
        b.classList.add('used');
        sync();
      }

      function current() {
        return Array.prototype.map.call(build.children, function (n) { return n.textContent; });
      }

      function sync() { api.enableCheck(build.children.length > 0); }
      api.enableCheck(false);

      api.ready(function () {
        var mine = current();
        var ok = ExUtil.sameText(mine.join(' '), s.en);
        Array.prototype.forEach.call(build.children, function (n) { n.onclick = null; });
        UI.$$('.tok', bank).forEach(function (n) { n.onclick = null; });
        build.style.borderBottomColor = ok ? 'var(--green)' : 'var(--red)';

        var v = Content.item(s.from);
        if (v && v.w) ExUtil.gradeVocab(v, ok, false, q.unitId);
        else if (s.from) ExUtil.gradeGrammar({ id: s.from, u: q.unitId }, ok, q.unitId);

        api.result(ok, {
          title: ok ? '句子正確！' : '正確的排法是',
          detail: '<div class="row" style="gap:8px">' + Speech.btn(s.en) +
            '<div><div class="sentence-en">' + esc(s.en) + '</div>' +
            '<div class="sentence-zh">' + esc(s.zh) + '</div></div></div>' +
            (ok ? '' : '<div class="small muted mt8">你排的：' + esc(mine.join(' ')) + '</div>')
        });
      });
    }
  };

  /* ======================= cloze：句子填空 ======================= */
  Ex.cloze = {
    scored: true,
    render: function (q, host, api) {
      var c = q.ref;
      var answers = [c.a].concat(c.alt || []);
      var hasOpts = !!(c.opts && c.opts.length);

      ExUtil.scaffold(host, q.scaffold);
      ExUtil.prompt(host, hasOpts ? '選出正確的字填進空格' : '把空格填完');

      var sentenceHTML = esc(c.q).replace(/_{2,}/g,
        hasOpts ? '<b class="text-blue">＿＿＿</b>'
                : '<input class="blank-input" id="cz" size="10" autocomplete="off" autocapitalize="off" spellcheck="false">');

      host.insertAdjacentHTML('beforeend',
        '<div class="card"><div class="cloze-text">' + sentenceHTML + '</div>' +
        (c.zh ? '<div class="sentence-zh mt8">' + esc(c.zh) + '</div>' : '') + '</div>');

      if (hasOpts) {
        var order = Content.shuffle(c.opts.map(function (o, i) { return i; }));
        var correctIdx = order.indexOf(c.a);
        var ctl = ExUtil.options(host,
          order.map(function (oi) { return { html: '<span class="en bold">' + esc(c.opts[oi]) + '</span>' }; }),
          { grid2: c.opts.length === 4 && c.opts.every(function (o) { return o.length < 12; }),
            onPick: function () { api.enableCheck(true); } });
        ExUtil.bindKeys(ctl, api);
        api.enableCheck(false);

        api.ready(function () {
          var picked = ctl.picked();
          if (picked < 0) return;
          var ok = picked === correctIdx;
          ctl.lock(correctIdx);
          finish(ok, c.opts[c.a]);
        });
      } else {
        var inp = UI.$('#cz', host);
        if (inp) {
          inp.addEventListener('input', function () { api.enableCheck(!!inp.value.trim()); });
          inp.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); api.submit(); }
          });
          setTimeout(function () { inp.focus(); }, 120);
        }
        api.enableCheck(false);

        api.ready(function () {
          if (!inp) return;
          var ok = ExUtil.matchAny(inp.value, answers);
          inp.disabled = true;
          inp.classList.add(ok ? 'correct' : 'wrong');
          var near = !ok && ExUtil.nearMiss(inp.value, c.a);
          if (!ok) inp.value = c.a;
          finish(ok, c.a, near, inp.value);
        });
      }

      function finish(ok, answerText, near) {
        if (q.g) ExUtil.gradeGrammar(q.g, ok, q.unitId);
        var tl = (!ok && q.g) ? ExUtil.timelineHTML(q.g.tl) : '';
        var full = c._full || String(c.q).replace(/_{2,}/, answerText);
        api.result(ok, {
          title: ok ? '正確！' : (near ? '差一點點，拼字再看一次' : '正確答案是 ' + answerText),
          detail: '<div class="row" style="gap:8px">' + Speech.btn(full) +
            '<div><div class="sentence-en">' + esc(full) + '</div>' +
            (c.zh ? '<div class="sentence-zh">' + esc(c.zh) + '</div>' : '') + '</div></div>' +
            (c.why ? '<div class="check-detail">' + c.why + '</div>' : '') + tl
        });
      }
    }
  };
})(window);
