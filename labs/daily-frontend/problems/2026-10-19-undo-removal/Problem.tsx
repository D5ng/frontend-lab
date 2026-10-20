import { useState } from 'react'
import { createRemovalApi } from './features/productRemoval/apis/createRemovalApi'
import { ProductRemovalPage } from './pages/ProductRemovalPage'
import { RemovalPreview } from './features/productRemoval/components/RemovalView.preview'

export function Problem() {
  const [api] = useState(createRemovalApi)
  const preview = import.meta.env.DEV ? new URLSearchParams(window.location.search).get('removal-preview') : null
  return preview ? <RemovalPreview scene={preview} /> : <ProductRemovalPage api={api} />
}
