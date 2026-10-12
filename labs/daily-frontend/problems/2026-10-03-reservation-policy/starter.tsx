import { useState } from 'react'
import { VStack } from '@seed-design/react'
import type { CancelReservation } from './api'
import './style.css'
import { ReservationId, INITIAL_RESERVATIONS } from './features/cancelReservations/models/reservation'
import { isCancellable } from './features/cancelReservations/models/cancelPolicy'
import { useCancelReservationForm } from './features/cancelReservations/hooks/useCancelReservationForm'
import { CancelPolicySummary } from './features/cancelReservations/components/CancelPolicySummary'
import { CancelHeading } from './features/cancelReservations/components/CancelHeading'
import { ReservationSelector } from './features/cancelReservations/components/ReservationSelector'
import { CancelReservationForm } from './features/cancelReservations/components/CancelReservationForm'

export function CancellationPage({ cancelReservation }: { cancelReservation: CancelReservation }) {
  const [selectedId, setSelectedId] = useState<ReservationId>('tomorrow')
  const [cancelledIds, setCancelledIds] = useState<ReservationId[]>([])

  const selected = INITIAL_RESERVATIONS.find((item) => item.id === selectedId) ?? INITIAL_RESERVATIONS[0]

  const { result, reason, fieldError, pending, disabled, reset, handleReasonChange, handleSubmit } = useCancelReservationForm({
    reservation: selected,
    onCancelled: (reservation) => setCancelledIds((previous) => [...previous, reservation.id]),
    cancellable: isCancellable(cancelledIds, selected),
    cancelReservation,
  })

  const handleReservationChange = (value: ReservationId) => {
    setSelectedId(value)
    reset()
  }

  return (
    <VStack as="article" aria-label="예약 취소" className="reservation-policy" gap="x6" px="x5" py="x6">
      <CancelHeading />
      <ReservationSelector selectedId={selectedId} disabled={pending} onReservationChange={handleReservationChange} />
      <CancelPolicySummary selected={selected} cancelledIds={cancelledIds} />
      <CancelReservationForm
        reason={reason}
        result={result}
        pending={pending}
        disabled={disabled}
        fieldError={fieldError}
        onReasonChange={handleReasonChange}
        onSubmit={handleSubmit}
      />
    </VStack>
  )
}
