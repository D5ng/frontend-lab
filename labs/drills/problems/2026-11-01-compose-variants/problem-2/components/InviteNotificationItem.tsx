import { Box, HStack, ImageFrame, Text } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import type { InviteNotification } from '../api'
import { useInvite } from '../hooks/useInvite'
import { formatTimeAgo } from '../time'
import { NotificationCard } from './NotificationCard'

interface Props {
  notification: InviteNotification
  now: string
}

export function InviteNotificationItem({ notification, now }: Props) {
  const { status, answering, error, respondToInvite } = useInvite(notification)

  return (
    <NotificationCard
      avatar={
        <Box width="x10" flexShrink={0}>
          <ImageFrame src={notification.group.imageUrl} alt={notification.group.name} ratio={1} />
        </Box>
      }
      message={
        <Text textStyle="t5Regular">
          <Text as="strong" fontWeight="bold">
            {notification.inviter.name}
          </Text>
          님이{' '}
          <Text as="strong" fontWeight="bold">
            {notification.group.name}
          </Text>
          에 초대했어요
        </Text>
      }
      description={
        <Text textStyle="t4Regular" color="fg.neutralMuted">
          멤버 {notification.group.memberCount}명
        </Text>
      }
      timeAgo={formatTimeAgo(notification.createdAt, now)}
      read={notification.read}
      action={
        <>
          {status === 'pending' ? (
            <HStack gap="x2" pt="x2">
              <ActionButton
                variant="neutralWeak"
                size="small"
                flexGrow={1}
                disabled={answering !== null}
                loading={answering === 'decline'}
                onClick={() => respondToInvite('decline')}
              >
                거절
              </ActionButton>
              <ActionButton
                variant="brandSolid"
                size="small"
                flexGrow={1}
                disabled={answering !== null}
                loading={answering === 'accept'}
                onClick={() => respondToInvite('accept')}
              >
                참여하기
              </ActionButton>
            </HStack>
          ) : status === 'declined' ? (
            <Box pt="x2">
              <Text textStyle="t4Regular" color="fg.neutralSubtle">
                초대를 거절했어요
              </Text>
            </Box>
          ) : (
            <Box pt="x2">
              <Text textStyle="t4Regular" color="fg.neutralSubtle">
                모임에 참여했어요
              </Text>
            </Box>
          )}
          {error && (
            <Text textStyle="t3Regular" color="fg.critical">
              답하지 못했어요. 다시 눌러 주세요.
            </Text>
          )}
        </>
      }
    />
  )
}
