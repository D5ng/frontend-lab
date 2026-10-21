import { Box, Text, VStack } from '@seed-design/react'

interface Props {
  savedMemo: string
}

export function SavedMemo({ savedMemo }: Props) {
  return (
    <Box as="section" role="region" aria-label="마지막 저장된 메모" p="x4" bg="bg.neutralWeak" borderRadius="r3">
      <VStack gap="x2">
        <Text as="h3" textStyle="t4Bold">
          마지막 저장된 메모
        </Text>
        <Text as="p" textStyle="t4Regular" whiteSpace="pre-wrap">
          {savedMemo === '' ? '저장된 메모가 없어요.' : savedMemo}
        </Text>
      </VStack>
    </Box>
  )
}
