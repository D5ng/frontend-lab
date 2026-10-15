import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ListingBrowser } from './starter'
import { DetailView } from './view'
import { previews } from './preview'
import type { ListingDetail, LoadDetail } from './api'

afterEach(cleanup)
const chair: ListingDetail = { id: 'chair', price: 15000, description: '의자 상세 설명', neighborhood: '성수동' }
const lamp: ListingDetail = { id: 'lamp', price: 8000, description: '조명 상세 설명', neighborhood: '연남동' }
function deferred() {
  let resolve!: (value: ListingDetail | null) => void
  let reject!: (error: Error) => void
  const promise = new Promise<ListingDetail | null>((done, fail) => {
    resolve = done
    reject = fail
  })
  return { promise, resolve, reject }
}

describe('제공 UI 준비 상태 — 풀이 검증이 아님', () => {
  it('미조회 표현은 필드 이름과 기본 선택을 제공한다', () => {
    render(<DetailView selectedId="chair" detail={undefined} busy={false} error="" onSelect={vi.fn()} onRetry={vi.fn()} />)
    expect(screen.getByRole('radiogroup', { name: '물건 선택' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: '접이식 원목 의자' })).toBeChecked()
    expect(screen.getByText('아직 상세를 불러오지 않았어요. 요청 로직을 구현해 주세요.')).toBeVisible()
  })
  it('로딩 표시 중에는 재시도를 잠그고 물건 선택은 열어 둔다', async () => {
    const onSelect = vi.fn()
    render(<DetailView {...previews.loading!} onSelect={onSelect} onRetry={vi.fn()} />)
    expect(screen.getByRole('button', { name: /상세 불러오는 중/ })).toBeDisabled()
    await userEvent.setup().click(screen.getByRole('radio', { name: '작은 스탠드 조명' }))
    expect(onSelect).toHaveBeenCalledWith('lamp')
  })
  it('오류 UI는 재시도 콜백을 연결한다', async () => {
    const onRetry = vi.fn()
    render(<DetailView {...previews.error!} onSelect={vi.fn()} onRetry={onRetry} />)
    expect(screen.getByRole('alert')).toHaveTextContent('다시 시도해 주세요.')
    await userEvent.setup().click(screen.getByRole('button', { name: '다시 불러오기' }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })
  it('성공과 거래 종료 UI를 각각 표현한다', () => {
    const { rerender } = render(<DetailView {...previews.success!} onSelect={vi.fn()} onRetry={vi.fn()} />)
    expect(screen.getByText('15,000원')).toBeVisible()
    expect(screen.getByRole('status')).toHaveTextContent('상세를 확인했어요.')
    rerender(<DetailView {...previews.unavailable!} onSelect={vi.fn()} onRetry={vi.fn()} />)
    expect(screen.queryByText('15,000원')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('거래가 종료된 물건이에요.')
  })
})

// 구현할 때 describe.skip → describe로 바꾸세요. 통과시키려고 정답 로직을 제공하지 않습니다.
describe.skip('실습자가 구현할 사용자 행동', () => {
  it('진입 시 기본 물건을 조회하고 상세를 표시한다', async () => {
    const load = vi.fn<LoadDetail>().mockResolvedValue(chair)
    render(<ListingBrowser loadDetail={load} />)
    expect(await screen.findByText('의자 상세 설명')).toBeVisible()
    expect(load).toHaveBeenCalledExactlyOnceWith('chair')
  })
  it('선택을 바꾸면 이전 상세를 숨기고 새 요청 상태를 보여 준다', async () => {
    const task = deferred()
    const load = vi.fn<LoadDetail>().mockResolvedValueOnce(chair).mockReturnValueOnce(task.promise)
    render(<ListingBrowser loadDetail={load} />)
    await screen.findByText('의자 상세 설명')
    await userEvent.setup().click(screen.getByRole('radio', { name: '작은 스탠드 조명' }))
    expect(screen.queryByText('의자 상세 설명')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '작은 스탠드 조명 상세' })).toBeVisible()
    expect(screen.getByRole('status')).toHaveTextContent('상세를 불러오고 있어요.')
    await act(async () => task.resolve(lamp))
    expect(await screen.findByText('조명 상세 설명')).toBeVisible()
  })
  it('다른 물건을 보는 동안 도착한 성공도 보관하고 돌아오면 요청 없이 재사용한다', async () => {
    const first = deferred()
    const load = vi.fn<LoadDetail>().mockReturnValueOnce(first.promise).mockResolvedValueOnce(lamp)
    render(<ListingBrowser loadDetail={load} />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('radio', { name: '작은 스탠드 조명' }))
    await screen.findByText('조명 상세 설명')
    await act(async () => first.resolve(chair))
    expect(screen.queryByText('의자 상세 설명')).not.toBeInTheDocument()
    expect(screen.getByText('조명 상세 설명')).toBeVisible()
    await user.click(screen.getByRole('radio', { name: '접이식 원목 의자' }))
    expect(await screen.findByText('의자 상세 설명')).toBeVisible()
    expect(load).toHaveBeenCalledTimes(2)
  })
  it('요청 중 다른 물건을 거쳐 돌아와도 같은 물건의 요청을 중복하지 않는다', async () => {
    const first = deferred()
    const second = deferred()
    const load = vi.fn<LoadDetail>().mockImplementation((id) => (id === 'chair' ? first.promise : second.promise))
    render(<ListingBrowser loadDetail={load} />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('radio', { name: '작은 스탠드 조명' }))
    await user.click(screen.getByRole('radio', { name: '접이식 원목 의자' }))
    expect(load.mock.calls.filter(([id]) => id === 'chair')).toHaveLength(1)
    expect(screen.getByRole('status')).toHaveTextContent('상세를 불러오고 있어요.')
    await act(async () => {
      first.resolve(chair)
      second.resolve(lamp)
    })
    expect(await screen.findByText('의자 상세 설명')).toBeVisible()
  })
  it('실패한 물건으로 돌아오면 오류를 유지하고 명시적 재시도로만 다시 요청한다', async () => {
    const load = vi.fn<LoadDetail>().mockImplementation(async (id) => (id === 'chair' ? chair : Promise.reject(new Error('offline'))))
    render(<ListingBrowser loadDetail={load} />)
    const user = userEvent.setup()
    await screen.findByText('의자 상세 설명')
    await user.click(screen.getByRole('radio', { name: '작은 스탠드 조명' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('상세를 불러오지 못했어요.')
    await user.click(screen.getByRole('radio', { name: '접이식 원목 의자' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: '작은 스탠드 조명' }))
    expect(await screen.findByRole('alert')).toBeVisible()
    expect(load).toHaveBeenCalledTimes(2)
    load.mockResolvedValueOnce(lamp)
    await user.click(screen.getByRole('button', { name: '다시 불러오기' }))
    expect(await screen.findByText('조명 상세 설명')).toBeVisible()
    expect(load).toHaveBeenCalledTimes(3)
  })
  it('다른 물건의 늦은 실패가 현재 로딩을 끄지 않는다', async () => {
    const first = deferred()
    const second = deferred()
    const load = vi.fn<LoadDetail>().mockImplementation((id) => (id === 'chair' ? first.promise : second.promise))
    render(<ListingBrowser loadDetail={load} />)
    await userEvent.setup().click(screen.getByRole('radio', { name: '작은 스탠드 조명' }))
    await act(async () => first.reject(new Error('offline')))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('상세를 불러오고 있어요.')
    await act(async () => second.resolve(lamp))
    expect(await screen.findByText('조명 상세 설명')).toBeVisible()
  })
  it('거래 종료 null도 정상 조회 결과로 재사용한다', async () => {
    const load = vi.fn<LoadDetail>().mockImplementation(async (id) => (id === 'chair' ? chair : null))
    render(<ListingBrowser loadDetail={load} />)
    const user = userEvent.setup()
    await screen.findByText('의자 상세 설명')
    await user.click(screen.getByRole('radio', { name: '머그컵 두 개' }))
    await screen.findByText('거래가 종료된 물건이에요. 다른 물건을 골라 주세요.')
    await user.click(screen.getByRole('radio', { name: '접이식 원목 의자' }))
    await user.click(screen.getByRole('radio', { name: '머그컵 두 개' }))
    expect(screen.getByRole('status')).toHaveTextContent('거래가 종료된 물건이에요.')
    expect(load.mock.calls.filter(([id]) => id === 'mug')).toHaveLength(1)
  })
})
