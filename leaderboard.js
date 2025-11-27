import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ---- read s2 from leaderboard.txt ----
let s2_default = '';

try {
  s2_default = fs.readFileSync('./leaderboard.txt', 'utf8').trim();
} catch (err) {
  // اگر فایل نبود default را میزاریم اول بار
  s2_default = '🔁f.a.e.z.e.97-nil-saye-yekta-Rira-Parham-MEL-Durga';
  fs.writeFileSync('./leaderboard.txt', s2_default);
}

function removePrefixEmojis(str) {
  return str.replace(/^[\p{Extended_Pictographic}]+/u, '');
}

function compare(s1, s2) {
  const c1 = removePrefixEmojis(s1);
  const c2 = removePrefixEmojis(s2);

  const arr1 = c1
    .split('-')
    .map((i) => i.trim())
    .filter((i) => i !== '');
  const arr2 = c2
    .split('-')
    .map((i) => i.trim())
    .filter((i) => i !== '');

  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  const common = [...set1].filter((x) => set2.has(x));
  const only1 = [...set1].filter((x) => !set2.has(x));
  const only2 = [...set2].filter((x) => !set1.has(x));

  const emoji_common = '🏅';
  const emoji_s1 = '🍌';
  const emoji_s2 = '🔁';

  console.log(`${emoji_common}${common.join('-')}`);
  console.log(`${emoji_s2}${only2.join('-')}`);
  console.log(`${emoji_s1}${only1.join('-')}`);
  console.log('---------------------------------');
  console.log(
    `(${emoji_common}${common.join('-')}
                ${emoji_s2}${only2.join('-')}
                ${emoji_s1}${only1.join('-')})`.length
  );
}

// ---------- flow ----------

rl.question('enter 🍌: \n> ', (s1) => {
  rl.question('do you want change 🔁? (y/n)\n> ', (ans) => {
    if (ans.toLowerCase() === 'y') {
      rl.question('enter new 🔁: \n> ', (newS2) => {
        // save to file
        fs.writeFileSync('./leaderboard.txt', newS2.trim(), 'utf8');

        compare(s1, newS2.trim());
        rl.close();
      });
    } else {
      compare(s1, s2_default);
      rl.close();
    }
  });
});
