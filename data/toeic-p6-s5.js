/* ==========================================================================
   toeic-p6-s5.js — 多益 Part 6：段落填空（Unit 60、64）
   id 前綴 x，與 Stage 4 的段落填空同一個資料集

   兩篇都排在模考關，難度比 Stage 4 那三篇再往上一階：**每一篇至少有兩格的
   線索跨到別的段落**（Stage 4 大多只跨一句）。這正是 Part 6 唯一的訓練目標 ——
   把句子抽出來單獨問，它就降級成 Part 5。

   欄位與 toeic-p6-s4.js 完全相同：text 用 ___1___ 標空格、標號連號，
   blanks[i] 給 opts／a／why，其中一格 kind:'sentence' 是整句插入題。
   ========================================================================== */
window.DATA_PART6_S5 = [

{
  id:'x6001', u:'s5u5', title:'Letter: Insurance Renewal',
  text:'Dear Ms. Aliyeva,\n\nYour commercial property policy expires on 31 July. We have reviewed the cover and are pleased to say that the premium ___1___ unchanged for a second year.\n\nOne detail has been amended. Following the alarm system you installed in March, the excess on theft claims falls from 20,000 dollars to 12,000. ___2___\n\nNo action is needed if you are happy with the terms; the policy renews automatically and the first payment will be taken on 1 August. ___3___ you wish to change the cover, please reply before 20 July so that revised documents can be issued in time.\n\nWe have also enclosed a summary of the claims made over the past three years. Two of the three were settled within a month, ___4___ the third took longer because the contractor\'s report was delayed.',
  zh:'親愛的 Aliyeva 女士：\n\n您的商業財產保單將於七月三十一日到期。我們已檢視保障內容，很高興通知您保費連續第二年維持不變。\n\n有一項細節做了修改。因為您三月安裝了警報系統，竊盜理賠的自負額由兩萬元降為一萬兩千元。這項調整已反映在隨附的保單明細上。\n\n若您接受這些條件則無需任何動作；保單將自動續保，首期保費於八月一日扣款。若您希望變更保障內容，請於七月二十日前回覆，以便及時開立修訂後的文件。\n\n我們另附上過去三年的理賠摘要。三件中有兩件於一個月內結案，第三件則因承包商的報告延遲而花了較久的時間。',
  blanks:[
    { opts:['remains','remained','will have remained','is remaining'], a:0,
      why:'線索在同一句的 for a second year 與下一段的 renews automatically —— 講的是這一次續保「現在」的狀態，用現在式。' },
    { kind:'sentence',
      opts:['This adjustment is reflected in the enclosed schedule.',
            'The alarm system carries a five-year guarantee.',
            'Theft claims must be reported to the police within 24 hours.',
            'Your previous policy expired in March.'], a:0,
      why:'前一句剛講完自負額改了多少，後一段開頭是「若您接受這些條件」—— 中間要一句把這項修改收尾。B、C 換了話題，D 與第一段的七月三十一日矛盾。' },
    { opts:['If','Unless','Although','Whether'], a:0,
      why:'前一句說「不接受就不用做事」，這一句講的是相反的情況 —— 想改就要在期限前回覆，用 If。' },
    { opts:['whereas','because','therefore','so that'], a:0,
      why:'兩件一個月內結案、第三件比較久 —— 前後對比，用 whereas。線索是同一句裡的 Two … the third。' }
  ]
},

{
  id:'x6401', u:'s5u9', title:'Notice: Canteen Supplier Change',
  text:'To all staff\n\nFrom 1 September the staff canteen will be run by a new supplier, Greenfold Catering. The current supplier\'s contract ends in August after nine years, and we ___1___ them for their service.\n\nGreenfold has agreed to keep the existing prices until the end of the year. ___2___ the range will change: there will be two hot dishes at lunch instead of three, but a larger salad counter and a hot breakfast from seven.\n\n___3___\n\nStaff who have money left on a canteen card should spend it before 29 August. Balances cannot be transferred to the new system, ___4___ any amount above 100 dollars will be refunded through payroll in September.',
  zh:'致全體同仁\n\n自九月一日起，員工餐廳將改由新的供應商 Greenfold Catering 經營。現行供應商的合約在服務九年後於八月結束，我們感謝他們一路以來的付出。\n\nGreenfold 已同意價格維持到年底不變。不過品項會有調整：午餐熱食由三道改為兩道，但沙拉吧變大，並自七點起供應熱食早餐。\n\n下週三中午十二點半將於大禮堂舉辦試吃會。\n\n餐卡內尚有餘額的同仁請於八月二十九日前使用完畢。餘額無法轉入新系統，不過超過一百元的部分將於九月透過薪資退還。',
  blanks:[
    { opts:['thank','thanked','are thanking','will have thanked'], a:0,
      why:'合約八月才結束，公告此刻就在道謝 —— 用現在式。線索是同一句的 ends in August（還沒發生）。' },
    { opts:['However','Therefore','In addition','For example'], a:0,
      why:'前一句是好消息（價格不變），這一句是「品項會變」—— 語氣轉折，用 However。' },
    { kind:'sentence',
      opts:['A tasting session will be held in the main hall next Wednesday at 12:30.',
            'The canteen will close permanently at the end of August.',
            'Greenfold also operates the car park at this site.',
            'Prices will rise by five percent in September.'], a:0,
      why:'B 與第一段矛盾（是換供應商不是關閉），D 與前一段的「價格維持到年底」矛盾，C 換了話題 —— 只有試吃會接得上「品項會變」這條線。' },
    { opts:['but','so','because','unless'], a:0,
      why:'「不能轉移」與「超過一百元會退」是相反的兩件事，用 but。線索是後半句的 refunded。' }
  ]
}

];
