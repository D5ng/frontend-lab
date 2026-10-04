import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createDemoLoader, examplePosts } from './api'
import type { Post } from './api'
import { NeighborhoodFeed } from './starter'
import { FeedView } from './view'
import { previews } from './preview'

afterEach(cleanup)

function deferred() {
  let resolve: (posts: Post[]) => void = () => {}
  let reject: (error: Error) => void = () => {}
  const promise = new Promise<Post[]>((done, fail) => {
    resolve = done
    reject = fail
  })
  return { promise, resolve, reject }
}

describe('출제자가 제공한 UI와 모의 API', () => {
  it('동네 라벨·게시글 정보를 표시하고 선택과 재요청을 전달한다', async () => {
    const user = userEvent.setup()
    const change = vi.fn()
    const reload = vi.fn()
    render(<FeedView {...previews.success} onNeighborhoodChange={change} onReload={reload} />)
    expect(screen.getByRole('radiogroup', { name: '게시글 동네' })).toBeVisible()
    expect(screen.getByRole('list', { name: '게시글 목록' })).toHaveTextContent('성수동 · 7,000원')
    await user.click(screen.getByRole('radio', { name: '연남동' }))
    expect(change).toHaveBeenCalledWith('yeonnam')
    await user.click(screen.getByRole('button', { name: '다시 불러오기' }))
    expect(reload).toHaveBeenCalledTimes(1)
  })

  it('대기 화면은 동네 선택을 열어 두고 재요청 버튼만 잠근다', async () => {
    const user = userEvent.setup()
    const change = vi.fn()
    render(<FeedView {...previews.loading} onNeighborhoodChange={change} />)
    expect(screen.getByRole('status')).toHaveTextContent('게시글을 불러오고 있어요.')
    expect(screen.getByRole('button')).toBeDisabled()
    for (const radio of screen.getAllByRole('radio')) expect(radio).toBeEnabled()
    await user.click(screen.getByRole('radio', { name: '망원동' }))
    expect(change).toHaveBeenCalledWith('mangwon')
  })

  it('오류·빈 목록·성공은 서로 다른 안내를 제공한다', () => {
    const { rerender } = render(<FeedView {...previews.error} />)
    expect(screen.getByRole('status')).toHaveTextContent('게시글을 불러오지 못했어요.')
    rerender(<FeedView {...previews.empty} />)
    expect(screen.getByRole('status')).toHaveTextContent('아직 게시글이 없어요.')
    rerender(<FeedView {...previews.success} />)
    expect(screen.getByRole('status')).toHaveTextContent('게시글 2개를 불러왔어요.')
  })

  it('성수는 1.8초, 망원은 0.7초 뒤 각각 게시글과 빈 목록을 응답한다', async () => {
    vi.useFakeTimers()
    try {
      const api = createDemoLoader()
      const finish = vi.fn()
      const seongsu = api('seongsu').then(finish)
      const mangwon = expect(api('mangwon')).resolves.toEqual([])
      await vi.advanceTimersByTimeAsync(700)
      await mangwon
      expect(finish).not.toHaveBeenCalled()
      await vi.advanceTimersByTimeAsync(1100)
      await seongsu
      expect(finish).toHaveBeenCalledWith(examplePosts)
    } finally {
      vi.useRealTimers()
    }
  })

  it('연남의 첫 요청만 실패하고 재요청은 연남 게시글을 반환한다', async () => {
    vi.useFakeTimers()
    try {
      const api = createDemoLoader()
      const first = expect(api('yeonnam')).rejects.toThrow('temporary failure')
      await vi.advanceTimersByTimeAsync(450)
      await first
      const next = expect(api('yeonnam')).resolves.toMatchObject([{ neighborhood: 'yeonnam' }])
      await vi.advanceTimersByTimeAsync(450)
      await next
    } finally {
      vi.useRealTimers()
    }
  })
})

// 구현 시작 시 .skip을 제거하세요. 건너뜀은 풀이 통과가 아닙니다.
describe.skip('실습자가 구현할 요청과 현재 화면의 경계', () => {
  it('진입 시 성수 요청을 시작하고 성공한 게시글을 표시한다', async () => {
    const request = deferred()
    const load = vi.fn(() => request.promise)
    render(<NeighborhoodFeed loadPosts={load} />)
    await waitFor(() => expect(load).toHaveBeenCalledExactlyOnceWith('seongsu'))
    expect(screen.getByRole('status')).toHaveTextContent('게시글을 불러오고 있어요.')
    await act(async () => request.resolve(examplePosts))
    expect(screen.getByRole('list')).toHaveTextContent(examplePosts[0].title)
  })

  it('늦은 이전 성공 응답이 현재 망원 빈 목록을 덮지 않는다', async () => {
    const user = userEvent.setup()
    const old = deferred()
    const current = deferred()
    const load = vi.fn().mockReturnValueOnce(old.promise).mockReturnValueOnce(current.promise)
    render(<NeighborhoodFeed loadPosts={load} />)
    await waitFor(() => expect(load).toHaveBeenCalledWith('seongsu'))
    await user.click(screen.getByRole('radio', { name: '망원동' }))
    await waitFor(() => expect(load).toHaveBeenCalledWith('mangwon'))
    await act(async () => current.resolve([]))
    await act(async () => old.resolve(examplePosts))
    expect(screen.getByRole('heading', { name: '망원동 게시글' })).toBeVisible()
    expect(screen.getByRole('status')).toHaveTextContent('아직 게시글이 없어요.')
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('늦은 이전 실패와 완료가 현재 요청의 로딩을 끝내거나 오류를 표시하지 않는다', async () => {
    const user = userEvent.setup()
    const old = deferred()
    const current = deferred()
    const load = vi.fn().mockReturnValueOnce(old.promise).mockReturnValueOnce(current.promise)
    render(<NeighborhoodFeed loadPosts={load} />)
    await waitFor(() => expect(load).toHaveBeenCalledWith('seongsu'))
    await user.click(screen.getByRole('radio', { name: '연남동' }))
    await waitFor(() => expect(load).toHaveBeenCalledWith('yeonnam'))
    await act(async () => old.reject(new Error('old request failed')))
    expect(screen.getByRole('status')).toHaveTextContent('게시글을 불러오고 있어요.')
    expect(screen.getByRole('button')).toBeDisabled()
    await act(async () => current.resolve([]))
    expect(screen.getByRole('status')).toHaveTextContent('아직 게시글이 없어요.')
  })

  it('현재 요청 실패 시 같은 동네로 재시도하며 대기 중 중복 재요청을 막는다', async () => {
    const user = userEvent.setup()
    const retry = deferred()
    const load = vi.fn().mockRejectedValueOnce(new Error('network')).mockReturnValueOnce(retry.promise)
    render(<NeighborhoodFeed loadPosts={load} />)
    await screen.findByText('게시글을 불러오지 못했어요. 다시 불러오거나 다른 동네를 골라 주세요.')
    await user.click(screen.getByRole('button'))
    expect(load).toHaveBeenLastCalledWith('seongsu')
    expect(screen.getByRole('button')).toBeDisabled()
    await user.click(screen.getByRole('button'))
    expect(load).toHaveBeenCalledTimes(2)
    await act(async () => retry.resolve(examplePosts))
    expect(screen.getByRole('status')).toHaveTextContent('게시글 2개를 불러왔어요.')
  })

  it('동네 변경 즉시 이전 게시글을 숨기고 새 요청을 기다린다', async () => {
    const user = userEvent.setup()
    const next = deferred()
    const load = vi.fn().mockResolvedValueOnce(examplePosts).mockReturnValueOnce(next.promise)
    render(<NeighborhoodFeed loadPosts={load} />)
    await screen.findByText(examplePosts[0].title)
    await user.click(screen.getByRole('radio', { name: '망원동' }))
    expect(screen.queryByText(examplePosts[0].title)).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('게시글을 불러오고 있어요.')
    await act(async () => next.resolve([]))
  })
})
