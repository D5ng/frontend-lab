import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { server } from '../../../src/mocks/server'

const BASE = '/api/drills/2026-11-02'
const CLASS_URL = `${BASE}/classes/mat-1104-1900`

// 문제 2의 화면 위에 구현한다. 앞 테스트의 화면이 남지 않도록 테스트마다 모듈을 새로 불러온다.
beforeEach(() => {
  vi.resetModules()
})

type ClassResponse = { gymClass: Record<string, unknown>; passes: unknown[] }

// 모의 서버의 기본 응답을 받아 자리가 모두 찬 수업으로 바꿔 돌려준다.
async function respondWithFullClass(change: Record<string, unknown> = {}) {
  const response = await fetch(new URL(CLASS_URL, window.location.origin))
  const original = (await response.json()) as ClassResponse
  const gymClass = { ...original.gymClass, bookedCount: 8, waitlistCount: 3, myWaitlist: null, ...change }
  server.use(http.get(CLASS_URL, () => HttpResponse.json({ ...original, gymClass })))
}

async function renderProblem() {
  const { Problem } = await import('../problem-2/Problem')
  render(<Problem />)
  await screen.findByRole('heading', { name: '매트 필라테스 중급' })
  return userEvent.setup()
}

describe('대기 신청', () => {
  it.skip('자리가 모두 차면 기다리는 사람 수와 대기 규칙을 보여 주고 대기 신청할 수 있다', async () => {
    await respondWithFullClass()
    await renderProblem()

    expect(screen.getByText('자리가 모두 찼어요')).toBeInTheDocument()
    expect(screen.getByText('지금 3명이 기다리고 있어요')).toBeInTheDocument()
    expect(
      screen.getByText(
        '11월 4일 (수) 오후 3:00까지 자리가 나지 않으면 대기는 저절로 취소돼요. 자리가 나면 대기 순서대로 예약하고 알려 드려요.',
      ),
    ).toBeInTheDocument()
    expect(screen.queryByText(/취소하면 수강권 1회가 돌아와요/)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '대기 신청하기' })).toBeEnabled()
  })

  it.skip('대기 신청하면 결과를 알리고 내 대기 순서를 보여 준다', async () => {
    await respondWithFullClass()
    const user = await renderProblem()

    await user.click(screen.getByRole('button', { name: '대기 신청하기' }))

    expect(await screen.findByText('대기 신청했어요. 자리가 나면 알려 드릴게요.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '대기 4번째예요' })).toBeDisabled()
    expect(screen.getByText('지금 4명이 기다리고 있어요')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /그룹 10회권/ })).toHaveTextContent('7회 남음')
  })

  it.skip('대기 신청하는 동안 대기 신청 버튼과 수강권 바꾸기를 함께 잠근다', async () => {
    await respondWithFullClass()
    server.use(
      http.post(`${CLASS_URL}/waitlist`, async () => {
        await delay('infinite')
      }),
    )
    const user = await renderProblem()

    await user.click(screen.getByRole('button', { name: '대기 신청하기' }))

    // 누른 버튼은 불러오는 표시로 바뀌어 접근 이름이 달라질 수 있어서 글자로 찾는다.
    expect(screen.getByText('대기 신청하기').closest('button')).toBeDisabled()
    expect(screen.getByRole('button', { name: /그룹 10회권/ })).toBeDisabled()
  })

  it.skip('대기 신청에 실패하면 이유를 알리고 다시 시도할 수 있다', async () => {
    await respondWithFullClass()
    server.use(http.post(`${CLASS_URL}/waitlist`, () => HttpResponse.json({}, { status: 500 }), { once: true }))
    const user = await renderProblem()

    await user.click(screen.getByRole('button', { name: '대기 신청하기' }))

    expect(await screen.findByText('대기 신청하지 못했어요. 잠시 후 다시 시도해 주세요.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '대기 신청하기' })).toBeEnabled()
  })

  it.skip('이미 대기 중인 수업을 다시 열면 내 대기 순서를 보여 준다', async () => {
    await respondWithFullClass({ myWaitlist: { passId: 'group-30', position: 2 } })
    await renderProblem()

    expect(screen.getByRole('button', { name: '대기 2번째예요' })).toBeDisabled()
    expect(screen.getByRole('button', { name: /그룹 30회권/ })).toBeDisabled()
  })
})
