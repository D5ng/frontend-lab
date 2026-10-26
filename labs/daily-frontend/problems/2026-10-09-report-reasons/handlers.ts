import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { nextAttempt } from '../../src/mocks/scenario'
import { tripHandlers } from './trip/handlers'
export const handlers = [
  ...tripHandlers,
  http.post('*/api/daily/2026-10-09-report-reasons/reports', async ({ request }) => {
    const fail = nextAttempt(request) === 1
    await delay(1800)
    if (fail) return HttpResponse.json({ message: '접수 실패' }, { status: 503 })
    return new HttpResponse(null, { status: 204 })
  }),
]
