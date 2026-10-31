import { type Product, ProductCard } from './ProductCard'

type SectionProps = {
  products: Product[]
}

type SectionWithCartProps = SectionProps & {
  onAddToCart: (product: Product) => void
}

// 홈: 이번 주 많이 산 상품
export function BestSellers({ products }: SectionProps) {
  return (
    <section aria-label="많이 산 상품">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} showRank rank={index + 1} showDiscount showSoldOut />
      ))}
    </section>
  )
}

// 검색 결과
export function SearchResults({ products, onAddToCart }: SectionWithCartProps) {
  return (
    <section aria-label="검색 결과">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} showDiscount showSoldOut showCartButton onAddToCart={onAddToCart} />
      ))}
    </section>
  )
}

// 장바구니 아래: 함께 사면 좋은 상품
export function CartRecommendations({ products, onAddToCart }: SectionWithCartProps) {
  return (
    <section aria-label="함께 사면 좋은 상품">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} compact showDiscount showCartButton onAddToCart={onAddToCart} />
      ))}
    </section>
  )
}
