// const fs = require('fs');
// const path = require('path');
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputFilePath = path.join(__dirname, 'output.json');
const outputFilePath = path.join(__dirname, 'highestStudyWeek.json');

// خواندن فایل خروجی در صورت وجود
let highestWeeklyStudy = {};
if (fs.existsSync(outputFilePath)) {
  const outputRawData = fs.readFileSync(outputFilePath, 'utf8').trim();
  if (outputRawData) {
    try {
      highestWeeklyStudy = JSON.parse(outputRawData);
    } catch (error) {
      console.error(
        '❌ خطای تجزیه JSON در فایل highestStudyWeek.json:',
        error.message
      );
      highestWeeklyStudy = {};
    }
  }
}

// تبدیل دقیقه به "xh ym"
function convertToTimeFormat(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

// به‌روزرسانی اطلاعات بیشترین مطالعه هفتگی
function updateHighestWeeklyStudy() {
  if (!fs.existsSync(inputFilePath)) {
    console.log('⚠ فایل output.json پیدا نشد.');
    return;
  }

  const inputRawData = fs.readFileSync(inputFilePath, 'utf8').trim();
  if (!inputRawData) {
    console.log('⚠ فایل output.json خالی است.');
    return;
  }

  try {
    const inputData = JSON.parse(inputRawData);
    const weeklyHours = inputData.weeklyHours || {};
    const updatedNames = [];

    for (const name in weeklyHours) {
      const weekStudies = weeklyHours[name].weekStudies;
      if (!Array.isArray(weekStudies) || weekStudies.length === 0) continue;

      const currentMax = Math.max(...weekStudies);
      const latestValue = weekStudies[weekStudies.length - 1];

      // حالت اولیه: هیچ رکوردی برای این فرد وجود ندارد
      if (!highestWeeklyStudy[name]) {
        highestWeeklyStudy[name] = {
          previous: '0h 0m',
          highest: currentMax
        };
        updatedNames.push(
          `✨ ${name} (رکورد اولیه: ${convertToTimeFormat(currentMax)})`
        );
        continue;
      }

      // اگر مقدار جدید از رکورد قبلی بیشتر بود
      if (latestValue > highestWeeklyStudy[name].highest) {
        const previousTime = convertToTimeFormat(
          highestWeeklyStudy[name].highest
        );
        highestWeeklyStudy[name] = {
          previous: previousTime,
          highest: latestValue
        };
        updatedNames.push(
          `🚀 ${name} (${previousTime} 👉 ${convertToTimeFormat(latestValue)})`
        );
      }
    }

    const sortedData = Object.entries(highestWeeklyStudy)
      .sort(([, a], [, b]) => b.highest - a.highest)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    fs.writeFileSync(outputFilePath, JSON.stringify(sortedData, null, 2));
    console.log('✅ فایل highestStudyWeek.json به‌روزرسانی شد.');

    if (updatedNames.length > 0) {
      console.log(
        'Weekly Record Smashed — Name Added to the Wall of Fame! 🔥/n'
      );
      updatedNames.forEach((n) => console.log(n));
    } else {
      console.log('رکورد جدیدی شناسایی نشد.');
    }
  } catch (error) {
    console.error('❌ خطا در پردازش فایل output.json:', error.message);
  }
}

// اجرای اولیه
updateHighestWeeklyStudy();

// بررسی تغییرات در فایل
fs.watchFile(inputFilePath, (curr, prev) => {
  if (curr.mtime !== prev.mtime) {
    console.log('\n🔄 تغییر در فایل output.json شناسایی شد...');
    updateHighestWeeklyStudy();
  }
});
