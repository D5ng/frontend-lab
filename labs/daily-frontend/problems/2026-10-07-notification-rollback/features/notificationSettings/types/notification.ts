export interface Product {
  id: string
  title: string
  neighborhood: string
  price: number
  available: boolean
}

export type NotificationPlan = { productIds: string[]; delivery: 'instant' } | { productIds: string[]; delivery: 'digest'; hour: Hour }

export interface NotificationApi {
  getProducts: () => Promise<Product[]>
  savePlan: (plan: NotificationPlan) => Promise<{ id: string }>
}

export type NotificationSaveResult = 'success' | 'failed'

export type NoticeResult = {
  tone: 'positive' | 'critical'
  role: 'status' | 'alert'
  message: string
}

export type Delivery = 'instant' | 'digest'

export type Hour = '09' | '20'
