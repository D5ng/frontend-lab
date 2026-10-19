import { useState } from 'react'
import { createDetailApi } from './features/listingBrowser/apis/createDetailApi'
import { ListingBrowserPage } from './pages/ListingBrowserPage'
import { DetailView } from './features/listingBrowser/components/DetailView'
import { previews } from './features/listingBrowser/components/DetailView.preview'

export function Problem() {
  const [loadDetail] = useState(createDetailApi)
  const preview = import.meta.env.DEV ? previews[new URLSearchParams(window.location.search).get('listing-cache-preview') ?? ''] : undefined
  return preview ? <DetailView {...preview} onSelect={() => {}} onRetry={() => {}} /> : <ListingBrowserPage loadDetail={loadDetail} />
}
