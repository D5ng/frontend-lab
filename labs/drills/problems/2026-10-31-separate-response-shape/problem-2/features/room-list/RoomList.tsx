import { Skeleton, Text, VStack } from '@seed-design/react'
import type { ActivityComponentType } from '@stackflow/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { AppBar, AppBarMain } from 'seed-design/ui/app-bar'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'
import { Callout } from 'seed-design/ui/callout'
import { SortableRoomList } from './components/SortableRoomList'
import { useRooms } from './hooks/useRooms'

export const RoomList: ActivityComponentType = () => {
  const { data: rooms, isLoading, hasError, reload } = useRooms()

  return (
    <AppScreen>
      <AppBar>
        <AppBarMain title="원룸 찾기" subtitle="망원동 · 월세" />
      </AppBar>
      <AppScreenContent>
        {hasError ? (
          <RoomListError onReload={reload} />
        ) : isLoading ? (
          <RoomListSkeleton />
        ) : rooms.length === 0 ? (
          <RoomListEmpty />
        ) : (
          <SortableRoomList rooms={rooms} />
        )}
      </AppScreenContent>
    </AppScreen>
  )
}

function RoomListError({ onReload }: { onReload: () => void }) {
  return (
    <VStack gap="x4" px="x5" py="x6">
      <Callout tone="critical" description="방 목록을 불러오지 못했어요. 잠시 후 다시 불러와 주세요." />
      <ActionButton variant="neutralWeak" size="medium" onClick={onReload}>
        다시 불러오기
      </ActionButton>
    </VStack>
  )
}

function RoomListSkeleton() {
  return (
    <VStack gap="x5" px="x5" py="x6" aria-busy="true" aria-label="방 목록을 불러오는 중">
      <Skeleton height="x18" radius="8" />
      <Skeleton height="x18" radius="8" />
      <Skeleton height="x18" radius="8" />
    </VStack>
  )
}

function RoomListEmpty() {
  return (
    <VStack gap="x2" px="x5" py="x10" alignItems="center">
      <Text textStyle="t5Bold">아직 이 동네에 올라온 방이 없어요</Text>
      <Text color="fg.neutralSubtle">새 방은 보통 아침에 올라와요. 내일 다시 확인해 주세요.</Text>
    </VStack>
  )
}
