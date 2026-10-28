export interface Product {
  id: string
  title: string
  neighborhood: string
  price: number
  available: boolean
}

export type NotificationPlan =
  { productIds: string[]; delivery: 'instant' } | { productIds: string[]; delivery: 'digest'; hour: '09' | '20' }

export interface NotificationApi {
  getProducts: () => Promise<Product[]>
  savePlan: (plan: NotificationPlan) => Promise<{ id: string }>
}
