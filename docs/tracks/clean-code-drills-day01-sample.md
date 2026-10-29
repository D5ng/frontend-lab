# 1일차 샘플 · 함께 바뀌는 것을 함께 두기

> 난이도를 맞추기 위한 샘플입니다. 아직 실행 환경은 없고, 문제의 크기와 수준만 보면 됩니다. 다 읽고 "문제 N 정도가 맞다", "여기서 막힐 것 같다"를 알려 주세요.

## 지식 (5분)

### 응집도란

**하나의 이유로 바뀌는 코드가 얼마나 한곳에 모여 있는가**입니다.

사람의 말로 바꾸면 이 질문입니다.

> "이 정책이 바뀌면 어디를 열어야 하지?"

답이 "여기 한 곳"이면 응집도가 높고, "여기랑 저기랑… 또 어디 있더라?"면 낮습니다.

### 낮을 때 보이는 신호

- 같은 숫자가 여러 곳에 있다. (`12000`이 세 번)
- 같은 비교식이 여러 곳에 있다. (`total >= minOrderAmount`가 버튼에도, 안내 문구에도)
- 숫자는 한 번만 썼는데, 같은 값이 **문구 안에 글자로** 또 있다. (`20000`과 `'20,000원'`)
- 하나를 고치고 나머지를 놓쳐서 화면끼리 말이 다르다. 버튼은 주문할 수 있다는데 안내 문구는 금액이 부족하다고 한다.

### 흔한 오해 두 가지

1. **"한 파일, 한 객체에 다 모으면 응집도가 높다."** 아닙니다. 바뀌는 이유가 다른 것까지 모으면, 하나를 바꿀 때 상관없는 것까지 읽어야 합니다. 모으는 기준은 "같은 위치"가 아니라 "같은 이유로 바뀌는가"입니다.
2. **"숫자를 상수로 빼면 끝이다."** 숫자만 빼면 반쪽입니다. "12,000원 **이상**이면 주문 가능"에서 `이상`(`>=`)도 정책의 일부입니다. 값이 아니라 **규칙**을 모읍니다.

더 읽을거리: Frontend Fundamentals의 [매직 넘버 없애기(응집도)](https://frontend-fundamentals.com/code-quality/code/examples/magic-number-cohesion.html)

### 용어집

| 뜻                      | 영어                    |
| ----------------------- | ----------------------- |
| 최소 주문 금액          | `minOrderAmount`        |
| 무료 배달 기준 금액     | `freeDeliveryThreshold` |
| 배달팁                  | `deliveryTip`           |
| 남은 금액               | `remainingAmount`       |
| 주문할 수 있는          | `canOrder`, `orderable` |
| 상품 합계 (배달팁 제외) | `subtotal`              |
| 결제 금액               | `paymentAmount`         |
| 배달 / 포장             | `delivery` / `pickup`   |
| 정책                    | `policy`                |

---

## 문제 1 · 카페 장바구니 규칙 (15~20분, 순수 함수)

카페 주문 앱의 장바구니 계산 파일입니다. 테스트는 모두 통과합니다.

```ts
type CartItem = { name: string; price: number; quantity: number }

const MAX_QUANTITY = 10

export function getTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function addItem(items: CartItem[], name: string) {
  return items.map((item) => (item.name === name ? { ...item, quantity: Math.min(item.quantity + 1, MAX_QUANTITY) } : item))
}

export function canOrder(items: CartItem[]) {
  return getTotal(items) >= 12000
}

export function getOrderButtonLabel(items: CartItem[]) {
  const total = getTotal(items)
  if (total < 12000) return `${(12000 - total).toLocaleString()}원 더 담으면 주문할 수 있어요`
  return `${total.toLocaleString()}원 주문하기`
}

export function getDeliveryNotice(items: CartItem[]) {
  return getTotal(items) >= 20000 ? '배달팁 무료' : '20,000원 이상 주문하면 배달팁 무료'
}
```

**할 일**: 최소 주문 금액이 15,000원으로 바뀐다고 해 봅시다. 지금은 몇 곳을 고쳐야 하나요? 한 곳만 고치면 되도록 바꾸세요. 테스트는 그대로 통과해야 합니다.

**기록할 질문**: 무엇을 한곳에 모았고, 일부러 따로 둔 것이 있다면 왜 그랬나요?

---

## 문제 2 · 반찬가게 주문 화면 (30분, React + MSW)

동네 반찬가게 배달 주문 화면입니다. 가게 정책은 서버가 줍니다.

```http
GET /api/stores/banchan-1
```

```json
{
  "id": "banchan-1",
  "name": "엄마손 반찬",
  "minOrderAmount": 15000,
  "deliveryTip": 3000,
  "freeDeliveryThreshold": 30000,
  "menus": [
    { "id": "m1", "name": "멸치볶음", "price": 4500 },
    { "id": "m2", "name": "제육볶음", "price": 9000 }
  ]
}
```

시작 코드의 핵심 부분입니다. 메뉴 담기와 불러오기 실패 처리는 이미 있고, 생략했습니다.

```tsx
export function CartPage() {
  const store = useStore('banchan-1')
  const [cart, setCart] = useState<CartItem[]>([])

  if (!store) return <p>불러오는 중</p>

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <main>
      <h1>{store.name}</h1>
      <MenuList menus={store.menus} onAdd={(menu) => setCart(addToCart(cart, menu))} />

      {total < store.minOrderAmount && <p role="status">{(store.minOrderAmount - total).toLocaleString()}원 더 담으면 주문할 수 있어요</p>}

      <p>배달팁 {total >= store.freeDeliveryThreshold ? '무료' : `${store.deliveryTip.toLocaleString()}원`}</p>

      <button disabled={cart.length === 0 || total < store.minOrderAmount}>
        {total >= store.minOrderAmount
          ? `${(total + (total >= store.freeDeliveryThreshold ? 0 : store.deliveryTip)).toLocaleString()}원 주문하기`
          : '주문하기'}
      </button>
    </main>
  )
}
```

문제 1과 다른 점은 정책 **값**이 서버에서 온다는 것입니다. 값은 이미 한곳(서버 응답)에 있는데, 그래도 고칠 게 있을까요?

**할 일**: 화면 동작은 그대로 두고, 같은 규칙이 한곳에서 나오도록 바꾸세요. 행동 테스트(안내 문구, 배달팁 표시, 버튼 활성화, 결제 금액)는 그대로 통과해야 합니다.

**기록할 질문**: 안내 문구, 배달팁 표시, 주문 버튼 가운데 같은 규칙을 쓰는 것은 무엇이고, 그 규칙을 어디에 두었나요?

---

## 문제 3 · 변경 요청: 포장 주문 (20~30분, 문제 2 이어서)

> 사장님 요청: "포장 주문도 받을게요. 포장은 최소 주문 금액이 없고, 배달팁도 없어요."

화면 위에 `배달 / 포장` 선택이 생기고, 서버 응답은 그대로입니다.

**할 일**: 문제 2에서 바꾼 코드 위에 이 요청을 구현하세요. 시작 전에 "몇 곳을 고칠 것 같다"를 먼저 적어 두세요.

**기록할 질문**: 예상한 수정 위치와 실제로 고친 위치가 같았나요? 다르다면 문제 2에서 무엇을 다르게 했으면 좋았을까요?

---

## 오늘의 기준 (1줄)

`나의 기준.md`에 한 줄을 씁니다. 정답은 없고, 내일의 나에게 남기는 메모입니다.

> 예시 모양: "○○할 때는 △△를 한곳에 둔다. 왜냐하면 □□이기 때문이다."
