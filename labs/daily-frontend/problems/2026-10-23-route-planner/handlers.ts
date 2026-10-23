import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { nextAttempt } from '../../src/mocks/scenario'
import type { Route } from './features/routePlanner/types/route'

export const handlers = [
  http.get('*/api/daily/2026-10-23/routes', async ({ request }) => {
    const url = new URL(request.url)
    const destination = url.searchParams.get('destination')
    const attempt = nextAttempt(request, `${url.pathname}:${destination}`)
    if (destination === 'park') {
      await delay(1200)
      if (attempt === 1) {
        return HttpResponse.json({ message: '지금은 경로를 조회할 수 없어요. 다시 시도해 주세요.' }, { status: 503 })
      }
      return HttpResponse.json<Route[]>([
        { id: 'direct', title: '강변 버스', minutes: 32, transfers: 0 },
        { id: 'transfer', title: '공원 환승선', minutes: 25, transfers: 1 },
      ])
    }
    if (destination === 'museum') {
      await delay(350)
      return HttpResponse.json<Route[]>([
        { id: 'direct', title: '미술관 순환선', minutes: 28, transfers: 0 },
        { id: 'transfer', title: '미술관 급행선', minutes: 19, transfers: 1 },
      ])
    }
    if (destination === 'pier') {
      await delay(650)
      return HttpResponse.json<Route[]>([])
    }
    return HttpResponse.json({ message: '도착지를 확인해 주세요.' }, { status: 400 })
  }),
]
