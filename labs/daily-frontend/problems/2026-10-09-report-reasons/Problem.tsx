import { useState } from 'react'
import { createReportMock } from './api'
import { ReportForm } from './starter'

export function Problem() {
  const [sendReport] = useState(createReportMock)
  return <ReportForm sendReport={sendReport} />
}
