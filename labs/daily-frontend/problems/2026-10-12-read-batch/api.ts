export type Notification = { id: string; title: string; description: string; read: boolean }
export type MarkRead = (ids: string[]) => Promise<void>
export const notifications: Notification[] = [
  { id: 'chat', title: '거래 약속이 도착했어요', description: '이웃이 내일 오후 2시를 제안했어요.', read: false },
  { id: 'price', title: '관심 상품 가격이 내려갔어요', description: '찜한 의자가 25,000원이 되었어요.', read: false },
  { id: 'club', title: '모임 장소를 확인해 주세요', description: '동네 산책 모임의 장소가 정해졌어요.', read: false },
  { id: 'notice', title: '동네 소식을 확인했어요', description: '이미 읽은 알림이에요.', read: true },
]

export function createReadMock(): MarkRead {
  let attempt = 0
  return async () => {
    const currentAttempt = ++attempt
    await new Promise<void>((resolve) => setTimeout(resolve, 1800))
    if (currentAttempt === 1) throw new Error('읽음 처리 실패')
  }
}
