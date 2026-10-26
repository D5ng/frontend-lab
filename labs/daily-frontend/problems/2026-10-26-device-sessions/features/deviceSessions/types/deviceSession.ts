export interface DeviceSession {
  id: string
  name: string
  current: boolean
}

export type EndSession = (id: string) => Promise<void>
