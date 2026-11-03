import { Skeleton, VStack } from '@seed-design/react'
import type { ActivityComponentType } from '@stackflow/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from 'seed-design/ui/app-bar'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'
import { Callout } from 'seed-design/ui/callout'
import { RoomDetailContent } from './components/RoomDetailContent'
import { useRoom } from './hooks/useRoom'

type RoomDetailParams = {
  roomId: number
}

export const RoomDetail: ActivityComponentType<RoomDetailParams> = ({ params: { roomId } }) => {
  const { data: room, hasError, reload } = useRoom({ roomId })

  if (!room) {
    return (
      <AppScreen>
        <AppBar>
          <AppBarLeft>
            <AppBarBackButton />
          </AppBarLeft>
          <AppBarMain title="방 정보" />
        </AppBar>
        <AppScreenContent>
          {hasError ? (
            <VStack gap="x4" px="x5" py="x6">
              <Callout tone="critical" description="방 정보를 불러오지 못했어요. 잠시 후 다시 불러와 주세요." />
              <ActionButton variant="neutralWeak" size="medium" onClick={reload}>
                다시 불러오기
              </ActionButton>
            </VStack>
          ) : (
            <VStack gap="x5" px="x5" py="x6" aria-busy="true" aria-label="방 정보를 불러오는 중">
              <Skeleton height="x24" radius="8" />
              <Skeleton height="x10" radius="8" />
              <Skeleton height="x24" radius="8" />
            </VStack>
          )}
        </AppScreenContent>
      </AppScreen>
    )
  }

  return <RoomDetailContent {...room} />
}
