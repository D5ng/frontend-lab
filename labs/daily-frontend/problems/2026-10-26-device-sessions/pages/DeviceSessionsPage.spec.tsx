import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DeviceSessionsPage } from './DeviceSessionsPage'

afterEach(cleanup)

function deferred() {
  let resolve!: () => void
  let reject!: (error: Error) => void
  const promise = new Promise<void>((complete, fail) => {
    resolve = complete
    reject = fail
  })
  return { promise, resolve, reject }
}

describe('가상 기기 연결 해제', () => {
  it('현재 기기는 보호하고 다른 두 기기만 해제할 수 있다', async () => {
    const user = userEvent.setup()
    const end = vi.fn()
    render(<DeviceSessionsPage endSession={end} />)
    const current = screen.getByRole('button', { name: '집 노트북 연결 끊기' })
    expect(current).toBeDisabled()
    await user.click(current)
    expect(end).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: '외출용 휴대폰 연결 끊기' })).toBeEnabled()
    expect(screen.getByRole('button', { name: '서재 태블릿 연결 끊기' })).toBeEnabled()
    expect(screen.getByText('연결을 끊은 기기 0개')).toBeVisible()
  })

  it('처리 중인 기기만 잠그고 성공 전에는 목록에서 빼지 않으며 중복 요청하지 않는다', async () => {
    const user = userEvent.setup()
    const pending = deferred()
    const end = vi.fn(() => pending.promise)
    render(<DeviceSessionsPage endSession={end} />)
    await user.click(screen.getByRole('button', { name: '외출용 휴대폰 연결 끊기' }))
    expect(screen.getByRole('button', { name: '외출용 휴대폰 연결 끊기' })).toBeDisabled()
    expect(screen.getByText('외출용 휴대폰')).toBeVisible()
    expect(screen.getByRole('button', { name: '서재 태블릿 연결 끊기' })).toBeEnabled()
    await user.click(screen.getByRole('button', { name: '외출용 휴대폰 연결 끊기' }))
    expect(end).toHaveBeenCalledExactlyOnceWith('phone')
    await act(async () => pending.resolve())
    expect(screen.queryByRole('button', { name: '외출용 휴대폰 연결 끊기' })).not.toBeInTheDocument()
    expect(screen.getByText('연결을 끊은 기기 1개')).toBeVisible()
  })

  it('실패한 기기는 보존하고 같은 기기의 버튼으로 재시도해 성공하면 제거한다', async () => {
    const user = userEvent.setup()
    const end = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(undefined)
    render(<DeviceSessionsPage endSession={end} />)
    await user.click(screen.getByRole('button', { name: '서재 태블릿 연결 끊기' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('서재 태블릿 연결을 끊지 못했어요. 다시 시도해 주세요.')
    expect(screen.getByRole('button', { name: '서재 태블릿 연결 끊기' })).toBeEnabled()
    await user.click(screen.getByRole('button', { name: '서재 태블릿 연결 끊기' }))
    expect(end.mock.calls).toEqual([['tablet'], ['tablet']])
    expect(screen.queryByRole('button', { name: '서재 태블릿 연결 끊기' })).not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('다른 기기가 먼저 성공해도 아직 처리 중인 기기의 대기를 끝내지 않는다', async () => {
    const user = userEvent.setup()
    const phone = deferred()
    const tablet = deferred()
    const end = vi.fn((id: string) => (id === 'phone' ? phone.promise : tablet.promise))
    render(<DeviceSessionsPage endSession={end} />)
    await user.click(screen.getByRole('button', { name: '외출용 휴대폰 연결 끊기' }))
    await user.click(screen.getByRole('button', { name: '서재 태블릿 연결 끊기' }))
    expect(end.mock.calls).toEqual([['phone'], ['tablet']])
    await act(async () => tablet.resolve())
    expect(screen.queryByRole('button', { name: '서재 태블릿 연결 끊기' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '외출용 휴대폰 연결 끊기' })).toBeDisabled()
    await act(async () => phone.resolve())
    expect(screen.queryByRole('button', { name: '외출용 휴대폰 연결 끊기' })).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('다른 기기 연결을 모두 끊었어요.')
    expect(screen.getByText('연결을 끊은 기기 2개')).toBeVisible()
  })

  it('늦은 실패가 다른 기기의 성공을 되돌리거나 성공 수를 지우지 않는다', async () => {
    const user = userEvent.setup()
    const phone = deferred()
    const tablet = deferred()
    render(<DeviceSessionsPage endSession={(id) => (id === 'phone' ? phone.promise : tablet.promise)} />)
    await user.click(screen.getByRole('button', { name: '외출용 휴대폰 연결 끊기' }))
    await user.click(screen.getByRole('button', { name: '서재 태블릿 연결 끊기' }))
    await act(async () => tablet.resolve())
    await act(async () => phone.reject(new Error('late error')))
    expect(screen.getByRole('alert')).toHaveTextContent('외출용 휴대폰 연결을 끊지 못했어요.')
    expect(screen.queryByRole('button', { name: '서재 태블릿 연결 끊기' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '외출용 휴대폰 연결 끊기' })).toBeEnabled()
    expect(screen.getByText('연결을 끊은 기기 1개')).toBeVisible()
  })

  it('각 기기의 오류를 보존하고 한 기기 재시도는 그 오류만 지운다', async () => {
    const user = userEvent.setup()
    const retry = deferred()
    const end = vi
      .fn()
      .mockRejectedValueOnce(new Error('phone'))
      .mockRejectedValueOnce(new Error('tablet'))
      .mockImplementationOnce(() => retry.promise)
    render(<DeviceSessionsPage endSession={end} />)
    await user.click(screen.getByRole('button', { name: '외출용 휴대폰 연결 끊기' }))
    await user.click(screen.getByRole('button', { name: '서재 태블릿 연결 끊기' }))
    expect(screen.getAllByRole('alert')).toHaveLength(2)
    await user.click(screen.getByRole('button', { name: '외출용 휴대폰 연결 끊기' }))
    expect(screen.getAllByRole('alert')).toHaveLength(1)
    expect(screen.getByRole('alert')).toHaveTextContent('서재 태블릿 연결을 끊지 못했어요.')
    await act(async () => retry.resolve())
    expect(screen.getByRole('alert')).toHaveTextContent('서재 태블릿 연결을 끊지 못했어요.')
    expect(screen.getByRole('button', { name: '서재 태블릿 연결 끊기' })).toBeEnabled()
  })

  it('동시에 성공한 두 기기를 모두 제거하고 현재 기기는 계속 남긴다', async () => {
    const user = userEvent.setup()
    const phone = deferred()
    const tablet = deferred()
    render(<DeviceSessionsPage endSession={(id) => (id === 'phone' ? phone.promise : tablet.promise)} />)
    await user.click(screen.getByRole('button', { name: '외출용 휴대폰 연결 끊기' }))
    await user.click(screen.getByRole('button', { name: '서재 태블릿 연결 끊기' }))
    await act(async () => {
      phone.resolve()
      tablet.resolve()
    })
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByRole('button', { name: '집 노트북 연결 끊기' })).toBeDisabled()
    expect(screen.getByRole('status')).toHaveTextContent('다른 기기 연결을 모두 끊었어요.')
  })
})
