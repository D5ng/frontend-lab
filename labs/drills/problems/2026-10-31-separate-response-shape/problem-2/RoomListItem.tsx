import { Badge, Text, VStack } from '@seed-design/react'
import { ContentPlaceholder } from 'seed-design/ui/content-placeholder'
import { ListButtonItem } from 'seed-design/ui/list'
import type { RoomSummaryResponse } from './api'

type RoomListItemProps = {
  room: RoomSummaryResponse
  onClick: () => void
}

export function RoomListItem({ room, onClick }: RoomListItemProps) {
  const [floor] = room.floor.split('/')
  const pyeong = Math.round(room.area_m2 / 3.3058)

  return (
    <ListButtonItem
      alignItems="flex-start"
      prefix={
        <ContentPlaceholder type="realty" aria-hidden="true" style={{ width: 72, height: 72, borderRadius: 'var(--seed-radius-r2)' }} />
      }
      title={`월세 ${room.deposit.toLocaleString('ko-KR')}/${room.monthly_rent}`}
      detail={
        <VStack gap="x1">
          <Text>{room.title}</Text>
          <Text color="fg.neutralSubtle">
            관리비 {room.maintenance_fee}만 · {pyeong}평 · {floor}층
          </Text>
        </VStack>
      }
      suffix={
        room.available_from === null && (
          <Badge variant="weak" tone="brand">
            바로 입주
          </Badge>
        )
      }
      onClick={onClick}
    />
  )
}
