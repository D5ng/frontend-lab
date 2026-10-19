import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { nextAttempt } from '../../src/mocks/scenario'
import { demoPages } from './features/feedPager/apis/demoPages'

export const handlers = [
  http.get('*/api/daily/2026-10-13-feed-pages/posts', async ({ request }) => {
    const cursor = new URL(request.url).searchParams.get('cursor') ?? 'start'
    const attempt = nextAttempt(request, `/api/daily/2026-10-13-feed-pages:${cursor}`)
    await delay(cursor === 'next-1' ? 1600 : 600)
    if (cursor === 'next-1' && attempt === 1) return HttpResponse.json({ message: '다음 페이지 확인 실패' }, { status: 503 })
    if (!demoPages[cursor]) return HttpResponse.json({ message: '알 수 없는 cursor' }, { status: 400 })
    return HttpResponse.json(demoPages[cursor])
  }),
]
