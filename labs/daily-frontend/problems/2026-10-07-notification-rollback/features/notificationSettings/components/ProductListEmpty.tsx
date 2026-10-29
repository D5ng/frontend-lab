import { Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'

interface Props {
  query: string
  totalProductCount: number
  saving: boolean
  onQueryChange: (value: string) => void
}

export function ProductListEmpty({ query, totalProductCount, saving, onQueryChange }: Props) {
  return (
    <VStack px="x5" py="x5" gap="x3" align="center" role="status">
      <Text textStyle="t5Bold">{totalProductCount === 0 ? '아직 관심 상품이 없어요' : '찾는 상품이 없어요'}</Text>
      <Text textStyle="t4Regular" color="fg.neutralSubtle">
        {totalProductCount === 0 ? '관심 상품을 추가한 뒤 다시 방문해 주세요.' : '검색어를 바꾸거나 전체 상품을 확인해 보세요.'}
      </Text>
      {query && (
        <ActionButton type="button" variant="neutralWeak" disabled={saving} onClick={() => onQueryChange('')}>
          전체 상품 보기
        </ActionButton>
      )}
    </VStack>
  )
}
