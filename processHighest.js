// const fs = require('fs');
// const path = require('path');

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFilePath = path.join(__dirname, 'input.json');
const outputFilePath = path.join(__dirname, 'highestStudy.json');

// خواندن فایل خروجی (در صورت وجود)
let highestStudyTimes = {};
if (fs.existsSync(outputFilePath)) {
  const outputRawData = fs.readFileSync(outputFilePath, 'utf8').trim();
  if (outputRawData) {
    try {
      highestStudyTimes = JSON.parse(outputRawData);
    } catch (error) {
      console.error(
        'خطای تجزیه JSON در فایل highestStudy.json:',
        error.message
      );
      highestStudyTimes = {};
    }
  }
}

// تابعی برای تبدیل رشته زمانی به دقیقه
function convertToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') {
    return 0;
  }

  const parts = timeStr.split(' ');
  const hours = parseInt(parts[0]?.replace('h', '') || '0', 10);
  const minutes = parseInt(parts[1]?.replace('m', '') || '0', 10);
  return hours * 60 + minutes;
}

// تابعی برای تبدیل دقیقه به فرمت "xh ym"
function convertToTimeFormat(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

// بررسی تغییرات در فایل ورودی
function updateHighestStudyTimes() {
  if (!fs.existsSync(inputFilePath)) {
    console.log('فایل input.json یافت نشد.');
    return;
  }

  const inputRawData = fs.readFileSync(inputFilePath, 'utf8').trim();
  if (!inputRawData) {
    console.log('فایل input.json خالی است.');
    return;
  }

  try {
    const inputData = JSON.parse(inputRawData);
    const updatedNames = [];

    inputData.forEach((entry) => {
      const currentMinutes = convertToMinutes(entry.today);

      if (!highestStudyTimes[entry.name]) {
        highestStudyTimes[entry.name] = {
          previous: '0h 0m',
          highest: currentMinutes
        };
      } else if (currentMinutes > highestStudyTimes[entry.name].highest) {
        const previousTime = convertToTimeFormat(
          highestStudyTimes[entry.name].highest
        );
        highestStudyTimes[entry.name] = {
          previous: previousTime,
          highest: currentMinutes
        };
        updatedNames.push(
          `✌${entry.name} (${previousTime} 👉 ${convertToTimeFormat(
            currentMinutes
          )})`
        );
      }
    });

    // اطمینان از حفظ ساختار صحیح در خروجی
    const sortedData = Object.entries(highestStudyTimes)
      .sort(([, a], [, b]) => b.highest - a.highest)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    fs.writeFileSync(outputFilePath, JSON.stringify(sortedData, null, 2));
    console.log('فایل highestStudy.json به‌روز شد.');

    if (updatedNames.length > 0) {
      console.log('Record Breakers:  Shining Brighter Every Day 👏 \n');
      updatedNames.forEach((name) => console.log(name));
    } else {
      console.log('هیچ رکورد جدیدی شناسایی نشد.');
    }
  } catch (error) {
    console.error('خطای تجزیه JSON در فایل input.json:', error.message);
  }
}

// بررسی تغییرات در فایل input.json
fs.watchFile(inputFilePath, (curr, prev) => {
  if (curr.mtime !== prev.mtime) {
    console.log('تغییر در فایل شناسایی شد. در حال به‌روزرسانی...');
    updateHighestStudyTimes();
  }
});

// اجرای اولیه
updateHighestStudyTimes();
