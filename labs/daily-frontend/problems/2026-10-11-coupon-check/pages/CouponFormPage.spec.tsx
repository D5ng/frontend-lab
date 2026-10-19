import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createCouponMock } from '../features/couponForm/apis/createCouponMock'
import type { CheckResult } from '../features/couponForm/types/coupon'
import { CouponView } from '../features/couponForm/components/CouponView'
import { previews } from '../features/couponForm/components/CouponView.preview'
import { CouponFormPage } from './CouponFormPage'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})
function deferred() {
  let resolve: (value: CheckResult) => void = () => {}
  let reject: (error: Error) => void = () => {}
  const promise = new Promise<CheckResult>((complete, fail) => {
    resolve = complete
    reject = fail
  })
  return { promise, resolve, reject }
}
const welcome: CheckResult = { available: true, coupon: { code: 'WELCOME', discount: 2000 } }
const sale: CheckResult = { available: true, coupon: { code: 'SALE', discount: 3000 } }

describe('준비물: UI와 API 계약', () => {
  it.each(Object.keys(previews))('%s 고정 화면의 라벨·버튼 상태가 표현 계약과 같다', (key) => {
    const props = previews[key]
    render(<CouponView {...props} />)
    expect(screen.getByRole('textbox', { name: '쿠폰 코드' })).toHaveValue(props.value)
    expect(screen.getByRole('textbox')).toBeEnabled()
    expect(screen.getByRole('button', { name: props.checking ? '쿠폰 확인 중' : '쿠폰 확인하기' })).toHaveProperty(
      'disabled',
      !props.canCheck,
    )
    expect(screen.getByRole('button', { name: '할인 적용하기' })).toHaveProperty('disabled', !props.canApply)
    if (props.fieldError) expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
    if (props.notice) expect(screen.getByRole(props.notice.tone === 'critical' ? 'alert' : 'status')).toHaveTextContent(props.notice.text)
    if (key === 'verified') expect(screen.getByRole('status')).toHaveTextContent('WELCOME 쿠폰을 확인했어요.')
    if (key === 'applied') expect(screen.getByRole('status')).toHaveTextContent('WELCOME 쿠폰으로 2,000원 할인을 적용했어요.')
  })
  it('입력과 두 액션을 콜백으로 전달한다(화면 자체는 상태를 결정하지 않는다)', async () => {
    const user = userEvent.setup(),
      onChange = vi.fn(),
      onCheck = vi.fn(),
      onApply = vi.fn()
    render(<CouponView {...previews.verified} onChange={onChange} onCheck={onCheck} onApply={onApply} />)
    await user.type(screen.getByRole('textbox'), 'x')
    expect(onChange).toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: '쿠폰 확인하기' }))
    await user.click(screen.getByRole('button', { name: '할인 적용하기' }))
    expect(onCheck).toHaveBeenCalledOnce()
    expect(onApply).toHaveBeenCalledOnce()
  })
  it('WELCOME과 SALE은 서로 다른 지연과 할인 정보를 반환한다', async () => {
    const check = createCouponMock(),
      slow = vi.fn(),
      fast = vi.fn()
    const slowRequest = check('WELCOME').then(slow)
    const fastRequest = check('SALE').then(fast)
    await fastRequest

    expect(fast).toHaveBeenCalledWith(sale)
    expect(slow).not.toHaveBeenCalled()

    await slowRequest
    expect(slow).toHaveBeenCalledWith(welcome)
  })
  it('사용 불가는 정상 응답이며 RETRY 첫 실패 뒤 재확인에 성공한다', async () => {
    const check = createCouponMock()
    const unavailable = expect(check('EXPIRED')).resolves.toEqual({ available: false })
    const failed = expect(check('RETRY')).rejects.toThrow('확인 실패')

    await unavailable
    await failed
    const retried = expect(check('RETRY')).resolves.toEqual({ available: true, coupon: { code: 'RETRY', discount: 3000 } })

    await retried
  })
})

// 풀이 시작 시 이 describe.skip을 describe로 변경하세요. 정답 로직은 제공하지 않습니다.
describe.skip('직접 구현할 쿠폰 확인 행동', () => {
  it('빈 입력과 공백만 있는 입력은 필드 오류를 표시하며 요청하지 않는다', async () => {
    const user = userEvent.setup(),
      check = vi.fn()
    render(<CouponFormPage checkCoupon={check} />)
    expect(screen.getByRole('button', { name: '할인 적용하기' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: '쿠폰 확인하기' }))
    expect(screen.getByText('쿠폰 코드를 입력해 주세요.')).toBeVisible()
    await user.type(screen.getByRole('textbox'), '   ')
    await user.click(screen.getByRole('button', { name: '쿠폰 확인하기' }))
    expect(check).not.toHaveBeenCalled()
  })
  it('정규화된 요청만 보내며 원본·확인 성공·적용 완료를 구분한다', async () => {
    const user = userEvent.setup(),
      pending = deferred(),
      check = vi.fn().mockReturnValue(pending.promise)
    render(<CouponFormPage checkCoupon={check} />)
    await user.type(screen.getByRole('textbox'), ' welcome ')
    await user.click(screen.getByRole('button', { name: '쿠폰 확인하기' }))
    expect(check).toHaveBeenCalledExactlyOnceWith('WELCOME')
    expect(screen.getByRole('textbox')).toHaveValue(' welcome ')
    expect(screen.getByRole('textbox')).toBeEnabled()
    expect(screen.getByRole('button', { name: '쿠폰 확인 중' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '할인 적용하기' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: '쿠폰 확인 중' }))
    expect(check).toHaveBeenCalledOnce()
    await act(async () => pending.resolve(welcome))
    expect(screen.getByRole('status')).toHaveTextContent('WELCOME 쿠폰을 확인했어요.')
    await user.click(screen.getByRole('button', { name: '할인 적용하기' }))
    expect(screen.getByRole('status')).toHaveTextContent('WELCOME 쿠폰으로 2,000원 할인을 적용했어요.')
    expect(screen.getByRole('button', { name: '할인 적용하기' })).toBeDisabled()
    expect(check).toHaveBeenCalledOnce()
  })
  it('원본 편집은 정규화 결과가 같아도 확인·적용을 즉시 지운다', async () => {
    const user = userEvent.setup(),
      check = vi.fn().mockResolvedValue(welcome)
    render(<CouponFormPage checkCoupon={check} />)
    await user.type(screen.getByRole('textbox'), 'WELCOME')
    await user.click(screen.getByRole('button', { name: '쿠폰 확인하기' }))
    await user.click(screen.getByRole('button', { name: '할인 적용하기' }))
    await user.type(screen.getByRole('textbox'), ' ')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '할인 적용하기' })).toBeDisabled()
    expect(check).toHaveBeenCalledOnce()
  })
  it('확인 중 입력만 바꿔도 옛 응답은 무효이며 자동 요청하지 않는다', async () => {
    const user = userEvent.setup(),
      pending = deferred(),
      check = vi.fn().mockReturnValue(pending.promise)
    render(<CouponFormPage checkCoupon={check} />)
    await user.type(screen.getByRole('textbox'), 'WELCOME')
    await user.click(screen.getByRole('button', { name: '쿠폰 확인하기' }))
    await user.type(screen.getByRole('textbox'), ' ')
    expect(screen.getByRole('button', { name: '쿠폰 확인하기' })).toBeEnabled()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    await act(async () => pending.resolve(welcome))
    expect(screen.getByRole('button', { name: '할인 적용하기' })).toBeDisabled()
    expect(screen.queryByText('WELCOME 쿠폰을 확인했어요.')).not.toBeInTheDocument()
    expect(check).toHaveBeenCalledOnce()
  })
  it.each(['성공', '실패'] as const)('오래된 %s·완료가 새 확인의 진행 상태를 끝내지 않는다', async (outcome) => {
    const user = userEvent.setup(),
      old = deferred(),
      current = deferred()
    const check = vi.fn().mockReturnValueOnce(old.promise).mockReturnValueOnce(current.promise)
    render(<CouponFormPage checkCoupon={check} />)
    await user.type(screen.getByRole('textbox'), 'WELCOME')
    await user.click(screen.getByRole('button', { name: '쿠폰 확인하기' }))
    await user.clear(screen.getByRole('textbox'))
    await user.type(screen.getByRole('textbox'), 'SALE')
    await user.click(screen.getByRole('button', { name: '쿠폰 확인하기' }))
    await act(async () => (outcome === '성공' ? old.resolve(welcome) : old.reject(new Error('늦은 실패'))))
    expect(screen.getByRole('button', { name: '쿠폰 확인 중' })).toBeDisabled()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByText('WELCOME 쿠폰을 확인했어요.')).not.toBeInTheDocument()
    await act(async () => current.resolve(sale))
    expect(screen.getByRole('status')).toHaveTextContent('SALE 쿠폰을 확인했어요.')
  })
  it('WELCOME→SALE→WELCOME에서 같은 코드의 오래된 응답도 무효다', async () => {
    const user = userEvent.setup(),
      old = deferred(),
      current = deferred()
    const check = vi.fn().mockReturnValueOnce(old.promise).mockReturnValueOnce(current.promise)
    render(<CouponFormPage checkCoupon={check} />)
    await user.type(screen.getByRole('textbox'), 'WELCOME')
    await user.click(screen.getByRole('button', { name: '쿠폰 확인하기' }))
    await user.clear(screen.getByRole('textbox'))
    await user.type(screen.getByRole('textbox'), 'SALE')
    await user.clear(screen.getByRole('textbox'))
    await user.type(screen.getByRole('textbox'), 'WELCOME')
    await user.click(screen.getByRole('button', { name: '쿠폰 확인하기' }))
    await act(async () => current.resolve(welcome))
    await act(async () => old.resolve({ available: false }))
    expect(screen.getByRole('status')).toHaveTextContent('WELCOME 쿠폰을 확인했어요.')
    expect(screen.getByRole('button', { name: '할인 적용하기' })).toBeEnabled()
  })
  it('사용 불가·요청 실패를 구분하고 원본으로 재확인한다', async () => {
    const user = userEvent.setup(),
      check = vi.fn().mockResolvedValueOnce({ available: false }).mockRejectedValueOnce(new Error('실패')).mockResolvedValueOnce(welcome)
    render(<CouponFormPage checkCoupon={check} />)
    await user.type(screen.getByRole('textbox'), ' welcome ')
    await user.click(screen.getByRole('button', { name: '쿠폰 확인하기' }))
    expect(screen.getByRole('status')).toHaveTextContent('사용할 수 없는 쿠폰이에요.')
    expect(screen.getByRole('button', { name: '할인 적용하기' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: '쿠폰 확인하기' }))
    expect(screen.getByRole('alert')).toHaveTextContent('쿠폰을 확인하지 못했어요.')
    expect(screen.getByRole('textbox')).toHaveValue(' welcome ')
    await user.click(screen.getByRole('button', { name: '쿠폰 확인하기' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '할인 적용하기' })).toBeEnabled()
    expect(check.mock.calls).toEqual([['WELCOME'], ['WELCOME'], ['WELCOME']])
  })
})
