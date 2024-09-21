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
        contentScript: resolve(__dirname, 'src/contentScript.jsx') // 添加 contentScript.jsx 以确保打包
      },
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  }
});
