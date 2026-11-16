import { Button } from '@mantine/core'
import { IconClipboardOff } from '@tabler/icons-react'
import { Link, useParams } from 'react-router'
import { useCount } from '@/entities/inventory-count'
import { EmptyState, Panel, QueryView } from '@/shared/ui'
import { CountSheet } from './ui/CountSheet'

export default function CountSheetPage() {
  const { id } = useParams()
  const count = useCount(id)
  return (
    <QueryView
      query={count}
      isEmpty={(data) => data === null}
      empty={(
        <Panel>
          <EmptyState
            icon={<IconClipboardOff size={40} stroke={1.5} />}
            title="Інвентаризацію не знайдено"
            text="Лист перерахунку відкривається лише в браузері, де інвентаризацію розпочато."
            actions={<Button component={Link} to="/staff/counts" variant="default">До списку</Button>}
          />
        </Panel>
      )}
    >
      {(data) => (data ? <CountSheet count={data} /> : null)}
    </QueryView>
  )
}
