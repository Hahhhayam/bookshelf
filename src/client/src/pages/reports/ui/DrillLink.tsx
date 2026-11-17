import { Anchor } from '@mantine/core'
import type { ReactNode } from 'react'

/** A name in a report table that narrows the report to it. */
export function DrillLink({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <Anchor component="button" type="button" ta="left" c="inherit" fw="inherit" fz="inherit" onClick={onClick}
      title="Деталізувати звіт">
      {children}
    </Anchor>
  )
}
