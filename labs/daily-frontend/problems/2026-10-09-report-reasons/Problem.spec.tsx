import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createReportMock } from './api'
import { ReportForm } from './starter'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})
const labels = { 'wrong-item': '설명과 다른 상품을 받았어요', other: '다른 문제가 있었어요' }

describe('신고 폼의 기존 행동', () => {
  it('미선택 접수는 사유 오류만 표시하고 요청하지 않는다', async () => {
    const user = userEvent.setup(),
      sendReport = vi.fn()
    render(<ReportForm sendReport={sendReport} />)
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.getAllByRole('radio').every((radio) => !(radio as HTMLInputElement).checked)).toBe(true)
    await user.click(screen.getByRole('button', { name: '신고 접수하기' }))
    expect(screen.getByText('신고 사유를 골라 주세요.')).toBeVisible()
    expect(sendReport).not.toHaveBeenCalled()
    await user.click(screen.getByRole('radio', { name: '약속 장소에 나오지 않았어요' }))
    expect(screen.queryByText('신고 사유를 골라 주세요.')).not.toBeInTheDocument()
  })
  it.each([
    ['wrong-item', 5],
    ['other', 10],
  ] as const)('%s는 trim 기준 %i자 미만을 거부하고 경계값을 접수한다', async (reason, minimum) => {
    const user = userEvent.setup(),
      sendReport = vi.fn().mockResolvedValue(undefined)
    render(<ReportForm sendReport={sendReport} />)
    await user.click(screen.getByRole('radio', { name: labels[reason] }))
    const input = screen.getByRole('textbox', { name: '상황 설명' })
    await user.type(input, `  ${'가'.repeat(minimum - 1)}  `)
    await user.click(screen.getByRole('button', { name: '신고 접수하기' }))
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(sendReport).not.toHaveBeenCalled()
    await user.clear(input)
    await user.type(input, `  ${'가'.repeat(minimum)}  `)
    expect(input).not.toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText(`앞뒤 공백을 뺀 ${minimum}자 / 최소 ${minimum}자`)).toBeVisible()
    await user.click(screen.getByRole('button', { name: '신고 접수하기' }))
    expect(sendReport).toHaveBeenCalledExactlyOnceWith({ reason, description: '가'.repeat(minimum) })
    expect(input).toHaveValue(`  ${'가'.repeat(minimum)}  `)
    expect(screen.getByRole('status')).toHaveTextContent(
      reason === 'wrong-item' ? '상품 불일치 신고를 접수했어요.' : '기타 신고를 접수했어요.',
    )
    expect(screen.getByRole('button', { name: '신고 접수하기' })).toBeDisabled()
  })
  it('숨긴 설명은 보존하지만 불참 요청에 포함하지 않는다', async () => {
    const user = userEvent.setup(),
      sendReport = vi.fn().mockResolvedValue(undefined)
    render(<ReportForm sendReport={sendReport} />)
    await user.click(screen.getByRole('radio', { name: labels['wrong-item'] }))
    await user.type(screen.getByRole('textbox', { name: '상황 설명' }), '  상품 색이 달라요  ')
    await user.click(screen.getByRole('radio', { name: '약속 장소에 나오지 않았어요' }))
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '신고 접수하기' }))
    expect(sendReport).toHaveBeenCalledExactlyOnceWith({ reason: 'no-show' })
    expect(screen.getByRole('status')).toHaveTextContent('약속 불참 신고를 접수했어요.')
    await user.click(screen.getByRole('radio', { name: labels['wrong-item'] }))
    expect(screen.getByRole('textbox', { name: '상황 설명' })).toHaveValue('  상품 색이 달라요  ')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '신고 접수하기' })).toBeEnabled()
  })
  it('사유를 전환하면 이전 오류를 지우고 새 최소 길이를 적용한다', async () => {
    const user = userEvent.setup(),
      sendReport = vi.fn()
    render(<ReportForm sendReport={sendReport} />)
    await user.click(screen.getByRole('radio', { name: labels.other }))
    await user.type(screen.getByRole('textbox'), '가나다라마')
    await user.click(screen.getByRole('button', { name: '신고 접수하기' }))
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
    await user.click(screen.getByRole('radio', { name: labels['wrong-item'] }))
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('textbox')).toHaveValue('가나다라마')
    expect(screen.getByText('앞뒤 공백을 뺀 5자 / 최소 5자')).toBeVisible()
    expect(sendReport).not.toHaveBeenCalled()
  })
  it('요청 중 모두 잠그며 실패 후 원본 보존·재시도·성공 후 편집을 제공한다', async () => {
    const user = userEvent.setup()
    let reject: (error: Error) => void = () => {}
    const pending = new Promise<void>((_, fail) => {
      reject = fail
    })
    const sendReport = vi.fn().mockReturnValueOnce(pending).mockResolvedValueOnce(undefined)
    render(<ReportForm sendReport={sendReport} />)
    await user.click(screen.getByRole('radio', { name: labels['wrong-item'] }))
    const input = screen.getByRole('textbox', { name: '상황 설명' })
    await user.type(input, '  다른 상품이에요  ')
    await user.click(screen.getByRole('button', { name: '신고 접수하기' }))
    expect(input).toBeDisabled()
    for (const radio of screen.getAllByRole('radio')) expect(radio).toBeDisabled()
    expect(screen.getByRole('status')).toHaveTextContent('접수 중에는 사유와 설명을 바꿀 수 없어요.')
    await user.click(screen.getByRole('button', { name: '신고 접수 중' }))
    expect(sendReport).toHaveBeenCalledOnce()
    await act(async () => reject(new Error('실패')))
    expect(input).toHaveValue('  다른 상품이에요  ')
    expect(input).toBeEnabled()
    expect(screen.getByRole('radio', { name: labels['wrong-item'] })).toBeChecked()
    expect(screen.getByRole('alert')).toHaveTextContent('작성한 내용은 그대로예요.')
    await user.click(screen.getByRole('button', { name: '신고 접수하기' }))
    expect(sendReport).toHaveBeenNthCalledWith(2, { reason: 'wrong-item', description: '다른 상품이에요' })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '신고 접수하기' })).toBeDisabled()
    await user.type(input, ' 수정')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '신고 접수하기' })).toBeEnabled()
  })
  it('전송 때 내부 공백과 줄바꿈은 제거하지 않는다', async () => {
    const user = userEvent.setup(),
      sendReport = vi.fn().mockResolvedValue(undefined)
    render(<ReportForm sendReport={sendReport} />)
    await user.click(screen.getByRole('radio', { name: labels.other }))
    await user.type(screen.getByRole('textbox'), '  상품 설명과\n실물이 달라요  ')
    await user.click(screen.getByRole('button', { name: '신고 접수하기' }))
    expect(sendReport).toHaveBeenCalledExactlyOnceWith({ reason: 'other', description: '상품 설명과\n실물이 달라요' })
  })
  it('모의 API의 첫 유효 요청은 실패하고 재시도는 성공한다', async () => {
    vi.useFakeTimers()
    const send = createReportMock()
    const first = expect(send({ reason: 'no-show' })).rejects.toThrow('접수 실패')
    await vi.advanceTimersByTimeAsync(1800)
    await first
    const retry = expect(send({ reason: 'no-show' })).resolves.toBeUndefined()
    await vi.advanceTimersByTimeAsync(1800)
    await retry
  })
})
