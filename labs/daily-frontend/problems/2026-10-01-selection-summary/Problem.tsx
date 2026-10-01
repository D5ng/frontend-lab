import { useState } from 'react'
import { exampleProducts, getSelectionSummary } from './starter'

export function Problem() {
  const [products, setProducts] = useState(() => exampleProducts.map((product) => ({ ...product })))
  const { selectedCount, canDelete } = getSelectionSummary(products)

  function toggleSelection(id: string) {
    setProducts((previous) => previous.map((product) => (product.id === id ? { ...product, isSelected: !product.isSelected } : product)))
  }

  return (
    <section aria-label="저장한 상품">
      <h2>저장한 상품</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <label className="product-choice">
              <input type="checkbox" checked={product.isSelected} onChange={() => toggleSelection(product.id)} />
              {product.name}
            </label>
          </li>
        ))}
      </ul>
      <p>선택한 상품 {selectedCount}개</p>
      <button disabled={!canDelete} onClick={() => setProducts((previous) => previous.filter((product) => !product.isSelected))}>
        선택한 상품 삭제
      </button>
    </section>
  )
}
