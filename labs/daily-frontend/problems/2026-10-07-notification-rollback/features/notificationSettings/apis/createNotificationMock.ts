import { createApiClient } from '../../../../../src/api/client'
import type { NotificationApi } from '../types/notification'

export function createNotificationMock(): NotificationApi {
  const request = createApiClient()
  const path = '/api/daily/2026-10-07-notification-rollback'
  return {
    getProducts: () => request(`${path}/products`),
    savePlan: (plan) => request(`${path}/plans`, { method: 'POST', body: JSON.stringify(plan) }),
  }
}
