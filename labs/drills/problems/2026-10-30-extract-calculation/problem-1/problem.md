# 주차 요금 계산 PR 리뷰

- 역할: 리마인드 · 15~20분
- 유형: 코드 리뷰. 코드는 고치지 않고 리뷰 코멘트만 씁니다.
- 도메인: 모빌리티 (공영 주차장)
- 화면 없음

## 상황

공영 주차장 출구 정산기의 요금 코드입니다. 요금 규칙은 이렇습니다.

- 머문 시간은 분 단위로 올립니다. 30분 1초는 31분입니다.
- 30분까지는 무료입니다.
- 30분이 지나면 10분마다 1,000원입니다. 10분이 안 돼도 1,000원입니다.
- 하루 최대 20,000원입니다.
- 이 동네 주민은 위에서 나온 요금의 절반을 냅니다. 원 단위 아래는 버립니다.

동료가 PR을 올렸습니다.

> 출구 화면에 "지금 나가면 얼마예요"를 미리 보여 달라는 요청이 있어서, `checkout` 안에 있던 요금 계산을 함수로 꺼냈어요. 꺼낸 함수에는 테스트도 붙였습니다.
> 미리 보여 준 금액은 나중에 "아까 본 금액이랑 다르다"는 문의가 오면 확인하려고 티켓에 남겨 둡니다.

## PR diff

`parking.ts`

```diff
 import { saveTicket } from './ticketStore'

 export type ParkingTicket = {
   id: string
   carNumber: string
   enteredAt: number
   exitedAt: number | null
   status: 'parked' | 'paid'
+  lastQuotedFee?: number
 }

 const FREE_MINUTES = 30
 const UNIT_MINUTES = 10
 const UNIT_FEE = 1000
 const DAILY_MAX_FEE = 20000

+export function calculateParkingFee(ticket: ParkingTicket, isResident: boolean) {
+  const minutes = Math.ceil((Date.now() - ticket.enteredAt) / 60000)
+
+  let fee = 0
+  if (minutes > FREE_MINUTES) {
+    fee = Math.ceil((minutes - FREE_MINUTES) / UNIT_MINUTES) * UNIT_FEE
+  }
+  fee = Math.min(fee, DAILY_MAX_FEE)
+  if (isResident) fee = Math.floor(fee / 2)
+
+  ticket.lastQuotedFee = fee
+  return fee
+}
+
+export function getExitPreview(ticket: ParkingTicket, isResident: boolean) {
+  return `지금 나가면 ${calculateParkingFee(ticket, isResident).toLocaleString('ko-KR')}원이에요`
+}
+
 export function checkout(ticket: ParkingTicket, isResident: boolean) {
   const exitedAt = Date.now()
   const minutes = Math.ceil((exitedAt - ticket.enteredAt) / 60000)
-
-  let fee = 0
-  if (minutes > FREE_MINUTES) {
-    fee = Math.ceil((minutes - FREE_MINUTES) / UNIT_MINUTES) * UNIT_FEE
-  }
-  fee = Math.min(fee, DAILY_MAX_FEE)
-  if (isResident) fee = Math.floor(fee / 2)
+  const fee = calculateParkingFee(ticket, isResident)

   ticket.exitedAt = exitedAt
   ticket.status = 'paid'
   saveTicket(ticket)

   return { ticketId: ticket.id, minutes, fee }
 }
```

`parking.spec.ts`

```diff
+describe('calculateParkingFee', () => {
+  afterEach(() => {
+    vi.useRealTimers()
+  })
+
+  it('30분까지는 무료다', () => {
+    vi.useFakeTimers()
+    vi.setSystemTime(new Date('2026-11-02T10:30:00+09:00'))
+    const ticket = makeTicket({ enteredAt: new Date('2026-11-02T10:00:00+09:00').getTime() })
+
+    expect(calculateParkingFee(ticket, false)).toBe(0)
+  })
+
+  it('주민은 절반만 낸다', () => {
+    vi.useFakeTimers()
+    vi.setSystemTime(new Date('2026-11-02T11:00:00+09:00'))
+    const ticket = makeTicket({ enteredAt: new Date('2026-11-02T10:00:00+09:00').getTime() })
+
+    expect(calculateParkingFee(ticket, true)).toBe(1500)
+  })
+})
```

`makeTicket`은 기존 테스트 파일에 있던 도우미이고, 기존 `checkout` 테스트는 모두 통과합니다.

## 할 일

`note.md`에 리뷰 코멘트를 두세 개 씁니다. 코멘트마다 세 가지를 적습니다.

1. 어느 줄인지
2. 그대로 합치면 출구 화면, 정산 영수증, 테스트에서 **무엇이 달라지는지**. 원칙 이름만 적지 말고 생길 일로 적습니다.
3. 어떻게 바꾸자고 제안할지. 고친 코드 전체가 아니라 함수 모양(이름, 받는 값, 돌려주는 값) 정도면 충분합니다.

PR에 잘한 점이 있다면 하나 적어도 됩니다.
