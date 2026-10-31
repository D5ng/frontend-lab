import '@testing-library/jest-dom/vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Product } from './ProductCard'
import { BestSellers, CartRecommendations, SearchResults } from './ProductSections'

const products: Product[] = [
  { id: 1, name: '무농약 샤인머스캣 1kg', imageUrl: '/shine-muscat.jpg', price: 32900, discountRate: 20, stock: 12 },
  { id: 2, name: '제주 감귤 3kg', imageUrl: '/tangerine.jpg', price: 18900, discountRate: 0, stock: 0 },
  { id: 3, name: '국산 냉동 블루베리 500g', imageUrl: '/blueberry.jpg', price: 12800, discountRate: 10, stock: 30 },
]

function card(section: string, name: string) {
  return within(screen.getByRole('region', { name: section })).getByRole('article', { name })
}

describe('많이 산 상품', () => {
  it('순위와 할인한 가격을 보여 주고, 담기 버튼은 없다', () => {
    render(<BestSellers products={products} />)

    const shineMuscat = card('많이 산 상품', '무농약 샤인머스캣 1kg')
    expect(within(shineMuscat).getByText('1위')).toBeInTheDocument()
    expect(within(shineMuscat).getByText('20%')).toBeInTheDocument()
    expect(within(shineMuscat).getByText('26,320원')).toBeInTheDocument()
    expect(within(shineMuscat).getByText('32,900원')).toBeInTheDocument()
    expect(within(card('많이 산 상품', '국산 냉동 블루베리 500g')).getByText('3위')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('다 팔린 상품에는 품절을 표시한다', () => {
    render(<BestSellers products={products} />)

    expect(within(card('많이 산 상품', '제주 감귤 3kg')).getByText('품절')).toBeInTheDocument()
    expect(within(card('많이 산 상품', '무농약 샤인머스캣 1kg')).queryByText('품절')).not.toBeInTheDocument()
  })
})

describe('검색 결과', () => {
  it('할인한 가격과 품절을 보여 주고, 담기를 누르면 그 상품을 담는다', async () => {
    const user = userEvent.setup()
    const onAddToCart = vi.fn()
    render(<SearchResults products={products} onAddToCart={onAddToCart} />)

    const blueberry = card('검색 결과', '국산 냉동 블루베리 500g')
    expect(within(blueberry).getByText('11,520원')).toBeInTheDocument()
    expect(within(blueberry).queryByText(/위$/)).not.toBeInTheDocument()

    await user.click(within(blueberry).getByRole('button', { name: '장바구니 담기' }))

    expect(onAddToCart).toHaveBeenCalledWith(products[2])
  })

  it('다 팔린 상품은 담을 수 없다', () => {
    render(<SearchResults products={products} onAddToCart={vi.fn()} />)

    const tangerine = card('검색 결과', '제주 감귤 3kg')
    expect(within(tangerine).getByText('품절')).toBeInTheDocument()
    expect(within(tangerine).getByRole('button', { name: '장바구니 담기' })).toBeDisabled()
  })
})

describe('함께 사면 좋은 상품', () => {
  it('사진 없이 작게 보여 주고, 짧은 담기 버튼을 단다', async () => {
    const user = userEvent.setup()
    const onAddToCart = vi.fn()
    render(<CartRecommendations products={products} onAddToCart={onAddToCart} />)

    const shineMuscat = card('함께 사면 좋은 상품', '무농약 샤인머스캣 1kg')
    expect(within(shineMuscat).queryByRole('img')).not.toBeInTheDocument()
    expect(within(shineMuscat).getByText('26,320원')).toBeInTheDocument()

    await user.click(within(shineMuscat).getByRole('button', { name: '담기' }))

    expect(onAddToCart).toHaveBeenCalledWith(products[0])
    expect(within(card('함께 사면 좋은 상품', '제주 감귤 3kg')).getByRole('button', { name: '담기' })).toBeDisabled()
  })
})
