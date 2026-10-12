import { Callout, HStack, Text, VStack } from '@seed-design/react'

import { formatPrice } from '../../../utils/formatPrice'
import { Reservation, ReservationId } from '../models/reservation'
import { getCancelFee, getCancelPolicy, getRefundAmount, isCancellableTiming } from '../models/cancelPolicy'

interface Props {
  selected: Reservation
  cancelledIds: ReservationId[]
}

export function CancelPolicySummary({ selected, cancelledIds }: Props) {
  const { tone, message } = getCancelPolicy(cancelledIds, selected)
  const cancellableTiming = isCancellableTiming(selected.timing)

  return (
    <VStack gap="x3" aria-label="취소 정책">
      <HStack justify="space-between">
        <Text textStyle="t4Regular">결제 금액</Text>
        <Text textStyle="t4Bold">{formatPrice(selected.paid)}</Text>
      </HStack>
      <HStack justify="space-between">
        <Text textStyle="t4Regular">취소 수수료</Text>
        <Text textStyle="t4Bold" data-testid="fee">
          {cancellableTiming ? formatPrice(getCancelFee(selected.timing)) : '취소 불가'}
        </Text>
      </HStack>
      <HStack justify="space-between">
        <Text textStyle="t5Bold">환불 예정 금액</Text>
        <Text textStyle="t5Bold" data-testid="refund">
          {cancellableTiming ? formatPrice(getRefundAmount(selected)) : '환불 불가'}
        </Text>
      </HStack>
      <Callout.Root tone={tone}>
        <Callout.Content>
          <Callout.Description>{message}</Callout.Description>
        </Callout.Content>
      </Callout.Root>
    </VStack>
  )
}
