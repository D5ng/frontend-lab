import { Text, VStack } from '@seed-design/react'

export function NeighborhoodHeading() {
  return (
    <VStack as="header" gap="x2">
      <Text as="h2" textStyle="t7Bold">
        우리 동네 중고거래
      </Text>
      <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
        보고 싶은 동네를 골라 주세요.
      </Text>
    </VStack>
  )
}
