import { searchProducts } from './searchProducts'
import { ProductSearch } from './starter'

export function Problem() {
  return <ProductSearch searchProducts={searchProducts} />
}
