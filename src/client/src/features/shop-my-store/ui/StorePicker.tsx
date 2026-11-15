import { Select } from '@mantine/core'
import { IconMapPin } from '@tabler/icons-react'
import { referenceName } from '@/entities/reference'
import { myStore, useMyStore } from '../model/myStore'

/** Chooses «Мій магазин» among the stores the shopper can see (GAP-14: only those in availability). */
export function StorePicker({ locations, label = 'Мій магазин' }: { locations: readonly string[]; label?: string }) {
  const current = useMyStore()
  const ids = current && !locations.includes(current) ? [current, ...locations] : [...locations]
  return (
    <Select
      label={label}
      placeholder={ids.length ? 'Оберіть магазин' : 'Спершу знайдіть книжку'}
      data={ids.map((id) => ({ value: id, label: referenceName('locations', id) }))}
      value={current}
      onChange={(value) => myStore.set(value)}
      leftSection={<IconMapPin size={16} stroke={1.75} />}
      disabled={ids.length === 0}
      clearable
      allowDeselect
    />
  )
}
