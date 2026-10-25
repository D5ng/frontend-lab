import { Text, VStack } from '@seed-design/react'
import type { LoadProducts } from '../features/cartStock/types/product'

export function CartStockPage({ loadProducts }: { loadProducts: LoadProducts }) {
  // 요구사항을 읽고 조회·상품별 수량·검증·합계를 직접 구현하세요.
  // 제공 골격은 아직 API를 호출하거나 수량과 결과를 관리하지 않습니다.
  void loadProducts
  return (
    <VStack as="article" gap="x6" px="x5" py="x6" width="full" aria-labelledby="cart-stock-heading">
      <VStack as="header" gap="x2">
        <Text as="h2" id="cart-stock-heading" textStyle="t7Bold">
          오늘 담을 상품
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          수량을 입력하고 현재 가격과 재고로 합계를 확인해 주세요.
        </Text>
      </VStack>
      <Text as="p" textStyle="t4Regular">
        문제 문서를 읽고 이 페이지를 완성해 주세요.
      </Text>
    </VStack>
  )
}
