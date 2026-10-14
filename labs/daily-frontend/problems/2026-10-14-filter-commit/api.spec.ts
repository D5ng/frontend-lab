import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw/http'
import { server } from '../../src/mocks/server'
import { createListingsApi, initialListings } from './api'

describe('관심 물건 HTTP 계약', () => {
  it('POST 본문을 전송하고 서버의 목록을 받는다', async () => {
    let body: unknown
    server.use(
      http.post('*/api/daily/2026-10-14/listings', async ({ request }) => {
        body = await request.json()
        return HttpResponse.json(initialListings.slice(0, 2))
      }),
    )
    expect(await createListingsApi()(['furniture'])).toEqual(initialListings.slice(0, 2))
    expect(body).toEqual({ categories: ['furniture'] })
  })
  it('실제 핸들러는 세션의 첫 요청을 실패시키고 재시도는 선택한 목록을 반환한다', async () => {
    const search = createListingsApi()
    await expect(search(['daily'])).rejects.toThrow('일시적으로 목록을 불러오지 못했어요.')
    expect(await search(['daily'])).toEqual([initialListings[2]])
  })
  it('빈 카테고리 선택을 거절한다', async () => {
    const search = createListingsApi()
    await expect(search([])).rejects.toThrow('카테고리를 확인해 주세요.')
  })
})
