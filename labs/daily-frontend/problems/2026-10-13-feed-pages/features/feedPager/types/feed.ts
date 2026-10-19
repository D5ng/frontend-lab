export type Post = { id: string; title: string; location: string }

export type Page = { items: Post[]; nextCursor: string | null }

export type LoadPage = (cursor: string | null) => Promise<Page>
