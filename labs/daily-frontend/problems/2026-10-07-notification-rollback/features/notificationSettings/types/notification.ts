export type UpdateNotification = (request: { productId: string; enabled: boolean }) => Promise<void>
