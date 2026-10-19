export type Coupon = { code: string; discount: number }

export type CheckResult = { available: true; coupon: Coupon } | { available: false }

export type CheckCoupon = (code: string) => Promise<CheckResult>
