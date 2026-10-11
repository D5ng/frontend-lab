import { Callout, HStack, Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { TextField, TextFieldInput } from 'seed-design/ui/text-field'
import type { Coupon } from './api'

export type CouponViewProps = {
  value: string
  checking: boolean
  fieldError: string
  notice: { tone: 'critical' | 'neutral'; text: string } | null
  coupon: Coupon | null
  applied: Coupon | null
  canCheck: boolean
  canApply: boolean
  onChange: (value: string) => void
  onCheck: () => void
  onApply: () => void
}

export function CouponView(props: CouponViewProps) {
  return (
    <VStack as="article" aria-label="쿠폰 확인" p="x4" gap="x6" width="full">
      <VStack gap="x2">
        <Text as="h2" textStyle="t7Bold">
          쿠폰 적용하기
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          코드를 확인한 뒤 할인 쿠폰을 적용해 주세요.
        </Text>
      </VStack>
      <TextField
        label="쿠폰 코드"
        variant="underline"
        value={props.value}
        invalid={!!props.fieldError}
        errorMessage={props.fieldError}
        description="영문 코드의 앞뒤 공백과 대소문자는 구분하지 않아요."
        onValueChange={({ value }) => props.onChange(value)}
      >
        <TextFieldInput placeholder="예: WELCOME" autoCapitalize="characters" autoComplete="off" spellCheck={false} />
      </TextField>
      <ActionButton
        variant="neutralWeak"
        size="large"
        disabled={!props.canCheck}
        loading={props.checking}
        aria-label={props.checking ? '쿠폰 확인 중' : '쿠폰 확인하기'}
        onClick={props.onCheck}
      >
        쿠폰 확인하기
      </ActionButton>
      {props.checking && (
        <Text role="status" textStyle="t4Regular">
          쿠폰을 확인하고 있어요. 코드를 바꾸면 새로 확인해 주세요.
        </Text>
      )}
      {props.notice && (
        <Callout.Root tone={props.notice.tone} role={props.notice.tone === 'critical' ? 'alert' : 'status'}>
          <Callout.Content>
            <Callout.Description>{props.notice.text}</Callout.Description>
          </Callout.Content>
        </Callout.Root>
      )}
      {props.coupon && !props.applied && (
        <VStack gap="x2">
          <Text role="status" textStyle="t5Bold">
            {props.coupon.code} 쿠폰을 확인했어요.
          </Text>
          <HStack justify="space-between">
            <Text textStyle="t4Regular">할인 금액</Text>
            <Text textStyle="t5Bold">{props.coupon.discount.toLocaleString('ko-KR')}원</Text>
          </HStack>
        </VStack>
      )}
      {props.applied && (
        <Callout.Root tone="positive" role="status">
          <Callout.Content>
            <Callout.Description>
              {props.applied.code} 쿠폰으로 {props.applied.discount.toLocaleString('ko-KR')}원 할인을 적용했어요.
            </Callout.Description>
          </Callout.Content>
        </Callout.Root>
      )}
      {!props.coupon && !props.checking && !props.notice && (
        <Text textStyle="t4Regular" color="fg.neutralSubtle">
          먼저 쿠폰 코드를 확인해 주세요.
        </Text>
      )}
      <ActionButton variant="neutralSolid" size="large" disabled={!props.canApply} onClick={props.onApply}>
        할인 적용하기
      </ActionButton>
    </VStack>
  )
}
