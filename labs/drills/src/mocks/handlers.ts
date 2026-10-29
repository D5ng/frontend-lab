import type { HttpHandler } from 'msw/http'

// 문제 폴더 안의 handlers.ts를 모두 등록한다. 새 문제는 자기 폴더에 handlers.ts만 추가한다.
const modules = import.meta.glob<{ handlers: HttpHandler[] }>('../../problems/**/handlers.ts', { eager: true })
export const handlers = Object.values(modules).flatMap((module) => module.handlers)
