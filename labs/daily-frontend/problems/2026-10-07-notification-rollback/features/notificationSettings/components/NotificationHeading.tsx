import { IconBellLine } from '@karrotmarket/react-monochrome-icon'
import { Badge, Box, HStack, Text, VStack } from '@seed-design/react'

export function NotificationHeading() {
  return (
    <VStack as="header" gap="x3" px="x5">
      <HStack gap="x2" align="center">
        <Box className="notification-plan__icon" bg="bg.brandWeak" borderRadius="r3" p="x3" aria-hidden="true">
          <IconBellLine width={24} height={24} />
        </Box>
        <Badge variant="weak" tone="brand" size="medium">
          관심 상품 소식
        </Badge>
      </HStack>
      <Text as="h2" textStyle="t8Bold">
        기다리던 가격,
        <br />
        소식으로 받아요
      </Text>
      <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
        관심 있는 상품을 고르고
        <br />
        가격이 내려갈 때 알려드릴게요.
      </Text>
    </VStack>
  )
}
