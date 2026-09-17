export type EventType = 'online' | 'offline'

export type EventFormData = {
  eventType: EventType
  title: string
  onlineUrl: string
  offlineLocation: string
}

export function createInitialEventFormData(): EventFormData {
  return {
    eventType: 'online',
    title: '',
    onlineUrl: '',
    offlineLocation: '',
  }
}

export function createSubmissionEventFormData(formData: EventFormData): EventFormData {
  return {
    eventType: formData.eventType,
    title: formData.title.trim(),
    onlineUrl: formData.onlineUrl.trim(),
    offlineLocation: formData.offlineLocation.trim(),
  }
}
