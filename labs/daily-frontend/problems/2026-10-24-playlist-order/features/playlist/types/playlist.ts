export interface PlaylistInput {
  orderedIds: string[]
}

export interface PlaylistReceipt {
  orderedIds: string[]
}

export type SavePlaylist = (input: PlaylistInput) => Promise<PlaylistReceipt>
