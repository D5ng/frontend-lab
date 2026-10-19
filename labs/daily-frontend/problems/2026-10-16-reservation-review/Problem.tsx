import { useState } from 'react'
import { createReservationApi } from './features/reservationReview/apis/createReservationApi'
import { ReservationReviewPage } from './pages/ReservationReviewPage'

export function Problem() {
  const [api] = useState(createReservationApi)
  return <ReservationReviewPage api={api} />
}
