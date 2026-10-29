import { SegmentedControl } from '@seed-design/react'
import type { ProductFilter } from '../types/reservation'

interface Props {
  value: ProductFilter
  disabled: boolean
  onValueChange: (value: ProductFilter) => void
}

export function ProductListFilter({ value, disabled, onValueChange }: Props) {
  return (
    <SegmentedControl.Root
      aria-label="상품 보기"
      value={value}
      disabled={disabled}
      onValueChange={(value) => {
        if (!isProductFilter(value)) {
          return
        }

        onValueChange(value)
      }}
      className="reservation-filter"
    >
      <SegmentedControl.Item value="all">
        전체
        <SegmentedControl.ItemHiddenInput />
      </SegmentedControl.Item>
      <SegmentedControl.Item value="free">
        나눔
        <SegmentedControl.ItemHiddenInput />
      </SegmentedControl.Item>
      <SegmentedControl.Indicator />
    </SegmentedControl.Root>
  )
}

function isProductFilter(value: string): value is ProductFilter {
  return value === 'all' || value === 'free'
}
