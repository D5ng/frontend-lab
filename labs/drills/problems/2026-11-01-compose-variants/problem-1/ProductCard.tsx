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
  showRank?: boolean
  rank?: number
  showDiscount?: boolean
  showSoldOut?: boolean
  showCartButton?: boolean
  onAddToCart?: (product: Product) => void
  compact?: boolean
}

export function ProductCard({
  product,
  showRank = false,
  rank,
  showDiscount = false,
  showSoldOut = false,
  showCartButton = false,
  onAddToCart,
  compact = false,
}: ProductCardProps) {
  const soldOut = product.stock === 0
  const salePrice = Math.floor((product.price * (100 - product.discountRate)) / 1000) * 10

  return (
    <article aria-label={product.name}>
      {!compact && (
        <div>
          <img src={product.imageUrl} alt={product.name} />
          {showRank && rank !== undefined && <span>{rank}위</span>}
          {showSoldOut && soldOut && <span>품절</span>}
        </div>
      )}
      <h3>{product.name}</h3>
      {showDiscount && product.discountRate > 0 ? (
        <p>
          <span>{product.discountRate}%</span> <strong>{formatWon(salePrice)}</strong> <del>{formatWon(product.price)}</del>
        </p>
      ) : (
        <p>
          <strong>{formatWon(product.price)}</strong>
        </p>
      )}
      {showCartButton && (
        <button type="button" disabled={soldOut} onClick={() => onAddToCart?.(product)}>
          {compact ? '담기' : '장바구니 담기'}
        </button>
      )}
    </article>
  )
}

function formatWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`
}
