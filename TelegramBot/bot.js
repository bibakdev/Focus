// const { Telegraf } = require('telegraf');
// const fs = require('fs');
// const path = require('path');
// require('dotenv').config();

// const bot = new Telegraf(process.env.KEY);
// const targetsPath = path.join(__dirname, 'targets.json');
// const quizQuestions = JSON.parse(fs.readFileSync('./quiz.json', 'utf8'));

// // خواندن اطلاعات از فایل‌های JSON
// const highestStudy = JSON.parse(
//   fs.readFileSync(
//     path.join('C:/Users/majid/Desktop/Focus', 'highestStudy.json')
//   )
// );
// const outputDay = JSON.parse(
//   fs.readFileSync(path.join('C:/Users/majid/Desktop/Focus', 'output_day.json'))
// );
// const output = JSON.parse(
//   fs.readFileSync(path.join('C:/Users/majid/Desktop/Focus', 'output.json'))
// );

// // استخراج همه نام‌ها از فایل‌های JSON
// const allUsers = Array.from(
//   new Set([
//     ...Object.keys(highestStudy),
//     ...Object.keys(outputDay),
//     ...Object.keys(output.weeklyHours)
//   ])
// );

// // شروع ربات
// bot.start((ctx) => {
//   ctx.reply(
//     'لطفاً نام خود را وارد کنید یا یکی از گزینه‌های زیر را انتخاب کنید:',
//     {
//       reply_markup: {
//         keyboard: [
//           ['📋 مشاهده لیست کاربران'],
//           ['🏅 رتبه‌بندی هفتگی', '📅 رتبه‌بندی روزانه']
//         ],
//         resize_keyboard: true
//       }
//     }
//   );
// });

// // نمایش لیست کاربران
// bot.hears('📋 مشاهده لیست کاربران', (ctx) => {
//   const userList = allUsers.join('\n');
//   ctx.reply(`📃 لیست کاربران:\n${userList}`);
// });

// // رتبه‌بندی هفتگی
// bot.hears('🏅 رتبه‌بندی هفتگی', (ctx) => {
//   console.log('🔍 داده‌های رتبه‌بندی هفتگی:', output.weeklyHours);

//   const sortedWeekly =
//     output.weeklyHours && Object.keys(output.weeklyHours).length
//       ? Object.keys(output.weeklyHours)
//           .filter((name) => output.weeklyHours[name].weekStudies.length)
//           .map((name) => ({
//             name,
//             value: output.weeklyHours[name].weekStudies.slice(-1)[0]
//           }))
//           .sort((a, b) => b.value - a.value)
//           .map((entry, index) => {
//             const timeFormatted = `${Math.floor(entry.value / 60)}h ${
//               entry.value % 60
//             }m`;
//             let prefix = `${index + 1}.`;

//             if (index === 0) prefix = `👸🏼🤴🏻 ${index + 1}.`; // نفر اول
//             if (index === 1) prefix = `🔥 ${index + 1}.`; // نفر دوم
//             if (index === 2) prefix = `⚡️ ${index + 1}.`; // نفر سوم
//             if (index === 3) prefix = `⭐️ ${index + 1}.`; // نفر چهارم
//             if (index === 4) prefix = `💎 ${index + 1}.`; // نفر پنجم

//             return `${prefix} ${entry.name}: ${timeFormatted}`;
//           })
//           .join('\n')
//       : '⛔️ اطلاعاتی برای نمایش موجود نیست.';

//   console.log('📋 خروجی نهایی:', sortedWeekly);

//   ctx.reply(`🏅 رتبه‌بندی هفتگی:\n${sortedWeekly}`);
// });

// bot.command('weekly', (ctx) => {
//   console.log('🔍 داده‌های رتبه‌بندی هفتگی:', output.weeklyHours);

//   const sortedWeekly =
//     output.weeklyHours && Object.keys(output.weeklyHours).length
//       ? Object.keys(output.weeklyHours)
//           .filter((name) => output.weeklyHours[name].weekStudies.length)
//           .map((name) => ({
//             name,
//             value: output.weeklyHours[name].weekStudies.slice(-1)[0]
//           }))
//           .sort((a, b) => b.value - a.value)
//           .map((entry, index) => {
//             const timeFormatted = `${Math.floor(entry.value / 60)}h ${
//               entry.value % 60
//             }m`;
//             let prefix = `${index + 1}.`;

//             if (index === 0) prefix = `👸🏼🤴🏻 ${index + 1}.`; // نفر اول
//             if (index === 1) prefix = `🔥 ${index + 1}.`; // نفر دوم
//             if (index === 2) prefix = `⚡️ ${index + 1}.`; // نفر سوم
//             if (index === 3) prefix = `⭐️ ${index + 1}.`; // نفر چهارم
//             if (index === 4) prefix = `💎 ${index + 1}.`; // نفر پنجم

//             return `${prefix} ${entry.name}: ${timeFormatted}`;
//           })
//           .join('\n')
//       : '⛔️ اطلاعاتی برای نمایش موجود نیست.';

//   console.log('📋 خروجی نهایی:', sortedWeekly);

//   ctx.reply(`🏅 رتبه‌بندی هفتگی:\n${sortedWeekly}`);
// });

// bot.command('weekly_p', (ctx) => {
//   const progress = Object.keys(output.weeklyHours)
//     .filter((name) => output.weeklyHours[name].weekStudies.length >= 2)
//     .map((name) => {
//       const data = output.weeklyHours[name].weekStudies.slice(-2); // دو مقدار آخر
//       return {
//         name,
//         change: data[1] - data[0] // محاسبه تغییر
//       };
//     })
//     .filter((entry) => entry.change > 0) // فقط پیشرفت‌ها
//     .sort((a, b) => b.change - a.change) // مرتب‌سازی از بزرگ به کوچک
//     .map((entry, index) => {
//       const timeFormatted = `${Math.floor(entry.change / 60)}h ${
//         entry.change % 60
//       }m`;

//       let prefix = `${index + 1}.`;
//       if (index === 0) prefix = `🚀 ${index + 1}.`;
//       if (index === 1) prefix = `🏎 ${index + 1}.`;
//       if (index === 2) prefix = `🚴 ${index + 1}.`;
//       if (index === 3) prefix = `🏃‍♀️ ${index + 1}.`;
//       if (index === 4) prefix = `🚶‍♀️ ${index + 1}.`;

//       return `${prefix} ${entry.name} (${timeFormatted})`;
//     })
//     .join('\n');

//   ctx.reply(
//     `📈 پیشرفت‌های هفتگی:\n${progress || '⛔️ اطلاعاتی برای نمایش موجود نیست.'}`
//   );
// });

// bot.command('weekly_r', (ctx) => {
//   const regression = Object.keys(output.weeklyHours)
//     .filter((name) => output.weeklyHours[name].weekStudies.length >= 2)
//     .map((name) => {
//       const data = output.weeklyHours[name].weekStudies.slice(-2); // دو مقدار آخر
//       return {
//         name,
//         change: data[1] - data[0] // محاسبه تغییر
//       };
//     })
//     .filter((entry) => entry.change < 0) // فقط پسرفت‌ها
//     .sort((a, b) => a.change - b.change) // مرتب‌سازی از کوچک به بزرگ (منفی بیشتر = افت بیشتر)
//     .map((entry, index) => {
//       const timeFormatted = `${Math.floor(Math.abs(entry.change) / 60)}h ${
//         Math.abs(entry.change) % 60
//       }m`;

//       let prefix = `${index + 1}.`;
//       if (index === 0) prefix = `🦥 ${index + 1}.`;
//       if (index === 1) prefix = `🐌 ${index + 1}.`;
//       if (index === 2) prefix = `🐢 ${index + 1}.`;

//       return `${prefix} ${entry.name} (-${timeFormatted})`;
//     })
//     .join('\n');

//   ctx.reply(
//     `📉 پسرفت‌های هفتگی:\n${
//       regression || '⛔️ اطلاعاتی برای نمایش موجود نیست.'
//     }`
//   );
// });
// // --------------------------------------

// // رتبه‌بندی روزانه
// bot.hears('📅 رتبه‌بندی روزانه', (ctx) => {
//   const sortedDaily = Object.keys(outputDay)
//     .filter((name) => outputDay[name].totalHoursDays.length)
//     .map((name) => ({
//       name,
//       value: outputDay[name].totalHoursDays.slice(-1)[0]
//     }))
//     .sort((a, b) => b.value - a.value)
//     .map((entry, index) => {
//       const timeFormatted = `${Math.floor(entry.value / 60)}h ${
//         entry.value % 60
//       }m`;
//       let prefix = `${index + 1}.`;

//       if (index === 0) prefix = `🚀 ${index + 1}.`; // نفر اول
//       if (index === 1) prefix = `🏎 ${index + 1}.`; // نفر دوم
//       if (index === 2) prefix = `🚴 ${index + 1}.`; // نفر سوم
//       if (index === 3) prefix = `🏃‍♂️🏃‍♀️ ${index + 1}.`; // نفر چهارم
//       if (index === 4) prefix = `🚶‍♂️🚶‍♀️ ${index + 1}.`; // نفر پنجم

//       return `${prefix} ${entry.name}: ${timeFormatted}`;
//     })
//     .join('\n');

//   ctx.reply(
//     `📅 رتبه‌بندی روزانه:\n${
//       sortedDaily || '⛔️ اطلاعاتی برای نمایش موجود نیست.'
//     }`
//   );
// });

// bot.command('daily', (ctx) => {
//   const inputData = JSON.parse(
//     fs.readFileSync('C:/Users/majid/Desktop/Focus/input.json', 'utf8')
//   );

//   const sortedDaily = inputData
//     .map((entry) => ({
//       name: entry.name,
//       value: convertToMinutes(entry.today)
//     }))
//     .sort((a, b) => b.value - a.value)
//     .map((entry, index) => {
//       const timeFormatted = `${Math.floor(entry.value / 60)}h ${
//         entry.value % 60
//       }m`;
//       let prefix = `${index + 1}.`;

//       if (index === 0) prefix = `👸🏼🤴🏻 ${index + 1}.`;
//       if (index === 1) prefix = `🔥 ${index + 1}.`;
//       if (index === 2) prefix = `⚡️ ${index + 1}.`;
//       if (index === 3) prefix = `⭐️ ${index + 1}.`;
//       if (index === 4) prefix = `💎 ${index + 1}.`;

//       return `${prefix} ${entry.name}: ${timeFormatted}`;
//     })
//     .join('\n');

//   ctx.reply(
//     `📅 رتبه‌بندی روزانه:\n${
//       sortedDaily || '⛔️ اطلاعاتی برای نمایش موجود نیست.'
//     }`
//   );
// });

// // تبدیل فرمت '17h 19m' به دقیقه
// function convertToMinutes(timeString) {
//   const match = timeString.match(/(\d+)h\s*(\d+)m/);
//   if (!match) return 0; // در صورت نبود فرمت صحیح
//   const [, hours, minutes] = match;
//   return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
// }

// //daily progress
// bot.command('daily_p', (ctx) => {
//   const inputData = JSON.parse(
//     fs.readFileSync('C:/Users/majid/Desktop/Focus/output_day.json', 'utf8')
//   );

//   const progressData = Object.keys(inputData)
//     .filter((name) => inputData[name].totalHoursDays.length >= 2)
//     .map((name) => {
//       const data = inputData[name].totalHoursDays.slice(-2);
//       const change = data[1] - data[0];
//       return { name, change };
//     });

//   const progress = progressData
//     .filter((entry) => entry.change > 0)
//     .sort((a, b) => b.change - a.change)
//     .map((entry, index) => {
//       const timeFormatted = `${Math.floor(entry.change / 60)}h ${
//         entry.change % 60
//       }m`;
//       let prefix = `${index + 1}.`;
//       if (index === 0) prefix = `🚀 ${index + 1}.`;
//       if (index === 1) prefix = `🔥 ${index + 1}.`;
//       if (index === 2) prefix = `💪 ${index + 1}.`;
//       return `${prefix} ${entry.name} (+${timeFormatted})`;
//     })
//     .join('\n');

//   ctx.reply(`📈 پیشرفت‌ها:
// ${progress || '⛔️ اطلاعاتی برای نمایش موجود نیست.'}`);
// });

// // dialy regress
// function convertToMinutes(time) {
//   if (typeof time === 'number') return time; // اگر از قبل عدد است
//   const match = typeof time === 'string' && time.match(/(\d+)h\s*(\d+)m/);
//   if (!match) return 0; // در صورت نبود فرمت صحیح
//   const [, hours, minutes] = match;
//   return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
// }

// bot.command('daily_r', (ctx) => {
//   const regression = Object.keys(outputDay)
//     .filter((name) => outputDay[name].totalHoursDays.length >= 2)
//     .map((name) => {
//       const data = outputDay[name].totalHoursDays
//         .slice(-2)
//         .map(convertToMinutes); // تبدیل به دقیقه
//       return {
//         name,
//         change: data[1] - data[0] // محاسبه تغییر
//       };
//     })
//     .filter((entry) => entry.change < 0) // فقط پسرفت‌ها
//     .sort((a, b) => a.change - b.change) // مرتب‌سازی از کوچک به بزرگ (منفی بیشتر = افت بیشتر)
//     .map((entry, index) => {
//       const timeFormatted = `${Math.floor(Math.abs(entry.change) / 60)}h ${
//         Math.abs(entry.change) % 60
//       }m`;

//       let prefix = `${index + 1}.`;
//       if (index === 0) prefix = `🦥 ${index + 1}.`;
//       if (index === 1) prefix = `🐌 ${index + 1}.`;
//       if (index === 2) prefix = `🐢 ${index + 1}.`;

//       return `${prefix} ${entry.name} (-${timeFormatted})`;
//     })
//     .join('\n');

//   ctx.reply(
//     `📉 پسرفت‌ها:\n${regression || '⛔️ اطلاعاتی برای نمایش موجود نیست.'}`
//   );
// });

// // consistency
// bot.command('con', (ctx) => {
//   const sortedByCount = Object.keys(outputDay)
//     .filter((name) => outputDay[name].count) // فقط کاربرانی که مقدار count دارند
//     .map((name) => ({
//       name,
//       count: outputDay[name].count
//     }))
//     .sort((a, b) => b.count - a.count) // مرتب‌سازی از بزرگ به کوچک
//     .map((entry, index) => {
//       let prefix = `${index + 1}.`;
//       if (index === 0) prefix = `🎖 ${entry.name} => ${entry.count}`;
//       if (index === 1) prefix = `🥈 ${entry.name} => ${entry.count}`;
//       if (index === 2) prefix = `🥉 ${entry.name} => ${entry.count}`;
//       if (index >= 3) prefix = `${index + 1}. ${entry.name} => ${entry.count}`;
//       return prefix;
//     })
//     .join('\n');

//   ctx.reply(
//     `🏆 رتبه‌بندی بر اساس استمرار:\n${
//       sortedByCount || '⛔️ اطلاعاتی برای نمایش موجود نیست.'
//     }`
//   );
// });

// //highest
// bot.command('highest', (ctx) => {
//   const highestData = Object.keys(highestStudy)
//     .map((name) => ({
//       name,
//       previous: Number(highestStudy[name].previous) || 0,
//       highest: Number(highestStudy[name].highest) || 0
//     }))
//     .map((entry) => {
//       const previousFormatted = `${Math.floor(entry.previous / 60)}h ${
//         entry.previous % 60
//       }m`;
//       const highestFormatted = `${Math.floor(entry.highest / 60)}h ${
//         entry.highest % 60
//       }m`;

//       return `✌️ ${entry.name} (${previousFormatted} 👉 ${highestFormatted})`;
//     })
//     .join('\n');

//   ctx.reply(
//     `🏆 بیشترین زمان مطالعه:\n${
//       highestData || '⛔️ اطلاعاتی برای نمایش موجود نیست.'
//     }`
//   );
// });

// // ******************************

// const ADMIN_ID = '82695101'; // شناسه مدیر (جایگزین کن با شناسه خودت)
// const targetsData = JSON.parse(
//   fs.readFileSync('./targets.json', 'utf8') || '{}'
// );

// // تابع بررسی مدیر
// const isAdmin = (ctx) => ctx.from.id.toString() === ADMIN_ID;

// // افزودن فرد جدید با تایم مشخص
// bot.command('addtarget', (ctx) => {
//   // if (!isAdmin(ctx)) {
//   //   return ctx.reply('⛔️ شما اجازه استفاده از این دستور را ندارید.');
//   // }

//   let targetsData = {};
//   try {
//     targetsData = JSON.parse(fs.readFileSync('./targets.json', 'utf8')) || {};
//   } catch (error) {
//     console.error('❌ خطا در خواندن فایل targets.json:', error.message);
//     targetsData = {}; // اطمینان حاصل می‌کند که اطلاعات قبلی بازنگردد.
//   }

//   const input = ctx.message.text.split(' ').slice(1).join(' ');

//   if (!input) {
//     return ctx.reply(
//       '⛔️ لطفاً اطلاعات فرد و تایم را وارد کنید. مثال: `/addtarget Mahyar 5h 30m`'
//     );
//   }

//   const [name, ...timeParts] = input.split(' ');

//   if (!name || !timeParts.length) {
//     return ctx.reply('⚠️ فرمت صحیح: `/addtarget نام مدت‌زمان`');
//   }

//   const time = timeParts.join(' ').trim();

//   targetsData[name] = { target: time };

//   fs.writeFileSync('./targets.json', JSON.stringify(targetsData, null, 2));

//   ctx.reply(`✅ زمان هدف برای "${name}" با موفقیت ثبت شد.`);
// });

// // نمایش لیست افراد و تایم‌ها
// bot.command('showtargets', (ctx) => {
//   // if (!isAdmin(ctx)) {
//   //   return ctx.reply('⛔️ شما اجازه استفاده از این دستور را ندارید.');
//   // }

//   let targetsData = {};
//   try {
//     targetsData = JSON.parse(fs.readFileSync(targetsPath, 'utf8')) || {};
//   } catch (error) {
//     console.error('❌ خطا در خواندن فایل targets.json:', error.message);
//     targetsData = {};
//   }

//   const formattedTargets = Object.entries(targetsData)
//     .map(([name, { target }]) => `🎯 ${name}: ${target}`)
//     .join('\n');

//   ctx.reply(
//     ` لیست افراد و زمان‌های هدف در چالش آینده 🍌\n${
//       formattedTargets || '⛔️ هنوز اطلاعاتی ثبت نشده است.'
//     }`
//   );
// });

// // حذف فرد از لیست
// bot.command('removetarget', (ctx) => {
//   if (!isAdmin(ctx)) {
//     return ctx.reply('⛔️ شما اجازه استفاده از این دستور را ندارید.');
//   }

//   let targetsData = {};
//   try {
//     targetsData = JSON.parse(fs.readFileSync('./targets.json', 'utf8')) || {};
//   } catch (error) {
//     console.error('❌ خطا در خواندن فایل targets.json:', error.message);
//     targetsData = {};
//   }

//   const name = ctx.message.text.split(' ').slice(1).join(' ');

//   if (!name) {
//     return ctx.reply('⚠️ لطفاً نام فردی را که می‌خواهید حذف کنید وارد کنید.');
//   }

//   if (targetsData[name]) {
//     delete targetsData[name];
//     fs.writeFileSync('./targets.json', JSON.stringify(targetsData, null, 2));
//     ctx.reply(`🗑 "${name}" با موفقیت حذف شد.`);
//   } else {
//     ctx.reply(`❌ "${name}" در لیست یافت نشد.`);
//   }
// });

// // اجرای دستور /run

// // تبدیل زمان به دقیقه
// function timeToMinutes(time) {
//   const parts = time.match(/(\d+)h\s*(\d+)?m?/); // پشتیبانی از مقادیر مانند 2h 30m و 2h
//   const hours = parts ? parseInt(parts[1]) || 0 : 0;
//   const minutes = parts && parts[2] ? parseInt(parts[2]) || 0 : 0;
//   return hours * 60 + minutes;
// }

// // اجرای دستور /run
// bot.command('run', (ctx) => {
//   try {
//     const targetsData = JSON.parse(
//       fs.readFileSync(
//         'C:/Users/majid/Desktop/Focus/TelegramBot/targets.json',
//         'utf8'
//       ) || '{}'
//     );

//     const inputData = JSON.parse(
//       fs.readFileSync('C:/Users/majid/Desktop/Focus/input.json', 'utf8') || '{}'
//     );

//     const results = [];

//     for (const [name, { target }] of Object.entries(targetsData)) {
//       const userData = inputData.find((user) => user.name === name);

//       if (userData && userData.today) {
//         const targetMinutes = timeToMinutes(target);
//         const todayMinutes = timeToMinutes(userData.today);

//         const status = targetMinutes > todayMinutes ? '🍌' : '✅';
//         results.push(`${name} (${target} => ${userData.today}) ${status}`);

//         // if (name === 'me') {
//         //   const status = targetMinutes > todayMinutes ? '🦥' : '✅';

//         //   results.push(`${name} (${target} => ${userData.today}) ${status}`);
//         // } else {
//         //   results.push(`${name} (${target} => ${userData.today}) ${status}`);
//         // }
//         console.log(name, target, userData.today, status);
//       } else {
//         results.push(`${name} (${target} => ❓ اطلاعات یافت نشد)`);
//       }
//     }

//     const outputMessage = results.length
//       ? results.join('\n')
//       : '⛔️ اطلاعاتی برای نمایش وجود ندارد.';

//     ctx.reply(`نتیجه چالش موزی  🍌\n \n` + outputMessage);
//   } catch (error) {
//     ctx.reply('❌ خطایی رخ داد: ' + error.message);
//   }
// });

// bot.command('removeall', (ctx) => {
//   if (!isAdmin(ctx)) {
//     return ctx.reply('⛔️ فقط مدیر می‌تواند این دستور را اجرا کند.');
//   }

//   fs.writeFileSync('./targets.json', '{}', 'utf8');
//   ctx.reply('✅ همه کاربران با موفقیت از فایل targets.json حذف شدند.');
// });

// // ------------------------------
// // ------------------------------

// // bot.command('quiz', async (ctx) => {
// //   if (quizQuestions.length === 0) {
// //     return ctx.reply('❌ سوالی در لیست باقی نمانده است.');
// //   }

// //   // انتخاب تصادفی یک سوال
// //   const randomIndex = Math.floor(Math.random() * quizQuestions.length);
// //   const randomQuestion = quizQuestions[randomIndex];

// //   // حذف سوال انتخاب شده از آرایه
// //   quizQuestions.splice(randomIndex, 1);

// //   // بازنویسی فایل JSON بدون سوال انتخاب شده
// //   fs.writeFileSync('./quiz.json', JSON.stringify(quizQuestions, null, 2));

// //   await ctx.sendPoll(randomQuestion.question, randomQuestion.options, {
// //     type: 'quiz',
// //     correct_option_id: randomQuestion.correctIndex,
// //     explanation: 'اگه دوست داشتی تحلیل خودتو برا دوستات بگو',
// //     is_anonymous: false, // نمایش نام شرکت‌کنندگان
// //     allows_multiple_answers: false // فقط یک پاسخ مجاز است
// //   });
// // });

// // bot.command('quiz', async (ctx) => {
// // بررسی اینکه فقط شما (مدیر) بتوانید این دستور را اجرا کنید
// // if (ctx.from.id.toString() !== ADMIN_ID) {
// //   return ctx.reply('⛔️ شما اجازه دسترسی به این دستور را ندارید.');
// // }

// //   if (quizQuestions.length === 0) {
// //     return ctx.reply('❌ سوالی در لیست باقی نمانده است.');
// //   }
// //   // انتخاب سوالی که همه گزینه‌های آن کمتر از 100 کاراکتر باشد
// //   let validQuestionIndex = quizQuestions.findIndex((question) =>
// //     question.options.every((option) => option.length <= 100)
// //   );

// //   if (validQuestionIndex === -1) {
// //     return ctx.reply('⛔️ سوالی با گزینه‌های کمتر از 100 کاراکتر یافت نشد.');
// //   }

// //   const randomQuestion = quizQuestions[validQuestionIndex];

// //   // حذف سوال انتخاب شده از آرایه
// //   quizQuestions.splice(validQuestionIndex, 1);

// //   // بازنویسی فایل JSON بدون سوال انتخاب شده
// //   fs.writeFileSync('./quiz.json', JSON.stringify(quizQuestions, null, 2));

// //   await ctx.sendPoll(randomQuestion.question, randomQuestion.options, {
// //     type: 'quiz',
// //     correct_option_id: randomQuestion.correctIndex,
// //     explanation: 'اگه دوست داشتی تحلیل خودتو برا دوستات بگو',
// //     is_anonymous: false,
// //     allows_multiple_answers: false
// //   });
// // });

// let quizIndex = 0;

// bot.command('quiz', async (ctx) => {
//   if (quizQuestions.length === 0) {
//     return ctx.reply('❌ سوالی در لیست وجود ندارد.');
//   }

//   let validQuestion = null;

//   // جستجوی سوال معتبر
//   while (quizIndex < quizQuestions.length) {
//     const currentQuestion = quizQuestions[quizIndex];

//     // بررسی طول سوال
//     if (currentQuestion.question.length > 255) {
//       quizIndex = (quizIndex + 1) % quizQuestions.length;
//       continue;
//     }

//     // بررسی طول گزینه‌ها
//     if (
//       Array.isArray(currentQuestion.options) &&
//       currentQuestion.options.every((option) => option.length <= 100)
//     ) {
//       // بررسی طول توضیحات
//       if (currentQuestion.explanation.length <= 200) {
//         validQuestion = currentQuestion;
//         break;
//       }
//     }

//     // رفتن به سوال بعدی در صورت نامعتبر بودن سوال فعلی
//     quizIndex = (quizIndex + 1) % quizQuestions.length;
//   }

//   if (!validQuestion) {
//     return ctx.reply('⛔️ سوالی با گزینه‌های معتبر یا توضیح مناسب یافت نشد.');
//   }

//   await ctx.sendPoll(validQuestion.question, validQuestion.options, {
//     type: 'quiz',
//     correct_option_id: validQuestion.correctIndex,
//     explanation: `\nℹ️ توضیح: ${validQuestion.explanation}`,
//     is_anonymous: false,
//     allows_multiple_answers: false
//   });

//   // افزایش ایندکس برای سوال بعدی
//   quizIndex = (quizIndex + 1) % quizQuestions.length;
// });

// //-------------------------------

// // نمایش اطلاعات شخصی
// // bot.on('text', (ctx) => {
// //   const name = ctx.message.text.trim();
// //   if (allUsers.includes(name)) {
// //     const userInfo = [];

// //     userInfo.push(`👤 ${name}`);
// //     if (highestStudy[name]) {
// //       const highest = highestStudy[name].highest;
// //       const hours = Math.floor(highest / 60);
// //       const minutes = highest % 60;
// //       userInfo.push(`📈 بیشترین زمان مطالعه: ${hours} ساعت و ${minutes} دقیقه`);
// //     }

// //     if (outputDay[name]) {
// //       const todayStudy = outputDay[name].totalHoursDays.slice(-1)[0];
// //       userInfo.push(
// //         `مطالعه امروز: ${Math.floor(todayStudy / 60)} ساعت و ${
// //           todayStudy % 60
// //         } دقیقه`
// //       );
// //       userInfo.push(`استمرار: ${outputDay[name].count} روز`);
// //     }

// //     if (output.weeklyHours[name]) {
// //       const weekStudy = output.weeklyHours[name].weekStudies.slice(-1)[0];
// //       const rates = output.weeklyHours[name].rates
// //         .map((rate) => (rate >= 0 ? `${rate}🚀` : `${rate}📉`))
// //         .join(' ');
// //       userInfo.push(
// //         `مطالعه هفتگی: ${Math.floor(weekStudy / 60)} ساعت و ${
// //           weekStudy % 60
// //         } دقیقه`
// //       );
// //       if (rates) {
// //         userInfo.push(`روند پیشرفت هفتگی: ${rates}`);
// //       }
// //     }

// //     ctx.reply(userInfo.join('\n'));
// //   } else {
// //     ctx.reply(
// //       '❗️ نام وارد شده یافت نشد. لطفاً نام خود را صحیح وارد کنید یا از لیست کاربران استفاده کنید.'
// //     );
// //   }
// // });

// // نمایش اطلاعات شخصی با دستور /info

// bot.command('info', (ctx) => {
//   const name = ctx.message.text.split('/info ')[1]?.trim();

//   if (!name) {
//     return ctx.reply('❗️ لطفاً نام خود را به‌صورت `/info [نام]` وارد کنید.');
//   }

//   if (allUsers.includes(name)) {
//     const userInfo = [];

//     userInfo.push(`👤 ${name}`);
//     if (highestStudy[name]) {
//       const highest = highestStudy[name].highest;
//       const hours = Math.floor(highest / 60);
//       const minutes = highest % 60;
//       userInfo.push(`📈 بیشترین زمان مطالعه: ${hours} ساعت و ${minutes} دقیقه`);
//     }

//     if (outputDay[name]) {
//       const todayStudy = outputDay[name].totalHoursDays.slice(-1)[0];
//       userInfo.push(
//         `مطالعه امروز: ${Math.floor(todayStudy / 60)} ساعت و ${
//           todayStudy % 60
//         } دقیقه`
//       );
//       userInfo.push(`استمرار: ${outputDay[name].count} روز`);
//     }

//     if (output.weeklyHours[name]) {
//       const weekStudy = output.weeklyHours[name].weekStudies.slice(-1)[0];
//       const rates = output.weeklyHours[name].rates
//         .map((rate) => (rate >= 0 ? `${rate}🚀` : `${rate}📉`))
//         .join(' ');
//       userInfo.push(
//         `مطالعه هفتگی: ${Math.floor(weekStudy / 60)} ساعت و ${
//           weekStudy % 60
//         } دقیقه`
//       );
//       if (rates) {
//         userInfo.push(`روند پیشرفت هفتگی: ${rates}`);
//       }
//     }

//     ctx.reply(userInfo.join('\n'));
//   } else {
//     ctx.reply(
//       '❗️ نام وارد شده یافت نشد. لطفاً نام خود را صحیح وارد کنید یا از لیست کاربران استفاده کنید.'
//     );
//   }
// });

// // نمایش لیست کاربران
// bot.command('users', (ctx) => {
//   const userButtons = allUsers.map((name) => [
//     { text: name, callback_data: `info_${name}` }
//   ]);

//   ctx.reply('لطفاً نام کاربر موردنظر را انتخاب کنید:', {
//     reply_markup: {
//       inline_keyboard: userButtons
//     }
//   });
// });

// // دریافت اطلاعات کاربران
// bot.action(/^info_(.+)$/, (ctx) => {
//   const name = ctx.match[1];

//   if (allUsers.includes(name)) {
//     const userInfo = [];

//     userInfo.push(`👤 ${name}`);
//     if (highestStudy[name]) {
//       const highest = highestStudy[name].highest;
//       const hours = Math.floor(highest / 60);
//       const minutes = highest % 60;
//       userInfo.push(`📈 بیشترین زمان مطالعه: ${hours} ساعت و ${minutes} دقیقه`);
//     }

//     if (outputDay[name]) {
//       const todayStudy = outputDay[name].totalHoursDays.slice(-1)[0];
//       userInfo.push(
//         `مطالعه امروز: ${Math.floor(todayStudy / 60)} ساعت و ${
//           todayStudy % 60
//         } دقیقه`
//       );
//       userInfo.push(`استمرار: ${outputDay[name].count} روز`);
//     }

//     if (output.weeklyHours[name]) {
//       const weekStudy = output.weeklyHours[name].weekStudies.slice(-1)[0];
//       const rates = output.weeklyHours[name].rates
//         .map((rate) => (rate >= 0 ? `${rate}🚀` : `${rate}📉`))
//         .join(' ');
//       userInfo.push(
//         `مطالعه هفتگی: ${Math.floor(weekStudy / 60)} ساعت و ${
//           weekStudy % 60
//         } دقیقه`
//       );
//       if (rates) {
//         userInfo.push(`روند پیشرفت هفتگی: ${rates}`);
//       }
//     }

//     ctx.editMessageText(userInfo.join('\n'));
//   } else {
//     ctx.reply(
//       '❗️ نام وارد شده یافت نشد. لطفاً نام خود را صحیح وارد کنید یا از لیست کاربران استفاده کنید.'
//     );
//   }
// });

// //  دریافت مستقیم اطلاعات کاربر
// bot.command('user', (ctx) => {
//   const name = ctx.message.text.split(' ')[1]; // دریافت نام پس از /user

//   if (!name) {
//     return ctx.reply(
//       '❗️ لطفاً نام کاربر را پس از دستور وارد کنید. مثال: `/user Mahsa`'
//     );
//   }

//   if (allUsers.includes(name)) {
//     const userInfo = [];

//     userInfo.push(`👤 ${name}`);
//     if (highestStudy[name]) {
//       const highest = highestStudy[name].highest;
//       const hours = Math.floor(highest / 60);
//       const minutes = highest % 60;
//       userInfo.push(`📈 بیشترین زمان مطالعه: ${hours} ساعت و ${minutes} دقیقه`);
//     }

//     if (outputDay[name]) {
//       const todayStudy = outputDay[name].totalHoursDays.slice(-1)[0];
//       userInfo.push(
//         `مطالعه امروز: ${Math.floor(todayStudy / 60)} ساعت و ${
//           todayStudy % 60
//         } دقیقه`
//       );
//       userInfo.push(`استمرار: ${outputDay[name].count} روز`);
//     }

//     if (output.weeklyHours[name]) {
//       const weekStudy = output.weeklyHours[name].weekStudies.slice(-1)[0];
//       const rates = output.weeklyHours[name].rates
//         .map((rate) => (rate >= 0 ? `${rate}🚀` : `${rate}📉`))
//         .join(' ');
//       userInfo.push(
//         `مطالعه هفتگی: ${Math.floor(weekStudy / 60)} ساعت و ${
//           weekStudy % 60
//         } دقیقه`
//       );
//       if (rates) {
//         userInfo.push(`روند پیشرفت هفتگی: ${rates}`);
//       }
//     }

//     ctx.reply(userInfo.join('\n'));
//   } else {
//     ctx.reply(
//       '❗️ نام وارد شده یافت نشد. لطفاً نام خود را صحیح وارد کنید یا از لیست کاربران استفاده کنید.'
//     );
//   }
// });

// bot.launch();
