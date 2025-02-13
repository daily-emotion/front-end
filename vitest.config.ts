import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins : [react()],
    server: {
        proxy: {'/api': { target:'https://dailyemotion.site', changeOrigin : true } },
    },
    build: {
      outDir: "dist",
      emptyOutDir: true, // 빌드 전에 dist 폴더 비우기 허용
    },
  };
});

