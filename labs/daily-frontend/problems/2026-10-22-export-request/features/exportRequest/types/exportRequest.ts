export type ExportInput =
  { format: 'csv'; name: string; delimiter: 'comma' | 'tab' } | { format: 'pdf'; name: string; detail: 'summary' | 'full' }

export interface ExportReceipt {
  id: string
  fileName: string
}

export type RequestExport = (input: ExportInput) => Promise<ExportReceipt>
