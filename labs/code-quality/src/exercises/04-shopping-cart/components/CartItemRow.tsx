import { FlexBox, IconButton, Typography } from '@wanteddev/wds'
import { formatPrice } from '../utils/formatPrice'
import { IconMinus, IconPlus } from '@wanteddev/wds-icon'
import { canDecreaseQuantity, CartItem } from '../model/cart'

interface Props {
  item: CartItem
  onIncreaseQuantity: (itemId: CartItem['id']) => void
  onDecreaseQuantity: (itemId: CartItem['id']) => void
}

export function CartItemRow({ item, onDecreaseQuantity, onIncreaseQuantity }: Props) {
  return (
    <FlexBox as="section" aria-labelledby={`cart-item-name-${item.id}`} className="cart-item" flexDirection="column" gap="16px">
      <FlexBox flexDirection="column" gap="4px">
        <Typography as="h3" id={`cart-item-name-${item.id}`} variant="body1" weight="bold">
          {item.name}
        </Typography>
        <Typography as="p" color="semantic.label.alternative" variant="label1">
          {formatPrice(item.price)}
        </Typography>
      </FlexBox>

      <FlexBox alignItems="center" className="cart-quantity" justifyContent="space-between">
        <Typography as="span" color="semantic.label.alternative" variant="label1" weight="medium">
          수량
        </Typography>
        <FlexBox alignItems="center" className="cart-quantity-control">
          <IconButton
            aria-label={`${item.name} 수량 줄이기`}
            disabled={!canDecreaseQuantity(item.quantity)}
            variant="outlined"
            onClick={() => onDecreaseQuantity(item.id)}
          >
            <IconMinus />
          </IconButton>
          <output aria-label={`${item.name} 수량`} className="cart-quantity-value">
            {item.quantity}
          </output>
          <IconButton aria-label={`${item.name} 수량 늘리기`} variant="outlined" onClick={() => onIncreaseQuantity(item.id)}>
            <IconPlus />
          </IconButton>
        </FlexBox>
      </FlexBox>
    </FlexBox>
  )
}
