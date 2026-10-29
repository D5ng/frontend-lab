import { useCallback } from 'react'
import { useFetch } from '../../../hooks/useFetch'
import type { NotificationApi } from '../types/notification'

interface Params {
  api: NotificationApi
}

// 상품을 불러오는 훅
export function useProducts({ api }: Params) {
  const fetchProdcuts = useCallback(() => api.getProducts(), [api])
  const { data: products, loading, hasError, retry } = useFetch(fetchProdcuts)

  return {
    products: products ?? [],
    loading,
    hasError,
    retryProducts: retry,
  }
}
