import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { bookingPreviews, bookingStarter } from './preview'
import { SpaceBookingView } from './SpaceBookingView'
afterEach(cleanup)
describe('공간 예약 UI 표현 계약', () => {
  it('미연결 상태를 알리고 실제 예약처럼 보이지 않게 한다', () => {
    render(<SpaceBookingView {...bookingStarter} />)
    expect(screen.getByText(/미연결 스타터/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '공간 예약하기' })).toBeDisabled()
  })
  it('선택 공간의 이용료·장비·합계를 고정 데이터로 표시한다', () => {
    render(<SpaceBookingView {...bookingPreviews.selected!} />)
    expect(screen.getByText('38,000원')).toBeInTheDocument()
    expect(screen.getByText('3,000원')).toBeInTheDocument()
    expect(screen.getByText('41,000원')).toBeInTheDocument()
    expect(screen.getByText(/UI 미리보기/)).toBeInTheDocument()
  })
  it('인원·장비·공간 선택을 실제 컨트롤 콜백으로 전달한다', async () => {
    const user = userEvent.setup(),
      onChange = vi.fn()
    render(<SpaceBookingView {...bookingPreviews.ready!} onChange={onChange} />)
    await user.click(screen.getByRole('radio', { name: '햇살 스튜디오' }))
    expect(onChange).toHaveBeenCalledWith({ spaceId: 'studio' })
    await user.click(screen.getByRole('checkbox', { name: '프로젝터 추가' }))
    expect(onChange).toHaveBeenCalledWith({ projector: false })
  })
  it('대기·실패·성공과 성공 후 중복 예약 방지를 표현한다', () => {
    const { rerender } = render(<SpaceBookingView {...bookingPreviews.reserving!} />)
    expect(screen.getByRole('textbox', { name: '모임 인원' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '공간 예약 중' })).toBeDisabled()
    rerender(<SpaceBookingView {...bookingPreviews.failed!} />)
    expect(screen.getByRole('alert')).toHaveTextContent('예약하지 못했어요')
    rerender(<SpaceBookingView {...bookingPreviews.success!} />)
    expect(screen.getByRole('status')).toHaveTextContent('예약했어요')
    expect(screen.getByRole('button', { name: '공간 예약하기' })).toBeDisabled()
  })
})
