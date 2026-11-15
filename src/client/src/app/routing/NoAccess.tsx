import { Button } from '@mantine/core'
import { IconLock } from '@tabler/icons-react'
import { Link } from 'react-router'
import { EmptyState, Panel } from '@/shared/ui'

export function NoAccess() {
  return (
    <Panel>
      <EmptyState
        icon={<IconLock size={56} stroke={1.5} />}
        title="Немає прав на цей розділ"
        text="Розділ з’явиться в меню, коли адміністратор додасть вам потрібну роль."
        actions={<Button component={Link} to="/staff">На головну</Button>}
      />
    </Panel>
  )
}
