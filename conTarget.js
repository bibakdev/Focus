// node conTarget.js
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

// TODO: change time challenge
const TOTAL_DAYS = 14; //14;
const GOLDEN_DAYS = 14; //14;
const SILVER_DAYS = 11; //11;
const BRONZE_DAYS = 8; //8;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const inputPath = path.join(__dirname, 'input.json');
const targetsPath = path.join(__dirname, 'consistencyTargets.json');
const resultsPath = path.join(__dirname, 'consistencyResults.json');
const inputHashPath = path.join(__dirname, 'input.hash');

// ---------------- کمکی‌ها ----------------
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

// ---------------- نمایش تارگت‌ها ----------------
// function showTargets() {
//   let targets = {};
//   try {
//     targets = JSON.parse(getFileContent(targetsPath));
//   } catch {
//     console.log(chalk.red('❌ consistencyTargets.json خراب است.'));
//     return;
//   }

//   console.log(chalk.bold(`\n🎯 Consistency Challenge Targets 🔄: \n`));
//   for (const [name, { target }] of Object.entries(targets)) {
//     console.log(` 🎯 ${chalk.yellow(name)}: ${chalk.cyan(target)}`);
//   }
// }
function showTargets() {
  let targets = {};
  try {
    targets = JSON.parse(getFileContent(targetsPath));
  } catch {
    console.log(chalk.red('❌ consistencyTargets.json خراب است.'));
    return;
  }

  console.log(chalk.bold(`\n🎯 Consistency Challenge Targets 🔄: \n`));

  // مرتب‌سازی بر اساس مقدار ساعت (target)
  const sortedTargets = Object.entries(targets).sort((a, b) => {
    const toMinutes = (time) => {
      const parts = time[1].target.match(/(\d+)h\s*(\d+)?m?/);
      const hours = parts ? parseInt(parts[1]) || 0 : 0;
      const minutes = parts && parts[2] ? parseInt(parts[2]) || 0 : 0;
      return hours * 60 + minutes;
    };
    return toMinutes(b) - toMinutes(a); // از بیشترین به کمترین
  });

  for (const [name, { target }] of sortedTargets) {
    console.log(` 🎯 ${chalk.yellow(name)}: ${chalk.cyan(target)}`);
  }
}

// ---------------- اجرای چالش روزانه ----------------
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
      const pass = todayMin >= targetMin;
      results.push({ name, target, today: user.today, pass });
    } else {
      results.push({ name, target, today: '---', pass: false });
    }
  }

  return results;
}

// ---------------- ذخیره نتیجه روزانه ----------------
function storeIfChanged(results) {
  const currentInputHash = hashContent(getFileContent(inputPath));
  const prevHash = getFileContent(inputHashPath);

  if (currentInputHash === prevHash) {
    console.log(chalk.gray('\n⛔️ input تکراری است، نتیجه ذخیره نشد.'));
    return false; // تغییری ذخیره نشده
  }

  let data = {};
  try {
    data = JSON.parse(getFileContent(resultsPath)) || {};
  } catch {
    data = {};
  }

  if (!data._daysPassed) data._daysPassed = 0;
  data._daysPassed += 1;

  for (const { name, pass } of results) {
    if (!data[name]) {
      data[name] = { count: 0, history: [] };
    }
    if (pass) {
      data[name].count += 1;
    }
  }

  fs.writeFileSync(resultsPath, JSON.stringify(data, null, 2));
  fs.writeFileSync(inputHashPath, currentInputHash);
  console.log(chalk.green('\n✅ نتیجه جدید ذخیره شد.'));

  return true; // تغییر ذخیره شده
}

// ---------------- پایان چالش (دستی) ----------------
function endChallenge() {
  let data = {};
  try {
    data = JSON.parse(getFileContent(resultsPath)) || {};
  } catch {
    console.log(chalk.red('❌ هنوز داده‌ای برای پایان چالش وجود ندارد.'));
    return;
  }

  for (let user in data) {
    if (user !== '_daysPassed') {
      if (data[user].count > 0) {
        data[user].history.push(data[user].count);
        data[user].count = 0;
      }
    }
  }

  data._daysPassed = 0;
  fs.writeFileSync(resultsPath, JSON.stringify(data, null, 2));
  console.log(
    chalk.green(
      '\n🏁 چالش به پایان رسید. مقادیر count به history منتقل شد و روزهای گذشته صفر شد.'
    )
  );
}

// ---------------- نمایش خلاصه ----------------
function showSummary() {
  let data = {};
  try {
    data = JSON.parse(getFileContent(resultsPath)) || {};
  } catch {
    console.log(chalk.gray('\n📁 هنوز نتیجه‌ای ذخیره نشده.'));
    return;
  }

  console.log(chalk.bold('\n📈 Consistency Challenge Status:\n'));

  for (const [name, res] of Object.entries(data)) {
    if (name !== '_daysPassed') {
      console.log(
        `${chalk.yellow(name)} => Current Count: ${chalk.bold(
          res.count
        )} | History: [${res.history.join(', ')}]`
      );
    }
  }
}

// ---------------- اجرای دستورات ----------------
const args = process.argv.slice(2);

if (args[0] === 'end') {
  endChallenge();
  showSummary();
} else if (args[0] === 'list') {
  showTargets();
} else if (args[0] === 'summary') {
  showSummary();
} else {
  showTargets();
  const results = runChallenge();
  if (results) {
    const stored = storeIfChanged(results);
    if (stored) {
      // اگر تغییر بود → نتایج جدید چاپ بشه
      console.log(''); // خط خالی برای وضوح
      const updatedResults = runChallenge();
      const data = JSON.parse(getFileContent(resultsPath)) || {};
      const totalDays = TOTAL_DAYS;
      const daysPassed = data._daysPassed || 0;

      console.log(
        chalk.bold(
          `\n🔄 Consistency Challenge Results: (${daysPassed}d => ${totalDays}d)\n`
        )
      );

      // ✅ مرتب‌سازی: اول پاس‌ها، بعد ناپاس‌ها
      updatedResults.sort((a, b) => {
        if (a.pass === b.pass) return 0;
        return a.pass ? -1 : 1;
      });

      for (const { name, target, today, pass } of updatedResults) {
        const userCount = data[name]?.count || 0;
        const celebration =
          userCount >= TOTAL_DAYS ? chalk.bold(' 🎉🎉🎉') : ''; // 🎯 اگر 14 روز کامل شده بود

        console.log(
          `${chalk.yellow(name)} (${chalk.cyan(target)} => ${chalk.magenta(
            today
          )}) ${pass ? '✅' : '❌'} (${chalk.green(
            userCount + 'd'
          )})${celebration}`
        );
      }

      if (daysPassed === totalDays) {
        const golden = [];
        const silver = [];
        const bronze = [];

        for (let user in data) {
          const lastCount = data[user].count;
          if (lastCount >= GOLDEN_DAYS) golden.push(`${user} (${lastCount}d)`);
          else if (lastCount >= SILVER_DAYS)
            silver.push(`${user} (${lastCount}d)`);
          else if (lastCount >= BRONZE_DAYS)
            bronze.push(`${user} (${lastCount}d)`);
        }

        console.log(chalk.bold('👑Champions of Consistency:\n'));
        console.log(
          `🏆 Golden Consistency → ${
            golden.length ? golden.join(' - ') : '---'
          }`
        );
        console.log(
          `🥈 Silver Consistency → ${
            silver.length ? silver.join(' - ') : '---'
          }`
        );
        console.log(
          `🥉 Bronze Consistency → ${
            bronze.length ? bronze.join(' - ') : '---'
          }`
        );
      }

      // console.log(`dayspassed: ${daysPassed}, totalDays: ${totalDays}`);
    }
    // اگر تغییر نبود → فقط پیام input تکراری چاپ شده است
  }
}

// ToDO Copy original code
// TODO node conTarget.js
// import fs from 'fs';
// import path from 'path';
// import crypto from 'crypto';
// import chalk from 'chalk';
// import { fileURLToPath } from 'url';

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// const inputPath = path.join(__dirname, 'input.json');
// const targetsPath = path.join(__dirname, 'consistencyTargets.json');
// const resultsPath = path.join(__dirname, 'consistencyResults.json');
// const inputHashPath = path.join(__dirname, 'input.hash');

// // ---------------- کمکی‌ها ----------------
// const getFileContent = (filePath) => {
//   try {
//     return fs.readFileSync(filePath, 'utf8');
//   } catch {
//     return '';
//   }
// };

// const hashContent = (content) =>
//   crypto.createHash('sha256').update(content).digest('hex');

// const timeToMinutes = (time) => {
//   const parts = time.match(/(\d+)h\s*(\d+)?m?/);
//   const hours = parts ? parseInt(parts[1]) || 0 : 0;
//   const minutes = parts && parts[2] ? parseInt(parts[2]) || 0 : 0;
//   return hours * 60 + minutes;
// };

// // ---------------- نمایش تارگت‌ها ----------------
// function showTargets() {
//   let targets = {};
//   try {
//     targets = JSON.parse(getFileContent(targetsPath));
//   } catch {
//     console.log(chalk.red('❌ consistencyTargets.json خراب است.'));
//     return;
//   }

//   console.log(chalk.bold(`\n🎯 Consistency Challenge Targets: \n`));
//   for (const [name, { target }] of Object.entries(targets)) {
//     console.log(` 🎯 ${chalk.yellow(name)}: ${chalk.cyan(target)}`);
//   }
// }

// // ---------------- اجرای چالش روزانه ----------------
// function runChallenge() {
//   const inputRaw = getFileContent(inputPath);
//   const targetsRaw = getFileContent(targetsPath);
//   if (!inputRaw || !targetsRaw) return;

//   let inputData, targetsData;
//   try {
//     inputData = JSON.parse(inputRaw);
//     targetsData = JSON.parse(targetsRaw);
//   } catch {
//     console.log(chalk.red('❌ فایل‌های json معتبر نیستند.'));
//     return;
//   }

//   const results = [];

//   for (const [name, { target }] of Object.entries(targetsData)) {
//     const user = inputData.find((u) => u.name === name);

//     if (user?.today) {
//       const targetMin = timeToMinutes(target);
//       const todayMin = timeToMinutes(user.today);
//       const pass = todayMin >= targetMin;
//       results.push({ name, target, today: user.today, pass });
//     } else {
//       results.push({ name, target, today: '---', pass: false });
//     }
//   }

//   return results;
// }

// // ---------------- ذخیره نتیجه روزانه ----------------
// function storeIfChanged(results) {
//   const currentInputHash = hashContent(getFileContent(inputPath));
//   const prevHash = getFileContent(inputHashPath);

//   if (currentInputHash === prevHash) {
//     console.log(chalk.gray('\n⛔️ input تکراری است، نتیجه ذخیره نشد.'));
//     return false; // تغییری ذخیره نشده
//   }

//   let data = {};
//   try {
//     data = JSON.parse(getFileContent(resultsPath)) || {};
//   } catch {
//     data = {};
//   }

//   if (!data._daysPassed) data._daysPassed = 0;
//   data._daysPassed += 1;

//   for (const { name, pass } of results) {
//     if (!data[name]) {
//       data[name] = { count: 0, history: [] };
//     }
//     if (pass) {
//       data[name].count += 1;
//     }
//   }

//   fs.writeFileSync(resultsPath, JSON.stringify(data, null, 2));
//   fs.writeFileSync(inputHashPath, currentInputHash);
//   console.log(chalk.green('\n✅ نتیجه جدید ذخیره شد.'));

//   return true; // تغییر ذخیره شده
// }

// // ---------------- پایان چالش (دستی) ----------------
// function endChallenge() {
//   let data = {};
//   try {
//     data = JSON.parse(getFileContent(resultsPath)) || {};
//   } catch {
//     console.log(chalk.red('❌ هنوز داده‌ای برای پایان چالش وجود ندارد.'));
//     return;
//   }

//   for (let user in data) {
//     if (user !== '_daysPassed') {
//       if (data[user].count > 0) {
//         data[user].history.push(data[user].count);
//         data[user].count = 0;
//       }
//     }
//   }

//   data._daysPassed = 0;
//   fs.writeFileSync(resultsPath, JSON.stringify(data, null, 2));
//   console.log(
//     chalk.green(
//       '\n🏁 چالش به پایان رسید. مقادیر count به history منتقل شد و روزهای گذشته صفر شد.'
//     )
//   );
// }

// // ---------------- نمایش خلاصه ----------------
// function showSummary() {
//   let data = {};
//   try {
//     data = JSON.parse(getFileContent(resultsPath)) || {};
//   } catch {
//     console.log(chalk.gray('\n📁 هنوز نتیجه‌ای ذخیره نشده.'));
//     return;
//   }

//   console.log(chalk.bold('\n📈 Consistency Challenge Status:\n'));

//   for (const [name, res] of Object.entries(data)) {
//     if (name !== '_daysPassed') {
//       console.log(
//         `${chalk.yellow(name)} => Current Count: ${chalk.bold(
//           res.count
//         )} | History: [${res.history.join(', ')}]`
//       );
//     }
//   }
// }

// // ---------------- اجرای دستورات ----------------
// const args = process.argv.slice(2);

// if (args[0] === 'end') {
//   endChallenge();
//   showSummary();
// } else {
//   showTargets();
//   const results = runChallenge();
//   if (results) {
//     const stored = storeIfChanged(results);
//     if (stored) {
//       // اگر تغییر بود → نتایج جدید چاپ بشه
//       console.log(''); // خط خالی برای وضوح
//       const updatedResults = runChallenge();
//       const data = JSON.parse(getFileContent(resultsPath)) || {};
//       const totalDays = 5;
//       const daysPassed = data._daysPassed || 0;

//       console.log(
//         chalk.bold(
//           `\n📊 Consistency Challenge Results: (${daysPassed}d => ${totalDays}d)\n`
//         )
//       );

//       for (const { name, target, today, pass } of updatedResults) {
//         console.log(
//           `${chalk.yellow(name)} (${chalk.cyan(target)} => ${chalk.magenta(
//             today
//           )}) ${pass ? '✅' : '❌'}`
//         );
//       }
//     }
//     // اگر تغییر نبود → فقط پیام input تکراری چاپ شده است
//     showSummary();
//   }
// }
