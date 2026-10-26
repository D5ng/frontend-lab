import { http, HttpResponse } from 'msw/http'
import { describe, expect, it } from 'vitest'
import { server } from '../../../src/mocks/server'
import { createSplitApi } from './api'
import { members } from './data'
const input = {
  title: '모임 식비',
  totalAmount: 10000,
  method: 'equal' as const,
  shares: [
    { memberId: 'nara', amount: 5000 },
    { memberId: 'jun', amount: 5000 },
  ],
}
describe('정산 HTTP 계약', () => {
  it('참여자 GET 응답을 읽는다', async () => {
    await expect(createSplitApi().getMembers()).resolves.toEqual(members)
  })
  it('요청 본문과 저장 결과를 전달한다', async () => {
    let body: unknown
    server.use(
      http.post('*/api/daily/2026-10-08-pickup-slots/splits', async ({ request }) => {
        body = await request.json()
        return HttpResponse.json({ id: 'saved' }, { status: 201 })
      }),
    )
    await expect(createSplitApi().save(input)).resolves.toEqual({ id: 'saved' })
    expect(body).toEqual(input)
  })
  it('첫 실패·재시도·세션 초기화를 제공한다', async () => {
    const api = createSplitApi()
    await expect(api.save(input)).rejects.toThrow('저장하지 못했어요')
    await expect(api.save(input)).resolves.toEqual({ id: 'split-2' })
    await expect(createSplitApi().save(input)).rejects.toThrow('저장하지 못했어요')
  })
  it('분배 합계가 원금과 다르면 거절한다', async () => {
    await expect(createSplitApi().save({ ...input, totalAmount: 10001 })).rejects.toThrow('확인해 주세요')
  })
})
