export type SavingsTerm = {
  months: number
  annualRate: number
}

export type SavingsProduct = {
  id: string
  name: string
  minMonthlyAmount: number
  maxMonthlyAmount: number
  terms: SavingsTerm[]
}

export type OpenAccountRequest = {
  productId: string
  monthlyAmount: number
  months: number
}

const BASE = '/api/drills/2026-10-30/savings'

export async function fetchSavingsProduct(): Promise<SavingsProduct> {
  const response = await fetch(new URL(`${BASE}/products/monthly-1`, window.location.origin))
  if (!response.ok) throw new Error('상품 정보를 불러오지 못했어요.')
  return (await response.json()) as SavingsProduct
}

export async function openSavingsAccount(body: OpenAccountRequest): Promise<{ id: string }> {
  const response = await fetch(new URL(`${BASE}/accounts`, window.location.origin), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw new Error('적금에 가입하지 못했어요.')
  return (await response.json()) as { id: string }
}
