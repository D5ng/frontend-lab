import { ActionButton } from '@seed-design/react'
import { OrderType } from '../order.model'

interface Props {
  type: OrderType
  isSubmitting: boolean
  message: string
}

export function OrderAction({ type, isSubmitting, message }: Props) {
  return (
    <div className="order-action">
      <ActionButton type="submit" variant="brandSolid" size="large" disabled={isSubmitting}>
        {isSubmitting ? '처리 중...' : type === 'delivery' ? '배송 주문하기' : '픽업 예약하기'}
      </ActionButton>
      <p role="status" className="order-feedback">
        {message}
      </p>
    </div>
  )
}
