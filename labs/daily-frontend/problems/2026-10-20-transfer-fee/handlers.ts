import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { nextAttempt } from '../../src/mocks/scenario'
import type { TransferInput } from './features/transfer/types/transfer'

export const handlers = [
  http.post('/api/daily/2026-10-20/transfers', async ({ request }) => {
    const attempt = nextAttempt(request)
    const input = (await request.json()) as TransferInput
    await delay(900)
    if (attempt === 1) return HttpResponse.json({ message: '연습용 첫 요청 실패' }, { status: 503 })
    return HttpResponse.json({ ...input, id: `transfer-${attempt}` })
  }),
]
