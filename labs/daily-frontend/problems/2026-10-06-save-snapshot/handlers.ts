import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { nextAttempt } from '../../src/mocks/scenario'
import type { Memo } from './features/memoEditor/types/memo'
export const handlers = [
  http.put('*/api/daily/2026-10-06-save-snapshot/memo', async ({ request }) => {
    const fail = nextAttempt(request) === 1
    const snapshot = (await request.json()) as Memo
    await delay(1800)
    if (fail) return HttpResponse.json({ message: '일시적인 연결 실패' }, { status: 503 })
    return HttpResponse.json(snapshot)
  }),
]
