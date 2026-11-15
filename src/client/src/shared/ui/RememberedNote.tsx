import { Alert } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import type { ReactNode } from 'react'

/** Explains why an administration list can be incomplete: the API cannot list it yet (API_GAPS.md, GAP-03/GAP-10). */
export function RememberedNote({ children }: { children: ReactNode }) {
  return (
    <Alert color="gray" variant="light" icon={<IconInfoCircle size={18} stroke={1.75} />}>
      {children}
    </Alert>
  )
}
