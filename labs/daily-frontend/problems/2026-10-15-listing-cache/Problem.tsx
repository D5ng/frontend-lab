import { useState } from 'react'
import { createDetailApi } from './api'
import { ListingBrowser } from './starter'
import { DetailView } from './view'
import { previews } from './preview'

export function Problem() {
  const [loadDetail] = useState(createDetailApi)
  const preview = import.meta.env.DEV ? previews[new URLSearchParams(window.location.search).get('listing-cache-preview') ?? ''] : undefined
  return preview ? <DetailView {...preview} onSelect={() => {}} onRetry={() => {}} /> : <ListingBrowser loadDetail={loadDetail} />
}
