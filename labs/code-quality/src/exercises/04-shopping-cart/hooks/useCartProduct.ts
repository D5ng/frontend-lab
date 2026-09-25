import { useState } from 'react'
import { calculateTotalPrice, CartProduct } from '../model/cartPolicy'
import { canDecreaseQuantity, MIN_CART_QUANTITY } from '../model/cartPolicy'

/* 장바구니에 담긴 상품을 관리하는 훅 */
export function useCartProduct(defaultProducts: CartProduct[]) {
  const [products, setProducts] = useState(defaultProducts)

  const totalPrice = calculateTotalPrice(products)

  const increaseQuantity = (productId: CartProduct['id']) => {
    const updatedProduct = products.map((product) => (product.id === productId ? { ...product, quantity: product.quantity + 1 } : product))
    setProducts(updatedProduct)
  }

  const decreaseQuantity = (productId: CartProduct['id']) => {
    const updatedProduct = products.map((product) =>
      product.id === productId
        ? { ...product, quantity: canDecreaseQuantity(product.quantity) ? product.quantity - 1 : MIN_CART_QUANTITY }
        : product,
    )
    setProducts(updatedProduct)
  }

  return {
    products,
    totalPrice,
    increaseQuantity,
    decreaseQuantity,
  }
}
