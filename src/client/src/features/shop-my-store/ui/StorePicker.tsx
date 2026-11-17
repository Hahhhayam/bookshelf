import { Select } from '@mantine/core'
import { IconMapPin } from '@tabler/icons-react'
import { useStores } from '@/entities/store'
import { myStore, useMyStore } from '../model/myStore'

/** Chooses «Мій магазин» among the stores of the chain. */
export function StorePicker({ label = 'Мій магазин' }: { label?: string }) {
  const current = useMyStore()
  const stores = useStores()
  return (
    <Select
      label={label}
      placeholder="Оберіть магазин"
      data={(stores.data ?? []).map((store) => ({ value: store.id, label: store.name }))}
      value={current}
      onChange={(value) => myStore.set(value)}
      leftSection={<IconMapPin size={16} stroke={1.75} />}
      disabled={!stores.data?.length}
      clearable
      allowDeselect
    />
  )
}
