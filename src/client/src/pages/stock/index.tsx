import { Button, Group, Stack, Switch, TextInput } from '@mantine/core'
import { IconBuildingWarehouse, IconSearch } from '@tabler/icons-react'
import { useState } from 'react'
import { useBookTitles } from '@/entities/book'
import { useLocationStock, type StockLine } from '@/entities/stock'
import { useCan, useWorkingLocation } from '@/entities/viewer'
import { AdjustStockDialog, WriteOffDialog, type StockTarget } from '@/features/ops-stock-actions'
import { Perm } from '@/shared/lib'
import { EmptyState, PageHeader, Panel, QueryView } from '@/shared/ui'
import { StockTable } from './ui/StockTable'

export default function StockPage() {
  const location = useWorkingLocation()
  const can = useCan()
  const [belowMinimum, setBelowMinimum] = useState(false)
  const [search, setSearch] = useState('')
  const [adjusting, setAdjusting] = useState<StockTarget | null>(null)
  const [writingOff, setWritingOff] = useState<StockTarget | null>(null)
  const stock = useLocationStock(location?.id, belowMinimum ? { belowMinimum: true } : {})
  const title = useBookTitles((stock.data ?? []).map((line) => line.book))
  const text = search.trim().toLocaleLowerCase('uk')
  const rows = (stock.data ?? []).filter((line: StockLine) => !text || title(line.book).toLocaleLowerCase('uk').includes(text))
  const reset = () => { setSearch(''); setBelowMinimum(false) }

  return (
    <Stack gap="lg">
      <PageHeader eyebrow={location?.name} title="Залишки" />
      <Group gap="md" wrap="wrap">
        <TextInput
          w={300} maw="100%" placeholder="Назва книги" aria-label="Пошук у залишках"
          leftSection={<IconSearch size={16} stroke={1.75} />} value={search} onChange={(event) => setSearch(event.currentTarget.value)}
        />
        <Switch label="Лише нижче мінімуму" checked={belowMinimum} onChange={(event) => setBelowMinimum(event.currentTarget.checked)} />
      </Group>
      <Panel>
        <QueryView
          query={stock}
          isEmpty={() => rows.length === 0}
          empty={(stock.data?.length ?? 0) > 0 || belowMinimum ? (
            <EmptyState
              title={belowMinimum && !text ? 'Усе вище мінімуму' : 'За цими фільтрами — нічого'}
              actions={<Button variant="default" onClick={reset}>Скинути фільтри</Button>}
            />
          ) : (
            <EmptyState icon={<IconBuildingWarehouse size={40} stroke={1.5} />} title="Залишків немає" text="На цій локації ще немає жодної книжки." />
          )}
        >
          {() => (
            <StockTable
              location={location?.id ?? ''}
              lines={rows}
              title={title}
              canAdjust={can(Perm.StockAdjust)}
              canWriteOff={can(Perm.WriteOffCreate)}
              onAdjust={setAdjusting}
              onWriteOff={setWritingOff}
            />
          )}
        </QueryView>
      </Panel>
      {location && <AdjustStockDialog location={location.id} target={adjusting} onClose={() => setAdjusting(null)} />}
      {location && <WriteOffDialog location={location.id} target={writingOff} onClose={() => setWritingOff(null)} />}
    </Stack>
  )
}
