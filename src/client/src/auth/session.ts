const key = 'bookshelf.session'

/** The session token lives only as long as the browser tab (UI design, section 4). */
export const session = {
  token: (): string | null => sessionStorage.getItem(key),
  start: (token: string) => sessionStorage.setItem(key, token),
  end: () => sessionStorage.removeItem(key),
}
