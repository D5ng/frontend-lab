import { useState } from 'react'
import { createReportMock } from './features/reportForm/apis/createReportMock'
import { ReportFormPage } from './pages/ReportFormPage'

export function Problem() {
  const [sendReport] = useState(createReportMock)
  return <ReportFormPage sendReport={sendReport} />
}
