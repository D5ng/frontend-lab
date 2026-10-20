import { useState } from 'react'
import { createDemoLoader } from './api'
import { previews } from './preview'
import { NeighborhoodFeed } from './starter'
import { FeedView } from './view'

export function Problem() {
  const [loadPosts] = useState(createDemoLoader)
  const preview = previews[new URLSearchParams(window.location.search).get('feed-preview') ?? '']
  return preview ? <FeedView {...preview} /> : <NeighborhoodFeed loadPosts={loadPosts} />
}
