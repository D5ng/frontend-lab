import { useState } from 'react'
import { createApiClient } from '../../src/api/client'
import { endSession } from './features/deviceSessions/apis/endSession'
import { DeviceSessionsPage } from './pages/DeviceSessionsPage'

export function Problem() {
  const [end] = useState(() => {
    const request = createApiClient()
    return (id: string) => endSession(request, id)
  })
  return <DeviceSessionsPage endSession={end} />
}
