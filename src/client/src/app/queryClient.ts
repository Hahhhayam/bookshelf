import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
    // Commands that change stock or money are retried by the user, with the same idempotency key, never silently.
    mutations: { retry: false },
  },
})
