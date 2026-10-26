import { members } from './data'
import type { ExpenseSplitViewProps } from './ExpenseSplitView'
export const splitStarter: ExpenseSplitViewProps = {
  draft: { title: '', amount: '', method: 'equal', memberIds: [], weights: {} },
  members: [],
  result: null,
  loading: false,
  saving: false,
  error: '',
  success: '',
  starter: true,
  onDraftChange: () => {},
  onToggle: () => {},
  onWeightChange: () => {},
  onCalculate: () => {},
  onSave: () => {},
  onReload: () => {},
}
const calculated: ExpenseSplitViewProps = {
  ...splitStarter,
  starter: false,
  preview: true,
  members,
  draft: { title: '주말 모임 식비', amount: '10000', method: 'equal', memberIds: ['nara', 'jun', 'bom'], weights: {} },
  result: {
    shares: [
      { memberId: 'nara', name: '나라', amount: 3334 },
      { memberId: 'jun', name: '준', amount: 3333 },
      { memberId: 'bom', name: '봄', amount: 3333 },
    ],
    total: 10000,
  },
}
// 정적인 UI 예시만 제공한다. 분배 계산이나 요청 처리 구현이 아니다.
export const splitPreviews: Record<string, ExpenseSplitViewProps> = {
  ready: { ...calculated, result: null },
  calculated,
  loading: { ...calculated, members: [], result: null, loading: true },
  error: { ...calculated, members: [], result: null, error: '참여자를 불러오지 못했어요. 다시 시도해 주세요.' },
  saving: { ...calculated, saving: true },
  failed: { ...calculated, error: '정산안을 저장하지 못했어요. 다시 시도해 주세요.' },
  success: { ...calculated, success: '정산안을 저장했어요.' },
}
