// const fs = require('fs');
import fs from 'fs';

// فایل‌های ورودی و خروجی
const inputFile = 'input.json';
const outputFile = 'output_day.json';

// تابع تبدیل زمان از "XXh YYm" به دقیقه
function timeToMinutes(timeStr) {
  const match = timeStr.match(/(?:(\d+)h)?\s*(\d+)m/);
  if (!match) return 0;
  const hours = match[1] ? parseInt(match[1]) * 60 : 0;
  const minutes = parseInt(match[2]);
  return hours + minutes;
}

// تابع تبدیل دقیقه به "XXh YYm"
function minutesToTime(minutes) {
  const isNegative = minutes < 0;
  const absMinutes = Math.abs(minutes);
  const h = Math.floor(absMinutes / 60);
  const m = absMinutes % 60;
  return isNegative ? `-${h}h ${m}m` : `${h}h ${m}m`;
}

// خواندن فایل ورودی
let inputData;
try {
  inputData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
} catch (error) {
  console.error('خطا در خواندن فایل ورودی:', error);
  process.exit(1);
}

// خواندن فایل خروجی (اگر وجود داشته باشد و خالی نباشد)
let outputData = {};
try {
  if (fs.existsSync(outputFile)) {
    const fileContent = fs.readFileSync(outputFile, 'utf8').trim();
    outputData = fileContent ? JSON.parse(fileContent) : {};
  }
} catch (error) {
  console.error('خطا در خواندن فایل خروجی:', error);
}

// ساخت لیستی از کاربران موجود در input.json
const inputUsers = new Set(inputData.map((entry) => entry.name));

// حذف کاربرانی که در input.json نیستند
for (const name in outputData) {
  if (!inputUsers.has(name)) {
    delete outputData[name];
  }
}

// لیست کاربران با اختلاف صفر
let zeroDifference = [];

// به‌روزرسانی داده‌های خروجی و حذف کاربران با today صفر
inputData.forEach((entry) => {
  const minutes = timeToMinutes(entry.today);
  if (minutes === 0) {
    delete outputData[entry.name];
  } else {
    if (!outputData[entry.name]) {
      outputData[entry.name] = { totalHoursDays: [minutes], count: 1 }; // مقدار اولیه count را 1 قرار می‌دهیم
    } else {
      const lastValue = outputData[entry.name].totalHoursDays.slice(-1)[0];
      if (lastValue !== minutes) {
        outputData[entry.name].totalHoursDays.push(minutes);
        outputData[entry.name].count = (outputData[entry.name].count || 0) + 1;
      } else {
        // اگر مقدار today جدید با مقدار قبلی یکی بود، در zero difference نمایش دهیم
        zeroDifference.push(entry.name);
      }
    }
  }
});

let sum = 0;
inputData.forEach((entry) => {
  sum += timeToMinutes(entry.today);
});
console.log(`
  ☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️
  \n total hours for a day: ${minutesToTime(sum)} \n
  ☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️\n`);

// محاسبه اختلاف دو مقدار آخر و دسته‌بندی بر اساس پیشرفت و پسرفت
let progress = [];
let regress = [];
let todayRanking = [];
let countRanking = [];

Object.entries(outputData).forEach(([name, data]) => {
  const len = data.totalHoursDays.length;
  if (len === 1) {
    todayRanking.push({ name, today: data.totalHoursDays[0] });
  } else if (len > 1) {
    todayRanking.push({ name, today: data.totalHoursDays[len - 1] });
    const difference =
      data.totalHoursDays[len - 1] - data.totalHoursDays[len - 2];
    if (difference > 0) {
      progress.push({ name, difference });
    } else if (difference < 0) {
      regress.push({ name, difference });
    } else {
      zeroDifference.push(name);
    }
  }
  countRanking.push({ name, count: data.count });
});

// مرتب‌سازی دسته‌بندی‌ها
todayRanking.sort((a, b) => b.today - a.today);
progress.sort((a, b) => b.difference - a.difference);
regress.sort((a, b) => a.difference - b.difference);
countRanking.sort((a, b) => b.count - a.count);

// نمایش خروجی
console.log('📝Daily Study => +4h\n');
if (todayRanking.length === 0) console.log('هیچ موردی یافت نشد.');
todayRanking.forEach((entry, index) => {
  console.log(`${index + 1}. ${entry.name} (${minutesToTime(entry.today)})`);
});

console.log('\nprogress:');
if (progress.length === 0) console.log('هیچ موردی یافت نشد.');
progress.forEach((entry, index) => {
  console.log(
    `${index + 1}. ${entry.name} (${minutesToTime(entry.difference)})`
  );
});

console.log('\nregress:');
if (regress.length === 0) console.log('هیچ موردی یافت نشد.');
regress.forEach((entry, index) => {
  console.log(
    `${index + 1}. ${entry.name} (${minutesToTime(entry.difference)})`
  );
});

console.log('\ncount ranking:');
if (countRanking.length === 0) console.log('هیچ موردی یافت نشد.');
countRanking.forEach((entry, index) => {
  console.log(`${index + 1}. ${entry.name} => ${entry.count}`);
});

console.log('\nzero difference:');
if (zeroDifference.length === 0) console.log('هیچ موردی یافت نشد.');
zeroDifference.forEach((name, index) => {
  console.log(`${index + 1}. ${name}`);
});

// نوشتن در فایل خروجی
try {
  fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2), 'utf8');
  console.log('اطلاعات با موفقیت ذخیره شد.');
} catch (error) {
  console.error('خطا در ذخیره فایل خروجی:', error);
}
