import { Text } from '@seed-design/react'
import { Avatar, AvatarStack } from 'seed-design/ui/avatar'
import type { LikeNotification } from '../api'
import { formatTimeAgo } from '../time'
import { NotificationCard } from './NotificationCard'

interface Props {
  notification: LikeNotification
  now: string
}

export function LikeNotificationItem({ notification, now }: Props) {
  const firstActor = notification.actors[0]
  const avatarActors = notification.actors.slice(0, 3)
  const otherActorCount = notification.actors.length - 1

  return (
    <NotificationCard
      avatar={
        <AvatarStack size="24">
          {avatarActors.map((actor, index) => (
            <Avatar key={index} fallback={actor.name[0]} src={actor.profileImageUrl} />
          ))}
        </AvatarStack>
      }
      message={
        <Text textStyle="t5Regular">
          <Text as="strong" fontWeight="bold">
            {firstActor.name}
          </Text>
          {otherActorCount === 0 ? `님이 내 글을 좋아해요` : `님 외 ${otherActorCount}명이 내 글을 좋아해요`}
        </Text>
      }
      description={{
        text: notification.postTitle,
      }}
      timeAgo={formatTimeAgo(notification.createdAt, now)}
      read={notification.read}
    />
  )
}
