/* ==========================================================================
   lexicon.js — 詞庫：查得到的字

   課程單字（data/vocab-*.js）是「教得到的字」—— 綁關卡、有圖示、有刻意誘答。
   詞庫是「查得到的字」—— 不綁關卡，供例句點字查詢與詞庫特訓使用。
   兩者合起來約一萬二千字，也就是多益的字彙量級。

   三層，愈上面愈優先：
     1. 課程單字   Content.allVocab()      手寫，資料最完整
     2. 手寫詞庫   DATA_LEXICON_CORE       手寫，補課程沒教到的多益字
     3. 自動詞庫   DATA_LEXICON_1..6       tools/gen-lexicon.js 產生
   同一個字出現在多層時取最上面那層 —— 自動層的詞義是照詞頻排的，
   遇到 warranty（保固）這種多益專用意思會排在後面，手寫層就是為了蓋掉它。
   蓋掉不等於丟掉：手寫層沒寫的音標、英英與詞形變化會從自動層補回來，
   否則把一個字搬進手寫層（補例句的標準做法）反而讓卡片變薄。

   --------------------------------------------------------------------------
   對外的三件事：
     Lexicon.lookup(word)      查一個字（會自動還原詞形變化）
     Lexicon.markup(text)      把句子包成可點的 HTML
     Lexicon.open(word)        打開查詢卡

   索引是第一次用到才建的。一萬一千筆在開檔當下全部展開會拖慢啟動，
   而大部分的人打開 App 是要練習，不是要查字典。
   ========================================================================== */
(function (global) {
  'use strict';

  var esc = UI.esc;

  /* 自動層每一筆是一行 \t 分隔的字串，欄位順序見 data/lexicon-*.js 檔頭 */
  var F_W = 0, F_POS = 1, F_ZH = 2, F_PH = 3, F_EN = 4, F_FM = 5,
      F_TAG = 6, F_XE = 7, F_XZ = 8, F_USE = 9, F_FAM = 10;

  var FORM_LABEL = {
    p: '過去式', d: '過去分詞', i: '現在分詞', '3': '第三人稱單數',
    s: '複數', r: '比較級', t: '最高級'
  };

  var LEVEL_NAME = ['', '入門', '基礎', '進階', '中高', '高階', '罕用'];

  var UNKNOWN_ZH = '這個字還沒收進詞庫，先聽聽發音';

  /* 重音字母摺回 a–z。課程例句裡就有 café 與 résumé，而詞庫的鍵一律是純 ASCII
     （ECDICT 那份就是這樣），不摺的話點了也查不到。
     摺完剛好都查得到對的字：cafe 是咖啡館，resume 的手寫層第一個意思就是履歷。
     用配對字串現場展開而不是手寫一張對照表 —— 兩排字元要等長才不會錯位，
     而等長這件事沒有人檢查得出來。 */
  var FOLD = {};
  (function () {
    var groups = ['aàáâãäåāăą', 'eèéêëēĕėęě', 'iìíîïĩīĭįı', 'oòóôõöøōŏő',
                  'uùúûüũūŭůűų', 'cçćĉċč', 'nñńņň', 'yýÿŷ', 'sšśŝş', 'zžźż'];
    for (var i = 0; i < groups.length; i++) {
      for (var j = 1; j < groups[i].length; j++) FOLD[groups[i].charAt(j)] = groups[i].charAt(0);
    }
  })();

  /* ---------- 索引 ---------- */
  var byWord = null;     // 小寫字 → entry
  var byForm = null;     // 變化形 → 原形字（原形本身不列入）
  var ordered = null;    // 依級數、字母排好的全部 entry

  function makeAuto(rec, lv) {
    var f = String(rec).split('\t');
    var e = {
      id: 'lx:' + f[F_W],
      w: f[F_W],
      pos: f[F_POS] || '',
      zh: f[F_ZH] || '',
      kk: f[F_PH] || '',
      u: '',                       // 不綁關卡
      lx: 1, lv: lv,
      en: f[F_EN] || '',
      tags: (f[F_TAG] || '') ? f[F_TAG].split(' ') : [],
      use: f[F_USE] || '',
      fam: (f[F_FAM] || '') ? f[F_FAM].split(',') : [],
      forms: {}
    };
    (f[F_FM] || '').split(';').forEach(function (seg) {
      var i = seg.indexOf(':');
      if (i > 0) e.forms[seg.slice(0, i)] = seg.slice(i + 1);
    });
    if (f[F_XE]) e.ex = [[f[F_XE], f[F_XZ] || '']];
    return e;
  }

  /** 手寫層與課程單字都已經是物件，只要補上詞庫用得到的欄位 */
  function adopt(v, src, lv) {
    if (v.lx || v.__lx) return v;
    v.__lx = 1;
    v.lv = v.lv || lv || 0;
    v.tags = v.tags || [];
    v.forms = v.forms || {};
    v.src = src;
    return v;
  }

  /* 不規則複數推不出來，但它是一個封閉的小集合，寫死就寫死。
     不規則動詞有 data/irregular-verbs.js —— 那是課程要教的內容，有 A／B／C 三型；
     這幾個名詞沒有人要教，純粹是查不查得到的問題，所以放在規則旁邊而不是 data/。
     刻意不收 life／leaf／shelf 那組 -f→-ves：lives 與 leaves 同時是 live 與 leave
     的第三人稱，收進來等於跟動詞搶同一個鍵，而動詞天天出現、名詞複數難得一見。 */
  var IRREGULAR_PLURAL = {
    child: 'children', man: 'men', woman: 'women', person: 'people',
    tooth: 'teeth', foot: 'feet', goose: 'geese', mouse: 'mice', ox: 'oxen'
  };

  /* 規則變化：手寫層與課程單字都沒有 ECDICT 的 exchange 欄，只能照拼字規則推。
     推錯了頂多是查不到，不會查到別的字 —— byWord 永遠優先於 byForm，而自動層
     那些「資料是真的」的變化形又比規則先進索引（見 build()），form() 也不會去搶
     已經有人認領的鍵。所以這裡寧可多推：多推的沒有人會查，漏掉的天天被點到。 */
  function ruleForms(w) {
    var out = [], stem;
    if (/[^aeiou]y$/.test(w)) {                       // study → studies、busy → busier
      stem = w.slice(0, -1);
      out.push(stem + 'ies', stem + 'ied', w + 'ing', stem + 'ier', stem + 'iest');
    } else if (/(s|x|z|ch|sh)$/.test(w)) {
      out.push(w + 'es', w + 'ed', w + 'ing');
    } else if (/o$/.test(w)) {
      // -o 結尾兩種複數都真的存在：potato → potatoes，photo → photos
      out.push(w + 's', w + 'es', w + 'ed', w + 'ing');
    } else if (/e$/.test(w)) {                        // late → later／latest
      stem = w.slice(0, -1);
      out.push(w + 's', w + 'd', stem + 'ing', w + 'r', w + 'st');
    } else {
      out.push(w + 's', w + 'ed', w + 'ing', w + 'er', w + 'est');
    }
    // 短母音＋子音結尾就重複子音：stop → stopped、big → biggest、permit → permitted。
    // 只看最後三個字元而不管音節：英文其實是重音落在最後一音節才重複（permit 會、
    // visit 不會），但拼字看不出重音。多推的 visitted 沒有人會查，
    // 漏掉的 permitted、occurred、admitted、transferred 卻是職場例句的常客。
    if (/[^aeiou][aeiou][^aeiouwxy]$/.test(w)) {
      var dbl = w + w.charAt(w.length - 1);
      out.push(dbl + 'ed', dbl + 'ing', dbl + 'er', dbl + 'est');
    }
    if (IRREGULAR_PLURAL[w]) out.push(IRREGULAR_PLURAL[w]);
    if (/man$/.test(w)) out.push(w.slice(0, -3) + 'men');   // businessman → businessmen
    // 動名詞當名詞用就數得出來：feel → feeling → feelings，save → savings。
    // 從上面已經推好的 -ing 再加 s，各分支才不必各寫一次。
    for (var i = out.length - 1; i >= 0; i--) {
      if (/ing$/.test(out[i])) out.push(out[i] + 's');
    }
    return out;
  }

  function build() {
    byWord = {};
    byForm = {};
    ordered = [];

    function put(e) {
      var k = e.w.toLowerCase();
      if (byWord[k]) return;          // 先進來的贏：課程 → 手寫 → 自動
      byWord[k] = e;
      ordered.push(e);
    }

    function hasKey(o) {
      for (var k in o) { if (Object.prototype.hasOwnProperty.call(o, k)) return true; }
      return false;
    }

    /**
     * 手寫層蓋掉自動層時，把只有自動層有的欄位補回去。
     *
     * 手寫層存在的理由是改對詞義、補上例句與延伸用法；音標、英英解釋與詞形變化
     * 這三樣 ECDICT 本來就給得比人手抄的正確也齊全。不補回去的話，把一個字搬進
     * lexicon-core.js 反而讓卡片少了一半內容 —— 而「搬進手寫層」正是補例句的標準
     * 做法，等於每補一個字就砸掉一個字。
     */
    function backfill(base, auto) {
      if (!base.kk && auto.kk) base.kk = auto.kk;
      if (!base.en && auto.en) base.en = auto.en;
      if (!base.use && auto.use) base.use = auto.use;
      if (!hasKey(base.forms) && hasKey(auto.forms)) base.forms = auto.forms;
      if (!(base.fam && base.fam.length) && auto.fam.length) base.fam = auto.fam;
      // biz 決定這個字進不進「商務主題」那批特訓，手寫時漏標就從那批裡消失了
      if (auto.tags.indexOf('biz') >= 0 && base.tags.indexOf('biz') < 0) base.tags.push('biz');
    }

    /**
     * 手寫層碰上課程已經教過的字（address、order、last…）。
     * 課程那筆資料比較完整（有圖示、誘答、綁關卡），所以詞義與例句一律以它為準，
     * 但手寫層的「延伸用法」與「同家族」是課程資料沒有的，補上去。
     *
     * 只補這兩個純顯示的欄位是刻意的：col 會被 collocate 題型當題庫抽，
     * 從這裡偷偷塞進去等於繞過 CLAUDE.md 對搭配詞的那一串限制。
     */
    function enrich(base, extra) {
      if (extra.note && !base.note) base.note = extra.note;
      if (extra.fam && extra.fam.length && !(base.fam && base.fam.length)) base.fam = extra.fam;
    }

    // 1) 課程單字
    Content.allVocab().forEach(function (v) { put(adopt(v, 'vocab', 0)); });

    // 2) 手寫詞庫
    (global.DATA_LEXICON_CORE || []).forEach(function (v) {
      var k = v.w.toLowerCase();
      if (byWord[k]) { enrich(byWord[k], v); return; }
      put(adopt(v, 'core', v.lv || 0));
    });

    // 3) 自動詞庫
    for (var lv = 1; lv <= 6; lv++) {
      var arr = global['DATA_LEXICON_' + lv];
      if (!arr || !arr.length) continue;
      for (var i = 0; i < arr.length; i++) {
        var e = makeAuto(arr[i], lv);
        e.src = 'auto';
        var seat = byWord[e.w.toLowerCase()];
        if (seat) {
          if (seat.src === 'core') backfill(seat, e);
          // 課程單字只補詞形變化。詞義、例句、音標都是手寫校過的，不能被蓋掉，
          // 但 data/vocab-*.js 從來沒有 forms 這一欄 —— 沒補的話，課程教過的字
          // 反而只剩規則推得出來的變化，occur 的 occurred、oversee 的 overseen
          // 這些 ECDICT 明明給了的變化形全部掉在地上（77 個字有這個問題）。
          else if (seat.src === 'vocab' && !hasKey(seat.forms) && hasKey(e.forms)) seat.forms = e.forms;
          continue;
        }
        put(e);
      }
    }

    // 詞形變化索引。先跑自動層（資料是真的），再用規則補其他兩層。
    function form(f, base) {
      if (!f) return;
      f = f.toLowerCase();
      if (byWord[f] || byForm[f]) return;   // 本身就是詞條，或已經有人認領
      byForm[f] = base;
    }
    ordered.forEach(function (e) {
      var base = e.w.toLowerCase();
      for (var k in e.forms) {
        if (!Object.prototype.hasOwnProperty.call(e.forms, k)) continue;
        form(e.forms[k], base);
        // 動名詞當名詞用就數得出來：feelings、savings、drawings。
        // ECDICT 的 exchange 只給到 -ing，複數得自己接 —— 自動層不跑 ruleForms()，
        // 這一個字尾是唯一從真資料接得出來、又真的常被點到的變化。
        if (k === 'i') form(e.forms[k] + 's', base);
      }
    });
    ordered.forEach(function (e) {
      if (e.src === 'auto') return;
      var base = e.w.toLowerCase();
      if (/\s/.test(base)) return;          // 片語不推變化
      ruleForms(base).forEach(function (f) { form(f, base); });
    });
    // 不規則動詞的三態：規則推不出來，資料裡本來就有
    (Content.irregulars() || []).forEach(function (iv) {
      if (!byWord[iv.v]) return;
      form(iv.p, iv.v);
      form(iv.pp, iv.v);
      form(iv.v + 'ing', iv.v);
    });

    ordered.sort(function (a, b) {
      return (a.lv || 0) - (b.lv || 0) || a.w.localeCompare(b.w);
    });
  }

  function ready() { if (!byWord) build(); }

  /* ---------- 查詢 ---------- */
  /* 空白要留著：課程收了 office worker、thank you 這種詞組，
     整個詞組本身就是一筆詞條，去掉空白就查不到了 */
  function norm(w) {
    return String(w || '').toLowerCase().replace(/[’‘]/g, "'")
      .replace(/[^\x00-\x7f]/g, function (c) { return FOLD[c] || c; })
      .replace(/[^a-z' -]/g, '').replace(/\s+/g, ' ').trim();
  }

  /**
   * 縮寫剝成開頭那個字：點到 can't 要開的是 can 的卡。
   *
   * ExUtil.matchAny() 也展開縮寫，但那是為了比對整句，展開成完整寫法
   * （I'm → I am）；查詢這一側要的是單一個詞條，所以只留開頭那個字。
   * 's 與 'd 在比對那側因為有歧義（is/has、would/had）刻意不展開，
   * 在這裡沒有這個問題 —— it's 和 it'd 都是問 it 這個字。
   */
  function contractionHead(k) {
    // 這三個剝不出開頭那個字：n 是 can 自己的、won't 與 shan't 連字都換了
    if (k === "can't") return 'can';
    if (k === "won't") return 'will';
    if (k === "shan't") return 'shall';
    if (k === "let's") return 'let';
    if (/n't$/.test(k)) return k.slice(0, -3);          // isn't → is、didn't → did
    var m = k.match(/^(.+?)'(m|re|ll|ve|d)$/);
    return m ? m[1] : '';
  }

  /**
   * 查一個字。
   * @returns {null|{entry, base, via}} via 是「透過哪個變化形查到的」，
   *          例如查 abandoned 會回 via='過去式'，卡片上要說明清楚，
   *          否則使用者會以為 abandoned 這個字本身就長這樣。
   */
  function lookup(word) {
    ready();
    var k = norm(word);
    if (!k) return null;
    if (byWord[k]) return { entry: byWord[k], via: '' };

    // 所有格：the manager's → manager。複數的所有格只有一撇（two weeks' notice）
    var poss = k.replace(/'s$|'$/, '');
    if (poss !== k && byWord[poss]) return { entry: byWord[poss], via: '所有格' };

    // 縮寫在變化形之前試：I'm 的 m 不是任何字的變化形，剝掉才查得到 I
    var head = contractionHead(k);
    if (head && head !== k) {
      var hh = lookup(head);
      if (hh) return { entry: hh.entry, via: '縮寫' };
    }

    var base = byForm[k] || byForm[poss];
    if (base && byWord[base]) {
      var e = byWord[base], via = '變化形';
      for (var f in e.forms) {
        if (Object.prototype.hasOwnProperty.call(e.forms, f) &&
            String(e.forms[f]).toLowerCase() === k) { via = FORM_LABEL[f] || via; break; }
      }
      if (via === '變化形') {
        if (/ing$/.test(k)) via = '現在分詞';
        else if (/ied$|ed$/.test(k)) via = '過去式／過去分詞';
        else if (/ies$|es$|s$/.test(k)) via = '複數／第三人稱';
      }
      return { entry: e, via: via };
    }
    return null;
  }

  function item(id) {
    ready();
    if (String(id || '').indexOf('lx:') !== 0) return null;
    return byWord[String(id).slice(3)] || null;
  }

  function all() { ready(); return ordered; }
  function count() { ready(); return ordered.length; }

  /** 依級數取一批字，給詞庫特訓用 */
  function byLevel(lv) {
    ready();
    return ordered.filter(function (e) { return (e.lv || 0) === lv; });
  }

  function byTag(tag) {
    ready();
    return ordered.filter(function (e) { return (e.tags || []).indexOf(tag) >= 0; });
  }

  /** 搜尋：英文開頭優先，其次英文包含，最後中文包含 */
  function search(q, limit) {
    ready();
    q = String(q || '').trim().toLowerCase();
    if (!q) return [];
    var starts = [], has = [], zh = [];
    for (var i = 0; i < ordered.length; i++) {
      var e = ordered[i];
      var w = e.w.toLowerCase();
      if (w.indexOf(q) === 0) starts.push(e);
      else if (w.indexOf(q) > 0) has.push(e);
      else if (e.zh && e.zh.indexOf(q) >= 0) zh.push(e);
    }
    return starts.concat(has, zh).slice(0, limit || 60);
  }

  /* ==========================================================================
     把句子包成可點的字
     ========================================================================== */
  /**
   * 先轉義再包 span，所以字串裡會有 &amp; &#39; 這些實體 ——
   * 正規表示式必須先把實體整段吃掉，否則 &amp; 裡的 amp 會被當成一個英文字包起來。
   */
  /**
   * 字母範圍含重音字母，否則 café 會斷成可點的 caf 加一個掉在 span 外面的 é。
   *
   * `&#39;` 要當成字中的那一撇吃進單字裡：先轉義再包 span，所以 doesn't 走到這裡
   * 已經是 doesn&#39;t —— 不吃的話每一個縮寫都被那個實體切成兩半（doesn ／ t），
   * 兩半都查不到，contractionHead() 根本沒機會出手。
   * 其餘實體照舊整段吃掉，否則 &amp; 裡的 amp 會被當成一個英文字包起來。
   */
  var TOKEN_RE = /&[a-zA-Z]+;|&#\d+;|([A-Za-zÀ-ÖØ-öø-ÿ](?:[A-Za-zÀ-ÖØ-öø-ÿ’-]|&#39;)*)/g;

  /** word 是「已經轉義過」的字，查詢與 data 屬性都要用還原後的寫法 */
  function span(word) {
    var plain = word.replace(/&#39;/g, "'");
    return '<span class="lexw' + (lookup(plain) ? ' known' : '') + '" data-lexw="' +
      esc(plain) + '">' + word + '</span>';
  }

  function markup(text, opts) {
    opts = opts || {};
    ready();
    var html = esc(text).replace(TOKEN_RE, function (m, word) {
      if (!word) return m;                       // HTML 實體，原樣放回
      // 連字號複合字整串查不到就拆開分別包（two-year → two ／ year）。
      // 這種字詞庫收不完，但拆開後每一段都查得到，整串不可點才是最糟的結果。
      if (word.indexOf('-') > 0 && !lookup(word.replace(/&#39;/g, "'"))) {
        return word.replace(/[^-]+/g, span);
      }
      return span(word);
    });
    return opts.br === false ? html : html.replace(/\n/g, '<br>');
  }

  /* ==========================================================================
     查詢卡
     ========================================================================== */
  var pop = null;
  var stack = [];        // 從例句再點進去時，留一條回頭路
  var current = '';      // 目前卡片上的字

  function chip(text, sub) {
    return '<span class="lexchip">' + esc(text) +
      (sub ? '<em>' + esc(sub) + '</em>' : '') + '</span>';
  }

  function wordChip(w) {
    return '<button class="lexchip link" type="button" data-lexw="' + esc(w) + '">' +
      esc(w) + '</button>';
  }

  /** 延伸用法：詞形變化、衍生字、搭配詞、字根、英英解釋 */
  function extendHTML(e) {
    var rows = [];

    var forms = [];
    for (var i = 0; i < ['p', 'd', 'i', '3', 's', 'r', 't'].length; i++) {
      var k = ['p', 'd', 'i', '3', 's', 'r', 't'][i];
      if (e.forms && e.forms[k]) forms.push(chip(e.forms[k], FORM_LABEL[k]));
    }
    if (forms.length) rows.push('<div class="lexrow"><b>詞形變化</b><div>' + forms.join('') + '</div></div>');

    if (e.fam && e.fam.length) {
      rows.push('<div class="lexrow"><b>同家族</b><div>' +
        e.fam.map(wordChip).join('') + '</div></div>');
    }

    if (e.col && e.col.length) {
      rows.push('<div class="lexrow"><b>常見搭配</b><div>' +
        e.col.map(function (c) { return chip(c[0], c[1]); }).join('') + '</div></div>');
    }

    if (e.rt) rows.push('<div class="lexrow"><b>字根字首</b>' + ExUtil.rootHTML(e) + '</div>');

    if (e.note) rows.push('<div class="lexnote">' + esc(e.note) + '</div>');

    if (e.en) rows.push('<div class="lexrow"><b>英英</b><div class="lexen">' + esc(e.en) + '</div></div>');

    if (!rows.length) return '';
    return '<div class="lexsec"><div class="lexsec-h">延伸用法</div>' + rows.join('') + '</div>';
  }

  /** 範例：手寫的中英例句最好，其次 WordNet 的英文用法示例 */
  function exampleHTML(e) {
    var rows = [];
    (e.ex || []).forEach(function (p) {
      if (!p || !p[0]) return;
      rows.push('<div class="ex-item">' + Speech.btn(p[0], false, 'speak-inline') +
        '<div class="sentence-en">' + markup(p[0]) + '</div>' +
        (p[1] ? '<div class="sentence-zh">' + esc(p[1]) + '</div>' : '') + '</div>');
    });
    if (!rows.length && e.use) {
      rows.push('<div class="ex-item">' + Speech.btn(e.use, false, 'speak-inline') +
        '<div class="sentence-en">' + markup(e.use) + '</div>' +
        '<div class="sentence-zh muted small">（英文用法示例，尚未附中譯）</div></div>');
    }
    if (!rows.length) {
      return '<div class="lexsec"><div class="lexsec-h">範例</div>' +
        '<p class="muted small">這個字還沒有例句。詞庫的例句正在逐批補上，' +
        '先聽發音、看詞形變化也記得住。</p></div>';
    }
    return '<div class="lexsec"><div class="lexsec-h">範例</div>' +
      '<div class="ex-list">' + rows.join('') + '</div></div>';
  }

  function srsLine(e) {
    var lvl = SRS.levelOf(e.id);
    if (!lvl) return '<span class="muted small">還沒學過</span>';
    return '<span class="small">' +
      ['', '學習中', '熟悉', '精熟'][lvl] + '　下次複習 ' +
      esc((State.data.srs[e.id] || {}).due || '') + '</span>';
  }

  /** 一張完整的詞條卡（查詢卡與詞庫頁共用） */
  function cardHTML(hit) {
    var e = hit.entry;
    var tagHtml = (e.tags || []).filter(function (t) { return t !== 'biz'; })
      .slice(0, 4).map(function (t) { return '<span class="lextag">' + esc(t) + '</span>'; }).join('');
    if ((e.tags || []).indexOf('biz') >= 0) tagHtml = '<span class="lextag biz">商務</span>' + tagHtml;
    if (e.lv) tagHtml += '<span class="lextag lv">' + LEVEL_NAME[e.lv] + '</span>';
    if (e.u) tagHtml += '<span class="lextag unit">課程有教</span>';

    return '<div class="lexcard">' +
      '<div class="lexhead">' +
        (e.ic ? '<div class="lexic">' + e.ic + '</div>' : '') +
        '<div class="grow">' +
          '<div class="lexw-main">' + esc(e.w) + '</div>' +
          (e.kk ? '<div class="word-kk">[' + esc(e.kk) + ']</div>' : '') +
        '</div>' +
        '<div class="row" style="gap:6px">' + Speech.btn(e.w) + Speech.btn(e.w, true) + '</div>' +
      '</div>' +
      (hit.via ? '<div class="lexvia">你點的是 <b>' + esc(hit.word || '') + '</b>　' +
        esc(e.w) + ' 的' + esc(hit.via) + '</div>' : '') +
      '<div class="lexzh"><span class="word-pos">' + esc(e.pos || '') + '</span>' + esc(e.zh) + '</div>' +
      (tagHtml ? '<div class="lextags">' + tagHtml + '</div>' : '') +
      extendHTML(e) +
      exampleHTML(e) +
      // 查不到的字沒有詞條可考，加進複習佇列只會變成永遠出不了題的黑洞
      (e.zh === UNKNOWN_ZH ? '' :
        '<div class="lexfoot">' + srsLine(e) +
          '<button class="btn btn-ghost small" type="button" data-lex-add="' + esc(e.id) + '">' +
          (SRS.has(e.id) ? '重設複習' : '加入複習') + '</button>' +
        '</div>') +
    '</div>';
  }

  /* ---------- 浮動查詢卡 ---------- */
  function close() {
    if (pop && pop.parentNode) pop.parentNode.removeChild(pop);
    pop = null;
    stack = [];
    current = '';
  }

  function render(hit, anchor) {
    if (!pop) {
      pop = document.createElement('div');
      pop.className = 'lexpop';
      document.body.appendChild(pop);
    }
    pop.innerHTML =
      '<div class="lexpop-bar">' +
        (stack.length ? '<button class="lexpop-back" type="button" data-lex-back>‹ ' +
           esc(stack[stack.length - 1]) + '</button>' : '<span></span>') +
        '<button class="lexpop-x" type="button" data-lex-close aria-label="關閉">✕</button>' +
      '</div>' +
      '<div class="lexpop-body">' + cardHTML(hit) + '</div>';

    position(anchor);
  }

  /**
   * 桌機貼著被點的字浮出來，手機直接貼底 —— 卡片內容比以前多得多，
   * 在窄畫面硬要浮在字旁邊會蓋掉整個句子，反而看不到上下文。
   */
  function position(anchor) {
    if (!pop) return;
    var narrow = window.innerWidth < 640;
    pop.classList.toggle('sheet', narrow);
    if (narrow || !anchor) { pop.style.left = ''; pop.style.top = ''; return; }

    var r = anchor.getBoundingClientRect();
    var w = pop.offsetWidth, h = pop.offsetHeight;
    var left = Math.max(8, Math.min(window.innerWidth - w - 8, r.left + r.width / 2 - w / 2));
    var top = r.top - h - 10;
    if (top < 8) top = Math.min(window.innerHeight - h - 8, r.bottom + 10);
    if (top < 8) top = 8;
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
  }

  function open(word, anchor, push) {
    var hit = lookup(word);
    if (!hit) {
      // 查不到也要給東西 —— 至少讓他聽得到怎麼唸
      hit = { entry: { id: 'lx:' + norm(word), w: String(word), pos: '', zh: UNKNOWN_ZH,
                       tags: [], forms: {}, fam: [] }, via: '' };
    }
    hit.word = word;
    // 從例句裡再點一個字時把原本那張卡記下來，才回得去
    if (push && pop && current && current !== word) stack.push(current);
    current = word;
    render(hit, anchor);
    Speech.speak(hit.entry.w, { rate: 0.85 });
  }

  /* ---------- 事件代理 ---------- */
  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;

    if (e.target.closest('[data-lex-close]')) { close(); return; }

    if (e.target.closest('[data-lex-back]')) {
      var prev = stack.pop();
      if (prev) { current = ''; open(prev, null, false); }
      else close();
      return;
    }

    var add = e.target.closest('[data-lex-add]');
    if (add) {
      var id = add.getAttribute('data-lex-add');
      SRS.grade(id, 1);
      UI.toast('已加入複習佇列', 'good');
      add.textContent = '重設複習';
      return;
    }

    var w = e.target.closest('[data-lexw]');
    if (w) {
      open(w.getAttribute('data-lexw'), w, !!pop);
      return;
    }

    if (pop && !e.target.closest('.lexpop')) close();
  });

  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  window.addEventListener('resize', function () { if (pop) position(null); });

  global.Lexicon = {
    lookup: lookup, item: item, all: all, count: count,
    byLevel: byLevel, byTag: byTag, search: search,
    markup: markup, cardHTML: cardHTML, open: open, close: close,
    LEVEL_NAME: LEVEL_NAME
  };
})(window);
