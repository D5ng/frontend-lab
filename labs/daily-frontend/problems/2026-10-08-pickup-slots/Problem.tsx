import { useState } from 'react'
import { createPickupMock } from './features/pickupPlanner/apis/createPickupMock'
import { previews } from './features/pickupPlanner/components/PickupView.preview'
import { PickupPlannerPage } from './pages/PickupPlannerPage'
import { PickupView } from './features/pickupPlanner/components/PickupView'

export function Problem() {
  const [api] = useState(createPickupMock)
  const preview = new URLSearchParams(window.location.search).get('pickup-preview')
  if (preview && previews[preview]) return <PickupView {...previews[preview]} />
  return <PickupPlannerPage {...api} />
}
