export interface ArchiveResult {
  succeededIds: string[]
  failedIds: string[]
}

export type ArchiveProducts = (productIds: string[]) => Promise<ArchiveResult>
