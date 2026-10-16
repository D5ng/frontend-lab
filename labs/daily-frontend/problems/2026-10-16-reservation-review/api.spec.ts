import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw/http'
import { server } from '../../src/mocks/server'
import { createReservationApi } from './api'

describe('제공 예약 HTTP 계약', () => {
  it('금액 확인은 인원을 보내고 확정은 quoteId만 보낸다', async () => {
    const bodies: unknown[] = []
    server.use(
      http.post('*/api/daily/2026-10-16/quotes', async ({ request }) => {
        bodies.push(await request.json())
        return HttpResponse.json({ quoteId: 'q', count: 2, totalPrice: 28000 })
      }),
      http.post('*/api/daily/2026-10-16/reservations', async ({ request }) => {
        bodies.push(await request.json())
        return HttpResponse.json({ reservationId: 'r', count: 2, totalPrice: 28000 })
      }),
    )
    const api = createReservationApi()
    const quote = await api.getQuote(2)
    expect(await api.confirm(quote.quoteId)).toMatchObject({ count: 2, totalPrice: 28000 })
    expect(bodies).toEqual([{ count: 2 }, { quoteId: 'q' }])
  })
  it('실제 핸들러에서 단계별 첫 실패 후 재시도하고 확인 결과로 확정한다', async () => {
    const api = createReservationApi()
    await expect(api.getQuote(2)).rejects.toThrow('금액 확인에 실패했어요.')
    const quote = await api.getQuote(2)
    expect(quote).toMatchObject({ count: 2, totalPrice: 28000 })
    await expect(api.confirm(quote.quoteId)).rejects.toThrow('예약 요청에 실패했어요.')
    expect(await api.confirm(quote.quoteId)).toMatchObject({ count: 2, totalPrice: 28000 })
  }, 10000)
  it('확인하지 않은 금액의 예약을 거절한다', async () => {
    await expect(createReservationApi().confirm('unknown')).rejects.toThrow('확인한 금액이 없어요.')
  })
})
