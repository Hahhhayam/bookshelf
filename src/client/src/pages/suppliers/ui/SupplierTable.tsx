import { Button, Table, Text } from '@mantine/core'
import { IconPencil } from '@tabler/icons-react'
import type { Supplier } from '@/entities/reference'
import { SupplierActiveSwitch } from '@/features/purchasing-manage-supplier'
import { tokens } from '@/shared/config/tokens'

export function SupplierTable({ suppliers, onEdit }: { suppliers: readonly Supplier[]; onEdit: (supplier: Supplier) => void }) {
  return (
    <Table.ScrollContainer minWidth={640}>
      <Table verticalSpacing={12} horizontalSpacing={12}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Назва</Table.Th>
            <Table.Th>Контакти</Table.Th>
            <Table.Th w={160}>Стан</Table.Th>
            <Table.Th w={140} />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {suppliers.map((supplier) => (
            <Table.Tr key={supplier.id} style={{ color: supplier.active ? undefined : tokens.color.disabledText }}>
              <Table.Td><Text fw={600} size="sm" c="inherit">{supplier.name}</Text></Table.Td>
              <Table.Td>
                <Text size="sm" c={supplier.contactInfo ? tokens.color.ink2 : 'dimmed'} style={{ whiteSpace: 'pre-line' }}>
                  {supplier.contactInfo ?? '—'}
                </Text>
              </Table.Td>
              <Table.Td><SupplierActiveSwitch id={supplier.id} name={supplier.name} active={supplier.active} /></Table.Td>
              <Table.Td ta="right">
                <Button variant="subtle" size="xs" leftSection={<IconPencil size={14} />} onClick={() => onEdit(supplier)}>Змінити</Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}
