import { HStack, Skeleton, Text, VStack } from '@seed-design/react'
import { seedPlugin } from '@seed-design/stackflow'
import { basicRendererPlugin } from '@stackflow/plugin-renderer-basic'
import { type ActivityComponentType, stackflow } from '@stackflow/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { AppBar, AppBarMain } from 'seed-design/ui/app-bar'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'
import { Callout } from 'seed-design/ui/callout'
import { InboxHomeContent } from './components/InboxHomeContent'
import { useInbox } from './hooks/useInbox'

// 화면만 그려 두었다. 값은 handlers.ts의 응답을 그대로 옮겨 적은 예시이고, 동작은 하나도 없다.
// 불러오기, 답하기, 컴포넌트와 파일을 어떻게 나눌지는 problem.md를 보고 직접 정한다.
// 사람 사진은 비워 두어 이름 첫 글자가 보인다. 응답의 profileImageUrl을 넣으면 사진이 나온다.
const InboxHome: ActivityComponentType = () => {
  const { inboxState, reload } = useInbox()

  return (
    <AppScreen>
      <AppBar>
        <AppBarMain title="알림" />
      </AppBar>
      <AppScreenContent>
        {inboxState.status === 'pending' ? (
          <VStack gap="x5" px="x5" py="x4" aria-busy="true" aria-label="알림을 불러오는 중">
            <HStack gap="x3">
              <Skeleton width="x10" height="x10" radius="full" />
              <VStack gap="x2" flexGrow={1}>
                <Skeleton width="full" height="x4" radius="8" />
                <Skeleton width="x16" height="x3" radius="8" />
              </VStack>
            </HStack>
            <HStack gap="x3">
              <Skeleton width="x10" height="x10" radius="full" />
              <VStack gap="x2" flexGrow={1}>
                <Skeleton width="full" height="x4" radius="8" />
                <Skeleton width="x16" height="x3" radius="8" />
              </VStack>
            </HStack>
          </VStack>
        ) : inboxState.status === 'error' ? (
          <VStack gap="x4" px="x5" py="x6">
            <Callout tone="critical" description="알림을 불러오지 못했어요. 잠시 후 다시 불러와 주세요." />
            <ActionButton variant="neutralWeak" size="medium" onClick={reload}>
              다시 불러오기
            </ActionButton>
          </VStack>
        ) : inboxState.data.notifications.length === 0 ? (
          <VStack px="x5" py="x10" alignItems="center">
            <Text textStyle="t5Bold">아직 받은 알림이 없어요</Text>
          </VStack>
        ) : (
          <InboxHomeContent notifications={inboxState.data.notifications} now={inboxState.data.now} />
        )}
      </AppScreenContent>
    </AppScreen>
  )
}

const { Stack } = stackflow({
  activities: { InboxHome },
  initialActivity: () => 'InboxHome',
  transitionDuration: 350,
  plugins: [basicRendererPlugin(), seedPlugin({ theme: 'cupertino' })],
})

export function Problem() {
  return <Stack />
}
