/* ==========================================================================
   ui.js — 共用 UI 工具：toast、modal、頂部狀態列、DOM 小幫手
   ========================================================================== */
(function (global) {
  'use strict';

  /* ---------- DOM ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  /* ---------- Toast ---------- */
  function toast(msg, kind, ms) {
    var root = $('#toast-root');
    if (!root) return;
    var t = el('div', 'toast' + (kind ? ' ' + kind : ''), esc(msg));
    root.appendChild(t);
    setTimeout(function () {
      t.style.transition = 'opacity .3s, transform .3s';
      t.style.opacity = '0';
      t.style.transform = 'translateY(8px)';
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 320);
    }, ms || 2000);
  }

  /* ---------- Modal ---------- */
  var modalOnClose = null;

  function modal(html, onClose) {
    var root = $('#modal-root');
    $('#modal-body').innerHTML = html;
    root.hidden = false;
    modalOnClose = onClose || null;
    var firstBtn = $('#modal-body .btn');
    if (firstBtn) setTimeout(function () { firstBtn.focus(); }, 50);
  }

  function closeModal() {
    var root = $('#modal-root');
    if (root.hidden) return;
    root.hidden = true;
    $('#modal-body').innerHTML = '';
    var fn = modalOnClose; modalOnClose = null;
    if (fn) fn();
  }

  function confirm(title, msg, okText, onOk, danger) {
    modal(
      '<h2>' + esc(title) + '</h2>' +
      '<p class="muted">' + msg + '</p>' +
      '<div class="row mt16" style="gap:10px">' +
      '<button class="btn btn-ghost grow" data-modal-close>取消</button>' +
      '<button class="btn ' + (danger ? 'btn-danger' : 'btn-primary') + ' grow" id="modal-ok">' + esc(okText || '確定') + '</button>' +
      '</div>'
    );
    $('#modal-ok').onclick = function () { closeModal(); onOk(); };
  }

  /* ---------- 頂部狀態列 ---------- */
  function refreshChips() {
    var d = State.data;
    var s = $('#chip-streak'), g = $('#chip-gems'), x = $('#chip-xp');
    if (s) s.textContent = d.g.streak;
    if (g) g.textContent = d.g.gems;
    if (x) x.textContent = d.today.xp;

    var pct = State.goalPct();
    var ring = $('#goal-ring');
    if (ring) {
      var C = 2 * Math.PI * 15.5;
      ring.style.strokeDasharray = C.toFixed(2);
      ring.style.strokeDashoffset = (C * (1 - pct)).toFixed(2);
      ring.style.stroke = pct >= 1 ? 'var(--gold)' : 'var(--green)';
    }
    var lab = $('#chip-goal-pct');
    if (lab) lab.textContent = pct >= 1 ? '✓' : Math.round(pct * 100) + '%';
  }

  function setNavActive(hash) {
    $$('.navbtn').forEach(function (b) {
      var target = b.getAttribute('data-nav');
      b.classList.toggle('active', hash.indexOf(target) === 0);
    });
  }

  /* ---------- 進度條 ---------- */
  function pbar(pct, cls) {
    return '<div class="pbar"><div class="pbar-fill ' + (cls || '') + '" style="width:' +
      Math.round(Math.max(0, Math.min(1, pct)) * 100) + '%"></div></div>';
  }

  /* ---------- 星星 ---------- */
  function stars(n) {
    var out = '';
    for (var i = 1; i <= 3; i++) out += (i <= n ? '⭐' : '☆');
    return out;
  }

  /* ---------- 剪貼簿 ---------- */
  function copy(text, okMsg) {
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); toast(okMsg || '已複製', 'good'); }
      catch (e) { toast('複製失敗，請手動選取', 'bad'); }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        toast(okMsg || '已複製', 'good');
      }, fallback);
    } else fallback();
  }

  /* ---------- 主題 ---------- */
  function applyTheme() {
    var t = State.data.profile.theme;
    if (t === 'auto') {
      t = (global.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', t);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#131f24' : '#58cc02');
  }

  /* ---------- 事件代理：所有 data-nav / data-modal-close ---------- */
  document.addEventListener('click', function (e) {
    var navEl = e.target.closest ? e.target.closest('[data-nav]') : null;
    if (navEl) { location.hash = navEl.getAttribute('data-nav'); return; }
    if (e.target.closest && e.target.closest('[data-modal-close]')) { closeModal(); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* ---------- 數字動畫 ---------- */
  function countUp(node, to, ms) {
    var from = 0, t0 = performance.now();
    ms = ms || 600;
    (function step(t) {
      var k = Math.min(1, (t - t0) / ms);
      node.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  global.UI = {
    $: $, $$: $$, esc: esc, el: el,
    toast: toast, modal: modal, closeModal: closeModal, confirm: confirm,
    refreshChips: refreshChips, setNavActive: setNavActive,
    pbar: pbar, stars: stars, copy: copy, applyTheme: applyTheme, countUp: countUp
  };
})(window);
