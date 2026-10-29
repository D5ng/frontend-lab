import { Box, HStack, Text, VStack } from '@seed-design/react'
import type { ActivityComponentType } from '@stackflow/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from 'seed-design/ui/app-bar'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'
import { Checkmark } from 'seed-design/ui/checkbox'
import { List, ListCheckItem } from 'seed-design/ui/list'
import { ListHeader } from 'seed-design/ui/list-header'

export const SalonServices: ActivityComponentType = () => {
  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="시술 선택" subtitle="하늘 원장" />
      </AppBar>
      <AppScreenContent>
        <VStack minHeight="full">
          <VStack flexGrow>
            <ListHeader variant="mediumWeak">커트</ListHeader>
            <List>
              <ListCheckItem title="커트" detail="30분 · 20,000원" suffix={<Checkmark size="large" tone="brand" />} defaultChecked />
            </List>

            <ListHeader variant="mediumWeak">염색</ListHeader>
            <List>
              <ListCheckItem
                title="기본 염색"
                detail="1시간 30분 · 70,000원"
                suffix={<Checkmark size="large" tone="brand" />}
                defaultChecked
              />
              <ListCheckItem title="탈색" detail="2시간 · 110,000원" suffix={<Checkmark size="large" tone="brand" />} />
            </List>

            <ListHeader variant="mediumWeak">펌</ListHeader>
            <List>
              <ListCheckItem title="디지털 펌" detail="2시간 30분 · 130,000원" suffix={<Checkmark size="large" tone="brand" />} />
            </List>
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
                  총 2시간
                </Text>
                <Text textStyle="t5Bold">90,000원</Text>
              </HStack>
              {/* 시술을 하나도 고르지 않았으면 누를 수 없어요. */}
              <ActionButton variant="brandSolid" size="large" onClick={() => {}}>
                날짜와 시간 고르기
              </ActionButton>
            </VStack>
          </Box>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  )
}
