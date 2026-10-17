import { useId } from 'react'
import { Callout, Skeleton, Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { List, ListItem } from 'seed-design/ui/list'
import type { Review, ShopProfile } from './api'

export interface ShopViewProps {
  profile: ShopProfile | null
  profileBusy: boolean
  profileError: string
  reviews: Review[] | null
  reviewsBusy: boolean
  reviewsError: string
  onRetryProfile: () => void
  onRetryReviews: () => void
}

// 표시 전용. 요청 시작·실패 복구·상태 소유권은 실습자가 구현한다.
export function ShopView({
  profile,
  profileBusy,
  profileError,
  reviews,
  reviewsBusy,
  reviewsError,
  onRetryProfile,
  onRetryReviews,
}: ShopViewProps) {
  const id = useId()
  return (
    <VStack as="article" px="x4" py="x6" gap="x6">
      <VStack as="header" gap="x2">
        <Text as="h2" textStyle="t7Bold">
          동네 가게 살펴보기
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          가게 소개와 이웃의 방문 후기를 확인해 보세요.
        </Text>
      </VStack>
      <VStack as="section" aria-labelledby={`${id}-profile`} aria-busy={profileBusy} gap="x3">
        <Text as="h3" id={`${id}-profile`} textStyle="t5Bold">
          가게 소개
        </Text>
        {profileBusy ? (
          <>
            <Text as="p" role="status" textStyle="t3Regular">
              가게 소개를 불러오고 있어요.
            </Text>
            <Skeleton width="full" height="x12" aria-hidden="true" />
            <ActionButton type="button" variant="neutralWeak" size="large" loading disabled>
              가게 소개 불러오는 중
            </ActionButton>
          </>
        ) : profileError ? (
          <>
            <Callout.Root tone="critical" role="alert">
              <Callout.Content>
                <Callout.Description>{profileError}</Callout.Description>
              </Callout.Content>
            </Callout.Root>
            <ActionButton type="button" variant="neutralWeak" size="large" onClick={onRetryProfile}>
              가게 소개 다시 불러오기
            </ActionButton>
          </>
        ) : profile ? (
          <VStack gap="x2">
            <Text as="p" textStyle="t6Bold">
              {profile.name}
            </Text>
            <Text as="p" textStyle="t3Regular" color="fg.neutralSubtle">
              {profile.neighborhood}
            </Text>
            <Text as="p" textStyle="t4Regular">
              {profile.description}
            </Text>
          </VStack>
        ) : (
          <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
            아직 가게 소개를 불러오지 않았어요.
          </Text>
        )}
      </VStack>
      <VStack as="section" aria-labelledby={`${id}-reviews`} aria-busy={reviewsBusy} gap="x3">
        <Text as="h3" id={`${id}-reviews`} textStyle="t5Bold">
          방문 후기
        </Text>
        {reviewsBusy ? (
          <>
            <Text as="p" role="status" textStyle="t3Regular">
              방문 후기를 불러오고 있어요.
            </Text>
            <Skeleton width="full" height="x12" aria-hidden="true" />
            <ActionButton type="button" variant="neutralWeak" size="large" loading disabled>
              방문 후기 불러오는 중
            </ActionButton>
          </>
        ) : reviewsError ? (
          <>
            <Callout.Root tone="critical" role="alert">
              <Callout.Content>
                <Callout.Description>{reviewsError}</Callout.Description>
              </Callout.Content>
            </Callout.Root>
            <ActionButton type="button" variant="neutralWeak" size="large" onClick={onRetryReviews}>
              방문 후기 다시 불러오기
            </ActionButton>
          </>
        ) : reviews ? (
          reviews.length > 0 ? (
            <List aria-label="방문 후기 목록">
              {reviews.map((review) => (
                <ListItem key={review.id} title={review.author} detail={review.body} />
              ))}
            </List>
          ) : (
            <Callout.Root tone="neutral" role="status">
              <Callout.Content>
                <Callout.Description>아직 방문 후기가 없어요. 가게 소개를 먼저 살펴보세요.</Callout.Description>
              </Callout.Content>
            </Callout.Root>
          )
        ) : (
          <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
            아직 방문 후기를 불러오지 않았어요.
          </Text>
        )}
      </VStack>
    </VStack>
  )
}
