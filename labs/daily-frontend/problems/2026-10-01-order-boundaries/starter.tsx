import { DUMMY_ORDER_PRODUCT, OrderProduct, OrderRequest } from './features/order/order.model'
import { sendDemoOrder } from './features/order/order.api'
import { OrderHeading } from './features/order/components/OrderHeading'
import { OrderProductSummary } from './features/order/components/OrderProductSummary'
import { OrderForm } from './features/order/components/OrderForm'

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
