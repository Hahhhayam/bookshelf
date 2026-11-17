import { Button, Group, Select } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useState } from 'react'
import { useReferenceList } from '@/entities/reference'
import { SupplierFormDialog } from './SupplierFormDialog'

/** Picks an active supplier, with an inline "new supplier" for one that is not there yet. */
export function SupplierSelect({ value, onChange, label = 'Постачальник', error, canCreate = true }: {
  value: string | null
  onChange: (id: string | null) => void
  label?: string
  error?: string
  canCreate?: boolean
}) {
  const suppliers = useReferenceList('suppliers', { active: true })
  const [dialog, setDialog] = useState(0)
  const options = (suppliers.data ?? []).map((s) => ({ value: s.id, label: s.name }))

  return (
    <>
      <Group gap="sm" align="flex-end" wrap="nowrap">
        <Select
          style={{ flex: 1, minWidth: 0 }}
          label={label}
          required
          searchable
          data={options}
          value={value}
          onChange={onChange}
          error={error}
          disabled={suppliers.isPending}
          placeholder={options.length ? 'Оберіть постачальника' : 'Ще немає постачальників'}
          nothingFoundMessage="Такого немає — додайте нового"
        />
        {canCreate && (
          <Button variant="default" leftSection={<IconPlus size={16} />} onClick={() => setDialog((n) => n + 1)}>
            Новий
          </Button>
        )}
      </Group>
      {dialog > 0 && (
        <SupplierFormDialog key={dialog} opened onClose={() => setDialog(0)} onSaved={(id) => onChange(id)} />
      )}
    </>
  )
}
