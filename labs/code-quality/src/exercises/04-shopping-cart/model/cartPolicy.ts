export interface CartProduct {
  id: number
  name: string
  price: number
  quantity: number
}

/* 장바구니 최소 수량 */
export const MIN_CART_QUANTITY = 1

/* 현재 수량이 최소 수량보다 높으면 수량을 감소할 수 있다. */
export function canDecreaseQuantity(quantity: number) {
  return quantity > MIN_CART_QUANTITY
}

/* 장바구니에 담긴 상품의 총 금액 */
export function calculateTotalPrice(products: CartProduct[]) {
  return products.reduce((total, product) => {
    total += product.price * product.quantity
    return total
  }, 0)
}
