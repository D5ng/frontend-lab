import { describe, expect, it } from 'vitest'
import { createArchiveApi } from './api'

describe('보관 HTTP 모의 환경', () => {
  it('첫 요청에서 조명만 실패하고 같은 세션 재시도는 성공한다', async () => {
    const archive = createArchiveApi()
    await expect(archive(['chair', 'lamp'])).resolves.toEqual({ succeededIds: ['chair'], failedIds: ['lamp'] })
    await expect(archive(['lamp'])).resolves.toEqual({ succeededIds: ['lamp'], failedIds: [] })
  })
  it('조명을 선택하지 않은 첫 요청은 모두 성공한다', async () => {
    await expect(createArchiveApi()(['chair', 'shelf'])).resolves.toEqual({ succeededIds: ['chair', 'shelf'], failedIds: [] })
  })
  it('API 공장이 다르면 첫 실패 시나리오가 독립적이다', async () => {
    await expect(createArchiveApi()(['lamp'])).resolves.toEqual({ succeededIds: [], failedIds: ['lamp'] })
    await expect(createArchiveApi()(['lamp'])).resolves.toEqual({ succeededIds: [], failedIds: ['lamp'] })
  })
})
