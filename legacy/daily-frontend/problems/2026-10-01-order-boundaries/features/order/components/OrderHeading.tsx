import { Text } from '@seed-design/react'

export function OrderHeading() {
  return (
    <header className="order-heading">
      <Text as="h2" textStyle="t7Bold">
        주문하기
      </Text>
      <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
        받는 방법을 선택하고 주문을 확인해 주세요.
      </Text>
    </header>
  )
}
