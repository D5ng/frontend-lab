import { Text, VStack } from '@seed-design/react'
import { formatPrice } from '../../../utils/formatPrice'
import type { Product } from '../types/reservation'

interface Props {
  totalPrice: number
  selectedProducts: Product[]
  hiddenSelectedProductsCount: number
}

export function ReservationSummary({ totalPrice, selectedProducts, hiddenSelectedProductsCount }: Props) {
  return (
    <VStack gap="x2" aria-label="예약 요약" role="region" aria-live="polite">
      <Text textStyle="t5Bold">선택 {selectedProducts.length}개</Text>
      <Text textStyle="t4Regular">상품 금액 {formatPrice(totalPrice)}</Text>
      <Text textStyle="t3Regular" color="fg.neutralSubtle">
        {selectedProducts.map((product) => product.title).join(', ') || '예약할 상품을 선택해 주세요.'}
      </Text>
      {hiddenSelectedProductsCount > 0 && (
        <Text textStyle="t3Regular" color="fg.neutralSubtle">
          현재 목록에서 숨겨진 선택 상품 {hiddenSelectedProductsCount}
          개도 예약에 포함돼요.
        </Text>
      )}
    </VStack>
  )
}
