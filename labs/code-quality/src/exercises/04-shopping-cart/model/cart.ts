export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

export const MIN_CART_ITEM_QUANTITY = 1

/* 장바구니 상품 수량을 감소할 수 있는지 판별하는 함수 */
export function canDecreaseQuantity(quantity: number) {
  return quantity > MIN_CART_ITEM_QUANTITY
}
