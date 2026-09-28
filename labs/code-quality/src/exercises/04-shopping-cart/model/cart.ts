export const MIN_PRODUCT_QUANTITY = 1

export function canDecreaseQuantity(quantity: number) {
  return quantity > MIN_PRODUCT_QUANTITY
}
