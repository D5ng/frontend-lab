// eslint-disable-next-line unused-imports/no-unused-imports -- 주석으로 넣어 둔 상태 화면을 풀 때 쓴다.
import { Box, HStack, Skeleton, Text, VStack } from '@seed-design/react'
import { useActivityZIndexBase } from '@seed-design/stackflow'
import type { ActivityComponentType } from '@stackflow/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from 'seed-design/ui/app-bar'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'
import { BottomSheetBody, BottomSheetContent, BottomSheetFooter, BottomSheetRoot, BottomSheetTrigger } from 'seed-design/ui/bottom-sheet'
// eslint-disable-next-line unused-imports/no-unused-imports -- 주석으로 넣어 둔 상태 화면을 풀 때 쓴다.
import { Callout } from 'seed-design/ui/callout'
import { Chip } from 'seed-design/ui/chip'
import { ChipTabsList, ChipTabsRoot, ChipTabsTrigger } from 'seed-design/ui/chip-tabs'

export const SalonSchedule: ActivityComponentType = () => {
  // 시트가 이 화면 위에 그려지도록 화면의 층 번호를 넘긴다. SEED가 Stackflow 화면 안 시트에 쓰는 방식이다.
  const sheetLayerIndex = useActivityZIndexBase()

  return (
    // 시트는 스크롤되는 AppScreenContent 밖에 둬야 화면 아래에 제자리로 열린다.
    <BottomSheetRoot>
      <AppScreen>
        <AppBar>
          <AppBarLeft>
            <AppBarBackButton />
          </AppBarLeft>
          <AppBarMain title="날짜와 시간" subtitle="하늘 원장 · 커트, 기본 염색" />
        </AppBar>
        <AppScreenContent>
          <VStack minHeight="full">
            <VStack flexGrow gap="x5" py="x4">
              {/* 예약하기를 눌렀는데 그새 다른 사람이 그 시간을 가져갔을 때(409) 이 화면으로 돌아와 보여 주세요. */}
              {/* <Box px="x5">
              <Callout tone="warning" description="방금 다른 분이 그 시간을 예약했어요. 다른 시간을 골라 주세요." />
            </Box> */}

              <ChipTabsRoot defaultValue="2026-11-07" variant="neutralOutline" size="medium">
                <ChipTabsList>
                  <ChipTabsTrigger value="2026-11-07">11.7 토</ChipTabsTrigger>
                  <ChipTabsTrigger value="2026-11-08">11.8 일</ChipTabsTrigger>
                  <ChipTabsTrigger value="2026-11-09" disabled>
                    11.9 월
                  </ChipTabsTrigger>
                  <ChipTabsTrigger value="2026-11-10">11.10 화</ChipTabsTrigger>
                  <ChipTabsTrigger value="2026-11-11">11.11 수</ChipTabsTrigger>
                  <ChipTabsTrigger value="2026-11-12">11.12 목</ChipTabsTrigger>
                  <ChipTabsTrigger value="2026-11-13">11.13 금</ChipTabsTrigger>
                </ChipTabsList>
              </ChipTabsRoot>

              {/* 고른 날의 예약 현황을 불러오는 동안 시간 목록 대신 보여 주세요. */}
              {/* <VStack gap="x2" px="x5">
              <Skeleton width="full" height="x10" radius="8" />
              <Skeleton width="full" height="x10" radius="8" />
            </VStack> */}

              {/* 이 날 고를 수 있는 시간이 하나도 없을 때 시간 목록 대신 보여 주세요. */}
              {/* <Box px="x5">
              <Callout tone="neutral" description="이 날은 예약이 꽉 찼어요. 다른 날을 골라 주세요." />
            </Box> */}

              {/* 예약 현황을 불러오지 못했을 때 시간 목록 대신 보여 주세요. */}
              {/* <Box px="x5">
              <Callout tone="critical" description="예약 현황을 불러오지 못했어요. 다른 날을 눌렀다가 다시 골라 주세요." />
            </Box> */}

              <VStack gap="x3" px="x5">
                <Text textStyle="t4Bold">시작 시간</Text>
                {/* 아래 비활성 표시는 모양을 보여 주는 예시예요. 어떤 시간을 막을지는 기획 메모대로 정해 주세요. */}
                <Chip.RadioRoot defaultValue="15:00" aria-label="시작 시간">
                  <HStack gap="x2" flexWrap>
                    <Chip.RadioItem value="10:00" disabled>
                      <Chip.Label>10:00</Chip.Label>
                    </Chip.RadioItem>
                    <Chip.RadioItem value="10:30" disabled>
                      <Chip.Label>10:30</Chip.Label>
                    </Chip.RadioItem>
                    <Chip.RadioItem value="11:00" disabled>
                      <Chip.Label>11:00</Chip.Label>
                    </Chip.RadioItem>
                    <Chip.RadioItem value="11:30" disabled>
                      <Chip.Label>11:30</Chip.Label>
                    </Chip.RadioItem>
                    <Chip.RadioItem value="12:00" disabled>
                      <Chip.Label>12:00</Chip.Label>
                    </Chip.RadioItem>
                    <Chip.RadioItem value="12:30" disabled>
                      <Chip.Label>12:30</Chip.Label>
                    </Chip.RadioItem>
                    <Chip.RadioItem value="13:00" disabled>
                      <Chip.Label>13:00</Chip.Label>
                    </Chip.RadioItem>
                    <Chip.RadioItem value="13:30">
                      <Chip.Label>13:30</Chip.Label>
                    </Chip.RadioItem>
                    <Chip.RadioItem value="14:00">
                      <Chip.Label>14:00</Chip.Label>
                    </Chip.RadioItem>
                    <Chip.RadioItem value="14:30">
                      <Chip.Label>14:30</Chip.Label>
                    </Chip.RadioItem>
                    <Chip.RadioItem value="15:00">
                      <Chip.Label>15:00</Chip.Label>
                    </Chip.RadioItem>
                    <Chip.RadioItem value="15:30">
                      <Chip.Label>15:30</Chip.Label>
                    </Chip.RadioItem>
                    <Chip.RadioItem value="16:00">
                      <Chip.Label>16:00</Chip.Label>
                    </Chip.RadioItem>
                    <Chip.RadioItem value="16:30">
                      <Chip.Label>16:30</Chip.Label>
                    </Chip.RadioItem>
                    <Chip.RadioItem value="17:00">
                      <Chip.Label>17:00</Chip.Label>
                    </Chip.RadioItem>
                    <Chip.RadioItem value="17:30">
                      <Chip.Label>17:30</Chip.Label>
                    </Chip.RadioItem>
                    <Chip.RadioItem value="18:00">
                      <Chip.Label>18:00</Chip.Label>
                    </Chip.RadioItem>
                    <Chip.RadioItem value="18:30">
                      <Chip.Label>18:30</Chip.Label>
                    </Chip.RadioItem>
                    <Chip.RadioItem value="19:00">
                      <Chip.Label>19:00</Chip.Label>
                    </Chip.RadioItem>
                    <Chip.RadioItem value="19:30">
                      <Chip.Label>19:30</Chip.Label>
                    </Chip.RadioItem>
                  </HStack>
                </Chip.RadioRoot>
              </VStack>
            </VStack>

            <Box
              position="sticky"
              bottom={0}
              bg="bg.layerDefault"
              borderTopWidth={1}
              borderColor="stroke.neutralSubtle"
              px="x5"
              pt="x3"
              pb="x5"
            >
              <VStack gap="x3">
                <HStack justifyContent="space-between">
                  <Text textStyle="t4Regular" color="fg.neutralSubtle">
                    11월 7일 (토) 15:00 ~ 17:00
                  </Text>
                  <Text textStyle="t5Bold">90,000원</Text>
                </HStack>
                {/* 시간을 고르지 않았으면 누를 수 없어요. */}
                <BottomSheetTrigger asChild>
                  <ActionButton variant="brandSolid" size="large">
                    예약하기
                  </ActionButton>
                </BottomSheetTrigger>
              </VStack>
            </Box>
          </VStack>
        </AppScreenContent>
        <BottomSheetContent title="예약 내용을 확인해 주세요" description="결제는 가게에서 해요." layerIndex={sheetLayerIndex}>
          <BottomSheetBody>
            <VStack gap="x3">
              <HStack justifyContent="space-between">
                <Text color="fg.neutralSubtle">디자이너</Text>
                <Text>하늘 원장</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color="fg.neutralSubtle">시술</Text>
                <Text>커트, 기본 염색</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color="fg.neutralSubtle">날짜</Text>
                <Text>11월 7일 (토)</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color="fg.neutralSubtle">시간</Text>
                <Text>15:00 ~ 17:00</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color="fg.neutralSubtle">금액</Text>
                <Text textStyle="t5Bold">90,000원</Text>
              </HStack>

              {/* 예약 요청이 실패했을 때(500) 보여 주세요. 시트는 닫지 않아요. */}
              {/* <Callout tone="critical" description="예약하지 못했어요. 잠시 후 다시 시도해 주세요." /> */}
            </VStack>
          </BottomSheetBody>
          <BottomSheetFooter>
            {/* 예약 요청 중에는 loading을 켜고, 다시 누를 수 없게 해 주세요. */}
            <ActionButton variant="brandSolid" size="large" onClick={() => {}}>
              예약하기
            </ActionButton>
          </BottomSheetFooter>
        </BottomSheetContent>
      </AppScreen>
    </BottomSheetRoot>
  )
}
