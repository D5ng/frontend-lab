import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { LoadProducts, Product } from '../features/cartStock/types/product'
import { CartStockPage } from './CartStockPage'

afterEach(cleanup)

const products: Product[] = [
  { id: 'bread', name: '감자빵', price: 3500, stock: 5 },
  { id: 'juice', name: '사과주스', price: 2500, stock: 4 },
  { id: 'soup', name: '수프', price: 6000, stock: 2 },
]
const changed: Product[] = [
  { id: 'bread', name: '감자빵', price: 3500, stock: 1 },
  { id: 'juice', name: '사과주스', price: 3000, stock: 4 },
  { id: 'cookie', name: '쿠키', price: 2000, stock: 3 },
]

function deferred() {
  let resolve!: (value: Product[]) => void
  let reject!: (reason: Error) => void
  const promise = new Promise<Product[]>((complete, fail) => {
    resolve = complete
    reject = fail
  })
  return { promise, resolve, reject }
}

async function enter(user: ReturnType<typeof userEvent.setup>, name: string, value: string) {
  const input = screen.getByRole('textbox', { name: `${name} 수량` })
  await user.clear(input)
  if (value) await user.type(input, value)
  return input
}

it('구현 전에는 제목과 SEED 레이아웃 골격을 제공한다', () => {
  render(<CartStockPage loadProducts={vi.fn()} />)
  expect(screen.getByRole('heading', { name: '오늘 담을 상품' })).toBeVisible()
})

// 직접 구현 후 describe.skip을 describe로 바꾸세요. 아래 행동은 아직 미구현입니다.
describe.skip('실습자가 활성화할 장바구니 행동', () => {
  it('첫 조회 중 대기를 표시하고 완료 전을 빈 성공으로 표시하지 않는다', async () => {
    const request = deferred()
    const load = vi.fn<LoadProducts>(() => request.promise)
    render(<CartStockPage loadProducts={load} />)
    await waitFor(() => expect(load).toHaveBeenCalledTimes(1))
    expect(screen.getByText('상품을 불러오고 있어요.')).toBeVisible()
    expect(screen.getByRole('button', { name: /가격·재고 새로고침/ })).toBeDisabled()
    expect(screen.queryByText('지금 담을 수 있는 상품이 없어요. 다시 불러와 주세요.')).not.toBeInTheDocument()
    await act(async () => request.resolve(products))
    expect(await screen.findByRole('textbox', { name: '감자빵 수량' })).toHaveValue('0')
    expect(screen.getByRole('region', { name: '장바구니 합계' })).toHaveTextContent('0개')
    expect(screen.getByRole('region', { name: '장바구니 합계' })).toHaveTextContent('0원')
  })

  it('최초 실패를 알리고 같은 버튼으로 재시도할 수 있다', async () => {
    const user = userEvent.setup()
    const load = vi.fn<LoadProducts>().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(products)
    render(<CartStockPage loadProducts={load} />)
    expect(await screen.findByRole('alert')).toHaveTextContent('상품을 불러오지 못했어요. 다시 시도해 주세요.')
    await user.click(screen.getByRole('button', { name: /가격·재고 새로고침/ }))
    expect(await screen.findByRole('textbox', { name: '감자빵 수량' })).toBeEnabled()
    expect(load).toHaveBeenCalledTimes(2)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('숫자만 두 자리까지 받고 여러 상품의 수량·금액을 계산하며 빈 입력은 0으로 해석한다', async () => {
    const user = userEvent.setup()
    const load = vi.fn<LoadProducts>().mockResolvedValue(products)
    render(<CartStockPage loadProducts={load} />)
    await screen.findByRole('textbox', { name: '감자빵 수량' })
    await enter(user, '감자빵', 'a2b')
    await enter(user, '사과주스', '1')
    const total = screen.getByRole('region', { name: '장바구니 합계' })
    expect(total).toHaveTextContent('3개')
    expect(total).toHaveTextContent('9,500원')
    const bread = await enter(user, '감자빵', '')
    expect(bread).toHaveValue('')
    expect(total).toHaveTextContent('1개')
    expect(total).toHaveTextContent('2,500원')
    await enter(user, '감자빵', '123')
    expect(bread).toHaveValue('12')
    expect(load).toHaveBeenCalledTimes(1)
  })

  it('현재 재고를 넘으면 입력을 몰래 보정하지 않고 필드 오류와 합계 보류를 표시한다', async () => {
    const user = userEvent.setup()
    render(<CartStockPage loadProducts={vi.fn().mockResolvedValue(products)} />)
    await screen.findByRole('textbox', { name: '감자빵 수량' })
    const bread = await enter(user, '감자빵', '6')
    expect(bread).toHaveValue('6')
    expect(bread).toBeInvalid()
    expect(screen.getByText('감자빵은 5개까지 담을 수 있어요.')).toBeVisible()
    expect(screen.getByRole('region', { name: '장바구니 합계' })).toHaveTextContent('수량을 확인해 주세요.')
    await enter(user, '감자빵', '5')
    expect(bread).not.toBeInvalid()
    expect(screen.getByRole('region', { name: '장바구니 합계' })).toHaveTextContent('17,500원')
  })

  it('재조회 중에는 기존 입력과 합계를 보존한 채 잠그고 실패 후에도 유지한다', async () => {
    const user = userEvent.setup()
    const refresh = deferred()
    const load = vi
      .fn<LoadProducts>()
      .mockResolvedValueOnce(products)
      .mockImplementationOnce(() => refresh.promise)
    render(<CartStockPage loadProducts={load} />)
    await screen.findByRole('textbox', { name: '감자빵 수량' })
    const bread = await enter(user, '감자빵', '2')
    await user.click(screen.getByRole('button', { name: /가격·재고 새로고침/ }))
    for (const input of screen.getAllByRole('textbox')) expect(input).toBeDisabled()
    expect(screen.getByRole('region', { name: '장바구니 합계' })).toHaveTextContent('7,000원')
    await user.click(screen.getByRole('button', { name: /가격·재고 새로고침/ }))
    expect(load).toHaveBeenCalledTimes(2)
    await act(async () => refresh.reject(new Error('offline')))
    expect(await screen.findByRole('alert')).toBeVisible()
    expect(bread).toHaveValue('2')
    expect(bread).toBeEnabled()
    expect(screen.getByRole('region', { name: '장바구니 합계' })).toHaveTextContent('7,000원')
  })

  it('재조회 성공은 남은 상품의 수량을 보존하고 새 가격·재고로 검증하며 사라진 상품을 합계에서 뺀다', async () => {
    const user = userEvent.setup()
    const load = vi.fn<LoadProducts>().mockResolvedValueOnce(products).mockResolvedValueOnce(changed)
    render(<CartStockPage loadProducts={load} />)
    await screen.findByRole('textbox', { name: '감자빵 수량' })
    await enter(user, '감자빵', '2')
    await enter(user, '사과주스', '1')
    await enter(user, '수프', '1')
    await user.click(screen.getByRole('button', { name: /가격·재고 새로고침/ }))
    expect(await screen.findByRole('textbox', { name: '쿠키 수량' })).toHaveValue('0')
    expect(screen.queryByRole('textbox', { name: '수프 수량' })).not.toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: '감자빵 수량' })).toHaveValue('2')
    expect(screen.getByRole('textbox', { name: '감자빵 수량' })).toBeInvalid()
    expect(screen.getByText('감자빵은 1개까지 담을 수 있어요.')).toBeVisible()
    const total = screen.getByRole('region', { name: '장바구니 합계' })
    expect(total).toHaveTextContent('수량을 확인해 주세요.')
    expect(total).not.toHaveTextContent('15,500원')
    await enter(user, '감자빵', '1')
    expect(total).toHaveTextContent('2개')
    expect(total).toHaveTextContent('6,500원')
  })

  it('사라졌다가 다시 조회된 상품은 예전 수량을 되살리지 않는다', async () => {
    const user = userEvent.setup()
    const load = vi.fn<LoadProducts>().mockResolvedValueOnce(products).mockResolvedValueOnce(changed).mockResolvedValueOnce(products)
    render(<CartStockPage loadProducts={load} />)
    await screen.findByRole('textbox', { name: '수프 수량' })
    await enter(user, '수프', '2')
    await user.click(screen.getByRole('button', { name: /가격·재고 새로고침/ }))
    await screen.findByRole('textbox', { name: '쿠키 수량' })
    await user.click(screen.getByRole('button', { name: /가격·재고 새로고침/ }))
    expect(await screen.findByRole('textbox', { name: '수프 수량' })).toHaveValue('0')
    expect(screen.getByRole('region', { name: '장바구니 합계' })).toHaveTextContent('0원')
  })

  it('빈 성공은 상품 없음으로 표시하며 수량과 합계를 비운다', async () => {
    const user = userEvent.setup()
    const load = vi.fn<LoadProducts>().mockResolvedValueOnce(products).mockResolvedValueOnce([])
    render(<CartStockPage loadProducts={load} />)
    await screen.findByRole('textbox', { name: '감자빵 수량' })
    await enter(user, '감자빵', '2')
    await user.click(screen.getByRole('button', { name: /가격·재고 새로고침/ }))
    expect(await screen.findByText('지금 담을 수 있는 상품이 없어요. 다시 불러와 주세요.')).toBeVisible()
    expect(screen.queryAllByRole('textbox')).toHaveLength(0)
    expect(screen.getByRole('region', { name: '장바구니 합계' })).toHaveTextContent('0원')
    expect(screen.getByRole('button', { name: /가격·재고 새로고침/ })).toBeEnabled()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('품절 상품도 0은 유효하며 양수가 입력되면 오류를 표시한다', async () => {
    const user = userEvent.setup()
    render(<CartStockPage loadProducts={vi.fn().mockResolvedValue([{ ...products[0]!, stock: 0 }])} />)
    const bread = await screen.findByRole('textbox', { name: '감자빵 수량' })
    expect(bread).not.toBeInvalid()
    await enter(user, '감자빵', '1')
    expect(bread).toBeInvalid()
    expect(screen.getByText('감자빵은 0개까지 담을 수 있어요.')).toBeVisible()
    await enter(user, '감자빵', '0')
    expect(bread).not.toBeInvalid()
    expect(screen.getByRole('region', { name: '장바구니 합계' })).toHaveTextContent('0원')
  })
})
