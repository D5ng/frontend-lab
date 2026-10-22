import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ExportReceipt } from '../features/exportRequest/types/exportRequest'
import { ExportPage } from './ExportPage'

afterEach(cleanup)

describe('활동 기록 내보내기', () => {
  it('처음에는 CSV와 쉼표를 선택하고 파일 이름과 요약을 보여 준다', () => {
    render(<ExportPage requestExport={vi.fn()} />)
    expect(screen.getByRole('radio', { name: 'CSV · 표로 편집' })).toBeChecked()
    expect(screen.getByRole('radio', { name: '쉼표로 구분' })).toBeChecked()
    expect(screen.getByRole('textbox', { name: '파일 이름' })).toHaveValue('활동 기록')
    expect(within(screen.getByRole('complementary', { name: '내보내기 요약' })).getByText('활동 기록.csv')).toBeVisible()
    expect(screen.getByRole('button', { name: '내보내기 신청' })).toBeEnabled()
  })

  it('형식을 왕복해도 각 옵션을 보존하지만 요약과 요청에는 현재 CSV 옵션만 포함한다', async () => {
    const user = userEvent.setup()
    const send = vi.fn().mockResolvedValue({ id: '1', fileName: '활동 기록.csv' })
    render(<ExportPage requestExport={send} />)
    await user.click(screen.getByRole('radio', { name: '탭으로 구분' }))
    await user.click(screen.getByRole('radio', { name: 'PDF · 문서로 공유' }))
    await user.click(screen.getByRole('radio', { name: '작업 제목과 메모' }))
    await user.click(screen.getByRole('radio', { name: 'CSV · 표로 편집' }))
    expect(screen.getByRole('radio', { name: '탭으로 구분' })).toBeChecked()
    expect(screen.queryByRole('radio', { name: '작업 제목과 메모' })).not.toBeInTheDocument()
    expect(within(screen.getByRole('complementary')).getByText('탭으로 열 구분')).toBeVisible()
    await user.click(screen.getByRole('radio', { name: 'PDF · 문서로 공유' }))
    expect(screen.getByRole('radio', { name: '작업 제목과 메모' })).toBeChecked()
    await user.click(screen.getByRole('radio', { name: 'CSV · 표로 편집' }))
    await user.click(screen.getByRole('button', { name: '내보내기 신청' }))
    expect(send).toHaveBeenCalledExactlyOnceWith({ format: 'csv', name: '활동 기록', delimiter: 'tab' })
  })

  it('PDF 요약과 요청은 문서 옵션만 사용하고 이름 앞뒤 공백을 제외한다', async () => {
    const user = userEvent.setup()
    const send = vi.fn().mockResolvedValue({ id: '1', fileName: '주간 기록.pdf' })
    render(<ExportPage requestExport={send} />)
    await user.click(screen.getByRole('radio', { name: '탭으로 구분' }))
    await user.click(screen.getByRole('radio', { name: 'PDF · 문서로 공유' }))
    await user.click(screen.getByRole('radio', { name: '작업 제목과 메모' }))
    await user.clear(screen.getByRole('textbox'))
    await user.type(screen.getByRole('textbox'), '  주간 기록  ')
    expect(within(screen.getByRole('complementary')).getByText('주간 기록.pdf')).toBeVisible()
    expect(within(screen.getByRole('complementary')).getByText('작업 제목과 메모 포함')).toBeVisible()
    await user.click(screen.getByRole('button', { name: '내보내기 신청' }))
    expect(send).toHaveBeenCalledExactlyOnceWith({ format: 'pdf', name: '주간 기록', detail: 'full' })
  })

  it('빈 이름은 신청을 막고 잘못된 이름은 필드 오류로 알리며 요청하지 않는다', async () => {
    const user = userEvent.setup()
    const send = vi.fn()
    render(<ExportPage requestExport={send} />)
    const input = screen.getByRole('textbox')
    for (const value of ['기록.csv', '기록/파일', '기록\\파일', '가'.repeat(21)]) {
      await user.clear(input)
      await user.type(input, value)
      await user.click(screen.getByRole('button', { name: '내보내기 신청' }))
      expect(input).toBeInvalid()
      expect(screen.getByText('이름은 1~20자로, 마침표와 슬래시 없이 입력해 주세요.')).toBeVisible()
    }
    await user.clear(input)
    await user.type(input, '   ')
    expect(screen.getByRole('button', { name: '내보내기 신청' })).toBeDisabled()
    expect(input).not.toBeInvalid()
    expect(send).not.toHaveBeenCalled()
    await user.clear(input)
    await user.type(input, '가'.repeat(20))
    expect(screen.getByRole('button', { name: '내보내기 신청' })).toBeEnabled()
    await user.click(screen.getByRole('button', { name: '내보내기 신청' }))
    expect(send).toHaveBeenCalledWith({ format: 'csv', name: '가'.repeat(20), delimiter: 'comma' })
  })

  it('접수 중 모든 입력을 잠그고 중복 요청하지 않으며 서버 파일명으로 성공을 알린다', async () => {
    const user = userEvent.setup()
    let complete!: (value: ExportReceipt) => void
    const send = vi.fn(
      () =>
        new Promise<ExportReceipt>((resolve) => {
          complete = resolve
        }),
    )
    render(<ExportPage requestExport={send} />)
    await user.click(screen.getByRole('button', { name: '내보내기 신청' }))
    expect(screen.getByRole('textbox')).toBeDisabled()
    for (const radio of screen.getAllByRole('radio')) expect(radio).toBeDisabled()
    expect(screen.getByText('접수 중에는 설정을 바꿀 수 없어요.')).toBeVisible()
    await user.click(screen.getByRole('button', { name: /접수 중/ }))
    expect(send).toHaveBeenCalledTimes(1)
    await act(async () => complete({ id: 'accepted', fileName: '서버에서 확정한 기록.csv' }))
    expect(screen.getByRole('status')).toHaveTextContent('서버에서 확정한 기록.csv 내보내기를 접수했어요.')
    expect(screen.getByRole('button', { name: '내보내기 신청' })).toBeDisabled()
    expect(screen.getByRole('textbox')).toBeEnabled()
  })

  it('실패하면 선택과 이름을 보존하고 같은 요청을 재시도할 수 있다', async () => {
    const user = userEvent.setup()
    const send = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({ id: '2', fileName: '활동 기록.pdf' })
    render(<ExportPage requestExport={send} />)
    await user.click(screen.getByRole('radio', { name: 'PDF · 문서로 공유' }))
    await user.click(screen.getByRole('radio', { name: '작업 제목과 메모' }))
    await user.click(screen.getByRole('button', { name: '내보내기 신청' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('내보내기를 접수하지 못했어요. 다시 시도해 주세요.')
    expect(screen.getByRole('radio', { name: '작업 제목과 메모' })).toBeChecked()
    expect(screen.getByRole('textbox')).toHaveValue('활동 기록')
    await user.click(screen.getByRole('button', { name: '내보내기 신청' }))
    expect(send).toHaveBeenCalledTimes(2)
    expect(send.mock.calls[0]).toEqual(send.mock.calls[1])
    expect(await screen.findByRole('status')).toHaveTextContent('활동 기록.pdf')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('이름·형식·현재 옵션을 바꾸면 이전 결과를 지우고 새 신청을 허용한다', async () => {
    const user = userEvent.setup()
    const send = vi.fn().mockResolvedValue({ id: '1', fileName: '완료.csv' })
    render(<ExportPage requestExport={send} />)
    for (const change of [
      () => user.type(screen.getByRole('textbox'), '2'),
      () => user.click(screen.getByRole('radio', { name: 'PDF · 문서로 공유' })),
      () => user.click(screen.getByRole('radio', { name: '작업 제목과 메모' })),
    ]) {
      await user.click(screen.getByRole('button', { name: '내보내기 신청' }))
      expect(await screen.findByRole('status')).toHaveTextContent('완료.csv')
      await change()
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: '내보내기 신청' })).toBeEnabled()
    }
    send.mockRejectedValueOnce(new Error('offline'))
    await user.click(screen.getByRole('button', { name: '내보내기 신청' }))
    expect(await screen.findByRole('alert')).toBeVisible()
    await user.click(screen.getByRole('radio', { name: '작업 제목만' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
