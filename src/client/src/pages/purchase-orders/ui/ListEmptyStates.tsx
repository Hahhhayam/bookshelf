import { Button, Group } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import { Link } from 'react-router'
import { statusFilterLabel, type OrderListFilter } from '@/features/purchasing-order-filters'
import { tokens } from '@/shared/config/tokens'
import { EmptyState, FilterChip, Panel } from '@/shared/ui'

function EnvelopeArt() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
      <rect x="12" y="18" width="40" height="30" fill={tokens.color.accentSoft} />
      <path d="M12 18l20 14 20-14" fill="none" stroke={tokens.color.accent2} strokeWidth="2.5" />
      <rect x="8" y="48" width="48" height="3" fill={tokens.color.accent2} />
    </svg>
  )
}

function SearchArt() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="28" cy="28" r="14" fill="none" stroke={tokens.color.accent2} strokeWidth="3" />
      <path d="M38 38l14 14" stroke={tokens.color.accent2} strokeWidth="4" />
      <path d="M22 28h12" stroke={tokens.color.accentSoft} strokeWidth="3" />
    </svg>
  )
}

/** No open purchase orders at all. */
export function AllClosedState({ onShowAll, canCreate }: { onShowAll: () => void; canCreate: boolean }) {
  return (
    <Panel>
      <EmptyState
        icon={<EnvelopeArt />}
        title="Усі замовлення закрито"
        text="Відкритих замовлень постачальникам немає. Закриті — у фільтрі «Статус: усі»."
        actions={(
          <>
            <Button variant="default" onClick={onShowAll}>Показати всі</Button>
            {canCreate && <Button component={Link} to="/staff/purchase-orders/new">Нове замовлення</Button>}
          </>
        )}
      />
    </Panel>
  )
}

/** Orders exist, but none match the filters: says which filters are on and lets the user drop each one. */
export function NothingFoundState({ filter, supplierName, onChange, onReset }: {
  filter: OrderListFilter
  supplierName?: string
  onChange: (patch: Partial<OrderListFilter>) => void
  onReset: () => void
}) {
  return (
    <Panel>
      <EmptyState
        icon={<SearchArt />}
        title="За цими фільтрами — нічого"
        text={describe(filter, supplierName)}
        actions={(
          <Group gap="xs" justify="center" maw={420} style={{ flexDirection: 'column' }}>
            <ActiveFilterChips filter={filter} supplierName={supplierName} onChange={onChange} />
            <Button variant="default" onClick={onReset}>Скинути фільтри</Button>
          </Group>
        )}
      />
    </Panel>
  )
}

function describe(filter: OrderListFilter, supplierName?: string): string {
  const parts = ['Немає замовлень']
  if (supplierName) parts.push(`«${supplierName}»`)
  if (filter.status !== 'open' && filter.status !== 'all') parts.push(`зі статусом «${statusFilterLabel(filter.status)}»`)
  if (filter.overdue) parts.push('серед прострочених')
  return `${parts.join(' ')}.`
}

function ActiveFilterChips({ filter, supplierName, onChange }: {
  filter: OrderListFilter
  supplierName?: string
  onChange: (patch: Partial<OrderListFilter>) => void
}) {
  const chips: { label: string; clear: Partial<OrderListFilter> }[] = []
  if (filter.supplier) chips.push({ label: supplierName ?? 'Постачальник', clear: { supplier: null } })
  if (filter.status !== 'open') chips.push({ label: statusFilterLabel(filter.status), clear: { status: 'open' } })
  if (filter.overdue) chips.push({ label: 'Прострочені', clear: { overdue: false } })
  return (
    <Group gap={8} justify="center">
      {chips.map((chip) => (
        <FilterChip key={chip.label} on height={30} onClick={() => onChange(chip.clear)} aria-label={`Прибрати фільтр ${chip.label}`}>
          {chip.label}<IconX size={12} />
        </FilterChip>
      ))}
    </Group>
  )
}
