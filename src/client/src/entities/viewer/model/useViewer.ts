import { useQuery } from '@tanstack/react-query'
import { hasPermission, type PermissionCode } from '@/shared/lib'
import { viewerApi } from '../api/viewerApi'
import { sessionToken } from './session'

export const viewerKey = ['viewer'] as const

/** The signed-in employee; the navigation, start page and location switcher are built from it. */
export function useViewer() {
  return useQuery({ queryKey: viewerKey, queryFn: viewerApi.me, enabled: sessionToken.get() !== null, staleTime: 60_000 })
}

/** Rights checks for components; the server checks again, so this only hides what the user cannot do. */
export function useCan() {
  const { data } = useViewer()
  return (...anyOf: PermissionCode[]) => hasPermission(data?.permissions ?? [], ...anyOf)
}
