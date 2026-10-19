import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ProductRemoval } from './starter'
import { RemovalView } from './view'
import { initialProducts } from './api'

afterEach(cleanup)
function deferred() {
  let resolve!: () => void
  let reject!: (error: Error) => void
  const promise = new Promise<void>((done, fail) => {
    resolve = done
    reject = fail
  })
  return { promise, resolve, reject }
}
const button = (name: string) => screen.getByRole('button', { name: `${name} 목록에서 빼기` })

describe('제공 화면 준비', () => {
  it('미구현 스타터는 목록만 표시하며 요청하지 않는다', () => {
    const api = { remove: vi.fn(), restore: vi.fn() }
    render(<ProductRemoval api={api} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(api.remove).not.toHaveBeenCalled()
    expect(api.restore).not.toHaveBeenCalled()
  })
  it('진행 표현은 모든 제거와 되돌리기를 잠근다', () => {
    render(
      <RemovalView
        items={initialProducts.slice(1)}
        undoItem={initialProducts[0]}
        removingId="lamp"
        restoring={false}
        message=""
        error=""
        onRemove={vi.fn()}
        onUndo={vi.fn()}
      />,
    )
    screen.getAllByRole('button').forEach((item) => expect(item).toBeDisabled())
    expect(screen.getByRole('status')).toHaveTextContent('상품을 목록에서 빼고 있어요.')
  })
  it('복구 오류 표현은 되돌릴 상품과 다시 누를 액션을 남긴다', async () => {
    const undo = vi.fn()
    render(
      <RemovalView
        items={initialProducts.slice(1)}
        undoItem={initialProducts[0]}
        removingId={null}
        restoring={false}
        message=""
        error="되돌리지 못했어요. 다시 시도해 주세요."
        onRemove={vi.fn()}
        onUndo={undo}
      />,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('되돌리지 못했어요.')
    expect(screen.getByRole('region', { name: '되돌릴 상품' })).toHaveTextContent('원목 의자')
    await userEvent.click(screen.getByRole('button', { name: '마지막 상품 되돌리기' }))
    expect(undo).toHaveBeenCalledTimes(1)
  })
})

// 구현 후 skip을 제거하세요. 출제 시 이 7개는 의도적으로 실행하지 않습니다.
describe.skip('실습자 구현 행동', () => {
  it('삭제 성공 전 목록을 유지하며 모든 조작을 잠그고 요청을 중복하지 않는다', async () => {
    const user = userEvent.setup()
    const request = deferred()
    const api = { remove: vi.fn(() => request.promise), restore: vi.fn() }
    render(<ProductRemoval api={api} />)
    await user.dblClick(button('원목 의자'))
    expect(api.remove).toHaveBeenCalledExactlyOnceWith('chair')
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    screen.getAllByRole('button').forEach((item) => expect(item).toBeDisabled())
    await act(async () => request.resolve())
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByRole('status')).toHaveTextContent('원목 의자를 목록에서 뺐어요.')
    expect(screen.getByRole('region', { name: '되돌릴 상품' })).toHaveTextContent('원목 의자')
  })
  it('되돌리기 성공은 상품을 원래 순서에 한 번만 복구하고 되돌리기 액션을 없앤다', async () => {
    const user = userEvent.setup()
    const restore = deferred()
    const api = { remove: vi.fn().mockResolvedValue(undefined), restore: vi.fn(() => restore.promise) }
    render(<ProductRemoval api={api} />)
    await user.click(button('원목 의자'))
    await user.dblClick(screen.getByRole('button', { name: '마지막 상품 되돌리기' }))
    expect(api.restore).toHaveBeenCalledExactlyOnceWith('chair')
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    screen.getAllByRole('button').forEach((item) => expect(item).toBeDisabled())
    await act(async () => restore.resolve())
    const rows = screen.getAllByRole('listitem')
    expect(rows.map((row) => within(row).getByRole('button').getAttribute('aria-label'))).toEqual([
      '원목 의자 목록에서 빼기',
      '책상 조명 목록에서 빼기',
      '작은 책장 목록에서 빼기',
    ])
    expect(screen.queryByRole('button', { name: '마지막 상품 되돌리기' })).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('원목 의자를 다시 담았어요.')
  })
  it('삭제 실패는 목록과 이전 되돌릴 상품을 보존하며 재시도가 가능하다', async () => {
    const user = userEvent.setup()
    const api = {
      remove: vi.fn().mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error('fail')).mockResolvedValueOnce(undefined),
      restore: vi.fn(),
    }
    render(<ProductRemoval api={api} />)
    await user.click(button('원목 의자'))
    await user.click(button('책상 조명'))
    expect(screen.getByRole('alert')).toHaveTextContent('목록에서 빼지 못했어요. 다시 시도해 주세요.')
    expect(button('책상 조명')).toBeEnabled()
    expect(screen.getByRole('region', { name: '되돌릴 상품' })).toHaveTextContent('원목 의자')
    await user.click(button('책상 조명'))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('region', { name: '되돌릴 상품' })).toHaveTextContent('책상 조명')
  })
  it('복구 실패는 제거된 목록과 복구 대상을 보존하고 같은 상품으로 재시도한다', async () => {
    const user = userEvent.setup()
    const api = {
      remove: vi.fn().mockResolvedValue(undefined),
      restore: vi.fn().mockRejectedValueOnce(new Error('fail')).mockResolvedValueOnce(undefined),
    }
    render(<ProductRemoval api={api} />)
    await user.click(button('원목 의자'))
    await user.click(screen.getByRole('button', { name: '마지막 상품 되돌리기' }))
    expect(screen.getByRole('alert')).toHaveTextContent('되돌리지 못했어요. 다시 시도해 주세요.')
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    await user.click(screen.getByRole('button', { name: '마지막 상품 되돌리기' }))
    expect(api.restore.mock.calls).toEqual([['chair'], ['chair']])
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
  it('두 번째 삭제 성공 뒤에는 마지막 상품만 되돌린다', async () => {
    const user = userEvent.setup()
    const api = { remove: vi.fn().mockResolvedValue(undefined), restore: vi.fn().mockResolvedValue(undefined) }
    render(<ProductRemoval api={api} />)
    await user.click(button('원목 의자'))
    await user.click(button('책상 조명'))
    await user.click(screen.getByRole('button', { name: '마지막 상품 되돌리기' }))
    expect(api.restore).toHaveBeenCalledExactlyOnceWith('lamp')
    expect(screen.queryByRole('button', { name: '원목 의자 목록에서 빼기' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })
  it('새 삭제 요청 중 이전 되돌리기 대상을 지우지 않고 잠근다', async () => {
    const user = userEvent.setup()
    const request = deferred()
    const api = { remove: vi.fn().mockResolvedValueOnce(undefined).mockReturnValueOnce(request.promise), restore: vi.fn() }
    render(<ProductRemoval api={api} />)
    await user.click(button('원목 의자'))
    await user.click(button('책상 조명'))
    expect(screen.queryByText('원목 의자를 목록에서 뺐어요.')).not.toBeInTheDocument()
    expect(screen.getByRole('region', { name: '되돌릴 상품' })).toHaveTextContent('원목 의자')
    expect(screen.getByRole('button', { name: '마지막 상품 되돌리기' })).toBeDisabled()
    await act(async () => request.reject(new Error('fail')))
    expect(screen.getByRole('region', { name: '되돌릴 상품' })).toHaveTextContent('원목 의자')
    expect(screen.getByRole('button', { name: '마지막 상품 되돌리기' })).toBeEnabled()
  })
  it('빈 목록에서도 마지막 삭제를 되돌릴 수 있다', async () => {
    const user = userEvent.setup()
    const api = { remove: vi.fn().mockResolvedValue(undefined), restore: vi.fn().mockResolvedValue(undefined) }
    render(<ProductRemoval api={api} />)
    await user.click(button('원목 의자'))
    await user.click(button('책상 조명'))
    await user.click(button('작은 책장'))
    expect(screen.getByText('관심 상품을 모두 정리했어요.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '마지막 상품 되돌리기' }))
    expect(api.restore).toHaveBeenCalledExactlyOnceWith('shelf')
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
  })
})
