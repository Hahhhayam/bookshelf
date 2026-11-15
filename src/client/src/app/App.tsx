import { RouterProvider } from 'react-router'
import { AppProviders } from './providers/AppProviders'
import { browserRouter } from './routing/router'

type Router = typeof browserRouter

/** Tests pass an in-memory router opened at the URL they need. */
export function App({ router = browserRouter }: { router?: Router }) {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  )
}
