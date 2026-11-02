import '@testing-library/jest-dom/vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { server } from '../../../src/mocks/server'

const BASE = '/api/drills/2026-10-31/rooms'

// Stackflow는 브라우저에서 한 번 만든 화면 스택을 다시 렌더링해도 이어 쓴다(jsdom도 브라우저로 본다).
// 앞 테스트에서 넘어간 화면이 남지 않도록 테스트마다 문제 모듈을 새로 불러온다.
beforeEach(() => {
  vi.resetModules()
})

async function renderProblem() {
  const user = userEvent.setup()
  const { Problem } = await import('./Problem')
  render(<Problem />)
  return user
}

async function findRoomButtons() {
  return screen.findAllByRole('button', { name: /^월세/ })
}

async function openRoom(price: string) {
  const user = await renderProblem()
  await user.click(await screen.findByRole('button', { name: new RegExp(`^월세 ${price}`) }))
  await screen.findByRole('heading', { name: `월세 ${price}` })
  return user
}

describe('원룸 목록', () => {
  it('방마다 보증금과 월세, 관리비, 평수, 층을 보여 주고 바로 들어갈 수 있는 방에 표시한다', async () => {
    await renderProblem()

    const [first, second] = await findRoomButtons()
    expect(first).toHaveAccessibleName(/^월세 500\/45/)
    expect(within(first).getByText('관리비 7만 · 7평 · 3층')).toBeInTheDocument()
    expect(second).toHaveAccessibleName(/^월세 1,000\/50/)
    expect(within(second).getByText('관리비 5만 · 9평 · 2층')).toBeInTheDocument()
    expect(screen.getAllByText('바로 입주')).toHaveLength(3)
  })

  it('매달 드는 돈 적은 순으로 바꾸면 월세와 관리비를 더한 금액이 적은 방부터 보여 준다', async () => {
    const user = await renderProblem()
    await findRoomButtons()

    await user.click(screen.getByRole('radio', { name: '매달 드는 돈 적은 순' }))

    const names = (await findRoomButtons()).map((button) => button.textContent)
    expect(names[0]).toMatch(/^월세 200\/40/)
    expect(names[1]).toMatch(/^월세 500\/38/)
    expect(names[2]).toMatch(/^월세 500\/45/)
    expect(names[3]).toMatch(/^월세 1,000\/50/)
    expect(names[4]).toMatch(/^월세 300\/55/)
  })

  it('올라온 방이 없으면 그렇다고 알려 준다', async () => {
    server.use(http.get(BASE, () => HttpResponse.json({ rooms: [], total_count: 0 }), { once: true }))
    await renderProblem()

    expect(await screen.findByText('아직 이 동네에 올라온 방이 없어요')).toBeInTheDocument()
  })

  it('목록을 불러오지 못하면 다시 불러올 수 있다', async () => {
    server.use(http.get(BASE, () => HttpResponse.json({}, { status: 500 }), { once: true }))
    const user = await renderProblem()

    await user.click(await screen.findByRole('button', { name: '다시 불러오기' }))

    expect(await findRoomButtons()).toHaveLength(5)
  })
})

describe('방 정보', () => {
  it('돈과 방 정보를 목록과 같은 기준으로 보여 준다', async () => {
    await openRoom('500/45')

    expect(screen.getByText('500만원')).toBeInTheDocument()
    expect(screen.getByText('45만원')).toBeInTheDocument()
    expect(screen.getByText('7만원')).toBeInTheDocument()
    expect(screen.getByText('52만원')).toBeInTheDocument()
    expect(screen.getByText('23.1㎡ (7평)')).toBeInTheDocument()
    expect(screen.getByText('3층 (전체 5층)')).toBeInTheDocument()
    expect(screen.getByText('바로 들어갈 수 있어요')).toBeInTheDocument()
    expect(screen.getByText('세탁기')).toBeInTheDocument()
  })

  it('입주 날짜가 정해진 방은 그날부터 들어갈 수 있다고 알려 준다', async () => {
    await openRoom('1,000/50')

    expect(screen.getByText('11월 15일부터')).toBeInTheDocument()
    expect(screen.getByText('인덕션')).toBeInTheDocument()
  })

  it('방 정보를 불러오지 못하면 다시 불러올 수 있다', async () => {
    server.use(http.get(`${BASE}/:roomId`, () => HttpResponse.json({}, { status: 500 }), { once: true }))
    const user = await renderProblem()
    await user.click(await screen.findByRole('button', { name: /^월세 500\/45/ }))

    await user.click(await screen.findByRole('button', { name: '다시 불러오기' }))

    expect(await screen.findByRole('heading', { name: '월세 500/45' })).toBeInTheDocument()
  })
})

describe('방 보기 요청', () => {
  it('요청하면 결과를 알려 주고 다시 요청할 수 없다', async () => {
    const user = await openRoom('500/45')

    await user.click(screen.getByRole('button', { name: '방 보기 요청하기' }))

    expect(await screen.findByText('방 보기를 요청했어요. 집주인이 연락하면 알려 드릴게요.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '방 보기를 요청했어요' })).toBeDisabled()
  })

  it('요청에 실패하면 이유를 알려 주고 다시 요청할 수 있다', async () => {
    server.use(http.post(`${BASE}/:roomId/visit-requests`, () => HttpResponse.json({}, { status: 500 }), { once: true }))
    const user = await openRoom('500/45')

    await user.click(screen.getByRole('button', { name: '방 보기 요청하기' }))

    expect(await screen.findByText('요청하지 못했어요. 잠시 후 다시 시도해 주세요.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '방 보기 요청하기' })).toBeEnabled()
  })
})
