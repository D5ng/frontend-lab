import { Text } from '@seed-design/react'
import { formatPrice } from '../../../utils/formatPrice'

interface Props {
  subtotalPrice: number
  shippingFee: number
  totalPrice: number
}

export function OrderPayment({ subtotalPrice, shippingFee, totalPrice }: Props) {
  return (
    <div className="order-payment">
      <Text as="h3" textStyle="t5Bold">
        결제 금액
      </Text>
      <dl>
        <dt>상품 금액</dt>
        <dd>{formatPrice(subtotalPrice)}</dd>
        <dt>배송비</dt>
        <dd>{formatPrice(shippingFee)}</dd>
        <dt>결제 예정 금액</dt>
        <dd>{formatPrice(totalPrice)}</dd>
      </dl>
    </div>
  )
}
