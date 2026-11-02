# 배달 지연 안내 PR 리뷰

- 역할: 리마인드 · 15~20분
- 유형: 코드 리뷰. 코드는 고치지 않고 리뷰 코멘트만 씁니다.
- 도메인: 배달·외식 (배달 주문 현황)
- 화면 없음. 이 문서와 `note.md`만 있습니다.

## 상황

배달 앱의 주문 현황 화면입니다. 지금 화면 컴포넌트는 이렇게 생겼습니다.

```tsx
export const OrderStatus: ActivityComponentType<{ orderId: string }> = ({ params }) => {
  const order = useOrder(params.orderId)

  if (!order) return <OrderStatusSkeleton />

  return (
    <AppScreen>
      <AppBar>
        <AppBarMain title="주문 현황" />
      </AppBar>
      <AppScreenContent>
        <VStack gap="x6" py="x6">
          <DeliveryProgress status={order.status} />
          <ArrivalEstimate promisedArrivalAt={order.promisedArrivalAt} status={order.status} />
          <RiderContact rider={order.rider} />
          <OrderedMenus store={order.store} menus={order.menus} />
          <PaymentSummary payment={order.payment} />
        </VStack>
      </AppScreenContent>
    </AppScreen>
  )
}
```

기획에서 요청이 하나 들어왔습니다.

> "약속한 도착 시각보다 10분 넘게 늦어지면 진행 단계 바로 아래에 안내를 띄워 주세요. 30분 넘게 늦어지면 배달팁을 돌려준다는 안내도 함께요. 배달이 끝나면 안내는 없어도 돼요."

동료가 이 요청을 구현해 PR을 올렸습니다. 동작은 확인했고, 테스트도 통과합니다.

## PR diff

```diff
 export const OrderStatus: ActivityComponentType<{ orderId: string }> = ({ params }) => {
   const order = useOrder(params.orderId)
+  const [now, setNow] = useState(() => Date.now())
+
+  useEffect(() => {
+    const timer = setInterval(() => setNow(Date.now()), 60 * 1000)
+    return () => clearInterval(timer)
+  }, [])

   if (!order) return <OrderStatusSkeleton />

+  const lateMinutes = Math.floor((now - new Date(order.promisedArrivalAt).getTime()) / (60 * 1000))
+  const isDelayed = order.status !== 'delivered' && lateMinutes >= 10
+
   return (
     <AppScreen>
       <AppBar>
         <AppBarMain title="주문 현황" />
       </AppBar>
       <AppScreenContent>
         <VStack gap="x6" py="x6">
           <DeliveryProgress status={order.status} />
+          {isDelayed && (
+            <Box mx="x5" p="x4" bg="bg.warningWeak" borderRadius="r3">
+              <HStack gap="x2" alignItems="center">
+                <IconClockLine size={16} />
+                <Text textStyle="t4Bold">배달이 {lateMinutes}분 늦어지고 있어요</Text>
+              </HStack>
+              {lateMinutes >= 30 && (
+                <Text textStyle="t3Regular" color="fg.neutralMuted">
+                  30분 넘게 늦어져서 배달팁 {order.payment.deliveryTip.toLocaleString('ko-KR')}원을 돌려드려요.
+                  배달이 끝나면 결제한 수단으로 환불돼요.
+                </Text>
+              )}
+            </Box>
+          )}
           <ArrivalEstimate promisedArrivalAt={order.promisedArrivalAt} status={order.status} />
           <RiderContact rider={order.rider} />
           <OrderedMenus store={order.store} menus={order.menus} />
           <PaymentSummary payment={order.payment} />
         </VStack>
       </AppScreenContent>
     </AppScreen>
   )
 }
```

먼저 리뷰한 사람이 코멘트를 하나 남겨 두었습니다.

> 노란 박스 부분이 길어서 한눈에 안 들어와요. `<YellowNoticeBox lateMinutes={lateMinutes} deliveryTip={order.payment.deliveryTip} />`로 빼면 깔끔할 것 같아요!

## 할 일

1. 이 PR에 남길 리뷰 코멘트 두세 개를 `note.md`에 씁니다. 코멘트마다 어느 줄에 다는지 적습니다. 고친 코드를 다 쓸 필요는 없고, 방향을 보여 주는 몇 줄이면 충분합니다.
2. 먼저 달린 `YellowNoticeBox` 제안에 답글을 쓴다면 무엇이라고 쓸지 적습니다.

동작의 옳고 그름보다 **읽는 사람이 이 컴포넌트를 어떻게 읽게 되는지**에 집중합니다.
