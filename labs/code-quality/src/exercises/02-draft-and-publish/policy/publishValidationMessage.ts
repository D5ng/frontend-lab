import type { EventFormData } from '../model/eventForm'

/* 게시하기 검증 정책 */
export function getPublishValidationMessage(formData: EventFormData) {
  if (formData.title.length === 0) {
    return '행사 제목을 입력해 주세요.'
  }

  if (formData.eventType === 'online' && formData.onlineUrl.length === 0) {
    return '온라인 접속 URL을 입력해 주세요.'
  }

  if (formData.eventType === 'offline' && formData.offlineLocation.length === 0) {
    return '오프라인 장소를 입력해 주세요.'
  }

  return null
}
