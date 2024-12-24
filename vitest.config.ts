import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  test: {
    globals: true, // 전역 테스트 API 활성화
    environment: 'jsdom', // 브라우저 환경 시뮬레이션
    setupFiles: './src/setupTests.ts', // 테스트 환경 초기화 파일 경로
  },
})
