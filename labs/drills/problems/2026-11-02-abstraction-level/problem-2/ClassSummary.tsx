import { Text, VStack } from '@seed-design/react'
import type { GymClass } from './api'
import { formatDateTime } from './time'

type ClassSummaryProps = {
  gymClass: GymClass
}

export function ClassSummary({ gymClass }: ClassSummaryProps) {
  return (
    <VStack gap="x1_5" px="x5">
      <Text as="h2" textStyle="t7Bold">
        {gymClass.name}
      </Text>
      <Text textStyle="t4Regular" color="fg.neutralMuted">
        {formatDateTime(gymClass.startsAt)} · {gymClass.durationMinutes}분
      </Text>
      <Text textStyle="t4Regular" color="fg.neutralMuted">
        {gymClass.studioName} · {gymClass.room}
      </Text>
    </VStack>
  )
}
