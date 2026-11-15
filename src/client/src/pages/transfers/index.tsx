import { Alert, Anchor, Button, Stack } from '@mantine/core'
import { IconAlertTriangle, IconArrowsExchange, IconPlus } from '@tabler/icons-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { useTransfers, type TransferSummary } from '@/entities/transfer'
import { useWorkingLocation } from '@/entities/viewer'
import { EmptyState, PageHeader, Panel, QueryView } from '@/shared/ui'
import { initialFilters, TransferFilters, type TransferFilterState } from './ui/TransferFilters'
import { TransferTable } from './ui/TransferTable'

function visible(transfers: TransferSummary[], filters: TransferFilterState, location: string) {
  return transfers
    .filter((t) => filters.direction === 'all' || (filters.direction === 'in' ? t.to === location : t.from === location))
    .filter((t) => !filters.problemsOnly || t.hasOpenDiscrepancies)
    .sort((a, b) => (b.lastChangedAt ?? '').localeCompare(a.lastChangedAt ?? ''))
}

export default function TransfersPage() {
  const location = useWorkingLocation()
  const [filters, setFilters] = useState(initialFilters)
  const transfers = useTransfers(location?.id, filters.status ?? undefined)
  const rows = visible(transfers.data ?? [], filters, location?.id ?? '')
  const problems = (transfers.data ?? []).filter((t) => t.hasOpenDiscrepancies).length
  const newButton = <Button component={Link} to="/staff/transfers/new" leftSection={<IconPlus size={16} stroke={1.75} />}>Нове переміщення</Button>

  return (
    <Stack gap="lg">
      <PageHeader eyebrow="Книжки між цим магазином, іншими магазинами мережі та центральним складом" title="Переміщення" actions={newButton} />
      {problems > 0 && (
        <Alert color="red" variant="light" icon={<IconAlertTriangle size={18} />}>
          <strong>Переміщень, отриманих з розбіжністю: {problems}.</strong> Закрийте розбіжності до кінця дня, щоб залишки
          магазину збігалися з обліком.{' '}
          {!filters.problemsOnly && <Anchor component="button" onClick={() => setFilters({ ...filters, problemsOnly: true })}>Показати лише їх</Anchor>}
        </Alert>
      )}
      <TransferFilters value={filters} onChange={setFilters} />
      <Panel>
        <QueryView
          query={transfers}
          isEmpty={() => rows.length === 0}
          empty={(transfers.data?.length ?? 0) > 0 ? (
            <EmptyState title="За цими фільтрами — нічого" actions={<Button variant="default" onClick={() => setFilters(initialFilters)}>Скинути фільтри</Button>} />
          ) : (
            <EmptyState
              icon={<IconArrowsExchange size={40} stroke={1.5} />}
              title="Переміщень немає"
              text="Відкритих переміщень для цієї локації немає. Завершені — у фільтрі «Статус»."
              actions={newButton}
            />
          )}
        >
          {() => <TransferTable transfers={rows} location={location?.id ?? ''} />}
        </QueryView>
      </Panel>
    </Stack>
  )
}
