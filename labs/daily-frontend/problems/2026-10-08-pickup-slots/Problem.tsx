import { useState } from 'react'
import { createPickupMock } from './api'
import { previews } from './preview'
import { PickupPlanner } from './starter'
import { PickupView } from './view'

export function Problem() {
  const [api] = useState(createPickupMock)
  const preview = new URLSearchParams(window.location.search).get('pickup-preview')
  if (preview && previews[preview]) return <PickupView {...previews[preview]} />
  return <PickupPlanner {...api} />
}
