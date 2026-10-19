import { Callout, Skeleton, Text, VStack } from '@seed-design/react'
import { List, ListItem } from 'seed-design/ui/list'
import { ActionButton } from 'seed-design/ui/action-button'
import type { Post } from '../types/feed'

export type FeedViewProps = {
  items: Post[]
  loading: boolean
  loadingMore: boolean
  ready: boolean
  hasMore: boolean
  error: 'initial' | 'more' | null
  canLoadMore: boolean
  onRefresh: () => void
  onLoadMore: () => void
}

export function FeedView(props: FeedViewProps) {
  return (
    <VStack as="article" aria-label="동네 나눔" width="full" gap="x6" py="x4">
      <VStack px="x4" gap="x2">
        <Text as="h2" textStyle="t7Bold">
          동네 나눔 둘러보기
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          성수동 이웃이 나누는 물건을 확인해 보세요.
        </Text>
        <ActionButton variant="neutralWeak" size="large" disabled={props.loading} onClick={props.onRefresh}>
          목록 새로고침
        </ActionButton>
      </VStack>
      {props.loading && (
        <VStack px="x4" gap="x4">
          <Text role="status" textStyle="t4Regular">
            나눔 목록을 불러오고 있어요.
          </Text>
          <VStack gap="x6" aria-hidden="true">
            {[0, 1].map((key) => (
              <VStack key={key} gap="x2">
                <Skeleton width="full" height="lineHeight.t5" radius="8" />
                <Skeleton width="full" height="lineHeight.t3" radius="8" />
              </VStack>
            ))}
          </VStack>
        </VStack>
      )}
      {props.items.length > 0 && (
        <List aria-label="나눔 게시글" width="full">
          {props.items.map((post) => (
            <ListItem key={post.id} title={post.title} detail={post.location} />
          ))}
        </List>
      )}
      <VStack px="x4" gap="x4">
        {props.error && (
          <Callout.Root tone="critical" role="alert">
            <Callout.Content>
              <Callout.Description>
                {props.error === 'initial'
                  ? '목록을 불러오지 못했어요. 새로고침해 주세요.'
                  : '다음 페이지를 불러오지 못했어요. 다시 불러와 주세요.'}
              </Callout.Description>
            </Callout.Content>
          </Callout.Root>
        )}
        {props.loadingMore && (
          <Text role="status" textStyle="t4Regular">
            다음 페이지를 불러오고 있어요.
          </Text>
        )}
        {props.ready && !props.loading && props.items.length === 0 && (
          <Text role="status" textStyle="t4Regular">
            아직 나눔 글이 없어요. 나중에 새로고침해 주세요.
          </Text>
        )}
        {!props.ready && !props.loading && !props.error && (
          <Text textStyle="t4Regular" color="fg.neutralSubtle">
            목록을 불러와 주세요.
          </Text>
        )}
        {props.ready && !props.loading && !props.hasMore && props.items.length > 0 && (
          <Text role="status" textStyle="t4Regular">
            모든 나눔 글을 확인했어요.
          </Text>
        )}
        <ActionButton
          variant="neutralSolid"
          size="large"
          loading={props.loadingMore}
          disabled={!props.canLoadMore}
          onClick={props.onLoadMore}
          aria-label={props.loadingMore ? '다음 페이지 불러오는 중' : props.error === 'more' ? '다음 페이지 다시 불러오기' : '더보기'}
        >
          {props.error === 'more' ? '다음 페이지 다시 불러오기' : '더보기'}
        </ActionButton>
      </VStack>
    </VStack>
  )
}
