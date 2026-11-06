import { IconCalendarLine } from '@karrotmarket/react-monochrome-icon'
import { Box, Icon, Text, VStack } from '@seed-design/react'
import { formatSchedule } from '../../problem-3/schedule'
import type { ScheduleChangedNotification } from '../api'
import { formatTimeAgo } from '../time'
import { NotificationCard } from './NotificationCard'

interface Props {
  notification: ScheduleChangedNotification
  now: string
}

export function ScheduleChangedNotificationItem({ notification, now }: Props) {
  return (
    <NotificationCard
      avatar={
        <Box
          width="x10"
          height="x10"
          borderRadius="full"
          bg="bg.neutralWeak"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          <Icon svg={<IconCalendarLine />} size="x5" color="fg.neutralMuted" />
        </Box>
      }
      message={
        <Text textStyle="t5Regular">
          <Text as="strong" fontWeight="bold">
            {notification.group.name}
          </Text>{' '}
          모임 일정이 바뀌었어요
        </Text>
      }
      description={
        <VStack gap="x0_5">
          <Text textStyle="t4Regular" color="fg.neutralSubtle">
            <del>{formatSchedule(notification.before)}</del>
          </Text>
          <Text textStyle="t4Bold" color="fg.neutral">
            {formatSchedule(notification.after)}
          </Text>
        </VStack>
      }
      timeAgo={formatTimeAgo(notification.createdAt, now)}
      read={notification.read}
    />
  )
}
