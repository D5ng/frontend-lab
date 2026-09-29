import { useState } from 'react'
import { canDecreaseQuantity, CartProduct, MIN_PRODUCT_QUANTITY } from '../model/cart.model'

const DEFAULT_PRODUCT = [
  {
    id: 0,
    name: '제주 햇감귤 3kg',
    price: 18900,
    quantity: 1,
  },
  {
    id: 1,
    name: '유기농 바나나 1.2kg',
    price: 5900,
    quantity: 2,
  },
  {
    id: 2,
    name: '무항생제 유정란 30구',
    price: 9800,
    quantity: 1,
  },
] as CartProduct[]

export function useProducts() {
  const [products, setProducts] = useState<CartProduct[]>(DEFAULT_PRODUCT)

  const increaseQuantity = (productId: CartProduct['id']) => {
    const updateProducts = products.map((product) => (product.id === productId ? { ...product, quantity: product.quantity + 1 } : product))
    setProducts(updateProducts)
  }

  const decreaseQuantity = (productId: CartProduct['id']) => {
    const updateProducts = products.map((product) =>
      product.id === productId
        ? { ...product, quantity: canDecreaseQuantity(product.quantity) ? product.quantity - 1 : MIN_PRODUCT_QUANTITY }
        : product,
    )
    setProducts(updateProducts)
  }

  const totalPrice = products.reduce((totalPrice, product) => {
    totalPrice += product.price * product.quantity
    return totalPrice
  }, 0)

  return {
    products,
    totalPrice,
    increaseQuantity,
    decreaseQuantity,
  }
}
