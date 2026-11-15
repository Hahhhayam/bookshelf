/** Browser storage can be unavailable (private mode, blocked site data); reads then fall back and writes are skipped. */
function safe(storage: () => Storage) {
  return {
    get(key: string): string | null {
      try {
        return storage().getItem(key)
      } catch {
        return null
      }
    },
    set(key: string, value: string) {
      try {
        storage().setItem(key, value)
      } catch {
        /* unavailable */
      }
    },
    remove(key: string) {
      try {
        storage().removeItem(key)
      } catch {
        /* unavailable */
      }
    },
  }
}

export const local = safe(() => window.localStorage)
export const session = safe(() => window.sessionStorage)

export function readJson<T>(store: ReturnType<typeof safe>, key: string, fallback: T): T {
  const raw = store.get(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJson(store: ReturnType<typeof safe>, key: string, value: unknown) {
  store.set(key, JSON.stringify(value))
}
