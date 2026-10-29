import { Text, VStack } from '@seed-design/react'
import { RadioGroup, RadioGroupItem } from 'seed-design/ui/radio-group'
import { SelectContent, SelectGroup, SelectItem, SelectRoot, SelectTrigger } from 'seed-design/ui/select'
import { isDelivery, isHour } from '../models/product'
import type { Delivery, Hour } from '../types/notification'

interface Props {
  delivery: Delivery
  hour: Hour
  disabled: boolean
  onHourChange: (value: Hour) => void
  onDeliveryChange: (value: Delivery) => void
}

export function DeliverySettings({ delivery, hour, disabled, onDeliveryChange, onHourChange }: Props) {
  return (
    <VStack as="section" aria-label="알림 방식 설정" gap="x4" px="x5" width="full">
      <Text as="h3" textStyle="t5Bold">
        2. 언제 알려드릴까요?
      </Text>
      <RadioGroup
        label="받는 방식"
        value={delivery}
        disabled={disabled}
        onValueChange={(value) => {
          if (isDelivery(value)) {
            onDeliveryChange(value)
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
          disabled={disabled}
          onValueChange={(values) => {
            const value = values[0]
            if (isHour(value)) {
              onHourChange(value)
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
  )
}
