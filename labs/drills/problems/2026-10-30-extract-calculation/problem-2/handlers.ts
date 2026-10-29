import { delay, http, HttpResponse } from 'msw'

// 모의 서버다. 풀이 대상이 아니다.
const BASE = '/api/drills/2026-10-30/savings'

const product = {
  id: 'monthly-1',
  name: '매달 모으는 적금',
  minMonthlyAmount: 10000,
  maxMonthlyAmount: 500000,
  terms: [
    { months: 6, annualRate: 3.0 },
    { months: 12, annualRate: 3.5 },
    { months: 24, annualRate: 4.0 },
  ],
}

let nextAccountId = 1001

export const handlers = [
  http.get(`${BASE}/products/monthly-1`, async () => {
    await delay()
    return HttpResponse.json(product)
  }),

  http.post(`${BASE}/accounts`, async () => {
    await delay()
    return HttpResponse.json({ id: `sv-${nextAccountId++}` }, { status: 201 })
  }),
]
