import { type Product, ProductCard } from './ProductCard'
import { ProductThumbnail } from './ProductThumbnail'

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
      {products.map((product, rank) => (
        <ProductCard
          key={product.id}
          product={product}
          thumbnail={
            <ProductThumbnail imageUrl={product.imageUrl} name={product.name}>
              {<span>{rank + 1}위</span>}
              {product.stock === 0 && <span>품절</span>}
            </ProductThumbnail>
          }
        />
      ))}
    </section>
  )
}

// 검색 결과
export function SearchResults({ products, onAddToCart }: SectionWithCartProps) {
  return (
    <section aria-label="검색 결과">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          thumbnail={
            <ProductThumbnail imageUrl={product.imageUrl} name={product.name}>
              {product.stock === 0 && <span>품절</span>}
            </ProductThumbnail>
          }
          action={{
            label: '장바구니 담기',
            onClick: onAddToCart,
          }}
        />
      ))}
    </section>
  )
}

// 장바구니 아래: 함께 사면 좋은 상품
export function CartRecommendations({ products, onAddToCart }: SectionWithCartProps) {
  return (
    <section aria-label="함께 사면 좋은 상품">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} action={{ label: '담기', onClick: onAddToCart }} />
      ))}
    </section>
  )
}
