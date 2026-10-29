import { Callout, HStack, Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { formatProductTitles, NOTICE_BY_RESULT } from '../models/product'
import type { NotificationSaveResult, Product } from '../types/notification'

interface Props {
  schedule: string
  selectedProducts: Product[]
  saving: boolean
  saveResult: NotificationSaveResult | null
  disabled: boolean
}

export function NotificationSettings({ schedule, selectedProducts, saving, saveResult, disabled }: Props) {
  return (
    <VStack px="x5" gap="x4" width="full">
      <VStack as="section" aria-label="저장할 알림 요약" bg="bg.neutralWeak" borderRadius="r4" p="x5" gap="x3" width="full">
        <Text as="h3" textStyle="t5Bold">
          이렇게 알려드릴게요
        </Text>
        <Text textStyle="t4Regular">
          {selectedProducts.length === 0 ? '알림 받을 상품을 선택해 주세요.' : formatProductTitles(selectedProducts)}
        </Text>
        <HStack justify="space-between" align="center" gap="x3">
          <Text textStyle="t3Regular" color="fg.neutralSubtle">
            관심 상품 {selectedProducts.length}개
          </Text>
          <Text textStyle="t3Bold">{schedule}</Text>
        </HStack>
      </VStack>
      {saveResult !== null && (
        <Callout.Root tone={NOTICE_BY_RESULT[saveResult].tone} role={NOTICE_BY_RESULT[saveResult].role}>
          <Callout.Content>
            <Callout.Description>{NOTICE_BY_RESULT[saveResult].message}</Callout.Description>
          </Callout.Content>
        </Callout.Root>
      )}
      <ActionButton
        type="submit"
        variant="brandSolid"
        size="large"
        aria-label={saving ? '알림 저장 중' : '알림 설정 저장하기'}
        loading={saving}
        disabled={disabled || selectedProducts.length === 0}
      >
        {saving ? '알림 저장 중' : '알림 설정 저장하기'}
      </ActionButton>
      <Text textStyle="t3Regular" color="fg.neutralSubtle" align="center">
        실습용 설정이에요. 실제 알림은 발송하지 않아요.
      </Text>
    </VStack>
  )
}
