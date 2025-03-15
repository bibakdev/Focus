const fs = require('fs');
const path = require('path');

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

function convertToHoursMinutes(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

// مسیر فایل‌ها در همان جایی که repeatly.js قرار دارد
const folderPath = __dirname;
const inputPath = path.join(folderPath, 'input.json');
const outputPath = path.join(folderPath, 'output.json');

const inputData = fs.existsSync(inputPath)
  ? JSON.parse(fs.readFileSync(inputPath, 'utf8'))
  : [];
const outputData = fs.existsSync(outputPath)
  ? JSON.parse(fs.readFileSync(outputPath, 'utf8'))
  : { weeklyHours: {} };

const repeatedUsers = [];

inputData.forEach((entry) => {
  const thisWeekMinutes = convertToMinutes(entry.thisWeek);

  if (outputData.weeklyHours[entry.name]) {
    const userData = outputData.weeklyHours[entry.name];
    const lastWeekStudy =
      userData.weekStudies.length > 0
        ? userData.weekStudies[userData.weekStudies.length - 1]
        : null;

    if (lastWeekStudy !== null) {
      console.log(
        `Checking: ${entry.name} | thisWeek: ${thisWeekMinutes} min | lastWeek: ${lastWeekStudy} min`
      );

      if (lastWeekStudy === thisWeekMinutes) {
        repeatedUsers.push({
          name: entry.name,
          studyTime: convertToHoursMinutes(thisWeekMinutes)
        });
      }
    }
  }
});

console.log('\nUsers with repeated weekly study time:');
if (repeatedUsers.length > 0) {
  repeatedUsers.forEach((user) => {
    console.log(`- ${user.name}: ${user.studyTime}`);
  });
} else {
  console.log('None');
}
