import { useState } from 'react'
import { createArchiveApi } from './features/archiveForm/apis/createArchiveApi'
import { ArchiveFormPage } from './pages/ArchiveFormPage'

export function Problem() {
  const [archiveProducts] = useState(createArchiveApi)
  return <ArchiveFormPage archiveProducts={archiveProducts} />
}
