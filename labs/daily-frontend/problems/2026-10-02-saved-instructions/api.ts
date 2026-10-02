export const INITIAL_INSTRUCTIONS = '평일 저녁 7시 이후, 아파트 정문에서 만나요.'

export type SaveInstructions = (request: { text: string }) => Promise<{ text: string }>

// 브라우저에서 실패 후 재시도를 경험하도록 첫 요청만 실패합니다.
// 서버의 응답 계약이며, 편집 상태를 관리하는 풀이 로직은 포함하지 않습니다.
export function createSaveMock(): SaveInstructions {
  let requestCount = 0
  return async ({ text }) => {
    const shouldFail = ++requestCount === 1
    await new Promise<void>((resolve) => setTimeout(resolve, 800))
    if (shouldFail) throw new Error('network unavailable')
    return { text: text.trim() }
  }
}
