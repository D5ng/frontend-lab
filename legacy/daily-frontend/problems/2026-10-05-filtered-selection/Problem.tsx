import { useState } from 'react'
import { createDemoReservation } from './features/productReservation/apis/createDemoReservation'
import { ProductReservationPage } from './pages/ProductReservationPage'

export function Problem() {
  const [reserveProducts] = useState(createDemoReservation)
  return <ProductReservationPage reserveProducts={reserveProducts} />
}
