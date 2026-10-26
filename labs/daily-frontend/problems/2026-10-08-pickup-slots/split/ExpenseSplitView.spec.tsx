import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ExpenseSplitView } from './ExpenseSplitView'
import { splitPreviews, splitStarter } from './preview'
afterEach(cleanup)
describe('정산 UI 표현 계약', () => {
  it('스타터를 완성된 계산기로 오해하지 않게 안내한다', () => {
    render(<ExpenseSplitView {...splitStarter} />)
    expect(screen.getByText(/미연결 스타터/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '정산안 저장하기' })).toBeDisabled()
  })
  it('원 단위 분배와 합계를 고정 예시로 표시한다', () => {
    render(<ExpenseSplitView {...splitPreviews.calculated!} />)
    expect(within(screen.getByRole('region', { name: '정산 결과' })).getByText('3,334원')).toBeInTheDocument()
    expect(screen.getByText('10,000원')).toBeInTheDocument()
    expect(screen.getByText(/UI 미리보기/)).toBeInTheDocument()
  })
  it('입력과 선택을 실제 컨트롤의 콜백으로 전달한다', async () => {
    const user = userEvent.setup(),
      onToggle = vi.fn(),
      onDraftChange = vi.fn()
    render(<ExpenseSplitView {...splitPreviews.calculated!} onToggle={onToggle} onDraftChange={onDraftChange} />)
    await user.click(screen.getByRole('checkbox', { name: '나라 참여' }))
    expect(onToggle).toHaveBeenCalledWith('nara')
    await user.click(screen.getByRole('radio', { name: '참여 횟수대로 나누기' }))
    expect(onDraftChange).toHaveBeenCalledWith({ method: 'weighted' })
  })
  it('저장 중 관련 조작을 잠그고 실패·성공을 각각 알린다', () => {
    const { rerender } = render(<ExpenseSplitView {...splitPreviews.saving!} />)
    expect(screen.getByRole('textbox', { name: '지출 이름' })).toBeDisabled()
    expect(screen.getByRole('checkbox', { name: '나라 참여' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '정산안 저장 중' })).toBeDisabled()
    rerender(<ExpenseSplitView {...splitPreviews.failed!} />)
    expect(screen.getByRole('alert')).toHaveTextContent('저장하지 못했어요')
    rerender(<ExpenseSplitView {...splitPreviews.success!} />)
    expect(screen.getByRole('status')).toHaveTextContent('저장했어요')
  })
})
