import { OrderPayment } from './OrderPayment'
import { OrderAction } from './OrderAction'
import { OrderProduct, OrderRequest } from '../order.model'
import { useOrderForm } from '../useOrderForm'
import { RadioGroup, RadioGroupItem } from 'seed-design/ui/radio-group'
import { SelectContent, SelectGroup, SelectItem, SelectRoot, SelectTrigger } from 'seed-design/ui/select'
import { TextField } from '@seed-design/react'

interface Props {
  product: OrderProduct
  sendOrder: (request: OrderRequest) => Promise<void>
}

export function OrderForm({ product, sendOrder }: Props) {
  const {
    orderData: { type, quantity, address, store, pickupDate },
    amounts: { shippingFee, subtotalPrice, totalPrice },
    isSubmitting,
    message,
    update,
    handleSubmit,
  } = useOrderForm(product, sendOrder)

  return (
    <form onSubmit={handleSubmit}>
      <fieldset disabled={isSubmitting}>
        <legend>받는 방법과 수량</legend>
        <RadioGroup
          value={type}
          onValueChange={(value) => {
            if (value === 'delivery' || value === 'pickup') {
              update('type', value)
            }
          }}
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
              {Array.from({ length: product.maxOrderQuantity })
                .map((_, index) => index + 1)
                .map((value) => (
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
                if (values[0] === 'today' || values[0] === 'tomorrow') {
                  update('pickupDate', values[0])
                }
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

      <OrderPayment totalPrice={totalPrice} shippingFee={shippingFee} subtotalPrice={subtotalPrice} />

      <OrderAction type={type} isSubmitting={isSubmitting} message={message} />
    </form>
  )
}
