import { HStack, Text, VStack } from '@seed-design/react'
import type { ActivityComponentType } from '@stackflow/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { AppBar, AppBarMain } from 'seed-design/ui/app-bar'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'

export const SalonDone: ActivityComponentType = () => {
  return (
    <AppScreen>
      <AppBar>
        <AppBarMain title="예약 완료" />
      </AppBar>
      <AppScreenContent>
        <VStack minHeight="full">
          <VStack flexGrow gap="x6" px="x5" py="x8">
            <VStack gap="x2">
              <Text as="h2" textStyle="t7Bold">
                예약했어요
              </Text>
              <Text textStyle="t4Regular" color="fg.neutralSubtle">
                시간에 맞춰 가게로 와 주세요. 결제는 가게에서 해요.
              </Text>
            </VStack>

            <VStack gap="x3" p="x4" bg="bg.neutralWeak" borderRadius="r3">
              <HStack justifyContent="space-between">
                <Text color="fg.neutralSubtle">예약 번호</Text>
                <Text>b-123</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color="fg.neutralSubtle">디자이너</Text>
                <Text>하늘 원장</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color="fg.neutralSubtle">시술</Text>
                <Text>커트, 기본 염색</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color="fg.neutralSubtle">일시</Text>
                <Text>11월 7일 (토) 15:00 ~ 17:00</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color="fg.neutralSubtle">금액</Text>
                <Text textStyle="t5Bold">90,000원</Text>
              </HStack>
            </VStack>
          </VStack>

          <VStack px="x5" pb="x5">
            <ActionButton variant="neutralWeak" size="large" onClick={() => {}}>
              확인
            </ActionButton>
          </VStack>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  )
}
