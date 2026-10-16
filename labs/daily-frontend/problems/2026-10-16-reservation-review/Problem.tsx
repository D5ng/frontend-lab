import { useId, useState } from 'react'
import { Callout, Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { RadioGroup, RadioGroupItem } from 'seed-design/ui/radio-group'
import { createReservationApi, type Quote, type Receipt, type ReservationApi } from './api'

export function Problem({ api: providedApi }: { api?: ReservationApi }) {
  const [api] = useState(() => providedApi ?? createReservationApi())
  const id = useId()
  const [count, setCount] = useState(1)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (isChecking || isConfirming || receipt) return
    setError('')
    if (!quote) {
      setIsChecking(true)
      try {
        const result = await api.getQuote(count)
        setQuote(result)
      } catch {
        setError('금액을 확인하지 못했어요. 다시 확인해 주세요.')
      } finally {
        setIsChecking(false)
      }
    } else {
      setIsConfirming(true)
      try {
        const result = await api.confirm(quote.quoteId)
        setReceipt(result)
      } catch {
        setError('예약을 확정하지 못했어요. 확인한 금액으로 다시 시도해 주세요.')
      } finally {
        setIsConfirming(false)
      }
    }
  }

  return (
    <VStack as="article" px="x4" py="x6" gap="x6">
      <VStack as="header" gap="x2">
        <Text as="h2" textStyle="t7Bold">
          동네 도예 클래스 예약
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          인원을 고르고 확인한 금액으로 예약해 주세요.
        </Text>
      </VStack>
      <RadioGroup
        label="참여 인원"
        description="인원을 바꾸면 금액을 다시 확인해야 해요."
        value={String(count)}
        disabled={isChecking || isConfirming || !!receipt}
        onValueChange={(value) => {
          const nextCount = Number(value)
          if (![1, 2, 3].includes(nextCount) || nextCount === count || isChecking || isConfirming || receipt) return
          setCount(nextCount)
          setQuote(null)
          setError('')
        }}
      >
        {[1, 2, 3].map((value) => (
          <RadioGroupItem
            key={value}
            value={String(value)}
            label={`${value}명`}
            tone="neutral"
            size="large"
            style={{ minHeight: 'var(--seed-dimension-x12)', width: '100%' }}
          />
        ))}
      </RadioGroup>
      <VStack as="section" aria-labelledby={`${id}-review`} gap="x3">
        <Text as="h3" id={`${id}-review`} textStyle="t5Bold">
          {receipt ? '확정한 예약' : '예약 전 확인'}
        </Text>
        {receipt ? (
          <>
            <Text as="p" textStyle="t5Bold">
              예약 인원: {receipt.count}명
            </Text>
            <Text as="p" textStyle="t5Bold">
              확정 금액: {receipt.totalPrice.toLocaleString('ko-KR')}원
            </Text>
            <Callout.Root tone="positive" role="status">
              <Callout.Content>
                <Callout.Description>예약을 완료했어요. 클래스에서 만나요.</Callout.Description>
              </Callout.Content>
            </Callout.Root>
          </>
        ) : quote ? (
          <>
            <Text as="p" textStyle="t4Regular">
              확인한 인원: {quote.count}명
            </Text>
            <Text as="p" textStyle="t6Bold">
              확인한 금액: {quote.totalPrice.toLocaleString('ko-KR')}원
            </Text>
            <Text as="p" textStyle="t3Regular" color="fg.neutralSubtle">
              아직 예약 전이에요. 아래 버튼으로 확정해 주세요.
            </Text>
          </>
        ) : (
          <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
            아직 확인한 금액이 없어요.
          </Text>
        )}
        {(isChecking || isConfirming) && (
          <Text as="p" role="status" textStyle="t3Regular">
            {isChecking ? '선택한 인원의 금액을 확인하고 있어요.' : '확인한 금액으로 예약하고 있어요.'}
          </Text>
        )}
        {error && (
          <Callout.Root tone="critical" role="alert">
            <Callout.Content>
              <Callout.Description>{error}</Callout.Description>
            </Callout.Content>
          </Callout.Root>
        )}
        <ActionButton
          type="button"
          size="large"
          variant="neutralSolid"
          loading={isChecking || isConfirming}
          disabled={isChecking || isConfirming || !!receipt}
          onClick={handleSubmit}
        >
          {receipt
            ? '예약 완료'
            : isChecking
              ? '금액 확인 중'
              : isConfirming
                ? '예약 확정 중'
                : quote
                  ? '이 금액으로 예약 확정'
                  : '예약 금액 확인'}
        </ActionButton>
      </VStack>
    </VStack>
  )
}
