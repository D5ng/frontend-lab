export interface OrderProduct {
  categoryLabel: string
  name: string
  price: number
  minOrderQuantity: number
  maxOrderQuantity: number
}

export const DUMMY_ORDER_PRODUCT: OrderProduct = {
  categoryLabel: '드립백',
  name: '드립백 커피 6개입',
  price: 6000,
  minOrderQuantity: 1,
  maxOrderQuantity: 5,
}

export type OrderRequest =
  | { type: 'delivery'; quantity: number; address: string; shippingFee: number; totalPrice: number }
  | { type: 'pickup'; quantity: number; store: string; pickupDate: 'today' | 'tomorrow'; totalPrice: number }

export type OrderType = OrderRequest['type']

export type PickupDate = 'today' | 'tomorrow'

export interface OrderFormState {
  type: OrderType
  quantity: number
  address: string
  store: string
  pickupDate: PickupDate
}
