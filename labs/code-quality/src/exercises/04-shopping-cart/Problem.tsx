import { Divider, FlexBox, IconButton, TopNavigation, Typography } from '@wanteddev/wds'
import { IconMinus, IconPlus } from '@wanteddev/wds-icon'
import { useState } from 'react'
import { formatPrice } from './utils/formatPrice'
import { canDecreaseQuantity, MIN_PRODUCT_QUANTITY } from './model/cart'

const DEFAULT_PRODUCT = {
  name: '제주 햇감귤 3kg',
  price: 18900,
}

// 1단계: 화면만 그려져 있고 동작은 없다. 수량 조절과 금액 계산을 이 파일 안에서 구현한다.
export function Problem() {
  const [quantity, setQuantity] = useState(MIN_PRODUCT_QUANTITY)

  const handleIncreaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1)
  }

  const handleDecreaseQuantity = () => {
    setQuantity((prevQuantity) => (canDecreaseQuantity(prevQuantity) ? prevQuantity - 1 : MIN_PRODUCT_QUANTITY))
  }

  const canDecrease = canDecreaseQuantity(quantity)

  const totalPrice = DEFAULT_PRODUCT.price * quantity

  return (
    <FlexBox className="cart-screen" flexDirection="column">
      <TopNavigation titleId="cart-title">장바구니</TopNavigation>

      <FlexBox as="section" aria-labelledby="cart-item-name" className="cart-item" flexDirection="column" gap="16px">
        <FlexBox flexDirection="column" gap="4px">
          <Typography as="h3" id="cart-item-name" variant="body1" weight="bold">
            {DEFAULT_PRODUCT.name}
          </Typography>
          <Typography as="p" color="semantic.label.alternative" variant="label1">
            {formatPrice(DEFAULT_PRODUCT.price)}원
          </Typography>
        </FlexBox>

        <FlexBox alignItems="center" className="cart-quantity" justifyContent="space-between">
          <Typography as="span" color="semantic.label.alternative" variant="label1" weight="medium">
            수량
          </Typography>
          <FlexBox alignItems="center" className="cart-quantity-control">
            <IconButton aria-label="수량 줄이기" disabled={!canDecrease} variant="outlined" onClick={handleDecreaseQuantity}>
              <IconMinus />
            </IconButton>
            <output aria-label="수량" className="cart-quantity-value">
              {quantity}
            </output>
            <IconButton aria-label="수량 늘리기" variant="outlined" onClick={handleIncreaseQuantity}>
              <IconPlus />
            </IconButton>
          </FlexBox>
        </FlexBox>
      </FlexBox>

      <Divider thickness={10} />

      <FlexBox alignItems="center" aria-labelledby="cart-total-label" as="section" className="cart-total" justifyContent="space-between">
        <Typography as="h3" id="cart-total-label" variant="body1" weight="medium">
          총 결제 금액
        </Typography>
        <Typography as="strong" color="semantic.primary.normal" variant="heading2" weight="bold">
          {formatPrice(totalPrice)}원
        </Typography>
      </FlexBox>
    </FlexBox>
  )
}
