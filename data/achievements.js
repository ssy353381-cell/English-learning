/* ==========================================================================
   achievements.js — 成就徽章
   test(ctx) 回傳 true 就解鎖。ctx 由 gamify.buildCtx() 提供。
   ========================================================================== */
window.DATA_ACHIEVEMENTS = [

  /* ---- 起步 ---- */
  { id:'first_lesson', icon:'🌱', name:'第一步', gems:5,
    desc:'完成第一個關卡',
    test:function(c){ return c.unitsDone >= 1; } },

  { id:'first_words', icon:'📗', name:'開始認字', gems:5,
    desc:'學過 20 個單字',
    test:function(c){ return c.srs.seen >= 20; } },

  { id:'phonics_done', icon:'🔤', name:'會拼音了', gems:10,
    desc:'完成 Stage 0 的四個發音關卡',
    test:function(c){ return ['s0u1','s0u2','s0u3','s0u4']
      .every(function(id){ return c.d.units[id] && c.d.units[id].s > 0; }); } },

  /* ---- 連續天數 ---- */
  { id:'streak_3',  icon:'🔥', name:'三日不斷', gems:5,  desc:'連續學習 3 天',   test:function(c){ return c.bestStreak >= 3; } },
  { id:'streak_7',  icon:'🔥', name:'一週不斷', gems:15, desc:'連續學習 7 天',   test:function(c){ return c.bestStreak >= 7; } },
  { id:'streak_30', icon:'🌋', name:'一個月',   gems:40, desc:'連續學習 30 天',  test:function(c){ return c.bestStreak >= 30; } },
  { id:'streak_100',icon:'💎', name:'百日行者', gems:100,desc:'連續學習 100 天', test:function(c){ return c.bestStreak >= 100; } },
  { id:'streak_365',icon:'🐉', name:'整整一年', gems:365,desc:'連續學習 365 天', test:function(c){ return c.bestStreak >= 365; } },

  /* ---- 單字量 ---- */
  { id:'words_100',  icon:'📘', name:'百字',   gems:10,  desc:'學過 100 個單字',   test:function(c){ return c.srs.seen >= 100; } },
  { id:'words_500',  icon:'📚', name:'五百字', gems:30,  desc:'學過 500 個單字',   test:function(c){ return c.srs.seen >= 500; } },
  { id:'words_1000', icon:'🗂️', name:'破千',   gems:60,  desc:'學過 1000 個單字',  test:function(c){ return c.srs.seen >= 1000; } },
  { id:'master_100', icon:'🧠', name:'真的記住了', gems:25,
    desc:'有 100 個單字達到精熟',
    test:function(c){ return c.srs.mastered >= 100; } },
  { id:'master_500', icon:'🦉', name:'字彙老手', gems:80,
    desc:'有 500 個單字達到精熟',
    test:function(c){ return c.srs.mastered >= 500; } },

  /* ---- 關卡 ---- */
  { id:'stage0_clear', icon:'🌟', name:'離開起跑線', gems:25,
    desc:'通關 Stage 0 的全部 10 關',
    test:function(c){ return ['s0u1','s0u2','s0u3','s0u4','s0u5','s0u6','s0u7','s0u8','s0u9','s0u10']
      .every(function(id){ return c.d.units[id] && c.d.units[id].s > 0; }); } },

  { id:'stage1_clear', icon:'🏙️', name:'活下來了', gems:50,
    desc:'通關 Stage 1 的全部 15 關',
    test:function(c){
      for (var i = 1; i <= 15; i++) {
        var id = 's1u' + i;
        if (!c.d.units[id] || c.d.units[id].s === 0) return false;
      }
      return true;
    } },

  { id:'perfect_1',  icon:'⭐', name:'第一個滿星', gems:10,
    desc:'有一關拿到 3 星',
    test:function(c){ return c.perfectUnits >= 1; } },

  { id:'perfect_10', icon:'✨', name:'十關全對', gems:35,
    desc:'有 10 關拿到 3 星',
    test:function(c){ return c.perfectUnits >= 10; } },

  { id:'crown_5', icon:'👑', name:'刷到滿冠', gems:30,
    desc:'有一關的皇冠升到 Lv.5',
    test:function(c){
      for (var k in c.d.units) if (c.d.units[k].lv >= 5) return true;
      return false;
    } },

  /* ---- 習慣 ---- */
  { id:'time_600',  icon:'⏳', name:'十小時', gems:20, desc:'累計學習 600 分鐘',  test:function(c){ return c.totalMin >= 600; } },
  { id:'time_3000', icon:'⌛', name:'五十小時', gems:60, desc:'累計學習 3000 分鐘', test:function(c){ return c.totalMin >= 3000; } },
  { id:'q_1000',    icon:'✍️', name:'千題', gems:25, desc:'累計作答 1000 題',    test:function(c){ return c.totalAnswered >= 1000; } },
  { id:'acc_90',    icon:'🎯', name:'穩', gems:30,
    desc:'累計 500 題以上且總正確率 90%',
    test:function(c){ return c.totalAnswered >= 500 && c.accuracy >= 0.9; } },

  { id:'lv10', icon:'⚡', name:'Lv.10', gems:20, desc:'等級達到 10', test:function(c){ return c.level >= 10; } },
  { id:'lv25', icon:'🌠', name:'Lv.25', gems:50, desc:'等級達到 25', test:function(c){ return c.level >= 25; } },

  { id:'early_bird', icon:'🌅', name:'晨型人', gems:10,
    desc:'在早上 7 點前完成一次學習',
    test:function(c){ return c.d.today.xp > 0 && new Date().getHours() < 7; } },

  { id:'night_owl', icon:'🌙', name:'夜貓子', gems:10,
    desc:'在午夜 12 點後還在學',
    test:function(c){ return c.d.today.xp > 0 && new Date().getHours() < 4; } },

  /* ---- 終點 ---- */
  { id:'toeic990', icon:'🏆', name:'990', gems:990,
    desc:'完成最後一關 — 滿分狙擊',
    test:function(c){ return c.d.units['s6u10'] && c.d.units['s6u10'].s > 0; } }
];
