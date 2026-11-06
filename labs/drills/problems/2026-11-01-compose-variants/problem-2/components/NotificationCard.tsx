import { Box, HStack, Text, VisuallyHidden, VStack } from '@seed-design/react'
import type { ReactNode } from 'react'

interface Props {
  avatar: ReactNode
  message: ReactNode
  description: ReactNode
  timeAgo: string
  read: boolean
  action?: ReactNode
}

export function NotificationCard({ message, description, timeAgo, read, avatar, action }: Props) {
  return (
    <Box as="li" px="x5" py="x4" bg={read ? undefined : 'bg.brandWeak'}>
      <HStack gap="x3" alignItems="flex-start">
        {avatar}
        <VStack gap="x1" flexGrow={1}>
          {message}
          {description}
          <Text textStyle="t3Regular" color="fg.neutralSubtle">
            {timeAgo}
          </Text>
          {action}
        </VStack>
      </HStack>
      {!read && <VisuallyHidden>읽지 않음</VisuallyHidden>}
    </Box>
  )
}
