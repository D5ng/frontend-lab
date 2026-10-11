// 공장 함수마다 별도 세션을 만들어 화면 재진입 시 첫 실패 시나리오를 다시 시작한다.
// 모의 서버 전용 헤더이며 편집 상태나 응답의 화면 반영 여부는 다루지 않는다.
export function createApiClient() {
  const session = crypto.randomUUID()
  return async function request<T = void>(path: string, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(init.headers)
    headers.set('x-lab-session', session)
    if (init.body) headers.set('content-type', 'application/json')
    const response = await fetch(new URL(path, window.location.origin), { ...init, headers })
    if (!response.ok) {
      const error = (await response.json()) as { message: string }
      throw new Error(error.message)
    }
    if (response.status === 204) return undefined as T
    return response.json() as Promise<T>
  }
}
