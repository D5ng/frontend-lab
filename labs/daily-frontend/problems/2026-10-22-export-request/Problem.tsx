import { useState } from 'react'
import { createApiClient } from '../../src/api/client'
import { requestExport } from './features/exportRequest/apis/requestExport'
import type { ExportInput } from './features/exportRequest/types/exportRequest'
import { ExportPage } from './pages/ExportPage'

export function Problem() {
  const [send] = useState(() => {
    const request = createApiClient()
    return (input: ExportInput) => requestExport(request, input)
  })
  return <ExportPage requestExport={send} />
}
