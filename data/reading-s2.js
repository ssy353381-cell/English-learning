/* ==========================================================================
   reading-s2.js — Stage 2 短文（70–110 字）
   句型集中在完成式與過去式的對比，主題全面轉向職場。
   ========================================================================== */
window.DATA_READING_S2 = [

/* ---------------- U26 現在完成式 ---------------- */
{
  id:'r2601', u:'s2u1', title:'A Quick Update',
  text:'Hi Jason,\nI have finished the sales report and sent it to the printer. I have already emailed a copy to Ms. Chen, so you do not need to forward it. I have not received the numbers from the Tainan branch yet, so page four is still empty. I have reminded them twice this week. If they reply today, I will update the file before the meeting.\nThanks,\nWendy',
  zh:'嗨，Jason：\n我已經完成業績報告並送印了。我也已經寄了一份給陳女士，所以你不用再轉寄。台南分公司的數字我還沒收到，所以第四頁還是空的。我這週已經提醒他們兩次了。如果他們今天回覆，我會在會議前更新檔案。\n謝謝，\nWendy',
  qs:[
    { q:'What has Wendy already done?', opts:['She has visited the Tainan branch.','She has emailed a copy to Ms. Chen.','She has cancelled the meeting.','She has printed page four.'], a:1, why:'I have already emailed a copy to Ms. Chen.' },
    { q:'Why is page four still empty?', opts:['The printer is broken.','Ms. Chen has not approved it.','The Tainan numbers have not arrived.','Jason forgot to send it.'], a:2, why:'I have not received the numbers from the Tainan branch yet.' },
    { q:'How many times has Wendy reminded the branch?', opts:['Once','Twice','Three times','She has not reminded them.'], a:1, why:'I have reminded them twice this week.' }
  ]
},
{
  id:'r2602', u:'s2u1', title:'The New Coffee Machine',
  text:'The office has bought a new coffee machine. It has been in the break room since Monday. Some people have already used it, but many have not tried it yet. The instructions are on the wall. Please do not put milk in the water tank. Someone has done that twice, and we have had to clean the machine both times. If you have any questions, ask Peter. He has read the whole manual.',
  zh:'公司買了一台新咖啡機。它從星期一起就放在茶水間。有些人已經用過了，但很多人還沒試過。使用說明貼在牆上。請不要把牛奶倒進水箱。已經有人這樣做了兩次，我們兩次都得清洗機器。如果有問題，請找 Peter，他已經把整本手冊讀完了。',
  qs:[
    { q:'When did the machine arrive?', opts:['On Monday','On Friday','This morning','Last month'], a:0, why:'It has been in the break room since Monday.' },
    { q:'What should people NOT do?', opts:['Read the instructions','Ask Peter','Put milk in the water tank','Use the machine'], a:2, why:'Please do not put milk in the water tank.' },
    { q:'Why should you ask Peter?', opts:['He bought the machine.','He has read the whole manual.','He cleans the break room.','He wrote the instructions.'], a:1, why:'He has read the whole manual.' }
  ]
},

/* ---------------- U27 完成式 vs 過去式 ---------------- */
{
  id:'r2701', u:'s2u2', title:'From Intern to Manager',
  text:'Alice joined the company as an intern in 2016. She worked in the sales department for two years, and then she transferred to marketing. In 2021 she was promoted to team leader. She has led the team since then. Under her, the team has expanded from four people to eleven. Last month the company opened an overseas office, and Alice has just accepted an offer to run it. She will move to Singapore in August.',
  zh:'愛麗絲 2016 年以實習生身分進入公司。她在業務部待了兩年，然後轉調行銷部。2021 年她升為組長，從那時起就一直帶領這個團隊。在她手下，團隊從四人擴編到十一人。上個月公司開了海外辦公室，愛麗絲剛接受了去負責那裡的職務。她八月會搬到新加坡。',
  qs:[
    { q:'What did Alice do after the sales department?', opts:['She resigned.','She moved to marketing.','She became an intern.','She went to Singapore.'], a:1, why:'then she transferred to marketing.' },
    { q:'How large is her team now?', opts:['Four people','Two people','Eleven people','Sixteen people'], a:2, why:'the team has expanded from four people to eleven.' },
    { q:'What has Alice just accepted?', opts:['A job in the overseas office','An internship','A transfer to sales','A pay cut'], a:0, why:'Alice has just accepted an offer to run it.' }
  ]
},
{
  id:'r2702', u:'s2u2', title:'Two Very Different Years',
  text:'Our shop opened in 2019, and the first year was hard. We lost money for eight months and almost closed. Things changed after we moved next to the station. Since then, sales have grown every quarter. We have added six new items to the menu this year, and we have hired three part-time staff. Last week a food magazine visited us. The article has not come out yet, but the writer said she liked our coffee.',
  zh:'我們的店 2019 年開幕，第一年很辛苦。我們虧損了八個月，差點就收了。搬到車站旁邊之後情況改變了。從那時起，業績每一季都在成長。今年我們在菜單上加了六樣新品，也請了三位兼職員工。上週有家美食雜誌來採訪。報導還沒出來，但那位記者說她喜歡我們的咖啡。',
  qs:[
    { q:'What happened during the first year?', opts:['Sales grew every quarter.','The shop lost money.','They hired three staff.','A magazine visited.'], a:1, why:'We lost money for eight months.' },
    { q:'What changed the situation?', opts:['A new menu','A magazine article','Moving next to the station','Hiring part-time staff'], a:2, why:'Things changed after we moved next to the station.' },
    { q:'What has NOT happened yet?', opts:['The article has not come out.','They have not hired anyone.','The shop has not moved.','Sales have not grown.'], a:0, why:'The article has not come out yet.' }
  ]
}

];
