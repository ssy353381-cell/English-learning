/* ==========================================================================
   exercises/spell.js — 字母銀行拼字
   --------------------------------------------------------------------------
   難度階梯裡缺的那一階：
     選擇題（認得就好） → 字母銀行拼字（要拼得出來） → 空白打字（最難）
   對零基礎的人，直接叫他打字太挫折；點字母剛好，手機上也比鍵盤好按。
   提示強度會隨熟練度自動降低：越熟的字，露出的首字母越少。
   ========================================================================== */
(function (global) {
  'use strict';

  var esc = UI.esc;

  /** 依 SRS 熟練度決定要先露幾個字母 */
  function hintCount(word, level) {
    if (word.length <= 3) return 0;
    if (level >= 2) return 0;               // 熟悉以上：完全不給
    if (level === 1) return 1;              // 學習中：給第一個字母
    return word.length >= 7 ? 2 : 1;        // 第一次拼：長字給兩個
  }

  Ex.spell = {
    scored: true,
    render: function (q, host, api) {
      var v = q.ref;
      var word = v.w;
      var letters = word.split('');
      var lvl = SRS.levelOf(v.id);
      var given = hintCount(word, lvl);

      // 句子挖空：優先用例句，讓拼字發生在語境裡而不是孤立背單字
      var ex = (v.ex && v.ex[0]) ? v.ex[0] : null;
      var before = '', after = '', zhLine = v.zh;
      if (ex) {
        var re = new RegExp('\\b' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
        var m = ex[0].match(re);
        if (m) {
          var i = ex[0].search(re);
          before = ex[0].slice(0, i);
          after = ex[0].slice(i + m[0].length);
          zhLine = ex[1];
        } else { ex = null; }
      }

      ExUtil.prompt(host, ex ? '把句子裡缺的字拼出來' : '拼出這個字');

      // 提示：已給的字母 + 底線
      var hintStr = letters.map(function (c, i) {
        return i < given ? c : (c === ' ' || c === '-' || c === "'" ? c : '_');
      }).join(' ');

      host.insertAdjacentHTML('beforeend',
        '<div class="card center">' +
          (v.ic ? '<div class="word-icon">' + v.ic + '</div>' : '') +
          (ex
            ? '<div class="cloze-text"><span class="en">' + esc(before) + '</span>' +
              '<b class="text-blue" id="slot">' + '＿'.repeat(Math.max(1, letters.length - given)) + '</b>' +
              '<span class="en">' + esc(after) + '</span></div>'
            : '<div class="cloze-text"><b class="text-blue" id="slot">＿</b></div>') +
          '<div class="sentence-zh mt8">' + esc(zhLine) + '</div>' +
          '<div class="word-kk mt8" style="letter-spacing:3px">' + esc(hintStr) + '</div>' +
          '<div class="row mt8" style="justify-content:center;gap:8px">' +
            '<span class="word-pos">' + esc(v.pos) + '</span>' +
            '<span class="small muted">' + esc(v.zh) + '</span>' +
          '</div>' +
        '</div>' +

        '<div class="build-area" id="slots" style="justify-content:center;min-height:56px"></div>' +
        '<div class="bank" id="bank" style="justify-content:center"></div>' +
        '<div class="row mt16" style="gap:8px;justify-content:center">' +
          '<button class="btn btn-ghost btn-sm" id="clear">↺ 全部清掉</button>' +
          '<button class="btn btn-ghost btn-sm" id="hear">🔊 聽一次</button>' +
        '</div>');

      var slots = UI.$('#slots', host);
      var bank = UI.$('#bank', host);
      var slot = UI.$('#slot', host);

      // 已給的字母直接鎖在前面
      for (var g = 0; g < given; g++) {
        var fixed = document.createElement('span');
        fixed.className = 'tok';
        fixed.style.opacity = '.55';
        fixed.textContent = letters[g];
        slots.appendChild(fixed);
      }

      // 字母銀行：剩下的字母打亂，再加 2 個干擾字母
      var pool = letters.slice(given);
      var noise = 'abcdefghijklmnopqrstuvwxyz'.split('')
        .filter(function (c) { return word.toLowerCase().indexOf(c) < 0; });
      pool = pool.concat(Content.sample(noise, word.length > 6 ? 3 : 2));

      Content.shuffle(pool).forEach(function (ch) {
        var b = document.createElement('button');
        b.className = 'tok';
        b.type = 'button';
        b.textContent = ch;
        b.style.minWidth = '42px';
        b.onclick = function () { placeLetter(b); };
        bank.appendChild(b);
      });

      function placeLetter(b) {
        if (b.classList.contains('used')) return;
        Sfx.play('click');
        var c = document.createElement('span');
        c.className = 'tok';
        c.textContent = b.textContent;
        c.style.minWidth = '42px';
        c.onclick = function () {
          if (slots.dataset.locked) return;
          Sfx.play('click');
          slots.removeChild(c);
          b.classList.remove('used');
          sync();
        };
        slots.appendChild(c);
        b.classList.add('used');
        sync();
      }

      function typed() {
        return Array.prototype.map.call(slots.children, function (n) { return n.textContent; }).join('');
      }

      function sync() {
        var t = typed();
        if (slot) slot.textContent = t || '＿'.repeat(Math.max(1, letters.length - given));
        api.enableCheck(t.length >= Math.max(2, word.length - 2));
      }

      UI.$('#clear', host).onclick = function () {
        if (slots.dataset.locked) return;
        while (slots.children.length > given) slots.removeChild(slots.lastChild);
        UI.$$('.tok', bank).forEach(function (n) { n.classList.remove('used'); });
        sync();
      };
      UI.$('#hear', host).onclick = function () { Speech.speak(word); };

      api.enableCheck(false);
      sync();

      // 桌機：直接用鍵盤敲字母也可以
      function onKey(e) {
        if (e.target && /input|textarea/i.test(e.target.tagName)) return;
        if (e.key === 'Backspace') {
          if (slots.children.length > given) slots.lastChild.click();
          e.preventDefault();
          return;
        }
        if (!/^[a-zA-Z]$/.test(e.key)) return;
        var hit = UI.$$('.tok', bank).filter(function (n) {
          return !n.classList.contains('used') && n.textContent.toLowerCase() === e.key.toLowerCase();
        })[0];
        if (hit) { hit.click(); e.preventDefault(); }
      }
      document.addEventListener('keydown', onKey);
      api.onCleanup(function () { document.removeEventListener('keydown', onKey); });

      api.ready(function () {
        slots.dataset.locked = '1';
        var mine = typed();
        var ok = mine.toLowerCase() === word.toLowerCase();

        Array.prototype.forEach.call(slots.children, function (n, i) {
          var right = word[i] && n.textContent.toLowerCase() === word[i].toLowerCase();
          n.style.borderColor = right ? 'var(--green)' : 'var(--red)';
          n.style.color = right ? 'var(--green-dark)' : 'var(--red-dark)';
        });
        if (slot) slot.textContent = word;

        ExUtil.gradeVocab(v, ok, false, q.unitId);
        Speech.speak(word);

        api.result(ok, {
          title: ok ? '拼對了！' : '正確拼法是 ' + word,
          detail: '<div class="row" style="gap:8px">' + Speech.btn(word) + Speech.btn(word, true) +
            '<div><div class="sentence-en">' + esc(word) +
            (v.kk ? ' <span class="word-kk">[' + esc(v.kk) + ']</span>' : '') + '</div>' +
            '<div class="sentence-zh">' + esc(v.pos) + ' ' + esc(v.zh) + '</div></div></div>' +
            (ok ? '' : '<div class="small muted mt8">你拼的：' + esc(mine) + '</div>') +
            (ex ? '<div class="sentence-en mt8">' + esc(ex[0]) + '</div>' +
                  '<div class="sentence-zh">' + esc(ex[1]) + '</div>' : '')
        });
      });
    }
  };
})(window);
