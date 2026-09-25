import { CartProduct } from '../model/cartPolicy'
import { CartItem } from './CartItem'

interface Props {
  products: CartProduct[]
  onDecreaseQuantity: (product: CartProduct['id']) => void
  onIncreaseQuantity: (product: CartProduct['id']) => void
}

export function CartList({ products, onDecreaseQuantity, onIncreaseQuantity }: Props) {
  return products.map((product) => (
    <CartItem key={product.id} product={product} onDecreaseQuantity={onDecreaseQuantity} onIncreaseQuantity={onIncreaseQuantity} />
  ))
}
