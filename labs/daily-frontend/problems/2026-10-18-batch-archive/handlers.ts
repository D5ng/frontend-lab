import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { nextAttempt } from '../../src/mocks/scenario'

export const handlers = [
  http.post('/api/daily/2026-10-18/archive', async ({ request }) => {
    const { productIds } = (await request.json()) as { productIds: string[] }
    const attempt = nextAttempt(request)
    await delay(1000)
    const failedIds: string[] = attempt === 1 ? productIds.filter((id) => id === 'lamp') : []
    return HttpResponse.json({ succeededIds: productIds.filter((id) => !failedIds.includes(id)), failedIds })
  }),
]
