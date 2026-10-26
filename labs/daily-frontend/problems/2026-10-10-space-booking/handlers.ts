import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { nextAttempt } from '../../src/mocks/scenario'
import { spaces } from './booking/data'
import type { BookingRequest } from './booking/types'
const path = '*/api/daily/2026-10-10-space-booking'
export const handlers = [
  http.get(path + '/spaces', async () => {
    await delay(350)
    return HttpResponse.json(spaces)
  }),
  http.post(path + '/reservations', async ({ request }) => {
    const input = (await request.json()) as BookingRequest
    if (
      !spaces.some((space) => space.id === input.spaceId) ||
      (input.day !== 'today' && input.day !== 'tomorrow') ||
      !Number.isInteger(input.startHour) ||
      !Number.isInteger(input.duration) ||
      input.duration < 1 ||
      !Number.isInteger(input.guests) ||
      input.guests < 1 ||
      !Number.isSafeInteger(input.totalPrice) ||
      input.totalPrice < 0
    )
      return HttpResponse.json({ message: '예약 내용을 확인해 주세요.' }, { status: 400 })
    const attempt = nextAttempt(request)
    await delay(700)
    if (attempt === 1) return HttpResponse.json({ message: '예약하지 못했어요. 다시 시도해 주세요.' }, { status: 503 })
    return HttpResponse.json({ id: 'booking-' + attempt }, { status: 201 })
  }),
]
