import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ShopPage } from './ShopPage'
import { ShopView } from '../features/shop/components/ShopView'
import { previews, profileSample, reviewSamples } from '../features/shop/components/ShopView.preview'
import type { Review, ShopApi, ShopProfile } from '../features/shop/types/shop'

afterEach(cleanup)
const profileRegion = () => screen.getByRole('region', { name: '가게 소개' })
const reviewRegion = () => screen.getByRole('region', { name: '방문 후기' })
function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (error: Error) => void
  const promise = new Promise<T>((done, fail) => {
    resolve = done
    reject = fail
  })
  return { promise, resolve, reject }
}
function apiFactory() {
  return {
    loadProfile: vi.fn<ShopApi['loadProfile']>().mockResolvedValue(profileSample),
    loadReviews: vi.fn<ShopApi['loadReviews']>().mockResolvedValue(reviewSamples),
  }
}

describe('제공 UI 준비 검사 — 풀이 완료가 아님', () => {
  it('두 영역의 이름과 미조회 표시를 제공한다', () => {
    render(<ShopView {...previews.idle!} onRetryProfile={vi.fn()} onRetryReviews={vi.fn()} />)
    expect(within(profileRegion()).getByText('아직 가게 소개를 불러오지 않았어요.')).toBeVisible()
    expect(within(reviewRegion()).getByText('아직 방문 후기를 불러오지 않았어요.')).toBeVisible()
  })
  it('부분 실패는 가게 소개를 유지하고 후기 재시도만 연결한다', async () => {
    const retryProfile = vi.fn(),
      retryReviews = vi.fn()
    render(<ShopView {...previews.partial!} onRetryProfile={retryProfile} onRetryReviews={retryReviews} />)
    expect(screen.getByText(profileSample.name)).toBeVisible()
    await userEvent.setup().click(screen.getByRole('button', { name: '방문 후기 다시 불러오기' }))
    expect(retryReviews).toHaveBeenCalledTimes(1)
    expect(retryProfile).not.toHaveBeenCalled()
  })
  it('후기 로딩 표시에는 비활성을 적용하고 소개를 숨기지 않는다', () => {
    render(<ShopView {...previews.retrying!} onRetryProfile={vi.fn()} onRetryReviews={vi.fn()} />)
    expect(screen.getByRole('button', { name: /방문 후기 불러오는 중/ })).toBeDisabled()
    expect(screen.getByText(profileSample.name)).toBeVisible()
  })
  it('빈 후기는 정상 상태로 안내하고 재시도를 표시하지 않는다', () => {
    render(<ShopView {...previews.empty!} onRetryProfile={vi.fn()} onRetryReviews={vi.fn()} />)
    expect(within(reviewRegion()).getByRole('status')).toHaveTextContent('아직 방문 후기가 없어요.')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})

// 구현 후 describe.skip을 describe로 바꾸세요.
describe.skip('실습자가 구현할 사용자 행동', () => {
  it('두 조회를 다른 응답을 기다리지 않고 시작한다', async () => {
    const p = deferred<ShopProfile>(),
      r = deferred<Review[]>()
    const api = apiFactory()
    api.loadProfile.mockReturnValue(p.promise)
    api.loadReviews.mockReturnValue(r.promise)
    render(<ShopPage api={api} />)
    expect(api.loadProfile).toHaveBeenCalledTimes(1)
    expect(api.loadReviews).toHaveBeenCalledTimes(1)
    expect(within(profileRegion()).getByRole('status')).toHaveTextContent('가게 소개를 불러오고 있어요.')
    expect(within(reviewRegion()).getByRole('status')).toHaveTextContent('방문 후기를 불러오고 있어요.')
    await act(async () => {
      p.resolve(profileSample)
      r.resolve(reviewSamples)
    })
  })
  it('소개가 먼저 성공하면 후기 완료를 기다리지 않고 소개를 보여 준다', async () => {
    const r = deferred<Review[]>()
    const api = apiFactory()
    api.loadReviews.mockReturnValue(r.promise)
    render(<ShopPage api={api} />)
    expect(await screen.findByText(profileSample.name)).toBeVisible()
    expect(within(reviewRegion()).getByRole('status')).toHaveTextContent('방문 후기를 불러오고 있어요.')
    await act(async () => r.resolve(reviewSamples))
  })
  it('후기가 먼저 성공해도 소개 완료를 기다리지 않고 후기를 보여 준다', async () => {
    const p = deferred<ShopProfile>()
    const api = apiFactory()
    api.loadProfile.mockReturnValue(p.promise)
    render(<ShopPage api={api} />)
    expect(await screen.findByText(reviewSamples[0]!.body)).toBeVisible()
    expect(within(profileRegion()).getByRole('status')).toHaveTextContent('가게 소개를 불러오고 있어요.')
    await act(async () => p.resolve(profileSample))
  })
  it('후기 실패와 재시도는 성공한 소개를 유지하고 소개를 다시 요청하지 않는다', async () => {
    const api = apiFactory()
    api.loadReviews.mockRejectedValueOnce(new Error('offline'))
    render(<ShopPage api={api} />)
    await screen.findByText(profileSample.name)
    expect(await within(reviewRegion()).findByRole('alert')).toHaveTextContent('방문 후기를 불러오지 못했어요.')
    const retry = deferred<Review[]>()
    api.loadReviews.mockReturnValueOnce(retry.promise)
    await userEvent.setup().click(screen.getByRole('button', { name: '방문 후기 다시 불러오기' }))
    expect(screen.getByText(profileSample.name)).toBeVisible()
    expect(within(reviewRegion()).queryByRole('alert')).not.toBeInTheDocument()
    expect(api.loadProfile).toHaveBeenCalledTimes(1)
    await act(async () => retry.resolve(reviewSamples))
    expect(await screen.findByText(reviewSamples[0]!.body)).toBeVisible()
    expect(api.loadReviews).toHaveBeenCalledTimes(2)
  })
  it('소개 실패와 재시도는 성공한 후기를 유지한다', async () => {
    const api = apiFactory()
    api.loadProfile.mockRejectedValueOnce(new Error('offline'))
    render(<ShopPage api={api} />)
    await screen.findByText(reviewSamples[0]!.body)
    await within(profileRegion()).findByRole('alert')
    await userEvent.setup().click(screen.getByRole('button', { name: '가게 소개 다시 불러오기' }))
    expect(await screen.findByText(profileSample.name)).toBeVisible()
    expect(screen.getByText(reviewSamples[0]!.body)).toBeVisible()
    expect(api.loadReviews).toHaveBeenCalledTimes(1)
    expect(api.loadProfile).toHaveBeenCalledTimes(2)
  })
  it('양쪽 실패 후 한 영역 재시도 중에도 다른 오류를 유지하고 중복 클릭을 막는다', async () => {
    const api = apiFactory()
    api.loadProfile.mockRejectedValueOnce(new Error('offline'))
    api.loadReviews.mockRejectedValueOnce(new Error('offline'))
    render(<ShopPage api={api} />)
    await within(profileRegion()).findByRole('alert')
    await within(reviewRegion()).findByRole('alert')
    const retry = deferred<Review[]>()
    api.loadReviews.mockReturnValueOnce(retry.promise)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: '방문 후기 다시 불러오기' }))
    expect(within(profileRegion()).getByRole('alert')).toBeVisible()
    const button = screen.getByRole('button', { name: /방문 후기 불러오는 중/ })
    expect(button).toBeDisabled()
    await user.click(button)
    expect(api.loadReviews).toHaveBeenCalledTimes(2)
    await act(async () => retry.resolve(reviewSamples))
  })
  it('빈 후기 성공은 실패나 미조회로 되돌리지 않는다', async () => {
    const api = apiFactory()
    api.loadReviews.mockResolvedValue([])
    render(<ShopPage api={api} />)
    await within(reviewRegion()).findByText('아직 방문 후기가 없어요. 가게 소개를 먼저 살펴보세요.')
    expect(within(reviewRegion()).getByRole('status')).toHaveTextContent('아직 방문 후기가 없어요.')
    expect(within(reviewRegion()).queryByRole('button')).not.toBeInTheDocument()
    expect(await screen.findByText(profileSample.name)).toBeVisible()
  })
})
