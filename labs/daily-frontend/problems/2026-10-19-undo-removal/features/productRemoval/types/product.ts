export interface Product {
  id: string
  title: string
  detail: string
}

export interface RemovalApi {
  remove: (id: string) => Promise<void>
  restore: (id: string) => Promise<void>
}
