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
                    global.DATA_VOCAB_S1A, global.DATA_VOCAB_S1B, global.DATA_VOCAB_S1C);
  var GRAMMAR = cat(global.DATA_GRAMMAR_S0, global.DATA_GRAMMAR_S1);
  var READING = cat(global.DATA_READING_S0, global.DATA_READING_S1);
  var PHONICS = global.DATA_PHONICS || {};
  var IRREG   = global.DATA_IRREGULAR || [];
  var CUR     = global.DATA_CURRICULUM || { stages: [], rules: {} };

  /* ---------- 索引 ---------- */
  var byId = {}, vocabByUnit = {}, grammarByUnit = {}, readingByUnit = {};
  var unitById = {}, stageOfUnit = {}, unitOrder = [];

  VOCAB.forEach(function (v) {
    byId[v.id] = v;
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

  /* ---------- 關卡順序與解鎖 ---------- */
  function orderedUnitIds() { return unitOrder.slice(); }

  function prevUnitId(uid) {
    var i = unitOrder.indexOf(uid);
    return i > 0 ? unitOrder[i - 1] : null;
  }

  /** 關卡可玩的條件：階段開放、有課表，而且真的有內容可出題 */
  function isReady(uid) {
    var u = unitById[uid];
    if (!u) return false;
    var st = stageOfUnit[uid];
    if (!st || !st.ready || !u.plan || !u.plan.length) return false;
    var hasContent = (vocabByUnit[uid] && vocabByUnit[uid].length) ||
                     (grammarByUnit[uid] && grammarByUnit[uid].length);
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

  /**
   * 產生誘答用的單字：優先挑同詞性、同關卡附近的字，比較有鑑別度。
   */
  function distractors(target, n, pool) {
    pool = pool || vocabUpTo(target.u);
    var same = pool.filter(function (v) { return v.id !== target.id && v.pos === target.pos; });
    var rest = pool.filter(function (v) { return v.id !== target.id && v.pos !== target.pos; });
    var out = sample(same, n);
    if (out.length < n) out = out.concat(sample(rest, n - out.length));
    if (out.length < n) {
      var wide = VOCAB.filter(function (v) { return v.id !== target.id; });
      out = out.concat(sample(wide, n - out.length));
    }
    return out.slice(0, n);
  }

  /* ---------- 統計 ---------- */
  function counts() {
    return {
      vocab: VOCAB.length,
      grammar: GRAMMAR.length,
      reading: READING.length,
      units: unitOrder.filter(isReady).length,
      unitsAll: unitOrder.length
    };
  }

  global.Content = {
    unit: unit, stageOf: stageOf, stages: stages, rules: rules, item: item,
    vocabOf: vocabOf, grammarOf: grammarOf, readingOf: readingOf,
    vocabUpTo: vocabUpTo, grammarUpTo: grammarUpTo, allVocab: allVocab,
    phonics: phonics, irregulars: irregulars,
    orderedUnitIds: orderedUnitIds, prevUnitId: prevUnitId,
    isReady: isReady, isUnlocked: isUnlocked, currentUnitId: currentUnitId,
    shuffle: shuffle, sample: sample, pick: pick, distractors: distractors,
    counts: counts
  };
})(window);
