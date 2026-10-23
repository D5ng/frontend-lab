import { Text, VStack } from '@seed-design/react'
import type { LoadRoutes } from '../features/routePlanner/types/route'

export function RoutePlannerPage({ loadRoutes }: { loadRoutes: LoadRoutes }) {
  // 조회·도착지·경로 선택·이동 계획을 요구사항에 맞게 직접 구현하세요.
  // 지금은 페이지 골격만 있으며 API 호출이나 상태 처리를 하지 않습니다.
  void loadRoutes
  return (
    <VStack as="article" gap="x6" px="x5" py="x6" width="full" aria-labelledby="route-planner-heading">
      <VStack as="header" gap="x2">
        <Text as="h2" id="route-planner-heading" textStyle="t7Bold">
          오늘의 이동 경로
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          도착지를 고르고 나에게 맞는 경로를 확인해 주세요.
        </Text>
      </VStack>
      <Text as="p" textStyle="t4Regular">
        문제 문서를 읽고 이 페이지를 완성해 주세요.
      </Text>
    </VStack>
  )
}
