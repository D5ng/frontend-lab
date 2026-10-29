# 브리핑 샘플 · 하루치

> 분량과 깊이를 맞추기 위한 샘플입니다. "이 정도 길이면 가볍다", "코드가 더 짧았으면", "기본기는 더 깊어도 된다" 같은 식으로 알려 주세요.

읽는 시간: 12분 안팎 · 풀 것도 쓸 것도 없습니다.

---

## 클린 코드 처방

### 1. 중첩된 if → 먼저 빠져나가기

**상황**

```ts
function getCouponMessage(user: User | null, cart: Cart) {
  if (user) {
    if (cart.items.length > 0) {
      if (user.coupons.length > 0) {
        return `쿠폰 ${user.coupons.length}장을 쓸 수 있어요`
      } else {
        return '쓸 수 있는 쿠폰이 없어요'
      }
    } else {
      return '장바구니가 비어 있어요'
    }
  } else {
    return '로그인하면 쿠폰을 쓸 수 있어요'
  }
}
```

**처방: 가드 절**

```ts
function getCouponMessage(user: User | null, cart: Cart) {
  if (!user) return '로그인하면 쿠폰을 쓸 수 있어요'
  if (cart.items.length === 0) return '장바구니가 비어 있어요'
  if (user.coupons.length === 0) return '쓸 수 있는 쿠폰이 없어요'

  return `쿠폰 ${user.coupons.length}장을 쓸 수 있어요`
}
```

**왜**: 안 되는 경우를 먼저 내보내면, 아래로 내려온 코드는 "여기까지 왔으면 정상"이라는 것만 기억하면 됩니다. `else`가 어느 `if`의 짝인지 찾을 필요도 없어집니다.

**안 해도 되는 때**: 배달이면 A, 포장이면 B처럼 두 갈래가 똑같이 중요한 분기는 `if / else` 그대로가 더 잘 읽힙니다.

### 2. useEffect로 state 맞춰 주기 → 렌더링 중에 계산하기

**상황**

```tsx
const [items, setItems] = useState<CartItem[]>([])
const [total, setTotal] = useState(0)

useEffect(() => {
  setTotal(items.reduce((sum, item) => sum + item.price * item.quantity, 0))
}, [items])
```

**처방: 계산하면 되는 값은 state로 두지 않는다**

```tsx
const [items, setItems] = useState<CartItem[]>([])
const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
```

**왜**: `total`은 `items`만 있으면 언제든 계산됩니다. state로 따로 두면 `items`가 바뀐 직후 한 번은 이전 `total`이 그려지고, effect가 렌더링을 한 번 더 일으킵니다. 원본이 둘이 되면 둘이 어긋날 틈이 생깁니다.

**안 해도 되는 때**: 계산이 정말 무거우면 `useMemo`로 감싸면 됩니다. 그래도 state로 옮길 이유는 아닙니다.

### 3. boolean props가 늘어날 때 → 선택지 하나로 묶기

**상황**

```tsx
<Button primary>저장</Button>
<Button danger>삭제</Button>
<Button primary danger>이건 무슨 색이지?</Button>
```

**처방: variant**

```tsx
type ButtonProps = {
  variant?: 'primary' | 'danger' | 'neutral'
  children: ReactNode
}

<Button variant="primary">저장</Button>
<Button variant="danger">삭제</Button>
```

**왜**: 동시에 켜질 수 없는 boolean이 둘이면 "둘 다 true"라는 말이 안 되는 조합이 생깁니다. 선택지 하나로 묶으면 그 조합을 타입이 막아 줍니다. SEED의 `ActionButton`도 색을 `variant` 하나로 받습니다.

**안 해도 되는 때**: `disabled`와 `loading`처럼 실제로 동시에 켜질 수 있는 값은 따로 둡니다.

---

## 생각하는 법

### 기획을 코드로 · 한 문장에 정책이 두 개 들어 있을 때

**장면**: 기획 메모에 이렇게 적혀 있습니다.

> 가입하고 7일 안에 첫 주문을 하면 배달팁이 무료예요. 단, 최소 주문 금액은 지켜야 해요.

**생각 순서**

1. **"정책 신호는 어디지?"** "~안에", "첫", "무료", "단", "지켜야" 같은 말이 조건과 제한을 만듭니다. 여기서는 정책이 두 개입니다. 신규 회원 배달팁 무료, 그리고 원래 있던 최소 주문 금액입니다.
2. **"둘은 같이 바뀔까?"** 신규 혜택 기간이 7일에서 14일로 바뀌어도 최소 주문 금액은 그대로입니다. 바뀌는 이유가 다르니 한 문장에 있어도 코드는 따로 둡니다. 문장 단위가 아니라 정책 단위로 나눕니다.
3. **"애매한 경계는?"** 7일은 가입 시각부터 168시간일까요, 날짜로 7일째까지일까요? "첫 주문"은 취소한 주문도 셀까요? 코드로 정하기 전에 기획자에게 물을 질문으로 적어 둡니다.
4. **"값은 어디서 오지?"** 7일은 앱이 정하는 값인지, 첫 주문 여부는 서버가 알려 주는지 확인합니다. 어디서 오느냐에 따라 코드를 둘 자리가 달라집니다.

**코드로 옮기면**

```ts
// 정책 하나에 함수 하나. 화면은 결과만 묻는다.
function isNewMemberFreeTip(member: Member, now: Date) {
  return member.isFirstOrder && isWithinDays(member.signedUpAt, now, NEW_MEMBER_BENEFIT_DAYS)
}

function canOrder(subtotal: number, store: Store) {
  return subtotal >= store.minOrderAmount
}
```

**한 줄 요약**: 기획 문장 하나가 코드 한 덩어리가 되는 게 아닙니다. 바뀌는 이유가 다른 정책은 같은 문장에 있어도 따로 둡니다.

---

## 기본기

### React · setState를 세 번 불렀는데 왜 1만 오를까?

```tsx
const [count, setCount] = useState(0)

function handleClick() {
  setCount(count + 1)
  setCount(count + 1)
  setCount(count + 1)
}
```

이 렌더링에서 `count`는 0으로 고정된 값(스냅샷)입니다. 세 줄 모두 "0 + 1로 바꿔 줘"를 예약하니 결과는 1입니다. 이전 값을 기준으로 쌓으려면 `setCount((c) => c + 1)`처럼 함수를 넘깁니다.

**실무에서 만나는 장면**: 한 핸들러에서 같은 state를 두 번 바꿀 때, `await` 뒤에서 state를 읽었더니 예전 값일 때.

### TypeScript · `any` 대신 `unknown`을 쓰는 이유

```ts
const a: any = JSON.parse(text)
a.user.name.toUpperCase() // 통과. 실행하면 터질 수 있다

const u: unknown = JSON.parse(text)
u.user // 오류: 'u' is of type 'unknown'.
```

`any`는 검사를 끄고, `unknown`은 "아직 모른다"고 표시한 뒤 확인하게 만듭니다. 서버 응답, `JSON.parse` 결과, 잡힌 에러처럼 밖에서 들어온 값은 `unknown`으로 받고 들어오는 자리에서 한 번 확인하는 편이 안전합니다. `strict`가 켜져 있으면 `catch (error)`의 `error`는 이미 `unknown`입니다.

**실무에서 만나는 장면**: `catch (error)`에서 `error.message`에 빨간 줄이 생길 때. `if (error instanceof Error)`로 확인하면 됩니다.

### 네트워크 · 401과 403은 뭐가 다를까?

- **401 Unauthorized**: "누구인지 모르겠다." 로그인을 안 했거나 토큰이 만료됐습니다. 다시 로그인하거나 토큰을 새로 받으면 풀릴 수 있습니다.
- **403 Forbidden**: "누구인지는 알지만 권한이 없다." 다시 로그인해도 결과가 같습니다.

이름은 Unauthorized지만 실제 뜻은 인증 실패라서 헷갈리기 쉽습니다.

**실무에서 만나는 장면**: 401이면 로그인 화면으로 보내거나 토큰을 갱신하고, 403이면 "권한이 없어요"를 보여 줍니다. 403에 로그인 화면을 띄우면 사용자는 로그인을 해도 같은 화면으로 돌아옵니다.
