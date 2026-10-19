import { useState } from 'react'
import { createPageLoader } from './features/feedPager/apis/createPageLoader'
import { FeedPagerPage } from './pages/FeedPagerPage'
import { FeedView } from './features/feedPager/components/FeedView'
import { previews } from './features/feedPager/components/FeedView.preview'

export function Problem() {
  const [loadPage] = useState(createPageLoader)
  const preview = new URLSearchParams(window.location.search).get('feed-preview')
  return preview && previews[preview] ? <FeedView {...previews[preview]} /> : <FeedPagerPage loadPage={loadPage} />
}
