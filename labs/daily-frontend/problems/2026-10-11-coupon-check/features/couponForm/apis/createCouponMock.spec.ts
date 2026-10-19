import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw/http'
import { server } from '../../../../../src/mocks/server'
import { createCouponMock } from './createCouponMock'

describe('MSW HTTP 계약', () => {
  it('요청 URL·메서드·본문을 전달하고 HTTP 응답을 API 반환값으로 변환한다', async () => {
    let received: { method: string; path: string; body: unknown } | undefined
    server.use(
      http.post('*/api/daily/2026-10-11-coupon-check/coupons/check', async ({ request }) => {
        const url = new URL(request.url)
        received = { method: request.method, path: url.pathname + url.search, body: await request.json() }
        return HttpResponse.json({ available: true, coupon: { code: 'WELCOME', discount: 2000 } })
      }),
    )
    const api = createCouponMock()
    await expect(api('WELCOME')).resolves.toEqual({ available: true, coupon: { code: 'WELCOME', discount: 2000 } })
    expect(received).toEqual({ method: 'POST', path: '/api/daily/2026-10-11-coupon-check/coupons/check', body: { code: 'WELCOME' } })
  })

  it('새 API 세션은 첫 실패를 다시 경험하고 이전 세션의 재시도는 성공한다', async () => {
    const api = createCouponMock()
    const first = expect(api('RETRY')).rejects.toThrow('확인 실패')
    const other = createCouponMock()
    const separate = expect(other('RETRY')).rejects.toThrow('확인 실패')
    await Promise.all([first, separate])
    await expect(api('RETRY')).resolves.toBeDefined()
  })
})
