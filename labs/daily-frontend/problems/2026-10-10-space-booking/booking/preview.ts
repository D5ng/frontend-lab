import { spaces } from './data'
import type { SpaceBookingViewProps } from './SpaceBookingView'
export const bookingStarter: SpaceBookingViewProps = {
  draft: { day: 'today', start: '10', duration: '2', guests: '3', projector: false, spaceId: '' },
  spaces: [],
  quote: null,
  loading: false,
  reserving: false,
  error: '',
  success: '',
  starter: true,
  onChange: () => {},
  onReload: () => {},
  onReserve: () => {},
}
const selected: SpaceBookingViewProps = {
  ...bookingStarter,
  starter: false,
  preview: true,
  spaces: [spaces[0]!],
  draft: { day: 'today', start: '10', duration: '2', guests: '3', projector: true, spaceId: 'studio' },
  quote: { spaceName: '햇살 스튜디오', base: 38000, equipment: 3000, total: 41000, timeLabel: '오늘 10:00–12:00 · 3명' },
}
// 고정 UI 데이터일 뿐 후보 필터·가격 계산·요청 처리의 구현이 아니다.
export const bookingPreviews: Record<string, SpaceBookingViewProps> = {
  ready: { ...selected, quote: null, draft: { ...selected.draft, spaceId: '' } },
  selected,
  loading: { ...selected, spaces: [], quote: null, loading: true },
  empty: { ...selected, spaces: [], quote: null, draft: { ...selected.draft, spaceId: '' } },
  error: { ...selected, spaces: [], quote: null, error: '공간을 불러오지 못했어요. 다시 시도해 주세요.' },
  reserving: { ...selected, reserving: true },
  failed: { ...selected, error: '예약하지 못했어요. 다시 시도해 주세요.' },
  success: { ...selected, success: '오늘 10:00–12:00 햇살 스튜디오를 예약했어요.' },
}
