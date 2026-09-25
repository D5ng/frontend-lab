import { FlexBox, IconButton, Typography } from '@wanteddev/wds'
import { IconMinus, IconPlus } from '@wanteddev/wds-icon'
import { CartProduct } from '../model/cartPolicy'
import { canDecreaseQuantity } from '../model/cartPolicy'
import { formatPrice } from '../utils/formatPrice'

interface Props {
  product: CartProduct
  onIncreaseQuantity: (product: CartProduct['id']) => void
  onDecreaseQuantity: (product: CartProduct['id']) => void
}

export function CartItem({ product, onIncreaseQuantity, onDecreaseQuantity }: Props) {
  const canDecrease = canDecreaseQuantity(product.quantity)

  return (
    <FlexBox as="section" aria-labelledby="cart-item-name" className="cart-item" flexDirection="column" gap="16px">
      <FlexBox flexDirection="column" gap="4px">
        <Typography as="h3" id="cart-item-name" variant="body1" weight="bold">
          {product.name}
        </Typography>
        <Typography as="p" color="semantic.label.alternative" variant="label1">
          {formatPrice(product.price)}원
        </Typography>
      </FlexBox>

      <FlexBox alignItems="center" className="cart-quantity" justifyContent="space-between">
        <Typography as="span" color="semantic.label.alternative" variant="label1" weight="medium">
          수량
        </Typography>
        <FlexBox alignItems="center" className="cart-quantity-control">
          <IconButton aria-label="수량 줄이기" disabled={!canDecrease} variant="outlined" onClick={() => onDecreaseQuantity(product.id)}>
            <IconMinus />
          </IconButton>
          <output aria-label="수량" className="cart-quantity-value">
            {product.quantity}
          </output>
          <IconButton aria-label="수량 늘리기" variant="outlined" onClick={() => onIncreaseQuantity(product.id)}>
            <IconPlus />
          </IconButton>
        </FlexBox>
      </FlexBox>
    </FlexBox>
  )
}
