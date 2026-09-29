import { CartProduct } from '../model/cart.model'
import { CartProductItem } from './CartProductItem'

interface Props {
  products: CartProduct[]
  onIncreaseQuantity: (productId: CartProduct['id']) => void
  onDecreaseQuantity: (productId: CartProduct['id']) => void
}

export function CartProductList({ products, onDecreaseQuantity, onIncreaseQuantity }: Props) {
  return products.map((product) => (
    <CartProductItem key={product.id} product={product} onIncreaseQuantity={onIncreaseQuantity} onDecreaseQuantity={onDecreaseQuantity} />
  ))
}
