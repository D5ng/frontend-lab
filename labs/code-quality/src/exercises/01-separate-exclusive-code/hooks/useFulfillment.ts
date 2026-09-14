import { SubmitEventHandler, useState } from 'react'

type FulfillmentMethod = 'delivery' | 'pickup'

export function useFulfillment() {
  /* 상품 수령 방법 */
  const [fulfillmentMethod, setFulfillmentMethod] = useState<FulfillmentMethod>('delivery')
  /* [배달] 주소 */
  const [address, setAddress] = useState('')
  /* [픽업] 매장 */
  const [store, setStore] = useState('')
  /* 결과 안내 */
  const [resultMessage, setResultMessage] = useState('')

  const onFulfillmentMethodChange = (value: FulfillmentMethod) => {
    setFulfillmentMethod(value)
    setResultMessage('')
  }

  /* 상품 수령 요청 검증 처리 */
  const onSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    if (fulfillmentMethod === 'delivery') {
      if (address.trim().length === 0) {
        setResultMessage('배달 주소를 입력해 주세요.')
        return
      }

      setResultMessage(`${address.trim()} 주소로 배달을 요청했어요.`)
      return
    }

    if (store.trim().length === 0) {
      setResultMessage('픽업 매장을 입력해 주세요.')
      return
    }

    setResultMessage(`${store.trim()} 매장에서 픽업을 요청했어요.`)
  }

  return {
    fulfillmentMethod,
    onFulfillmentMethodChange,
    delivery: {
      address,
      onAddressChange: setAddress,
    },
    pickup: {
      store,
      onStoreChange: setStore,
    },
    resultMessage,
    onSubmit,
  }
}
