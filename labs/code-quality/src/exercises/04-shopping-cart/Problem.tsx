import { Divider, FlexBox, TopNavigation } from '@wanteddev/wds'
import { CartProductList } from './components/CartProductList'
import { CartTotalPrice } from './components/CartTotalPrice'
import { useProducts } from './hooks/useProduct'

// 1단계: 화면만 그려져 있고 동작은 없다. 수량 조절과 금액 계산을 이 파일 안에서 구현한다.
export function Problem() {
  const { products, totalPrice, decreaseQuantity, increaseQuantity } = useProducts()

  return (
    <FlexBox className="cart-screen" flexDirection="column">
      <TopNavigation titleId="cart-title">장바구니</TopNavigation>

      <CartProductList products={products} onDecreaseQuantity={decreaseQuantity} onIncreaseQuantity={increaseQuantity} />

      <Divider thickness={10} />

      <CartTotalPrice totalPrice={totalPrice} />
    </FlexBox>
  )
}
