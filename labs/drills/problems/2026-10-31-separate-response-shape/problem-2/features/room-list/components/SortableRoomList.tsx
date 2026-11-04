import { VStack } from '@seed-design/react'
import { useActions } from '@stackflow/react'
import { useState } from 'react'
import { Chip } from 'seed-design/ui/chip'
import { List } from 'seed-design/ui/list'
import type { Room } from '../../../room/room'
import { type SortOrder, sortRooms } from '../utils/sortRooms'
import { RoomListItem } from './RoomListItem'

interface Props {
  rooms: Room[]
}

export function SortableRoomList({ rooms }: Props) {
  const { push } = useActions()

  const [sortOrder, setSortOrder] = useState<SortOrder>('latest')

  const sortedRooms = sortRooms(rooms, sortOrder)

  const goToDetail = (roomId: number) => push('RoomDetail', { roomId: roomId })

  return (
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
          <RoomListItem key={room.id} room={room} onSelect={() => goToDetail(room.id)} />
        ))}
      </List>
    </VStack>
  )
}
