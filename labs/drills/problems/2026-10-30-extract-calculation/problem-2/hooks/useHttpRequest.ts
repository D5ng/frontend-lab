import { useEffect, useState } from 'react'

export function useHttpRequest<TData>(request: (...args: unknown[]) => Promise<TData>) {
  const [data, setData] = useState<TData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    let ignore = false

    const load = async () => {
      setLoading(true)
      setError(false)

      try {
        const data = await request()
        if (!ignore) {
          setData(data)
        }
      } catch {
        if (!ignore) {
          setError(true)
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [request, reloadCount])

  function handleReload() {
    setError(false)
    setReloadCount((count) => count + 1)
  }

  return {
    data,
    loading,
    error,
    handleReload,
  }
}
