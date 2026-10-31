import { fetchSavingsProduct, type SavingsProduct } from '../api'
import { useHttpRequest } from './useHttpRequest'

export function useProduct() {
  const { data: product, error: loadFailed, handleReload } = useHttpRequest<SavingsProduct>(fetchSavingsProduct)

  return {
    product,
    loadFailed,
    handleReload,
  }
}
