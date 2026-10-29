import { IconChevronRightLine } from '@karrotmarket/react-monochrome-icon'
// eslint-disable-next-line unused-imports/no-unused-imports -- 주석으로 넣어 둔 상태 화면을 풀 때 쓴다.
import { Badge, Box, Icon, Skeleton, VStack } from '@seed-design/react'
import type { ActivityComponentType } from '@stackflow/react'
import { AppBar, AppBarMain } from 'seed-design/ui/app-bar'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'
import { Avatar } from 'seed-design/ui/avatar'
// eslint-disable-next-line unused-imports/no-unused-imports -- 주석으로 넣어 둔 상태 화면을 풀 때 쓴다.
import { Callout } from 'seed-design/ui/callout'
import { List, ListButtonItem } from 'seed-design/ui/list'
import { ListHeader } from 'seed-design/ui/list-header'

export const SalonHome: ActivityComponentType = () => {
  return (
    <AppScreen>
      <AppBar>
        <AppBarMain title="골목 헤어" subtitle="매일 10:00 - 20:00" />
      </AppBar>
      <AppScreenContent>
        {/* 가게 정보를 불러오는 동안 디자이너 목록 대신 보여 주세요. */}
        {/* <VStack gap="x3" px="x5" py="x4">
          <Skeleton width="full" height="x16" radius="8" />
          <Skeleton width="full" height="x16" radius="8" />
        </VStack> */}

        {/* 가게 정보를 불러오지 못했을 때 디자이너 목록 대신 보여 주세요. */}
        {/* <Box px="x5" py="x4">
          <Callout tone="critical" description="가게 정보를 불러오지 못했어요. 잠시 후 다시 열어 주세요." />
        </Box> */}

        <ListHeader variant="mediumWeak">디자이너를 골라 주세요</ListHeader>
        <List>
          <ListButtonItem
            prefix={<Avatar size="48" fallback="하" />}
            title="하늘 원장"
            detail="커트 · 기본 염색 · 탈색 · 디지털 펌"
            suffix={
              <VStack gap="x1" alignItems="flex-end">
                <Badge variant="weak" tone="neutral" size="medium">
                  월 휴무
                </Badge>
                <Icon svg={<IconChevronRightLine />} />
              </VStack>
            }
            onClick={() => {}}
          />
          <ListButtonItem
            prefix={<Avatar size="48" fallback="도" />}
            title="도윤 실장"
            detail="커트 · 셋팅 펌 · 두피 클리닉"
            suffix={
              <VStack gap="x1" alignItems="flex-end">
                <Badge variant="weak" tone="neutral" size="medium">
                  화·수 휴무
                </Badge>
                <Icon svg={<IconChevronRightLine />} />
              </VStack>
            }
            onClick={() => {}}
          />
        </List>
      </AppScreenContent>
    </AppScreen>
  )
}
