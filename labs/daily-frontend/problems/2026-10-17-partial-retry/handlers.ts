import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { nextAttempt } from '../../src/mocks/scenario'

export const handlers = [
  http.get('*/api/daily/2026-10-17/shop/profile', async () => {
    await delay(1200)
    return HttpResponse.json({
      name: '성수 작은 도예방',
      neighborhood: '성수동',
      description: '처음이어도 괜찮아요. 작은 그릇을 함께 만들어요.',
    })
  }),
  http.get('*/api/daily/2026-10-17/shop/reviews', async ({ request }) => {
    const attempt = nextAttempt(request)
    await delay(450)
    if (attempt === 1) return HttpResponse.json({ message: '후기 조회에 실패했어요.' }, { status: 503 })
    return HttpResponse.json([
      { id: 'r1', author: '동네산책', body: '처음 만들었는데 차근차근 알려주셨어요.' },
      { id: 'r2', author: '작은그릇', body: '조용히 집중할 수 있어서 좋았어요.' },
    ])
  }),
]
