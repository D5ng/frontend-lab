import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { nextAttempt } from '../../src/mocks/scenario'
import { examplePosts, type Neighborhood } from './api'
export const handlers = [
  http.get('*/api/daily/2026-10-04-neighborhood-feed/posts', async ({ request }) => {
    const neighborhood = new URL(request.url).searchParams.get('neighborhood') as Neighborhood
    const fail = neighborhood === 'yeonnam' && nextAttempt(request, 'yeonnam') === 1
    await delay(neighborhood === 'seongsu' ? 1800 : neighborhood === 'yeonnam' ? 450 : 700)
    if (fail) return HttpResponse.json({ message: 'temporary failure' }, { status: 503 })
    if (neighborhood === 'mangwon') return HttpResponse.json([])
    if (neighborhood === 'seongsu') return HttpResponse.json(examplePosts)
    return HttpResponse.json([{ id: 'y1', title: '산책할 때 쓰기 좋은 작은 크로스백', price: 12000, neighborhood }])
  }),
]
