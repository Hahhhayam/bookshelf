import { Group, Menu, TextInput } from '@mantine/core'
import { IconCheck, IconChevronDown, IconClockHour4, IconSearch } from '@tabler/icons-react'
import { statusTone } from '@/shared/config/tokens'
import type { Named } from '@/shared/lib'
import { statusFilterLabel, statusFilterOptions, type OrderListFilter } from '../model/filter'
import { FilterChip } from './FilterChip'

/** Status, supplier, overdue and text filters above the purchase order list. */
export function PurchaseOrderFilters({ filter, onChange, statusCount, overdueCount, suppliers }: {
  filter: OrderListFilter
  onChange: (patch: Partial<OrderListFilter>) => void
  statusCount?: number
  overdueCount?: number
  suppliers: readonly Named[]
}) {
  const supplierName = suppliers.find((s) => s.id === filter.supplier)?.name
  return (
    <Group gap={10} wrap="wrap" align="center">
      <Menu position="bottom-start" shadow="md">
        <Menu.Target>
          <FilterChip on>
            Статус: {statusFilterLabel(filter.status)}{statusCount !== undefined && ` (${statusCount})`}
            <IconChevronDown size={14} />
          </FilterChip>
        </Menu.Target>
        <Menu.Dropdown>
          {statusFilterOptions.map((option) => (
            <Menu.Item key={option.value} onClick={() => onChange({ status: option.value })}
              rightSection={option.value === filter.status ? <IconCheck size={14} /> : null}>
              {option.label}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>

      <Menu position="bottom-start" shadow="md">
        <Menu.Target>
          <FilterChip on={!!filter.supplier}>
            Постачальник: {supplierName ?? 'усі'}
            <IconChevronDown size={14} />
          </FilterChip>
        </Menu.Target>
        <Menu.Dropdown mah={320} style={{ overflowY: 'auto' }}>
          <Menu.Item onClick={() => onChange({ supplier: null })}>усі</Menu.Item>
          {suppliers.map((supplier) => (
            <Menu.Item key={supplier.id} onClick={() => onChange({ supplier: supplier.id })}
              rightSection={supplier.id === filter.supplier ? <IconCheck size={14} /> : null}>
              {supplier.name}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>

      <FilterChip on={filter.overdue} aria-pressed={filter.overdue} onClick={() => onChange({ overdue: !filter.overdue })}>
        <IconClockHour4 size={16} stroke={1.75} color={statusTone.attention.text} />
        Лише прострочені{overdueCount !== undefined && ` · ${overdueCount}`}
      </FilterChip>

      <TextInput
        ml="auto"
        w={{ base: '100%', sm: 300 }}
        type="search"
        aria-label="Пошук замовлень"
        placeholder="Номер або постачальник"
        leftSection={<IconSearch size={16} stroke={1.75} />}
        value={filter.search}
        onChange={(event) => onChange({ search: event.currentTarget.value })}
      />
    </Group>
  )
}
