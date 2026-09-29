import { useState } from 'react'
import { canDecreaseQuantity, CartItem, MIN_CART_ITEM_QUANTITY } from '../model/cart'

const INITIAL_CART_ITEMS = [
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
] as CartItem[]

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART_ITEMS)

  const increaseQuantity = (itemId: CartItem['id']) => {
    const updatedItems = items.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item))
    setItems(updatedItems)
  }

  const decreaseQuantity = (itemId: CartItem['id']) => {
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, quantity: canDecreaseQuantity(item.quantity) ? item.quantity - 1 : MIN_CART_ITEM_QUANTITY } : item,
    )
    setItems(updatedItems)
  }

  const totalPrice = items.reduce((totalPrice, item) => {
    totalPrice += item.price * item.quantity
    return totalPrice
  }, 0)

  return {
    items,
    totalPrice,
    increaseQuantity,
    decreaseQuantity,
  }
}
