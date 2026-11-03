import { Badge, Text, VStack } from '@seed-design/react'
import { ContentPlaceholder } from 'seed-design/ui/content-placeholder'
import { ListButtonItem } from 'seed-design/ui/list'
import type { Room } from '../../../room/room'
import { formatWithComma } from '../../../shared/utils/format'

type RoomListItemProps = {
  room: Room
  onSelect: () => void
}

export function RoomListItem({ room, onSelect }: RoomListItemProps) {
  const { title, deposit, monthlyRent, maintenanceFee, pyeong, floor, availableFrom } = room

  return (
    <ListButtonItem
      alignItems="flex-start"
      prefix={
        <ContentPlaceholder type="realty" aria-hidden="true" style={{ width: 72, height: 72, borderRadius: 'var(--seed-radius-r2)' }} />
      }
      title={`월세 ${formatWithComma(deposit)}/${monthlyRent}`}
      detail={
        <VStack gap="x1">
          <Text>{title}</Text>
          <Text color="fg.neutralSubtle">
            관리비 {maintenanceFee}만 · {pyeong}평 · {floor}층
          </Text>
        </VStack>
      }
      suffix={
        availableFrom === null && (
          <Badge variant="weak" tone="brand">
            바로 입주
          </Badge>
        )
      }
      onClick={onSelect}
    />
  )
}
