export interface Product {
  id: string
  name: string
  price: number
  stock: number
}

export type LoadProducts = () => Promise<Product[]>
