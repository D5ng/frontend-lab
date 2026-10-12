import { Text, VStack } from '@seed-design/react'

/**
 * 거래 안내 상단 UI를 보여주는 컴포넌트
 */
export function InstructionsHeading() {
  return (
    <VStack gap="x2">
      <Text color="fg.neutralMuted" textStyle="t2Regular">
        나의 거래 설정
      </Text>
      <Text as="h2" textStyle="t7Bold">
        거래 안내 수정
      </Text>
      <Text color="fg.neutralMuted" textStyle="t3Regular">
        이웃에게 보여줄 만남 장소와 시간을 적어 주세요.
      </Text>
    </VStack>
  )
}
