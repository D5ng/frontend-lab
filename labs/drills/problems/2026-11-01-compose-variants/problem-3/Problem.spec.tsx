import '@testing-library/jest-dom/vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { server } from '../../../src/mocks/server'
import { inbox } from '../problem-2/handlers'

const BASE = '/api/drills/2026-11-01'

const scheduleChanged = {
  id: 6,
  type: 'scheduleChanged',
  createdAt: '2026-10-27T21:00:00+09:00',
  read: true,
  group: { name: '망원 책 읽는 밤' },
  before: '2026-11-06T19:30:00+09:00',
  after: '2026-11-07T19:30:00+09:00',
}

// Stackflow는 브라우저에서 한 번 만든 화면 스택을 다시 렌더링해도 이어 쓴다(jsdom도 브라우저로 본다).
// 앞 테스트의 화면이 남지 않도록 테스트마다 문제 모듈을 새로 불러온다.
beforeEach(() => {
  vi.resetModules()
})

async function renderProblem(notifications: unknown[] = [...inbox.notifications, scheduleChanged]) {
  server.use(http.get(`${BASE}/notifications`, () => HttpResponse.json({ now: inbox.now, notifications })))
  const { Problem } = await import('../problem-2/Problem')
  render(<Problem />)
}

function sentence(text: string) {
  return (_: string, element: Element | null) =>
    element?.textContent === text && Array.from(element.children).every((child) => child.textContent !== text)
}

async function findNotification(text: string) {
  const node = await screen.findByText(sentence(text))
  const item = screen.getAllByRole('listitem').find((element) => element.contains(node))
  if (!item) throw new Error(`"${text}"가 목록 항목 안에 없어요.`)
  return item
}

// 요청을 구현한 뒤 it.skip을 it으로 바꿔 통과시킨다. 문제 2의 테스트도 계속 통과해야 한다.
describe('모임 일정이 바뀌었다는 알림', () => {
  it.skip('바뀌기 전과 바뀐 뒤의 일정을 함께 보여 주고, 버튼은 없다', async () => {
    await renderProblem()

    const notice = await findNotification('망원 책 읽는 밤 모임 일정이 바뀌었어요')
    expect(within(notice).getByText('11월 6일 (금) 오후 7:30')).toBeInTheDocument()
    expect(within(notice).getByText('11월 7일 (토) 오후 7:30')).toBeInTheDocument()
    expect(notice).toHaveTextContent('4일 전')
    expect(within(notice).queryByRole('button')).not.toBeInTheDocument()
  })
})

describe('댓글 알림에서 좋아요 누르기', () => {
  it.skip('좋아요를 누르면 그 댓글에 좋아요를 보내고 눌린 채로 보여 준다', async () => {
    const likedCommentIds: string[] = []
    server.use(
      http.post(`${BASE}/comments/:commentId/likes`, ({ params }) => {
        likedCommentIds.push(String(params.commentId))
        return new HttpResponse(null, { status: 201 })
      }),
    )
    const user = userEvent.setup()
    await renderProblem()
    const comment = await findNotification('김민지님이 내 글에 댓글을 남겼어요')
    const likeButton = within(comment).getByRole('button', { name: '좋아요' })
    expect(likeButton).toHaveAttribute('aria-pressed', 'false')

    await user.click(likeButton)

    await waitFor(() => expect(likeButton).toHaveAttribute('aria-pressed', 'true'))
    expect(likedCommentIds).toEqual(['501'])
  })

  it.skip('이미 좋아요한 댓글은 눌린 채로 보여 준다', async () => {
    const [first, ...rest] = inbox.notifications
    await renderProblem([{ ...first, comment: { ...first!.comment, likedByMe: true } }, ...rest])

    const comment = await findNotification('김민지님이 내 글에 댓글을 남겼어요')
    expect(within(comment).getByRole('button', { name: '좋아요' })).toHaveAttribute('aria-pressed', 'true')
  })

  it.skip('좋아요 알림과 초대 알림에는 좋아요 버튼이 없다', async () => {
    await renderProblem()

    expect(within(await findNotification('김민지님 외 3명이 내 글을 좋아해요')).queryByRole('button')).not.toBeInTheDocument()
    const invite = await findNotification('박준호님이 주말 러닝 크루에 초대했어요')
    expect(within(invite).queryByRole('button', { name: '좋아요' })).not.toBeInTheDocument()
  })
})
