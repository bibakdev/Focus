import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import os from 'os';

// تبدیل ساعت و دقیقه به دقیقه
function convertToMinutes(timeStr) {
  let hours = 0,
    minutes = 0;
  if (timeStr.includes('h')) {
    const timeParts = timeStr.split(' ');
    hours = parseInt(timeParts[0].replace(/\D/g, ''));
    minutes = timeParts[1] ? parseInt(timeParts[1].replace(/\D/g, '')) : 0;
  } else if (timeStr.includes('m')) {
    minutes = parseInt(timeStr.replace(/\D/g, ''));
  }
  return hours * 60 + minutes;
}

// تبدیل دقیقه به ساعت و دقیقه
function convertToHoursMinutes(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

// مسیر پوشه Focus در دسکتاپ
const folderPath = path.join(os.homedir(), 'Desktop', 'Focus');
const inputPath = path.join(folderPath, 'input.json');
const outputPath = path.join(folderPath, 'output.json');

// خواندن فایل input.json
fs.readFile(inputPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading input file:', err.message);
    return;
  }

  const input = JSON.parse(data);
  let output = { weeklyHours: {} };

  // **خواندن اطلاعات قبلی از output.json (اگر وجود داشته باشد)**
  if (fs.existsSync(outputPath)) {
    const previousData = fs.readFileSync(outputPath, 'utf8');
    if (previousData) {
      output = JSON.parse(previousData);
    }
  }

  // پردازش داده‌های جدید
  input.forEach((entry) => {
    const thisWeekMinutes = convertToMinutes(entry.thisWeek);
    if (thisWeekMinutes === 0) return;

    if (!output.weeklyHours[entry.name]) {
      output.weeklyHours[entry.name] = { weekStudies: [], rates: [] };
    }

    const weekStudies = output.weeklyHours[entry.name].weekStudies;
    weekStudies.push(thisWeekMinutes);

    // محاسبه نرخ تغییر (rate)
    if (weekStudies.length > 1) {
      const prevWeekStudy = weekStudies[weekStudies.length - 2];
      const progress = thisWeekMinutes - prevWeekStudy;
      output.weeklyHours[entry.name].rates.push(progress);
    }
  });

  // **نوشتن خروجی جدید در فایل output.json**
  fs.writeFile(outputPath, JSON.stringify(output, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Error writing output file:', err.message);
    } else {
      console.log('Data has been updated and saved to output.json');
    }
  });

  // **مرتب‌سازی و نمایش مطالعات هفتگی**
  console.log('\nWeekly Studies:');
  const sortedByStudies = Object.entries(output.weeklyHours)
    .map(([name, data]) => ({
      name,
      lastWeekStudy: data.weekStudies[data.weekStudies.length - 1]
    }))
    .sort((a, b) => b.lastWeekStudy - a.lastWeekStudy);

  sortedByStudies.forEach((person, index) => {
    console.log(
      `${index + 1}. ${person.name}: ${convertToHoursMinutes(
        person.lastWeekStudy
      )}`
    );
  });

  // **مرتب‌سازی و نمایش نرخ پیشرفت (Progress)**
  console.log('\nProgress:');
  const sortedByRates = Object.entries(output.weeklyHours)
    .map(([name, data]) => ({
      name,
      lastRate: data.rates.length > 0 ? data.rates[data.rates.length - 1] : null
    }))
    .filter((person) => person.lastRate !== null)
    .sort((a, b) => b.lastRate - a.lastRate);

  sortedByRates.forEach((person, index) => {
    console.log(
      `${index + 1}. ${person.name}: ${convertToHoursMinutes(person.lastRate)}`
    );
  });
});
