import { useState } from 'react'
import { createPageLoader } from './api'
import { FeedPager } from './starter'
import { FeedView } from './view'
import { previews } from './preview'

export function Problem() {
  const [loadPage] = useState(createPageLoader)
  const preview = new URLSearchParams(window.location.search).get('feed-preview')
  return preview && previews[preview] ? <FeedView {...previews[preview]} /> : <FeedPager loadPage={loadPage} />
}
