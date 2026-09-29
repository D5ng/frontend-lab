import { FlexBox, Typography } from '@wanteddev/wds'
import { formatPrice } from '../utils/formatPrice'

interface Props {
  totalPrice: number
}

export function CartTotalPrice({ totalPrice }: Props) {
  return (
    <FlexBox alignItems="center" aria-labelledby="cart-total-label" as="section" className="cart-total" justifyContent="space-between">
      <Typography as="h3" id="cart-total-label" variant="body1" weight="medium">
        총 결제 금액
      </Typography>
      <Typography as="strong" color="semantic.primary.normal" variant="heading2" weight="bold">
        {formatPrice(totalPrice)}
      </Typography>
    </FlexBox>
  )
}
