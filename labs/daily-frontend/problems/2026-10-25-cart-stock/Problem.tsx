import { useState } from 'react'
import { createApiClient } from '../../src/api/client'
import { fetchProducts } from './features/cartStock/apis/fetchProducts'
import { CartStockPage } from './pages/CartStockPage'

export function Problem() {
  const [loadProducts] = useState(() => {
    const request = createApiClient()
    return () => fetchProducts(request)
  })
  return <CartStockPage loadProducts={loadProducts} />
}
