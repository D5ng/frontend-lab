import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw/http'
import { server } from '../../src/mocks/server'
import { createDetailApi } from './api'

describe('제공 상세 API 환경', () => {
  it('상품 ID로 GET 요청하고 응답을 전달한다', async () => {
    server.use(
      http.get('*/api/daily/2026-10-15/listings/chair', () =>
        HttpResponse.json({ id: 'chair', price: 15000, description: '설명', neighborhood: '성수동' }),
      ),
    )
    expect(await createDetailApi()('chair')).toMatchObject({ id: 'chair', price: 15000 })
  })
  it('실제 모의 서버의 조명 첫 실패 후 재시도는 성공한다', async () => {
    const load = createDetailApi()
    await expect(load('lamp')).rejects.toThrow('일시적으로 상세를 불러오지 못했어요.')
    expect(await load('lamp')).toMatchObject({ id: 'lamp', price: 8000 })
  })
  it('거래 종료는 오류가 아닌 null로 전달한다', async () => {
    expect(await createDetailApi()('mug')).toBeNull()
  })
})
