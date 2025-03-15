const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto'); // حفظ کتابخانه crypto

// تبدیل فرمت زمان به دقیقه
function convertToMinutes(timeStr) {
  let hours = 0,
    minutes = 0;
  if (timeStr.includes('h')) {
    const parts = timeStr.split(' ');
    hours = parseInt(parts[0].replace(/\D/g, ''));
    minutes = parts[1] ? parseInt(parts[1].replace(/\D/g, '')) : 0;
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

// مسیر پوشه Focus روی دسکتاپ
const folderPath = path.join(os.homedir(), 'Desktop', 'Focus');
const inputPath = path.join(folderPath, 'input.json');
const outputPath = path.join(folderPath, 'output.json');

const inputData = fs.existsSync(inputPath)
  ? JSON.parse(fs.readFileSync(inputPath, 'utf8'))
  : [];
const outputData = fs.existsSync(outputPath)
  ? JSON.parse(fs.readFileSync(outputPath, 'utf8'))
  : { weeklyHours: {} };

const updatedWeeklyHours = {};
inputData.forEach((entry) => {
  const thisWeekMinutes = convertToMinutes(entry.thisWeek);
  if (thisWeekMinutes === 0) return;

  if (!outputData.weeklyHours[entry.name]) {
    outputData.weeklyHours[entry.name] = { weekStudies: [], rates: [] };
  }

  const userData = outputData.weeklyHours[entry.name];
  if (!userData.weekStudies.includes(thisWeekMinutes)) {
    if (userData.weekStudies.length > 0) {
      const previousWeekStudy =
        userData.weekStudies[userData.weekStudies.length - 1];
      const rate = thisWeekMinutes - previousWeekStudy;
      if (!userData.rates.includes(rate)) {
        userData.rates.push(rate);
      }
    }
    userData.weekStudies.push(thisWeekMinutes);
  }
  updatedWeeklyHours[entry.name] = userData;
});

outputData.weeklyHours = updatedWeeklyHours;
fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');

const sortedByStudies = Object.entries(outputData.weeklyHours)
  .map(([name, data]) => ({
    name,
    lastWeekStudy: data.weekStudies[data.weekStudies.length - 1]
  }))
  .sort((a, b) => b.lastWeekStudy - a.lastWeekStudy);

console.log('\n📌 Weekly Studies Ranking:');
sortedByStudies.forEach((person, index) => {
  console.log(
    `${index + 1}. ${person.name}: ${convertToHoursMinutes(
      person.lastWeekStudy
    )}`
  );
});

const sortedByRates = Object.entries(outputData.weeklyHours)
  .map(([name, data]) => ({
    name,
    lastRate: data.rates.length > 0 ? data.rates[data.rates.length - 1] : null
  }))
  .filter((person) => person.lastRate !== null)
  .sort((a, b) => b.lastRate - a.lastRate);

console.log('\n📌 Progress (Positive Changes):');
sortedByRates
  .filter((person) => person.lastRate > 0)
  .forEach((person, index) => {
    console.log(
      `${index + 1}. ${person.name}: +${convertToHoursMinutes(person.lastRate)}`
    );
  });

console.log('\n📌 Regressions (Negative Changes):');
sortedByRates
  .filter((person) => person.lastRate < 0)
  .sort((a, b) => a.lastRate - b.lastRate)
  .forEach((person, index) => {
    console.log(
      `${index + 1}. ${person.name}: ${convertToHoursMinutes(person.lastRate)}`
    );
  });
