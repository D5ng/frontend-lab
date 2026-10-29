import { Checkbox, List } from '@seed-design/react'
import { formatPrice } from '../../../utils/formatPrice'
import { isFreeProduct } from '../models/products'
import type { Product } from '../types/reservation'

interface Props {
  products: Product[]
  selectedIds: Product['id'][]
  disabled: boolean
  onSelectionChange: (productId: Product['id'], checked: boolean) => void
}

export function ProductList({ products, selectedIds, disabled, onSelectionChange }: Props) {
  return (
    <List.Root as="div" role="group" aria-label="예약할 상품" width="full">
      {products.map((product) => (
        <List.Item asChild key={product.id}>
          <Checkbox.Root.Primitive
            checked={selectedIds.includes(product.id)}
            disabled={disabled}
            onCheckedChange={(checked) => onSelectionChange(product.id, checked)}
          >
            <List.Content>
              <List.Title>{product.title}</List.Title>
              <List.Detail>{isFreeProduct(product) ? '나눔' : formatPrice(product.price)} · 성수동</List.Detail>
            </List.Content>
            <List.Suffix>
              <Checkbox.Control tone="neutral" size="large" variant="ghost">
                <Checkbox.Indicator
                  checked={
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="m5 12 4 4L19 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                />
              </Checkbox.Control>
            </List.Suffix>
            <Checkbox.HiddenInput aria-label={product.title} />
          </Checkbox.Root.Primitive>
        </List.Item>
      ))}
    </List.Root>
  )
}
