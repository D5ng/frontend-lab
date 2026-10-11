import { useState } from 'react'
import { createCouponMock } from './api'
import { CouponForm } from './starter'
import { CouponView } from './view'
import { previews } from './preview'

export function Problem() {
  const [checkCoupon] = useState(createCouponMock)
  const preview = new URLSearchParams(window.location.search).get('coupon-preview')
  return preview && previews[preview] ? <CouponView {...previews[preview]} /> : <CouponForm checkCoupon={checkCoupon} />
}
