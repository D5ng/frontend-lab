import { http, HttpResponse } from 'msw/http'
import { describe, expect, it } from 'vitest'
import { server } from '../../../src/mocks/server'
import { createBookingApi } from './api'
import { spaces } from './data'
const input = { day: 'today' as const, startHour: 10, duration: 2, guests: 3, projector: true, spaceId: 'studio', totalPrice: 41000 }
describe('공간 HTTP 계약', () => {
  it('공간·시간표·정원·요금 데이터를 조회한다', async () => {
    await expect(createBookingApi().getSpaces()).resolves.toEqual(spaces)
  })
  it('예약 POST 본문과 ID를 전달한다', async () => {
    let body: unknown
    server.use(
      http.post('*/api/daily/2026-10-10-space-booking/reservations', async ({ request }) => {
        body = await request.json()
        return HttpResponse.json({ id: 'saved' })
      }),
    )
    await expect(createBookingApi().reserve(input)).resolves.toEqual({ id: 'saved' })
    expect(body).toEqual(input)
  })
  it('첫 실패·재시도·화면별 독립 세션을 제공한다', async () => {
    const api = createBookingApi()
    await expect(api.reserve(input)).rejects.toThrow('예약하지 못했어요')
    await expect(api.reserve(input)).resolves.toEqual({ id: 'booking-2' })
    await expect(createBookingApi().reserve(input)).rejects.toThrow('예약하지 못했어요')
  })
})
