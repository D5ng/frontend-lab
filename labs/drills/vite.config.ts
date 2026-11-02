import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'seed-design': fileURLToPath(new URL('./src/seed-design', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    server: { deps: { inline: [/@seed-design\//] } },
    // 파일마다 첫 테스트가 문제 모듈과 SEED를 처음 변환한다. 화면 문제 파일이 여러 개 동시에 돌면
    // CI에서 이 첫 변환만으로 기본 5초를 넘겨, 늦게 끝난 테스트가 다음 테스트의 화면에 입력하기도 했다.
    testTimeout: 20000,
  },
})
