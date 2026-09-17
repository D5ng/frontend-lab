import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Problem } from './Problem'

function createDeferred() {
  let resolve: (() => void) | undefined
  const promise = new Promise<void>((complete) => {
    resolve = complete
  })

  return {
    promise,
    resolve: () => resolve?.(),
  }
}

describe('행사 신청', () => {
  it('처음에는 온라인 접속 URL 입력을 보여준다', () => {
    render(<Problem />)

    expect(screen.getByRole('radio', { name: '온라인' })).toBeChecked()
    expect(screen.getByRole('textbox', { name: '온라인 접속 URL' })).toBeVisible()
    expect(screen.queryByRole('textbox', { name: '오프라인 장소' })).not.toBeInTheDocument()
  })

  it('행사 유형을 바꿔도 각 유형의 입력값을 보존한다', async () => {
    const user = userEvent.setup()
    render(<Problem />)

    await user.type(screen.getByRole('textbox', { name: '온라인 접속 URL' }), 'https://example.com/event')
    await user.click(screen.getByRole('radio', { name: '오프라인' }))
    await user.type(screen.getByRole('textbox', { name: '오프라인 장소' }), '강남구 테헤란로 1')
    await user.click(screen.getByRole('radio', { name: '온라인' }))

    expect(screen.getByRole('textbox', { name: '온라인 접속 URL' })).toHaveValue('https://example.com/event')

    await user.click(screen.getByRole('radio', { name: '오프라인' }))

    expect(screen.getByRole('textbox', { name: '오프라인 장소' })).toHaveValue('강남구 테헤란로 1')
  })

  it('임시 저장은 빈 입력값으로도 요청할 수 있다', async () => {
    const user = userEvent.setup()
    const onSaveDraft = vi.fn().mockResolvedValue(undefined)
    render(<Problem onSaveDraft={onSaveDraft} />)

    await user.click(screen.getByRole('button', { name: '임시 저장' }))

    await waitFor(() => expect(onSaveDraft).toHaveBeenCalledWith({ eventType: 'online', offlineLocation: '', onlineUrl: '', title: '' }))
    expect(screen.getByText('임시 저장했어요.')).toBeVisible()
  })

  it('행사 제목 없이 게시하면 제목 입력 안내를 보여준다', async () => {
    const user = userEvent.setup()
    render(<Problem />)

    await user.click(screen.getByRole('button', { name: '게시하기' }))

    expect(screen.getByText('행사 제목을 입력해 주세요.')).toBeVisible()
  })

  it('현재 선택한 유형에 필요한 입력값이 없으면 게시하지 않는다', async () => {
    const user = userEvent.setup()
    const onPublish = vi.fn().mockResolvedValue(undefined)
    render(<Problem onPublish={onPublish} />)

    await user.type(screen.getByRole('textbox', { name: '행사 제목' }), '프런트엔드 품질 세미나')
    await user.click(screen.getByRole('radio', { name: '오프라인' }))
    await user.click(screen.getByRole('button', { name: '게시하기' }))

    expect(screen.getByText('오프라인 장소를 입력해 주세요.')).toBeVisible()
    expect(onPublish).not.toHaveBeenCalled()
  })

  it('임시 저장 중에는 두 작업을 다시 실행할 수 없다', async () => {
    const user = userEvent.setup()
    const deferred = createDeferred()
    const onSaveDraft = vi.fn().mockReturnValue(deferred.promise)
    render(<Problem onSaveDraft={onSaveDraft} />)

    await user.click(screen.getByRole('button', { name: '임시 저장' }))

    expect(screen.getByRole('button', { name: '임시 저장 중...' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '게시하기' })).toBeDisabled()

    deferred.resolve()

    await waitFor(() => expect(screen.getByText('임시 저장했어요.')).toBeVisible())
  })
})
