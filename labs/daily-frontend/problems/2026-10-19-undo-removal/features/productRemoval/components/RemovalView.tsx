import { Callout, Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { List, ListItem } from 'seed-design/ui/list'
import type { Product } from '../types/product'

export interface RemovalViewProps {
  items: Product[]
  undoItem: Product | null
  removingId: string | null
  restoring: boolean
  message: string
  error: string
  onRemove: (id: string) => void
  onUndo: () => void
}

// 표현만 제공합니다. 이 props마다 별도 상태 하나가 필요한 것은 아닙니다.
export function RemovalView({ items, undoItem, removingId, restoring, message, error, onRemove, onUndo }: RemovalViewProps) {
  const busy = removingId !== null || restoring
  return (
    <VStack as="article" gap="x6" px="x4" py="x6" width="full" aria-labelledby="removal-heading">
      <VStack as="header" gap="x2">
        <Text as="h2" id="removal-heading" textStyle="t7Bold">
          관심 상품 정리
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          다 본 상품을 목록에서 빼 주세요. 마지막으로 뺀 상품 한 개는 되돌릴 수 있어요.
        </Text>
      </VStack>
      <VStack gap="x3" width="full">
        <Text as="h3" id="remaining-heading" textStyle="t5Bold">
          남은 상품 {items.length}개
        </Text>
        {items.length ? (
          <List as="ul" aria-labelledby="remaining-heading" width="full">
            {items.map((item) => (
              <ListItem
                key={item.id}
                title={item.title}
                detail={item.detail}
                suffix={
                  <ActionButton
                    variant="neutralWeak"
                    size="large"
                    disabled={busy}
                    loading={removingId === item.id}
                    aria-label={`${item.title} 목록에서 빼기`}
                    onClick={() => onRemove(item.id)}
                  >
                    빼기
                  </ActionButton>
                }
              />
            ))}
          </List>
        ) : (
          <Text as="p" textStyle="t4Regular">
            관심 상품을 모두 정리했어요.
          </Text>
        )}
      </VStack>
      {busy && (
        <Text as="p" role="status" textStyle="t4Regular">
          {restoring ? '상품을 되돌리고 있어요.' : '상품을 목록에서 빼고 있어요.'}
        </Text>
      )}
      {error ? (
        <Callout.Root tone="critical" role="alert">
          <Callout.Content>
            <Callout.Description>{error}</Callout.Description>
          </Callout.Content>
        </Callout.Root>
      ) : (
        message && (
          <Callout.Root tone="positive" role="status">
            <Callout.Content>
              <Callout.Description>{message}</Callout.Description>
            </Callout.Content>
          </Callout.Root>
        )
      )}
      {undoItem && (
        <VStack as="section" gap="x3" aria-label="되돌릴 상품">
          <Text as="p" textStyle="t4Bold">
            되돌릴 상품: {undoItem.title}
          </Text>
          <ActionButton variant="neutralWeak" size="large" disabled={busy} loading={restoring} onClick={onUndo}>
            마지막 상품 되돌리기
          </ActionButton>
        </VStack>
      )}
      <Text as="p" textStyle="t3Regular" color="fg.neutralSubtle">
        {busy ? '처리가 끝나면 다른 상품도 정리할 수 있어요.' : '다른 상품을 빼면 되돌릴 수 있는 상품이 바뀌어요.'}
      </Text>
    </VStack>
  )
}
