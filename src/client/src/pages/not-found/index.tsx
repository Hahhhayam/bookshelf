import { Button } from '@mantine/core'
import { IconMapOff } from '@tabler/icons-react'
import { Link, useLocation } from 'react-router'
import { EmptyState, Panel } from '@/shared/ui'

/** Artboard SystemStates: a page that does not exist. */
export default function NotFoundPage() {
  const inStaff = useLocation().pathname.startsWith('/staff')
  return (
    <Panel style={{ margin: 24 }}>
      <EmptyState
        icon={<IconMapOff size={56} stroke={1.5} />}
        title="Сторінку не знайдено"
        text="Можливо, посилання застаріло або в адресі помилка."
        actions={<Button component={Link} to={inStaff ? '/staff' : '/'}>На головну</Button>}
      />
    </Panel>
  )
}
