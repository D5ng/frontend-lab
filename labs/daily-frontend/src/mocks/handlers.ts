import type { HttpHandler } from 'msw/http'

// 날짜별 핸들러를 함께 등록한다. 새 실습은 자기 폴더에 handlers.ts만 추가한다.
const modules = import.meta.glob<{ handlers: HttpHandler[] }>('../../problems/*/handlers.ts', { eager: true })
export const handlers = Object.values(modules).flatMap((module) => module.handlers)
