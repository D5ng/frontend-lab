import { useState } from 'react'
import type { CheckCoupon } from './api'
import { CouponView } from './view'

export function CouponForm({ checkCoupon }: { checkCoupon: CheckCoupon }) {
  const [value, setValue] = useState('')
  // TODO: checkCoupon을 연결하고 요구사항의 상태 경계를 직접 설계하세요.
  void checkCoupon
  return (
    <CouponView
      value={value}
      checking={false}
      fieldError=""
      notice={null}
      coupon={null}
      applied={null}
      canCheck={true}
      canApply={false}
      onChange={setValue}
      onCheck={() => {}}
      onApply={() => {}}
    />
  )
}
