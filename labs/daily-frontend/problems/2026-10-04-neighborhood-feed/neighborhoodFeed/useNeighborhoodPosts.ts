import { useEffect, useState } from 'react'
import { LoadPosts, Neighborhood, NEIGHBORHOOS_ERROR_MESSAGE, Post } from './neighborhoodFeed.model'

interface Params {
  func: LoadPosts
  neighborhood: Neighborhood
}

export function useNeighborhoodPosts({ func, neighborhood }: Params) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    let ignore = false

    const fetchPosts = async () => {
      setLoading(true)
      setError('')
      setPosts([])

      try {
        const data = await func(neighborhood)
        if (!ignore) {
          setPosts(data)
        }
      } catch {
        if (!ignore) {
          setError(NEIGHBORHOOS_ERROR_MESSAGE)
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    fetchPosts()

    return () => {
      ignore = true
    }
  }, [func, neighborhood, reloadCount])

  const reloadPosts = () => {
    setReloadCount((prev) => prev + 1)
  }

  return {
    posts,
    isLoading: loading,
    error,
    reloadPosts,
  }
}
