import { ActionButton, Callout, VStack } from '@seed-design/react'
import { useState } from 'react'
import { TextField, TextFieldInput } from 'seed-design/ui/text-field'
import type { CancelReservation } from '../../../api'
import { useCancelReservationForm } from '../hooks/useCancelReservationForm'
import { MIN_CANCEL_REASON_LENGTH } from '../models/cancelPolicy'
import type { ReservationId } from '../models/reservation'
import { CancelPolicySummary } from './CancelPolicySummary'
import { ReservationSelector } from './ReservationSelector'

interface Props {
  cancelReservation: CancelReservation
}

export function CancelReservationForm({ cancelReservation }: Props) {
  const [cancelledIds, setCancelledIds] = useState<ReservationId[]>([])

  const {
    selectedId,
    selected,
    result,
    reason,
    fieldError,
    pending,
    submitDisabled,
    handleReasonChange,
    handleReservationChange,
    handleSubmit,
  } = useCancelReservationForm({
    cancelledIds,
    cancelReservation,
    onCancelled: (reservation) => setCancelledIds((previous) => [...previous, reservation.id]),
  })

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap="x6">
        <ReservationSelector selectedId={selectedId} disabled={pending} onReservationChange={handleReservationChange} />
        <CancelPolicySummary cancelledIds={cancelledIds} selected={selected} />
        <VStack gap="x4">
          <TextField
            label="취소 사유"
            description={`앞뒤 공백을 제외하고 ${MIN_CANCEL_REASON_LENGTH}자 이상 입력해 주세요.`}
            variant="underline"
            value={reason}
            onValueChange={({ value }) => handleReasonChange(value)}
            invalid={!!fieldError}
            errorMessage={fieldError}
            disabled={submitDisabled}
          >
            <TextFieldInput placeholder="예: 개인 일정이 생겼어요" />
          </TextField>
          <ActionButton
            type="submit"
            variant="neutralSolid"
            size="large"
            loading={pending}
            aria-label={pending ? '취소 중...' : '예약 취소하기'}
            disabled={submitDisabled}
          >
            {pending ? '취소 중...' : '예약 취소하기'}
          </ActionButton>
          <div role="status" aria-live="polite">
            {result && (
              <Callout.Root tone={result.tone}>
                <Callout.Content>
                  <Callout.Description>{result.message}</Callout.Description>
                </Callout.Content>
              </Callout.Root>
            )}
          </div>
        </VStack>
      </VStack>
    </form>
  )
}
