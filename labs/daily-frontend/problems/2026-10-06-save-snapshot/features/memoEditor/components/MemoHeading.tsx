import { Text, VStack } from '@seed-design/react'

export function MemoHeading() {
  return (
    <VStack as="header" gap="x2">
      <Text textStyle="t3Regular" color="fg.neutralSubtle">
        나만 보는 거래 기록
      </Text>
      <Text as="h2" id="memo-heading" textStyle="t7Bold">
        거래 메모
      </Text>
      <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
        저장을 기다리는 동안에도 메모를 이어 쓸 수 있어요.
      </Text>
    </VStack>
  )
}
