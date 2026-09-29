import { CartItem } from '../model/cart'
import { CartItemRow } from './CartItemRow'

interface Props {
  items: CartItem[]
  onIncreaseQuantity: (itemId: CartItem['id']) => void
  onDecreaseQuantity: (itemId: CartItem['id']) => void
}

export function CartItemList({ items, onDecreaseQuantity, onIncreaseQuantity }: Props) {
  return items.map((item) => (
    <CartItemRow key={item.id} item={item} onIncreaseQuantity={onIncreaseQuantity} onDecreaseQuantity={onDecreaseQuantity} />
  ))
}
