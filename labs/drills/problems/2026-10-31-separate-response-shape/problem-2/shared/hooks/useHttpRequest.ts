import { useEffect, useState } from 'react'

// NOTE: request 함수는 참조가 고정되어야 무한 루프를 막을 수 있어요
export function useHttpRequest<T>(request: (...args: unknown[]) => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    let ignore = false

    const load = async () => {
      setIsLoading(true)
      setHasError(false)

      try {
        if (!ignore) {
          const data = await request()
          setData(data)
        }
      } catch {
        if (!ignore) {
          setHasError(true)
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [reloadCount, request])

  const reload = () => {
    setIsLoading(true)
    setHasError(false)
    setReloadCount((prevCount) => prevCount + 1)
  }

  return {
    data,
    isLoading,
    hasError,
    reload,
  }
}
