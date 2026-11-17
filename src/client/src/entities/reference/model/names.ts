import { useCallback } from 'react'
import { initials, shortId } from '@/shared/lib'
import { useReferenceNames, useUserLogins } from './queries'

/** A location's name by its id. */
export function useLocationNames() {
  return useReferenceNames('locations')
}

function useLoginOf() {
  const { data } = useUserLogins()
  return useCallback((id: string) => data?.find((user) => user.id === id)?.login, [data])
}

/** A user's login by id; a short id while the list loads. */
export function useUserNames(): (id: string | null | undefined) => string {
  const loginOf = useLoginOf()
  return useCallback((id) => (id ? loginOf(id) ?? `користувач ${shortId(id)}` : '—'), [loginOf])
}

/** Initials for a user's avatar. */
export function useUserInitials(): (id: string | null | undefined) => string {
  const loginOf = useLoginOf()
  return useCallback((id) => {
    if (!id) return '—'
    const login = loginOf(id)
    return login ? initials(login) : shortId(id).slice(0, 2)
  }, [loginOf])
}
