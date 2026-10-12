import { Callout, List, SegmentedControl, Text, VStack } from '@seed-design/react'
import { ActionButton } from '../../src/seed-design/ui/action-button'
import { ProgressCircle } from '../../src/seed-design/ui/progress-circle'
import { neighborhoods } from './api'
import type { Neighborhood, Post } from './api'
import './style.css'

export type FeedViewProps = {
  neighborhood: Neighborhood
  posts: Post[]
  busy: boolean
  loaded: boolean
  error?: string
  onNeighborhoodChange: (value: Neighborhood) => void
  onReload: () => void
}

// 화면 표현만 제공합니다. 현재 요청 판별·목록 갱신·재시도 로직은 넣지 않습니다.
export function FeedView({ neighborhood, posts, busy, loaded, error, onNeighborhoodChange, onReload }: FeedViewProps) {
  return (
    <VStack as="article" aria-label="동네 게시글" className="neighborhood-feed" gap="x5" px="x5" py="x6">
      <VStack as="header" gap="x2">
        <Text as="h2" textStyle="t7Bold">
          우리 동네 중고거래
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          보고 싶은 동네를 골라 주세요.
        </Text>
      </VStack>
      <SegmentedControl.Root
        value={neighborhood}
        aria-label="게시글 동네"
        className="feed-neighborhoods"
        onValueChange={(value) => {
          if (value === 'seongsu' || value === 'yeonnam' || value === 'mangwon') onNeighborhoodChange(value)
        }}
      >
        {Object.entries(neighborhoods).map(([value, label]) => (
          <SegmentedControl.Item value={value} key={value} className="feed-neighborhood">
            <SegmentedControl.ItemHiddenInput />
            {label}
          </SegmentedControl.Item>
        ))}
        <SegmentedControl.Indicator />
      </SegmentedControl.Root>
      <Text as="h3" textStyle="t5Bold">
        {neighborhoods[neighborhood]} 게시글
      </Text>
      <div role="status" aria-live="polite">
        {busy ? (
          <VStack gap="x3" align="center" py="x6">
            <ProgressCircle aria-label="게시글 불러오는 중" />
            <Text>게시글을 불러오고 있어요.</Text>
          </VStack>
        ) : error ? (
          <Callout.Root tone="critical">
            <Callout.Content>
              <Callout.Description>{error}</Callout.Description>
            </Callout.Content>
          </Callout.Root>
        ) : loaded && posts.length === 0 ? (
          <Callout.Root tone="neutral">
            <Callout.Content>
              <Callout.Description>아직 게시글이 없어요. 다른 동네를 골라 주세요.</Callout.Description>
            </Callout.Content>
          </Callout.Root>
        ) : loaded ? (
          <Text textStyle="t4Regular" color="fg.neutralSubtle">
            게시글 {posts.length}개를 불러왔어요.
          </Text>
        ) : (
          <Text textStyle="t4Regular" color="fg.neutralSubtle">
            아직 요청 로직이 연결되지 않았어요.
          </Text>
        )}
      </div>
      {!busy && !error && posts.length > 0 && (
        <List.Root aria-label="게시글 목록">
          {posts.map((post) => (
            <List.Item key={post.id}>
              <List.Content>
                <List.Title>{post.title}</List.Title>
                <List.Detail>
                  {neighborhoods[post.neighborhood]} · {post.price.toLocaleString('ko-KR')}원
                </List.Detail>
              </List.Content>
            </List.Item>
          ))}
        </List.Root>
      )}
      <ActionButton type="button" variant="neutralWeak" size="large" disabled={busy} onClick={onReload}>
        다시 불러오기
      </ActionButton>
      {busy && (
        <Text textStyle="t3Regular" color="fg.neutralSubtle">
          불러오는 동안에도 다른 동네를 선택할 수 있어요.
        </Text>
      )}
    </VStack>
  )
}
