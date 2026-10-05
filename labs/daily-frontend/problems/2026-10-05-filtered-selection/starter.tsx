import { Callout, Checkbox, List, SegmentedControl, Text, VStack } from '@seed-design/react'
import { useState } from 'react'
import { ActionButton } from '../../src/seed-design/ui/action-button'
import { products, type ReserveProducts } from './api'
import './styles.css'

export function ProductReservation({ reserveProducts }: { reserveProducts: ReserveProducts }) {
  const [filter, setFilter] = useState('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [failed, setFailed] = useState(false)

  async function submit() {
    if (isSubmitting || products.filter((product) => selectedIds.includes(product.id)).length === 0) return
    setIsSubmitting(true)
    setMessage('')
    setFailed(false)
    try {
      await reserveProducts({
        productIds: products.filter((product) => selectedIds.includes(product.id)).map((product) => product.id),
        totalPrice: products.filter((product) => selectedIds.includes(product.id)).reduce((sum, product) => sum + product.price, 0),
      })
      setSelectedIds([])
      setMessage('선택한 상품을 예약했어요.')
    } catch {
      setFailed(true)
      setMessage('예약하지 못했어요. 선택한 상품은 그대로예요. 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <VStack as="article" className="filtered-selection" gap="x5" px="x5" py="x6" width="full" aria-labelledby="reservation-heading">
      <VStack as="header" gap="x2">
        <Text as="h2" id="reservation-heading" textStyle="t7Bold">
          관심 상품 예약
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          함께 받을 상품을 고르고 예약해 주세요.
        </Text>
      </VStack>
      <SegmentedControl.Root
        aria-label="상품 보기"
        value={filter}
        disabled={isSubmitting}
        onValueChange={(value) => {
          if (value !== 'all' && value !== 'free') return
          setFilter(value)
          setMessage('')
          setFailed(false)
        }}
        className="reservation-filter"
      >
        <SegmentedControl.Item value="all">
          전체
          <SegmentedControl.ItemHiddenInput />
        </SegmentedControl.Item>
        <SegmentedControl.Item value="free">
          나눔
          <SegmentedControl.ItemHiddenInput />
        </SegmentedControl.Item>
        <SegmentedControl.Indicator />
      </SegmentedControl.Root>
      <List.Root as="div" role="group" aria-label="예약할 상품" width="full">
        {products
          .filter((product) => filter === 'all' || product.price === 0)
          .map((product) => (
            <List.Item asChild key={product.id}>
              <Checkbox.Root.Primitive
                checked={selectedIds.includes(product.id)}
                disabled={isSubmitting}
                onCheckedChange={(checked) => {
                  setSelectedIds((previous) => (checked ? [...previous, product.id] : previous.filter((id) => id !== product.id)))
                  setMessage('')
                  setFailed(false)
                }}
              >
                <List.Content>
                  <List.Title>{product.title}</List.Title>
                  <List.Detail>{product.price === 0 ? '나눔' : `${product.price.toLocaleString('ko-KR')}원`} · 성수동</List.Detail>
                </List.Content>
                <List.Suffix>
                  <Checkbox.Control tone="neutral" size="large" variant="ghost">
                    <Checkbox.Indicator
                      checked={
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            d="m5 12 4 4L19 6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      }
                    />
                  </Checkbox.Control>
                </List.Suffix>
                <Checkbox.HiddenInput aria-label={product.title} />
              </Checkbox.Root.Primitive>
            </List.Item>
          ))}
      </List.Root>
      <VStack gap="x2" aria-label="예약 요약" role="region" aria-live="polite">
        <Text textStyle="t5Bold">선택 {products.filter((product) => selectedIds.includes(product.id)).length}개</Text>
        <Text textStyle="t4Regular">
          상품 금액{' '}
          {products
            .filter((product) => selectedIds.includes(product.id))
            .reduce((sum, product) => sum + product.price, 0)
            .toLocaleString('ko-KR')}
          원
        </Text>
        <Text textStyle="t3Regular" color="fg.neutralSubtle">
          {products
            .filter((product) => selectedIds.includes(product.id))
            .map((product) => product.title)
            .join(', ') || '예약할 상품을 선택해 주세요.'}
        </Text>
        {products.filter((product) => selectedIds.includes(product.id) && filter === 'free' && product.price !== 0).length > 0 && (
          <Text textStyle="t3Regular" color="fg.neutralSubtle">
            현재 목록에서 숨겨진 선택 상품{' '}
            {products.filter((product) => selectedIds.includes(product.id) && filter === 'free' && product.price !== 0).length}개도 예약에
            포함돼요.
          </Text>
        )}
      </VStack>
      {message && (
        <Callout.Root tone={failed ? 'critical' : 'positive'} role={failed ? 'alert' : 'status'}>
          <Callout.Content>
            <Callout.Description>{message}</Callout.Description>
          </Callout.Content>
        </Callout.Root>
      )}
      <ActionButton
        variant="brandSolid"
        size="large"
        loading={isSubmitting}
        disabled={isSubmitting || products.filter((product) => selectedIds.includes(product.id)).length === 0}
        aria-label={isSubmitting ? '예약 중' : '선택 상품 예약하기'}
        onClick={() => void submit()}
      >
        {isSubmitting ? '예약 중' : '선택 상품 예약하기'}
      </ActionButton>
      <Text as="p" textStyle="t3Regular" color="fg.neutralSubtle">
        {isSubmitting
          ? '선택한 상품을 예약하고 있어요. 잠시 기다려 주세요.'
          : '연습용 API는 첫 예약만 실패해요. 같은 선택으로 다시 시도해 보세요.'}
      </Text>
    </VStack>
  )
}
