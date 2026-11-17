import { Select, Stack, TextInput } from '@mantine/core'
import { useState } from 'react'
import { useSales } from '@/entities/sale'
import { formatDateTime, formatMoney, shortId } from '@/shared/lib'

const guid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const isSaleId = (value: string) => guid.test(value.trim())

const returnWindowDays = 7

/** The sale being returned: one of the store's receipts within the return period, or its id from the paper receipt. */
export function SalePicker({ locationId, value, onChange }: {
  locationId: string
  value: string
  onChange: (id: string) => void
}) {
  const [from] = useState(() => new Date(Date.now() - returnWindowDays * 24 * 3_600_000).toISOString())
  const sales = useSales(locationId, from)
  const options = (sales.data ?? [])
    .filter((s) => s.status === 'Completed')
    .map((s) => ({ value: s.id, label: `${shortId(s.id)} · ${formatDateTime(s.completedAt)} · ${formatMoney(s.total)}` }))
  const invalid = value.trim() !== '' && !isSaleId(value)
  return (
    <Stack gap="xs">
      <Select label="Чек за останні 7 днів"
        placeholder={sales.isPending ? 'Завантаження…' : options.length ? 'Оберіть чек' : 'Чеків за цей час немає'}
        data={options} value={options.some((o) => o.value === value) ? value : null} error={sales.isError ? 'Не вдалося завантажити чеки' : undefined}
        onChange={(id) => onChange(id ?? '')} clearable searchable disabled={options.length === 0} />
      <TextInput label="або ідентифікатор продажу" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        value={value} onChange={(e) => onChange(e.currentTarget.value)}
        error={invalid ? 'Ідентифікатор має вигляд xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' : undefined}
        styles={{ input: { fontFamily: 'var(--mantine-font-family-monospace)' } }} />
    </Stack>
  )
}
