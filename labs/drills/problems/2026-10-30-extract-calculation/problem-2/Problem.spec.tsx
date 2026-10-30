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

async function renderProblem() {
  const { Problem } = await import('./Problem')
  render(<Problem />)
}

async function setUpWithAmount(amount: string) {
  const user = userEvent.setup()
  await renderProblem()
  await user.type(await screen.findByRole('textbox', { name: '매달 넣을 금액' }), amount)
  return user
}

describe('적금 계산하기', () => {
  it('금액을 넣으면 고른 기간의 금리로 만기에 받는 돈을 보여 준다', async () => {
    await setUpWithAmount('300000')

    expect(screen.getByText('연 3.5% · 단리')).toBeInTheDocument()
    expect(screen.getByText('3,600,000원')).toBeInTheDocument()
    expect(screen.getByText('57,740원')).toBeInTheDocument()
    expect(screen.getByText('3,657,740원')).toBeInTheDocument()
  })

  it('기간을 바꾸면 그 기간의 금리로 다시 계산한다', async () => {
    const user = await setUpWithAmount('300000')

    await user.click(screen.getByRole('radio', { name: '24개월' }))

    expect(screen.getByText('연 4.0% · 단리')).toBeInTheDocument()
    expect(screen.getByText('253,800원')).toBeInTheDocument()
    expect(screen.getByText('7,453,800원')).toBeInTheDocument()
  })

  it('금액을 넣기 전에는 무엇을 하면 되는지 알려 주고 가입할 수 없다', async () => {
    await renderProblem()

    expect(await screen.findByText('매달 넣을 금액을 입력하면 만기에 받는 돈을 알려 드려요.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '가입하기' })).toBeDisabled()
  })

  it('넣을 수 있는 금액을 벗어나면 이유를 알려 주고 가입할 수 없다', async () => {
    await setUpWithAmount('5000')

    expect(screen.getByText('10,000원부터 500,000원 사이로 넣어 주세요.')).toBeInTheDocument()
    expect(screen.queryByText('만기에 받는 돈')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '가입하기' })).toBeDisabled()
  })

  it('상품 정보를 불러오지 못하면 다시 불러올 수 있다', async () => {
    server.use(http.get(`${BASE}/products/monthly-1`, () => HttpResponse.json({}, { status: 500 }), { once: true }))
    const user = userEvent.setup()
    await renderProblem()

    await user.click(await screen.findByRole('button', { name: '다시 불러오기' }))

    expect(await screen.findByRole('textbox', { name: '매달 넣을 금액' })).toBeInTheDocument()
  })
})

describe('기간별로 비교하기', () => {
  it('세 기간의 만기 금액을 보여 주고, 하나를 고르면 그 기간으로 바뀐다', async () => {
    const user = await setUpWithAmount('300000')

    await user.click(screen.getByRole('button', { name: '기간별로 비교하기' }))
    const sheet = await screen.findByRole('dialog', { name: '기간별로 비교해 보세요' })
    expect(within(sheet).getByText('1,813,325원')).toBeInTheDocument()
    expect(within(sheet).getByText('3,657,740원')).toBeInTheDocument()
    expect(within(sheet).getByText('7,453,800원')).toBeInTheDocument()

    await user.click(within(sheet).getByRole('button', { name: /6개월/ }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.getByRole('radio', { name: '6개월' })).toBeChecked()
    expect(screen.getByText('1,813,325원')).toBeInTheDocument()
  })
})

describe('가입 내용 확인', () => {
  it('세전 이자, 세금, 만기에 받는 돈을 계산기와 같은 금액으로 보여 준다', async () => {
    const user = await setUpWithAmount('300000')

    await user.click(screen.getByRole('button', { name: '가입하기' }))

    expect(await screen.findByRole('heading', { name: '이대로 가입할까요?' })).toBeInTheDocument()
    expect(screen.getByText('68,250원')).toBeInTheDocument()
    expect(screen.getByText('-10,510원')).toBeInTheDocument()
    expect(screen.getAllByText('3,657,740원')).toHaveLength(2)
  })

  it('가입하면 완료 화면으로 넘어간다', async () => {
    const user = await setUpWithAmount('300000')
    await user.click(screen.getByRole('button', { name: '가입하기' }))
    await screen.findByRole('heading', { name: '이대로 가입할까요?' })

    await user.click(screen.getAllByRole('button', { name: '가입하기' }).at(-1)!)

    expect(await screen.findByRole('heading', { name: '적금에 가입했어요' })).toBeInTheDocument()
    expect(screen.getByText('매달 300,000원씩 12개월 동안 모아요. 만기가 되면 알려 드릴게요.')).toBeInTheDocument()
  })

  it('가입에 실패하면 확인 화면에 남아 다시 시도할 수 있다', async () => {
    server.use(http.post(`${BASE}/accounts`, () => HttpResponse.json({}, { status: 500 }), { once: true }))
    const user = await setUpWithAmount('300000')
    await user.click(screen.getByRole('button', { name: '가입하기' }))
    await screen.findByRole('heading', { name: '이대로 가입할까요?' })

    await user.click(screen.getAllByRole('button', { name: '가입하기' }).at(-1)!)

    expect(await screen.findByText('가입하지 못했어요. 잠시 후 다시 시도해 주세요.')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: '가입하기' }).at(-1)).toBeEnabled()
  })
})
