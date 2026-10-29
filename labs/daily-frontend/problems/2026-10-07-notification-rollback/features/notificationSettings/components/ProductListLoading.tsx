import { Skeleton, Text, VStack } from '@seed-design/react'

export function ProductListLoading() {
  return (
    <VStack px="x5" gap="x3" width="full" role="status" aria-label="관심 상품을 불러오는 중">
      <Skeleton width="full" height="x12" />
      <Skeleton width="full" height="x12" />
      <Text textStyle="t3Regular" color="fg.neutralSubtle">
        관심 상품을 불러오고 있어요.
      </Text>
    </VStack>
  )
}
