import { listings } from '../apis/listings'

export type ListingId = (typeof listings)[number]['id']

export type ListingDetail = { id: ListingId; price: number; description: string; neighborhood: string }

// null은 정상 응답(거래 종료)이며 실패나 미조회와 다르다.
export type LoadDetail = (id: ListingId) => Promise<ListingDetail | null>
