import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { Callout, HStack, Text, VStack } from '@seed-design/react'
import { RadioGroup, RadioGroupItem } from '../../src/seed-design/ui/radio-group'
import { TextField, TextFieldInput } from '../../src/seed-design/ui/text-field'
import { ActionButton } from '../../src/seed-design/ui/action-button'
import type { CancelReservation } from './api'
import './style.css'

// 시간 경과가 아닌 고정된 업무 상황입니다. 날짜/타이머 처리는 과제 범위 밖입니다.
const reservations = [
  { id: 'tomorrow', title: '내일 · 도자기 원데이 클래스', timing: 'before-day', paid: 12000 },
  { id: 'today', title: '오늘 · 가죽 키링 클래스', timing: 'same-day', paid: 18000 },
  { id: 'started', title: '진행 중 · 수채화 클래스', timing: 'started', paid: 15000 },
] as const

export function CancellationPage({ cancelReservation }: { cancelReservation: CancelReservation }) {
  const [selectedId, setSelectedId] = useState('tomorrow')
  const [reason, setReason] = useState('')
  const [cancelledIds, setCancelledIds] = useState<string[]>([])
  const [pending, setPending] = useState(false)
  const [fieldError, setFieldError] = useState('')
  const [result, setResult] = useState('')
  const [failed, setFailed] = useState(false)
  const selected = reservations.find((item) => item.id === selectedId) ?? reservations[0]

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending || cancelledIds.includes(selected.id) || selected.timing === 'started') return
    setResult('')
    setFailed(false)
    setFieldError('')
    if (reason.trim().length < 5) {
      setFieldError('취소 사유를 5자 이상 입력해 주세요.')
      return
    }
    setPending(true)
    try {
      await cancelReservation({
        reservationId: selected.id,
        reason: reason.trim(),
        fee: selected.timing === 'same-day' ? 2000 : 0,
        refund: selected.paid - (selected.timing === 'same-day' ? 2000 : 0),
      })
      setCancelledIds((previous) => [...previous, selected.id])
      setReason('')
      setResult('예약을 취소했어요. 환불 예정 금액을 확인해 주세요.')
    } catch {
      setFailed(true)
      setResult('취소하지 못했어요. 입력한 사유를 확인하고 다시 시도해 주세요.')
    } finally {
      setPending(false)
    }
  }

  return (
    <VStack as="article" aria-label="예약 취소" className="reservation-policy" gap="x6" px="x5" py="x6">
      <VStack as="header" gap="x2">
        <Text as="h2" textStyle="t7Bold">
          예약 취소
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          취소할 예약을 고르고 환불 금액을 확인해 주세요.
        </Text>
      </VStack>
      <RadioGroup
        label="내 예약"
        value={selectedId}
        disabled={pending}
        onValueChange={(value) => {
          if (!reservations.some((item) => item.id === value)) return
          setSelectedId(value)
          setReason('')
          setFieldError('')
          setResult('')
          setFailed(false)
        }}
      >
        {reservations.map((item) => (
          <RadioGroupItem key={item.id} value={item.id} label={item.title} size="large" tone="neutral" className="reservation-choice" />
        ))}
      </RadioGroup>
      <VStack gap="x3" aria-label="취소 정책">
        <HStack justify="space-between">
          <Text textStyle="t4Regular">결제 금액</Text>
          <Text textStyle="t4Bold">{selected.paid.toLocaleString('ko-KR')}원</Text>
        </HStack>
        <HStack justify="space-between">
          <Text textStyle="t4Regular">취소 수수료</Text>
          <Text textStyle="t4Bold" data-testid="fee">
            {selected.timing === 'started' ? '취소 불가' : `${(selected.timing === 'same-day' ? 2000 : 0).toLocaleString('ko-KR')}원`}
          </Text>
        </HStack>
        <HStack justify="space-between">
          <Text textStyle="t5Bold">환불 예정 금액</Text>
          <Text textStyle="t5Bold" data-testid="refund">
            {selected.timing === 'started'
              ? '환불 불가'
              : `${(selected.paid - (selected.timing === 'same-day' ? 2000 : 0)).toLocaleString('ko-KR')}원`}
          </Text>
        </HStack>
        <Callout.Root tone={selected.timing === 'started' ? 'warning' : 'neutral'}>
          <Callout.Content>
            <Callout.Description>
              {cancelledIds.includes(selected.id)
                ? '이미 취소한 예약이에요.'
                : selected.timing === 'started'
                  ? '시작한 클래스는 취소할 수 없어요.'
                  : selected.timing === 'same-day'
                    ? '당일 취소는 수수료 2,000원이 차감돼요.'
                    : '시작 전날까지는 전액 환불돼요.'}
            </Callout.Description>
          </Callout.Content>
        </Callout.Root>
      </VStack>
      <form onSubmit={submit}>
        <VStack gap="x4">
          <TextField
            label="취소 사유"
            description="앞뒤 공백을 제외하고 5자 이상 입력해 주세요."
            variant="underline"
            value={reason}
            onValueChange={({ value }) => {
              setReason(value)
              setFieldError('')
              setResult('')
              setFailed(false)
            }}
            invalid={!!fieldError}
            errorMessage={fieldError}
            disabled={pending || selected.timing === 'started' || cancelledIds.includes(selected.id)}
          >
            <TextFieldInput placeholder="예: 개인 일정이 생겼어요" />
          </TextField>
          <ActionButton
            type="submit"
            variant="neutralSolid"
            size="large"
            loading={pending}
            aria-label={pending ? '취소 중...' : '예약 취소하기'}
            disabled={pending || selected.timing === 'started' || cancelledIds.includes(selected.id)}
          >
            {pending ? '취소 중...' : '예약 취소하기'}
          </ActionButton>
          <div role="status" aria-live="polite">
            {result && (
              <Callout.Root tone={failed ? 'critical' : 'positive'}>
                <Callout.Content>
                  <Callout.Description>{result}</Callout.Description>
                </Callout.Content>
              </Callout.Root>
            )}
          </div>
        </VStack>
      </form>
    </VStack>
  )
}
