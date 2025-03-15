import fs from 'fs';

// تابعی برای تبدیل زمان به دقیقه
function timeToMinutes(time) {
  const regex = /(\d+)h (\d+)m/;
  const match = time.match(regex);
  if (match) {
    const hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    return hours * 60 + minutes;
  } else if (time.includes('m')) {
    return parseInt(time.replace('m', ''));
  }
  return 0;
}

// خواندن فایل input.json
fs.readFile('./input.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading input.json:', err);
    return;
  }

  const jsonData = JSON.parse(data);

  // خواندن فایل output2.json برای به‌روز رسانی count
  fs.readFile('./output2.json', 'utf8', (err, outputData) => {
    let output2 = {};

    if (err) {
      console.log('output2.json not found or empty, creating a new one.');
    } else {
      try {
        if (outputData.trim() === '') {
          console.log('output2.json is empty, creating a new one.');
        } else {
          output2 = JSON.parse(outputData);
        }
      } catch (parseError) {
        console.error('Error parsing output2.json:', parseError);
        return;
      }
    }

    // به‌روزرسانی یا افزودن count به هر فرد
    jsonData.forEach((entry) => {
      const name = entry.name;
      const todayInMinutes = timeToMinutes(entry.today);

      if (output2[name]) {
        if (todayInMinutes > 0) {
          output2[name].count++;
        } else {
          output2[name].count = 0;
        }
      } else {
        output2[name] = { count: todayInMinutes > 0 ? 1 : 0 };
      }
    });

    // بررسی افرادی که در input نیستند و تنظیم count به صفر
    Object.keys(output2).forEach((name) => {
      if (!jsonData.some((entry) => entry.name === name)) {
        output2[name].count = 0;
      }
    });

    // ذخیره‌سازی فایل output2.json
    fs.writeFile('./output2.json', JSON.stringify(output2, null, 2), (err) => {
      if (err) {
        console.error('Error writing to output2.json:', err);
      } else {
        console.log('output2.json has been updated.');
      }
    });

    // مرتب‌سازی بر اساس بیشترین `today` و نمایش همه افراد
    const sortedEntries = jsonData
      .map((entry) => ({
        name: entry.name,
        todayInMinutes: timeToMinutes(entry.today)
      }))
      .sort((a, b) => b.todayInMinutes - a.todayInMinutes);

    // نمایش لیست کامل به ترتیب از بیشترین تا کمترین مقدار
    sortedEntries.forEach((entry, index) => {
      const hours = Math.floor(entry.todayInMinutes / 60);
      const minutes = entry.todayInMinutes % 60;
      console.log(`${index + 1}. ${entry.name} (${hours}h ${minutes}m)`);
    });
  });
});
