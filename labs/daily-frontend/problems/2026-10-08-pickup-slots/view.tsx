import { Callout, HStack, Skeleton, Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { RadioGroup, RadioGroupItem } from 'seed-design/ui/radio-group'
import type { Day, Slot } from './api'

export interface PickupViewProps {
  day: Day
  slots: Slot[]
  selectedSlotId: string
  loading: boolean
  loadError: boolean
  reserving: boolean
  reserveMessage: string
  reserveError: boolean
  starter?: boolean
  onDayChange: (day: Day) => void
  onSlotChange: (slotId: string) => void
  onReload: () => void
  onReserve: () => void
}

export function PickupView(props: PickupViewProps) {
  const disabled = props.starter || props.reserving
  return (
    <VStack as="article" aria-label="픽업 예약" p="x4" gap="x6" width="full">
      <VStack gap="x2">
        <Text as="h2" textStyle="t7Bold">
          픽업 시간 고르기
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          성수점에서 받을 날짜와 시간을 골라 주세요.
        </Text>
      </VStack>
      {props.starter && (
        <Text role="status" textStyle="t3Regular">
          아직 로직이 연결되지 않았어요. starter.tsx에서 시작하세요.
        </Text>
      )}
      <RadioGroup
        label="픽업 날짜"
        value={props.day}
        disabled={disabled}
        onValueChange={(value) => {
          if (value === 'today' || value === 'tomorrow') props.onDayChange(value)
        }}
      >
        <VStack gap="x2">
          <HStack asChild py="x3">
            <RadioGroupItem value="today" label="오늘" size="large" tone="neutral" />
          </HStack>
          <HStack asChild py="x3">
            <RadioGroupItem value="tomorrow" label="내일" size="large" tone="neutral" />
          </HStack>
        </VStack>
      </RadioGroup>
      <VStack gap="x3" aria-label="픽업 시간 목록">
        {props.loading ? (
          <VStack gap="x3" role="status" aria-label="시간 조회 중">
            <Text textStyle="t4Regular">선택한 날짜의 시간을 불러오고 있어요.</Text>
            <Skeleton width="full" height="x12" radius="8" aria-hidden="true" />
            <Skeleton width="full" height="x12" radius="8" aria-hidden="true" />
          </VStack>
        ) : props.loadError ? (
          <Callout.Root tone="critical" role="alert">
            <Callout.Content>
              <Callout.Description>시간을 불러오지 못했어요. 다시 불러와 주세요.</Callout.Description>
            </Callout.Content>
          </Callout.Root>
        ) : props.slots.length === 0 ? (
          <Text as="p" textStyle="t4Regular">
            예약 가능한 시간이 없어요. 다른 날짜를 골라 주세요.
          </Text>
        ) : (
          <RadioGroup label="픽업 시간" value={props.selectedSlotId} disabled={disabled} onValueChange={props.onSlotChange}>
            <VStack gap="x2">
              {props.slots.map((slot) => (
                <HStack key={slot.id} asChild py="x3">
                  <RadioGroupItem value={slot.id} label={slot.label} size="large" tone="neutral" />
                </HStack>
              ))}
            </VStack>
          </RadioGroup>
        )}
        <ActionButton variant="neutralWeak" size="large" disabled={disabled || props.loading} onClick={props.onReload}>
          시간 다시 불러오기
        </ActionButton>
      </VStack>
      <VStack gap="x3">
        {props.reserveMessage && (
          <Callout.Root tone={props.reserveError ? 'critical' : 'positive'} role={props.reserveError ? 'alert' : 'status'}>
            <Callout.Content>
              <Callout.Description>{props.reserveMessage}</Callout.Description>
            </Callout.Content>
          </Callout.Root>
        )}
        <Text as="p" textStyle="t3Regular" color="fg.neutralSubtle">
          {props.reserving ? '예약 중에는 날짜와 시간을 바꿀 수 없어요.' : '현재 날짜의 시간을 선택하면 예약할 수 있어요.'}
        </Text>
        <ActionButton
          variant="neutralSolid"
          size="large"
          loading={props.reserving}
          disabled={
            disabled ||
            props.loading ||
            props.loadError ||
            (!!props.reserveMessage && !props.reserveError) ||
            !props.slots.some((slot) => slot.id === props.selectedSlotId)
          }
          onClick={props.onReserve}
          aria-label={props.reserving ? '픽업 예약 중' : '픽업 예약하기'}
        >
          픽업 예약하기
        </ActionButton>
      </VStack>
    </VStack>
  )
}
