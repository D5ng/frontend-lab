import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createPageLoader, demoPages, type Page } from './api'
import { FeedView } from './view'
import { previews } from './preview'
import { FeedPager } from './starter'

afterEach(cleanup)
function deferred() {
  let resolve: (page: Page) => void = () => {}
  let reject: (error: Error) => void = () => {}
  const promise = new Promise<Page>((complete, fail) => {
    resolve = complete
    reject = fail
  })
  return { promise, resolve, reject }
}
const first = demoPages.start,
  next = demoPages['next-1'],
  last = demoPages['next-2']

describe('출제 준비물: 화면과 HTTP 모의 API', () => {
  it.each(Object.keys(previews))('%s 화면의 목록과 두 액션 상태가 표현 계약과 같다', (key) => {
    const props = previews[key]
    render(<FeedView {...props} />)
    expect(screen.getByRole('button', { name: '목록 새로고침' })).toHaveProperty('disabled', props.loading)
    expect(
      screen.getByRole('button', {
        name: props.loadingMore ? '다음 페이지 불러오는 중' : props.error === 'more' ? '다음 페이지 다시 불러오기' : '더보기',
      }),
    ).toHaveProperty('disabled', !props.canLoadMore)
    for (const post of props.items) expect(screen.getByText(post.title)).toBeVisible()
    if (props.error)
      expect(screen.getByRole('alert')).toHaveTextContent(
        props.error === 'initial' ? '목록을 불러오지 못했어요.' : '다음 페이지를 불러오지 못했어요.',
      )
    if (key === 'loading') expect(screen.getByRole('status')).toHaveTextContent('나눔 목록을 불러오고 있어요.')
    if (key === 'complete') expect(screen.getByRole('status')).toHaveTextContent('모든 나눔 글을 확인했어요.')
    if (key === 'empty') expect(screen.getByRole('status')).toHaveTextContent('아직 나눔 글이 없어요.')
  })
  it('두 버튼이 콜백을 전달하지만 화면은 요청을 직접 시작하지 않는다', async () => {
    const user = userEvent.setup(),
      onRefresh = vi.fn(),
      onLoadMore = vi.fn()
    render(<FeedView {...previews.ready} onRefresh={onRefresh} onLoadMore={onLoadMore} />)
    await user.click(screen.getByRole('button', { name: '더보기' }))
    await user.click(screen.getByRole('button', { name: '목록 새로고침' }))
    expect(onRefresh).toHaveBeenCalledOnce()
    expect(onLoadMore).toHaveBeenCalledOnce()
  })
  it('HTTP 첫 페이지·마지막 페이지의 데이터와 cursor를 반환한다', async () => {
    const load = createPageLoader()
    const [start, end] = await Promise.all([load(null), load('next-2')])
    expect(start).toEqual(first)
    expect(end).toEqual(last)
  })
  it('동일 세션 next-1 첫 실패 후 같은 cursor 재시도가 중복 글과 새 글을 반환한다', async () => {
    const load = createPageLoader()
    await expect(load('next-1')).rejects.toThrow('다음 페이지 확인 실패')
    await expect(load('next-1')).resolves.toEqual(next)
  }, 10000)
})

// 풀이 시작 시 describe.skip을 describe로 변경하세요. 정답 로직은 제공하지 않습니다.
describe.skip('직접 구현할 목록 행동', () => {
  it('진입 조회 후 cursor로 한 번씩 더보며 ID 중복을 최초 등장 순서로 제거한다', async () => {
    const user = userEvent.setup(),
      load = vi
        .fn()
        .mockResolvedValueOnce({ ...first, items: [first.items[0], first.items[1], { ...first.items[1], title: '중복된 다른 제목' }] })
        .mockResolvedValueOnce(next)
        .mockResolvedValueOnce(last)
    render(<FeedPager loadPage={load} />)
    await screen.findByText(first.items[0].title)
    expect(load).toHaveBeenCalledExactlyOnceWith(null)
    expect(screen.queryByText('중복된 다른 제목')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '더보기' }))
    await screen.findByText(next.items[1].title)
    expect(screen.getAllByText(first.items[1].title)).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: '더보기' }))
    await screen.findByText(last.items[0].title)
    expect(load.mock.calls).toEqual([[null], ['next-1'], ['next-2']])
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(
      [...first.items, next.items[1], last.items[0]].map((post) => post.title + post.location),
    )
    expect(screen.getByRole('button', { name: '더보기' })).toBeDisabled()
    expect(screen.getByRole('status')).toHaveTextContent('모든 나눔 글을 확인했어요.')
  })
  it('다음 페이지 실패는 목록·cursor를 보존하고 재시도 시 오류를 지운다', async () => {
    const user = userEvent.setup(),
      pending = deferred(),
      retry = deferred()
    const load = vi.fn().mockResolvedValueOnce(first).mockReturnValueOnce(pending.promise).mockReturnValueOnce(retry.promise)
    render(<FeedPager loadPage={load} />)
    await screen.findByText(first.items[0].title)
    await user.click(screen.getByRole('button', { name: '더보기' }))
    expect(screen.getByRole('button', { name: '다음 페이지 불러오는 중' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '목록 새로고침' })).toBeEnabled()
    await user.click(screen.getByRole('button', { name: '다음 페이지 불러오는 중' }))
    expect(load).toHaveBeenCalledTimes(2)
    await act(async () => pending.reject(new Error('실패')))
    expect(screen.getByText(first.items[0].title)).toBeVisible()
    expect(screen.getByRole('alert')).toHaveTextContent('다음 페이지를 불러오지 못했어요.')
    await user.click(screen.getByRole('button', { name: '다음 페이지 다시 불러오기' }))
    expect(load).toHaveBeenNthCalledWith(3, 'next-1')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    await act(async () => retry.resolve(next))
    expect(screen.getByText(next.items[1].title)).toBeVisible()
  })
  it.each(['성공', '실패'] as const)('이전 더보기 %s·완료가 새 첫 조회의 진행 상태를 끝내지 않는다', async (outcome) => {
    const user = userEvent.setup(),
      old = deferred(),
      fresh = deferred()
    const load = vi.fn().mockResolvedValueOnce(first).mockReturnValueOnce(old.promise).mockReturnValueOnce(fresh.promise)
    render(<FeedPager loadPage={load} />)
    await screen.findByText(first.items[0].title)
    await user.click(screen.getByRole('button', { name: '더보기' }))
    await user.click(screen.getByRole('button', { name: '목록 새로고침' }))
    expect(screen.queryByText(first.items[0].title)).not.toBeInTheDocument()
    expect(load).toHaveBeenNthCalledWith(3, null)
    await act(async () => (outcome === '성공' ? old.resolve(next) : old.reject(new Error('늦은 실패'))))
    expect(screen.getByRole('status')).toHaveTextContent('나눔 목록을 불러오고 있어요.')
    expect(screen.getByRole('button', { name: '더보기' })).toBeDisabled()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    await act(async () => fresh.resolve(first))
    expect(screen.getByRole('button', { name: '더보기' })).toBeEnabled()
  })
  it('같은 cursor의 이전 응답도 새 더보기 진행과 목록·cursor를 바꾸지 않는다', async () => {
    const user = userEvent.setup(),
      old = deferred(),
      freshMore = deferred()
    const load = vi
      .fn()
      .mockResolvedValueOnce(first)
      .mockReturnValueOnce(old.promise)
      .mockResolvedValueOnce(first)
      .mockReturnValueOnce(freshMore.promise)
    render(<FeedPager loadPage={load} />)
    await screen.findByText(first.items[0].title)
    await user.click(screen.getByRole('button', { name: '더보기' }))
    await user.click(screen.getByRole('button', { name: '목록 새로고침' }))
    await screen.findByText(first.items[0].title)
    await user.click(screen.getByRole('button', { name: '더보기' }))
    await act(async () => old.resolve(last))
    expect(screen.queryByText(last.items[0].title)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '다음 페이지 불러오는 중' })).toBeDisabled()
    await act(async () => freshMore.resolve(next))
    expect(screen.getByText(next.items[1].title)).toBeVisible()
    expect(screen.getByRole('button', { name: '더보기' })).toBeEnabled()
    expect(load.mock.calls).toEqual([[null], ['next-1'], [null], ['next-1']])
  })
  it('이전 실패가 이미 준비된 새 목록을 오류로 바꾸지 않는다', async () => {
    const user = userEvent.setup(),
      old = deferred()
    const load = vi.fn().mockResolvedValueOnce(first).mockReturnValueOnce(old.promise).mockResolvedValueOnce(last)
    render(<FeedPager loadPage={load} />)
    await screen.findByText(first.items[0].title)
    await user.click(screen.getByRole('button', { name: '더보기' }))
    await user.click(screen.getByRole('button', { name: '목록 새로고침' }))
    await screen.findByText(last.items[0].title)
    await act(async () => old.reject(new Error('실패')))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByText(last.items[0].title)).toBeVisible()
  })
  it('첫 실패는 새로고침으로 null부터 재시도한다', async () => {
    const user = userEvent.setup(),
      load = vi.fn().mockRejectedValueOnce(new Error('실패')).mockResolvedValueOnce(first)
    render(<FeedPager loadPage={load} />)
    await screen.findByRole('alert')
    expect(screen.getByRole('button', { name: '더보기' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: '목록 새로고침' }))
    await screen.findByText(first.items[0].title)
    expect(load.mock.calls).toEqual([[null], [null]])
  })
  it('빈 첫 페이지는 실패가 아니며 자동 더보기 없이 새로고침할 수 있다', async () => {
    const load = vi.fn().mockResolvedValue({ items: [], nextCursor: null })
    render(<FeedPager loadPage={load} />)
    await screen.findByText('아직 나눔 글이 없어요. 나중에 새로고침해 주세요.')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '목록 새로고침' })).toBeEnabled()
    expect(screen.getByRole('button', { name: '더보기' })).toBeDisabled()
    expect(load).toHaveBeenCalledOnce()
  })
})
