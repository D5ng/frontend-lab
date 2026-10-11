import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { nextAttempt } from '../../src/mocks/scenario'
export const handlers = [
  http.post('*/api/daily/2026-10-11-coupon-check/coupons/check', async ({ request }) => {
    const { code } = (await request.json()) as { code: string }
    const fail = code === 'RETRY' && nextAttempt(request, 'RETRY') === 1
    await delay(code === 'WELCOME' ? 1600 : 600)
    if (fail) return HttpResponse.json({ message: '확인 실패' }, { status: 503 })
    if (code === 'WELCOME') return HttpResponse.json({ available: true, coupon: { code, discount: 2000 } })
    if (code === 'SALE' || code === 'RETRY') return HttpResponse.json({ available: true, coupon: { code, discount: 3000 } })
    return HttpResponse.json({ available: false })
  }),
]
