import { SubmitEventHandler, useState } from 'react'
import { OrderFormState, OrderProduct, OrderRequest } from './order.model'
import { validateDeliveryOrder } from './order-delivery'
import { validatePickupOrder } from './order-pickup'
import { calculateShippingFee, createOrderRequest } from './order'

const INITIAL_ORDER_STATE: OrderFormState = {
  type: 'delivery',
  quantity: 1,
  address: '',
  pickupDate: 'today',
  store: '',
}

export function useOrderForm(product: OrderProduct, sendOrder: (request: OrderRequest) => Promise<void>) {
  const [orderData, setOrderData] = useState(INITIAL_ORDER_STATE)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const { type, quantity, address, store, pickupDate } = orderData

  const subtotalPrice = quantity * product.price
  const shippingFee = calculateShippingFee(type, subtotalPrice)
  const totalPrice = subtotalPrice + shippingFee

  const update = <K extends keyof OrderFormState>(field: K, value: OrderFormState[K]) => {
    setOrderData((prevOrderData) => ({ ...prevOrderData, [field]: value }))
    setMessage('')
  }

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    if (isSubmitting) return
    setMessage('')

    const validationMessage =
      type === 'delivery' ? validateDeliveryOrder({ subtotalPrice, address }) : validatePickupOrder({ quantity, store, pickupDate })

    if (validationMessage !== null) {
      setMessage(validationMessage)
      return
    }

    setIsSubmitting(true)
    try {
      const request = createOrderRequest({
        orderData,
        shippingFee,
        totalPrice,
      })

      await sendOrder(request)

      setMessage(type === 'delivery' ? '배송 주문을 완료했어요.' : '픽업 예약을 완료했어요.')
    } catch {
      setMessage(
        type === 'delivery' ? '배송 주문을 완료하지 못했어요. 다시 시도해 주세요.' : '픽업 예약을 완료하지 못했어요. 다시 시도해 주세요.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    orderData,
    amounts: {
      subtotalPrice,
      totalPrice,
      shippingFee,
    },
    isSubmitting,
    message,
    update,
    handleSubmit,
  }
}
