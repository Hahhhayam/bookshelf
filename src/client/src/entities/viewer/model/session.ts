import { session as store } from '@/shared/lib'

const key = 'bookshelf.session'

/** The session token lives only as long as the browser tab (UI_Design.md, section 4). */
export const sessionToken = {
  get: (): string | null => store.get(key),
  set: (token: string) => store.set(key, token),
  clear: () => store.remove(key),
}
