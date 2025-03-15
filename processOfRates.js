const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// خواندن فایل output.json
const data = JSON.parse(fs.readFileSync('output.json', 'utf8'));
const weeklyHours = data.weeklyHours;

// دسته‌بندی‌ها
let progressList = [];
let regressList = [];
let noRegressList = [];
let comingSoonList = [];

// تابع تبدیل دقیقه به ساعت و دقیقه
const formatTime = (minutes, format) => {
  const hours = Math.floor(Math.abs(minutes) / 60);
  const mins = Math.abs(minutes) % 60;
  const emoji = minutes >= 0 ? '🚀' : '📉';
  if (format === 'm') return `${minutes}m ${emoji}`;
  if (format === 'hm') return `(${hours}h ${mins}m) ${emoji}`;
  return minutes >= 0
    ? `${minutes} (${hours}h ${mins}m) 🚀`
    : `${minutes} (${hours}h ${mins}m) 📉`;
};

rl.question('Choose format (m/hm): ', (format) => {
  for (const person in weeklyHours) {
    const { rates } = weeklyHours[person];
    if (!rates.length) {
      comingSoonList.push(person);
      continue;
    }
    const progress = rates.filter((r) => r >= 0).reduce((a, b) => a + b, 0);
    const regress = rates.filter((r) => r < 0).reduce((a, b) => a + b, 0);
    const progressCount = rates.filter((r) => r >= 0).length;
    const regressCount = rates.filter((r) => r < 0).length;

    if (regressCount === 0) {
      noRegressList.push({ person, progress, rates });
    }
    if (progress > 0) {
      progressList.push({ person, progress, rates });
    }
    if (regress < 0) {
      regressList.push({ person, regress, rates });
    }
  }

  // مرتب‌سازی دسته‌بندی‌ها
  progressList.sort((a, b) => b.progress - a.progress);
  regressList.sort((a, b) => a.regress - b.regress);
  noRegressList.sort((a, b) => b.progress - a.progress);

  // نمایش نتایج در قالب موردنظر
  const formatRates = (rates) =>
    rates.map((r) => formatTime(r, format)).join(' ');

  console.log('Progress:');
  progressList.forEach((p, index) =>
    console.log(
      `${index + 1}. ${p.person} ${
        format === 'hm' ? formatTime(p.progress, format) : formatRates(p.rates)
      }`
    )
  );

  console.log('\nRegress:');
  regressList.forEach((r, index) =>
    console.log(
      `${index + 1}. ${r.person} ${
        format === 'hm' ? formatTime(r.regress, format) : formatRates(r.rates)
      }`
    )
  );

  console.log('\nNo Regress:');
  noRegressList.forEach((n, index) =>
    console.log(
      `${index + 1}. ${n.person} ${
        format === 'hm' ? formatTime(n.progress, format) : formatRates(n.rates)
      }`
    )
  );

  console.log('\nComing Soon:');
  comingSoonList.forEach((c, index) => console.log(`${index + 1}. ${c}`));

  rl.close();
});
