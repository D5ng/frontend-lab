import { useState } from 'react'
import { VStack } from '@seed-design/react'
import type { CancelReservation } from './api'
import './style.css'
import { ReservationId, INITIAL_RESERVATIONS } from './features/cancelReservations/reservation'
import { isCancellable } from './features/cancelReservations/cancelPolicy'
import { useCancelReservationForm } from './features/cancelReservations/useCancelReservationForm'
import { CancelReservationForm } from './features/cancelReservations/CancelReservationForm'
import { CancelPolicySummary } from './features/cancelReservations/CancelPolicySummary'
import { CancelHeading } from './features/cancelReservations/CancelHeading'
import { ReservationSelector } from './features/cancelReservations/ReservationSelector'

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
