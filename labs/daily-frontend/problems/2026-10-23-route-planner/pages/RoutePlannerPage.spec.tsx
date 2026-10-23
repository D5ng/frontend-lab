import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { LoadRoutes, Route } from '../features/routePlanner/types/route'
import { RoutePlannerPage } from './RoutePlannerPage'

afterEach(cleanup)

const parkRoutes: Route[] = [
  { id: 'direct', title: '강변 버스', minutes: 32, transfers: 0 },
  { id: 'transfer', title: '공원 환승선', minutes: 25, transfers: 1 },
]
const museumRoutes: Route[] = [
  { id: 'direct', title: '미술관 순환선', minutes: 28, transfers: 0 },
  { id: 'transfer', title: '미술관 급행선', minutes: 19, transfers: 1 },
]

function deferred() {
  let resolve!: (routes: Route[]) => void
  let reject!: (reason: Error) => void
  const promise = new Promise<Route[]>((complete, fail) => {
    resolve = complete
    reject = fail
  })
  return { promise, resolve, reject }
}

it('구현 전에는 제목과 SEED 페이지 골격을 제공한다', () => {
  render(<RoutePlannerPage loadRoutes={vi.fn()} />)
  expect(screen.getByRole('heading', { name: '오늘의 이동 경로' })).toBeVisible()
})

// 직접 구현형입니다. 페이지를 구현한 뒤 아래 describe.skip을 describe로 바꾸세요.
// 검사를 통과시키려고 제공 환경에서 선택·요청 반영 로직을 미리 구현하지 않습니다.
describe.skip('실습자가 활성화할 사용자 행동', () => {
  it('처음 공원을 조회하고 재조회만 잠그며 도착지 변경은 허용한다', async () => {
    const request = deferred()
    const load = vi.fn<LoadRoutes>(() => request.promise)
    render(<RoutePlannerPage loadRoutes={load} />)
    await waitFor(() => expect(load).toHaveBeenCalledExactlyOnceWith('park'))
    expect(screen.getByRole('radio', { name: '강변공원' })).toBeChecked()
    expect(screen.getByText('경로를 불러오고 있어요.')).toBeVisible()
    expect(screen.getByRole('button', { name: /경로 다시 불러오기/ })).toBeDisabled()
    expect(screen.getByRole('radio', { name: '시립미술관' })).toBeEnabled()
    expect(screen.queryByText('이 도착지로 가는 경로가 없어요. 다른 도착지를 골라 주세요.')).not.toBeInTheDocument()
    await act(async () => request.resolve(parkRoutes))
    expect(await screen.findByRole('radio', { name: /강변 버스/ })).toBeVisible()
    expect(screen.getByRole('button', { name: /경로 다시 불러오기/ })).toBeEnabled()
  })

  it('경로 하나를 선택하면 현재 도착지와 서버의 소요 시간·환승 횟수로 이동 계획을 보여 준다', async () => {
    const user = userEvent.setup()
    render(<RoutePlannerPage loadRoutes={vi.fn().mockResolvedValue(parkRoutes)} />)
    await user.click(await screen.findByRole('radio', { name: /공원 환승선/ }))
    const plan = screen.getByRole('region', { name: '이동 계획' })
    expect(plan).toHaveTextContent('강변공원')
    expect(plan).toHaveTextContent('공원 환승선')
    expect(plan).toHaveTextContent('25분')
    expect(plan).toHaveTextContent('환승 1회')
    await user.click(screen.getByRole('radio', { name: /강변 버스/ }))
    expect(plan).toHaveTextContent('32분')
    expect(plan).toHaveTextContent('환승 0회')
    expect(within(plan).queryByText('공원 환승선')).not.toBeInTheDocument()
  })

  it('현재 조회 실패는 빈 성공이 아니며 같은 도착지로 재시도할 수 있다', async () => {
    const user = userEvent.setup()
    const load = vi.fn<LoadRoutes>().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(parkRoutes)
    render(<RoutePlannerPage loadRoutes={load} />)
    expect(await screen.findByRole('alert')).toHaveTextContent('경로를 불러오지 못했어요. 다시 시도해 주세요.')
    expect(screen.queryByText('이 도착지로 가는 경로가 없어요. 다른 도착지를 골라 주세요.')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /경로 다시 불러오기/ }))
    expect(await screen.findByRole('radio', { name: /강변 버스/ })).toBeVisible()
    expect(load.mock.calls).toEqual([['park'], ['park']])
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('도착지가 바뀌면 이전 경로와 선택을 즉시 지우며 같은 ID를 새 도착지 선택으로 재사용하지 않는다', async () => {
    const user = userEvent.setup()
    const next = deferred()
    const load = vi
      .fn<LoadRoutes>()
      .mockResolvedValueOnce(parkRoutes)
      .mockImplementationOnce(() => next.promise)
    render(<RoutePlannerPage loadRoutes={load} />)
    await user.click(await screen.findByRole('radio', { name: /강변 버스/ }))
    await user.click(screen.getByRole('radio', { name: '시립미술관' }))
    expect(screen.queryByRole('radio', { name: /강변 버스/ })).not.toBeInTheDocument()
    expect(screen.getByRole('region', { name: '이동 계획' })).toHaveTextContent('아직 경로를 고르지 않았어요.')
    await act(async () => next.resolve(museumRoutes))
    await user.click(await screen.findByRole('radio', { name: /미술관 순환선/ }))
    const plan = screen.getByRole('region', { name: '이동 계획' })
    expect(plan).toHaveTextContent('시립미술관')
    expect(plan).toHaveTextContent('28분')
    expect(plan).not.toHaveTextContent('강변 버스')
    expect(load.mock.calls).toEqual([['park'], ['museum']])
  })

  it('미술관 결과가 먼저 도착했다면 나중에 도착한 이전 공원 성공은 반영하지 않는다', async () => {
    const user = userEvent.setup()
    const old = deferred()
    const load = vi
      .fn<LoadRoutes>()
      .mockImplementationOnce(() => old.promise)
      .mockResolvedValueOnce(museumRoutes)
    render(<RoutePlannerPage loadRoutes={load} />)
    await user.click(screen.getByRole('radio', { name: '시립미술관' }))
    await user.click(await screen.findByRole('radio', { name: /미술관 급행선/ }))
    await act(async () => old.resolve(parkRoutes))
    expect(screen.queryByRole('radio', { name: /강변 버스/ })).not.toBeInTheDocument()
    expect(screen.getByRole('region', { name: '이동 계획' })).toHaveTextContent('미술관 급행선')
    expect(screen.getByRole('button', { name: /경로 다시 불러오기/ })).toBeEnabled()
  })

  it('이전 공원의 실패와 종료 처리가 현재 미술관의 로딩을 지우지 않는다', async () => {
    const user = userEvent.setup()
    const old = deferred()
    const current = deferred()
    const load = vi
      .fn<LoadRoutes>()
      .mockImplementationOnce(() => old.promise)
      .mockImplementationOnce(() => current.promise)
    render(<RoutePlannerPage loadRoutes={load} />)
    await user.click(screen.getByRole('radio', { name: '시립미술관' }))
    await act(async () => old.reject(new Error('late failure')))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByText('경로를 불러오고 있어요.')).toBeVisible()
    expect(screen.getByRole('button', { name: /경로 다시 불러오기/ })).toBeDisabled()
    await act(async () => current.resolve(museumRoutes))
    expect(await screen.findByRole('radio', { name: /미술관 순환선/ })).toBeVisible()
  })

  it('공원→미술관→공원으로 돌아와도 첫 공원 응답을 마지막 공원 응답으로 착각하지 않는다', async () => {
    const user = userEvent.setup()
    const first = deferred()
    const middle = deferred()
    const last = deferred()
    const load = vi
      .fn<LoadRoutes>()
      .mockImplementationOnce(() => first.promise)
      .mockImplementationOnce(() => middle.promise)
      .mockImplementationOnce(() => last.promise)
    render(<RoutePlannerPage loadRoutes={load} />)
    await user.click(screen.getByRole('radio', { name: '시립미술관' }))
    await user.click(screen.getByRole('radio', { name: '강변공원' }))
    await act(async () => {
      first.resolve(parkRoutes)
      middle.resolve(museumRoutes)
    })
    expect(screen.getByText('경로를 불러오고 있어요.')).toBeVisible()
    expect(screen.queryByRole('radio', { name: /강변 버스/ })).not.toBeInTheDocument()
    await act(async () => last.resolve([{ id: 'direct', title: '갱신된 공원 버스', minutes: 40, transfers: 0 }]))
    expect(await screen.findByRole('radio', { name: /갱신된 공원 버스/ })).toBeVisible()
    expect(load.mock.calls).toEqual([['park'], ['museum'], ['park']])
  })

  it('재조회도 시작 즉시 선택을 지우고 중복 재조회를 막으며 실패 후 예전 경로를 복원하지 않는다', async () => {
    const user = userEvent.setup()
    const refresh = deferred()
    const load = vi
      .fn<LoadRoutes>()
      .mockResolvedValueOnce(parkRoutes)
      .mockImplementationOnce(() => refresh.promise)
    render(<RoutePlannerPage loadRoutes={load} />)
    await user.click(await screen.findByRole('radio', { name: /강변 버스/ }))
    await user.click(screen.getByRole('button', { name: /경로 다시 불러오기/ }))
    expect(screen.queryByRole('radio', { name: /강변 버스/ })).not.toBeInTheDocument()
    expect(screen.getByRole('region', { name: '이동 계획' })).toHaveTextContent('아직 경로를 고르지 않았어요.')
    await user.click(screen.getByRole('button', { name: /경로 다시 불러오기/ }))
    expect(load).toHaveBeenCalledTimes(2)
    await act(async () => refresh.reject(new Error('offline')))
    expect(await screen.findByRole('alert')).toBeVisible()
    expect(screen.queryByRole('radio', { name: /강변 버스/ })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /경로 다시 불러오기/ })).toBeEnabled()
  })

  it('빈 성공은 오류와 구분하고 다른 도착지를 선택할 수 있다', async () => {
    const user = userEvent.setup()
    const load = vi.fn<LoadRoutes>().mockResolvedValueOnce(parkRoutes).mockResolvedValueOnce([])
    render(<RoutePlannerPage loadRoutes={load} />)
    await screen.findByRole('radio', { name: /강변 버스/ })
    await user.click(screen.getByRole('radio', { name: '새벽부두' }))
    expect(await screen.findByText('이 도착지로 가는 경로가 없어요. 다른 도착지를 골라 주세요.')).toBeVisible()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('radio', { name: '강변공원' })).toBeEnabled()
    expect(screen.getByRole('region', { name: '이동 계획' })).toHaveTextContent('아직 경로를 고르지 않았어요.')
  })
})
