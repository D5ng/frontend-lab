import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { members } from '../split/data'
import { ExpenseSplitPage } from './ExpenseSplitPage'
afterEach(cleanup)
function setup() {
  const api = { getMembers: vi.fn().mockResolvedValue(members), save: vi.fn().mockResolvedValue({ id: 'saved' }) }
  render(<ExpenseSplitPage api={api} />)
  return { api, user: userEvent.setup() }
}
async function fill(user: ReturnType<typeof userEvent.setup>, amount = '10000') {
  await screen.findByRole('checkbox', { name: '나라 참여' })
  await user.type(screen.getByRole('textbox', { name: '지출 이름' }), '모임 식비')
  await user.type(screen.getByRole('textbox', { name: '함께 쓴 금액' }), amount)
  for (const name of ['나라', '준', '봄']) await user.click(screen.getByRole('checkbox', { name: name + ' 참여' }))
}
describe.skip('직접 구현 후 활성화할 정산 행동', () => {
  it('서버 참여자를 조회하고 10000원을 세 사람에게 합계가 맞게 나눈다', async () => {
    const { user } = setup()
    await fill(user)
    await user.click(screen.getByRole('button', { name: '부담 금액 계산하기' }))
    expect(screen.getByText('3,334원')).toBeInTheDocument()
    expect(screen.getAllByText('3,333원')).toHaveLength(2)
  })
  it('2:1:1 참여 횟수에 따라 금액을 나눈다', async () => {
    const { user } = setup()
    await fill(user)
    await user.click(screen.getByRole('radio', { name: '참여 횟수대로 나누기' }))
    await user.clear(screen.getByRole('textbox', { name: '나라 참여 횟수' }))
    await user.type(screen.getByRole('textbox', { name: '나라 참여 횟수' }), '2')
    await user.click(screen.getByRole('button', { name: '부담 금액 계산하기' }))
    expect(screen.getByText('5,000원')).toBeInTheDocument()
    expect(screen.getAllByText('2,500원')).toHaveLength(2)
  })
  it('계산한 뒤 원금을 바꾸면 이전 결과로 저장하지 못한다', async () => {
    const { user } = setup()
    await fill(user)
    await user.click(screen.getByRole('button', { name: '부담 금액 계산하기' }))
    await user.type(screen.getByRole('textbox', { name: '함께 쓴 금액' }), '0')
    expect(screen.getByRole('button', { name: '정산안 저장하기' })).toBeDisabled()
  })
  it('잘못된 금액과 빈 참여자로 요청하지 않는다', async () => {
    const { user, api } = setup()
    await screen.findByRole('checkbox', { name: '나라 참여' })
    await user.click(screen.getByRole('button', { name: '부담 금액 계산하기' }))
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(api.save).not.toHaveBeenCalled()
  })
  it('결과의 숫자·선택 ID로만 저장하고 실패 후 재시도한다', async () => {
    const { user, api } = setup()
    api.save.mockRejectedValueOnce(new Error('실패'))
    await fill(user)
    await user.click(screen.getByRole('button', { name: '부담 금액 계산하기' }))
    await user.click(screen.getByRole('button', { name: '정산안 저장하기' }))
    await screen.findByRole('alert')
    await user.click(screen.getByRole('button', { name: '정산안 저장하기' }))
    await screen.findByText('정산안을 저장했어요.')
    expect(api.save).toHaveBeenLastCalledWith({
      title: '모임 식비',
      totalAmount: 10000,
      method: 'equal',
      shares: [
        { memberId: 'nara', amount: 3334 },
        { memberId: 'jun', amount: 3333 },
        { memberId: 'bom', amount: 3333 },
      ],
    })
  })
})
