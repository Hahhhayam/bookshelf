import { local, readJson, writeJson } from './storage'

export interface Named {
  id: string
  name: string
}

/**
 * The API creates reference data (authors, suppliers, roles…) but cannot list it (API_GAPS.md, GAP-03 and GAP-10).
 * Until it can, the browser remembers what was created or seen here, so pickers have something to offer.
 */
export function remembered<T extends Named>(kind: string) {
  const key = `bookshelf.remembered.${kind}`
  return {
    all: (): T[] => readJson<T[]>(local, key, []),
    find: (id: string): T | undefined => readJson<T[]>(local, key, []).find((item) => item.id === id),
    save(item: T) {
      const items = readJson<T[]>(local, key, []).filter((existing) => existing.id !== item.id)
      writeJson(local, key, [...items, item].sort((a, b) => a.name.localeCompare(b.name, 'uk')))
    },
  }
}
