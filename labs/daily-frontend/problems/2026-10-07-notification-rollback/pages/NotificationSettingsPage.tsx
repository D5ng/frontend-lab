import { IconBellLine, IconCheckmarkFatFill, IconMagnifyingglassLine } from '@karrotmarket/react-monochrome-icon'
import { Badge, Box, Callout, Checkbox, Divider, HStack, Skeleton, Text, VStack } from '@seed-design/react'
import { useEffect, useState } from 'react'
import { ActionButton } from 'seed-design/ui/action-button'
import { List, ListCheckItem } from 'seed-design/ui/list'
import { RadioGroup, RadioGroupItem } from 'seed-design/ui/radio-group'
import { SelectContent, SelectGroup, SelectItem, SelectRoot, SelectTrigger } from 'seed-design/ui/select'
import { TextField, TextFieldInput } from 'seed-design/ui/text-field'
import type { NotificationApi, NotificationPlan, Product } from '../features/notificationSettings/types/notification'
import './NotificationSettingsPage.css'

export function NotificationSettingsPage({ api }: { api: NotificationApi }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [delivery, setDelivery] = useState<'instant' | 'digest'>('instant')
  const [hour, setHour] = useState<'09' | '20'>('09')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [failed, setFailed] = useState(false)
  const [saved, setSaved] = useState<{ titles: string; schedule: string } | null>(null)

  useEffect(() => {
    let cancelled = false
    api.getProducts().then(
      (result) => {
        if (cancelled) return
        setProducts(result)
        setLoading(false)
      },
      () => {
        if (cancelled) return
        setLoadError(true)
        setLoading(false)
      },
    )
    return () => {
      cancelled = true
    }
  }, [api])

  async function retryProducts() {
    if (loading) return
    setLoading(true)
    setLoadError(false)
    try {
      setProducts(await api.getProducts())
    } catch {
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }

  const visibleProducts = products.filter((product) => product.title.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
  const selectedProducts = products.filter((product) => selectedIds.includes(product.id))
  const schedule = delivery === 'instant' ? '가격이 내려가면 바로' : hour === '09' ? '매일 오전 9시에 한 번' : '매일 오후 8시에 한 번'

  async function save() {
    if (saving || loading || loadError || selectedIds.length === 0) return
    setMessage('')
    setSaving(true)
    setFailed(false)
    const plan: NotificationPlan =
      delivery === 'instant'
        ? { productIds: [...selectedIds], delivery: 'instant' }
        : { productIds: [...selectedIds], delivery: 'digest', hour }
    try {
      await api.savePlan(plan)
      setSaved({
        titles: products
          .filter((product) => selectedIds.includes(product.id))
          .map((product) => product.title)
          .join(', '),
        schedule: delivery === 'instant' ? '가격이 내려가면 바로' : hour === '09' ? '매일 오전 9시에 한 번' : '매일 오후 8시에 한 번',
      })
      setMessage('알림 설정을 저장했어요.')
    } catch {
      setFailed(true)
      setMessage('알림을 저장하지 못했어요. 다시 시도해 주세요.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <VStack as="article" className="notification-plan" aria-label="관심 상품 알림 만들기" width="full" gap="x7" py="x6">
      <VStack as="header" gap="x3" px="x5">
        <HStack gap="x2" align="center">
          <Box className="notification-plan__icon" bg="bg.brandWeak" borderRadius="r3" p="x3" aria-hidden="true">
            <IconBellLine width={24} height={24} />
          </Box>
          <Badge variant="weak" tone="brand" size="medium">
            관심 상품 소식
          </Badge>
        </HStack>
        <Text as="h2" textStyle="t8Bold">
          기다리던 가격,
          <br />
          소식으로 받아요
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          관심 있는 상품을 고르고
          <br />
          가격이 내려갈 때 알려드릴게요.
        </Text>
      </VStack>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          void save()
        }}
      >
        <VStack gap="x7" width="full">
          <VStack as="section" aria-label="상품 선택" gap="x4" width="full">
            <VStack px="x5" gap="x4" width="full">
              <HStack justify="space-between" align="center">
                <Text as="h3" textStyle="t5Bold">
                  1. 어떤 상품이 궁금하세요?
                </Text>
                <Text textStyle="t3Bold" color="fg.brand">
                  {selectedIds.length}개 선택
                </Text>
              </HStack>
              <TextField
                label="관심 상품 검색"
                variant="underline"
                value={query}
                disabled={loading || loadError || saving}
                prefixIcon={<IconMagnifyingglassLine />}
                onValueChange={({ value }) => {
                  setQuery(value)
                  setMessage('')
                }}
              >
                <TextFieldInput placeholder="상품 이름으로 찾아보세요" />
              </TextField>
            </VStack>
            {loading ? (
              <VStack px="x5" gap="x3" width="full" role="status" aria-label="관심 상품을 불러오는 중">
                <Skeleton width="full" height="x12" />
                <Skeleton width="full" height="x12" />
                <Text textStyle="t3Regular" color="fg.neutralSubtle">
                  관심 상품을 불러오고 있어요.
                </Text>
              </VStack>
            ) : loadError ? (
              <VStack px="x5" gap="x3">
                <Callout.Root tone="critical" role="alert">
                  <Callout.Content>
                    <Callout.Description>상품을 불러오지 못했어요. 다시 시도해 주세요.</Callout.Description>
                  </Callout.Content>
                </Callout.Root>
                <ActionButton type="button" variant="neutralWeak" onClick={() => void retryProducts()}>
                  상품 다시 불러오기
                </ActionButton>
              </VStack>
            ) : visibleProducts.length === 0 ? (
              <VStack px="x5" py="x5" gap="x3" align="center" role="status">
                <Text textStyle="t5Bold">{products.length === 0 ? '아직 관심 상품이 없어요' : '찾는 상품이 없어요'}</Text>
                <Text textStyle="t4Regular" color="fg.neutralSubtle">
                  {products.length === 0 ? '관심 상품을 추가한 뒤 다시 방문해 주세요.' : '검색어를 바꾸거나 전체 상품을 확인해 보세요.'}
                </Text>
                {query && (
                  <ActionButton
                    type="button"
                    variant="neutralWeak"
                    disabled={saving}
                    onClick={() => {
                      setQuery('')
                      setMessage('')
                    }}
                  >
                    전체 상품 보기
                  </ActionButton>
                )}
              </VStack>
            ) : (
              <List as="div" width="full" aria-label="관심 상품 목록">
                {visibleProducts.map((product) => (
                  <ListCheckItem
                    key={product.id}
                    title={product.title}
                    detail={
                      <VStack gap="x1" py="x1">
                        <Text textStyle="t3Regular" color="fg.neutralSubtle">
                          {product.neighborhood}
                          {!product.available && ' · 거래완료'}
                        </Text>
                        <Text textStyle="t4Bold">{product.price.toLocaleString('ko-KR')}원</Text>
                      </VStack>
                    }
                    checked={selectedIds.includes(product.id)}
                    disabled={!product.available || saving}
                    inputProps={{ 'aria-label': `${product.title} 알림 선택` }}
                    onCheckedChange={(checked) => {
                      setSelectedIds((ids) => (checked ? [...ids, product.id] : ids.filter((id) => id !== product.id)))
                      setMessage('')
                    }}
                    suffix={
                      <Checkbox.Control size="large" tone="brand">
                        <Checkbox.Indicator checked={<IconCheckmarkFatFill />} />
                      </Checkbox.Control>
                    }
                  />
                ))}
              </List>
            )}
            <Box px="x5">
              <Text as="p" textStyle="t3Regular" color="fg.neutralSubtle">
                검색 결과가 바뀌어도 고른 상품은 유지돼요. 거래완료 상품은 선택할 수 없어요.
              </Text>
            </Box>
          </VStack>
          <Divider />
          <VStack as="section" aria-label="알림 방식 설정" gap="x4" px="x5" width="full">
            <Text as="h3" textStyle="t5Bold">
              2. 언제 알려드릴까요?
            </Text>
            <RadioGroup
              label="받는 방식"
              value={delivery}
              disabled={loading || loadError || saving}
              onValueChange={(value) => {
                if (value === 'instant' || value === 'digest') {
                  setDelivery(value)
                  setMessage('')
                }
              }}
            >
              <RadioGroupItem value="instant" label="가격이 내려가면 바로 받기" size="large" tone="brand" />
              <RadioGroupItem value="digest" label="하루 한 번 모아 받기" size="large" tone="brand" />
            </RadioGroup>
            {delivery === 'digest' && (
              <SelectRoot
                label="받을 시간"
                value={[hour]}
                disabled={saving || loading || loadError}
                onValueChange={(values) => {
                  const value = values[0]
                  if (value === '09' || value === '20') {
                    setHour(value)
                    setMessage('')
                  }
                }}
              >
                <SelectTrigger />
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="09" label="오전 9시" />
                    <SelectItem value="20" label="오후 8시" />
                  </SelectGroup>
                </SelectContent>
              </SelectRoot>
            )}
          </VStack>
          <VStack px="x5" gap="x4" width="full">
            <VStack as="section" aria-label="저장할 알림 요약" bg="bg.neutralWeak" borderRadius="r4" p="x5" gap="x3" width="full">
              <Text as="h3" textStyle="t5Bold">
                이렇게 알려드릴게요
              </Text>
              <Text textStyle="t4Regular">
                {selectedProducts.length === 0
                  ? '알림 받을 상품을 선택해 주세요.'
                  : selectedProducts.map((product) => product.title).join(', ')}
              </Text>
              <HStack justify="space-between" align="center" gap="x3">
                <Text textStyle="t3Regular" color="fg.neutralSubtle">
                  관심 상품 {selectedProducts.length}개
                </Text>
                <Text textStyle="t3Bold">{schedule}</Text>
              </HStack>
            </VStack>
            {message && (
              <Callout.Root tone={failed ? 'critical' : 'positive'} role={failed ? 'alert' : 'status'}>
                <Callout.Content>
                  <Callout.Description>{message}</Callout.Description>
                </Callout.Content>
              </Callout.Root>
            )}
            <ActionButton
              type="submit"
              variant="brandSolid"
              size="large"
              aria-label={saving ? '알림 저장 중' : '알림 설정 저장하기'}
              loading={saving}
              disabled={loading || loadError || selectedIds.length === 0 || saving}
            >
              {saving ? '알림 저장 중' : '알림 설정 저장하기'}
            </ActionButton>
            <Text textStyle="t3Regular" color="fg.neutralSubtle" align="center">
              실습용 설정이에요. 실제 알림은 발송하지 않아요.
            </Text>
          </VStack>
        </VStack>
      </form>
      {saved && (
        <VStack as="section" aria-label="마지막으로 저장한 알림" px="x5" gap="x2">
          <Text as="h3" textStyle="t4Bold">
            마지막으로 저장한 알림
          </Text>
          <Text textStyle="t3Regular" color="fg.neutralSubtle">
            {saved.titles}
          </Text>
          <Text textStyle="t3Regular" color="fg.neutralSubtle">
            {saved.schedule}
          </Text>
        </VStack>
      )}
    </VStack>
  )
}
