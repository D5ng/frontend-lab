import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { nextAttempt } from '../../src/mocks/scenario'
import { slotsByDay, type Day } from './api'
export const handlers = [
  http.get('*/api/daily/2026-10-08-pickup-slots/slots', async ({ request }) => {
    const day = new URL(request.url).searchParams.get('day') as Day
    const fail = day === 'tomorrow' && nextAttempt(request, 'tomorrow') === 1
    await delay(day === 'today' ? 1800 : 500)
    if (fail) return HttpResponse.json({ message: '시간 조회 실패' }, { status: 503 })
    return HttpResponse.json(slotsByDay[day])
  }),
  http.post('*/api/daily/2026-10-08-pickup-slots/reservations', async ({ request }) => {
    const attempt = nextAttempt(request)
    const { day, slotId } = (await request.json()) as { day: Day; slotId: string }
    const fail = attempt === 1 || !slotsByDay[day].some((slot) => slot.id === slotId)
    await delay(1000)
    if (fail) return HttpResponse.json({ message: '예약 실패' }, { status: 503 })
    return new HttpResponse(null, { status: 204 })
  }),
]
