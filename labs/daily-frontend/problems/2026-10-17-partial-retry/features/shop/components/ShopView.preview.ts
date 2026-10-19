import type { ShopViewProps } from './ShopView'

type Display = Omit<ShopViewProps, 'onRetryProfile' | 'onRetryReviews'>
const idle: Display = { profile: null, profileBusy: false, profileError: '', reviews: null, reviewsBusy: false, reviewsError: '' }
export const profileSample = {
  name: '성수 작은 도예방',
  neighborhood: '성수동',
  description: '처음이어도 괜찮아요. 작은 그릇을 함께 만들어요.',
}
export const reviewSamples = [{ id: 'r1', author: '동네산책', body: '차근차근 알려주셔서 즐겁게 만들었어요.' }]
// 고정 표시 입력만 제공한다. 비동기 흐름·요청·복구 로직은 없다.
export const previews: Record<string, Display> = {
  idle,
  loading: { ...idle, profileBusy: true, reviewsBusy: true },
  partial: { ...idle, profile: profileSample, reviewsError: '방문 후기를 불러오지 못했어요. 다시 시도해 주세요.' },
  retrying: { ...idle, profile: profileSample, reviewsBusy: true },
  profileError: { ...idle, profileError: '가게 소개를 불러오지 못했어요. 다시 시도해 주세요.', reviews: reviewSamples },
  success: { ...idle, profile: profileSample, reviews: reviewSamples },
  empty: { ...idle, profile: profileSample, reviews: [] },
}
