import type { ReactNode } from 'react'

export type Product = {
  id: number
  name: string
  imageUrl: string
  price: number
  discountRate: number
  stock: number
}

type ProductCardProps = {
  product: Product
  thumbnail?: ReactNode
  action?: {
    label: string
    onClick: (product: Product) => void
  }
}

export function ProductCard({ product, thumbnail, action }: ProductCardProps) {
  const soldOut = product.stock === 0
  const salePrice = calculateSalePrice(product.price, product.discountRate)

  return (
    <article aria-label={product.name}>
      {thumbnail}
      <h3>{product.name}</h3>
      {product.discountRate > 0 ? (
        <p>
          <span>{product.discountRate}%</span> <strong>{formatWon(salePrice)}</strong> <del>{formatWon(product.price)}</del>
        </p>
      ) : (
        <p>
          <strong>{formatWon(product.price)}</strong>
        </p>
      )}
      {action && (
        <button type="button" disabled={soldOut} onClick={() => action.onClick(product)}>
          {action.label}
        </button>
      )}
    </article>
  )
}

const PRICE_ROUNDING_UNIT = 10

function calculateSalePrice(price: number, discountRate: number) {
  const discounted = (price * (100 - discountRate)) / 100
  return Math.floor(discounted / PRICE_ROUNDING_UNIT) * PRICE_ROUNDING_UNIT
}

function formatWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`
}
