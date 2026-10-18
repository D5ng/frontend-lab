import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ArchiveForm } from './starter'
import type { ArchiveResult } from './api'

afterEach(cleanup)

function deferred() {
  let resolve!: (result: ArchiveResult) => void
  const promise = new Promise<ArchiveResult>((complete) => {
    resolve = complete
  })
  return { promise, resolve }
}

describe('관심 상품 보관 행동', () => {
  it('처음에는 세 상품이 미선택이고 제출할 수 없다', () => {
    render(<ArchiveForm archiveProducts={vi.fn()} />)
    expect(screen.getAllByRole('checkbox')).toHaveLength(3)
    screen.getAllByRole('checkbox').forEach((checkbox) => expect(checkbox).not.toBeChecked())
    expect(screen.getByRole('button', { name: '선택한 상품 보관' })).toBeDisabled()
  })

  it('선택과 해제를 개수에 반영하고 선택한 상품만 전송한다', async () => {
    const user = userEvent.setup()
    const archive = vi.fn().mockResolvedValue({ succeededIds: ['lamp'], failedIds: [] })
    render(<ArchiveForm archiveProducts={archive} />)
    await user.click(screen.getByRole('checkbox', { name: '원목 의자' }))
    await user.click(screen.getByRole('checkbox', { name: '책상 조명' }))
    await user.click(screen.getByRole('checkbox', { name: '원목 의자' }))
    expect(screen.getByText('선택 1개')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '선택한 상품 보관' }))
    expect(archive).toHaveBeenCalledExactlyOnceWith(['lamp'])
    expect(screen.getByRole('status')).toHaveTextContent('1개를 보관했어요.')
  })

  it('응답 전에는 목록을 유지하고 모든 선택과 중복 제출을 잠근다', async () => {
    const user = userEvent.setup()
    const request = deferred()
    const archive = vi.fn(() => request.promise)
    render(<ArchiveForm archiveProducts={archive} />)
    await user.click(screen.getByRole('checkbox', { name: '원목 의자' }))
    await user.dblClick(screen.getByRole('button', { name: '선택한 상품 보관' }))
    expect(archive).toHaveBeenCalledTimes(1)
    expect(screen.getAllByRole('checkbox')).toHaveLength(3)
    screen.getAllByRole('checkbox').forEach((checkbox) => expect(checkbox).toBeDisabled())
    expect(screen.getByRole('button', { name: /보관 중/ })).toBeDisabled()
    await act(async () => request.resolve({ succeededIds: ['chair'], failedIds: [] }))
    expect(screen.getByRole('checkbox', { name: '책상 조명' })).toBeEnabled()
  })

  it('부분 성공은 성공 상품만 제거하고 실패 상품만 선택해 다시 보낸다', async () => {
    const user = userEvent.setup()
    const archive = vi
      .fn()
      .mockResolvedValueOnce({ succeededIds: ['chair'], failedIds: ['lamp'] })
      .mockResolvedValueOnce({ succeededIds: ['lamp'], failedIds: [] })
    render(<ArchiveForm archiveProducts={archive} />)
    await user.click(screen.getByRole('checkbox', { name: '원목 의자' }))
    await user.click(screen.getByRole('checkbox', { name: '책상 조명' }))
    await user.click(screen.getByRole('button', { name: '선택한 상품 보관' }))
    expect(screen.queryByRole('checkbox', { name: '원목 의자' })).not.toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: '책상 조명' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: '작은 책장' })).not.toBeChecked()
    expect(screen.getByText('남은 상품 2개')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('1개를 보관했어요. 1개는 다시 시도해 주세요.')
    await user.click(screen.getByRole('button', { name: '선택한 상품 보관' }))
    expect(archive).toHaveBeenNthCalledWith(2, ['lamp'])
    expect(screen.getByRole('status')).toHaveTextContent('1개를 보관했어요.')
    expect(screen.getByRole('checkbox', { name: '작은 책장' })).not.toBeChecked()
    expect(screen.getByText('선택 0개')).toBeInTheDocument()
  })

  it('모든 항목이 실패한 응답은 목록과 선택을 보존한다', async () => {
    const user = userEvent.setup()
    render(<ArchiveForm archiveProducts={vi.fn().mockResolvedValue({ succeededIds: [], failedIds: ['lamp'] })} />)
    await user.click(screen.getByRole('checkbox', { name: '책상 조명' }))
    await user.click(screen.getByRole('button', { name: '선택한 상품 보관' }))
    expect(screen.getAllByRole('checkbox')).toHaveLength(3)
    expect(screen.getByRole('checkbox', { name: '책상 조명' })).toBeChecked()
    expect(screen.getByRole('alert')).toHaveTextContent('보관하지 못했어요. 선택한 상품을 다시 시도해 주세요.')
    expect(screen.getByRole('button', { name: '선택한 상품 보관' })).toBeEnabled()
  })

  it('요청 자체가 실패해도 선택을 보존하며 재시도 시작 시 오류를 지운다', async () => {
    const user = userEvent.setup()
    const retry = deferred()
    const archive = vi.fn().mockRejectedValueOnce(new Error('offline')).mockReturnValueOnce(retry.promise)
    render(<ArchiveForm archiveProducts={archive} />)
    await user.click(screen.getByRole('checkbox', { name: '원목 의자' }))
    await user.click(screen.getByRole('button', { name: '선택한 상품 보관' }))
    expect(screen.getByRole('alert')).toHaveTextContent('요청을 완료하지 못했어요. 선택은 그대로예요. 다시 시도해 주세요.')
    expect(screen.getByRole('checkbox', { name: '원목 의자' })).toBeChecked()
    await user.click(screen.getByRole('button', { name: '선택한 상품 보관' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(archive).toHaveBeenNthCalledWith(2, ['chair'])
    await act(async () => retry.resolve({ succeededIds: ['chair'], failedIds: [] }))
    expect(screen.getByRole('status')).toHaveTextContent('1개를 보관했어요.')
  })

  it('결과 후 선택을 바꾸면 이전 안내를 지운다', async () => {
    const user = userEvent.setup()
    render(<ArchiveForm archiveProducts={vi.fn().mockResolvedValue({ succeededIds: [], failedIds: ['lamp'] })} />)
    await user.click(screen.getByRole('checkbox', { name: '책상 조명' }))
    await user.click(screen.getByRole('button', { name: '선택한 상품 보관' }))
    await user.click(screen.getByRole('checkbox', { name: '책상 조명' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByText('선택 0개')).toBeInTheDocument()
  })

  it('전부 성공하면 빈 목록과 성공 안내를 함께 남긴다', async () => {
    const user = userEvent.setup()
    render(<ArchiveForm archiveProducts={vi.fn().mockResolvedValue({ succeededIds: ['chair', 'lamp', 'shelf'], failedIds: [] })} />)
    for (const checkbox of screen.getAllByRole('checkbox')) await user.click(checkbox)
    await user.click(screen.getByRole('button', { name: '선택한 상품 보관' }))
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    expect(screen.getByText('모든 상품을 정리했어요. 더 보관할 상품이 없어요.')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('3개를 보관했어요.')
    expect(screen.getByRole('button', { name: '선택한 상품 보관' })).toBeDisabled()
  })
})
