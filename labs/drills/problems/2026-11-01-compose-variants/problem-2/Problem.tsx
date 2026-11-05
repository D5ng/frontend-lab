// eslint-disable-next-line unused-imports/no-unused-imports -- 주석으로 넣어 둔 상태 화면을 풀 때 쓴다.
import { Box, HStack, ImageFrame, Skeleton, Text, VisuallyHidden, VStack } from '@seed-design/react'
import { seedPlugin } from '@seed-design/stackflow'
import { basicRendererPlugin } from '@stackflow/plugin-renderer-basic'
import { type ActivityComponentType, stackflow } from '@stackflow/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { AppBar, AppBarMain } from 'seed-design/ui/app-bar'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'
import { Avatar, AvatarStack } from 'seed-design/ui/avatar'
// eslint-disable-next-line unused-imports/no-unused-imports -- 주석으로 넣어 둔 상태 화면을 풀 때 쓴다.
import { Callout } from 'seed-design/ui/callout'

// 화면만 그려 두었다. 값은 handlers.ts의 응답을 그대로 옮겨 적은 예시이고, 동작은 하나도 없다.
// 불러오기, 답하기, 컴포넌트와 파일을 어떻게 나눌지는 problem.md를 보고 직접 정한다.
// 사람 사진은 비워 두어 이름 첫 글자가 보인다. 응답의 profileImageUrl을 넣으면 사진이 나온다.
const InboxHome: ActivityComponentType = () => {
  return (
    <AppScreen>
      <AppBar>
        <AppBarMain title="알림" />
      </AppBar>
      <AppScreenContent>
        {/* 알림을 불러오는 동안 목록 대신 보여 주세요. */}
        {/* <VStack gap="x5" px="x5" py="x4" aria-busy="true" aria-label="알림을 불러오는 중">
          <HStack gap="x3">
            <Skeleton width="x10" height="x10" radius="full" />
            <VStack gap="x2" flexGrow={1}>
              <Skeleton width="full" height="x4" radius="8" />
              <Skeleton width="x16" height="x3" radius="8" />
            </VStack>
          </HStack>
          <HStack gap="x3">
            <Skeleton width="x10" height="x10" radius="full" />
            <VStack gap="x2" flexGrow={1}>
              <Skeleton width="full" height="x4" radius="8" />
              <Skeleton width="x16" height="x3" radius="8" />
            </VStack>
          </HStack>
        </VStack> */}

        {/* 알림을 불러오지 못했을 때 목록 대신 보여 주세요. */}
        {/* <VStack gap="x4" px="x5" py="x6">
          <Callout tone="critical" description="알림을 불러오지 못했어요. 잠시 후 다시 불러와 주세요." />
          <ActionButton variant="neutralWeak" size="medium" onClick={() => {}}>
            다시 불러오기
          </ActionButton>
        </VStack> */}

        {/* 받은 알림이 하나도 없을 때 목록 대신 보여 주세요. */}
        {/* <VStack px="x5" py="x10" alignItems="center">
          <Text textStyle="t5Bold">아직 받은 알림이 없어요</Text>
        </VStack> */}

        <VStack as="ul">
          {/* 댓글 · 읽지 않음 */}
          <Box as="li" px="x5" py="x4" bg="bg.brandWeak">
            <HStack gap="x3" alignItems="flex-start">
              <Avatar size="42" fallback="김" />
              <VStack gap="x1" flexGrow={1}>
                <Text textStyle="t5Regular">
                  <Text as="strong" fontWeight="bold">
                    김민지
                  </Text>
                  님이 내 글에 댓글을 남겼어요
                </Text>
                <Text textStyle="t4Regular" color="fg.neutralMuted" maxLines={2}>
                  다음엔 저도 같이 뛰어요! 반포에서 출발하는 코스도 공유해 주실 수 있나요? 주말마다 혼자 뛰기 심심했거든요.
                </Text>
                <Text textStyle="t3Regular" color="fg.neutralSubtle">
                  3분 전
                </Text>
              </VStack>
            </HStack>
            <VisuallyHidden>읽지 않음</VisuallyHidden>
          </Box>

          {/* 좋아요 · 여러 명 · 읽지 않음. 사진은 세 명까지만 겹친다. */}
          <Box as="li" px="x5" py="x4" bg="bg.brandWeak">
            <HStack gap="x3" alignItems="flex-start">
              <AvatarStack size="24">
                <Avatar fallback="김" />
                <Avatar fallback="이" />
                <Avatar fallback="최" />
              </AvatarStack>
              <VStack gap="x1" flexGrow={1}>
                <Text textStyle="t5Regular">
                  <Text as="strong" fontWeight="bold">
                    김민지
                  </Text>
                  님 외 3명이 내 글을 좋아해요
                </Text>
                <Text textStyle="t4Regular" color="fg.neutralMuted">
                  토요일 아침 한강 러닝 후기
                </Text>
                <Text textStyle="t3Regular" color="fg.neutralSubtle">
                  2시간 전
                </Text>
              </VStack>
            </HStack>
            <VisuallyHidden>읽지 않음</VisuallyHidden>
          </Box>

          {/* 모임 초대 · 답하기 전 */}
          <Box as="li" px="x5" py="x4">
            <HStack gap="x3" alignItems="flex-start">
              <Box width="x10" flexShrink={0}>
                <ImageFrame
                  src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2296%22%20height%3D%2296%22%3E%3Crect%20width%3D%2296%22%20height%3D%2296%22%20fill%3D%22%2390be6d%22%2F%3E%3C%2Fsvg%3E"
                  alt="주말 러닝 크루"
                  ratio={1}
                />
              </Box>
              <VStack gap="x1" flexGrow={1}>
                <Text textStyle="t5Regular">
                  <Text as="strong" fontWeight="bold">
                    박준호
                  </Text>
                  님이{' '}
                  <Text as="strong" fontWeight="bold">
                    주말 러닝 크루
                  </Text>
                  에 초대했어요
                </Text>
                <Text textStyle="t4Regular" color="fg.neutralMuted">
                  멤버 24명
                </Text>
                <Text textStyle="t3Regular" color="fg.neutralSubtle">
                  어제
                </Text>

                <HStack gap="x2" pt="x2">
                  <ActionButton variant="neutralWeak" size="small" flexGrow={1} onClick={() => {}}>
                    거절
                  </ActionButton>
                  <ActionButton variant="brandSolid" size="small" flexGrow={1} onClick={() => {}}>
                    참여하기
                  </ActionButton>
                </HStack>

                {/* 답하는 동안 위 두 버튼 대신 보여 주세요. 누른 버튼에만 loading을 줍니다. */}
                {/* <HStack gap="x2" pt="x2">
                  <ActionButton variant="neutralWeak" size="small" flexGrow={1} disabled onClick={() => {}}>
                    거절
                  </ActionButton>
                  <ActionButton variant="brandSolid" size="small" flexGrow={1} disabled loading onClick={() => {}}>
                    참여하기
                  </ActionButton>
                </HStack> */}

                {/* 답하지 못했을 때 두 버튼 아래에 보여 주세요. */}
                {/* <Text textStyle="t3Regular" color="fg.critical">
                  답하지 못했어요. 다시 눌러 주세요.
                </Text> */}

                {/* 거절하고 나면 두 버튼 대신 보여 주세요. 참여했을 때 모양은 맨 아래 초대 알림에 있습니다. */}
                {/* <Box pt="x2">
                  <Text textStyle="t4Regular" color="fg.neutralSubtle">
                    초대를 거절했어요
                  </Text>
                </Box> */}
              </VStack>
            </HStack>
          </Box>

          {/* 좋아요 · 한 명 */}
          <Box as="li" px="x5" py="x4">
            <HStack gap="x3" alignItems="flex-start">
              <AvatarStack size="24">
                <Avatar fallback="이" />
              </AvatarStack>
              <VStack gap="x1" flexGrow={1}>
                <Text textStyle="t5Regular">
                  <Text as="strong" fontWeight="bold">
                    이서연
                  </Text>
                  님이 내 글을 좋아해요
                </Text>
                <Text textStyle="t4Regular" color="fg.neutralMuted">
                  망원동 저녁 산책 같이 해요
                </Text>
                <Text textStyle="t3Regular" color="fg.neutralSubtle">
                  2일 전
                </Text>
              </VStack>
            </HStack>
          </Box>

          {/* 모임 초대 · 이미 참여함 */}
          <Box as="li" px="x5" py="x4">
            <HStack gap="x3" alignItems="flex-start">
              <Box width="x10" flexShrink={0}>
                <ImageFrame
                  src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2296%22%20height%3D%2296%22%3E%3Crect%20width%3D%2296%22%20height%3D%2296%22%20fill%3D%22%23577590%22%2F%3E%3C%2Fsvg%3E"
                  alt="망원 책 읽는 밤"
                  ratio={1}
                />
              </Box>
              <VStack gap="x1" flexGrow={1}>
                <Text textStyle="t5Regular">
                  <Text as="strong" fontWeight="bold">
                    정하린
                  </Text>
                  님이{' '}
                  <Text as="strong" fontWeight="bold">
                    망원 책 읽는 밤
                  </Text>
                  에 초대했어요
                </Text>
                <Text textStyle="t4Regular" color="fg.neutralMuted">
                  멤버 12명
                </Text>
                <Text textStyle="t3Regular" color="fg.neutralSubtle">
                  3일 전
                </Text>
                <Box pt="x2">
                  <Text textStyle="t4Regular" color="fg.neutralSubtle">
                    모임에 참여했어요
                  </Text>
                </Box>
              </VStack>
            </HStack>
          </Box>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  )
}

const { Stack } = stackflow({
  activities: { InboxHome },
  initialActivity: () => 'InboxHome',
  transitionDuration: 350,
  plugins: [basicRendererPlugin(), seedPlugin({ theme: 'cupertino' })],
})

export function Problem() {
  return <Stack />
}
