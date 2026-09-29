import { CartItem } from '../model/cart'
import { CartItemRow } from './CartItemRow'

interface Props {
  items: CartItem[]
  onIncreaseQuantity: (productId: CartItem['id']) => void
  onDecreaseQuantity: (productId: CartItem['id']) => void
}

export function CartItemList({ items, onDecreaseQuantity, onIncreaseQuantity }: Props) {
  return items.map((item) => (
    <CartItemRow key={item.id} item={item} onIncreaseQuantity={onIncreaseQuantity} onDecreaseQuantity={onDecreaseQuantity} />
  ))
}
