import { IconCheckmarkFatFill } from '@karrotmarket/react-monochrome-icon'
import { Callout, Checkbox, Text, VStack } from '@seed-design/react'
import { useState } from 'react'
import { ActionButton } from 'seed-design/ui/action-button'
import { List, ListCheckItem } from 'seed-design/ui/list'
import { initialProducts, type ArchiveProducts } from './api'

export function ArchiveForm({ archiveProducts }: { archiveProducts: ArchiveProducts }) {
  const [products, setProducts] = useState(initialProducts)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')
  const [failed, setFailed] = useState(false)

  async function submit() {
    if (pending || selectedIds.length === 0) return
    setPending(true)
    setMessage('')
    setFailed(false)
    try {
      const result = await archiveProducts([...selectedIds])
      setProducts((previous) => previous.filter((product) => !result.succeededIds.includes(product.id)))
      setSelectedIds(result.failedIds)
      if (result.failedIds.length === 0) {
        setFailed(false)
        setMessage(`${result.succeededIds.length}개를 보관했어요.`)
      } else if (result.succeededIds.length === 0) {
        setFailed(true)
        setMessage('보관하지 못했어요. 선택한 상품을 다시 시도해 주세요.')
      } else {
        setFailed(true)
        setMessage(`${result.succeededIds.length}개를 보관했어요. ${result.failedIds.length}개는 다시 시도해 주세요.`)
      }
    } catch {
      setFailed(true)
      setMessage('요청을 완료하지 못했어요. 선택은 그대로예요. 다시 시도해 주세요.')
    } finally {
      setPending(false)
    }
  }

  return (
    <VStack as="article" gap="x6" px="x4" py="x6" width="full" aria-labelledby="archive-heading">
      <VStack as="header" gap="x2">
        <Text as="h2" id="archive-heading" textStyle="t7Bold">
          관심 상품 정리
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          다 본 상품을 골라 보관해 주세요. 보관한 상품은 이 목록에서 빠져요.
        </Text>
      </VStack>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          void submit()
        }}
      >
        <VStack gap="x5" width="full">
          <Text as="h3" id="archive-products" textStyle="t5Bold">
            남은 상품 {products.length}개
          </Text>
          {products.length > 0 ? (
            <List as="div" role="group" aria-labelledby="archive-products" width="full">
              {products.map((product) => (
                <ListCheckItem
                  key={product.id}
                  title={product.title}
                  detail={product.detail}
                  inputProps={{ 'aria-label': product.title }}
                  checked={selectedIds.includes(product.id)}
                  disabled={pending}
                  onCheckedChange={(checked) => {
                    setSelectedIds((previous) => (checked ? [...previous, product.id] : previous.filter((id) => id !== product.id)))
                    setMessage('')
                    setFailed(false)
                  }}
                  suffix={
                    <Checkbox.Control variant="ghost" size="large" tone="neutral">
                      <Checkbox.Indicator checked={<IconCheckmarkFatFill />} unchecked={<IconCheckmarkFatFill />} />
                    </Checkbox.Control>
                  }
                />
              ))}
            </List>
          ) : (
            <Text as="p" textStyle="t4Regular">
              모든 상품을 정리했어요. 더 보관할 상품이 없어요.
            </Text>
          )}
          <Text as="p" textStyle="t5Bold" aria-live="polite">
            선택 {selectedIds.length}개
          </Text>
          {message && (
            <Callout.Root tone={failed ? 'critical' : 'positive'} role={failed ? 'alert' : 'status'}>
              <Callout.Content>
                <Callout.Description>{message}</Callout.Description>
              </Callout.Content>
            </Callout.Root>
          )}
          <ActionButton type="submit" variant="neutralSolid" size="large" loading={pending} disabled={pending || selectedIds.length === 0}>
            {pending ? '보관 중' : '선택한 상품 보관'}
          </ActionButton>
          <Text as="p" textStyle="t3Regular" color="fg.neutralSubtle">
            {pending
              ? '선택한 상품을 보관하고 있어요. 잠시 기다려 주세요.'
              : selectedIds.length === 0
                ? '보관할 상품을 선택해 주세요.'
                : '일부만 실패하면 실패한 상품만 선택된 채로 남아요.'}
          </Text>
        </VStack>
      </form>
    </VStack>
  )
}
