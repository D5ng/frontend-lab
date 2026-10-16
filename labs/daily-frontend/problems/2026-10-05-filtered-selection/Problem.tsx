import { useState } from 'react'
import { createDemoReservation } from './api'
import { ProductReservation } from './starter'

export function Problem() {
  const [reserveProducts] = useState(createDemoReservation)
  return <ProductReservation reserveProducts={reserveProducts} />
}
