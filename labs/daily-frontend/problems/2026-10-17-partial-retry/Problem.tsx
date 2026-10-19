import { useState } from 'react'
import { createShopApi } from './features/shop/apis/createShopApi'
import { ShopPage } from './pages/ShopPage'
import { ShopView } from './features/shop/components/ShopView'
import { previews } from './features/shop/components/ShopView.preview'

export function Problem() {
  const [api] = useState(createShopApi)
  const preview = import.meta.env.DEV ? previews[new URLSearchParams(window.location.search).get('partial-retry-preview') ?? ''] : undefined
  return preview ? <ShopView {...preview} onRetryProfile={() => {}} onRetryReviews={() => {}} /> : <ShopPage api={api} />
}
