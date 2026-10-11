import { Callout, HStack, Text, VStack } from '@seed-design/react'
import { getCancelFee, getCancelPolicy, getRefundAmount } from './cancelPolicy'
import { Reservation, ReservationId } from './reservation'
import { formatPrice } from '../../utils/formatPrice'

interface Props {
  selected: Reservation
  cancelledIds: ReservationId[]
}

export function CancelPolicySummary({ selected, cancelledIds }: Props) {
  const { tone, message } = getCancelPolicy(cancelledIds, selected)

  return (
    <VStack gap="x3" aria-label="취소 정책">
      <HStack justify="space-between">
        <Text textStyle="t4Regular">결제 금액</Text>
        <Text textStyle="t4Bold">{formatPrice(selected.paid)}</Text>
      </HStack>
      <HStack justify="space-between">
        <Text textStyle="t4Regular">취소 수수료</Text>
        <Text textStyle="t4Bold" data-testid="fee">
          {selected.timing === 'started' ? '취소 불가' : formatPrice(getCancelFee(selected.timing))}
        </Text>
      </HStack>
      <HStack justify="space-between">
        <Text textStyle="t5Bold">환불 예정 금액</Text>
        <Text textStyle="t5Bold" data-testid="refund">
          {selected.timing === 'started' ? '환불 불가' : formatPrice(getRefundAmount(selected))}
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
