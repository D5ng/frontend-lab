import { IconMagnifyingglassLine } from '@karrotmarket/react-monochrome-icon'
import { Box, HStack, Text, VStack } from '@seed-design/react'
import { TextField, TextFieldInput } from 'seed-design/ui/text-field'
import type { Product } from '../types/notification'
import { ProductList } from './ProductList'
import { ProductListEmpty } from './ProductListEmpty'
import { ProductListError } from './ProductListError'
import { ProductListLoading } from './ProductListLoading'

interface Props {
  visibleProducts: Product[]
  totalProductCount: number
  selectedProductIds: Product['id'][]
  query: string
  loading: boolean
  loadError: boolean
  disabled: boolean
  saving: boolean
  onQueryChange: (value: string) => void
  onRetryProducts: () => void
  onSelectionChange: (selected: boolean, productId: Product['id']) => void
}

export function ProductSelection({
  visibleProducts,
  totalProductCount,
  selectedProductIds,
  query,
  loading,
  loadError,
  disabled,
  saving,
  onQueryChange,
  onRetryProducts,
  onSelectionChange,
}: Props) {
  return (
    <VStack as="section" aria-label="상품 선택" gap="x4" width="full">
      <VStack px="x5" gap="x4" width="full">
        <HStack justify="space-between" align="center">
          <Text as="h3" textStyle="t5Bold">
            1. 어떤 상품이 궁금하세요?
          </Text>
          <Text textStyle="t3Bold" color="fg.brand">
            {selectedProductIds.length}개 선택
          </Text>
        </HStack>
        <TextField
          label="관심 상품 검색"
          variant="underline"
          value={query}
          disabled={disabled}
          prefixIcon={<IconMagnifyingglassLine />}
          onValueChange={({ value }) => onQueryChange(value)}
        >
          <TextFieldInput placeholder="상품 이름으로 찾아보세요" />
        </TextField>
      </VStack>
      {loading ? (
        <ProductListLoading />
      ) : loadError ? (
        <ProductListError onRetryProducts={onRetryProducts} />
      ) : visibleProducts.length === 0 ? (
        <ProductListEmpty query={query} totalProductCount={totalProductCount} saving={saving} onQueryChange={onQueryChange} />
      ) : (
        <ProductList
          visibleProducts={visibleProducts}
          selectedProductIds={selectedProductIds}
          saving={saving}
          onSelectionChange={onSelectionChange}
        />
      )}
      <Box px="x5">
        <Text as="p" textStyle="t3Regular" color="fg.neutralSubtle">
          검색 결과가 바뀌어도 고른 상품은 유지돼요. 거래완료 상품은 선택할 수 없어요.
        </Text>
      </Box>
    </VStack>
  )
}
