import { Button, Group, Select, TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { auditActionOptions } from '@/entities/audit'
import type { AuditFilterState } from '../model/useAuditFilter'

export function AuditFilters({ state }: { state: AuditFilterState }) {
  return (
    <Group gap="sm" align="flex-start" wrap="wrap">
      <TextInput
        aria-label="Пошук об’єкта" placeholder="Об’єкт: id, логін" leftSection={<IconSearch size={16} stroke={1.75} />}
        value={state.subject} onChange={(e) => state.setSubject(e.currentTarget.value)} w={{ base: '100%', sm: 280 }}
      />
      <Select
        aria-label="Дія" placeholder="Дія: усі" data={auditActionOptions} value={state.action} onChange={state.setAction}
        clearable searchable w={{ base: '100%', sm: 260 }}
      />
      <TextInput
        type="date" aria-label="Від" value={state.period.from} w={160}
        onChange={(e) => state.setPeriod({ ...state.period, from: e.currentTarget.value })}
        error={state.periodValid ? undefined : 'Початок пізніше за кінець'}
      />
      <TextInput
        type="date" aria-label="До" value={state.period.to} w={160}
        onChange={(e) => state.setPeriod({ ...state.period, to: e.currentTarget.value })}
      />
      <Button variant="subtle" onClick={state.reset}>Скинути</Button>
    </Group>
  )
}
