import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '127.0.0.1', // جلوگیری از استفاده از ::1
    port: 3000, // پورت جدید غیر از 5173
    strictPort: true
  }
});
