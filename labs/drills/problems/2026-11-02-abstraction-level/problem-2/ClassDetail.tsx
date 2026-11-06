import { IconCheckmarkLine } from '@karrotmarket/react-monochrome-icon'
import { Badge, Box, HStack, Skeleton, Text, VStack } from '@seed-design/react'
import { useActivityZIndexBase } from '@seed-design/stackflow'
import type { ActivityComponentType } from '@stackflow/react'
import { useEffect, useState } from 'react'
import { ActionButton } from 'seed-design/ui/action-button'
import { AppBar, AppBarMain } from 'seed-design/ui/app-bar'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'
import { Avatar } from 'seed-design/ui/avatar'
import { BottomSheetBody, BottomSheetContent, BottomSheetRoot } from 'seed-design/ui/bottom-sheet'
import { Callout } from 'seed-design/ui/callout'
import { List, ListButtonItem, ListItem } from 'seed-design/ui/list'
import { ListHeader } from 'seed-design/ui/list-header'
import { Snackbar, useSnackbarAdapter } from 'seed-design/ui/snackbar'
import { bookClass, type ClassDetailResponse, fetchClassDetail } from './api'
import { ClassSummary } from './ClassSummary'
import { formatDateTime, formatMonthDay } from './time'

const CLASS_ID = 'mat-1104-1900'

export const ClassDetail: ActivityComponentType = () => {
  const snackbar = useSnackbarAdapter()
  // 시트가 이 화면 위에 그려지도록 화면의 층 번호를 넘긴다. SEED가 Stackflow 화면 안 시트에 쓰는 방식이다.
  const layerIndex = useActivityZIndexBase()
  const [data, setData] = useState<ClassDetailResponse | null>(null)
  const [loadFailed, setLoadFailed] = useState(false)
  const [reloadCount, setReloadCount] = useState(0)
  const [selectedPassId, setSelectedPassId] = useState<string | null>(null)
  const [passSheetOpen, setPassSheetOpen] = useState(false)
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    let ignore = false
    fetchClassDetail(CLASS_ID)
      .then((response) => {
        if (ignore) return
        setData(response)
        const firstUsablePass = response.passes.find(
          (pass) => pass.remainingCount > 0 && new Date(pass.expiresAt) >= new Date(response.gymClass.startsAt),
        )
        setSelectedPassId(response.gymClass.myBooking?.passId ?? firstUsablePass?.id ?? null)
      })
      .catch(() => {
        if (!ignore) setLoadFailed(true)
      })
    return () => {
      ignore = true
    }
  }, [reloadCount])

  if (!data) {
    return (
      <AppScreen>
        <AppBar>
          <AppBarMain title="수업 예약" />
        </AppBar>
        <AppScreenContent>
          {loadFailed ? (
            <VStack gap="x4" px="x5" py="x6">
              <Callout tone="critical" description="수업 정보를 불러오지 못했어요. 잠시 후 다시 불러와 주세요." />
              <ActionButton
                variant="neutralWeak"
                size="medium"
                onClick={() => {
                  setLoadFailed(false)
                  setReloadCount((count) => count + 1)
                }}
              >
                다시 불러오기
              </ActionButton>
            </VStack>
          ) : (
            <VStack gap="x6" px="x5" py="x6" aria-busy="true" aria-label="수업 정보를 불러오는 중">
              <Skeleton height="x16" radius="8" />
              <Skeleton height="x12" radius="8" />
              <Skeleton height="x12" radius="8" />
              <Skeleton height="x20" radius="8" />
            </VStack>
          )}
        </AppScreenContent>
      </AppScreen>
    )
  }

  const { gymClass, passes } = data
  const remainingSeats = gymClass.capacity - gymClass.bookedCount
  const selectedPass = passes.find((pass) => pass.id === selectedPassId)
  const cancelDeadline = new Date(new Date(gymClass.startsAt).getTime() - gymClass.cancelDeadlineHours * 60 * 60 * 1000)

  async function handleBook() {
    if (!selectedPass) return
    setBooking(true)
    try {
      setData(await bookClass(gymClass.id, selectedPass.id))
      snackbar.create({ render: () => <Snackbar variant="positive" message="예약했어요. 수업에서 만나요." /> })
    } catch {
      snackbar.create({ render: () => <Snackbar variant="critical" message="예약하지 못했어요. 잠시 후 다시 시도해 주세요." /> })
    } finally {
      setBooking(false)
    }
  }

  return (
    // 시트는 스크롤되는 AppScreenContent 밖에 둬야 화면 아래에 제자리로 열린다.
    <BottomSheetRoot open={passSheetOpen} onOpenChange={setPassSheetOpen}>
      <AppScreen>
        <AppBar>
          <AppBarMain title="수업 예약" />
        </AppBar>
        <AppScreenContent>
          <VStack minHeight="full">
            <VStack flexGrow gap="x6" py="x6">
              <ClassSummary gymClass={gymClass} />

              <VStack gap="x1_5" mx="x5" p="x4" bg="bg.neutralWeak" borderRadius="r3">
                <HStack gap="x2">
                  <Text textStyle="t5Bold">
                    {remainingSeats <= 0 ? '자리가 모두 찼어요' : `${gymClass.capacity}자리 중 ${remainingSeats}자리 남았어요`}
                  </Text>
                  {remainingSeats > 0 && remainingSeats <= 2 && (
                    <Badge tone="warning" variant="weak">
                      마감 임박
                    </Badge>
                  )}
                </HStack>
                <Text textStyle="t3Regular" color="fg.neutralSubtle">
                  지금 {gymClass.bookedCount}명이 예약했어요
                </Text>
              </VStack>

              <List>
                <ListHeader>강사</ListHeader>
                <ListItem
                  prefix={
                    <Avatar
                      size="42"
                      src={gymClass.instructor.profileImageUrl ?? undefined}
                      alt=""
                      fallback={gymClass.instructor.name.slice(0, 1)}
                    />
                  }
                  title={`${gymClass.instructor.name} 강사`}
                  detail={gymClass.instructor.intro}
                />
              </List>

              <List>
                <ListHeader>수강권</ListHeader>
                {selectedPass ? (
                  <ListButtonItem
                    title={selectedPass.name}
                    detail={`${selectedPass.remainingCount}회 남음 · ${formatMonthDay(selectedPass.expiresAt)}까지`}
                    suffix={
                      <Text textStyle="t4Regular" color="fg.neutralSubtle">
                        바꾸기
                      </Text>
                    }
                    disabled={booking || gymClass.myBooking !== null}
                    onClick={() => setPassSheetOpen(true)}
                  />
                ) : (
                  <ListItem title="쓸 수 있는 수강권이 없어요" detail="수강권을 사면 이 수업을 예약할 수 있어요." />
                )}
              </List>

              <Box px="x5">
                <Callout
                  tone="informative"
                  description={`${formatDateTime(cancelDeadline.toISOString())}까지 취소하면 수강권 1회가 돌아와요. 그 뒤에 취소하거나 오지 않으면 1회가 빠져요.`}
                />
              </Box>
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
              {gymClass.myBooking ? (
                <ActionButton variant="neutralWeak" size="large" disabled>
                  예약한 수업이에요
                </ActionButton>
              ) : (
                <ActionButton
                  variant="brandSolid"
                  size="large"
                  loading={booking}
                  disabled={booking || remainingSeats <= 0 || !selectedPass}
                  onClick={handleBook}
                >
                  예약하기
                </ActionButton>
              )}
            </VStack>
          </VStack>
        </AppScreenContent>

        <BottomSheetContent title="수강권 고르기" layerIndex={layerIndex}>
          <BottomSheetBody>
            <List>
              {passes.map((pass) => {
                const endsBeforeClass = new Date(pass.expiresAt) < new Date(gymClass.startsAt)
                const usedUp = pass.remainingCount === 0

                return (
                  <ListButtonItem
                    key={pass.id}
                    title={pass.name}
                    detail={
                      endsBeforeClass
                        ? `${formatMonthDay(pass.expiresAt)}에 끝나서 이 수업에는 쓸 수 없어요`
                        : usedUp
                          ? '남은 횟수가 없어요'
                          : `${pass.remainingCount}회 남음 · ${formatMonthDay(pass.expiresAt)}까지`
                    }
                    suffix={pass.id === selectedPassId ? <IconCheckmarkLine size={20} aria-label="고른 수강권" /> : undefined}
                    disabled={endsBeforeClass || usedUp}
                    onClick={() => {
                      setSelectedPassId(pass.id)
                      setPassSheetOpen(false)
                    }}
                  />
                )
              })}
            </List>
          </BottomSheetBody>
        </BottomSheetContent>
      </AppScreen>
    </BottomSheetRoot>
  )
}
