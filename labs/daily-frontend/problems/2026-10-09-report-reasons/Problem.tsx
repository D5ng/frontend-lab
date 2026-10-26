import { useState } from 'react'
import { DayTripPage } from './pages/DayTripPage'
import { createTripApi } from './trip/api'

export function Problem() {
  const [api] = useState(createTripApi)
  return <DayTripPage api={api} />
}
