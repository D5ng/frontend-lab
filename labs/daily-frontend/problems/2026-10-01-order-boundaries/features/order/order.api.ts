import { OrderRequest } from './order.model'

// eslint-disable-next-line unused-imports/no-unused-vars
export async function sendDemoOrder(_request: OrderRequest) {
  await new Promise<void>((resolve) => setTimeout(resolve, 600))
}
