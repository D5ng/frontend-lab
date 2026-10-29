import { useEffect, useState } from 'react'

// NOTE: request 함수에 매개변수를 전달해야한다면, useCallback으로 참조를 보장해야 한다
export function useFetch<TData>(request: (...args: unknown[]) => Promise<TData>) {
  const [data, setData] = useState<TData | null>(null)
  const [loading, setLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  const retry = async () => {
    if (loading) {
      return
    }

    setLoading(false)
    setHasError(false)

    try {
      const data = await request()
      setData(data)
    } catch {
      setHasError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setHasError(false)

      try {
        const data = await request()
        setData(data)
      } catch {
        setHasError(true)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [request])

  return {
    data,
    loading,
    hasError,
    retry,
  }
}
