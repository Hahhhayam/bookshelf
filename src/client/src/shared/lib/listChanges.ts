export interface ListChanges<T> {
  added: T[]
  removed: T[]
}

/** What a replace-as-a-whole update (roles, locations, permissions) adds and removes. */
export function listChanges<T>(before: readonly T[], after: readonly T[]): ListChanges<T> {
  return {
    added: after.filter((item) => !before.includes(item)),
    removed: before.filter((item) => !after.includes(item)),
  }
}

export function hasChanges(changes: ListChanges<unknown>): boolean {
  return changes.added.length > 0 || changes.removed.length > 0
}
