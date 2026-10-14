import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { nextAttempt } from '../../src/mocks/scenario'
import { categories, initialListings, type Category } from './api'

export const handlers = [
  http.post('*/api/daily/2026-10-14/listings', async ({ request }) => {
    const body = (await request.json()) as { categories?: unknown }
    if (
      !Array.isArray(body.categories) ||
      body.categories.length === 0 ||
      !body.categories.every((value) => categories.some((category) => category.value === value))
    ) {
      return HttpResponse.json({ message: '카테고리를 확인해 주세요.' }, { status: 400 })
    }
    const attempt = nextAttempt(request)
    await delay(1800)
    if (attempt === 1) return HttpResponse.json({ message: '일시적으로 목록을 불러오지 못했어요.' }, { status: 503 })
    const selected = body.categories as Category[]
    return HttpResponse.json(initialListings.filter((item) => selected.includes(item.category)))
  }),
]
