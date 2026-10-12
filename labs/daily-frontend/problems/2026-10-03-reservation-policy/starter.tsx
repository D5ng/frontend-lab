import { VStack } from '@seed-design/react'
import type { CancelReservation } from './api'
import './style.css'
import { CancelHeading } from './features/cancelReservations/components/CancelHeading'
import { CancelReservationForm } from './features/cancelReservations/components/CancelReservationForm'

export function CancellationPage({ cancelReservation }: { cancelReservation: CancelReservation }) {
  return (
    <VStack as="article" aria-label="예약 취소" className="reservation-policy" gap="x6" px="x5" py="x6">
      <CancelHeading />
      <CancelReservationForm cancelReservation={cancelReservation} />
    </VStack>
  )
}
