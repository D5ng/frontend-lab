import { useState } from 'react'
import { createArchiveApi } from './api'
import { ArchiveForm } from './starter'

export function Problem() {
  const [archiveProducts] = useState(createArchiveApi)
  return <ArchiveForm archiveProducts={archiveProducts} />
}
