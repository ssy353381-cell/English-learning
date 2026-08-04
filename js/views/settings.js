/* ==========================================================================
   views/settings.js — 設定、備份、手機同步
   ========================================================================== */
(function (global) {
  'use strict';

  var esc = UI.esc;
  global.Views = global.Views || {};

  Views.settings = function () {
    var p = State.data.profile;
    var voices = Speech.voiceList();

    UI.$('#view').innerHTML =
      '<h1>設定</h1>' +

      /* ---- 學習 ---- */
      '<div class="card">' +
        '<div class="card-title">🎯 每日目標</div>' +
        '<div class="seg" id="goalseg">' +
          [20, 40, 60].map(function (m) {
            return '<button data-goal="' + m + '" class="' + (p.goalMin === m ? 'on' : '') + '">' +
              m + ' 分鐘</button>';
          }).join('') +
        '</div>' +
        '<p class="small muted mt8 mb0">目標換算成 ' + (p.goalMin * 3) + ' XP。達標當天連續天數才會 +1。</p>' +
      '</div>' +

      /* ---- 語音 ---- */
      '<div class="card">' +
        '<div class="card-title">🔊 語音</div>' +
        (voices.length
          ? '<div class="list-row"><div class="grow">英文語音</div>' +
            '<select id="voicesel" class="btn btn-sm btn-ghost">' +
              voices.map(function (v) {
                return '<option value="' + esc(v.name) + '"' + (p.voice === v.name ? ' selected' : '') + '>' +
                  esc(v.name.replace(/^Microsoft /, '').slice(0, 28)) + '</option>';
              }).join('') +
            '</select></div>'
          : '<div class="warn-box">找不到英文語音。Windows 請到「設定 → 時間與語言 → 語音 → 管理語音 → 新增語音」' +
            '安裝 English，然後重新整理這一頁。</div>') +

        '<div class="list-row"><div class="grow">朗讀速度<div class="small muted" id="ratelab">' +
          p.rate.toFixed(2) + '×</div></div>' +
          '<input type="range" id="rate" min="0.5" max="1.2" step="0.05" value="' + p.rate + '" style="width:140px"></div>' +

        toggleRow('autoPlay', '出現英文時自動朗讀', p.autoPlay) +
        toggleRow('sound', '答題音效', p.sound) +

        '<button class="btn btn-blue btn-block btn-sm mt8" id="testvoice">🔈 試聽</button>' +
      '</div>' +

      /* ---- 顯示 ---- */
      '<div class="card">' +
        '<div class="card-title">🎨 顯示</div>' +
        '<div class="list-row"><div class="grow">主題</div>' +
          '<div class="seg" style="width:190px" id="themeseg">' +
            [['auto', '跟系統'], ['light', '淺色'], ['dark', '深色']].map(function (t) {
              return '<button data-theme="' + t[0] + '" class="' + (p.theme === t[0] ? 'on' : '') + '">' + t[1] + '</button>';
            }).join('') +
          '</div></div>' +
        toggleRow('showKK', '顯示 KK 音標', p.showKK) +
        '<div class="list-row"><div class="grow">暱稱</div>' +
          '<input id="nick" class="blank-input" style="min-width:120px;text-align:right" ' +
          'value="' + esc(p.nickname) + '" placeholder="（選填）" maxlength="12"></div>' +
      '</div>' +

      /* ---- 備份與同步 ---- */
      '<div class="card">' +
        '<div class="card-title">💾 備份與手機同步</div>' +
        '<p class="small muted">進度存在這個瀏覽器裡。換裝置、清快取前請先備份。</p>' +
        '<div class="stack">' +
          '<button class="btn btn-primary" id="exp">⬇️ 下載進度檔</button>' +
          '<button class="btn btn-blue" id="code">📋 複製進度碼（傳到手機用）</button>' +
          '<button class="btn btn-ghost" id="imp">⬆️ 匯入進度檔</button>' +
          '<button class="btn btn-ghost" id="paste">📥 貼上進度碼</button>' +
        '</div>' +
        '<input type="file" id="file" accept=".json,application/json" hidden>' +
        '<div class="hint-box mt16">手機同步做法：在電腦按「複製進度碼」→ 用 LINE 或 Email 傳給自己 →' +
        '在手機上開同一個 App → 按「貼上進度碼」。反過來也一樣。</div>' +
      '</div>' +

      /* ---- 資料 ---- */
      '<div class="card">' +
        '<div class="card-title">📊 目前資料</div>' +
        dataSummary() +
      '</div>' +

      '<div class="card">' +
        '<div class="card-title">⚠️ 危險區</div>' +
        '<button class="btn btn-danger btn-block" id="reset">清除所有進度</button>' +
      '</div>' +

      '<p class="center tiny faint mt24">English Quest ・ 存檔格式 v' + State.VERSION + '</p>';

    bind();
  };

  function toggleRow(key, label, on) {
    return '<div class="list-row"><div class="grow">' + label + '</div>' +
      '<label class="switch"><input type="checkbox" data-toggle="' + key + '"' + (on ? ' checked' : '') + '>' +
      '<span class="switch-track"></span><span class="switch-knob"></span></label></div>';
  }

  function dataSummary() {
    var d = State.data;
    var st = SRS.stats();
    var units = 0;
    for (var k in d.units) if (d.units[k].s > 0) units++;
    var bytes = 0;
    try { bytes = new Blob([State.toJSON()]).size; } catch (e) {}
    return '<table class="tbl"><tbody>' +
      '<tr><td>開始學習日</td><td class="right bold">' + esc(d.created) + '</td></tr>' +
      '<tr><td>學過的單字</td><td class="right bold">' + st.seen + '</td></tr>' +
      '<tr><td>通關數</td><td class="right bold">' + units + '</td></tr>' +
      '<tr><td>紀錄天數</td><td class="right bold">' + Object.keys(d.hist).length + '</td></tr>' +
      '<tr><td>存檔大小</td><td class="right bold">' + (bytes ? (bytes / 1024).toFixed(1) + ' KB' : '—') + '</td></tr>' +
      '</tbody></table>';
  }

  function bind() {
    var p = State.data.profile;

    UI.$$('#goalseg [data-goal]').forEach(function (b) {
      b.onclick = function () {
        p.goalMin = +b.getAttribute('data-goal');
        State.save(true); UI.refreshChips(); Views.settings();
      };
    });

    UI.$$('#themeseg [data-theme]').forEach(function (b) {
      b.onclick = function () {
        p.theme = b.getAttribute('data-theme');
        State.save(true); UI.applyTheme(); Views.settings();
      };
    });

    UI.$$('[data-toggle]').forEach(function (c) {
      c.onchange = function () {
        p[c.getAttribute('data-toggle')] = c.checked;
        State.save(true);
      };
    });

    var rate = UI.$('#rate');
    if (rate) rate.oninput = function () {
      p.rate = +rate.value;
      UI.$('#ratelab').textContent = p.rate.toFixed(2) + '×';
      State.save();
    };

    var vs = UI.$('#voicesel');
    if (vs) vs.onchange = function () {
      p.voice = vs.value; State.save(true); Speech.reloadVoices();
      Speech.speak('Hello, let\'s learn English together.');
    };

    var tv = UI.$('#testvoice');
    if (tv) tv.onclick = function () {
      Speech.speak('The meeting will start at nine thirty in the main conference room.');
    };

    var nick = UI.$('#nick');
    if (nick) nick.onchange = function () { p.nickname = nick.value.trim(); State.save(true); };

    UI.$('#exp').onclick = function () { State.download(); UI.toast('已下載進度檔', 'good'); };

    UI.$('#code').onclick = function () {
      var code = State.toCode();
      UI.copy(code, '進度碼已複製（' + (code.length / 1024).toFixed(1) + ' KB）');
    };

    UI.$('#imp').onclick = function () { UI.$('#file').click(); };
    UI.$('#file').onchange = function (e) {
      var f = e.target.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          State.importJSON(r.result);
          UI.toast('進度已還原', 'good');
          UI.applyTheme(); UI.refreshChips(); Views.settings();
        } catch (err) {
          UI.toast('匯入失敗：' + err.message, 'bad', 4000);
        }
      };
      r.readAsText(f);
    };

    UI.$('#paste').onclick = function () {
      UI.modal(
        '<h2>貼上進度碼</h2>' +
        '<p class="muted small">把另一台裝置複製的進度碼整段貼進來。這會覆蓋目前的進度。</p>' +
        '<textarea class="textarea" id="codein" style="min-height:120px" placeholder="EQ1:..."></textarea>' +
        '<div class="row mt16" style="gap:10px">' +
          '<button class="btn btn-ghost grow" data-modal-close>取消</button>' +
          '<button class="btn btn-primary grow" id="doimport">匯入</button></div>'
      );
      UI.$('#doimport').onclick = function () {
        try {
          State.fromCode(UI.$('#codein').value);
          UI.closeModal();
          UI.toast('進度已還原', 'good');
          UI.applyTheme(); UI.refreshChips(); Views.settings();
        } catch (err) {
          UI.toast('進度碼無效', 'bad', 3500);
        }
      };
    };

    UI.$('#reset').onclick = function () {
      UI.confirm('確定要清除所有進度？',
        '所有單字記憶排程、關卡星等、連續天數都會歸零，<b>而且無法復原</b>。<br><br>' +
        '建議先按「下載進度檔」備份。',
        '我確定，全部清除', function () {
          State.reset();
          UI.applyTheme(); UI.refreshChips();
          UI.toast('已清除，重新開始', 'good');
          location.hash = '#/home';
        }, true);
    };
  }
})(window);
