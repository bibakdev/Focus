import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const filePath = path.join(__dirname, 'input.json');
const usersPath = path.join(__dirname, 'users.json');

// فعال کردن CORS برای همه درخواست‌ها
app.use(
  cors({
    origin: 'http://localhost:5175', // آدرس فرانت‌اند شما
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type'
  })
);

// فعال کردن خواندن JSON در درخواست‌های POST
app.use(express.json());

// دریافت اطلاعات از input.json
app.get('/get-data', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error reading JSON file' });
  }
});

// ذخیره اطلاعات در input.json و users.json
app.post('/update-json', (req, res) => {
  try {
    // ذخیره اطلاعات کامل در input.json
    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));

    // خواندن داده‌های قبلی از users.json
    let existingUsers = [];
    try {
      existingUsers = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
    } catch (error) {
      // اگر فایل users.json وجود ندارد یا خالی است، یک آرایه خالی در نظر می‌گیریم
      existingUsers = [];
    }

    // اضافه کردن کاربران جدید به لیست قبلی و ایجاد id برای هر کاربر
    const newUsers = req.body.map((user, index) => ({
      id: existingUsers.length + index + 1, // اطمینان از اینکه id ها منحصر به فرد باشند
      name: user.name
    }));

    // ادغام داده‌های قبلی و جدید
    const updatedUsers = [...existingUsers, ...newUsers];

    // ذخیره داده‌های به روز شده در users.json
    fs.writeFileSync(usersPath, JSON.stringify(updatedUsers, null, 2));

    res.json({ message: 'Data saved successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error writing to JSON file' });
  }
});

app.get('/get-users', (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error reading users file' });
  }
});

// اجرای سرور
app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));
