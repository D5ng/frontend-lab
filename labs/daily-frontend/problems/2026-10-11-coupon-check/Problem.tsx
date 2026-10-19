import { useState } from 'react'
import { createCouponMock } from './features/couponForm/apis/createCouponMock'
import { CouponFormPage } from './pages/CouponFormPage'
import { CouponView } from './features/couponForm/components/CouponView'
import { previews } from './features/couponForm/components/CouponView.preview'

export function Problem() {
  const [checkCoupon] = useState(createCouponMock)
  const preview = new URLSearchParams(window.location.search).get('coupon-preview')
  return preview && previews[preview] ? <CouponView {...previews[preview]} /> : <CouponFormPage checkCoupon={checkCoupon} />
}
