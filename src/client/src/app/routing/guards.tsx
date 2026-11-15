import { Center, Loader } from '@mantine/core'
import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import { sessionToken, useViewer } from '@/entities/viewer'
import { hasPermission, type PermissionCode } from '@/shared/lib'
import { ErrorView } from '@/shared/ui'
import { NoAccess } from './NoAccess'

/** Staff routes: without a session the user goes to login and comes back here afterwards. */
export function RequireSession() {
  const location = useLocation()
  const viewer = useViewer()
  if (!sessionToken.get()) return <Navigate to="/staff/login" replace state={{ from: location.pathname }} />
  if (viewer.isPending) return <Center h="100vh"><Loader color="plum" /></Center>
  if (viewer.isError) return <Center h="100vh" p="lg"><ErrorView error={viewer.error} onRetry={() => void viewer.refetch()} /></Center>
  return <Outlet />
}

/** A screen for holders of one of the permissions; others see why they cannot open it. */
export function RequirePermission({ anyOf, children }: { anyOf: PermissionCode[]; children: ReactNode }) {
  const { data } = useViewer()
  return hasPermission(data?.permissions ?? [], ...anyOf) ? <>{children}</> : <NoAccess />
}
