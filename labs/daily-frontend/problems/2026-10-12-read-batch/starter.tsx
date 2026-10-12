import { useState } from 'react'
import { Callout, Checkbox, Text, VStack } from '@seed-design/react'
import { IconCheckmarkFatFill } from '@karrotmarket/react-monochrome-icon'
import { ActionButton } from 'seed-design/ui/action-button'
import { List, ListCheckItem } from 'seed-design/ui/list'
import { notifications, type MarkRead } from './api'

export function NotificationInbox({ markRead }: { markRead: MarkRead }) {
  const [items, setItems] = useState(notifications)
  const [selected, setSelected] = useState<string[]>([])
  const [processing, setProcessing] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [failed, setFailed] = useState(false)

  async function submit() {
    if (processing.length > 0) return
    const ids = items.filter((item) => !item.read && selected.includes(item.id)).map((item) => item.id)
    if (ids.length === 0) return
    setProcessing(ids)
    setMessage('')
    try {
      await markRead(ids)
      setItems((current) => current.map((item) => (ids.includes(item.id) ? { ...item, read: true } : item)))
      setSelected((current) => current.filter((id) => !ids.includes(id)))
      setFailed(false)
      setMessage(`${ids.length}개 알림을 읽음 처리했어요.`)
    } catch {
      setFailed(true)
      setMessage('읽음 처리하지 못했어요. 현재 선택으로 다시 시도해 주세요.')
    } finally {
      setProcessing([])
    }
  }

  return (
    <VStack as="article" aria-label="알림 정리" gap="x6" py="x4" width="full">
      <VStack px="x4" gap="x2">
        <Text as="h2" textStyle="t7Bold">
          알림 정리하기
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          확인한 알림을 골라 읽음 처리해 주세요.
        </Text>
        <Text as="p" textStyle="t4Regular">
          안 읽은 알림 {items.filter((item) => !item.read).length}개 · 선택{' '}
          {items.filter((item) => !item.read && selected.includes(item.id)).length}개
        </Text>
      </VStack>
      <List as="div" role="group" aria-label="읽음 처리할 알림" width="full">
        {items.map((item) => (
          <ListCheckItem
            key={item.id}
            title={item.title}
            detail={item.description}
            inputProps={{ 'aria-label': item.title }}
            checked={selected.includes(item.id)}
            disabled={item.read || processing.includes(item.id)}
            onCheckedChange={(checked) => {
              if (item.read || processing.includes(item.id)) return
              setSelected((current) =>
                checked ? [...current.filter((id) => id !== item.id), item.id] : current.filter((id) => id !== item.id),
              )
              if (processing.length === 0) setMessage('')
            }}
            prefix={
              <Checkbox.Control variant="ghost" size="large" tone="neutral">
                <Checkbox.Indicator unchecked={<IconCheckmarkFatFill />} checked={<IconCheckmarkFatFill />} />
              </Checkbox.Control>
            }
            suffix={
              <Text textStyle="t3Regular" color="fg.neutralSubtle">
                {item.read ? '읽음' : processing.includes(item.id) ? '처리 중' : '안 읽음'}
              </Text>
            }
          />
        ))}
      </List>
      <VStack px="x4" gap="x4">
        {items.every((item) => item.read) && (
          <Text textStyle="t4Regular" color="fg.neutralSubtle">
            모든 알림을 확인했어요.
          </Text>
        )}
        {processing.length > 0 && (
          <Text role="status" textStyle="t4Regular">
            {processing.length}개 처리 중이에요. 다른 알림은 계속 선택할 수 있어요.
          </Text>
        )}
        {message && (
          <Callout.Root tone={failed ? 'critical' : 'positive'} role={failed ? 'alert' : 'status'}>
            <Callout.Content>
              <Callout.Description>{message}</Callout.Description>
            </Callout.Content>
          </Callout.Root>
        )}
        {processing.length === 0 &&
          items.filter((item) => !item.read && selected.includes(item.id)).length === 0 &&
          !items.every((item) => item.read) && (
            <Text textStyle="t4Regular" color="fg.neutralSubtle">
              읽음 처리할 알림을 선택해 주세요.
            </Text>
          )}
        <ActionButton
          variant="neutralSolid"
          size="large"
          loading={processing.length > 0}
          disabled={processing.length > 0 || items.filter((item) => !item.read && selected.includes(item.id)).length === 0}
          aria-label={
            processing.length > 0
              ? '읽음 처리 중'
              : `선택한 ${items.filter((item) => !item.read && selected.includes(item.id)).length}개 읽음 처리`
          }
          onClick={() => void submit()}
        >
          {processing.length > 0
            ? '읽음 처리 중'
            : `선택한 ${items.filter((item) => !item.read && selected.includes(item.id)).length}개 읽음 처리`}
        </ActionButton>
      </VStack>
    </VStack>
  )
}
