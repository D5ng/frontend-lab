import { Callout, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'

interface Props {
  onRetryProducts: () => void
}

export function ProductListError({ onRetryProducts }: Props) {
  return (
    <VStack px="x5" gap="x3">
      <Callout.Root tone="critical" role="alert">
        <Callout.Content>
          <Callout.Description>상품을 불러오지 못했어요. 다시 시도해 주세요.</Callout.Description>
        </Callout.Content>
      </Callout.Root>
      <ActionButton type="button" variant="neutralWeak" onClick={() => onRetryProducts()}>
        상품 다시 불러오기
      </ActionButton>
    </VStack>
  )
}
