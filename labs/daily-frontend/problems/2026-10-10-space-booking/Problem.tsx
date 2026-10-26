import { useState } from 'react'
import { createBookingApi } from './booking/api'
import { bookingPreviews } from './booking/preview'
import { SpaceBookingView } from './booking/SpaceBookingView'
import { SpaceBookingPage } from './pages/SpaceBookingPage'
export function Problem() {
  const [api] = useState(createBookingApi)
  const preview = new URLSearchParams(window.location.search).get('space-preview')
  if (preview && bookingPreviews[preview]) return <SpaceBookingView {...bookingPreviews[preview]} />
  return <SpaceBookingPage api={api} />
}
