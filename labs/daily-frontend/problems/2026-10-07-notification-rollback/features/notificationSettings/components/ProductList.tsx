import { IconCheckmarkFatFill } from '@karrotmarket/react-monochrome-icon'
import { Checkbox, Text, VStack } from '@seed-design/react'
import { List, ListCheckItem } from 'seed-design/ui/list'
import { isSelected } from '../models/product'
import type { Product } from '../types/notification'

interface Props {
  visibleProducts: Product[]
  selectedProductIds: Product['id'][]
  saving: boolean
  onSelectionChange: (selected: boolean, productId: Product['id']) => void
}

export function ProductList({ visibleProducts, selectedProductIds, saving, onSelectionChange }: Props) {
  return (
    <List as="div" width="full" aria-label="관심 상품 목록">
      {visibleProducts.map((product) => (
        <ListCheckItem
          key={product.id}
          title={product.title}
          detail={
            <VStack gap="x1" py="x1">
              <Text textStyle="t3Regular" color="fg.neutralSubtle">
                {product.neighborhood}
                {!product.available && ' · 거래완료'}
              </Text>
              <Text textStyle="t4Bold">{product.price.toLocaleString('ko-KR')}원</Text>
            </VStack>
          }
          checked={isSelected(selectedProductIds, product.id)}
          disabled={!product.available || saving}
          inputProps={{ 'aria-label': `${product.title} 알림 선택` }}
          onCheckedChange={(checked) => onSelectionChange(checked, product.id)}
          suffix={
            <Checkbox.Control size="large" tone="brand">
              <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
            </Checkbox.Control>
          }
        />
      ))}
    </List>
  )
}
