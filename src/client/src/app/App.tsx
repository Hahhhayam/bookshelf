import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import { queryClient } from './queryClient'
import { browserRouter } from './router'
import { theme } from './theme'

type Router = typeof browserRouter

/** Tests pass an in-memory router opened at the URL they need. */
export function App({ router = browserRouter }: { router?: Router }) {
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </MantineProvider>
  )
}
