import '@testing-library/jest-dom/vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { server } from '../../../src/mocks/server'

const BASE = '/api/drills/2026-10-31/rooms'

// 집주인이 관리비를 아직 정하지 않은 방이다. 서버는 이때 maintenance_fee를 null로 보낸다.
const roomWithoutFee = {
  room_id: 306,
  title: '방금 올라온 넓은 원룸',
  deposit: 300,
  monthly_rent: 35,
  maintenance_fee: null,
  area_m2: 33.0,
  floor: '2/3',
  available_from: null,
}

const roomWithFee = {
  room_id: 305,
  title: '주인 세대가 같이 사는 깔끔한 원룸',
  deposit: 200,
  monthly_rent: 40,
  maintenance_fee: 3,
  area_m2: 16.5,
  floor: '1/3',
  available_from: null,
}

// Stackflow는 브라우저에서 한 번 만든 화면 스택을 다시 렌더링해도 이어 쓴다(jsdom도 브라우저로 본다).
// 앞 테스트에서 넘어간 화면이 남지 않도록 테스트마다 문제 모듈을 새로 불러온다.
beforeEach(() => {
  vi.resetModules()
  server.use(
    http.get(BASE, () => HttpResponse.json({ rooms: [roomWithoutFee, roomWithFee], total_count: 2 })),
    http.get(`${BASE}/306`, () =>
      HttpResponse.json({ ...roomWithoutFee, description: '관리비는 집주인이 정하는 중이에요.', options: ['AIRCON'] }),
    ),
  )
})

async function renderProblem() {
  const user = userEvent.setup()
  const { Problem } = await import('../problem-2/Problem')
  render(<Problem />)
  return user
}

// 버그를 고친 뒤 it.skip을 it으로 바꿔 통과시킨다.
describe('관리비를 아직 정하지 않은 방', () => {
  it.skip('목록에서 관리비를 물어봐야 한다고 보여 준다', async () => {
    await renderProblem()

    const room = await screen.findByRole('button', { name: /^월세 300\/35/ })

    expect(within(room).getByText('관리비 문의 · 10평 · 2층')).toBeInTheDocument()
  })

  it.skip('매달 드는 돈 적은 순에서는 관리비를 아는 방 뒤에 보여 준다', async () => {
    const user = await renderProblem()
    await screen.findByRole('button', { name: /^월세 300\/35/ })

    await user.click(screen.getByRole('radio', { name: '매달 드는 돈 적은 순' }))

    const names = screen.getAllByRole('button', { name: /^월세/ }).map((button) => button.textContent)
    expect(names[0]).toMatch(/^월세 200\/40/)
    expect(names[1]).toMatch(/^월세 300\/35/)
  })

  it.skip('방 정보에서 관리비를 물어봐야 한다고 알리고, 매달 드는 돈에 관리비가 빠졌다고 보여 준다', async () => {
    const user = await renderProblem()
    await user.click(await screen.findByRole('button', { name: /^월세 300\/35/ }))
    await screen.findByRole('heading', { name: '월세 300/35' })

    expect(screen.getByText('집주인에게 문의')).toBeInTheDocument()
    expect(screen.getByText('35만원 + 관리비')).toBeInTheDocument()
  })
})
