import { Callout, HStack, Text, VStack } from '@seed-design/react'
import { useState } from 'react'
import { ActionButton } from 'seed-design/ui/action-button'
import { List, ListItem } from 'seed-design/ui/list'
import type { SavePlaylist } from '../features/playlist/types/playlist'

const episodes = [
  { id: 'walk', title: '산책 이야기' },
  { id: 'music', title: '저녁 음악' },
  { id: 'talk', title: '짧은 인터뷰' },
]

export function PlaylistPage({ savePlaylist }: { savePlaylist: SavePlaylist }) {
  const [order, setOrder] = useState(() => episodes.map((episode) => episode.id))
  const [saved, setSaved] = useState(() => episodes.map((episode) => episode.id))
  const [dirty, setDirty] = useState(false)
  const [pending, setPending] = useState(false)
  const [notice, setNotice] = useState<{ kind: 'error' | 'success'; text: string } | null>(null)

  return (
    <VStack as="article" gap="x6" px="x5" py="x6" width="full">
      <VStack as="header" gap="x2">
        <Text as="h2" textStyle="t7Bold">
          듣는 순서 정리
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          먼저 듣고 싶은 에피소드를 위로 옮겨 주세요.
        </Text>
      </VStack>
      <VStack gap="x3">
        <Text as="p" textStyle="t5Bold">
          {dirty ? '저장하지 않은 변경이 있어요.' : '저장된 순서와 같아요.'}
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          맨 위는 더 올릴 수 없고, 맨 아래는 더 내릴 수 없어요.
        </Text>
        <List as="ol" aria-label="편집 중인 순서">
          {order.map((id, index) => {
            const title = episodes.find((episode) => episode.id === id)!.title
            return (
              <ListItem
                key={id}
                title={`${index + 1}. ${title}`}
                suffix={
                  <HStack gap="x1">
                    <ActionButton
                      type="button"
                      size="large"
                      variant="neutralWeak"
                      aria-label={`${title} 위로`}
                      disabled={pending || index === 0}
                      onClick={() => {
                        if (pending || index === 0) return
                        const next = [...order]
                        ;[next[index - 1], next[index]] = [next[index]!, next[index - 1]!]
                        setOrder(next)
                        setDirty(next.some((value, position) => value !== saved[position]))
                        setNotice(null)
                      }}
                    >
                      위로
                    </ActionButton>
                    <ActionButton
                      type="button"
                      size="large"
                      variant="neutralWeak"
                      aria-label={`${title} 아래로`}
                      disabled={pending || index === order.length - 1}
                      onClick={() => {
                        if (pending || index === order.length - 1) return
                        const next = [...order]
                        ;[next[index], next[index + 1]] = [next[index + 1]!, next[index]!]
                        setOrder(next)
                        setDirty(next.some((value, position) => value !== saved[position]))
                        setNotice(null)
                      }}
                    >
                      아래로
                    </ActionButton>
                  </HStack>
                }
              />
            )
          })}
        </List>
      </VStack>
      <VStack as="aside" aria-label="마지막 저장 순서" gap="x2">
        <Text textStyle="t5Bold">마지막 저장 순서</Text>
        <Text textStyle="t4Regular">{saved.map((id) => episodes.find((episode) => episode.id === id)!.title).join(' → ')}</Text>
      </VStack>
      {notice && (
        <Callout.Root tone={notice.kind === 'error' ? 'critical' : 'positive'} role={notice.kind === 'error' ? 'alert' : 'status'}>
          <Callout.Content>
            <Callout.Description>{notice.text}</Callout.Description>
          </Callout.Content>
        </Callout.Root>
      )}
      <VStack gap="x3">
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          {pending ? '저장 중에는 순서를 바꾸거나 되돌릴 수 없어요.' : '바꾼 순서가 있을 때 저장하거나 마지막 저장으로 되돌릴 수 있어요.'}
        </Text>
        <ActionButton
          type="button"
          size="large"
          variant="neutralWeak"
          disabled={pending || !dirty}
          onClick={() => {
            if (pending || !dirty) return
            setOrder([...saved])
            setDirty(false)
            setNotice(null)
          }}
        >
          마지막 저장으로 되돌리기
        </ActionButton>
        <ActionButton
          type="button"
          size="large"
          variant="neutralSolid"
          loading={pending}
          disabled={pending || !dirty}
          onClick={async () => {
            if (pending || !dirty) return
            setPending(true)
            setNotice(null)
            try {
              const result = await savePlaylist({ orderedIds: [...order] })
              setOrder([...result.orderedIds])
              setSaved([...result.orderedIds])
              setDirty(false)
              setNotice({ kind: 'success', text: '재생 순서를 저장했어요.' })
            } catch {
              setNotice({ kind: 'error', text: '순서를 저장하지 못했어요. 다시 시도해 주세요.' })
            } finally {
              setPending(false)
            }
          }}
        >
          순서 저장하기
        </ActionButton>
      </VStack>
    </VStack>
  )
}
