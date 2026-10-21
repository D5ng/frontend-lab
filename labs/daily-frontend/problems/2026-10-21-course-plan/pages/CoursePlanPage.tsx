import { Text, VStack } from '@seed-design/react'
import type { LoadCourses } from '../features/coursePlan/types/course'

export function CoursePlanPage({ loadCourses }: { loadCourses: LoadCourses }) {
  // 요구사항을 읽고 조회·입력·목록·선택의 상태와 UI를 직접 구현하세요.
  // 이 골격은 아직 요청하거나 강좌를 선택하지 않습니다.
  void loadCourses
  return (
    <VStack as="article" gap="x6" px="x4" py="x6" width="full" aria-labelledby="course-plan-heading">
      <VStack as="header" gap="x2">
        <Text as="h2" id="course-plan-heading" textStyle="t7Bold">
          오늘의 학습 강좌
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          학습할 수 있는 시간에 맞춰 강좌 하나를 골라 주세요.
        </Text>
      </VStack>
      <Text as="p" textStyle="t4Regular">
        문제 문서를 읽고 이 페이지를 완성해 주세요.
      </Text>
    </VStack>
  )
}
