import { http, HttpResponse } from 'msw/http'
import { describe, expect, it } from 'vitest'
import { server } from '../../../src/mocks/server'
import { createTripApi } from './api'
import { places } from './data'
const input = { startHour: 10, budget: 15000, placeIds: ['garden', 'gallery'] }
describe('여행 HTTP 계약', () => {
  it('장소 GET과 서버의 규칙 데이터를 읽는다', async () => {
    await expect(createTripApi().getPlaces()).resolves.toEqual(places)
  })
  it('순서를 보존해 POST하고 저장 ID를 받는다', async () => {
    let body: unknown
    server.use(
      http.post('*/api/daily/2026-10-09-report-reasons/trips', async ({ request }) => {
        body = await request.json()
        return HttpResponse.json({ id: 'saved' })
      }),
    )
    await expect(createTripApi().save(input)).resolves.toEqual({ id: 'saved' })
    expect(body).toEqual(input)
  })
  it('첫 실패 후 재시도와 새 세션 초기화를 제공한다', async () => {
    const api = createTripApi()
    await expect(api.save(input)).rejects.toThrow('저장하지 못했어요')
    await expect(api.save(input)).resolves.toEqual({ id: 'trip-2' })
    await expect(createTripApi().save(input)).rejects.toThrow('저장하지 못했어요')
  })
})
