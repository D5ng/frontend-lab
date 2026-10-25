import { http, HttpResponse } from 'msw/http'
import { describe, expect, it } from 'vitest'
import { createApiClient } from '../../../../../src/api/client'
import { server } from '../../../../../src/mocks/server'
import { fetchProducts } from './fetchProducts'

describe('상품 목록 HTTP 계약', () => {
  it('GET에 조건을 붙이지 않고 응답 상품을 반환한다', async () => {
    let query: string | undefined
    let session: string | null = null
    const items = [{ id: 'sample', name: '표본 상품', price: 1000, stock: 0 }]
    server.use(
      http.get('*/api/daily/2026-10-25/products', ({ request }) => {
        query = new URL(request.url).search
        session = request.headers.get('x-lab-session')
        return HttpResponse.json(items)
      }),
    )
    await expect(fetchProducts(createApiClient())).resolves.toEqual(items)
    expect(query).toBe('')
    expect(session).toBeTruthy()
  })

  it('첫 실패 후 기본 목록을 받고 그다음 가격·재고·항목이 바뀐다', async () => {
    const request = createApiClient()
    await expect(fetchProducts(request)).rejects.toThrow('지금은 상품 정보를 확인할 수 없어요.')
    await expect(fetchProducts(request)).resolves.toEqual([
      { id: 'bread', name: '감자빵', price: 3500, stock: 5 },
      { id: 'juice', name: '사과주스', price: 2500, stock: 4 },
      { id: 'soup', name: '수프', price: 6000, stock: 2 },
    ])
    await expect(fetchProducts(request)).resolves.toEqual([
      { id: 'bread', name: '감자빵', price: 3500, stock: 1 },
      { id: 'juice', name: '사과주스', price: 3000, stock: 4 },
      { id: 'cookie', name: '쿠키', price: 2000, stock: 3 },
    ])
  })

  it('빈 성공 목록도 그대로 반환한다', async () => {
    server.use(http.get('*/api/daily/2026-10-25/products', () => HttpResponse.json([])))
    await expect(fetchProducts(createApiClient())).resolves.toEqual([])
  })
})
