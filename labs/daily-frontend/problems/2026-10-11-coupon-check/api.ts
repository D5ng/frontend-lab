export type Coupon = { code: string; discount: number }
export type CheckResult = { available: true; coupon: Coupon } | { available: false }
export type CheckCoupon = (code: string) => Promise<CheckResult>

// 입력 정규화와 화면 반영 여부는 실습자가 구현합니다. API는 취소를 지원하지 않습니다.
export function createCouponMock(): CheckCoupon {
  let retryCount = 0
  return async (code) => {
    await new Promise<void>((resolve) => setTimeout(resolve, code === 'WELCOME' ? 1600 : 600))
    if (code === 'RETRY' && retryCount++ === 0) throw new Error('확인 실패')
    if (code === 'WELCOME') return { available: true, coupon: { code, discount: 2000 } }
    if (code === 'SALE' || code === 'RETRY') return { available: true, coupon: { code, discount: 3000 } }
    return { available: false }
  }
}
