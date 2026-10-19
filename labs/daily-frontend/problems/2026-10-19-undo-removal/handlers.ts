import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { nextAttempt } from '../../src/mocks/scenario'

async function respond(request: Request, id: string) {
  const attempt = nextAttempt(request)
  await delay(700)
  if (id === 'chair' && attempt === 1) return HttpResponse.json({ message: '잠시 후 다시 시도해 주세요.' }, { status: 503 })
  return new HttpResponse(null, { status: 204 })
}

export const handlers = [
  http.delete('/api/daily/2026-10-19/items/:id', ({ request, params }) => respond(request, String(params.id))),
  http.post('/api/daily/2026-10-19/items/:id/restore', ({ request, params }) => respond(request, String(params.id))),
]
