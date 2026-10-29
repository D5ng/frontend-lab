import { useState } from 'react'
import { createDemoCancellation } from './api'
import { CancellationPage } from './starter'

export function Problem() {
  const [cancelReservation] = useState(createDemoCancellation)
  return <CancellationPage cancelReservation={cancelReservation} />
}
