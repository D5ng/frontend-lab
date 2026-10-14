import { useId, useState } from 'react'
import { Callout, Checkbox, Text, VStack } from '@seed-design/react'
import { IconCheckmarkFatFill } from '@karrotmarket/react-monochrome-icon'
import { ActionButton } from 'seed-design/ui/action-button'
import { List, ListCheckItem, ListItem } from 'seed-design/ui/list'
import { categories, createListingsApi, initialListings, type Category, type SearchListings } from './api'

export function Problem({ searchListings }: { searchListings?: SearchListings }) {
  const [api] = useState(() => searchListings ?? createListingsApi())
  const id = useId()
  const [draftCategories, setDraftCategories] = useState<Category[]>(['furniture', 'daily', 'books'])
  const [appliedCategories, setAppliedCategories] = useState<Category[]>(['furniture', 'daily', 'books'])
  const [listings, setListings] = useState(initialListings)
  const [isApplying, setIsApplying] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const hasChanges = categories.some(({ value }) => draftCategories.includes(value) !== appliedCategories.includes(value))

  async function apply() {
    if (isApplying || !hasChanges) return
    if (draftCategories.length === 0) {
      setError('카테고리를 하나 이상 선택해 주세요.')
      setSuccess('')
      return
    }
    const requestedCategories = categories.filter(({ value }) => draftCategories.includes(value)).map(({ value }) => value)
    setIsApplying(true)
    setError('')
    setSuccess('')
    try {
      const result = await api(requestedCategories)
      setAppliedCategories(requestedCategories)
      setListings(result)
      setSuccess('선택한 조건으로 목록을 바꿨어요.')
    } catch {
      setError('목록을 바꾸지 못했어요. 선택을 확인하고 다시 적용해 주세요.')
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <VStack as="article" gap="x6" px="x4" py="x6">
      <VStack as="header" gap="x2">
        <Text as="h2" textStyle="t7Bold">
          관심 물건 둘러보기
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          카테고리를 고른 뒤 목록에 적용해 주세요.
        </Text>
      </VStack>
      <VStack as="section" aria-labelledby={`${id}-filter`} gap="x2">
        <Text as="h3" id={`${id}-filter`} textStyle="t5Bold">
          관심 카테고리
        </Text>
        <Text as="p" id={`${id}-help`} textStyle="t3Regular" color="fg.neutralSubtle">
          불러오는 중에도 다음 조건을 고를 수 있어요.
        </Text>
        <List as="div" role="group" aria-labelledby={`${id}-filter`} aria-describedby={`${id}-help`}>
          {categories.map(({ value, label }) => (
            <ListCheckItem
              key={value}
              title={label}
              checked={draftCategories.includes(value)}
              inputProps={{ 'aria-label': label }}
              onCheckedChange={(checked) => {
                setDraftCategories((current) => (checked ? [...current, value] : current.filter((category) => category !== value)))
                setError('')
                setSuccess('')
              }}
              suffix={
                <Checkbox.Control variant="ghost" size="large" tone="neutral">
                  <Checkbox.Indicator unchecked={<IconCheckmarkFatFill />} checked={<IconCheckmarkFatFill />} />
                </Checkbox.Control>
              }
            />
          ))}
        </List>
        <Text as="p" textStyle="t3Regular" color="fg.neutralSubtle">
          선택 중:{' '}
          {categories
            .filter(({ value }) => draftCategories.includes(value))
            .map(({ label }) => label)
            .join(', ') || '없음'}
        </Text>
        <ActionButton
          type="button"
          size="large"
          variant="neutralSolid"
          loading={isApplying}
          disabled={isApplying || !hasChanges}
          onClick={apply}
        >
          {isApplying ? '목록 불러오는 중' : '선택한 조건 적용'}
        </ActionButton>
        {!hasChanges && !isApplying && (
          <Text as="p" textStyle="t3Regular" color="fg.neutralSubtle">
            현재 목록에 적용된 조건이에요.
          </Text>
        )}
        {isApplying && (
          <Text as="p" role="status" textStyle="t3Regular">
            불러오는 동안 기존 목록을 보여드려요.
          </Text>
        )}
        {error && (
          <Callout.Root tone="critical" role="alert">
            <Callout.Content>
              <Callout.Description>{error}</Callout.Description>
            </Callout.Content>
          </Callout.Root>
        )}
        {success && (
          <Callout.Root tone="positive" role="status">
            <Callout.Content>
              <Callout.Description>{success}</Callout.Description>
            </Callout.Content>
          </Callout.Root>
        )}
      </VStack>
      <VStack as="section" aria-labelledby={`${id}-results`} gap="x2" aria-busy={isApplying}>
        <Text as="h3" id={`${id}-results`} textStyle="t5Bold">
          동네 물건 · {listings.length}개
        </Text>
        <Text as="p" textStyle="t3Regular" color="fg.neutralSubtle">
          적용된 조건:{' '}
          {categories
            .filter(({ value }) => appliedCategories.includes(value))
            .map(({ label }) => label)
            .join(', ')}
        </Text>
        {listings.length > 0 ? (
          <List aria-label="동네 물건">
            {listings.map((item) => (
              <ListItem
                key={item.id}
                title={item.title}
                detail={`${item.price.toLocaleString('ko-KR')}원 · ${categories.find(({ value }) => value === item.category)?.label}`}
              />
            ))}
          </List>
        ) : (
          <Callout.Root tone="neutral">
            <Callout.Content>
              <Callout.Description>아직 등록된 물건이 없어요. 다른 카테고리를 골라 적용해 보세요.</Callout.Description>
            </Callout.Content>
          </Callout.Root>
        )}
      </VStack>
    </VStack>
  )
}
