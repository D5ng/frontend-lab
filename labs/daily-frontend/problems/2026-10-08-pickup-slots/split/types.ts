export interface Member {
  id: string
  name: string
}
export interface SplitDraft {
  title: string
  amount: string
  method: 'equal' | 'weighted'
  memberIds: string[]
  weights: Record<string, string>
}
export interface SplitResult {
  shares: { memberId: string; name: string; amount: number }[]
  total: number
}
export interface SplitRequest {
  title: string
  totalAmount: number
  method: 'equal' | 'weighted'
  shares: { memberId: string; amount: number }[]
}
export interface SplitApi {
  getMembers: () => Promise<Member[]>
  save: (request: SplitRequest) => Promise<{ id: string }>
}
