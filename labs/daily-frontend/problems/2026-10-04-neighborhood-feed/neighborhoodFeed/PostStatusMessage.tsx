import { Callout, Text, VStack } from '@seed-design/react'
import { ProgressCircle } from 'seed-design/ui/progress-circle'

interface Props {
  isLoading: boolean
  error: string
  postCount: number
}

export function PostStatusMessage({ isLoading, error, postCount }: Props) {
  if (isLoading) {
    return (
      <VStack gap="x3" align="center" py="x6">
        <ProgressCircle aria-label="게시글 불러오는 중" />
        <Text>게시글을 불러오고 있어요.</Text>
      </VStack>
    )
  }

  if (error) {
    return (
      <Callout.Root tone="critical">
        <Callout.Content>
          <Callout.Description>{error}</Callout.Description>
        </Callout.Content>
      </Callout.Root>
    )
  }

  if (postCount === 0) {
    return (
      <Callout.Root tone="neutral">
        <Callout.Content>
          <Callout.Description>아직 게시글이 없어요. 다른 동네를 골라 주세요.</Callout.Description>
        </Callout.Content>
      </Callout.Root>
    )
  }

  return (
    <Text textStyle="t4Regular" color="fg.neutralSubtle">
      게시글 {postCount}개를 불러왔어요.
    </Text>
  )
}
