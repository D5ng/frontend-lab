import { useId } from 'react'
import { Callout, Text, VStack } from '@seed-design/react'
import { RadioGroup, RadioGroupItem } from 'seed-design/ui/radio-group'
import { ActionButton } from 'seed-design/ui/action-button'
import { listings } from '../apis/listings'
import type { ListingDetail, ListingId } from '../types/listing'

export interface DetailViewProps {
  selectedId: ListingId
  detail: ListingDetail | null | undefined
  busy: boolean
  error: string
  onSelect: (id: ListingId) => void
  onRetry: () => void
}

// 표시만 담당한다. 캐시나 요청 제어의 정답 구조를 제공하지 않는다.
export function DetailView({ selectedId, detail, busy, error, onSelect, onRetry }: DetailViewProps) {
  const headingId = useId()
  const selected = listings.find((item) => item.id === selectedId)!
  return (
    <VStack as="article" px="x4" py="x6" gap="x6">
      <VStack as="header" gap="x2">
        <Text as="h2" textStyle="t7Bold">
          동네 물건 살펴보기
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          한 번 확인한 상세는 다시 기다리지 않아요.
        </Text>
      </VStack>
      <RadioGroup
        label="물건 선택"
        description="불러오는 중에도 다른 물건을 고를 수 있어요."
        value={selectedId}
        onValueChange={(value) => {
          const item = listings.find((listing) => listing.id === value)
          if (item) onSelect(item.id)
        }}
      >
        {listings.map((item) => (
          <RadioGroupItem
            key={item.id}
            value={item.id}
            label={item.title}
            size="large"
            tone="neutral"
            style={{ minHeight: 'var(--seed-dimension-x12)', width: '100%' }}
          />
        ))}
      </RadioGroup>
      <VStack as="section" aria-labelledby={headingId} aria-busy={busy} gap="x3">
        <Text as="h3" id={headingId} textStyle="t5Bold">
          {selected.title} 상세
        </Text>
        {busy ? (
          <>
            <Text as="p" role="status" textStyle="t4Regular">
              상세를 불러오고 있어요.
            </Text>
            <ActionButton type="button" size="large" variant="neutralSolid" loading disabled>
              상세 불러오는 중
            </ActionButton>
          </>
        ) : error ? (
          <>
            <Callout.Root tone="critical" role="alert">
              <Callout.Content>
                <Callout.Description>{error}</Callout.Description>
              </Callout.Content>
            </Callout.Root>
            <ActionButton type="button" size="large" variant="neutralSolid" onClick={onRetry}>
              다시 불러오기
            </ActionButton>
          </>
        ) : detail === null ? (
          <Callout.Root tone="neutral" role="status">
            <Callout.Content>
              <Callout.Description>거래가 종료된 물건이에요. 다른 물건을 골라 주세요.</Callout.Description>
            </Callout.Content>
          </Callout.Root>
        ) : detail ? (
          <VStack gap="x2">
            <Text as="p" textStyle="t6Bold">
              {detail.price.toLocaleString('ko-KR')}원
            </Text>
            <Text as="p" textStyle="t3Regular" color="fg.neutralSubtle">
              {detail.neighborhood}
            </Text>
            <Text as="p" textStyle="t4Regular">
              {detail.description}
            </Text>
            <Text as="p" role="status" textStyle="t3Regular" color="fg.positive">
              상세를 확인했어요.
            </Text>
          </VStack>
        ) : (
          <Callout.Root tone="neutral">
            <Callout.Content>
              <Callout.Description>아직 상세를 불러오지 않았어요. 요청 로직을 구현해 주세요.</Callout.Description>
            </Callout.Content>
          </Callout.Root>
        )}
      </VStack>
    </VStack>
  )
}
