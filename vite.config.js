import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'public/popup.html'), // popup.html 位于 public 目录
        background: resolve(__dirname, 'src/background.js'), // 确保 background.js 被打包
        ShowPageTag: resolve(__dirname, 'src/ShowPageTag.js') // 确保 ShowPageTag.js 被打包
      },
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
        format: 'es', // 使用 ES Module 格式替换 iife
      }
    }
  }
});
