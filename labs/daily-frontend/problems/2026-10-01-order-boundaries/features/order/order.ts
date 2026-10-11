import { calculateDeliveryShippingFee } from './order-delivery'
import { OrderFormState, OrderRequest, OrderType } from './order.model'

interface CreateOrderRequestParams {
  orderData: OrderFormState
  shippingFee: number
  totalPrice: number
}

/* 주문에 필요한 데이터를 만드는 함수 */
export function createOrderRequest({ orderData, shippingFee, totalPrice }: CreateOrderRequestParams): OrderRequest {
  if (orderData.type === 'delivery') {
    return {
      type: 'delivery',
      quantity: orderData.quantity,
      address: orderData.address.trim(),
      shippingFee,
      totalPrice,
    }
  }

  return {
    type: 'pickup',
    quantity: orderData.quantity,
    store: orderData.store,
    pickupDate: orderData.pickupDate,
    totalPrice,
  }
}

/**
 * 주문 방법에 따른 배송비를 계산하는 함수
 * 매장 픽업인 경우 배송비 계산을 하지 않는다
 */
export function calculateShippingFee(type: OrderType, subtotalPrice: number) {
  return type === 'delivery' ? calculateDeliveryShippingFee(subtotalPrice) : 0
}
