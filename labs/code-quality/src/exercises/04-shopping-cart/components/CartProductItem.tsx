import { FlexBox, IconButton, Typography } from '@wanteddev/wds'
import { formatPrice } from '../utils/formatPrice'
import { IconMinus, IconPlus } from '@wanteddev/wds-icon'
import { canDecreaseQuantity, CartProduct } from '../model/cart.model'

interface Props {
  product: CartProduct
  onIncreaseQuantity: (productId: CartProduct['id']) => void
  onDecreaseQuantity: (productId: CartProduct['id']) => void
}

export function CartProductItem({ product, onDecreaseQuantity, onIncreaseQuantity }: Props) {
  return (
    <FlexBox as="section" aria-labelledby={`cart-item-name-${product.id}`} className="cart-item" flexDirection="column" gap="16px">
      <FlexBox flexDirection="column" gap="4px">
        <Typography as="h3" id={`cart-item-name-${product.id}`} variant="body1" weight="bold">
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
          <IconButton
            aria-label={`${product.name} 수량 줄이기`}
            disabled={!canDecreaseQuantity(product.quantity)}
            variant="outlined"
            onClick={() => onDecreaseQuantity(product.id)}
          >
            <IconMinus />
          </IconButton>
          <output aria-label={`${product.name} 수량`} className="cart-quantity-value">
            {product.quantity}
          </output>
          <IconButton aria-label={`${product.name} 수량 늘리기`} variant="outlined" onClick={() => onIncreaseQuantity(product.id)}>
            <IconPlus />
          </IconButton>
        </FlexBox>
      </FlexBox>
    </FlexBox>
  )
}
