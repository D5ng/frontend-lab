import { describe, expect, it } from 'vitest'
import { createRemovalApi } from './createRemovalApi'

describe('삭제와 복구 HTTP 모의 API', () => {
  it('의자 삭제 첫 실패와 재시도 204를 처리한다', async () => {
    const api = createRemovalApi()
    await expect(api.remove('chair')).rejects.toThrow('잠시 후 다시 시도해 주세요.')
    await expect(api.remove('chair')).resolves.toBeUndefined()
  })
  it('의자 복구 첫 실패는 삭제 요청과 횟수가 독립적이다', async () => {
    const api = createRemovalApi()
    await expect(api.remove('chair')).rejects.toThrow()
    await expect(api.remove('chair')).resolves.toBeUndefined()
    await expect(api.restore('chair')).rejects.toThrow()
    await expect(api.restore('chair')).resolves.toBeUndefined()
  })
  it('조명 삭제와 복구는 첫 요청부터 성공한다', async () => {
    const api = createRemovalApi()
    await expect(api.remove('lamp')).resolves.toBeUndefined()
    await expect(api.restore('lamp')).resolves.toBeUndefined()
  })
  it('새 API 세션은 실패 횟수를 공유하지 않는다', async () => {
    await expect(createRemovalApi().remove('chair')).rejects.toThrow()
    await expect(createRemovalApi().remove('chair')).rejects.toThrow()
  })
})
