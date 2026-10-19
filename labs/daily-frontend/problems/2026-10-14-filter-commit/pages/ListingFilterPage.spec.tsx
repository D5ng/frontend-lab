import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ListingFilterPage } from './ListingFilterPage'
import { initialListings } from '../features/listingFilter/apis/initialListings'
import type { Listing, SearchListings } from '../features/listingFilter/types/listing'

afterEach(cleanup)

function deferred() {
  let resolve!: (items: Listing[]) => void
  let reject!: (error: Error) => void
  const promise = new Promise<Listing[]>((done, fail) => {
    resolve = done
    reject = fail
  })
  return { promise, resolve, reject }
}
function setup(api = vi.fn<SearchListings>().mockResolvedValue(initialListings)) {
  render(<ListingFilterPage searchListings={api} />)
  return { user: userEvent.setup(), api }
}
const applyButton = () => screen.getByRole('button', { name: '선택한 조건 적용' })
async function selectOnlyFurniture(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('checkbox', { name: '생활용품' }))
  await user.click(screen.getByRole('checkbox', { name: '도서' }))
}

describe('선택 중인 조건과 적용된 목록', () => {
  it('최초 목록을 보여주고 선택을 바꿔도 적용 전에는 요청하거나 목록을 바꾸지 않는다', async () => {
    const { user, api } = setup()
    expect(applyButton()).toBeDisabled()
    await selectOnlyFurniture(user)
    expect(api).not.toHaveBeenCalled()
    expect(screen.getByText('선택 중: 가구')).toBeVisible()
    expect(screen.getByText('적용된 조건: 가구, 생활용품, 도서')).toBeVisible()
    expect(within(screen.getByRole('list', { name: '동네 물건' })).getAllByRole('listitem')).toHaveLength(3)
  })
  it('선택을 되돌리면 다시 적용할 수 없고 요청하지 않는다', async () => {
    const { user, api } = setup()
    const books = screen.getByRole('checkbox', { name: '도서' })
    await user.click(books)
    expect(applyButton()).toBeEnabled()
    await user.click(books)
    expect(applyButton()).toBeDisabled()
    expect(api).not.toHaveBeenCalled()
  })
  it('아무것도 선택하지 않으면 안내하고 기존 목록을 유지한다', async () => {
    const { user, api } = setup()
    await selectOnlyFurniture(user)
    await user.click(screen.getByRole('checkbox', { name: '가구' }))
    await user.click(applyButton())
    expect(screen.getByRole('alert')).toHaveTextContent('카테고리를 하나 이상 선택해 주세요.')
    expect(api).not.toHaveBeenCalled()
    expect(screen.getByText('머그컵 두 개')).toBeVisible()
    await user.click(screen.getByRole('checkbox', { name: '가구' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
  it('불러오는 중에는 중복 적용을 막지만 다음 선택과 기존 목록은 유지한다', async () => {
    const task = deferred()
    const { user, api } = setup(vi.fn<SearchListings>().mockReturnValue(task.promise))
    await selectOnlyFurniture(user)
    await user.click(applyButton())
    const pendingButton = screen.getByRole('button', { name: /목록 불러오는 중/ })
    expect(pendingButton).toBeDisabled()
    await user.click(pendingButton)
    await user.click(screen.getByRole('checkbox', { name: '도서' }))
    expect(api).toHaveBeenCalledTimes(1)
    expect(api).toHaveBeenCalledWith(['furniture'])
    expect(screen.getByText('선택 중: 가구, 도서')).toBeVisible()
    expect(screen.getByText('머그컵 두 개')).toBeVisible()
    await act(async () => task.resolve(initialListings.filter((item) => item.category === 'furniture')))
    expect(screen.getByText('적용된 조건: 가구')).toBeVisible()
    expect(screen.queryByText('머그컵 두 개')).not.toBeInTheDocument()
    expect(screen.getByText('선택 중: 가구, 도서')).toBeVisible()
    expect(applyButton()).toBeEnabled()
    expect(screen.getByRole('status')).toHaveTextContent('선택한 조건으로 목록을 바꿨어요.')
  })
  it('실패하면 적용된 조건과 목록, 요청 중 바꾼 선택을 보존하고 최신 선택으로 재시도한다', async () => {
    const task = deferred()
    const api = vi
      .fn<SearchListings>()
      .mockReturnValueOnce(task.promise)
      .mockResolvedValue(initialListings.filter((item) => item.category === 'furniture'))
    const { user } = setup(api)
    await selectOnlyFurniture(user)
    await user.click(applyButton())
    await user.click(screen.getByRole('checkbox', { name: '도서' }))
    await act(async () => task.reject(new Error('offline')))
    expect(screen.getByRole('alert')).toHaveTextContent('목록을 바꾸지 못했어요.')
    expect(screen.getByText('적용된 조건: 가구, 생활용품, 도서')).toBeVisible()
    expect(screen.getByText('머그컵 두 개')).toBeVisible()
    expect(screen.getByRole('checkbox', { name: '도서' })).toBeChecked()
    await user.click(applyButton())
    await screen.findByText('적용된 조건: 가구, 도서')
    expect(api).toHaveBeenNthCalledWith(2, ['furniture', 'books'])
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(applyButton()).toBeDisabled()
  })
  it('성공 후 같은 조건을 다시 적용하지 않고 편집하면 이전 성공 안내를 지운다', async () => {
    const { user } = setup(vi.fn<SearchListings>().mockResolvedValue(initialListings.slice(0, 2)))
    await selectOnlyFurniture(user)
    await user.click(applyButton())
    await screen.findByText('적용된 조건: 가구')
    expect(applyButton()).toBeDisabled()
    await user.click(screen.getByRole('checkbox', { name: '도서' }))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(applyButton()).toBeEnabled()
  })
  it('성공 응답이 비어 있어도 조건을 적용하고 다른 선택을 안내한다', async () => {
    const { user } = setup(vi.fn<SearchListings>().mockResolvedValue([]))
    await user.click(screen.getByRole('checkbox', { name: '가구' }))
    await user.click(screen.getByRole('checkbox', { name: '생활용품' }))
    await user.click(applyButton())
    await screen.findByText('적용된 조건: 도서')
    expect(screen.getByText('동네 물건 · 0개')).toBeVisible()
    expect(screen.getByText('아직 등록된 물건이 없어요. 다른 카테고리를 골라 적용해 보세요.')).toBeVisible()
    expect(screen.queryByRole('list', { name: '동네 물건' })).not.toBeInTheDocument()
  })
  it('키보드 Space로 선택을 바꿀 수 있다', async () => {
    const { user } = setup()
    screen.getByRole('checkbox', { name: '가구' }).focus()
    await user.keyboard(' ')
    expect(screen.getByRole('checkbox', { name: '가구' })).not.toBeChecked()
    expect(applyButton()).toBeEnabled()
  })
})
