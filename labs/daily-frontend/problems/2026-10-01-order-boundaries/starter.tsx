import { useState } from 'react'
import { Badge, Text, TextField } from '@seed-design/react'
import { ActionButton } from '../../src/seed-design/ui/action-button'
import { SelectRoot, SelectTrigger, SelectContent, SelectGroup, SelectItem } from '../../src/seed-design/ui/select'
import { RadioGroup, RadioGroupItem } from '../../src/seed-design/ui/radio-group'
import type { SubmitEvent } from 'react'

export type OrderRequest =
  | { type: 'delivery'; quantity: number; address: string; shippingFee: number; totalPrice: number }
  | { type: 'pickup'; quantity: number; store: string; pickupDate: 'today' | 'tomorrow'; totalPrice: number }

type OrderFormProps = {
  sendOrder?: (request: OrderRequest) => Promise<void>
}

async function sendDemoOrder(_request: OrderRequest) {
  await new Promise<void>((resolve) => setTimeout(resolve, 600))
}

export function OrderForm({ sendOrder = sendDemoOrder }: OrderFormProps) {
  const [type, setType] = useState<'delivery' | 'pickup'>('delivery')
  const [quantity, setQuantity] = useState(1)
  const [address, setAddress] = useState('')
  const [store, setStore] = useState('')
  const [pickupDate, setPickupDate] = useState<'today' | 'tomorrow'>('today')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  function update(field: string, value: string | number) {
    if (field === 'type' && (value === 'delivery' || value === 'pickup')) setType(value)
    if (field === 'quantity' && typeof value === 'number') setQuantity(value)
    if (field === 'address' && typeof value === 'string') setAddress(value)
    if (field === 'store' && typeof value === 'string') setStore(value)
    if (field === 'pickupDate' && (value === 'today' || value === 'tomorrow')) setPickupDate(value)
    setMessage('')
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return
    setMessage('')

    if (type === 'delivery') {
      if (quantity * 6000 < 10000) {
        setMessage('배송 주문은 상품 금액 10,000원부터 가능해요.')
        return
      }
      if (!address.trim()) {
        setMessage('배송 주소를 입력해 주세요.')
        return
      }
    } else {
      if (!store) {
        setMessage('픽업 매장을 선택해 주세요.')
        return
      }
      if (pickupDate === 'today' && quantity > 3) {
        setMessage('오늘 픽업은 3개까지 가능해요. 내일을 선택해 주세요.')
        return
      }
    }

    setIsSubmitting(true)
    try {
      await sendOrder(
        type === 'delivery'
          ? {
              type: 'delivery',
              quantity,
              address: address.trim(),
              shippingFee: quantity * 6000 >= 30000 ? 0 : 3000,
              totalPrice: quantity * 6000 + (quantity * 6000 >= 30000 ? 0 : 3000),
            }
          : { type: 'pickup', quantity, store, pickupDate, totalPrice: quantity * 6000 },
      )
      setMessage(type === 'delivery' ? '배송 주문을 완료했어요.' : '픽업 예약을 완료했어요.')
    } catch {
      setMessage(
        type === 'delivery' ? '배송 주문을 완료하지 못했어요. 다시 시도해 주세요.' : '픽업 예약을 완료하지 못했어요. 다시 시도해 주세요.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="order-boundaries" aria-label="커피 주문">
      <header className="order-heading">
        <Text as="h2" textStyle="t7Bold">
          주문하기
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          받는 방법을 선택하고 주문을 확인해 주세요.
        </Text>
      </header>
      <div className="order-product">
        <div className="coffee-thumbnail" aria-hidden="true">
          <svg viewBox="0 0 96 96" fill="none">
            <rect x="22" y="16" width="52" height="67" rx="6" fill="currentColor" opacity="0.16" />
            <path d="M27 17h42l4 61a4 4 0 0 1-4 4H27a4 4 0 0 1-4-4l4-61Z" fill="currentColor" opacity="0.55" />
            <path d="M28 20h40M28 24h40" stroke="currentColor" strokeWidth="2" />
            <rect x="29" y="36" width="38" height="30" rx="2" fill="var(--seed-color-bg-layer-default)" />
            <path d="M44 44c-5 3-6 10-2 12 5 3 12-5 9-10-2-3-5-3-7-2Z" fill="currentColor" />
            <path d="m44 53 5-6" stroke="var(--seed-color-bg-layer-default)" strokeWidth="1.5" />
            <path d="M38 61h20" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
        <div className="order-product-info">
          <Badge variant="weak" tone="neutral" size="medium">
            드립백
          </Badge>
          <Text as="h3" textStyle="t5Bold">
            드립백 커피 6개입
          </Text>
          <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
            한 상자 6,000원 · 수량 1~5개
          </Text>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <fieldset disabled={isSubmitting}>
          <legend>받는 방법과 수량</legend>
          <RadioGroup
            value={type}
            onValueChange={(value) => update('type', value)}
            disabled={isSubmitting}
            aria-label="받는 방법"
            className="order-methods"
          >
            <RadioGroupItem value="delivery" label="배송" tone="brand" size="large" />
            <RadioGroupItem value="pickup" label="매장 픽업" tone="brand" size="large" />
          </RadioGroup>
          <SelectRoot
            label="수량"
            value={[String(quantity)]}
            onValueChange={(values) => {
              if (values[0]) update('quantity', Number(values[0]))
            }}
            disabled={isSubmitting}
          >
            <SelectTrigger placeholder="수량을 선택해 주세요" />
            <SelectContent>
              <SelectGroup>
                {[1, 2, 3, 4, 5].map((value) => (
                  <SelectItem key={value} value={String(value)} label={`${value}개`} />
                ))}
              </SelectGroup>
            </SelectContent>
          </SelectRoot>
          {type === 'delivery' ? (
            <>
              <label className="order-field">
                <span>배송 주소</span>
                <TextField.Root disabled={isSubmitting}>
                  <TextField.Input
                    aria-label="배송 주소"
                    placeholder="도로명 주소와 상세 주소를 입력해 주세요"
                    value={address}
                    onChange={(event) => update('address', event.target.value)}
                  />
                </TextField.Root>
              </label>
              <p className="order-hint">상품 금액 10,000원부터 주문 · 30,000원부터 무료 배송</p>
            </>
          ) : (
            <>
              <SelectRoot
                label="픽업 매장"
                value={store ? [store] : []}
                onValueChange={(values) => update('store', values[0] ?? '')}
                disabled={isSubmitting}
              >
                <SelectTrigger placeholder="매장을 선택해 주세요" />
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="" label="매장을 선택해 주세요" />
                    <SelectItem value="gangnam" label="강남점" />
                    <SelectItem value="seongsu" label="성수점" />
                  </SelectGroup>
                </SelectContent>
              </SelectRoot>
              <SelectRoot
                label="픽업 날짜"
                value={[pickupDate]}
                onValueChange={(values) => {
                  if (values[0]) update('pickupDate', values[0])
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger placeholder="픽업 날짜를 선택해 주세요" />
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="today" label="오늘" />
                    <SelectItem value="tomorrow" label="내일" />
                  </SelectGroup>
                </SelectContent>
              </SelectRoot>
              <p className="order-hint">픽업은 배송비가 없어요. 오늘은 3개까지 예약할 수 있어요.</p>
            </>
          )}
        </fieldset>
        <div className="order-payment">
          <Text as="h3" textStyle="t5Bold">
            결제 금액
          </Text>
          <dl>
            <dt>상품 금액</dt>
            <dd>{(quantity * 6000).toLocaleString('ko-KR')}원</dd>
            <dt>배송비</dt>
            <dd>{(type === 'delivery' ? (quantity * 6000 >= 30000 ? 0 : 3000) : 0).toLocaleString('ko-KR')}원</dd>
            <dt>결제 예정 금액</dt>
            <dd>{(quantity * 6000 + (type === 'delivery' ? (quantity * 6000 >= 30000 ? 0 : 3000) : 0)).toLocaleString('ko-KR')}원</dd>
          </dl>
        </div>
        <div className="order-action">
          <ActionButton type="submit" variant="brandSolid" size="large" disabled={isSubmitting}>
            {isSubmitting ? '처리 중...' : type === 'delivery' ? '배송 주문하기' : '픽업 예약하기'}
          </ActionButton>
          <p role="status" className="order-feedback">
            {message}
          </p>
        </div>
      </form>
    </section>
  )
}
