import { Badge, HStack, Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from 'seed-design/ui/app-bar'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'
import { ContentPlaceholder } from 'seed-design/ui/content-placeholder'
import { List, ListItem } from 'seed-design/ui/list'
import { ListHeader } from 'seed-design/ui/list-header'
import { Snackbar, useSnackbarAdapter } from 'seed-design/ui/snackbar'
import type { DetailRoom } from '../../../room/room'
import { formatManwon, formatMonthDay, formatWithComma } from '../../../shared/utils/format'
import { useVisitRequest } from '../hooks/useVisitRequest'

const OPTION_LABELS: Record<string, string> = {
  AIRCON: '에어컨',
  WASHER: '세탁기',
  FRIDGE: '냉장고',
  INDUCTION: '인덕션',
  BED: '침대',
  DESK: '책상',
}

export function RoomDetailContent({
  id,
  deposit,
  monthlyRent,
  title,
  maintenanceFee,
  monthlyCost,
  areaM2,
  pyeong,
  floor,
  totalFloor,
  availableFrom,
  options,
  description,
}: DetailRoom) {
  const snackbar = useSnackbarAdapter()
  const { visitStatus, handleRequestVisit } = useVisitRequest({
    id,
    onSuccess: () => {
      snackbar.create({ render: () => <Snackbar variant="positive" message="방 보기를 요청했어요. 집주인이 연락하면 알려 드릴게요." /> })
    },
    onError: () => {
      snackbar.create({ render: () => <Snackbar variant="critical" message="요청하지 못했어요. 잠시 후 다시 시도해 주세요." /> })
    },
  })

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="방 정보" />
      </AppBar>
      <AppScreenContent>
        <VStack minHeight="full">
          <VStack flexGrow gap="x6" pb="x6">
            <ContentPlaceholder type="realty" aria-hidden="true" style={{ width: '100%', height: 200 }} />

            <VStack gap="x1" px="x5">
              <Text as="h2" textStyle="t7Bold">
                월세 {formatWithComma(deposit)}/{monthlyRent}
              </Text>
              <Text color="fg.neutralSubtle">{title}</Text>
            </VStack>

            <VStack>
              <ListHeader>돈</ListHeader>
              <List>
                <ListItem title="보증금" suffix={<Text>{formatManwon(deposit)}</Text>} />
                <ListItem title="월세" suffix={<Text>{formatManwon(monthlyRent)}</Text>} />
                <ListItem title="관리비" suffix={<Text>{formatManwon(maintenanceFee)}</Text>} />
                <ListItem
                  title={<Text textStyle="t5Bold">매달 드는 돈</Text>}
                  suffix={<Text textStyle="t5Bold">{formatManwon(monthlyCost)}</Text>}
                />
              </List>
            </VStack>

            <VStack>
              <ListHeader>방</ListHeader>
              <List>
                <ListItem
                  title="크기"
                  suffix={
                    <Text>
                      {areaM2}㎡ ({pyeong}평)
                    </Text>
                  }
                />
                <ListItem
                  title="층"
                  suffix={
                    <Text>
                      {floor}층 (전체 {totalFloor}층)
                    </Text>
                  }
                />
                <ListItem
                  title="입주"
                  suffix={<Text>{availableFrom === null ? '바로 들어갈 수 있어요' : `${formatMonthDay(availableFrom)}부터`}</Text>}
                />
              </List>
            </VStack>

            <VStack gap="x3" px="x5">
              <Text as="h3" textStyle="t5Bold">
                옵션
              </Text>
              <HStack gap="x2" wrap>
                {options.map((option) => (
                  <Badge key={option} variant="outline" size="large">
                    {OPTION_LABELS[option] ?? option}
                  </Badge>
                ))}
              </HStack>
              <Text color="fg.neutralSubtle">{description}</Text>
            </VStack>
          </VStack>

          <VStack
            position="sticky"
            bottom={0}
            bg="bg.layerDefault"
            borderTopWidth={1}
            borderColor="stroke.neutralSubtle"
            px="x5"
            pt="x3"
            pb="x5"
          >
            <ActionButton
              variant="brandSolid"
              size="large"
              loading={visitStatus === 'pending'}
              disabled={visitStatus === 'done'}
              onClick={() => void handleRequestVisit()}
            >
              {visitStatus === 'done' ? '방 보기를 요청했어요' : '방 보기 요청하기'}
            </ActionButton>
          </VStack>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  )
}
