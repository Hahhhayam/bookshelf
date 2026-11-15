import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { sessionToken } from '@/entities/viewer'
import { configureHttp } from '@/shared/api'
import { cssVariablesResolver, theme } from '../styles/theme'

// The HTTP layer gets the session from here, so shared code never depends on the viewer entity.
configureHttp({
  getToken: sessionToken.get,
  onUnauthorized: () => {
    sessionToken.clear()
    if (window.location.pathname.startsWith('/staff')) window.location.assign('/staff/login')
  },
})

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: true },
    // Commands that change stock or money are retried by the user with the same operation key, never silently.
    mutations: { retry: false },
  },
})

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={theme} cssVariablesResolver={cssVariablesResolver} defaultColorScheme="light">
      <Notifications position="top-right" />
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MantineProvider>
  )
}
