import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { nextAttempt } from '../../../src/mocks/scenario'
import { places } from './data'
import type { TripRequest } from './types'
const path = '*/api/daily/2026-10-09-report-reasons'
export const tripHandlers = [
  http.get(path + '/places', async () => {
    await delay(350)
    return HttpResponse.json(places)
  }),
  http.post(path + '/trips', async ({ request }) => {
    const input = (await request.json()) as TripRequest
    if (
      !Array.isArray(input.placeIds) ||
      !input.placeIds.length ||
      new Set(input.placeIds).size !== input.placeIds.length ||
      input.placeIds.some((id) => !places.some((place) => place.id === id)) ||
      !Number.isInteger(input.startHour) ||
      !Number.isSafeInteger(input.budget) ||
      input.budget < 0
    )
      return HttpResponse.json({ message: '여행 계획을 확인해 주세요.' }, { status: 400 })
    const attempt = nextAttempt(request)
    await delay(700)
    if (attempt === 1) return HttpResponse.json({ message: '일정을 저장하지 못했어요. 다시 시도해 주세요.' }, { status: 503 })
    return HttpResponse.json({ id: 'trip-' + attempt }, { status: 201 })
  }),
]
