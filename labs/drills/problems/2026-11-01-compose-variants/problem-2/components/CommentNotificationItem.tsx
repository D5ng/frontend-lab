import { Text } from '@seed-design/react'
import { Avatar } from 'seed-design/ui/avatar'
import type { CommentNotification } from '../api'
import { formatTimeAgo } from '../time'
import { NotificationCard } from './NotificationCard'

interface Props {
  notification: CommentNotification
  now: string
}

export function CommentNotificationItem({ notification, now }: Props) {
  return (
    <NotificationCard
      avatar={<Avatar size="42" fallback={notification.actor.name[0]} src={notification.actor.profileImageUrl} />}
      message={
        <Text textStyle="t5Regular">
          <Text as="strong" fontWeight="bold">
            {notification.actor.name}
          </Text>
          님이 내 글에 댓글을 남겼어요
        </Text>
      }
      description={{
        text: notification.comment.text,
        maxLines: 2,
      }}
      timeAgo={formatTimeAgo(notification.createdAt, now)}
      read={notification.read}
    />
  )
}
