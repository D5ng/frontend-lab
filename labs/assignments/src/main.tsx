import { createRoot } from 'react-dom/client'
import { App } from './App'
import '@seed-design/css/all.css'
import './style.css'

async function startApp() {
  // 서버 없는 연습 앱이므로 dev와 build preview 모두 MSW를 사용한다.
  // 첫 렌더의 조회도 가로챌 수 있도록 worker 준비를 먼저 기다린다.
  const { worker } = await import('./mocks/browser')
  await worker.start({
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
    onUnhandledFrame: 'bypass',
  })
  createRoot(document.getElementById('root')!).render(<App />)
}

void startApp().catch((error: unknown) => {
  console.error(error)
  document.getElementById('root')!.textContent = '연습 환경을 시작하지 못했어요. 페이지를 새로고침해 주세요.'
})
