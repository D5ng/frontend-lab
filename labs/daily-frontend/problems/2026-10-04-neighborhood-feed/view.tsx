import { Text, VStack } from '@seed-design/react'
import { ActionButton } from '../../src/seed-design/ui/action-button'
import { type Neighborhood, NEIGHBORHOODS, type Post } from './neighborhoodFeed/neighborhoodFeed.model'
import { NeighborhoodHeading } from './neighborhoodFeed/NeighborhoodHeading'
import { NeighborhoodList } from './neighborhoodFeed/NeighborhoodList'
import { NeighborhoodSelector } from './neighborhoodFeed/NeighborhoodSelector'
import { PostStatusMessage } from './neighborhoodFeed/PostStatusMessage'
import './style.css'

export type FeedViewProps = {
  neighborhood: Neighborhood
  posts: Post[]
  isLoading: boolean
  error?: string
  onNeighborhoodChange: (value: Neighborhood) => void
  onReload: () => void
}

// 화면 표현만 제공합니다. 현재 요청 판별·목록 갱신·재시도 로직은 넣지 않습니다.
export function FeedView({ neighborhood, posts, isLoading, error = '', onNeighborhoodChange, onReload }: FeedViewProps) {
  const showPosts = !isLoading && !error && posts.length > 0

  return (
    <VStack as="article" aria-label="동네 게시글" className="neighborhood-feed" gap="x5" px="x5" py="x6">
      <NeighborhoodHeading />

      <NeighborhoodSelector value={neighborhood} onValueChange={onNeighborhoodChange} />

      <Text as="h3" textStyle="t5Bold">
        {NEIGHBORHOODS[neighborhood]} 게시글
      </Text>

      <div role="status" aria-live="polite">
        <PostStatusMessage isLoading={isLoading} error={error} postCount={posts.length} />
      </div>

      {showPosts && <NeighborhoodList posts={posts} />}

      <ActionButton type="button" variant="neutralWeak" size="large" disabled={isLoading} onClick={onReload}>
        다시 불러오기
      </ActionButton>
      {isLoading && (
        <Text textStyle="t3Regular" color="fg.neutralSubtle">
          불러오는 동안에도 다른 동네를 선택할 수 있어요.
        </Text>
      )}
    </VStack>
  )
}
