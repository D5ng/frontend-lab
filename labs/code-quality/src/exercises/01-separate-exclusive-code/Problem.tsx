import { TextField } from './components/TextField'
import { RadioField } from './components/RadioField'
import { useFulfillment } from './hooks/useFulfillment'

export function Problem() {
  const { fulfillmentMethod, onFulfillmentMethodChange, delivery, pickup, onSubmit, resultMessage } = useFulfillment()

  return (
    <section className="exercise-card" aria-labelledby="request-title">
      <div className="exercise-copy">
        <p className="step-label">Starter code</p>
        <h2 id="request-title">상품 수령 방법</h2>
        <p>현재 컴포넌트는 배달과 픽업의 입력, 검증, 결과 생성을 모두 알고 있습니다.</p>
      </div>

      <form onSubmit={onSubmit}>
        <fieldset>
          <legend>수령 방법을 선택해 주세요.</legend>

          <RadioField
            name="fulfillmentMethod"
            value="delivery"
            checked={fulfillmentMethod === 'delivery'}
            onCheck={() => onFulfillmentMethodChange('delivery')}
          >
            배달
          </RadioField>

          <RadioField
            name="fulfillmentMethod"
            value="pickup"
            checked={fulfillmentMethod === 'pickup'}
            onCheck={() => onFulfillmentMethodChange('pickup')}
          >
            매장 픽업
          </RadioField>
        </fieldset>

        {fulfillmentMethod === 'delivery' ? (
          <TextField
            name="address"
            onChange={(event) => delivery.onAddressChange(event.target.value)}
            placeholder="예: 서울시 강남구 테헤란로 1"
            value={delivery.address}
          >
            배달 주소
          </TextField>
        ) : (
          <TextField
            name="pickupStore"
            onChange={(event) => pickup.onStoreChange(event.target.value)}
            placeholder="예: 역삼점"
            value={pickup.store}
          >
            픽업 매장
          </TextField>
        )}

        <button type="submit">요청하기</button>
      </form>

      <p aria-live="polite" className="result-message">
        {resultMessage}
      </p>
    </section>
  )
}
