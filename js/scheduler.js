/* ==========================================================================
   scheduler.js — 組裝題目佇列
   關卡的 plan 只描述「要出哪些題、各幾題」，真正挑哪些單字/句子在這裡決定。
   原則：新字優先教、舊字混進來複習、句子從例句庫抽。
   ========================================================================== */
(function (global) {
  'use strict';

  var S = Content.shuffle, SAMPLE = Content.sample, PICK = Content.pick;

  /* ---------- 挑單字 ---------- */

  /** 這一關還沒學過（沒進 SRS）的字 */
  function unseenOf(unitId) {
    return Content.vocabOf(unitId).filter(function (v) { return !SRS.has(v.id); });
  }

  /** 挑 n 個「這關要新教」的字：先給沒學過的，沒了就挑最生疏的回鍋 */
  function newWords(unitId, n) {
    var unseen = unseenOf(unitId);
    if (unseen.length >= n) return unseen.slice(0, n);

    var rest = Content.vocabOf(unitId)
      .filter(function (v) { return SRS.has(v.id); })
      .sort(function (a, b) { return SRS.levelOf(a.id) - SRS.levelOf(b.id); });
    return unseen.concat(rest.slice(0, n - unseen.length));
  }

  /** 練習用字：這關的字 + 一部分舊字（讓複習自然發生） */
  /* 練習池至少要湊到這麼多個字，配方裡最多的一項（魔王關的 recall 10）才排得滿 */
  var MIN_POOL = 16;

  function practicePool(unitId, focus) {
    var here = Content.vocabOf(unitId);
    var older = Content.vocabUpTo(unitId).filter(function (v) { return v.u !== unitId && SRS.has(v.id); });
    var due = older.filter(function (v) { return State.data.srs[v.id].due <= State.dayStr(); });
    return (focus || []).concat(here, SAMPLE(due, 8), SAMPLE(older, 6));
  }

  function dedupe(list) {
    var seen = {}, out = [];
    list.forEach(function (v) { if (v && !seen[v.id]) { seen[v.id] = 1; out.push(v); } });
    return out;
  }

  /* ---------- 挑句子 ---------- */

  /** 從單字例句庫抽句子。回傳 {en, zh, from} */
  function sentencesFrom(vocabList, opts) {
    opts = opts || {};
    var out = [];
    vocabList.forEach(function (v) {
      (v.ex || []).forEach(function (pair, i) {
        var en = pair[0], zh = pair[1];
        var wc = en.split(/\s+/).length;
        if (opts.maxWords && wc > opts.maxWords) return;
        if (opts.minWords && wc < opts.minWords) return;
        // pair[2] 是這句專用的誘答字塊，沒寫就是 undefined（舊資料一律如此）
        out.push({ en: en, zh: zh, from: v.id, kind: i === 0 ? 'daily' : 'work', lure: pair[2] });
      });
    });
    return out;
  }

  /** 文法點自帶的練習句 */
  function grammarSentences(unitId) {
    var out = [];
    Content.grammarOf(unitId).forEach(function (g) {
      (g.sents || []).forEach(function (p) {
        out.push({ en: p[0], zh: p[1], from: g.id, kind: 'grammar', lure: p[2] });
      });
    });
    return out;
  }

  /** 文法題（依 k 種類過濾） */
  function grammarQuestions(unitId, kinds, n) {
    var pool = [];
    Content.grammarOf(unitId).forEach(function (g) {
      (g.qs || []).forEach(function (q) {
        if (!kinds || kinds.indexOf(q.k) >= 0) {
          pool.push({ g: g, q: q });
        }
      });
    });
    // 這關的題不夠就往前面的關卡借
    if (pool.length < n) {
      Content.grammarUpTo(unitId).forEach(function (g) {
        if (g.u === unitId) return;
        (g.qs || []).forEach(function (q) {
          if (!kinds || kinds.indexOf(q.k) >= 0) pool.push({ g: g, q: q });
        });
      });
    }
    return SAMPLE(pool, n);
  }

  /* ==========================================================================
     組裝關卡佇列
     ========================================================================== */
  function buildLesson(unitId) {
    var u = Content.unit(unitId);
    var recipe = Content.planOf(unitId);   // 起步取向可能會換掉發音關卡的配方
    if (!u || !recipe) return [];

    var queue = [];
    var intro = [];
    var cards = [];
    var body = [];
    var tail = [];

    var focus = [];   // 這關新教的字，其他題型優先用它們
    var plan = {};
    recipe.forEach(function (p) { plan[p[0]] = p[1]; });

    // 有教新字的關卡就自動配拼字題（課表沒特別指定時）。
    // 「認得出來」和「拼得出來」是兩件事，後者才撐得住寫作與聽寫。
    if (plan.flashcard && plan.spell === undefined) {
      plan.spell = Math.max(2, Math.round(plan.flashcard / 3));
    }

    /* --- 1. 教學卡 --- */
    if (plan.intro) {
      if (u.phonics && Content.phonics(u.phonics)) {
        intro.push({ type: 'intro', kind: 'phonics', ref: Content.phonics(u.phonics), unitId: unitId });
      }
      if (u.irregular && Content.irregulars().length) {
        intro.push({ type: 'intro', kind: 'irregular', ref: Content.irregulars(), unitId: unitId });
      }
      Content.grammarOf(unitId).forEach(function (g) {
        if (g.teach) intro.push({ type: 'intro', kind: 'grammar', ref: g, unitId: unitId });
      });
    }

    /* --- 2. 單字卡（新字） --- */
    if (plan.flashcard) {
      focus = newWords(unitId, plan.flashcard);
      focus.forEach(function (v) {
        cards.push({ type: 'flashcard', ref: v, unitId: unitId });
      });
    }

    var pool = dedupe(practicePool(unitId, focus));
    /* 魔王關與純聽力關（Part 1／2、Part 3／4、Part 6／7）沒有自己的單字，
       練習池全靠 practicePool 收的「學過**而且進過 SRS**」的舊字。SRS 還空著的時候
       —— 剛匯入存檔、或靠跳關測驗一路上來 —— 那些關卡會靜靜地少掉一整批題：
       配方寫了 recall 10、listen 5，實際一題都沒有。
       抽到還沒複習到期的舊字，總比整組題目消失好。 */
    if (pool.length < MIN_POOL) {
      pool = dedupe(pool.concat(SAMPLE(Content.vocabUpTo(unitId), MIN_POOL - pool.length)));
    }
    var focusOrPool = focus.length ? focus : pool;

    /* --- 3. 單字回想（中英互選） --- */
    if (plan.recall) {
      var rc = SAMPLE(pool, plan.recall);
      // 不足就從新字補
      while (rc.length < plan.recall && focusOrPool.length) rc.push(PICK(focusOrPool));
      rc.forEach(function (v, i) {
        body.push({ type: 'recall', ref: v, dir: i % 2 ? 'zh2en' : 'en2zh', unitId: unitId });
      });
    }

    /* --- 3.5 字母銀行拼字：認得 → 拼得出來 --- */
    if (plan.spell) {
      // 優先拼「剛學過但還不熟」的字，長度 3–10 才適合拼
      function spellable(v) {
        return v.w.length >= 3 && v.w.length <= 10 && !/\s/.test(v.w);
      }
      var spellPool = pool.filter(function (v) { return spellable(v) && SRS.levelOf(v.id) < 3; });
      // 退而求其次時也要守住「拼得出來」這一條：片語動詞那一關的字全部有空格，
      // 不濾就會出現用字母銀行拼 hand over 的題目 —— 空格根本不在字母裡。
      // 濾完真的一個都不剩就不出拼字題，配方那一項寫 0 即可。
      if (!spellPool.length) spellPool = focusOrPool.filter(spellable);
      SAMPLE(spellPool, plan.spell).forEach(function (v) {
        body.push({ type: 'spell', ref: v, unitId: unitId });
      });
    }

    /* --- 3.6 不規則動詞三態 --- */
    if (plan.irregular) {
      // 先問沒被問倒過的，答錯過的交給弱點怪獸帶回來
      SAMPLE(Content.irregulars(), plan.irregular).forEach(function (iv, i) {
        // 三態同形的字問過去分詞沒有鑑別度，一律問過去式
        var ask = (iv.t !== 'A' && i % 3 === 2) ? 'pp' : 'p';
        body.push({ type: 'irregular', ref: iv, ask: ask, unitId: unitId });
      });
    }

    /* --- 3.65 最小音對：把 phonics 教過的音考回來 --- */
    if (plan.phoneme) {
      // 魔王關（s0u5）自己沒有音對，往前把學過的都收進來混考
      var mp = Content.minPairsOf(unitId);
      if (!mp.length) mp = Content.minPairsUpTo(unitId);
      SAMPLE(mp, plan.phoneme).forEach(function (m) {
        body.push({ type: 'phoneme', ref: m, unitId: unitId });
      });
    }

    /* --- 3.7 搭配詞 --- */
    if (plan.collocate) {
      // 從「這一關以及之前」的字裡抽，不限這關新教的 —— take a break 這種搭配
      // 掛在 Stage 0 的高頻動詞上，但要等學過幾關、有東西可比較之後練才有意義。
      var colPool = [];
      Content.vocabUpTo(unitId).forEach(function (v) {
        (v.col || []).forEach(function (c) { colPool.push({ v: v, c: c }); });
      });
      var usedCol = {}, gotCol = 0;
      S(colPool).forEach(function (x) {
        // 同一個字只出一題：連問三題 take 只是在考同一件事
        if (gotCol >= plan.collocate || usedCol[x.v.id]) return;
        usedCol[x.v.id] = 1;
        gotCol++;
        body.push({ type: 'collocate', ref: x.v, col: x.c, unitId: unitId });
      });
    }

    /* --- 4. 聽力：聽單字或句子選意思 --- */
    if (plan.listen) {
      var half = Math.ceil(plan.listen / 2);
      SAMPLE(pool, half).forEach(function (v) {
        body.push({ type: 'listen', mode: 'word', ref: v, unitId: unitId });
      });
      var sPool = grammarSentences(unitId).concat(sentencesFrom(focusOrPool, { maxWords: 12 }));
      SAMPLE(sPool, plan.listen - half).forEach(function (s) {
        body.push({ type: 'listen', mode: 'sentence', ref: s, unitId: unitId });
      });
    }

    /* --- 5. 聽寫填空 --- */
    if (plan.dictate) {
      var dPool = sentencesFrom(focusOrPool, { maxWords: 11 }).concat(grammarSentences(unitId));
      SAMPLE(dPool, plan.dictate).forEach(function (s) {
        body.push({ type: 'dictate', ref: s, unitId: unitId });
      });
    }

    /* --- 6. 跟讀 --- */
    if (plan.speak) {
      var kPool = sentencesFrom(focusOrPool, { maxWords: 10 });
      if (u.phonics) {
        // 發音關卡直接跟讀單字
        kPool = focusOrPool.map(function (v) { return { en: v.w, zh: v.zh, from: v.id, kind: 'word' }; }).concat(kPool);
      }
      SAMPLE(kPool, plan.speak).forEach(function (s) {
        body.push({ type: 'speak', ref: s, unitId: unitId });
      });
    }

    /* --- 7. 文法題 --- */
    if (plan.grammar) {
      grammarQuestions(unitId, ['mc', 'fix', 'trans'], plan.grammar).forEach(function (x) {
        body.push({ type: 'grammar', ref: x.q, g: x.g, unitId: unitId });
      });
    }

    /* --- 8. 句子填空 --- */
    if (plan.cloze) {
      var cz = grammarQuestions(unitId, ['cloze'], plan.cloze);
      cz.forEach(function (x) {
        body.push({ type: 'cloze', ref: x.q, g: x.g, unitId: unitId });
      });
      // 文法題庫不夠時，用例句自動挖空
      var need = plan.cloze - cz.length;
      if (need > 0) {
        SAMPLE(sentencesFrom(focusOrPool, { minWords: 4, maxWords: 12 }), need).forEach(function (s) {
          body.push({ type: 'cloze', ref: autoCloze(s), g: null, unitId: unitId });
        });
      }
    }

    /* --- 9. 拖曳排句 --- */
    if (plan.build) {
      var bPool = grammarSentences(unitId).concat(sentencesFrom(focusOrPool, { minWords: 4, maxWords: 10 }));
      SAMPLE(bPool, plan.build).forEach(function (s) {
        body.push({ type: 'build', ref: s, unitId: unitId });
      });
    }

    /* --- 9.5 多益 Part 1／Part 2：題目自成一體，不從單字庫抽 --- */
    // 這一關沒有自己的題目就往前借（魔王關就是靠這個混考前面所有的 Part 1／Part 2）
    if (plan.photo) {
      var pics = Content.photoOf(unitId);
      if (!pics.length) pics = Content.photoUpTo(unitId);
      SAMPLE(pics, plan.photo).forEach(function (p) {
        body.push({ type: 'photo', ref: p, unitId: unitId });
      });
    }
    if (plan.respond) {
      var reps = Content.respondOf(unitId);
      if (!reps.length) reps = Content.respondUpTo(unitId);
      SAMPLE(reps, plan.respond).forEach(function (r) {
        body.push({ type: 'respond', ref: r, unitId: unitId });
      });
    }
    // Part 3／4 一題要聽一整段再答三小題，和閱讀一樣重，所以跟著放到收尾
    if (plan.convo) {
      var cvs = Content.convoOf(unitId);
      if (!cvs.length) cvs = Content.convoUpTo(unitId);
      SAMPLE(cvs, plan.convo).forEach(function (c) {
        tail.push({ type: 'convo', ref: c, unitId: unitId });
      });
    }

    /* --- 9.7 多益 Part 6／Part 7：和閱讀一樣重，一律放到收尾 --- */
    // Part 6 一篇要填四格、Part 7 雙篇要讀兩份文件再答五題，
    // 夾在單字題中間會把節奏切斷，所以跟閱讀與 Part 3／4 一起排在最後。
    if (plan.part6) {
      var p6 = Content.part6Of(unitId);
      if (!p6.length) p6 = Content.part6UpTo(unitId);
      SAMPLE(p6, plan.part6).forEach(function (x) {
        tail.push({ type: 'part6', ref: x, unitId: unitId });
      });
    }
    if (plan.part7) {
      var p7 = Content.part7Of(unitId);
      if (!p7.length) p7 = Content.part7UpTo(unitId);
      SAMPLE(p7, plan.part7).forEach(function (d) {
        tail.push({ type: 'part7', ref: d, unitId: unitId });
      });
    }

    /* --- 10. 閱讀（放最後，當作這關的收尾） --- */
    if (plan.read) {
      // 自己沒有短文就一路往前找，而不是只看前一關 ——
      // Stage 4 有連著三關都是純題型關（Part 6、Part 7 單篇、雙篇），
      // 只退一格會退到同樣沒有短文的關卡，read 那一項就靜靜地消失。
      var arts = Content.readingOf(unitId);
      var back = unitId;
      while (!arts.length && (back = Content.prevUnitId(back))) arts = Content.readingOf(back);
      SAMPLE(arts, plan.read).forEach(function (a) {
        tail.push({ type: 'read', ref: a, unitId: unitId });
      });
    }

    /* --- 交錯：單字卡之間夾一題練習，比較不無聊 --- */
    queue = intro.slice();
    var shuffledBody = S(body);
    var bi = 0;
    cards.forEach(function (c, i) {
      queue.push(c);
      if (i % 2 === 1 && bi < shuffledBody.length) queue.push(shuffledBody[bi++]);
    });
    while (bi < shuffledBody.length) queue.push(shuffledBody[bi++]);
    queue = queue.concat(tail);

    queue.forEach(function (q, i) { q.i = i; });
    return queue;
  }

  /** 把句子裡挑一個「有意義」的字挖掉 */
  function autoCloze(s) {
    var toks = s.en.split(/(\s+)/);
    var idxs = [];
    for (var i = 0; i < toks.length; i++) {
      var clean = toks[i].replace(/[^A-Za-z']/g, '');
      if (clean.length >= 3) idxs.push(i);
    }
    var pickIdx = idxs.length ? PICK(idxs) : 0;
    var answer = toks[pickIdx].replace(/[^A-Za-z']/g, '');
    var punct = toks[pickIdx].replace(/[A-Za-z']/g, '');
    toks[pickIdx] = '___' + punct;
    return {
      k: 'cloze',
      q: toks.join(''),
      a: answer,
      zh: s.zh,
      why: '',
      _auto: true,
      _full: s.en
    };
  }

  /* ==========================================================================
     跳關測驗：證明「這一關不用上」
     發音關是解鎖鏈上最容易卡住已經有底子的人的地方。與其開第二條鏈，不如讓他
     直接考一次 —— 過了就拿既有的一顆星，解鎖鏈自己往前推。
     ========================================================================== */
  var SKIP_N = 8;

  function skipTestable(unitId) {
    var u = Content.unit(unitId);
    if (!u || !u.phonics) return false;                          // 只有發音關需要
    if (!Content.isReady(unitId) || !Content.isUnlocked(unitId)) return false;
    if (State.isUnitDone(unitId)) return false;                  // 已經過了就沒得跳
    return Content.vocabOf(unitId).length >= SKIP_N;
  }

  /**
   * 只出「聽得懂、拼得出、認得意思」三種題，而且全部來自這一關自己的單字。
   * 沒有教學卡也沒有單字卡 —— 先被教一次再答對，證明不了任何事。
   * 答對答錯照樣進 SRS 與弱點怪獸（題型模組自己會做），跳掉的關卡才不會變成黑洞。
   */
  function buildSkipTest(unitId) {
    if (!skipTestable(unitId)) return [];

    var pool = Content.vocabOf(unitId);
    var used = {}, out = [];

    function take(list, n, make) {
      SAMPLE(list.filter(function (v) { return !used[v.id]; }), n).forEach(function (v) {
        used[v.id] = 1;
        out.push(make(v, out.length));
      });
    }

    take(pool, 3, function (v) {
      return { type: 'listen', mode: 'word', ref: v, unitId: unitId };
    });
    take(pool.filter(function (v) {
      return v.w.length >= 3 && v.w.length <= 10 && !/\s/.test(v.w);
    }), 3, function (v) {
      return { type: 'spell', ref: v, unitId: unitId };
    });
    // 可拼的字不夠就用中英互選補滿：題數固定，及格線才有一致的意義
    take(pool, SKIP_N - out.length, function (v, i) {
      return { type: 'recall', ref: v, dir: i % 2 ? 'zh2en' : 'en2zh', unitId: unitId };
    });

    out = S(out);
    out.forEach(function (q, i) { q.i = i; });
    return out;
  }

  /** 及格要答對幾題（結算畫面與說明文字都用它，才不會兩邊講的數字不一樣） */
  function skipPassCount(total) {
    return Math.ceil(total * (Content.rules().skipPass || 0.85));
  }

  /* ==========================================================================
     每日複習佇列（首頁「暖身」與複習頁共用）
     ========================================================================== */
  /**
   * 把一隻弱點怪獸變成一題。四種怪獸各有各的問法：
   *   vocab     → 中英互選
   *   grammar   記的是「文法點」，從它底下的題庫裡抽一題重問
   *   reading   記的是「文章」，整篇重讀一次
   *   irregular 記的是「動詞」，再問一次三態
   *   photo     記的是「照片」，同一張再聽一次四個描述
   *   respond   記的是「問句」，同一句再聽一次三個回應
   *   phoneme   記的是「音對整組」，再抽一個字聽一次
   * 內容已經被移除（例如改版換了 id）就回傳 null。
   */
  /**
   * 文法點的一句話概念。複習、每日挑戰、弱點怪獸都不會經過教學卡 —— 題目直接
   * 蓋臉丟過來，答錯了也只知道自己錯，不知道規則是什麼。關卡裡不給（前面才剛教完）。
   */
  function scaffoldOf(g) {
    return (g && g.teach && g.teach.lead) ? g.teach.lead : '';
  }

  /**
   * 弱點怪獸與 SRS 存的都是 id 字串。詞庫的字用 lx: 開頭，Content 查不到，
   * 兩邊都要記得往 Lexicon 再問一次 —— 漏掉的話，詞庫特訓答錯的字會變成
   * 進得了清單卻永遠出不了題的怪獸。
   */
  function refItem(id) {
    return Content.item(id) || Lexicon.item(id);
  }

  function weakQuestion(w) {
    var it = refItem(w.r);
    if (!it) return null;

    if (w.t === 'vocab') {
      return { type: 'recall', ref: it, dir: Math.random() < .5 ? 'en2zh' : 'zh2en',
               unitId: w.u, weak: w.k };
    }

    if (w.t === 'grammar') {
      var qs = it.qs || [];
      if (!qs.length) return null;
      // 複習要短，優先抽選擇題與填空；沒有的話再退回改錯／翻譯
      var quick = qs.filter(function (q) { return q.k === 'mc' || q.k === 'cloze'; });
      var q = PICK(quick.length ? quick : qs);
      return { type: q.k === 'cloze' ? 'cloze' : 'grammar', ref: q, g: it,
               unitId: w.u || it.u, weak: w.k, scaffold: scaffoldOf(it) };
    }

    if (w.t === 'reading') {
      return { type: 'read', ref: it, unitId: w.u || it.u, weak: w.k };
    }

    if (w.t === 'irregular') {
      return { type: 'irregular', ref: it, ask: (it.t !== 'A' && Math.random() < .4) ? 'pp' : 'p',
               unitId: w.u, weak: w.k };
    }

    if (w.t === 'photo') {
      return { type: 'photo', ref: it, unitId: w.u || it.u, weak: w.k };
    }

    if (w.t === 'respond') {
      return { type: 'respond', ref: it, unitId: w.u || it.u, weak: w.k };
    }

    // 音對記的是「整組」，重問時題型模組會自己再抽一個字，不會每次都考同一個
    if (w.t === 'phoneme') {
      return { type: 'phoneme', ref: it, unitId: w.u || it.u, weak: w.k };
    }

    // Part 3／4 和閱讀一樣是整段重來：三小題全對才算消滅
    if (w.t === 'convo') {
      return { type: 'convo', ref: it, unitId: w.u || it.u, weak: w.k };
    }

    // Part 6 記的是整篇文章。只補做答錯那一格沒有意義 ——
    // 這一題型的訓練目標就是「從整篇找線索」，抽出單格等於降級成 Part 5。
    if (w.t === 'part6') {
      return { type: 'part6', ref: it, unitId: w.u || it.u, weak: w.k };
    }

    // Part 7 雙篇同理：兩份文件一起重讀，五小題全對才算消滅
    if (w.t === 'part7') {
      return { type: 'part7', ref: it, unitId: w.u || it.u, weak: w.k };
    }

    return null;
  }

  /* 「一題就要好幾分鐘」的那幾種。怪獸型別與題型名稱不一樣（reading／read），
     兩張表分開列，才不會有人改了一邊忘了另一邊。 */
  var HEAVY_WEAK = { reading: 1, convo: 1, part6: 1, part7: 1 };
  var HEAVY_TYPE = { read: 1, convo: 1, part6: 1, part7: 1 };

  function buildReview(limit) {
    limit = limit || 20;
    var out = [];
    var tail = [];   // 閱讀放最後，跟關卡一樣當收尾

    function taken() { return out.length + tail.length; }
    function hasRef(id) {
      return out.concat(tail).some(function (o) { return o.ref && o.ref.id === id; });
    }

    // 1) 弱點怪獸優先：錯最多次的先排。
    //    額度是用「真的排進去的題數」算的 — 出不了題的怪獸不該白佔名額。
    var budget = Math.ceil(limit * 0.4);
    SRS.weakList()
      .sort(function (a, b) { return b.n - a.n; })
      .forEach(function (w) {
        if (taken() >= budget) return;
        // 一篇文章要讀好幾分鐘，Part 3／4 要聽完整段再答三小題，
        // Part 6 要填四格、Part 7 雙篇更要讀兩份文件再答五題 —— 全都一樣重。
        // 四種合計一次複習最多夾一個，否則整輪複習會被它們吃光。
        if (HEAVY_WEAK[w.t] && tail.length) return;
        var q = weakQuestion(w);
        if (!q) return;
        if (HEAVY_TYPE[q.type]) tail.push(q);
        else out.push(q);
      });

    // 2) SRS 到期單字
    SRS.dueIds(limit).forEach(function (id) {
      if (taken() >= limit) return;
      var v = refItem(id);
      if (!v || !v.w) return;
      if (hasRef(id)) return;
      var spellable = v.w.length >= 3 && v.w.length <= 10 && !/\s/.test(v.w);
      var r = Math.random();
      if (r < 0.3) out.push({ type: 'recall', ref: v, dir: 'en2zh', unitId: v.u, srs: true });
      else if (r < 0.55) out.push({ type: 'recall', ref: v, dir: 'zh2en', unitId: v.u, srs: true });
      else if (r < 0.8 || !spellable) out.push({ type: 'listen', mode: 'word', ref: v, unitId: v.u, srs: true });
      else out.push({ type: 'spell', ref: v, unitId: v.u, srs: true });
    });

    out = out.concat(tail);
    out.forEach(function (q, i) { q.i = i; });
    return out;
  }

  /* ==========================================================================
     詞庫特訓
     課程關卡一次只教六到十個字，一萬二千字這樣走完要好幾年。詞庫特訓是另一條
     腿：自己挑一批字直接背，走的還是同一套單字卡 → 回想 → 拼字 → 聽力流程。

     誘答刻意從「同一批字」裡抽（pool 參數）—— 同一級的字難度相近，
     拿課程裡的簡單字當誘答，這一批再難也會變成送分題。
     ========================================================================== */
  function buildLexiconDrill(words) {
    if (!words || !words.length) return [];

    var cards = [], body = [];

    words.forEach(function (v) {
      cards.push({ type: 'flashcard', ref: v, unitId: '', pool: words });
    });

    words.forEach(function (v, i) {
      body.push({ type: 'recall', ref: v, dir: i % 2 ? 'zh2en' : 'en2zh', unitId: '', pool: words });
      // 拼得出來才算真的會，但太長的字用字母銀行拼會變成純粹的耐心測驗
      if (v.w.length >= 3 && v.w.length <= 10 && !/\s/.test(v.w) && i % 2 === 0) {
        body.push({ type: 'spell', ref: v, unitId: '' });
      } else {
        body.push({ type: 'listen', mode: 'word', ref: v, unitId: '', pool: words });
      }
    });

    // 單字卡之間夾一題練習，和關卡的節奏一致
    var queue = [], shuffled = S(body), bi = 0;
    cards.forEach(function (c, i) {
      queue.push(c);
      if (i % 2 === 1 && bi < shuffled.length) queue.push(shuffled[bi++]);
    });
    while (bi < shuffled.length) queue.push(shuffled[bi++]);

    queue.forEach(function (q, i) { q.i = i; });
    return queue;
  }

  /* ==========================================================================
     每日挑戰：混合舊內容的隨機小考
     ========================================================================== */
  function buildChallenge(size) {
    size = size || 10;
    var learned = Content.allVocab().filter(function (v) { return SRS.has(v.id); });
    if (learned.length < 6) return null;

    var out = [];

    // 文法題：從所有「已解鎖且有題目」的關卡抽，早期關卡沒文法時才不會湊不滿
    var gPool = [];
    Content.orderedUnitIds().forEach(function (uid) {
      if (!Content.isReady(uid) || !State.isUnitDone(uid)) return;
      Content.grammarOf(uid).forEach(function (g) {
        (g.qs || []).forEach(function (q) {
          if (q.k === 'mc' || q.k === 'cloze') gPool.push({ g: g, q: q, u: uid });
        });
      });
    });
    SAMPLE(gPool, Math.min(4, Math.floor(size * 0.4))).forEach(function (x) {
      out.push({ type: x.q.k === 'cloze' ? 'cloze' : 'grammar', ref: x.q, g: x.g, unitId: x.u,
                 challenge: true, scaffold: scaffoldOf(x.g) });
    });

    // 剩下的名額用單字題填滿，三種型態輪替
    var kinds = ['recall-en', 'listen', 'spell', 'recall-zh'];
    SAMPLE(learned, size - out.length).forEach(function (v, i) {
      var k = kinds[i % kinds.length];
      var spellable = v.w.length >= 3 && v.w.length <= 10 && !/\s/.test(v.w);
      if (k === 'spell' && !spellable) k = 'listen';
      if (k === 'listen') out.push({ type: 'listen', mode: 'word', ref: v, unitId: v.u, challenge: true });
      else if (k === 'spell') out.push({ type: 'spell', ref: v, unitId: v.u, challenge: true });
      else out.push({ type: 'recall', ref: v, dir: k === 'recall-zh' ? 'zh2en' : 'en2zh', unitId: v.u, challenge: true });
    });

    out = S(out);
    out.forEach(function (q, i) { q.i = i; });
    return out;
  }

  /* ==========================================================================
     今日建議：首頁用
     ========================================================================== */
  function todayPlan() {
    var due = SRS.dueCount();
    var weak = SRS.weakCount();
    var cur = Content.currentUnitId();
    var u = Content.unit(cur);
    var goalXP = State.goalXP();
    var pct = State.goalPct();

    var items = [];
    if (due > 0) {
      items.push({
        key: 'review', icon: '🔥', title: '暖身複習',
        desc: due + ' 個單字今天到期',
        hint: '大約 ' + Math.max(2, Math.round(due * 0.25)) + ' 分鐘',
        hash: '#/review', cta: '開始複習'
      });
    }
    if (u) {
      var rec = State.data.units[cur];
      var lv = (rec && rec.lv) || 0;
      var unseen = unseenOf(cur).length;
      items.push({
        key: 'lesson', icon: u.icon || '📘',
        title: (Content.stageOf(cur) ? Content.stageOf(cur).name + '　' : '') + '第 ' + u.n + ' 關',
        desc: u.title + (unseen ? '（還有 ' + unseen + ' 個新字）' : '（新字已學完，這關可再刷熟練度）'),
        hint: lv > 0 ? '皇冠 Lv.' + lv : '首次挑戰',
        hash: '#/lesson/' + cur, cta: lv > 0 ? '再打一次' : '開始學習'
      });
    }
    // 跳關測驗只推給「先學單字」的人。選「先練發音」的是自己要求練發音的，
    // 不該在首頁被慫恿跳過 —— 地圖上兩種取向都找得到。
    if (State.data.profile.track === 'vocab' && skipTestable(cur)) {
      items.push({
        key: 'skip', icon: '⏭️', title: '跳關測驗',
        desc: '已經會了？' + SKIP_N + ' 題證明給我看，直接解鎖下一關',
        hint: '約 2 分鐘',
        hash: '#/lesson/' + cur + '?skip=1', cta: '我要跳關'
      });
    }
    if (weak > 0) {
      items.push({
        key: 'weak', icon: '👾', title: '弱點怪獸',
        desc: '有 ' + weak + ' 隻怪獸還沒被打倒',
        hint: '答對就消滅',
        hash: '#/review?weak=1', cta: '去打怪'
      });
    }
    if (!State.data.today.challenge) {
      items.push({
        key: 'challenge', icon: '🎲', title: '每日挑戰',
        desc: '10 題隨機小考，完成拿 💎',
        hint: '約 3 分鐘',
        hash: '#/lesson/challenge', cta: '接受挑戰'
      });
    }

    return { items: items, pct: pct, goalXP: goalXP, due: due, weak: weak, currentUnit: cur };
  }

  global.Scheduler = {
    buildLesson: buildLesson,
    buildReview: buildReview,
    buildLexiconDrill: buildLexiconDrill,
    buildChallenge: buildChallenge,
    buildSkipTest: buildSkipTest,
    skipTestable: skipTestable,
    skipPassCount: skipPassCount,
    SKIP_N: SKIP_N,
    todayPlan: todayPlan,
    unseenOf: unseenOf,
    sentencesFrom: sentencesFrom
  };
})(window);
