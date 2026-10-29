import { OrderForm } from './features/order/components/OrderForm'
import { OrderHeading } from './features/order/components/OrderHeading'
import { OrderProductSummary } from './features/order/components/OrderProductSummary'
import { sendDemoOrder } from './features/order/order.api'
import { DUMMY_ORDER_PRODUCT, type OrderProduct, type OrderRequest } from './features/order/order.model'

interface Props {
  product?: OrderProduct
  sendOrder?: (request: OrderRequest) => Promise<void>
}

export function OrderPage({ product = DUMMY_ORDER_PRODUCT, sendOrder = sendDemoOrder }: Props) {
  return (
    <section className="order-boundaries" aria-label="커피 주문">
      <OrderHeading />
      <OrderProductSummary product={product} />
      <OrderForm product={product} sendOrder={sendOrder} />
    </section>
  )
}
