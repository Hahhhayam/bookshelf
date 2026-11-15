import { Skeleton, Stack } from '@mantine/core'
import type { UseQueryResult } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { ErrorView } from './ErrorView'

/** Loading, error and empty states for one query, so every screen shows them the same way. */
export function QueryView<T>({ query, isEmpty, empty, children, skeletonRows = 6 }: {
  query: UseQueryResult<T>
  isEmpty?: (data: T) => boolean
  empty?: ReactNode
  children: (data: T) => ReactNode
  skeletonRows?: number
}) {
  if (query.isPending) {
    return (
      <Stack gap="xs" p="md" aria-busy="true">
        {Array.from({ length: skeletonRows }, (_, i) => <Skeleton key={i} height={34} radius={0} />)}
      </Stack>
    )
  }
  if (query.isError) return <ErrorView error={query.error} onRetry={() => void query.refetch()} />
  if (isEmpty?.(query.data) && empty) return <>{empty}</>
  return <>{children(query.data)}</>
}
