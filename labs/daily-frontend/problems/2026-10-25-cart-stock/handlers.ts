import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { nextAttempt } from '../../src/mocks/scenario'
import type { Product } from './features/cartStock/types/product'

export const handlers = [
  http.get('*/api/daily/2026-10-25/products', async ({ request }) => {
    const attempt = nextAttempt(request)
    await delay(800)
    if (attempt === 1) {
      return HttpResponse.json({ message: '지금은 상품 정보를 확인할 수 없어요. 다시 시도해 주세요.' }, { status: 503 })
    }
    if (attempt === 2) {
      return HttpResponse.json<Product[]>([
        { id: 'bread', name: '감자빵', price: 3500, stock: 5 },
        { id: 'juice', name: '사과주스', price: 2500, stock: 4 },
        { id: 'soup', name: '수프', price: 6000, stock: 2 },
      ])
    }
    return HttpResponse.json<Product[]>([
      { id: 'bread', name: '감자빵', price: 3500, stock: 1 },
      { id: 'juice', name: '사과주스', price: 3000, stock: 4 },
      { id: 'cookie', name: '쿠키', price: 2000, stock: 3 },
    ])
  }),
]
