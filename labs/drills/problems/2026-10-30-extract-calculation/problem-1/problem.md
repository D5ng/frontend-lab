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

## 출구에서 일어나는 순서

PR을 합친 뒤 손님 한 명이 나갈 때 함수는 이 순서로 불립니다.

1. 차가 출구에 서면 정산기 화면이 `getExitPreview(ticket, isResident)`를 불러 "지금 나가면 ○원이에요"를 띄웁니다.
2. 손님이 카드를 찾느라 결제 버튼을 누르기까지 1~2분이 걸리기도 합니다. 이 동안 화면의 금액은 다시 계산하지 않습니다.
3. 손님이 결제 버튼을 누르면 `checkout(ticket, isResident)`이 불립니다. `checkout`은 티켓을 `saveTicket`으로 저장합니다.
4. 정산기는 `checkout`이 돌려준 `{ ticketId, minutes, fee }`를 영수증으로 출력합니다. "○분 주차, ○원"이 찍힙니다.
5. 며칠 뒤 손님이 "출구에서 본 금액이랑 결제된 금액이 달라요"라고 문의하면, 상담원은 저장된 티켓을 열어 `lastQuotedFee`를 봅니다.

## 할 일

`note.md`에 리뷰 코멘트를 두세 개 씁니다. 실제 PR에서 줄 하나에 다는 코멘트처럼, 코멘트 하나마다 아래 세 칸을 모두 채웁니다. `note.md`의 코멘트마다 이 세 칸이 비어 있습니다.

- **어느 줄**: diff의 어느 줄에 다는 코멘트인지
- **그대로 합치면 달라지는 것**: 위 순서의 어느 단계에서 손님이나 상담원이 무엇을 보게 되는지. 원칙 이름만 적지 말고 생길 일로 적습니다. 테스트에서 달라지는 것이어도 됩니다.
- **제안**: 어떻게 바꾸자고 할지. 고친 코드 전체가 아니라 함수 모양(이름, 받는 값, 돌려주는 값) 정도면 충분합니다.

가장 중요한 코멘트부터 씁니다. 사소한 것은 앞에 `nit:`을 붙입니다.
