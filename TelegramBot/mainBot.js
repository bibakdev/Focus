const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
require('dotenv').config();

const bot = new Telegraf(process.env.KEY);
const rawData = fs.readFileSync('./quiz.json', 'utf8');
let questionsList = JSON.parse(rawData);

// const quizQuestions = questionsList.map((q, index) => {
//   return {
//     ...q,
//     id: index // شماره‌گذاری خودکار: 0, 1, 2 ...
//   };
// });

// let quizIndex = 0;
// bot.command('quiz', async (ctx) => {

//   // ... (کد نمایش سوال مثل قبل) ...
//   // اینجا تغییری لازم نیست، همان کد قبلی برای نمایش سوال
//   if (quizQuestions.length === 0) return ctx.reply('سوالی نیست.');
//   const q = quizQuestions[0]; // فقط برای تست سوال اول

//   let msgText = `❓ **${q.question}**\n\n`;
//   q.options.forEach((opt, i) => {
//     msgText += `${i + 1}️⃣ ${opt}\n`;
//   });
//   msgText += `\n👇 انتخاب کنید:`;

//   const buttons = q.options.map((_, i) =>
//     Markup.button.callback(`${i + 1}️⃣`, `ans_${q.id}_${i}`)
//   );

//   await ctx.reply(msgText, Markup.inlineKeyboard([buttons]));
// });

// // هندل کردن جواب
// bot.action(/ans_(\d+)_(\d+)/, async (ctx) => {
//   const qId = parseInt(ctx.match[1]);
//   const userAns = parseInt(ctx.match[2]);
//   const userId = ctx.from.id; // آیدی کاربر برای ارسال پیام خصوصی

//   const question = quizQuestions.find((q) => q.id === qId);
//   if (!question) return ctx.answerCbQuery('منقضی شده');

//   const isCorrect = userAns === question.correctIndex;

//   try {
//     // ۱. ارسال توضیحات کامل به پی‌وی (PV) کاربر
//     // در PV هیچ محدودیت متنی وجود ندارد
//     let pmText = isCorrect
//       ? '✅ **پاسخ شما صحیح بود!**\n\n'
//       : '❌ **پاسخ اشتباه بود!**\n\n';
//     pmText += `📚 **توضیحات کامل:**\n${question.explanation}`;

//     await ctx.telegram.sendMessage(userId, pmText);

//     // ۲. نمایش پیغام موفقیت در گروه (فقط کاربر می‌بیند)
//     await ctx.answerCbQuery(
//       isCorrect
//         ? '✅ آفرین! توضیحات کامل به PV شما ارسال شد 📩'
//         : '❌ اشتباه بود. جواب صحیح و توضیحات به PV ارسال شد 📩',
//       { show_alert: true }
//     );
//   } catch (error) {
//     // اگر ربات نتواند به پی‌وی پیام بدهد (کاربر ربات را استارت نکرده باشد)
//     // اینجا به ناچار یک خلاصه کوتاه در آلرت نشان می‌دهیم
//     console.log('User has not started the bot:', error.message);

//     await ctx.answerCbQuery(
//       (isCorrect ? '✅ درست بود!' : '❌ غلط بود!') +
//         '\n\n⚠️ برای دیدن توضیحات کامل، باید ربات را در پی‌وی استارت کنید.',
//       { show_alert: true }
//     );
//   }
// });

// bot.launch();

// const activePolls = new Map();

// let quizIndex = 0;

// bot.command('quiz', async (ctx) => {
//   if (!questionsList || questionsList.length === 0) {
//     return ctx.reply('❌ لیست سوالات خالی است.');
//   }

//   let validQuestion = null;
//   let attempts = 0;

//   // پیدا کردن سوالی که گزینه‌هایش کوتاه باشد (کمتر از ۱۰۰ کاراکتر)
//   while (attempts < questionsList.length) {
//     const currentQ = questionsList[quizIndex];
//     const areOptionsShort = currentQ.options.every((opt) => opt.length <= 100);

//     if (areOptionsShort) {
//       validQuestion = currentQ;
//       quizIndex = (quizIndex + 1) % questionsList.length;
//       break;
//     }

//     console.log(`سوال شماره ${quizIndex} به دلیل طولانی بودن گزینه‌ها رد شد.`);
//     quizIndex = (quizIndex + 1) % questionsList.length;
//     attempts++;
//   }

//   if (!validQuestion) {
//     return ctx.reply('⛔️ سوال مناسبی یافت نشد (همه گزینه‌ها طولانی هستند).');
//   }

//   try {
//     // ۱. ارسال متن صورت سوال
//     await ctx.reply(`❓ **سوال:**\n\n${validQuestion.question}`);

//     // ۲. ارسال Poll
//     const pollMessage = await ctx.replyWithQuiz(
//       '👇 گزینه صحیح را انتخاب کنید:',
//       validQuestion.options,
//       {
//         correct_option_id: validQuestion.correctIndex,
//         is_anonymous: false, // غیر ناشناس (نام کاربر مشخص است)
//         // این متن وقتی نمایش داده می‌شود که کاربر رای دهد
//         explanation: '📬 توضیحات کامل و نتیجه به پی‌وی (PV) شما ارسال شد.'
//       }
//     );

//     // ۳. ذخیره اطلاعات سوال با کلید poll_id
//     // تا وقتی کاربر جواب داد، بفهمیم به کدام سوال جواب داده
//     activePolls.set(pollMessage.poll.id, validQuestion);
//   } catch (error) {
//     console.error('Error sending quiz:', error);
//     ctx.reply('❌ خطایی رخ داد.');
//   }
// });

// // --- هندل کردن پاسخ کاربر به Poll ---
// bot.on('poll_answer', async (ctx) => {
//   const pollId = ctx.pollAnswer.poll_id;
//   const userId = ctx.pollAnswer.user.id;
//   const userOptionId = ctx.pollAnswer.option_ids[0]; // گزینه‌ای که کاربر انتخاب کرده

//   // بازیابی سوال از حافظه
//   const question = activePolls.get(pollId);

//   // اگر سوال پیدا نشد (مثلا ربات ریست شده باشد) کاری نمی‌کنیم
//   if (!question) return;

//   const isCorrect = userOptionId === question.correctIndex;

//   // متن پیامی که قرار است به PV برود
//   let pmText = '';

//   if (isCorrect) {
//     pmText = `✅ **آفرین! پاسخ شما صحیح بود.**\n\n`;
//   } else {
//     pmText =
//       `❌ **پاسخ شما اشتباه بود!**\n\n` +
//       `✅ گزینه صحیح: **${question.options[question.correctIndex]}**\n\n`;
//   }

//   // افزودن توضیحات
//   pmText += `📚 **توضیحات تکمیلی:**\n${question.explanation}`;

//   // افزودن منبع اگر باشد
//   if (question.source) {
//     pmText += `\n\n📌 منبع: ${question.source}`;
//   }

//   // ارسال به PV
//   try {
//     await ctx.telegram.sendMessage(userId, pmText);
//   } catch (error) {
//     console.log(`نمی‌توان به کاربر ${userId} پیام داد (ربات را استارت نکرده).`);
//     // چون Poll Answer است، نمی‌توانیم اینجا به کاربر Alert بدهیم
//     // پس فقط در کنسول لاگ می‌گیریم
//   }
// });

// bot.launch();
// console.log('Bot is running...');

const questionsList = JSON.parse(rawData).map((q, index) => {
  return {
    ...q,
    id: index // اختصاص ID ثابت به هر سوال
  };
});

// برای ذخیره اطلاعات Pollهای فعال (روش اول)
const activePolls = new Map();

let quizIndex = 0;

bot.command('quiz', async (ctx) => {
  if (!questionsList || questionsList.length === 0) {
    return ctx.reply('❌ لیست سوالات خالی است.');
  }

  const currentQ = questionsList[quizIndex];

  // --- شرط تصمیم‌گیری ---
  // آیا سوال مناسب Poll است؟ (سوال کمتر از ۲۵۵ و همه گزینه‌ها کمتر از ۱۰۰)
  const isSuitableForPoll =
    currentQ.question.length <= 255 &&
    currentQ.options.every((opt) => opt.length <= 100);

  try {
    if (isSuitableForPoll) {
      // ==========================================
      // روش اول: استفاده از POLL (برای سوالات کوتاه)
      // ==========================================

      // الف) ارسال صورت سوال (برای اطمینان بیشتر، جداگانه هم می‌فرستیم)
      await ctx.reply(`❓ **سوال:**\n\n${currentQ.question}`);

      // ب) ارسال Poll
      const pollMessage = await ctx.replyWithQuiz(
        '👇 گزینه صحیح را انتخاب کنید:',
        currentQ.options,
        {
          correct_option_id: currentQ.correctIndex,
          is_anonymous: false,
          explanation: '📬 توضیحات کامل و نتیجه به پی‌وی (PV) شما ارسال شد.'
        }
      );

      // ج) ذخیره در حافظه برای هندل کردن جواب
      activePolls.set(pollMessage.poll.id, currentQ);
    } else {
      // ==========================================
      // روش دوم: دکمه شیشه‌ای (برای سوالات طولانی)
      // ==========================================

      // الف) ساخت متن پیام (سوال + گزینه‌ها)
      let msgText = `❓ **سوال:**\n\n${currentQ.question}\n\n〰〰〰〰〰\n`;
      currentQ.options.forEach((opt, i) => {
        msgText += `${i + 1}️⃣ ${opt}\n\n`;
      });
      msgText += `👇 **گزینه صحیح را انتخاب کنید:**`;

      // ب) ساخت دکمه‌ها (فقط شماره)
      const buttons = currentQ.options.map((_, i) =>
        Markup.button.callback(`${i + 1}️⃣`, `ans_${currentQ.id}_${i}`)
      );

      // ج) ارسال پیام
      await ctx.reply(msgText, Markup.inlineKeyboard([buttons]));
    }
  } catch (error) {
    console.error('Error sending quiz:', error);
    ctx.reply('❌ خطایی رخ داد.');
  }

  // رفتن به سوال بعدی برای دفعه بعد
  quizIndex = (quizIndex + 1) % questionsList.length;
});

// ---------------------------------------------------------
// هندلر ۱: پاسخ به POLL (روش اول)
// ---------------------------------------------------------
bot.on('poll_answer', async (ctx) => {
  const pollId = ctx.pollAnswer.poll_id;
  const userId = ctx.pollAnswer.user.id;
  const userOptionId = ctx.pollAnswer.option_ids[0];

  const question = activePolls.get(pollId);
  if (!question) return; // سوال پیدا نشد (شاید ربات ریست شده)

  const isCorrect = userOptionId === question.correctIndex;

  // ارسال پیام به PV
  await sendResultToPV(ctx, userId, isCorrect, question);
});

// ---------------------------------------------------------
// هندلر ۲: پاسخ به دکمه شیشه‌ای (روش دوم)
// ---------------------------------------------------------
bot.action(/ans_(\d+)_(\d+)/, async (ctx) => {
  const qId = parseInt(ctx.match[1]);
  const userAns = parseInt(ctx.match[2]);
  const userId = ctx.from.id;

  const question = questionsList.find((q) => q.id === qId);
  if (!question) return ctx.answerCbQuery('❌ سوال یافت نشد.');

  const isCorrect = userAns === question.correctIndex;

  // ۱. نمایش آلرت (Toast) لحظه‌ای
  if (isCorrect) {
    await ctx.answerCbQuery('✅ آفرین! توضیحات به PV ارسال شد.', {
      show_alert: false
    });
  } else {
    await ctx.answerCbQuery('❌ اشتباه بود! توضیحات به PV ارسال شد.', {
      show_alert: false
    });
  }

  // ۲. ارسال پیام کامل به PV
  await sendResultToPV(ctx, userId, isCorrect, question);
});

// ---------------------------------------------------------
// تابع کمکی: ارسال نتیجه به PV (مشترک بین هر دو روش)
// ---------------------------------------------------------
async function sendResultToPV(ctx, userId, isCorrect, question) {
  let pmText = '';

  if (isCorrect) {
    pmText = `✅ **آفرین! پاسخ شما صحیح بود.**\n\n`;
  } else {
    // پیدا کردن متن گزینه صحیح برای نمایش
    // اگر سوال خیلی طولانی باشد شاید متن گزینه هم طولانی باشد، پس همینطوری نمایش می‌دهیم
    const correctOptText = question.options[question.correctIndex];
    pmText =
      `❌ **پاسخ شما اشتباه بود!**\n\n` +
      `✅ گزینه صحیح: **${correctOptText}**\n\n`;
  }

  pmText += `📚 **توضیحات تکمیلی:**\n${question.explanation}`;

  if (question.source) {
    pmText += `\n\n📌 منبع: ${question.source}`;
  }

  try {
    await ctx.telegram.sendMessage(userId, pmText);
  } catch (error) {
    console.log(`User ${userId} blocked the bot or hasn't started it.`);
    // اینجا چون تابع مشترک است، نمی‌توانیم Alert بدهیم (چون در Poll دسترسی به Alert نداریم)
    // اما در روش دکمه‌ای، Alert قبلاً نمایش داده شده است.
  }
}

bot.launch();
console.log('Bot is running with Hybrid Quiz System...');
