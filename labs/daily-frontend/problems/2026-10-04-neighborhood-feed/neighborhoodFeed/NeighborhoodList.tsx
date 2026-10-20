import { List } from '@seed-design/react'
import { NEIGHBORHOODS, type Post } from './neighborhoodFeed.model'

interface Props {
  posts: Post[]
}

export function NeighborhoodList({ posts }: Props) {
  return (
    <List.Root aria-label="게시글 목록">
      {posts.map((post) => (
        <List.Item key={post.id}>
          <List.Content>
            <List.Title>{post.title}</List.Title>
            <List.Detail>
              {NEIGHBORHOODS[post.neighborhood]} · {post.price.toLocaleString('ko-KR')}원
            </List.Detail>
          </List.Content>
        </List.Item>
      ))}
    </List.Root>
  )
}
