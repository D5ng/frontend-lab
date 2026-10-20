import { Callout } from '@seed-design/react'
import type { ReservationResult } from '../types/reservation'

interface Props {
  result: ReservationResult
}

export function ReservationProductResult({ result }: Props) {
  return (
    <Callout.Root tone={NOTICE_BY_RESULT[result].tone} role={NOTICE_BY_RESULT[result].role}>
      <Callout.Content>
        <Callout.Description>{NOTICE_BY_RESULT[result].message}</Callout.Description>
      </Callout.Content>
    </Callout.Root>
  )
}

type ReservationNotice = {
  tone: 'positive' | 'critical'
  message: string
  role: 'status' | 'alert'
}

const NOTICE_BY_RESULT: Record<ReservationResult, ReservationNotice> = {
  success: {
    tone: 'positive',
    message: '선택한 상품을 예약했어요.',
    role: 'status',
  },
  error: {
    tone: 'critical',
    message: '예약하지 못했어요. 선택한 상품은 그대로예요. 다시 시도해 주세요.',
    role: 'alert',
  },
} as const
