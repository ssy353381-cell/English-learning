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
},

/* ---------------- U28 不定詞 to V ---------------- */
{
  id:'r2801', u:'s2u3', title:'A Note to the Team',
  text:'We have decided to change the order process. Starting next Monday, everyone needs to enter orders before four in the afternoon. We chose to move the deadline because the warehouse cannot afford to pack late orders on the same day. If you want to send an urgent order after four, please call Nina first. She has agreed to handle those cases, but she asks you not to make it a habit.',
  zh:'我們決定調整訂單流程。從下週一開始，所有人都要在下午四點前輸入訂單。我們選擇把截止時間提前，是因為倉庫沒辦法在當天打包太晚進來的訂單。如果四點後你想送急件，請先打給 Nina。她已經同意處理這些狀況，但她請大家不要養成習慣。',
  qs:[
    { q:'What time is the new deadline?', opts:['Four in the afternoon','Monday morning','Before noon','Any time'], a:0, why:'enter orders before four in the afternoon.' },
    { q:'Why was the deadline moved?', opts:['Nina asked for it.','The warehouse cannot pack late orders the same day.','The system was too slow.','Orders have decreased.'], a:1, why:'the warehouse cannot afford to pack late orders on the same day.' },
    { q:'What should you do for an urgent late order?', opts:['Enter it anyway','Wait until Monday','Call Nina first','Email the warehouse'], a:2, why:'please call Nina first.' }
  ]
},
{
  id:'r2802', u:'s2u3', title:'Why She Volunteered',
  text:'Maya did not plan to lead the project. When the manager asked who was willing to try, nobody wanted to speak. Maya hesitated for a moment, and then she offered to do it. She admits that she was not ready, but she was eager to learn. Six months later the team finished the work early. Maya now tells new staff not to wait until they feel ready.',
  zh:'瑪雅原本沒打算帶這個專案。當經理問誰願意試試看時，沒有人想開口。瑪雅猶豫了一下，然後主動說她願意做。她承認自己當時還沒準備好，但她很想學。六個月後團隊提前完成了工作。瑪雅現在告訴新人，不要等到覺得準備好才行動。',
  qs:[
    { q:'What did Maya do at the meeting?', opts:['She refused the job.','She offered to lead the project.','She asked the manager to decide.','She left early.'], a:1, why:'she offered to do it.' },
    { q:'How did Maya feel about her own ability?', opts:['She was fully ready.','She admits she was not ready.','She thought it was easy.','She did not care.'], a:1, why:'she admits that she was not ready.' },
    { q:'What does Maya tell new staff?', opts:['To wait until they feel ready','Not to wait until they feel ready','To avoid big projects','To ask for more pay'], a:1, why:'not to wait until they feel ready.' }
  ]
},

/* ---------------- U29 動名詞 Ving ---------------- */
{
  id:'r2901', u:'s2u4', title:'Office Rules for the Break Room',
  text:'Thank you for keeping the break room clean. Please avoid leaving food in the fridge over the weekend. We suggest labeling your container with your name and the date. Some staff have complained about finding old lunches on Monday morning. If you finish using the coffee machine, consider rinsing the pot for the next person. We appreciate everyone helping with this.',
  zh:'謝謝大家維持茶水間的整潔。請避免週末把食物留在冰箱裡。我們建議在容器上標註你的名字和日期。有些同仁反映星期一早上會發現放很久的午餐。用完咖啡機後，請考慮幫下一位沖洗一下壺。感謝大家配合。',
  qs:[
    { q:'What should staff avoid doing?', opts:['Using the coffee machine','Leaving food in the fridge over the weekend','Labeling containers','Cleaning the pot'], a:1, why:'Please avoid leaving food in the fridge over the weekend.' },
    { q:'What is suggested?', opts:['Labeling your container','Bringing lunch on Monday','Buying a new fridge','Eating outside'], a:0, why:'We suggest labeling your container.' },
    { q:'What should you consider after using the coffee machine?', opts:['Turning it off','Rinsing the pot','Reporting a problem','Refilling the beans'], a:1, why:'consider rinsing the pot for the next person.' }
  ]
},
{
  id:'r2902', u:'s2u4', title:'How He Learned English',
  text:'David started learning English at thirty. He tried studying grammar books first, but he kept forgetting the rules. Then he changed his method. He began watching short videos every morning and practicing speaking with a colleague at lunch. He also stopped translating every word in his head. After two years he was comfortable joining meetings in English. He says the key was not talent but repeating a small habit daily.',
  zh:'大衛三十歲才開始學英文。他一開始試著讀文法書，但一直忘記規則。後來他換了方法。他開始每天早上看短影片，午餐時和同事練口說。他也不再在腦中逐字翻譯。兩年後，他能自在地用英文參加會議。他說關鍵不是天分，而是每天重複一個小習慣。',
  qs:[
    { q:'What did David try first?', opts:['Watching videos','Studying grammar books','Speaking with a colleague','Joining meetings'], a:1, why:'He tried studying grammar books first.' },
    { q:'What did he stop doing?', opts:['Watching videos','Practicing at lunch','Translating every word in his head','Going to work'], a:2, why:'he also stopped translating every word in his head.' },
    { q:'What does David say the key was?', opts:['Talent','Repeating a small habit daily','Living abroad','Expensive classes'], a:1, why:'the key was not talent but repeating a small habit daily.' }
  ]
},

/* ---------------- U30 to V vs Ving ---------------- */
{
  id:'r3001', u:'s2u5', title:'Two Kinds of Forgetting',
  text:'Last Friday Ben forgot to lock the office door. The cleaner found it open at nine and called him. Ben remembered leaving at six, but he could not remember locking anything. He apologized and offered to come back, but the cleaner had already secured the room. On Monday the manager asked everyone to check the door twice. She also stopped sending reminders by email, because nobody was reading them.',
  zh:'上週五班恩忘了鎖辦公室的門。清潔人員九點發現門開著，打電話給他。班恩記得自己六點離開，但不記得有鎖過任何東西。他道了歉並表示可以回來一趟，但清潔人員已經把房間鎖好了。星期一經理請大家檢查門兩次。她也不再用電子郵件寄提醒，因為沒有人在看。',
  qs:[
    { q:'What did Ben forget?', opts:['To lock the door','Locking the door','To leave at six','Calling the cleaner'], a:0, why:'forgot to lock = 該做卻沒做。' },
    { q:'What DID Ben remember?', opts:['Locking the door','Leaving at six','Calling the manager','Checking twice'], a:1, why:'He remembered leaving at six（記得做過這件事）。' },
    { q:'Why did the manager stop sending email reminders?', opts:['She was too busy.','Nobody was reading them.','The system broke.','Ben asked her to stop.'], a:1, why:'because nobody was reading them.' }
  ]
},

/* ---------------- U31 關係代名詞 ---------------- */
{
  id:'r3101', u:'s2u6', title:'The People in Our Building',
  text:'The woman who runs the flower shop on the first floor opens at seven. The man who delivers our packages comes twice a day. The technician who fixed our printer last month works for a company which is based in Taichung. On the fourth floor there is a laboratory that only staff with a badge can enter. The receptionist who sits near the entrance knows everyone by name.',
  zh:'一樓開花店的那位女士七點開門。送包裹來的那位先生一天來兩次。上個月修好我們印表機的技師，在一家台中的公司上班。四樓有一間實驗室，只有持識別證的人員可以進去。坐在入口附近的櫃檯人員記得每個人的名字。',
  qs:[
    { q:'Who opens at seven?', opts:['The receptionist','The woman who runs the flower shop','The technician','The delivery man'], a:1, why:'The woman who runs the flower shop… opens at seven.' },
    { q:'Where is the technician\'s company based?', opts:['Taipei','Tainan','Taichung','Kaohsiung'], a:2, why:'a company which is based in Taichung.' },
    { q:'Who can enter the laboratory?', opts:['Anyone','Only staff with a badge','Only the receptionist','Visitors'], a:1, why:'only staff with a badge can enter.' }
  ]
},
{
  id:'r3102', u:'s2u6', title:'A Package with No Name',
  text:'A package which arrived this morning has no name on it. The receptionist who signed for it put it behind the front desk. The driver that delivered it said it came from a vendor in Taoyuan. If you ordered something which you have not received, please check with the front desk today. Any package that nobody claims by Friday will be returned to the sender.',
  zh:'今天早上到的一個包裹上面沒有名字。簽收的櫃檯人員把它放在櫃檯後面。送件的司機說它來自桃園的一家供應商。如果你訂了東西還沒收到，請今天到櫃檯確認。星期五前沒有人認領的包裹將退回寄件人。',
  qs:[
    { q:'What is the problem with the package?', opts:['It is damaged.','It has no name on it.','It is too heavy.','It arrived late.'], a:1, why:'A package which arrived this morning has no name on it.' },
    { q:'Where did the package come from?', opts:['A vendor in Taoyuan','A customer in Taipei','The head office','Another floor'], a:0, why:'it came from a vendor in Taoyuan.' },
    { q:'What happens to unclaimed packages?', opts:['They are thrown away.','They are opened.','They are returned to the sender.','They stay at the desk.'], a:2, why:'will be returned to the sender.' }
  ]
},

/* ---------------- U32 間接問句 ---------------- */
{
  id:'r3201', u:'s2u7', title:'At the Information Desk',
  text:'A: Excuse me, could you tell me where the meeting room is?\nB: Which one? Do you know whether it is on the third or the fourth floor?\nA: I am not certain. I was wondering if you could check for me.\nB: Of course. May I ask who invited you?\nA: Ms. Chen from sales. She did not say what time it starts, so I came early.\nB: It is room 402. Let me show you where the elevator is.',
  zh:'A：不好意思，可以告訴我會議室在哪裡嗎？\nB：哪一間？你知道是在三樓還是四樓嗎？\nA：我不太確定。不知道你能不能幫我查一下。\nB：當然。請問是誰邀請您的？\nA：業務部的陳女士。她沒說幾點開始，所以我提早來了。\nB：是 402 室。我帶您去看電梯在哪裡。',
  qs:[
    { q:'What does the visitor want to know first?', opts:['Who invited him','Where the meeting room is','What time it starts','Where the elevator is'], a:1, why:'could you tell me where the meeting room is?' },
    { q:'Why did the visitor come early?', opts:['He likes being early.','Ms. Chen did not say what time it starts.','The train was fast.','The meeting was moved.'], a:1, why:'She did not say what time it starts, so I came early.' },
    { q:'Which room is the meeting in?', opts:['Room 302','Room 402','Room 204','Room 404'], a:1, why:'It is room 402.' }
  ]
},
{
  id:'r3202', u:'s2u7', title:'A Polite Email',
  text:'Dear Mr. Wu,\nI am writing to ask whether the shipment has left the warehouse. Our client wants to know when it will arrive, and I could not find the tracking number in your last email. I was wondering if you could confirm the exact date. Please also let me know whether we need to sign for the delivery.\nThank you for your help.\nBest regards,\nLisa',
  zh:'吳先生您好：\n來信想請問貨物是否已經出倉。我們的客戶想知道何時會到，而我在您上一封信裡找不到追蹤碼。不知道您能否確認確切日期。另外也請告知我們是否需要簽收。\n感謝您的協助。\n此致\nLisa',
  qs:[
    { q:'What is Lisa\'s main question?', opts:['Whether the shipment has left the warehouse','How much the order costs','Who packed the order','Where Mr. Wu works'], a:0, why:'to ask whether the shipment has left the warehouse.' },
    { q:'What could Lisa NOT find?', opts:['The invoice','The tracking number','The address','The contract'], a:1, why:'I could not find the tracking number in your last email.' },
    { q:'What else does Lisa ask about?', opts:['Whether they need to sign for the delivery','Whether the price changed','Whether the office is open','Whether to call the client'], a:0, why:'let me know whether we need to sign for the delivery.' }
  ]
},

/* ---------------- U35 Stage 2 魔王測驗 ---------------- */
{
  id:'r3501', u:'s2u10', title:'One Year at Green Leaf',
  text:'Green Leaf opened last March. In the first three months the owner, who had worked in a hotel for ten years, struggled to attract customers. She decided to change the menu and started offering a cheaper lunch set. Since then, sales have grown every month. The staff who joined at the beginning are still there. She has recently hired two more people, and she plans to open a second shop next spring.',
  zh:'綠葉去年三月開幕。前三個月，曾在飯店工作十年的老闆很難吸引客人。她決定換菜單，開始推出比較便宜的午間套餐。從那時起，業績每個月都在成長。開幕時加入的員工都還在。她最近又聘了兩個人，並打算明年春天開第二家店。',
  qs:[
    { q:'What did the owner do before Green Leaf?', opts:['She ran another café.','She worked in a hotel.','She studied cooking abroad.','She was a supplier.'], a:1, why:'who had worked in a hotel for ten years.' },
    { q:'What change did she make?', opts:['She moved the shop.','She started offering a cheaper lunch set.','She raised the prices.','She closed on Mondays.'], a:1, why:'started offering a cheaper lunch set.' },
    { q:'What does she plan to do next spring?', opts:['Retire','Open a second shop','Hire a consultant','Change the menu again'], a:1, why:'she plans to open a second shop next spring.' }
  ]
},
{
  id:'r3502', u:'s2u10', title:'The Message That Nobody Understood',
  text:'Last week our team received an email which said only: "Please confirm by tomorrow." Nobody knew what the sender wanted us to confirm, and the message did not say who had sent it. Some people assumed it was about the budget. Others thought it was about the schedule. Finally someone decided to call the sales department, and we learned that the sender had forgotten to attach the file. Now we always ask people to be specific in the subject line.',
  zh:'上週我們團隊收到一封信，上面只寫著「請在明天前確認」。沒有人知道寄件者要我們確認什麼，訊息裡也沒說是誰寄的。有些人以為是關於預算，有些人認為是關於時程。最後有人決定打電話去業務部，我們才知道寄件者忘了附上檔案。現在我們都會請大家在主旨欄寫具體一點。',
  qs:[
    { q:'What was the problem with the email?', opts:['It was too long.','Nobody knew what to confirm.','It was sent to the wrong address.','It arrived late.'], a:1, why:'Nobody knew what the sender wanted us to confirm.' },
    { q:'What had the sender forgotten to do?', opts:['To sign the email','To attach the file','To send it on time','To call the team'], a:1, why:'the sender had forgotten to attach the file.' },
    { q:'What does the team do now?', opts:['They ignore short emails.','They ask people to be specific in the subject line.','They call instead of emailing.','They confirm everything twice.'], a:1, why:'we always ask people to be specific in the subject line.' }
  ]
}

];
