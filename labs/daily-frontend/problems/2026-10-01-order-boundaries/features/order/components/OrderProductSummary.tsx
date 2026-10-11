import { Badge, Text } from '@seed-design/react'
import { formatPrice } from '../../../utils/formatPrice'
import { OrderProduct } from '../order.model'

interface Props {
  product: OrderProduct
}

export function OrderProductSummary({ product }: Props) {
  return (
    <div className="order-product">
      <CoffeeIcon />
      <div className="order-product-info">
        <Badge variant="weak" tone="neutral" size="medium">
          {product.categoryLabel}
        </Badge>
        <Text as="h3" textStyle="t5Bold">
          {product.name}
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          한 상자 {formatPrice(product.price)} · 수량 ${product.minOrderQuantity}~${product.maxOrderQuantity}개
        </Text>
      </div>
    </div>
  )
}

function CoffeeIcon() {
  return (
    <div className="coffee-thumbnail" aria-hidden="true">
      <svg viewBox="0 0 96 96" fill="none">
        <rect x="22" y="16" width="52" height="67" rx="6" fill="currentColor" opacity="0.16" />
        <path d="M27 17h42l4 61a4 4 0 0 1-4 4H27a4 4 0 0 1-4-4l4-61Z" fill="currentColor" opacity="0.55" />
        <path d="M28 20h40M28 24h40" stroke="currentColor" strokeWidth="2" />
        <rect x="29" y="36" width="38" height="30" rx="2" fill="var(--seed-color-bg-layer-default)" />
        <path d="M44 44c-5 3-6 10-2 12 5 3 12-5 9-10-2-3-5-3-7-2Z" fill="currentColor" />
        <path d="m44 53 5-6" stroke="var(--seed-color-bg-layer-default)" strokeWidth="1.5" />
        <path d="M38 61h20" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  )
}
