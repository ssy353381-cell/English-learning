/* ==========================================================================
   content.js — 內容查詢層
   把 data/*.js 的各份資料合併、建索引，提供給題型與排程使用。
   ========================================================================== */
(function (global) {
  'use strict';

  function cat() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) {
      var a = arguments[i];
      if (a && a.length) out = out.concat(a);
    }
    return out;
  }

  var VOCAB   = cat(global.DATA_VOCAB_S0,
                    global.DATA_VOCAB_S1A, global.DATA_VOCAB_S1B, global.DATA_VOCAB_S1C,
                    global.DATA_VOCAB_S2, global.DATA_VOCAB_S2B, global.DATA_VOCAB_S3);
  var GRAMMAR = cat(global.DATA_GRAMMAR_S0, global.DATA_GRAMMAR_S1, global.DATA_GRAMMAR_S2,
                    global.DATA_GRAMMAR_S3);
  var READING = cat(global.DATA_READING_S0, global.DATA_READING_S1, global.DATA_READING_S2,
                    global.DATA_READING_S3);
  var PHOTO   = cat(global.DATA_PHOTO_S2);      // 多益 Part 1：看圖聽描述
  var RESPOND = cat(global.DATA_RESPOND_S2);    // 多益 Part 2：應答問題
  var CONVO   = cat(global.DATA_CONVO_S3);      // 多益 Part 3／4：長對話與獨白
  var MINPAIR = cat(global.DATA_MINPAIR);          // 最小音對：發音關唯一考得回來的題型
  var PHONICS = global.DATA_PHONICS || {};
  var IRREG   = global.DATA_IRREGULAR || [];
  var CUR     = global.DATA_CURRICULUM || { stages: [], rules: {} };

  /* ---------- 索引 ---------- */
  var byId = {}, byWord = {}, vocabByUnit = {}, grammarByUnit = {}, readingByUnit = {};
  var photoByUnit = {}, respondByUnit = {}, minPairByUnit = {}, convoByUnit = {};
  var unitById = {}, stageOfUnit = {}, unitOrder = [];

  VOCAB.forEach(function (v) {
    byId[v.id] = v;
    // lure 是用「字」寫的（誘答表要看得懂），查回單字物件才能當選項渲染。
    // 少數字重複收錄（book、soon…），保留先出現的那個，也就是先教的那一關。
    var key = v.w.toLowerCase();
    if (!byWord[key]) byWord[key] = v;
    (vocabByUnit[v.u] = vocabByUnit[v.u] || []).push(v);
  });
  GRAMMAR.forEach(function (g) {
    byId[g.id] = g;
    (grammarByUnit[g.u] = grammarByUnit[g.u] || []).push(g);
  });
  READING.forEach(function (r) {
    byId[r.id] = r;
    (readingByUnit[r.u] = readingByUnit[r.u] || []).push(r);
  });
  PHOTO.forEach(function (p) {
    byId[p.id] = p;
    (photoByUnit[p.u] = photoByUnit[p.u] || []).push(p);
  });
  RESPOND.forEach(function (q) {
    byId[q.id] = q;
    (respondByUnit[q.u] = respondByUnit[q.u] || []).push(q);
  });
  MINPAIR.forEach(function (m) {
    byId[m.id] = m;
    (minPairByUnit[m.u] = minPairByUnit[m.u] || []).push(m);
  });
  CONVO.forEach(function (c) {
    byId[c.id] = c;
    (convoByUnit[c.u] = convoByUnit[c.u] || []).push(c);
  });
  // 不規則動詞不綁關卡，但要能用 id 查回來（弱點怪獸需要）
  IRREG.forEach(function (iv) { byId[iv.id] = iv; });

  CUR.stages.forEach(function (st) {
    (st.units || []).forEach(function (u) {
      unitById[u.id] = u;
      stageOfUnit[u.id] = st;
      unitOrder.push(u.id);
    });
  });

  /* ---------- 基本查詢 ---------- */
  function unit(id)      { return unitById[id] || null; }
  function stageOf(id)   { return stageOfUnit[id] || null; }
  function stages()      { return CUR.stages; }
  function rules()       { return CUR.rules; }
  function item(id)      { return byId[id] || null; }
  function vocabOf(uid)  { return vocabByUnit[uid] || []; }
  function grammarOf(uid){ return grammarByUnit[uid] || []; }
  function readingOf(uid){ return readingByUnit[uid] || []; }
  function photoOf(uid)  { return photoByUnit[uid] || []; }
  function respondOf(uid){ return respondByUnit[uid] || []; }
  function minPairsOf(uid){ return minPairByUnit[uid] || []; }
  function convoOf(uid)  { return convoByUnit[uid] || []; }
  function phonics(key)  { return PHONICS[key] || null; }
  function irregulars()  { return IRREG; }
  function allVocab()    { return VOCAB; }

  /* 這個關卡「以及之前所有關卡」的單字（複習題要從舊字裡抽） */
  function vocabUpTo(uid) {
    var idx = unitOrder.indexOf(uid);
    if (idx < 0) return VOCAB.slice();
    var out = [];
    for (var i = 0; i <= idx; i++) out = out.concat(vocabByUnit[unitOrder[i]] || []);
    return out;
  }

  function grammarUpTo(uid) {
    var idx = unitOrder.indexOf(uid);
    if (idx < 0) return GRAMMAR.slice();
    var out = [];
    for (var i = 0; i <= idx; i++) out = out.concat(grammarByUnit[unitOrder[i]] || []);
    return out;
  }

  /* 魔王關自己沒有 Part 1／Part 2 題目，要能往前把所有學過的都收進來 */
  function upTo(byUnit, all, uid) {
    var idx = unitOrder.indexOf(uid);
    if (idx < 0) return all.slice();
    var out = [];
    for (var i = 0; i <= idx; i++) out = out.concat(byUnit[unitOrder[i]] || []);
    return out;
  }
  function minPairsUpTo(uid){ return upTo(minPairByUnit, MINPAIR, uid); }
  function convoUpTo(uid)   { return upTo(convoByUnit, CONVO, uid); }
  function photoUpTo(uid)   { return upTo(photoByUnit, PHOTO, uid); }
  function respondUpTo(uid) { return upTo(respondByUnit, RESPOND, uid); }

  /* ---------- 關卡順序與解鎖 ---------- */
  function orderedUnitIds() { return unitOrder.slice(); }

  function prevUnitId(uid) {
    var i = unitOrder.indexOf(uid);
    return i > 0 ? unitOrder[i - 1] : null;
  }

  /**
   * 關卡實際採用的配方。
   * 發音關卡另外備了一份「單字優先」的 planVocab：解鎖是一條鏈，想快點學句子的人
   * 一樣得走完 s0u1–s0u5，所以能換的只有同一關裡出哪些題。沒有 planVocab 就用 plan。
   */
  function planOf(uid) {
    var u = unitById[uid];
    if (!u) return null;
    var track = (State.data.profile && State.data.profile.track) || 'phonics';
    if (track === 'vocab' && u.planVocab && u.planVocab.length) return u.planVocab;
    return (u.plan && u.plan.length) ? u.plan : null;
  }

  /** 關卡可玩的條件：階段開放、有課表，而且真的有內容可出題 */
  function isReady(uid) {
    var u = unitById[uid];
    if (!u) return false;
    var st = stageOfUnit[uid];
    if (!st || !st.ready || !u.plan || !u.plan.length) return false;
    // 有任何一種自己的內容就算數：純聽力關卡（Part 1／Part 2）沒有單字也沒有文法，
    // 魔王關則相反 —— 題目全往前借，只有自己的短文。
    var hasContent = (vocabByUnit[uid] && vocabByUnit[uid].length) ||
                     (grammarByUnit[uid] && grammarByUnit[uid].length) ||
                     (readingByUnit[uid] && readingByUnit[uid].length) ||
                     (photoByUnit[uid] && photoByUnit[uid].length) ||
                     (respondByUnit[uid] && respondByUnit[uid].length) ||
                     (minPairByUnit[uid] && minPairByUnit[uid].length) ||
                     (convoByUnit[uid] && convoByUnit[uid].length);
    return !!hasContent;
  }

  /** 解鎖條件：第一關永遠開；其餘要前一關拿到至少 1 星，且該階段內容已備妥 */
  function isUnlocked(uid) {
    if (!isReady(uid)) return false;
    var prev = prevUnitId(uid);
    if (!prev) return true;
    return State.isUnitDone(prev);
  }

  /** 目前應該打的那一關（第一個已解鎖但還沒過的關） */
  function currentUnitId() {
    for (var i = 0; i < unitOrder.length; i++) {
      var id = unitOrder[i];
      if (!isReady(id)) continue;
      if (!State.isUnitDone(id) && isUnlocked(id)) return id;
    }
    // 全部打完 → 回傳最後一個可用關卡
    for (var j = unitOrder.length - 1; j >= 0; j--) {
      if (isReady(unitOrder[j])) return unitOrder[j];
    }
    return unitOrder[0];
  }

  /* ---------- 隨機與誘答選項 ---------- */
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function sample(arr, n) { return shuffle(arr).slice(0, n); }

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function wordItem(w) { return byWord[String(w || '').toLowerCase()] || null; }

  /** 字塊比對：忽略大小寫與標點，"day." 與 "day" 是同一個字 */
  function normTok(t) {
    return String(t || '').toLowerCase().replace(/[^a-z'-]/g, '');
  }

  /**
   * 產生誘答用的單字：先用資料標明的刻意誘答（lure），不足才退回同詞性隨機抽。
   * 隨機誘答的鑑別度很低 —— 問 take 卻配上 office、very，看一眼就能刪掉；
   * 真正會錯的是母語干擾（中文說「吃藥」，所以 eat 才是那個陷阱）。
   *
   * 同形或同義的字一律排除：job 與 work 的 zh 都是「工作」，湊在同一題會出現
   * 兩個都對的選項，題目直接壞掉（recall 兩個方向分別看 w 與 zh，兩邊都要擋）。
   */
  function distractors(target, n, pool) {
    pool = pool || vocabUpTo(target.u);
    var taken = {};
    var out = [];

    function usable(v) {
      return !!v && !taken[v.id] && v.id !== target.id &&
             v.w !== target.w && v.zh !== target.zh;
    }
    function add(v) {
      if (out.length >= n || !usable(v)) return;
      taken[v.id] = 1;
      out.push(v);
    }

    (target.lure || []).forEach(function (w) { add(wordItem(w)); });

    if (out.length < n) {
      sample(pool.filter(function (v) { return usable(v) && v.pos === target.pos; }),
             n - out.length).forEach(add);
    }
    if (out.length < n) {
      sample(pool.filter(function (v) { return usable(v) && v.pos !== target.pos; }),
             n - out.length).forEach(add);
    }
    if (out.length < n) {
      sample(VOCAB.filter(usable), n - out.length).forEach(add);
    }
    return out;
  }

  /**
   * 搭配詞題的誘答：只從「其他也有搭配詞的動詞」裡抽。
   * 不能用一般的隨機誘答 —— 隨機抽到的動詞有機會剛好也配得起來
   * （give a speech 抽到 make，可是 make a speech 也是對的），那題就沒有標準解。
   * 會收進 col 的都是彼此互相干擾的高頻動詞，拿它們互當誘答最準也最安全。
   */
  function colDistractors(target, n) {
    return distractors(target, n, VOCAB.filter(function (v) { return v.col && v.col.length; }));
  }

  /**
   * 排句題的誘答字塊（回傳字串，不是單字物件）。
   * 取用順序：
   *   1. 句子自己的 lure（例句的第三個元素）—— 資料作者知道這句用的是哪個形態，最精準
   *   2. 來源單字的 lure —— 一份資料所有題型共用，但形態不一定跟這句吻合
   *   3. 都沒寫才退回隨機舊字
   * 已經在句子裡的字不能當誘答，否則排句題會多出一個正確解。
   */
  function tokenLures(sent, correct, opts) {
    opts = opts || {};
    var n = opts.n || 1;
    var used = {}, out = [];
    (correct || []).forEach(function (t) { used[normTok(t)] = 1; });

    function add(w) {
      var k = normTok(w);
      // 片語（turn on）當選擇題誘答很好用，但排成字塊會是唯一有空格的那一塊，
      // 等於用看的就知道它是多的 —— 這裡跳過，選擇題那邊照用。
      if (!k || used[k] || out.length >= n || /\s/.test(w)) return;
      used[k] = 1;
      out.push(String(w));
    }

    (sent.lure || []).forEach(add);
    if (out.length < n && sent.from && byId[sent.from]) {
      (byId[sent.from].lure || []).forEach(add);
    }
    if (out.length < n && opts.random !== false) {
      sample(vocabUpTo(opts.unitId).filter(function (v) {
        return !used[normTok(v.w)] && v.w.indexOf(' ') < 0;
      }), n - out.length).forEach(function (v) { add(v.w); });
    }
    return out;
  }

  /* ---------- 統計 ---------- */
  function counts() {
    return {
      vocab: VOCAB.length,
      grammar: GRAMMAR.length,
      reading: READING.length,
      photo: PHOTO.length,
      respond: RESPOND.length,
      minpair: MINPAIR.length,
      convo: CONVO.length,
      units: unitOrder.filter(isReady).length,
      unitsAll: unitOrder.length
    };
  }

  global.Content = {
    unit: unit, stageOf: stageOf, stages: stages, rules: rules, item: item,
    vocabOf: vocabOf, grammarOf: grammarOf, readingOf: readingOf,
    photoOf: photoOf, respondOf: respondOf, minPairsOf: minPairsOf, convoOf: convoOf,
    vocabUpTo: vocabUpTo, grammarUpTo: grammarUpTo, allVocab: allVocab,
    photoUpTo: photoUpTo, respondUpTo: respondUpTo, minPairsUpTo: minPairsUpTo,
    convoUpTo: convoUpTo,
    phonics: phonics, irregulars: irregulars,
    orderedUnitIds: orderedUnitIds, prevUnitId: prevUnitId, planOf: planOf,
    isReady: isReady, isUnlocked: isUnlocked, currentUnitId: currentUnitId,
    shuffle: shuffle, sample: sample, pick: pick,
    distractors: distractors, colDistractors: colDistractors,
    tokenLures: tokenLures, wordItem: wordItem,
    counts: counts
  };
})(window);
