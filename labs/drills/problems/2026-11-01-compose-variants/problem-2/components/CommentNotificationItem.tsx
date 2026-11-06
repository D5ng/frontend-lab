import { IconHeartLine } from '@karrotmarket/react-monochrome-icon'
import { Box, PrefixIcon, Text } from '@seed-design/react'
import { useState } from 'react'
import { Avatar } from 'seed-design/ui/avatar'
import { ReactionButton } from 'seed-design/ui/reaction-button'
import { type CommentNotification, updateCommentLike } from '../api'
import { formatTimeAgo } from '../time'
import { NotificationCard } from './NotificationCard'

interface Props {
  notification: CommentNotification
  now: string
}

export function CommentNotificationItem({ notification, now }: Props) {
  const [liked, setLiked] = useState(notification.comment.likedByMe)

  const updateLike = async (nextLiked: boolean) => {
    const previousLiked = liked
    setLiked(nextLiked)
    try {
      await updateCommentLike(notification.comment.id, nextLiked)
    } catch {
      console.error('좋아요 업데이트 도중에 에러가 발생했어요.')
      setLiked(previousLiked)
    }
  }

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
      description={
        <Text textStyle="t4Regular" color="fg.neutralMuted" maxLines={2}>
          {notification.comment.text}
        </Text>
      }
      timeAgo={formatTimeAgo(notification.createdAt, now)}
      read={notification.read}
      action={
        <Box pt="x2">
          <ReactionButton size="xsmall" pressed={liked} onPressedChange={(pressed) => updateLike(pressed)}>
            <PrefixIcon svg={<IconHeartLine />} />
            좋아요
          </ReactionButton>
        </Box>
      }
    />
  )
}
