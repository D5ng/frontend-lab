import { Badge, HStack, Skeleton, Text, VStack } from '@seed-design/react'
import type { ActivityComponentType } from '@stackflow/react'
import { useEffect, useState } from 'react'
import { ActionButton } from 'seed-design/ui/action-button'
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from 'seed-design/ui/app-bar'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'
import { Callout } from 'seed-design/ui/callout'
import { ContentPlaceholder } from 'seed-design/ui/content-placeholder'
import { List, ListItem } from 'seed-design/ui/list'
import { ListHeader } from 'seed-design/ui/list-header'
import { Snackbar, useSnackbarAdapter } from 'seed-design/ui/snackbar'
import { fetchRoom, requestVisit, type RoomDetailResponse } from './api'

const OPTION_LABELS: Record<string, string> = {
  AIRCON: '에어컨',
  WASHER: '세탁기',
  FRIDGE: '냉장고',
  INDUCTION: '인덕션',
  BED: '침대',
  DESK: '책상',
}

type RoomDetailParams = {
  roomId: number
}

export const RoomDetail: ActivityComponentType<RoomDetailParams> = ({ params }) => {
  const snackbar = useSnackbarAdapter()
  const [room, setRoom] = useState<RoomDetailResponse | null>(null)
  const [loadFailed, setLoadFailed] = useState(false)
  const [reloadCount, setReloadCount] = useState(0)
  const [visitStatus, setVisitStatus] = useState<'idle' | 'pending' | 'done'>('idle')

  useEffect(() => {
    let ignore = false
    fetchRoom(params.roomId)
      .then((data) => {
        if (!ignore) setRoom(data)
      })
      .catch(() => {
        if (!ignore) setLoadFailed(true)
      })
    return () => {
      ignore = true
    }
  }, [params.roomId, reloadCount])

  function handleReload() {
    setLoadFailed(false)
    setReloadCount((count) => count + 1)
  }

  async function handleRequestVisit() {
    setVisitStatus('pending')
    try {
      await requestVisit(params.roomId)
      setVisitStatus('done')
      snackbar.create({ render: () => <Snackbar variant="positive" message="방 보기를 요청했어요. 집주인이 연락하면 알려 드릴게요." /> })
    } catch {
      setVisitStatus('idle')
      snackbar.create({ render: () => <Snackbar variant="critical" message="요청하지 못했어요. 잠시 후 다시 시도해 주세요." /> })
    }
  }

  if (!room) {
    return (
      <AppScreen>
        <AppBar>
          <AppBarLeft>
            <AppBarBackButton />
          </AppBarLeft>
          <AppBarMain title="방 정보" />
        </AppBar>
        <AppScreenContent>
          {loadFailed ? (
            <VStack gap="x4" px="x5" py="x6">
              <Callout tone="critical" description="방 정보를 불러오지 못했어요. 잠시 후 다시 불러와 주세요." />
              <ActionButton variant="neutralWeak" size="medium" onClick={handleReload}>
                다시 불러오기
              </ActionButton>
            </VStack>
          ) : (
            <VStack gap="x5" px="x5" py="x6" aria-busy="true" aria-label="방 정보를 불러오는 중">
              <Skeleton height="x24" radius="8" />
              <Skeleton height="x10" radius="8" />
              <Skeleton height="x24" radius="8" />
            </VStack>
          )}
        </AppScreenContent>
      </AppScreen>
    )
  }

  const [floor, totalFloors] = room.floor.split('/')
  const pyeong = Math.round(room.area_m2 / 3.3058)
  const [, moveInMonth, moveInDay] = room.available_from?.split('-') ?? []

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
                월세 {room.deposit.toLocaleString('ko-KR')}/{room.monthly_rent}
              </Text>
              <Text color="fg.neutralSubtle">{room.title}</Text>
            </VStack>

            <VStack>
              <ListHeader>돈</ListHeader>
              <List>
                <ListItem title="보증금" suffix={<Text>{room.deposit.toLocaleString('ko-KR')}만원</Text>} />
                <ListItem title="월세" suffix={<Text>{room.monthly_rent}만원</Text>} />
                <ListItem title="관리비" suffix={<Text>{room.maintenance_fee}만원</Text>} />
                <ListItem
                  title={<Text textStyle="t5Bold">매달 드는 돈</Text>}
                  suffix={<Text textStyle="t5Bold">{room.monthly_rent + room.maintenance_fee}만원</Text>}
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
                      {room.area_m2}㎡ ({pyeong}평)
                    </Text>
                  }
                />
                <ListItem
                  title="층"
                  suffix={
                    <Text>
                      {floor}층 (전체 {totalFloors}층)
                    </Text>
                  }
                />
                <ListItem
                  title="입주"
                  suffix={
                    <Text>{room.available_from ? `${Number(moveInMonth)}월 ${Number(moveInDay)}일부터` : '바로 들어갈 수 있어요'}</Text>
                  }
                />
              </List>
            </VStack>

            <VStack gap="x3" px="x5">
              <Text as="h3" textStyle="t5Bold">
                옵션
              </Text>
              <HStack gap="x2" wrap>
                {room.options.map((option) => (
                  <Badge key={option} variant="outline" size="large">
                    {OPTION_LABELS[option] ?? option}
                  </Badge>
                ))}
              </HStack>
              <Text color="fg.neutralSubtle">{room.description}</Text>
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
