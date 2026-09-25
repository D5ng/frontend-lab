import { Divider, FlexBox, TopNavigation } from '@wanteddev/wds'
import { CartTotal } from './components/CartTotal'
import { useCartProduct } from './hooks/useCartProduct'
import { CartList } from './components/CartList'

const DEFAULT_CART_PRODUCTS = [
  {
    id: 0,
    name: '제주 햇감귤 3kg',
    price: 18900,
    quantity: 1,
  },
]

// 1단계: 화면만 그려져 있고 동작은 없다. 수량 조절과 금액 계산을 이 파일 안에서 구현한다.
export function Problem() {
  const { products, totalPrice, increaseQuantity, decreaseQuantity } = useCartProduct(DEFAULT_CART_PRODUCTS)

  return (
    <FlexBox className="cart-screen" flexDirection="column">
      <TopNavigation titleId="cart-title">장바구니</TopNavigation>

      <CartList products={products} onDecreaseQuantity={decreaseQuantity} onIncreaseQuantity={increaseQuantity} />

      <Divider thickness={10} />

      <CartTotal totalPrice={totalPrice} />
    </FlexBox>
  )
}
