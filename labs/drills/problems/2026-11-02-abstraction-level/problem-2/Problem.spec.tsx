import '@testing-library/jest-dom/vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { server } from '../../../src/mocks/server'
import type { ClassDetailResponse } from './api'

const BASE = '/api/drills/2026-11-02'
const CLASS_URL = `${BASE}/classes/mat-1104-1900`

// Stackflow는 브라우저에서 한 번 만든 화면 스택을 다시 렌더링해도 이어 쓴다(jsdom도 브라우저로 본다).
// 앞 테스트의 화면이 남지 않도록 테스트마다 문제 모듈을 새로 불러온다.
beforeEach(() => {
  vi.resetModules()
})

async function renderProblem() {
  const { Problem } = await import('./Problem')
  render(<Problem />)
  await screen.findByRole('heading', { name: '매트 필라테스 중급' })
  return userEvent.setup()
}

// 모의 서버의 기본 응답을 받아 일부만 바꿔 돌려준다.
async function respondWith(change: (response: ClassDetailResponse) => ClassDetailResponse) {
  const response = await fetch(new URL(CLASS_URL, window.location.origin))
  const original = (await response.json()) as ClassDetailResponse
  server.use(http.get(CLASS_URL, () => HttpResponse.json(change(original))))
}

describe('수업 정보', () => {
  it('수업 일시, 남은 자리, 강사, 취소 기한을 보여 준다', async () => {
    await renderProblem()

    expect(screen.getByText('11월 4일 (수) 오후 7:00 · 50분')).toBeInTheDocument()
    expect(screen.getByText('8자리 중 2자리 남았어요')).toBeInTheDocument()
    expect(screen.getByText('마감 임박')).toBeInTheDocument()
    expect(screen.getByText('정다은 강사')).toBeInTheDocument()
    expect(
      screen.getByText('11월 4일 (수) 오후 3:00까지 취소하면 수강권 1회가 돌아와요. 그 뒤에 취소하거나 오지 않으면 1회가 빠져요.'),
    ).toBeInTheDocument()
  })

  it('자리가 넉넉하면 마감 임박을 보여 주지 않는다', async () => {
    await respondWith((response) => ({ ...response, gymClass: { ...response.gymClass, bookedCount: 3 } }))
    await renderProblem()

    expect(screen.getByText('8자리 중 5자리 남았어요')).toBeInTheDocument()
    expect(screen.queryByText('마감 임박')).not.toBeInTheDocument()
  })

  it('수업 정보를 불러오지 못하면 다시 불러올 수 있다', async () => {
    server.use(http.get(CLASS_URL, () => HttpResponse.json({}, { status: 500 }), { once: true }))
    const { Problem } = await import('./Problem')
    render(<Problem />)
    const user = userEvent.setup()

    await user.click(await screen.findByRole('button', { name: '다시 불러오기' }))

    expect(await screen.findByRole('heading', { name: '매트 필라테스 중급' })).toBeInTheDocument()
  })
})

describe('수강권 고르기', () => {
  it('이 수업에 쓸 수 있는 첫 수강권이 골라져 있다', async () => {
    await renderProblem()

    expect(screen.getByRole('button', { name: /그룹 10회권/ })).toHaveTextContent('7회 남음 · 12월 31일까지')
  })

  it('다 쓴 수강권과 수업 전에 끝나는 수강권은 고를 수 없고, 다른 수강권을 고르면 바뀐다', async () => {
    const user = await renderProblem()

    await user.click(screen.getByRole('button', { name: /그룹 10회권/ }))
    const sheet = await screen.findByRole('dialog', { name: '수강권 고르기' })
    expect(within(sheet).getByRole('button', { name: /그룹 4회권/ })).toBeDisabled()
    expect(within(sheet).getByRole('button', { name: /체험 1회권/ })).toBeDisabled()
    expect(within(sheet).getByText('11월 3일에 끝나서 이 수업에는 쓸 수 없어요')).toBeInTheDocument()

    await user.click(within(sheet).getByRole('button', { name: /그룹 30회권/ }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.getByRole('button', { name: /그룹 30회권/ })).toHaveTextContent('18회 남음 · 3월 31일까지')
  })

  it('쓸 수 있는 수강권이 없으면 이유를 알려 주고 예약할 수 없다', async () => {
    await respondWith((response) => ({
      ...response,
      passes: response.passes.filter((pass) => pass.remainingCount === 0 || pass.id === 'trial-1'),
    }))
    await renderProblem()

    expect(screen.getByText('쓸 수 있는 수강권이 없어요')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '예약하기' })).toBeDisabled()
  })
})

describe('예약하기', () => {
  it('예약하면 결과를 알리고, 남은 자리와 수강권 횟수가 줄어든다', async () => {
    const user = await renderProblem()

    await user.click(screen.getByRole('button', { name: '예약하기' }))

    expect(await screen.findByText('예약했어요. 수업에서 만나요.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '예약한 수업이에요' })).toBeDisabled()
    expect(screen.getByText('8자리 중 1자리 남았어요')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /그룹 10회권/ })).toHaveTextContent('6회 남음')
  })

  it('예약하는 동안 예약 버튼과 수강권 바꾸기를 함께 잠근다', async () => {
    server.use(
      http.post(`${CLASS_URL}/bookings`, async () => {
        await delay('infinite')
      }),
    )
    const user = await renderProblem()

    await user.click(screen.getByRole('button', { name: '예약하기' }))

    // 누른 버튼은 불러오는 표시로 바뀌어 접근 이름이 달라질 수 있어서 글자로 찾는다.
    expect(screen.getByText('예약하기').closest('button')).toBeDisabled()
    expect(screen.getByRole('button', { name: /그룹 10회권/ })).toBeDisabled()
  })

  it('예약에 실패하면 이유를 알리고 다시 시도할 수 있다', async () => {
    server.use(http.post(`${CLASS_URL}/bookings`, () => HttpResponse.json({}, { status: 500 }), { once: true }))
    const user = await renderProblem()

    await user.click(screen.getByRole('button', { name: '예약하기' }))

    expect(await screen.findByText('예약하지 못했어요. 잠시 후 다시 시도해 주세요.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '예약하기' })).toBeEnabled()
  })

  it('자리가 모두 찼으면 예약할 수 없다', async () => {
    await respondWith((response) => ({ ...response, gymClass: { ...response.gymClass, bookedCount: 8 } }))
    await renderProblem()

    expect(screen.getByText('자리가 모두 찼어요')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '예약하기' })).toBeDisabled()
  })
})
