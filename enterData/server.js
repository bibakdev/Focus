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

// فعال کردن CORS برای همه درخواست‌ها
app.use(
  cors({
    origin: 'http://localhost:5173', // آدرس فرانت‌اند شما
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

// ذخیره اطلاعات در input.json
app.post('/update-json', (req, res) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
    res.json({ message: 'Data saved successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error writing to JSON file' });
  }
});

// اجرای سرور
app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));
