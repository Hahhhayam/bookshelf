import { Select, Stack, TextInput } from '@mantine/core'
import { useShiftReceipts } from '@/entities/sale'
import { formatDateTime, formatMoney, shortId } from '@/shared/lib'

const guid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const isSaleId = (value: string) => guid.test(value.trim())

/** The sale being returned: one of this shift's receipts, or a pasted id (no sale lookup by number yet, GAP-07). */
export function SalePicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const receipts = useShiftReceipts()
  const options = (receipts.data ?? []).map((r) => ({
    value: r.id, label: `${shortId(r.id)} · ${formatDateTime(r.at)} · ${formatMoney(r.total)}`,
  }))
  const invalid = value.trim() !== '' && !isSaleId(value)
  return (
    <Stack gap="xs">
      <Select label="Чек цієї зміни" placeholder={receipts.isPending ? 'Завантаження…' : options.length ? 'Оберіть чек' : 'Чеків за зміну ще немає'}
        data={options} value={options.some((o) => o.value === value) ? value : null}
        onChange={(id) => onChange(id ?? '')} clearable searchable disabled={options.length === 0} />
      <TextInput label="або ідентифікатор продажу" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        value={value} onChange={(e) => onChange(e.currentTarget.value)}
        error={invalid ? 'Ідентифікатор має вигляд xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' : undefined}
        styles={{ input: { fontFamily: 'var(--mantine-font-family-monospace)' } }} />
    </Stack>
  )
}
