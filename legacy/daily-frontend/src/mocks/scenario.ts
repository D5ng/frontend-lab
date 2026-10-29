const attempts = new Map<string, number>()

// 지연을 시작하기 전에 요청 순서를 확정한다. 응답 도착 순서와는 독립적이다.
export function nextAttempt(request: Request, resource = new URL(request.url).pathname) {
  const key = `${request.headers.get('x-lab-session')}:${resource}`
  const attempt = (attempts.get(key) ?? 0) + 1
  attempts.set(key, attempt)
  return attempt
}

export function resetMockAttempts() {
  attempts.clear()
}
