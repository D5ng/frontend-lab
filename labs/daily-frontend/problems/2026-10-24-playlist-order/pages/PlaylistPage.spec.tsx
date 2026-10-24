import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { PlaylistReceipt } from '../features/playlist/types/playlist'
import { PlaylistPage } from './PlaylistPage'

afterEach(cleanup)

function displayedOrder() {
  return within(screen.getByRole('list', { name: '편집 중인 순서' }))
    .getAllByRole('listitem')
    .map((row) => within(row).getByText(/^\d+\./).textContent)
}

describe('재생 순서 정리', () => {
  it('초기 순서를 표시하고 이동 경계와 변경 없는 저장·되돌리기를 막는다', () => {
    render(<PlaylistPage savePlaylist={vi.fn()} />)
    expect(displayedOrder()).toEqual(['1. 산책 이야기', '2. 저녁 음악', '3. 짧은 인터뷰'])
    expect(screen.getByRole('button', { name: '산책 이야기 위로' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '짧은 인터뷰 아래로' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '순서 저장하기' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '마지막 저장으로 되돌리기' })).toBeDisabled()
    expect(screen.getByText('저장된 순서와 같아요.')).toBeVisible()
  })

  it('인접 항목을 한 칸 교환하고 원래 순서로 돌아오면 변경 없음으로 표시한다', async () => {
    const user = userEvent.setup()
    const save = vi.fn()
    render(<PlaylistPage savePlaylist={save} />)
    await user.click(screen.getByRole('button', { name: '저녁 음악 위로' }))
    expect(displayedOrder()).toEqual(['1. 저녁 음악', '2. 산책 이야기', '3. 짧은 인터뷰'])
    expect(screen.getByText('저장하지 않은 변경이 있어요.')).toBeVisible()
    expect(screen.getByRole('complementary', { name: '마지막 저장 순서' })).toHaveTextContent('산책 이야기 → 저녁 음악 → 짧은 인터뷰')
    await user.click(screen.getByRole('button', { name: '저녁 음악 아래로' }))
    expect(displayedOrder()).toEqual(['1. 산책 이야기', '2. 저녁 음악', '3. 짧은 인터뷰'])
    expect(screen.getByRole('button', { name: '순서 저장하기' })).toBeDisabled()
    expect(screen.getByText('저장된 순서와 같아요.')).toBeVisible()
    expect(save).not.toHaveBeenCalled()
  })

  it('화면의 현재 순서대로 ID를 보내고 성공하면 그 순서를 마지막 저장으로 표시한다', async () => {
    const user = userEvent.setup()
    const save = vi.fn().mockResolvedValue({ orderedIds: ['music', 'talk', 'walk'] })
    render(<PlaylistPage savePlaylist={save} />)
    await user.click(screen.getByRole('button', { name: '산책 이야기 아래로' }))
    await user.click(screen.getByRole('button', { name: '짧은 인터뷰 위로' }))
    await user.click(screen.getByRole('button', { name: '순서 저장하기' }))
    expect(save).toHaveBeenCalledExactlyOnceWith({ orderedIds: ['music', 'talk', 'walk'] })
    expect(await screen.findByRole('status')).toHaveTextContent('재생 순서를 저장했어요.')
    expect(screen.getByRole('complementary')).toHaveTextContent('저녁 음악 → 짧은 인터뷰 → 산책 이야기')
    expect(screen.getByRole('button', { name: '순서 저장하기' })).toBeDisabled()
  })

  it('실패하면 편집 순서와 마지막 저장을 각각 보존하고 같은 순서로 재시도한다', async () => {
    const user = userEvent.setup()
    const save = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce({ orderedIds: ['walk', 'talk', 'music'] })
    render(<PlaylistPage savePlaylist={save} />)
    await user.click(screen.getByRole('button', { name: '짧은 인터뷰 위로' }))
    await user.click(screen.getByRole('button', { name: '순서 저장하기' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('순서를 저장하지 못했어요. 다시 시도해 주세요.')
    expect(displayedOrder()).toEqual(['1. 산책 이야기', '2. 짧은 인터뷰', '3. 저녁 음악'])
    expect(screen.getByRole('complementary')).toHaveTextContent('산책 이야기 → 저녁 음악 → 짧은 인터뷰')
    await user.click(screen.getByRole('button', { name: '순서 저장하기' }))
    expect(save).toHaveBeenCalledTimes(2)
    expect(save.mock.calls[0]).toEqual(save.mock.calls[1])
    expect(await screen.findByRole('status')).toBeVisible()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('저장 중 이동·되돌리기·중복 저장을 잠그고 실패 후 다시 조작할 수 있다', async () => {
    const user = userEvent.setup()
    let reject!: (error: Error) => void
    const save = vi.fn(
      () =>
        new Promise<PlaylistReceipt>((_, fail) => {
          reject = fail
        }),
    )
    render(<PlaylistPage savePlaylist={save} />)
    await user.click(screen.getByRole('button', { name: '저녁 음악 위로' }))
    await user.click(screen.getByRole('button', { name: '순서 저장하기' }))
    for (const button of screen.getAllByRole('button')) expect(button).toBeDisabled()
    expect(screen.getByText('저장 중에는 순서를 바꾸거나 되돌릴 수 없어요.')).toBeVisible()
    await user.click(screen.getByRole('button', { name: /순서 저장하기/ }))
    expect(save).toHaveBeenCalledTimes(1)
    await act(async () => reject(new Error('offline')))
    expect(screen.getByRole('button', { name: '산책 이야기 위로' })).toBeEnabled()
    await user.click(screen.getByRole('button', { name: '산책 이야기 위로' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '순서 저장하기' })).toBeDisabled()
  })

  it('서버가 확정한 순서로 편집과 마지막 저장을 함께 맞춘다', async () => {
    const user = userEvent.setup()
    render(<PlaylistPage savePlaylist={vi.fn().mockResolvedValue({ orderedIds: ['talk', 'music', 'walk'] })} />)
    await user.click(screen.getByRole('button', { name: '저녁 음악 위로' }))
    await user.click(screen.getByRole('button', { name: '순서 저장하기' }))
    expect(await screen.findByRole('status')).toBeVisible()
    expect(displayedOrder()).toEqual(['1. 짧은 인터뷰', '2. 저녁 음악', '3. 산책 이야기'])
    expect(screen.getByRole('complementary')).toHaveTextContent('짧은 인터뷰 → 저녁 음악 → 산책 이야기')
    expect(screen.getByText('저장된 순서와 같아요.')).toBeVisible()
    expect(screen.getByRole('button', { name: '마지막 저장으로 되돌리기' })).toBeDisabled()
  })

  it('되돌리기는 최초 순서가 아니라 마지막 성공 순서이며 새 이동·되돌리기는 이전 안내를 지운다', async () => {
    const user = userEvent.setup()
    const save = vi
      .fn()
      .mockResolvedValueOnce({ orderedIds: ['music', 'walk', 'talk'] })
      .mockRejectedValueOnce(new Error('offline'))
    render(<PlaylistPage savePlaylist={save} />)
    await user.click(screen.getByRole('button', { name: '저녁 음악 위로' }))
    await user.click(screen.getByRole('button', { name: '순서 저장하기' }))
    expect(await screen.findByRole('status')).toBeVisible()
    await user.click(screen.getByRole('button', { name: '짧은 인터뷰 위로' }))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '순서 저장하기' }))
    expect(await screen.findByRole('alert')).toBeVisible()
    await user.click(screen.getByRole('button', { name: '마지막 저장으로 되돌리기' }))
    expect(displayedOrder()).toEqual(['1. 저녁 음악', '2. 산책 이야기', '3. 짧은 인터뷰'])
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '순서 저장하기' })).toBeDisabled()
    expect(save).toHaveBeenCalledTimes(2)
  })
})
