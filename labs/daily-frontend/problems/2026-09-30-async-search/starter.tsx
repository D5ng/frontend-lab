/* eslint-disable react-hooks/set-state-in-effect -- 비동기 검색 버그를 분석하기 위한 실습 초기 코드 */
import { useEffect, useState } from 'react'

type Product = {
  id: string
  name: string
}

type ProductSearchProps = {
  searchProducts: (query: string) => Promise<Product[]>
}

export function ProductSearch({ searchProducts }: ProductSearchProps) {
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!query) {
      setProducts([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    searchProducts(query)
      .then((result) => {
        setProducts(result)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [query, searchProducts])

  return (
    <section aria-label="상품 검색">
      <label htmlFor="product-query">상품 검색어</label>
      <input id="product-query" value={query} onChange={(event) => setQuery(event.target.value)} />

      {isLoading && <p>검색 중...</p>}

      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </section>
  )
}
