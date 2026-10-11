import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw/http'
import { server } from '../../src/mocks/server'
import { createPickupMock } from './api'

describe('MSW HTTP 계약', () => {
  it('요청 URL·메서드·본문을 전달하고 HTTP 응답을 API 반환값으로 변환한다', async () => {
    let received: { method: string; path: string; body: unknown } | undefined
    server.use(
      http.post('*/api/daily/2026-10-08-pickup-slots/reservations', async ({ request }) => {
        const url = new URL(request.url)
        received = { method: request.method, path: url.pathname + url.search, body: await request.json() }
        return new HttpResponse(null, { status: 204 })
      }),
    )
    const api = createPickupMock()
    await expect(api.reserveSlot({ day: 'today', slotId: 'today-18' })).resolves.toEqual(undefined)
    expect(received).toEqual({
      method: 'POST',
      path: '/api/daily/2026-10-08-pickup-slots/reservations',
      body: { day: 'today', slotId: 'today-18' },
    })
  })

  it('새 API 세션은 첫 실패를 다시 경험하고 이전 세션의 재시도는 성공한다', async () => {
    const api = createPickupMock()
    const first = expect(api.reserveSlot({ day: 'today', slotId: 'today-18' })).rejects.toThrow('예약 실패')
    const other = createPickupMock()
    const separate = expect(other.reserveSlot({ day: 'today', slotId: 'today-18' })).rejects.toThrow('예약 실패')
    await Promise.all([first, separate])
    await expect(api.reserveSlot({ day: 'today', slotId: 'today-18' })).resolves.toBeUndefined()
  })
})

it('재시도 이후에도 선택한 날짜에 없는 픽업 시간은 예약할 수 없다', async () => {
  const api = createPickupMock()
  await expect(api.reserveSlot({ day: 'today', slotId: 'today-18' })).rejects.toThrow('예약 실패')
  await expect(api.reserveSlot({ day: 'today', slotId: 'tomorrow-10' })).rejects.toThrow('예약 실패')
  await expect(api.reserveSlot({ day: 'today', slotId: 'today-18' })).resolves.toBeUndefined()
})
