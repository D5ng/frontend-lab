import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { nextAttempt } from '../../src/mocks/scenario'
import { products } from './features/notificationSettings/apis/products'
import type { NotificationPlan } from './features/notificationSettings/types/notification'

const path = '*/api/daily/2026-10-07-notification-rollback'

export const handlers = [
  http.get(`${path}/products`, async () => {
    await delay(500)
    return HttpResponse.json(products)
  }),
  http.post(`${path}/plans`, async ({ request }) => {
    const plan = (await request.json()) as NotificationPlan
    const valid =
      Array.isArray(plan.productIds) &&
      plan.productIds.length > 0 &&
      new Set(plan.productIds).size === plan.productIds.length &&
      plan.productIds.every((id) => products.some((product) => product.id === id && product.available)) &&
      ((plan.delivery === 'instant' && !('hour' in plan)) || (plan.delivery === 'digest' && (plan.hour === '09' || plan.hour === '20')))
    if (!valid) return HttpResponse.json({ message: '알림 설정을 확인해 주세요.' }, { status: 400 })
    const attempt = nextAttempt(request)
    await delay(900)
    if (attempt === 1) return HttpResponse.json({ message: '알림을 저장하지 못했어요. 다시 시도해 주세요.' }, { status: 503 })
    return HttpResponse.json({ id: `plan-${attempt}` }, { status: 201 })
  }),
]
