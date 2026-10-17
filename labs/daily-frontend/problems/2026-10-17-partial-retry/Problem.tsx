import { useState } from 'react'
import { createShopApi } from './api'
import { ShopPage } from './starter'
import { ShopView } from './view'
import { previews } from './preview'

export function Problem() {
  const [api] = useState(createShopApi)
  const preview = import.meta.env.DEV ? previews[new URLSearchParams(window.location.search).get('partial-retry-preview') ?? ''] : undefined
  return preview ? <ShopView {...preview} onRetryProfile={() => {}} onRetryReviews={() => {}} /> : <ShopPage api={api} />
}
