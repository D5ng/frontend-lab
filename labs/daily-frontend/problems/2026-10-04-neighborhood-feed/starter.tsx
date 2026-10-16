import { useState } from 'react'

import { FeedView } from './view'
import { LoadPosts, Neighborhood } from './neighborhoodFeed/neighborhoodFeed.model'
import { useNeighborhoodPosts } from './neighborhoodFeed/useNeighborhoodPosts'

export function NeighborhoodFeed({ loadPosts }: { loadPosts: LoadPosts }) {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood>('seongsu')
  const { posts, isLoading, error, reloadPosts } = useNeighborhoodPosts({ func: loadPosts, neighborhood: selectedNeighborhood })

  const handleNeighborhoodChange = (value: Neighborhood) => {
    setSelectedNeighborhood(value)
  }

  return (
    <FeedView
      neighborhood={selectedNeighborhood}
      posts={posts}
      isLoading={isLoading}
      onNeighborhoodChange={handleNeighborhoodChange}
      onReload={reloadPosts}
      error={error}
    />
  )
}
