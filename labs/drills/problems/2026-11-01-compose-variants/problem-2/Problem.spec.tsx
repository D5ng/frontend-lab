import '@testing-library/jest-dom/vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { server } from '../../../src/mocks/server'

const BASE = '/api/drills/2026-11-01'

// Stackflow는 브라우저에서 한 번 만든 화면 스택을 다시 렌더링해도 이어 쓴다(jsdom도 브라우저로 본다).
// 앞 테스트의 화면이 남지 않도록 테스트마다 문제 모듈을 새로 불러온다.
beforeEach(() => {
  vi.resetModules()
})

async function renderProblem() {
  const { Problem } = await import('./Problem')
  render(<Problem />)
}

// 이름을 굵게 쓰는 것처럼 문장이 여러 요소로 나뉘어도 한 문장으로 찾는다.
function sentence(text: string) {
  return (_: string, element: Element | null) =>
    element?.textContent === text && Array.from(element.children).every((child) => child.textContent !== text)
}

// 알림 하나는 목록의 한 항목이다. 그 안의 문장으로 항목을 찾는다.
async function findNotification(text: string) {
  const node = await screen.findByText(sentence(text))
  const item = screen.getAllByRole('listitem').find((element) => element.contains(node))
  if (!item) throw new Error(`"${text}"가 목록 항목 안에 없어요.`)
  return item
}

async function findInvite() {
  return findNotification('박준호님이 주말 러닝 크루에 초대했어요')
}

// 알림함을 처음부터 만든 뒤 it.skip을 it으로 바꿔 통과시킨다.
describe('알림 목록', () => {
  it.skip('받은 순서대로 보여 주고, 언제 받았는지 알려 준다', async () => {
    await renderProblem()
    await findInvite()

    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('김민지님이 내 글에 댓글을 남겼어요')
    expect(items[0]).toHaveTextContent('3분 전')
    expect(items[1]).toHaveTextContent('김민지님 외 3명이 내 글을 좋아해요')
    expect(items[1]).toHaveTextContent('2시간 전')
    expect(items[2]).toHaveTextContent('박준호님이 주말 러닝 크루에 초대했어요')
    expect(items[2]).toHaveTextContent('어제')
    expect(items[3]).toHaveTextContent('2일 전')
    expect(items[4]).toHaveTextContent('3일 전')
  })

  it.skip('댓글 알림은 댓글 내용을, 좋아요 알림은 글 제목을 함께 보여 준다', async () => {
    await renderProblem()

    const comment = await findNotification('김민지님이 내 글에 댓글을 남겼어요')
    expect(comment).toHaveTextContent('다음엔 저도 같이 뛰어요!')
    const like = await findNotification('김민지님 외 3명이 내 글을 좋아해요')
    expect(like).toHaveTextContent('토요일 아침 한강 러닝 후기')
  })

  it.skip('좋아요를 한 명만 눌렀으면 그 사람 이름만 보여 준다', async () => {
    await renderProblem()

    const like = await findNotification('이서연님이 내 글을 좋아해요')
    expect(like).toHaveTextContent('망원동 저녁 산책 같이 해요')
  })

  it.skip('초대 알림은 모임 멤버 수를 함께 보여 준다', async () => {
    await renderProblem()

    expect(await findInvite()).toHaveTextContent('멤버 24명')
  })

  it.skip('읽지 않은 알림은 읽지 않았다고 알려 준다', async () => {
    await renderProblem()
    await findInvite()

    const items = screen.getAllByRole('listitem')
    expect(within(items[0]!).getByText('읽지 않음')).toBeInTheDocument()
    expect(within(items[1]!).getByText('읽지 않음')).toBeInTheDocument()
    expect(screen.getAllByText('읽지 않음')).toHaveLength(2)
  })

  it.skip('알림을 불러오지 못하면 다시 불러올 수 있다', async () => {
    server.use(http.get(`${BASE}/notifications`, () => HttpResponse.json({}, { status: 500 }), { once: true }))
    const user = userEvent.setup()
    await renderProblem()

    await user.click(await screen.findByRole('button', { name: '다시 불러오기' }))

    expect(await findInvite()).toBeInTheDocument()
  })

  it.skip('받은 알림이 없으면 없다고 알려 준다', async () => {
    server.use(http.get(`${BASE}/notifications`, () => HttpResponse.json({ now: '2026-11-01T09:00:00+09:00', notifications: [] })))
    await renderProblem()

    expect(await screen.findByText('아직 받은 알림이 없어요')).toBeInTheDocument()
  })
})

describe('모임 초대에 답하기', () => {
  it.skip('참여하기를 누르면 버튼 자리에 참여했다고 알려 준다', async () => {
    const user = userEvent.setup()
    await renderProblem()
    const invite = await findInvite()

    await user.click(within(invite).getByRole('button', { name: '참여하기' }))

    expect(await within(invite).findByText('모임에 참여했어요')).toBeInTheDocument()
    expect(within(invite).queryByRole('button')).not.toBeInTheDocument()
  })

  it.skip('거절을 누르면 버튼 자리에 거절했다고 알려 준다', async () => {
    const user = userEvent.setup()
    await renderProblem()
    const invite = await findInvite()

    await user.click(within(invite).getByRole('button', { name: '거절' }))

    expect(await within(invite).findByText('초대를 거절했어요')).toBeInTheDocument()
    expect(within(invite).queryByRole('button')).not.toBeInTheDocument()
  })

  it.skip('답하는 동안에는 두 버튼 모두 누를 수 없다', async () => {
    server.use(
      http.post(`${BASE}/notifications/:id/answer`, async () => {
        await delay('infinite')
        return HttpResponse.json({})
      }),
    )
    const user = userEvent.setup()
    await renderProblem()
    const invite = await findInvite()

    await user.click(within(invite).getByRole('button', { name: '참여하기' }))

    // 누른 버튼은 불러오는 표시로 바뀌어 이름이 달라질 수 있어서 이름 없이 찾는다.
    const buttons = within(invite).getAllByRole('button')
    expect(buttons).toHaveLength(2)
    for (const button of buttons) expect(button).toBeDisabled()
  })

  it.skip('답하지 못하면 이유를 알려 주고 다시 누를 수 있다', async () => {
    server.use(http.post(`${BASE}/notifications/:id/answer`, () => HttpResponse.json({}, { status: 500 }), { once: true }))
    const user = userEvent.setup()
    await renderProblem()
    const invite = await findInvite()

    await user.click(within(invite).getByRole('button', { name: '참여하기' }))

    expect(await within(invite).findByText('답하지 못했어요. 다시 눌러 주세요.')).toBeInTheDocument()
    await user.click(within(invite).getByRole('button', { name: '참여하기' }))
    expect(await within(invite).findByText('모임에 참여했어요')).toBeInTheDocument()
  })

  it.skip('이미 답한 초대는 버튼 없이 결과만 보여 준다', async () => {
    await renderProblem()

    const answered = await findNotification('정하린님이 망원 책 읽는 밤에 초대했어요')
    expect(answered).toHaveTextContent('모임에 참여했어요')
    expect(within(answered).queryByRole('button')).not.toBeInTheDocument()
  })
})
