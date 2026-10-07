import { useState } from 'react'
import { Callout, Switch, Text, VStack } from '@seed-design/react'
import { List, ListSwitchItem } from 'seed-design/ui/list'
import { products, type UpdateNotification } from './api'

export function NotificationSettings({ updateNotification }: { updateNotification: UpdateNotification }) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(products.map((product) => [product.id, product.enabled])),
  )
  const [pending, setPending] = useState<Record<string, boolean>>({})
  const [messages, setMessages] = useState<Record<string, string>>({})
  const [failed, setFailed] = useState<Record<string, boolean>>({})

  async function change(productId: string, next: boolean) {
    if (pending[productId]) return
    const previous = enabled[productId] ?? false
    setEnabled((values) => ({ ...values, [productId]: next }))
    setPending((values) => ({ ...values, [productId]: true }))
    setMessages((values) => ({ ...values, [productId]: '' }))
    setFailed((values) => ({ ...values, [productId]: false }))
    try {
      await updateNotification({ productId, enabled: next })
      setMessages((values) => ({ ...values, [productId]: next ? '알림을 켰어요.' : '알림을 껐어요.' }))
    } catch {
      setEnabled((values) => ({ ...values, [productId]: previous }))
      setFailed((values) => ({ ...values, [productId]: true }))
      setMessages((values) => ({ ...values, [productId]: '변경하지 못했어요. 이전 설정으로 돌아갔어요. 다시 눌러 주세요.' }))
    } finally {
      setPending((values) => ({ ...values, [productId]: false }))
    }
  }

  return (
    <VStack as="article" gap="x6" py="x5" width="full" aria-label="상품 가격 알림">
      <VStack gap="x2" px="x4">
        <Text as="h2" textStyle="t7Bold">
          관심 상품 알림
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          상품별 가격 알림을 바로 켜고 끌 수 있어요.
        </Text>
        <Text as="p" textStyle="t4Bold">
          알림 켠 상품 {products.filter((product) => enabled[product.id]).length}개
        </Text>
      </VStack>
      <List as="div" width="full" aria-label="관심 상품">
        {products.map((product) => (
          <VStack key={product.id} as="section" aria-label={product.title} gap="x2" pb="x4">
            <ListSwitchItem
              title={product.title}
              detail={product.detail}
              checked={enabled[product.id] ?? false}
              disabled={pending[product.id] ?? false}
              onCheckedChange={(next) => void change(product.id, next)}
              inputProps={{ 'aria-label': `${product.title} 알림` }}
              suffix={
                <Switch.Control size="32" tone="neutral">
                  <Switch.Thumb />
                </Switch.Control>
              }
            />
            {pending[product.id] && (
              <VStack px="x4">
                <Text role="status" textStyle="t3Regular" color="fg.neutralSubtle">
                  변경 중…
                </Text>
              </VStack>
            )}
            {messages[product.id] && (
              <VStack px="x4" width="full">
                <Callout.Root tone={failed[product.id] ? 'critical' : 'positive'} role={failed[product.id] ? 'alert' : 'status'}>
                  <Callout.Content>
                    <Callout.Description>{messages[product.id]}</Callout.Description>
                  </Callout.Content>
                </Callout.Root>
              </VStack>
            )}
          </VStack>
        ))}
      </List>
    </VStack>
  )
}
