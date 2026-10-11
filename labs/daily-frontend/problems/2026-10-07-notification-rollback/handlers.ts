import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { nextAttempt } from '../../src/mocks/scenario'
export const handlers = [
  http.patch('*/api/daily/2026-10-07-notification-rollback/notifications', async ({ request }) => {
    const { productId } = (await request.json()) as { productId: string; enabled: boolean }
    const fail = productId === 'desk' && nextAttempt(request, 'desk') === 1
    await delay(productId === 'desk' ? 1800 : productId === 'books' ? 450 : 700)
    if (fail) return HttpResponse.json({ message: '설정 변경 실패' }, { status: 503 })
    return new HttpResponse(null, { status: 204 })
  }),
]
