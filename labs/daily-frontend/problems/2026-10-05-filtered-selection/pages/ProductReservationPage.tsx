import { Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { products } from '../features/productReservation/apis/products'
import { ProductList } from '../features/productReservation/components/ProductList'
import { ProductListFilter } from '../features/productReservation/components/ProductListFilter'
import { ReservationProductResult } from '../features/productReservation/components/ReservationProductResult'
import { ReservationSummary } from '../features/productReservation/components/ReservationSummary'
import { useProductReservation } from '../features/productReservation/hooks/useProductReservation'
import { getHiddenSelectedProducts, getVisibleProducts } from '../features/productReservation/models/products'
import type { ReserveProducts } from '../features/productReservation/types/reservation'
import './ProductReservationPage.css'

export function ProductReservationPage({ reserveProducts }: { reserveProducts: ReserveProducts }) {
  const {
    totalPrice,
    selectedProducts,
    selectedFilter,
    selectedIds,
    submitDisabled,
    isSubmitting,
    result,
    handleProductSelectionChange,
    handleFilterChange,
    handleSubmit,
  } = useProductReservation(reserveProducts)

  const hiddenSelectedProductsCount = getHiddenSelectedProducts(products, selectedIds, selectedFilter).length
  const visibleProducts = getVisibleProducts(products, selectedFilter)

  return (
    <VStack as="article" className="filtered-selection" gap="x5" px="x5" py="x6" width="full" aria-labelledby="reservation-heading">
      <VStack as="header" gap="x2">
        <Text as="h2" id="reservation-heading" textStyle="t7Bold">
          관심 상품 예약
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          함께 받을 상품을 고르고 예약해 주세요.
        </Text>
      </VStack>

      <ProductListFilter value={selectedFilter} disabled={isSubmitting} onValueChange={handleFilterChange} />

      <form onSubmit={handleSubmit}>
        <VStack gap="x5" width="full">
          <ProductList
            products={visibleProducts}
            selectedIds={selectedIds}
            disabled={isSubmitting}
            onSelectionChange={(productId, checked) => {
              handleProductSelectionChange(productId, checked)
            }}
          />

          <ReservationSummary
            totalPrice={totalPrice}
            selectedProducts={selectedProducts}
            hiddenSelectedProductsCount={hiddenSelectedProductsCount}
          />

          {result !== null && <ReservationProductResult result={result} />}

          <ActionButton
            variant="brandSolid"
            size="large"
            loading={isSubmitting}
            disabled={submitDisabled}
            aria-label={isSubmitting ? '예약 중' : '선택 상품 예약하기'}
            type="submit"
          >
            {isSubmitting ? '예약 중' : '선택 상품 예약하기'}
          </ActionButton>
          <Text as="p" textStyle="t3Regular" color="fg.neutralSubtle">
            {isSubmitting
              ? '선택한 상품을 예약하고 있어요. 잠시 기다려 주세요.'
              : '연습용 API는 첫 예약만 실패해요. 같은 선택으로 다시 시도해 보세요.'}
          </Text>
        </VStack>
      </form>
    </VStack>
  )
}
