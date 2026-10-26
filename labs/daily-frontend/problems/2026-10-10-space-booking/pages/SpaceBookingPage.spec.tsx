import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { spaces } from '../booking/data'
import { SpaceBookingPage } from './SpaceBookingPage'
afterEach(cleanup)
function setup() {
  const api = { getSpaces: vi.fn().mockResolvedValue(spaces), reserve: vi.fn().mockResolvedValue({ id: 'saved' }) }
  render(<SpaceBookingPage api={api} />)
  return { user: userEvent.setup(), api }
}
describe.skip('직접 구현 후 활성화할 공간 예약 행동', () => {
  it('초기 조건에 맞는 공간만 보여주고 자동으로 고르지 않는다', async () => {
    setup()
    expect(await screen.findByRole('radio', { name: '햇살 스튜디오' })).not.toBeChecked()
    expect(screen.queryByRole('radio', { name: '작은 라운지' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '공간 예약하기' })).toBeDisabled()
  })
  it('인원이나 시간 조건을 바꾸면 이전 공간·견적·완료 안내를 비운다', async () => {
    const { user } = setup()
    await user.click(await screen.findByRole('radio', { name: '햇살 스튜디오' }))
    await user.clear(screen.getByRole('textbox', { name: '모임 인원' }))
    await user.type(screen.getByRole('textbox', { name: '모임 인원' }), '7')
    expect(screen.getByRole('button', { name: '공간 예약하기' })).toBeDisabled()
    expect(screen.queryByText('38,000원')).not.toBeInTheDocument()
  })
  it('장비는 시간 수와 무관하게 한 번만 추가한다', async () => {
    const { user } = setup()
    await user.click(await screen.findByRole('radio', { name: '햇살 스튜디오' }))
    await user.click(screen.getByRole('checkbox', { name: '프로젝터 추가' }))
    await user.click(screen.getByRole('radio', { name: '햇살 스튜디오' }))
    expect(screen.getByText('41,000원')).toBeInTheDocument()
  })
  it('요청은 현재 조건과 공간 ID 및 숫자 견적으로 보낸다', async () => {
    const { user, api } = setup()
    await user.click(await screen.findByRole('radio', { name: '햇살 스튜디오' }))
    await user.click(screen.getByRole('button', { name: '공간 예약하기' }))
    expect(api.reserve).toHaveBeenCalledWith({
      day: 'today',
      startHour: 10,
      duration: 2,
      guests: 3,
      projector: false,
      spaceId: 'studio',
      totalPrice: 38000,
    })
  })
  it('예약 실패 뒤 선택을 보존하고 재시도하며 성공 후 같은 예약을 막는다', async () => {
    const { user, api } = setup()
    api.reserve.mockRejectedValueOnce(new Error('실패'))
    await user.click(await screen.findByRole('radio', { name: '햇살 스튜디오' }))
    await user.click(screen.getByRole('button', { name: '공간 예약하기' }))
    await screen.findByRole('alert')
    expect(screen.getByRole('radio', { name: '햇살 스튜디오' })).toBeChecked()
    await user.click(screen.getByRole('button', { name: '공간 예약하기' }))
    await screen.findByRole('status')
    expect(screen.getByRole('button', { name: '공간 예약하기' })).toBeDisabled()
  })
})
