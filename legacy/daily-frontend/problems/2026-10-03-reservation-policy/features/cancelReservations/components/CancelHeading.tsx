import { Text, VStack } from '@seed-design/react'

export function CancelHeading() {
  return (
    <VStack as="header" gap="x2">
      <Text as="h2" textStyle="t7Bold">
        예약 취소
      </Text>
      <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
        취소할 예약을 고르고 환불 금액을 확인해 주세요.
      </Text>
    </VStack>
  )
}
