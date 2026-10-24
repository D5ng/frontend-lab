import { useState } from 'react'
import { createApiClient } from '../../src/api/client'
import { savePlaylist } from './features/playlist/apis/savePlaylist'
import type { PlaylistInput } from './features/playlist/types/playlist'
import { PlaylistPage } from './pages/PlaylistPage'

export function Problem() {
  const [save] = useState(() => {
    const request = createApiClient()
    return (input: PlaylistInput) => savePlaylist(request, input)
  })
  return <PlaylistPage savePlaylist={save} />
}
