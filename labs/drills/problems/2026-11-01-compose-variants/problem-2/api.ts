export type Person = {
  name: string
  profileImageUrl: string
}

export type InviteStatus = 'pending' | 'accepted' | 'declined'

type NotificationBase = {
  id: number
  createdAt: string
  read: boolean
}

export type CommentNotification = NotificationBase & {
  type: 'comment'
  actor: Person
  comment: { id: number; text: string; likedByMe: boolean }
}

export type LikeNotification = NotificationBase & {
  type: 'like'
  actors: Person[]
  postTitle: string
}

export type InviteNotification = NotificationBase & {
  type: 'invite'
  inviter: Person
  group: { name: string; imageUrl: string; memberCount: number }
  status: InviteStatus
}

export type ScheduleChangedNotification = NotificationBase & {
  type: 'scheduleChanged'
  group: { name: string }
  before: string
  after: string
}

// DOM에 이미 Notification이 있어서 이름을 다르게 둔다.
export type InboxNotification = CommentNotification | LikeNotification | InviteNotification | ScheduleChangedNotification

export type InboxResponse = {
  now: string
  notifications: InboxNotification[]
}

const BASE = '/api/drills/2026-11-01'

export async function fetchInbox(): Promise<InboxResponse> {
  const response = await fetch(new URL(`${BASE}/notifications`, window.location.origin))
  if (!response.ok) throw new Error('알림을 불러오지 못했어요.')
  return (await response.json()) as InboxResponse
}

export async function answerInvite(notificationId: number, accept: boolean): Promise<{ status: InviteStatus }> {
  const response = await fetch(new URL(`${BASE}/notifications/${notificationId}/answer`, window.location.origin), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accept }),
  })
  if (!response.ok) throw new Error('초대에 답하지 못했어요.')
  return (await response.json()) as { status: InviteStatus }
}

export async function updateCommentLike(commentId: number, liked: boolean): Promise<void> {
  const response = await fetch(new URL(`${BASE}/comments/${commentId}/likes`, window.location.origin), {
    method: liked ? 'POST' : 'DELETE',
  })
  if (!response.ok) throw new Error('좋아요를 반영하지 못했어요.')
}
