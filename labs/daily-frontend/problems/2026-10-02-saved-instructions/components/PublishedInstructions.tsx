import { Box, Text, VStack } from '@seed-design/react'

interface Props {
  publishedText: string
}

/**
 * 현재 공개된 안내의 책임을 맡는 컴포넌트
 */
export function PublishedInstructions({ publishedText }: Props) {
  return (
    <Box as="section" aria-label="현재 공개된 안내" bg="bg.neutralWeak" p="x4" borderRadius="r3">
      <VStack gap="x2">
        <Text as="h3" textStyle="t3Bold">
          현재 공개된 안내
        </Text>
        <Text as="p" textStyle="t4Regular" whiteSpace="pre-wrap">
          {publishedText}
        </Text>
      </VStack>
    </Box>
  )
}
