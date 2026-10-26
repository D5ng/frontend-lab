import { Callout, Text, VStack } from '@seed-design/react'
import { useState } from 'react'
import { ActionButton } from 'seed-design/ui/action-button'
import { List, ListItem } from 'seed-design/ui/list'
import type { DeviceSession, EndSession } from '../features/deviceSessions/types/deviceSession'

const initialDevices: DeviceSession[] = [
  { id: 'current', name: '집 노트북', current: true },
  { id: 'phone', name: '외출용 휴대폰', current: false },
  { id: 'tablet', name: '서재 태블릿', current: false },
]

export function DeviceSessionsPage({ endSession }: { endSession: EndSession }) {
  const [devices, setDevices] = useState(initialDevices)
  const [pendingIds, setPendingIds] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  return (
    <VStack as="article" gap="x6" px="x5" py="x6" width="full">
      <VStack as="header" gap="x2">
        <Text as="h2" textStyle="t7Bold">
          연결된 기기 정리
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          사용하지 않는 다른 기기의 연결을 끊어 주세요.
        </Text>
      </VStack>
      <Text as="p" textStyle="t4Regular">
        현재 기기는 보호돼요. 처리 중인 기기만 잠기며 다른 기기는 계속 해제할 수 있어요.
      </Text>
      <List as="ul" aria-label="연결된 기기">
        {devices.map((device) => (
          <ListItem
            key={device.id}
            title={device.name}
            detail={device.current ? '현재 사용 중' : '다른 기기'}
            suffix={
              <ActionButton
                type="button"
                size="large"
                variant="neutralWeak"
                aria-label={`${device.name} 연결 끊기`}
                loading={pendingIds.includes(device.id)}
                disabled={device.current || pendingIds.includes(device.id)}
                onClick={async () => {
                  if (device.current || pendingIds.includes(device.id)) return
                  setPendingIds((values) => [...values, device.id])
                  setErrors((values) => {
                    const next = { ...values }
                    delete next[device.id]
                    return next
                  })
                  try {
                    await endSession(device.id)
                    setDevices((values) => values.filter((value) => value.id !== device.id))
                    setErrors((values) => {
                      const next = { ...values }
                      delete next[device.id]
                      return next
                    })
                  } catch {
                    setErrors((values) => ({ ...values, [device.id]: `${device.name} 연결을 끊지 못했어요. 다시 시도해 주세요.` }))
                  } finally {
                    setPendingIds((values) => values.filter((id) => id !== device.id))
                  }
                }}
              >
                {device.current ? '현재 기기' : pendingIds.includes(device.id) ? '해제 중' : '연결 끊기'}
              </ActionButton>
            }
          />
        ))}
      </List>
      <VStack gap="x3" aria-label="기기별 오류">
        {Object.entries(errors).map(([id, message]) => (
          <Callout.Root key={id} tone="critical" role="alert">
            <Callout.Content>
              <Callout.Description>{message}</Callout.Description>
            </Callout.Content>
          </Callout.Root>
        ))}
      </VStack>
      <Text as="p" textStyle="t4Regular" aria-live="polite">
        연결을 끊은 기기 {initialDevices.length - devices.length}개
      </Text>
      {devices.every((device) => device.current) && (
        <Callout.Root tone="positive" role="status">
          <Callout.Content>
            <Callout.Description>다른 기기 연결을 모두 끊었어요.</Callout.Description>
          </Callout.Content>
        </Callout.Root>
      )}
      <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
        실습용 가상 기기예요. 실제 로그인이나 기기 연결은 바뀌지 않아요.
      </Text>
    </VStack>
  )
}
