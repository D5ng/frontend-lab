import { Divider, Text, VStack } from '@seed-design/react'
import { useState } from 'react'
import { DeliverySettings } from '../features/notificationSettings/components/DeliverySettings'
import { NotificationHeading } from '../features/notificationSettings/components/NotificationHeading'
import { NotificationSettings } from '../features/notificationSettings/components/NotificationSettings'
import { ProductSelection } from '../features/notificationSettings/components/ProductSelection'
import { useProducts } from '../features/notificationSettings/hooks/useProducts'
import {
  formatProductTitles,
  getScheduleLabel,
  getSelectedProduct,
  getVisibleProducts,
} from '../features/notificationSettings/models/product'
import type {
  Delivery,
  Hour,
  NotificationApi,
  NotificationPlan,
  NotificationSaveResult,
  Product,
} from '../features/notificationSettings/types/notification'
import './NotificationSettingsPage.css'

export function NotificationSettingsPage({ api }: { api: NotificationApi }) {
  // 상품 탐색과, 선택을 하나의 훅으로 묶는게 나아보이는데 ..?
  const { products, loading, hasError: loadError, retryProducts } = useProducts({ api })

  const [query, setQuery] = useState('')
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])

  const [delivery, setDelivery] = useState<Delivery>('instant')
  const [hour, setHour] = useState<Hour>('09')
  const [saving, setSaving] = useState(false)

  const [saveResult, setSaveResult] = useState<NotificationSaveResult | null>(null)

  const [saved, setSaved] = useState<{ titles: string; schedule: string } | null>(null)

  const clearSaveNotice = () => {
    setSaveResult(null)
  }

  const handleQueryChange = (value: string) => {
    setQuery(value)
    clearSaveNotice()
  }

  const handleSelectionChange = (selected: boolean, productId: Product['id']) => {
    setSelectedProductIds((prevProductIds) => (selected ? [...prevProductIds, productId] : prevProductIds.filter((id) => id !== productId)))
    clearSaveNotice()
  }

  const handleDeliveryChange = (value: Delivery) => {
    setDelivery(value)
    clearSaveNotice()
  }

  const handleHourChange = (value: Hour) => {
    setHour(value)
    clearSaveNotice()
  }

  const visibleProducts = getVisibleProducts(products, query)
  const selectedProducts = getSelectedProduct(products, selectedProductIds)

  const disabled = loading || loadError || saving

  const schedule = getScheduleLabel(delivery, hour)

  async function save() {
    if (disabled || selectedProductIds.length === 0) {
      return
    }

    setSaveResult(null)
    setSaving(true)

    const plan: NotificationPlan =
      delivery === 'instant'
        ? { productIds: [...selectedProductIds], delivery: 'instant' }
        : { productIds: [...selectedProductIds], delivery: 'digest', hour }
    try {
      await api.savePlan(plan)
      setSaved({
        titles: formatProductTitles(selectedProducts),
        schedule,
      })
      setSaveResult('success')
    } catch {
      setSaveResult('failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <VStack as="article" className="notification-plan" aria-label="관심 상품 알림 만들기" width="full" gap="x7" py="x6">
      <NotificationHeading />
      <form
        onSubmit={(event) => {
          event.preventDefault()
          void save()
        }}
      >
        <VStack gap="x7" width="full">
          <ProductSelection
            visibleProducts={visibleProducts}
            totalProductCount={products.length}
            selectedProductIds={selectedProductIds}
            query={query}
            loading={loading}
            loadError={loadError}
            disabled={disabled}
            saving={saving}
            onQueryChange={handleQueryChange}
            onRetryProducts={retryProducts}
            onSelectionChange={handleSelectionChange}
          />

          <Divider />

          <DeliverySettings
            delivery={delivery}
            hour={hour}
            disabled={disabled}
            onHourChange={handleHourChange}
            onDeliveryChange={handleDeliveryChange}
          />

          <NotificationSettings
            schedule={schedule}
            selectedProducts={selectedProducts}
            saving={saving}
            saveResult={saveResult}
            disabled={disabled}
          />
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
