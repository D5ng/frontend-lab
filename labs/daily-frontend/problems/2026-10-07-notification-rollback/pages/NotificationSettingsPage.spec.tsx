import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { products } from '../features/notificationSettings/apis/products'
import type { NotificationApi, Product } from '../features/notificationSettings/types/notification'
import { NotificationSettingsPage } from './NotificationSettingsPage'

afterEach(cleanup)

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((complete) => {
    resolve = complete
  })
  return { promise, resolve }
}

function setup(overrides: Partial<NotificationApi> = {}) {
  const api = { getProducts: vi.fn().mockResolvedValue(products), savePlan: vi.fn().mockResolvedValue({ id: 'saved' }), ...overrides }
  render(<NotificationSettingsPage api={api} />)
  return { api, user: userEvent.setup() }
}

const submit = () => screen.getByRole('button', { name: '알림 설정 저장하기' })
const pick = (title: string) => screen.getByRole('checkbox', { name: `${title} 알림 선택` })
const summary = () => within(screen.getByRole('region', { name: '저장할 알림 요약' }))

async function ready() {
  await screen.findByRole('checkbox', { name: '접이식 원목 책상 알림 선택' })
}

describe('관심 상품 알림을 만드는 전체 흐름', () => {
  it('불러오는 동안 진행 상태를 알리고 입력과 저장을 막는다', async () => {
    const request = deferred<Product[]>()
    setup({ getProducts: () => request.promise })
    expect(screen.getByRole('status', { name: '관심 상품을 불러오는 중' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: '관심 상품 검색' })).toBeDisabled()
    expect(submit()).toBeDisabled()
    await act(async () => request.resolve(products))
    expect(pick('접이식 원목 책상')).toBeEnabled()
    expect(submit()).toBeDisabled()
  })

  it('서버 상품의 가격·동네와 거래완료 이유를 표시하고 선택 전 저장을 막는다', async () => {
    setup()
    await ready()
    expect(screen.getByText('42,000원')).toBeInTheDocument()
    expect(screen.getByText('연희동')).toBeInTheDocument()
    expect(pick('라탄 의자')).toBeDisabled()
    expect(screen.getByText('망원동 · 거래완료')).toBeInTheDocument()
    expect(submit()).toBeDisabled()
    expect(screen.getByRole('radio', { name: '가격이 내려가면 바로 받기' })).toBeChecked()
  })

  it('검색으로 숨겨진 상품도 선택 개수·요약·저장 대상에 남긴다', async () => {
    const { user, api } = setup()
    await ready()
    await user.click(pick('접이식 원목 책상'))
    await user.type(screen.getByRole('textbox', { name: '관심 상품 검색' }), '  조명  ')
    expect(screen.queryByRole('checkbox', { name: '접이식 원목 책상 알림 선택' })).not.toBeInTheDocument()
    await user.click(pick('작은 유리 조명'))
    expect(summary().getByText('관심 상품 2개')).toBeInTheDocument()
    expect(summary().getByText('접이식 원목 책상, 작은 유리 조명')).toBeInTheDocument()
    await user.click(submit())
    expect(api.savePlan).toHaveBeenCalledExactlyOnceWith({ productIds: ['desk', 'lamp'], delivery: 'instant' })
    await screen.findByText('알림 설정을 저장했어요.')
    await user.clear(screen.getByRole('textbox', { name: '관심 상품 검색' }))
    expect(pick('접이식 원목 책상')).toBeChecked()
    await user.click(pick('접이식 원목 책상'))
    expect(summary().getByText('관심 상품 1개')).toBeInTheDocument()
  })

  it('검색 결과가 없으면 전체 상품으로 돌아가도 기존 선택을 보존한다', async () => {
    const { user } = setup()
    await ready()
    await user.click(pick('작은 유리 조명'))
    await user.type(screen.getByRole('textbox', { name: '관심 상품 검색' }), '없는 상품')
    expect(screen.getByText('찾는 상품이 없어요')).toBeInTheDocument()
    expect(summary().getByText('작은 유리 조명')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '전체 상품 보기' }))
    expect(pick('작은 유리 조명')).toBeChecked()
  })

  it('시간은 모아 받기에만 보내고 방식을 왕복해도 마지막 시간 선택을 보존한다', async () => {
    const { user, api } = setup()
    await ready()
    await user.click(pick('접이식 원목 책상'))
    await user.click(screen.getByRole('radio', { name: '하루 한 번 모아 받기' }))
    await user.click(screen.getByRole('combobox', { name: '받을 시간' }))
    await user.click(screen.getByRole('option', { name: '오후 8시' }))
    expect(summary().getByText('매일 오후 8시에 한 번')).toBeInTheDocument()
    await user.click(submit())
    expect(api.savePlan).toHaveBeenNthCalledWith(1, { productIds: ['desk'], delivery: 'digest', hour: '20' })
    await screen.findByText('알림 설정을 저장했어요.')
    await user.click(screen.getByRole('radio', { name: '가격이 내려가면 바로 받기' }))
    expect(screen.queryByRole('combobox', { name: '받을 시간' })).not.toBeInTheDocument()
    await user.click(submit())
    expect(api.savePlan).toHaveBeenNthCalledWith(2, { productIds: ['desk'], delivery: 'instant' })
    await screen.findByText('알림 설정을 저장했어요.')
    await user.click(screen.getByRole('radio', { name: '하루 한 번 모아 받기' }))
    expect(screen.getByRole('combobox', { name: '받을 시간' })).toHaveTextContent('오후 8시')
  })

  it('저장 중에는 요청에 관련된 모든 입력과 중복 제출을 막는다', async () => {
    const request = deferred<{ id: string }>()
    const savePlan = vi.fn().mockReturnValue(request.promise)
    const { user } = setup({ savePlan })
    await ready()
    await user.click(pick('작은 유리 조명'))
    await user.click(screen.getByRole('radio', { name: '하루 한 번 모아 받기' }))
    await user.click(submit())
    expect(screen.getByRole('textbox', { name: '관심 상품 검색' })).toBeDisabled()
    expect(pick('작은 유리 조명')).toBeDisabled()
    expect(screen.getByRole('radio', { name: '가격이 내려가면 바로 받기' })).toBeDisabled()
    expect(screen.getByRole('combobox', { name: '받을 시간' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: '알림 저장 중' }))
    expect(savePlan).toHaveBeenCalledTimes(1)
    await act(async () => request.resolve({ id: 'saved' }))
    expect(submit()).toBeEnabled()
  })

  it('실패하면 입력을 보존하고 같은 설정으로 다시 저장할 수 있다', async () => {
    const savePlan = vi.fn().mockRejectedValueOnce(new Error('일시 오류')).mockResolvedValueOnce({ id: 'saved' })
    const { user } = setup({ savePlan })
    await ready()
    await user.click(pick('작은 유리 조명'))
    await user.type(screen.getByRole('textbox', { name: '관심 상품 검색' }), '조명')
    await user.click(submit())
    expect(await screen.findByRole('alert')).toHaveTextContent('알림을 저장하지 못했어요. 다시 시도해 주세요.')
    expect(screen.getByRole('textbox', { name: '관심 상품 검색' })).toHaveValue('조명')
    expect(pick('작은 유리 조명')).toBeChecked()
    await user.click(submit())
    await screen.findByText('알림 설정을 저장했어요.')
    expect(savePlan.mock.calls).toEqual([[{ productIds: ['lamp'], delivery: 'instant' }], [{ productIds: ['lamp'], delivery: 'instant' }]])
  })

  it('저장한 결과는 다음 편집이나 저장 실패로 바뀌지 않는다', async () => {
    const savePlan = vi.fn().mockResolvedValueOnce({ id: 'saved' }).mockRejectedValueOnce(new Error('일시 오류'))
    const { user } = setup({ savePlan })
    await ready()
    await user.click(pick('접이식 원목 책상'))
    await user.click(submit())
    await screen.findByText('알림 설정을 저장했어요.')
    await user.click(pick('작은 유리 조명'))
    expect(screen.queryByText('알림 설정을 저장했어요.')).not.toBeInTheDocument()
    expect(within(screen.getByRole('region', { name: '마지막으로 저장한 알림' })).getByText('접이식 원목 책상')).toBeInTheDocument()
    await user.click(submit())
    await screen.findByRole('alert')
    expect(within(screen.getByRole('region', { name: '마지막으로 저장한 알림' })).queryByText(/작은 유리 조명/)).not.toBeInTheDocument()
  })

  it('조회 실패 후 다시 불러올 수 있고 빈 서버 목록도 구분한다', async () => {
    const getProducts = vi.fn().mockRejectedValueOnce(new Error('실패')).mockResolvedValueOnce([])
    const { user } = setup({ getProducts })
    expect(await screen.findByRole('alert')).toHaveTextContent('상품을 불러오지 못했어요.')
    expect(submit()).toBeDisabled()
    await user.click(screen.getByRole('button', { name: '상품 다시 불러오기' }))
    expect(await screen.findByText('아직 관심 상품이 없어요')).toBeInTheDocument()
    expect(submit()).toBeDisabled()
  })

  it('키보드로 선택한 뒤 모두 해제하면 다시 저장할 수 없다', async () => {
    const { user } = setup()
    await ready()
    pick('작은 유리 조명').focus()
    await user.keyboard(' ')
    expect(submit()).toBeEnabled()
    await user.keyboard(' ')
    expect(submit()).toBeDisabled()
  })
})
