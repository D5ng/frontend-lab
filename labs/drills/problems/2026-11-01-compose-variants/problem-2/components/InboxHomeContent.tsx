import { VStack } from '@seed-design/react'
import type { InboxResponse } from '../api'
import { CommentNotificationItem } from './CommentNotificationItem'
import { InviteNotificationItem } from './InviteNotificationItem'
import { LikeNotificationItem } from './LikeNotificationItem'

export function InboxHomeContent({ notifications, now }: InboxResponse) {
  return (
    <VStack as="ul">
      {notifications.map((notification) => {
        if (notification.type === 'comment') {
          return <CommentNotificationItem key={notification.id} notification={notification} now={now} />
        }

        if (notification.type === 'like') {
          return <LikeNotificationItem key={notification.id} notification={notification} now={now} />
        }

        return <InviteNotificationItem key={notification.id} notification={notification} now={now} />
      })}
    </VStack>
  )
}
