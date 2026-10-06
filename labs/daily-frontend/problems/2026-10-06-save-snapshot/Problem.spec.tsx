import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { INITIAL_MEMO, createDemoSaver, type Memo } from './api'
import { previews } from './preview'
import { MemoEditor } from './starter'
import { MemoView } from './view'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

function deferred() {
  let resolve: (value: Memo) => void = () => {}
  let reject: (reason: Error) => void = () => {}
  const promise = new Promise<Memo>((complete, fail) => {
    resolve = complete
    reject = fail
  })
  return { promise, resolve, reject }
}

const input = () => screen.getByRole('textbox', { name: '메모 내용' })
const saveButton = () => screen.getByRole('button', { name: '메모 저장하기' })
const restoreButton = () => screen.getByRole('button', { name: '저장된 내용으로 되돌리기' })
const savedRegion = () => within(screen.getByRole('region', { name: '마지막 저장된 메모' }))

describe('제공한 화면·API의 검증', () => {
  it('스타터는 로직 미연결을 안내하고 초기 메모만 표시한다', () => {
    const saveMemo = vi.fn()
    render(<MemoEditor initialMemo={INITIAL_MEMO} saveMemo={saveMemo} />)
    expect(screen.getByText(/아직 입력·저장·되돌리기 로직이 연결되지 않았어요/)).toBeVisible()
    expect(input()).toHaveValue(INITIAL_MEMO)
    expect(input()).toHaveAttribute('readonly')
    expect(saveButton()).toBeDisabled()
    expect(saveMemo).not.toHaveBeenCalled()
  })

  it('입력 라벨과 편집·저장·되돌리기 콜백을 연결한다', async () => {
    const user = userEvent.setup()
    const onInputChange = vi.fn(),
      onSave = vi.fn(),
      onRestore = vi.fn()
    render(<MemoView {...previews.editing} onInputChange={onInputChange} onSave={onSave} onRestore={onRestore} />)
    await user.clear(input())
    expect(onInputChange).toHaveBeenLastCalledWith('')
    await user.click(saveButton())
    await user.click(restoreButton())
    expect(onSave).toHaveBeenCalledTimes(1)
    expect(onRestore).toHaveBeenCalledTimes(1)
  })

  it('저장 중에도 입력은 열려 있고 두 버튼은 잠긴다', () => {
    render(<MemoView {...previews.loading} />)
    expect(input()).toBeEnabled()
    expect(input()).not.toHaveAttribute('readonly')
    expect(screen.getByRole('button', { name: '메모 저장 중' })).toBeDisabled()
    expect(restoreButton()).toBeDisabled()
    expect(screen.getByRole('status')).toHaveTextContent('입력은 계속할 수 있어요.')
  })

  it('저장 성공과 미저장 변경을 동시에 표시할 수 있다', () => {
    render(<MemoView {...previews['success-edited']} />)
    expect(savedRegion().getByText('저녁 8시로 변경')).toBeVisible()
    expect(input()).toHaveValue('저녁 8시로 변경. 우산도 챙기기')
    expect(screen.getByRole('status')).toHaveTextContent('요청한 메모를 저장했어요.')
    expect(screen.getByText('아직 저장하지 않은 변경이 있어요.')).toBeVisible()
    expect(saveButton()).toBeEnabled()
  })

  it('빈 메모를 허용하고 실패 안내를 alert로 제공한다', () => {
    const { rerender } = render(<MemoView {...previews.empty} />)
    expect(input()).toHaveValue('')
    expect(saveButton()).toBeEnabled()
    rerender(<MemoView {...previews.error} />)
    expect(screen.getByRole('alert')).toHaveTextContent('다시 시도해 주세요.')
  })

  it('모의 API는 첫 요청만 실패하고 다음 요청의 내용을 복사해 반환한다', async () => {
    vi.useFakeTimers()
    const save = createDemoSaver()
    const failure = expect(save({ memo: '처음' })).rejects.toThrow('일시적인 연결 실패')
    await vi.advanceTimersByTimeAsync(1800)
    await failure
    const request = { memo: '다음' }
    const response = save(request)
    request.memo = '요청 후 바뀐 값'
    await vi.advanceTimersByTimeAsync(1800)
    await expect(response).resolves.toEqual({ memo: '다음' })
  })
})

// 풀이를 시작할 때 .skip을 제거해 실패부터 확인하세요. 정답 로직은 제공하지 않습니다.
describe.skip('직접 구현할 메모 저장 행동', () => {
  it('초기에는 변경이 없고 입력 후 되돌리면 마지막 저장값을 복원한다', async () => {
    const user = userEvent.setup(),
      saveMemo = vi.fn()
    render(<MemoEditor initialMemo={INITIAL_MEMO} saveMemo={saveMemo} />)
    expect(input()).not.toHaveAttribute('readonly')
    expect(saveButton()).toBeDisabled()
    expect(restoreButton()).toBeDisabled()
    await user.clear(input())
    await user.type(input(), '시간 변경')
    expect(saveButton()).toBeEnabled()
    expect(savedRegion().getByText(INITIAL_MEMO)).toBeVisible()
    await user.click(restoreButton())
    expect(input()).toHaveValue(INITIAL_MEMO)
    expect(saveMemo).not.toHaveBeenCalled()
  })

  it('B 저장 중 C를 쓰면 응답은 저장값만 B로 바꾸고 입력 C를 덮어쓰지 않는다', async () => {
    const user = userEvent.setup(),
      request = deferred(),
      saveMemo = vi.fn(() => request.promise)
    render(<MemoEditor initialMemo="A" saveMemo={saveMemo} />)
    await user.clear(input())
    await user.type(input(), 'B')
    await user.click(saveButton())
    expect(saveMemo).toHaveBeenCalledWith({ memo: 'B' })
    expect(screen.getByRole('button', { name: '메모 저장 중' })).toBeDisabled()
    expect(restoreButton()).toBeDisabled()
    expect(input()).toBeEnabled()
    await user.clear(input())
    await user.type(input(), 'C')
    await user.click(screen.getByRole('button', { name: '메모 저장 중' }))
    expect(saveMemo).toHaveBeenCalledTimes(1)
    await act(async () => request.resolve({ memo: 'B' }))
    expect(savedRegion().getByText('B')).toBeVisible()
    expect(input()).toHaveValue('C')
    expect(screen.getByText('아직 저장하지 않은 변경이 있어요.')).toBeVisible()
    expect(screen.getByRole('status')).toHaveTextContent('요청한 메모를 저장했어요.')
    await user.click(restoreButton())
    expect(input()).toHaveValue('B')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('저장 중 추가 수정이 없으면 성공 뒤 변경 없음이 되고 새 편집은 결과 안내를 지운다', async () => {
    const user = userEvent.setup(),
      request = deferred()
    render(<MemoEditor initialMemo="A" saveMemo={() => request.promise} />)
    await user.clear(input())
    await user.type(input(), 'B')
    await user.click(saveButton())
    await act(async () => request.resolve({ memo: 'B' }))
    expect(input()).toHaveValue('B')
    expect(savedRegion().getByText('B')).toBeVisible()
    expect(screen.getByText('저장된 내용과 같아요.')).toBeVisible()
    expect(saveButton()).toBeDisabled()
    expect(restoreButton()).toBeDisabled()
    await user.type(input(), 'C')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    await user.click(restoreButton())
    expect(input()).toHaveValue('B')
  })

  it('실패는 새 입력 C와 저장값 A를 보존하고 재시도는 현재 C를 보낸다', async () => {
    const user = userEvent.setup(),
      request = deferred()
    const saveMemo = vi
      .fn()
      .mockImplementationOnce(() => request.promise)
      .mockResolvedValueOnce({ memo: 'C' })
    render(<MemoEditor initialMemo="A" saveMemo={saveMemo} />)
    await user.clear(input())
    await user.type(input(), 'B')
    await user.click(saveButton())
    await user.clear(input())
    await user.type(input(), 'C')
    await act(async () => request.reject(new Error('실패')))
    expect(screen.getByRole('alert')).toHaveTextContent('다시 시도해 주세요.')
    expect(savedRegion().getByText('A')).toBeVisible()
    expect(input()).toHaveValue('C')
    expect(saveButton()).toBeEnabled()
    await user.click(saveButton())
    expect(saveMemo.mock.calls).toEqual([[{ memo: 'B' }], [{ memo: 'C' }]])
    expect(await screen.findByRole('status')).toHaveTextContent('요청한 메모를 저장했어요.')
    expect(savedRegion().getByText('C')).toBeVisible()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('빈 입력도 그대로 저장하며 공백·줄바꿈을 임의로 제거하지 않는다', async () => {
    const user = userEvent.setup(),
      saveMemo = vi.fn(async (request: Memo) => request)
    render(<MemoEditor initialMemo="A" saveMemo={saveMemo} />)
    await user.clear(input())
    await user.click(saveButton())
    expect(saveMemo).toHaveBeenLastCalledWith({ memo: '' })
    expect(savedRegion().getByText('저장된 메모가 없어요.')).toBeVisible()
    await user.type(input(), '  우산{enter}챙기기  ')
    await user.click(saveButton())
    expect(saveMemo).toHaveBeenLastCalledWith({ memo: '  우산\n챙기기  ' })
  })

  it('B 저장 중 초기 A로 다시 바꿔도 성공 뒤 A를 유지하고 미저장으로 표시한다', async () => {
    const user = userEvent.setup(),
      request = deferred()
    render(<MemoEditor initialMemo="A" saveMemo={() => request.promise} />)
    await user.clear(input())
    await user.type(input(), 'B')
    await user.click(saveButton())
    await user.clear(input())
    await user.type(input(), 'A')
    await act(async () => request.resolve({ memo: 'B' }))
    expect(input()).toHaveValue('A')
    expect(savedRegion().getByText('B')).toBeVisible()
    expect(screen.getByText('아직 저장하지 않은 변경이 있어요.')).toBeVisible()
    expect(saveButton()).toBeEnabled()
  })
})
