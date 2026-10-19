export type Notification = { id: string; title: string; description: string; read: boolean }

export type MarkRead = (ids: string[]) => Promise<void>
