import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { INITIAL_INSTRUCTIONS, createSaveMock } from './api'
import { uiPreviews } from './preview'
import { InstructionsEditor } from './starter'
import { InstructionsView } from './view'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('출제자가 준비한 UI와 모의 API', () => {
  it('입력 라벨과 공개된 안내를 표시하고 저장 전에는 주요 조작을 비활성화한다', () => {
    render(<InstructionsView {...uiPreviews.initial} />)
    expect(screen.getByRole('textbox', { name: '거래 안내' })).toHaveValue(INITIAL_INSTRUCTIONS)
    expect(screen.getByRole('region', { name: '현재 공개된 안내' })).toHaveTextContent(INITIAL_INSTRUCTIONS)
    expect(screen.getByRole('button', { name: '저장하기' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '되돌리기' })).toBeDisabled()
  })

  it.each(['loading', 'empty', 'error', 'success'])('%s 상태의 화면 표현을 제공한다', (state) => {
    render(<InstructionsView {...uiPreviews[state]} />)
    if (state === 'loading') {
      expect(screen.getByRole('textbox', { name: '거래 안내' })).toBeDisabled()
      expect(screen.getByRole('button', { name: '저장 중...' })).toBeDisabled()
      expect(screen.getByRole('button', { name: '되돌리기' })).toBeDisabled()
      expect(screen.getByRole('status')).toHaveTextContent('저장 중...')
    } else if (state === 'empty') {
      expect(screen.getByRole('textbox', { name: '거래 안내' })).toBeInvalid()
      expect(screen.getByText('거래 안내를 입력해 주세요.')).toBeInTheDocument()
    } else {
      expect(screen.getByRole('status')).toHaveTextContent(
        state === 'error' ? '저장하지 못했어요. 다시 시도해 주세요.' : '거래 안내를 저장했어요.',
      )
    }
  })

  it('편집 가능한 UI는 입력·저장·되돌리기 사용자 행동을 전달한다', async () => {
    const user = userEvent.setup()
    const onTextChange = vi.fn()
    const onSave = vi.fn()
    const onRestore = vi.fn()
    render(<InstructionsView {...uiPreviews.editing} onTextChange={onTextChange} onSave={onSave} onRestore={onRestore} />)
    await user.type(screen.getByRole('textbox', { name: '거래 안내' }), '!')
    expect(onTextChange).toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: '저장하기' }))
    await user.click(screen.getByRole('button', { name: '되돌리기' }))
    expect(onSave).toHaveBeenCalledOnce()
    expect(onRestore).toHaveBeenCalledOnce()
  })

  it('모의 API는 첫 요청에 실패하고 재시도에 정리된 문자열을 반환한다', async () => {
    vi.useFakeTimers()
    const save = createSaveMock()
    const first = expect(save({ text: '  도서관 앞  ' })).rejects.toThrow('network unavailable')
    await vi.advanceTimersByTimeAsync(800)
    await first
    const second = save({ text: '  도서관 앞  ' })
    await vi.advanceTimersByTimeAsync(800)
    await expect(second).resolves.toEqual({ text: '도서관 앞' })
  })
})

// 구현을 시작할 때 이 블록의 .skip을 제거하세요. 현재는 미완성 스타터이므로 건너뜁니다.
describe('실습자가 구현할 거래 안내 편집 행동', () => {
  it('편집 중에는 공개된 안내를 유지하고 되돌리기는 저장된 안내를 복원한다', async () => {
    const user = userEvent.setup()
    const saveInstructions = vi.fn()
    render(<InstructionsEditor saveInstructions={saveInstructions} />)
    const input = screen.getByRole('textbox', { name: '거래 안내' })
    await user.clear(input)
    await user.type(input, '도서관 앞에서 만나요.')
    expect(screen.getByRole('region', { name: '현재 공개된 안내' })).toHaveTextContent(INITIAL_INSTRUCTIONS)
    expect(screen.getByRole('button', { name: '저장하기' })).toBeEnabled()
    await user.click(screen.getByRole('button', { name: '되돌리기' }))
    expect(input).toHaveValue(INITIAL_INSTRUCTIONS)
    expect(saveInstructions).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: '저장하기' })).toBeDisabled()
  })

  it('공백뿐인 안내는 요청하지 않고 입력 옆에서 안내한다', async () => {
    const user = userEvent.setup()
    const saveInstructions = vi.fn()
    render(<InstructionsEditor saveInstructions={saveInstructions} />)
    await user.clear(screen.getByRole('textbox', { name: '거래 안내' }))
    await user.type(screen.getByRole('textbox', { name: '거래 안내' }), '   ')
    await user.click(screen.getByRole('button', { name: '저장하기' }))
    expect(screen.getByText('거래 안내를 입력해 주세요.')).toBeInTheDocument()
    expect(saveInstructions).not.toHaveBeenCalled()
  })

  it('저장 중 조작을 잠그고 성공 응답을 새 공개값과 되돌리기 기준으로 삼는다', async () => {
    const user = userEvent.setup()
    let resolve!: (value: { text: string }) => void
    const saveInstructions = vi.fn().mockReturnValue(
      new Promise<{ text: string }>((complete) => {
        resolve = complete
      }),
    )
    render(<InstructionsEditor saveInstructions={saveInstructions} />)
    const input = screen.getByRole('textbox', { name: '거래 안내' })
    await user.clear(input)
    await user.type(input, '  도서관 앞  ')
    await user.click(screen.getByRole('button', { name: '저장하기' }))
    expect(saveInstructions).toHaveBeenCalledExactlyOnceWith({ text: '도서관 앞' })
    expect(input).toBeDisabled()
    expect(screen.getByRole('button', { name: '되돌리기' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: '저장 중...' }))
    expect(saveInstructions).toHaveBeenCalledOnce()
    expect(screen.getByRole('region', { name: '현재 공개된 안내' })).toHaveTextContent(INITIAL_INSTRUCTIONS)
    await act(async () => {
      resolve({ text: '도서관 정문 앞' })
    })
    expect(input).toHaveValue('도서관 정문 앞')
    expect(screen.getByRole('region', { name: '현재 공개된 안내' })).toHaveTextContent('도서관 정문 앞')
    expect(screen.getByRole('status')).toHaveTextContent('거래 안내를 저장했어요.')
    expect(screen.getByRole('button', { name: '저장하기' })).toBeDisabled()
    await user.clear(input)
    await user.type(input, '다른 장소')
    expect(screen.queryByText('거래 안내를 저장했어요.')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '되돌리기' }))
    expect(input).toHaveValue('도서관 정문 앞')
  })

  it('실패하면 공개값과 작성값을 보존하고 같은 내용으로 다시 저장할 수 있다', async () => {
    const user = userEvent.setup()
    const saveInstructions = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue({ text: '도서관 앞' })
    render(<InstructionsEditor saveInstructions={saveInstructions} />)
    const input = screen.getByRole('textbox', { name: '거래 안내' })
    await user.clear(input)
    await user.type(input, '도서관 앞')
    await user.click(screen.getByRole('button', { name: '저장하기' }))
    expect(await screen.findByRole('status')).toHaveTextContent('저장하지 못했어요. 다시 시도해 주세요.')
    expect(input).toHaveValue('도서관 앞')
    expect(within(screen.getByRole('region', { name: '현재 공개된 안내' })).getByText(INITIAL_INSTRUCTIONS)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '저장하기' })).toBeEnabled()
    await user.click(screen.getByRole('button', { name: '저장하기' }))
    expect(saveInstructions).toHaveBeenCalledTimes(2)
    expect(saveInstructions.mock.calls[0][0]).toEqual(saveInstructions.mock.calls[1][0])
    expect(screen.getByRole('status')).toHaveTextContent('거래 안내를 저장했어요.')
  })
})
