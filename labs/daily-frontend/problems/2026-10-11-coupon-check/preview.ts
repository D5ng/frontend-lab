import type { CouponViewProps } from './view'

export const previews: Record<string, CouponViewProps> = {
  empty: {
    value: '',
    checking: false,
    fieldError: '',
    notice: null,
    coupon: null,
    applied: null,
    canCheck: true,
    canApply: false,
    onChange: () => {},
    onCheck: () => {},
    onApply: () => {},
  },
}
previews.invalid = { ...previews.empty, fieldError: '쿠폰 코드를 입력해 주세요.' }
previews.checking = { ...previews.empty, value: ' welcome ', checking: true, canCheck: false }
previews.error = { ...previews.empty, value: 'RETRY', notice: { tone: 'critical', text: '쿠폰을 확인하지 못했어요. 다시 확인해 주세요.' } }
previews.unavailable = {
  ...previews.empty,
  value: 'EXPIRED',
  notice: { tone: 'neutral', text: '사용할 수 없는 쿠폰이에요. 다른 코드를 입력해 주세요.' },
}
previews.verified = { ...previews.empty, value: ' welcome ', coupon: { code: 'WELCOME', discount: 2000 }, canApply: true }
previews.applied = { ...previews.verified, canApply: false, applied: { code: 'WELCOME', discount: 2000 } }
