export type Category = 'furniture' | 'daily' | 'books'

export type Listing = { id: string; title: string; category: Category; price: number }

export type SearchListings = (categories: Category[]) => Promise<Listing[]>
