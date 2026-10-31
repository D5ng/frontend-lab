import { Skeleton, Text, VStack } from '@seed-design/react'
import { type ActivityComponentType, useActions } from '@stackflow/react'
import { useEffect, useState } from 'react'
import { ActionButton } from 'seed-design/ui/action-button'
import { AppBar, AppBarMain } from 'seed-design/ui/app-bar'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'
import { Callout } from 'seed-design/ui/callout'
import { Chip } from 'seed-design/ui/chip'
import { List } from 'seed-design/ui/list'
import { fetchRooms, type RoomSummaryResponse } from './api'
import { RoomListItem } from './RoomListItem'

type SortOrder = 'latest' | 'monthlyCost'

export const RoomList: ActivityComponentType = () => {
  const { push } = useActions()
  const [rooms, setRooms] = useState<RoomSummaryResponse[] | null>(null)
  const [loadFailed, setLoadFailed] = useState(false)
  const [reloadCount, setReloadCount] = useState(0)
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest')

  useEffect(() => {
    let ignore = false
    fetchRooms()
      .then((data) => {
        if (!ignore) setRooms(data.rooms)
      })
      .catch(() => {
        if (!ignore) setLoadFailed(true)
      })
    return () => {
      ignore = true
    }
  }, [reloadCount])

  function handleReload() {
    setLoadFailed(false)
    setReloadCount((count) => count + 1)
  }

  const sortedRooms =
    rooms && sortOrder === 'monthlyCost'
      ? [...rooms].sort((a, b) => a.monthly_rent + a.maintenance_fee - (b.monthly_rent + b.maintenance_fee))
      : rooms

  return (
    <AppScreen>
      <AppBar>
        <AppBarMain title="원룸 찾기" subtitle="망원동 · 월세" />
      </AppBar>
      <AppScreenContent>
        {loadFailed ? (
          <VStack gap="x4" px="x5" py="x6">
            <Callout tone="critical" description="방 목록을 불러오지 못했어요. 잠시 후 다시 불러와 주세요." />
            <ActionButton variant="neutralWeak" size="medium" onClick={handleReload}>
              다시 불러오기
            </ActionButton>
          </VStack>
        ) : !sortedRooms ? (
          <VStack gap="x5" px="x5" py="x6" aria-busy="true" aria-label="방 목록을 불러오는 중">
            <Skeleton height="x18" radius="8" />
            <Skeleton height="x18" radius="8" />
            <Skeleton height="x18" radius="8" />
          </VStack>
        ) : sortedRooms.length === 0 ? (
          <VStack gap="x2" px="x5" py="x10" alignItems="center">
            <Text textStyle="t5Bold">아직 이 동네에 올라온 방이 없어요</Text>
            <Text color="fg.neutralSubtle">새 방은 보통 아침에 올라와요. 내일 다시 확인해 주세요.</Text>
          </VStack>
        ) : (
          <VStack gap="x2" py="x4">
            <Chip.RadioRoot
              aria-label="정렬"
              value={sortOrder}
              onValueChange={(value) => setSortOrder(value as SortOrder)}
              style={{ display: 'flex', gap: 'var(--seed-dimension-x2)', padding: '0 var(--seed-dimension-x5)' }}
            >
              <Chip.RadioItem value="latest" size="small" variant="outlineWeak">
                <Chip.Label>최근 올라온 순</Chip.Label>
              </Chip.RadioItem>
              <Chip.RadioItem value="monthlyCost" size="small" variant="outlineWeak">
                <Chip.Label>매달 드는 돈 적은 순</Chip.Label>
              </Chip.RadioItem>
            </Chip.RadioRoot>
            <List>
              {sortedRooms.map((room) => (
                <RoomListItem key={room.room_id} room={room} onClick={() => push('RoomDetail', { roomId: room.room_id })} />
              ))}
            </List>
          </VStack>
        )}
      </AppScreenContent>
    </AppScreen>
  )
}
