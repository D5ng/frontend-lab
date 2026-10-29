import { Text, VStack } from '@seed-design/react'
import { type ActivityComponentType, useActions } from '@stackflow/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { AppBar, AppBarMain } from 'seed-design/ui/app-bar'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'

type SavingsDoneParams = {
  monthlyAmount: number
  months: number
}

export const SavingsDone: ActivityComponentType<SavingsDoneParams> = ({ params }) => {
  const { pop } = useActions()

  return (
    <AppScreen>
      <AppBar>
        <AppBarMain title="가입 완료" />
      </AppBar>
      <AppScreenContent>
        <VStack minHeight="full">
          <VStack flexGrow gap="x2" px="x5" py="x8">
            <Text as="h2" textStyle="t7Bold">
              적금에 가입했어요
            </Text>
            <Text textStyle="t4Regular" color="fg.neutralSubtle">
              매달 {params.monthlyAmount.toLocaleString('ko-KR')}원씩 {params.months}개월 동안 모아요. 만기가 되면 알려 드릴게요.
            </Text>
          </VStack>
          <VStack px="x5" pb="x5">
            <ActionButton variant="neutralWeak" size="large" onClick={() => pop()}>
              확인
            </ActionButton>
          </VStack>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  )
}
