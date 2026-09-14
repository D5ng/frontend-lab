import { SubmitEvent, useState } from 'react'
import { TextField } from './components/TextField'
import { RadioField } from './components/RadioField'

type FulfillmentMethod = 'delivery' | 'pickup'

export function Problem() {
  const [fulfillmentMethod, setFulfillmentMethod] = useState<FulfillmentMethod>('delivery')
  const [address, setAddress] = useState('')
  const [pickupStore, setPickupStore] = useState('')
  const [resultMessage, setResultMessage] = useState('')

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    if (fulfillmentMethod === 'delivery') {
      if (address.trim().length === 0) {
        setResultMessage('배달 주소를 입력해 주세요.')
        return
      }

      setResultMessage(`${address.trim()} 주소로 배달을 요청했어요.`)
      return
    }

    if (pickupStore.trim().length === 0) {
      setResultMessage('픽업 매장을 입력해 주세요.')
      return
    }

    setResultMessage(`${pickupStore.trim()} 매장에서 픽업을 요청했어요.`)
  }

  return (
    <section className="exercise-card" aria-labelledby="request-title">
      <div className="exercise-copy">
        <p className="step-label">Starter code</p>
        <h2 id="request-title">상품 수령 방법</h2>
        <p>현재 컴포넌트는 배달과 픽업의 입력, 검증, 결과 생성을 모두 알고 있습니다.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>수령 방법을 선택해 주세요.</legend>

          <RadioField
            name="fulfillmentMethod"
            value="delivery"
            checked={fulfillmentMethod === 'delivery'}
            onValueChange={(value) => {
              setFulfillmentMethod(value as FulfillmentMethod)
              setResultMessage('')
            }}
          >
            배달
          </RadioField>

          <RadioField
            name="fulfillmentMethod"
            value="pickup"
            checked={fulfillmentMethod === 'pickup'}
            onValueChange={(value) => {
              setFulfillmentMethod(value as FulfillmentMethod)
              setResultMessage('')
            }}
          >
            매장 픽업
          </RadioField>
        </fieldset>

        {fulfillmentMethod === 'delivery' ? (
          <TextField
            name="address"
            onChange={(event) => setAddress(event.target.value)}
            placeholder="예: 서울시 강남구 테헤란로 1"
            value={address}
          >
            배달 주소
          </TextField>
        ) : (
          <TextField
            name="pickupStore"
            onChange={(event) => setPickupStore(event.target.value)}
            placeholder="예: 역삼점"
            value={pickupStore}
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
