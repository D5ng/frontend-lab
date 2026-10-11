import { createApiClient } from '../../src/api/client'

export type Coupon = { code: string; discount: number }
export type CheckResult = { available: true; coupon: Coupon } | { available: false }
export type CheckCoupon = (code: string) => Promise<CheckResult>

// HTTP 응답 모킹은 handlers.ts에 두고 기존 함수 주입 계약을 유지한다.
export function createCouponMock(): CheckCoupon {
  const request = createApiClient()
  return (code) =>
    request<CheckResult>('/api/daily/2026-10-11-coupon-check/coupons/check', { method: 'POST', body: JSON.stringify({ code }) })
}
