import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw/http'
import { server } from '../../../../../src/mocks/server'
import { createShopApi } from './createShopApi'

describe('제공 HTTP 환경', () => {
  it('가게 소개 경로의 응답을 전달한다', async () => {
    expect(await createShopApi().loadProfile()).toMatchObject({ name: '성수 작은 도예방', neighborhood: '성수동' })
  })
  it('후기의 첫 실패를 오류로 전달하고 재시도는 목록을 받는다', async () => {
    const api = createShopApi()
    await expect(api.loadReviews()).rejects.toThrow('후기 조회에 실패했어요.')
    expect(await api.loadReviews()).toHaveLength(2)
  })
  it('빈 후기 응답도 성공 배열로 전달한다', async () => {
    server.use(http.get('*/api/daily/2026-10-17/shop/reviews', () => HttpResponse.json([])))
    expect(await createShopApi().loadReviews()).toEqual([])
  })
})
