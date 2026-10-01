import { ProductSearch } from './starter'
import { searchProducts } from './searchProducts'

export function Problem() {
  return <ProductSearch searchProducts={searchProducts} />
}
