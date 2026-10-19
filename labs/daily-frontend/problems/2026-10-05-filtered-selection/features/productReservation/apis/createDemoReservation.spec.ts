import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw/http'
import { server } from '../../../../../src/mocks/server'
import { createDemoReservation } from './createDemoReservation'

describe('MSW HTTP 계약', () => {
  it('요청 URL·메서드·본문을 전달하고 HTTP 응답을 API 반환값으로 변환한다', async () => {
    let received: { method: string; path: string; body: unknown } | undefined
    server.use(
      http.post('*/api/daily/2026-10-05-filtered-selection/reservations', async ({ request }) => {
        const url = new URL(request.url)
        received = { method: request.method, path: url.pathname + url.search, body: await request.json() }
        return new HttpResponse(null, { status: 204 })
      }),
    )
    const api = createDemoReservation()
    await expect(api({ productIds: ['desk', 'plant'], totalPrice: 12000 })).resolves.toEqual(undefined)
    expect(received).toEqual({
      method: 'POST',
      path: '/api/daily/2026-10-05-filtered-selection/reservations',
      body: { productIds: ['desk', 'plant'], totalPrice: 12000 },
    })
  })

  it('새 API 세션은 첫 실패를 다시 경험하고 이전 세션의 재시도는 성공한다', async () => {
    const api = createDemoReservation()
    const first = expect(api({ productIds: ['desk'], totalPrice: 12000 })).rejects.toThrow('일시적인 연결 실패')
    const other = createDemoReservation()
    const separate = expect(other({ productIds: ['desk'], totalPrice: 12000 })).rejects.toThrow('일시적인 연결 실패')
    await Promise.all([first, separate])
    await expect(api({ productIds: ['desk'], totalPrice: 12000 })).resolves.toBeUndefined()
  })
})
