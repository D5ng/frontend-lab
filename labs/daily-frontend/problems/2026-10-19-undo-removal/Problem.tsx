import { useState } from 'react'
import { createRemovalApi } from './api'
import { ProductRemoval } from './starter'
import { RemovalPreview } from './preview'

export function Problem() {
  const [api] = useState(createRemovalApi)
  const preview = import.meta.env.DEV ? new URLSearchParams(window.location.search).get('removal-preview') : null
  return preview ? <RemovalPreview scene={preview} /> : <ProductRemoval api={api} />
}
