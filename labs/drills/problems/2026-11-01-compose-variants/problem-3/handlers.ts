import { delay, http, HttpResponse } from 'msw'

// 모의 서버다. 풀이 대상이 아니다. 문제 3에서 새로 생긴 주소만 여기에 둔다.
const BASE = '/api/drills/2026-11-01'

export const handlers = [
  http.post(`${BASE}/comments/:commentId/likes`, async () => {
    await delay()
    return new HttpResponse(null, { status: 201 })
  }),

  http.delete(`${BASE}/comments/:commentId/likes`, async () => {
    await delay()
    return new HttpResponse(null, { status: 204 })
  }),
]
