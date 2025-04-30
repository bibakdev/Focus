import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const inputPath = path.join(__dirname, 'input.json');
const targetsPath = path.join(__dirname, 'targets.json');
const resultsPath = path.join(__dirname, 'targetResults.json');
const inputHashPath = path.join(__dirname, 'input.hash');

// کمک کننده‌ها
const getFileContent = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
};

const hashContent = (content) =>
  crypto.createHash('sha256').update(content).digest('hex');

const timeToMinutes = (time) => {
  const parts = time.match(/(\d+)h\s*(\d+)?m?/);
  const hours = parts ? parseInt(parts[1]) || 0 : 0;
  const minutes = parts && parts[2] ? parseInt(parts[2]) || 0 : 0;
  return hours * 60 + minutes;
};

function showTargets() {
  const raw = getFileContent(targetsPath);
  let targets = {};
  try {
    targets = JSON.parse(raw);
  } catch {
    console.log(chalk.red('❌ targets.json خراب است.'));
    return;
  }

  console.log(chalk.bold('\n🎯 لیست هدف‌های افراد در چالش:\n'));
  for (const [name, { target }] of Object.entries(targets)) {
    console.log(` 🎯${chalk.yellow(name)}: ${chalk.cyan(target)}`);
  }
}

// اجرای چالش
function runChallenge() {
  const inputRaw = getFileContent(inputPath);
  const targetsRaw = getFileContent(targetsPath);
  if (!inputRaw || !targetsRaw) return;

  let inputData, targetsData;
  try {
    inputData = JSON.parse(inputRaw);
    targetsData = JSON.parse(targetsRaw);
  } catch {
    console.log(chalk.red('❌ فایل‌های json معتبر نیستند.'));
    return;
  }

  const results = [];

  for (const [name, { target }] of Object.entries(targetsData)) {
    const user = inputData.find((u) => u.name === name);

    if (user?.today) {
      const targetMin = timeToMinutes(target);
      const todayMin = timeToMinutes(user.today);
      const symbol = todayMin >= targetMin ? '✅' : '🍌';
      results.push({ name, target, today: user.today, symbol });
    } else {
      results.push({ name, target, today: '---', symbol: '🍆' });
    }
  }

  console.log(chalk.bold('\n🍌 نتیجه چالش موزی:\n'));
  for (const { name, target, today, symbol } of results) {
    console.log(
      `${chalk.yellow(name)} (${chalk.cyan(target)} => ${chalk.magenta(
        today
      )}) ${symbol}`
    );
  }

  return results;
}

// ذخیره نتایج فقط اگر input.json تغییر کرده
function storeIfChanged(results) {
  const currentInputHash = hashContent(getFileContent(inputPath));
  const prevHash = getFileContent(inputHashPath);

  if (currentInputHash === prevHash) {
    console.log(chalk.gray('\n⛔️ input.json تغییر نکرده، نتیجه ذخیره نشد.'));
    return;
  }

  let data = {};
  try {
    data = JSON.parse(getFileContent(resultsPath)) || {};
  } catch {
    data = {};
  }

  for (const { name, symbol } of results) {
    if (!data[name]) {
      data[name] = { '🍌': 0, '🍆': 0, '✅': 0, count: 0 };
    }
    data[name][symbol] += 1;
    data[name].count += 1;
  }

  fs.writeFileSync(resultsPath, JSON.stringify(data, null, 2));
  fs.writeFileSync(inputHashPath, currentInputHash);
  console.log(chalk.green('\n✅ نتیجه جدید ذخیره شد.'));
}

function showSummary() {
  let data = {};
  try {
    data = JSON.parse(getFileContent(resultsPath)) || {};
  } catch {
    console.log(chalk.gray('\n📁 هنوز نتیجه‌ای ذخیره نشده.'));
    return;
  }

  console.log(chalk.bold('\n📈 خلاصه وضعیت افراد در چالش:\n'));

  for (const [name, res] of Object.entries(data)) {
    console.log(
      `${chalk.yellow(name)} => Challenge Joined: ${chalk.bold(
        res.count
      )} times`
    );
    console.log(`  🍌: ${res['🍌']}`);
    console.log(`  🍆: ${res['🍆']}`);
    console.log(`  ✅: ${res['✅']}`);
    console.log('---------------');
  }
}

// اجرای نهایی
showTargets();
const results = runChallenge();
if (results) {
  storeIfChanged(results);
  showSummary();
}

// const fs = require('fs');
// const path = require('path');

// const targetsPath = path.join(__dirname, 'targets.json');
// const inputPath = path.join(__dirname, 'input.json');
// const resultsPath = path.join(__dirname, 'targetResults.json');

// // تبدیل زمان به دقیقه
// function timeToMinutes(time) {
//   const parts = time.match(/(\d+)h\s*(\d+)?m?/);
//   const hours = parts ? parseInt(parts[1]) || 0 : 0;
//   const minutes = parts && parts[2] ? parseInt(parts[2]) || 0 : 0;
//   return hours * 60 + minutes;
// }

// function getIranDateString() {
//   const now = new Date();

//   // اضافه کردن اختلاف ساعت ایران (مثلاً 3.5 ساعت = 3*60 + 30 = 210 دقیقه)
//   const iranOffsetMinutes = 210; // برای زمستان
//   // const iranOffsetMinutes = 270; // برای تابستان (DST)

//   const localTime = new Date(now.getTime() + iranOffsetMinutes * 60 * 1000);
//   return localTime.toISOString().split('T')[0];
// }

// // بررسی اینکه آیا نتیجه امروز قبلاً ذخیره شده است
// function isAlreadyStored() {
//   try {
//     const resultsData = JSON.parse(
//       fs.readFileSync(resultsPath, 'utf8') || '{}'
//     );
//     const today = getIranDateString();
//     return resultsData.some((result) => result.date === today);
//   } catch (error) {
//     return false;
//   }
// }

// // ذخیره نتایج جدید در فایل
// function saveResults(results) {
//   let resultsData = {};

//   // خواندن اطلاعات قبلی
//   try {
//     resultsData = JSON.parse(fs.readFileSync(resultsPath, 'utf8') || '{}');
//   } catch (error) {
//     resultsData = {};
//   }

//   // بروزرسانی آمار برای هر کاربر
//   for (const result of results) {
//     const parts = result.split(' ');
//     const name = parts[0];
//     const emoji = parts[parts.length - 1];

//     if (!resultsData[name]) {
//       resultsData[name] = { '🍌': 0, '🍆': 0, '✅': 0 };
//     }

//     if (resultsData[name][emoji] !== undefined) {
//       resultsData[name][emoji] += 1;
//     }
//   }

//   // ذخیره فایل
//   fs.writeFileSync(resultsPath, JSON.stringify(resultsData, null, 2));
//   console.log('✅ آمار کلی جدید ذخیره شد.');
// }

// // نمایش لیست اهداف
// function showTargets() {
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

//   console.log('\n لیست افراد و زمان‌های هدف در چالش آینده 🍌\n');
//   console.log(formattedTargets || '⛔️ هنوز اطلاعاتی ثبت نشده است.');
// }

// // بررسی وضعیت "بادمجان" دو روز پشت سر هم (فقط برای دو روز آخر)
// function checkTwoDaysEggplant(resultsData) {
//   if (resultsData.length < 2) {
//     console.log('\n❌ داده‌های کافی برای بررسی دو روز پشت سر هم وجود ندارد.');
//     return;
//   }

//   const today = resultsData[resultsData.length - 1].results; // آخرین روز
//   const yesterday = resultsData[resultsData.length - 2].results; // روز قبل از آخرین روز

//   const todayEggplant = today.some((result) => result.includes('🍆'));
//   const yesterdayEggplant = yesterday.some((result) => result.includes('🍆'));

//   if (todayEggplant && yesterdayEggplant) {
//     const users = today
//       .filter((result) => result.includes('🍆'))
//       .map((result) => result.split(' ')[0]);
//     console.log('\n👀 کاربران که دو روز پشت سر هم "بادمجان" شده‌اند:');
//     console.log([...new Set(users)].join('\n'));
//   } else {
//     console.log('\n❌ هیچ کاربری دو روز پشت سر هم "بادمجان" نشده است.');
//   }
// }

// // اجرای چالش و مقایسه با امروز
// function runChallenge() {
//   try {
//     const targetsData = JSON.parse(
//       fs.readFileSync(targetsPath, 'utf8') || '{}'
//     );
//     const inputData = JSON.parse(fs.readFileSync(inputPath, 'utf8') || '{}');

//     const results = [];

//     for (const [name, { target }] of Object.entries(targetsData)) {
//       const userData = inputData.find((user) => user.name === name);

//       if (userData && userData.today) {
//         const targetMinutes = timeToMinutes(target);
//         const todayMinutes = timeToMinutes(userData.today);

//         const status = targetMinutes > todayMinutes ? '🍌' : '✅';
//         results.push(`${name} (${target} => ${userData.today}) ${status}`);
//       } else {
//         results.push(`${name} (${target} => 🍆)`);
//       }
//     }

//     const outputMessage = results.length
//       ? results.join('\n')
//       : '⛔️ اطلاعاتی برای نمایش وجود ندارد.';

//     console.log('\n\n نتیجه چالش موزی🍌\n');
//     console.log(outputMessage);

//     // ذخیره نتایج فقط اگر هنوز ذخیره نشده باشد
//     if (!isAlreadyStored()) {
//       saveResults(results);
//     } else {
//       console.log('⛔️ نتایج امروز قبلاً ذخیره شده است.');
//     }

//     // بررسی وضعیت "بادمجان" دو روز پشت سر هم
//     const resultsData = JSON.parse(
//       fs.readFileSync(resultsPath, 'utf8') || '[]'
//     );
//     checkTwoDaysEggplant(resultsData);
//   } catch (error) {
//     console.error('❌ خطایی رخ داد:', error.message);
//   }
// }

// // اجرای هر دو بخش پشت سر هم
// showTargets();
// runChallenge();

// function saveResults(results) {
//   let resultsData = {};
//   try {
//     resultsData = JSON.parse(fs.readFileSync(resultsPath, 'utf8') || '{}');
//   } catch (error) {
//     resultsData = {};
//   }

//   for (const result of results) {
//     const parts = result.split(' ');
//     const name = parts[0];
//     const emoji = parts[parts.length - 1];

//     if (!resultsData[name]) {
//       resultsData[name] = { '🍌': 0, '🍆': 0, '✅': 0 };
//     }

//     if (resultsData[name][emoji] !== undefined) {
//       resultsData[name][emoji] += 1;
//     }
//   }

//   fs.writeFileSync(resultsPath, JSON.stringify(resultsData, null, 2));
//   console.log('✅ آمار جدید ذخیره شد.');

//   // نمایش آمار بعد از ذخیره
//   console.log('\n📊 آمار کلی هر کاربر:');
//   Object.entries(resultsData).forEach(([name, stats]) => {
//     console.log(`${name}: ${JSON.stringify(stats)}`);
//   });
// }

// const fs = require('fs');
// const path = require('path');

// const targetsPath = path.join(__dirname, 'targets.json');
// const inputPath = path.join(__dirname, 'input.json');
// const resultsPath = path.join(__dirname, 'targetResults.json');

// // تبدیل زمان به دقیقه
// function timeToMinutes(time) {
//   const parts = time.match(/(\d+)h\s*(\d+)?m?/);
//   const hours = parts ? parseInt(parts[1]) || 0 : 0;
//   const minutes = parts && parts[2] ? parseInt(parts[2]) || 0 : 0;
//   return hours * 60 + minutes;
// }

// // بررسی اینکه آیا نتیجه امروز قبلاً ذخیره شده است
// function isAlreadyStored() {
//   try {
//     const resultsData = JSON.parse(
//       fs.readFileSync(resultsPath, 'utf8') || '[]'
//     );
//     const today = new Date().toISOString().split('T')[0]; // تاریخ امروز به فرمت YYYY-MM-DD
//     return resultsData.some((result) => result.date === today);
//   } catch (error) {
//     return false;
//   }
// }

// // ذخیره نتایج جدید در فایل
// function saveResults(results) {
//   try {
//     const today = new Date().toISOString().split('T')[0]; // تاریخ امروز
//     const resultsData = JSON.parse(
//       fs.readFileSync(resultsPath, 'utf8') || '[]'
//     );

//     // اضافه کردن تاریخ و نتایج جدید
//     resultsData.push({
//       date: today,
//       results: results
//     });

//     fs.writeFileSync(resultsPath, JSON.stringify(resultsData, null, 2));
//     console.log('✅ نتایج جدید ذخیره شدند');
//   } catch (error) {
//     console.error('❌ خطا در ذخیره نتایج:', error.message);
//   }
// }

// // نمایش لیست اهداف
// function showTargets() {
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

//   console.log('\n لیست افراد و زمان‌های هدف در چالش آینده 🍌\n');
//   console.log(formattedTargets || '⛔️ هنوز اطلاعاتی ثبت نشده است.');
// }

// // اجرای چالش و مقایسه با امروز
// function runChallenge() {
//   try {
//     const targetsData = JSON.parse(
//       fs.readFileSync(targetsPath, 'utf8') || '{}'
//     );
//     const inputData = JSON.parse(fs.readFileSync(inputPath, 'utf8') || '{}');

//     const results = [];

//     for (const [name, { target }] of Object.entries(targetsData)) {
//       const userData = inputData.find((user) => user.name === name);

//       if (userData && userData.today) {
//         const targetMinutes = timeToMinutes(target);
//         const todayMinutes = timeToMinutes(userData.today);

//         const status = targetMinutes > todayMinutes ? '🍌' : '✅';
//         results.push(`${name} (${target} => ${userData.today}) ${status}`);
//       } else {
//         results.push(`${name} (${target} => 🍆`);
//       }
//     }

//     const outputMessage = results.length
//       ? results.join('\n')
//       : '⛔️ اطلاعاتی برای نمایش وجود ندارد.';

//     console.log('\n\n نتیجه چالش موزی🍌\n');
//     console.log(outputMessage);

//     // ذخیره نتایج فقط اگر هنوز ذخیره نشده باشد
//     if (!isAlreadyStored()) {
//       saveResults(results);
//     } else {
//       console.log('⛔️ نتایج امروز قبلاً ذخیره شده است.');
//     }
//   } catch (error) {
//     console.error('❌ خطایی رخ داد:', error.message);
//   }
// }

// // اجرای هر دو بخش پشت سر هم
// showTargets();
// runChallenge();
