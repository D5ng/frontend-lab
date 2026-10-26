import { http, HttpResponse } from 'msw/http'
import { describe, expect, it } from 'vitest'
import { server } from '../../../../../src/mocks/server'
import { createNotificationMock } from './createNotificationMock'
import { products } from './products'

describe('알림 계획의 HTTP 계약', () => {
  it('상품 목록을 실제 GET으로 읽는다', async () => {
    await expect(createNotificationMock().getProducts()).resolves.toEqual(products)
  })

  it('POST 본문과 성공 응답을 전달한다', async () => {
    let received: unknown
    server.use(
      http.post('*/api/daily/2026-10-07-notification-rollback/plans', async ({ request }) => {
        received = { body: await request.json(), session: request.headers.get('x-lab-session') }
        return HttpResponse.json({ id: 'new-plan' }, { status: 201 })
      }),
    )
    await expect(createNotificationMock().savePlan({ productIds: ['lamp'], delivery: 'digest', hour: '20' })).resolves.toEqual({
      id: 'new-plan',
    })
    expect(received).toEqual({ body: { productIds: ['lamp'], delivery: 'digest', hour: '20' }, session: expect.any(String) })
  })

  it('정상 입력의 첫 저장만 실패하고 재시도는 성공하며 새 세션은 초기화한다', async () => {
    const api = createNotificationMock()
    const plan = { productIds: ['desk'], delivery: 'instant' } as const
    const input = { ...plan, productIds: [...plan.productIds] }
    await expect(api.savePlan(input)).rejects.toThrow('알림을 저장하지 못했어요.')
    await expect(api.savePlan(input)).resolves.toEqual({ id: 'plan-2' })
    await expect(createNotificationMock().savePlan(input)).rejects.toThrow('알림을 저장하지 못했어요.')
  })

  it('거래완료 상품과 비어 있는 선택을 서버도 거절한다', async () => {
    const api = createNotificationMock()
    await expect(api.savePlan({ productIds: ['chair'], delivery: 'instant' })).rejects.toThrow('알림 설정을 확인해 주세요.')
    await expect(api.savePlan({ productIds: [], delivery: 'instant' })).rejects.toThrow('알림 설정을 확인해 주세요.')
  })
})
