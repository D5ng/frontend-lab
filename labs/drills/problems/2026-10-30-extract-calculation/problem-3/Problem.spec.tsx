import '@testing-library/jest-dom/vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { server } from '../../../src/mocks/server'

const BASE = '/api/drills/2026-10-30/savings'

// Stackflow는 브라우저에서 한 번 만든 화면 스택을 다시 렌더링해도 이어 쓴다(jsdom도 브라우저로 본다).
// 앞 테스트에서 넘어간 화면이 남지 않도록 테스트마다 문제 모듈을 새로 불러온다.
beforeEach(() => {
  vi.resetModules()
})

async function setUpWithAutoTransfer() {
  const user = userEvent.setup()
  const { Problem } = await import('../problem-2/Problem')
  render(<Problem />)
  await user.type(await screen.findByRole('textbox', { name: '매달 넣을 금액' }), '300000')
  await user.click(screen.getByRole('checkbox', { name: /자동이체/ }))
  return user
}

// 요청을 구현한 뒤 it.skip을 it으로 바꿔 통과시킨다.
describe('자동이체 우대 금리', () => {
  it.skip('자동이체로 넣기를 체크하면 우대 금리로 다시 계산하고, 풀면 기본 금리로 돌아간다', async () => {
    const user = await setUpWithAutoTransfer()

    expect(screen.getByText('연 4.0% · 단리')).toBeInTheDocument()
    expect(screen.getByText('65,988원')).toBeInTheDocument()
    expect(screen.getByText('3,665,988원')).toBeInTheDocument()

    await user.click(screen.getByRole('checkbox', { name: /자동이체/ }))

    expect(screen.getByText('연 3.5% · 단리')).toBeInTheDocument()
    expect(screen.getByText('3,657,740원')).toBeInTheDocument()
  })

  it.skip('기간별 비교에도 우대 금리를 더한 만기 금액을 보여 준다', async () => {
    const user = await setUpWithAutoTransfer()

    await user.click(screen.getByRole('button', { name: '기간별로 비교하기' }))
    const sheet = await screen.findByRole('dialog', { name: '기간별로 비교해 보세요' })

    expect(within(sheet).getByText('1,815,546원')).toBeInTheDocument()
    expect(within(sheet).getByText('3,665,988원')).toBeInTheDocument()
    expect(within(sheet).getByText('7,485,525원')).toBeInTheDocument()
  })

  it.skip('가입 확인에 우대 금리가 들어간 것을 알리고 계산기와 같은 금액을 보여 준다', async () => {
    const user = await setUpWithAutoTransfer()

    await user.click(screen.getByRole('button', { name: '가입하기' }))

    expect(await screen.findByRole('heading', { name: '이대로 가입할까요?' })).toBeInTheDocument()
    expect(screen.getByText(/자동이체 우대 0\.5%p 포함/)).toBeInTheDocument()
    expect(screen.getByText('78,000원')).toBeInTheDocument()
    expect(screen.getByText('-12,012원')).toBeInTheDocument()
    expect(screen.getAllByText('3,665,988원')).toHaveLength(2)
  })

  it.skip('가입 요청에 자동이체로 넣는다는 것을 함께 보낸다', async () => {
    let requestBody: unknown
    server.use(
      http.post(`${BASE}/accounts`, async ({ request }) => {
        requestBody = await request.json()
        return HttpResponse.json({ id: 'sv-test' }, { status: 201 })
      }),
    )
    const user = await setUpWithAutoTransfer()
    await user.click(screen.getByRole('button', { name: '가입하기' }))
    await screen.findByRole('heading', { name: '이대로 가입할까요?' })

    await user.click(screen.getAllByRole('button', { name: '가입하기' }).at(-1)!)

    await waitFor(() => expect(requestBody).toEqual({ productId: 'monthly-1', monthlyAmount: 300000, months: 12, autoTransfer: true }))
  })
})
