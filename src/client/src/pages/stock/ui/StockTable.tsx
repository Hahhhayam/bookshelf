import { ActionIcon, Menu, Table, Text } from '@mantine/core'
import { IconDots } from '@tabler/icons-react'
import type { StockLine } from '@/entities/stock'
import { MinimumCell, type StockTarget } from '@/features/ops-stock-actions'
import { StatusBadge } from '@/shared/ui'

export function StockTable({ location, lines, title, canAdjust, canWriteOff, onAdjust, onWriteOff }: {
  location: string
  lines: StockLine[]
  title: (book: string) => string
  canAdjust: boolean
  canWriteOff: boolean
  onAdjust: (target: StockTarget) => void
  onWriteOff: (target: StockTarget) => void
}) {
  const hasActions = canAdjust || canWriteOff
  return (
    <Table.ScrollContainer minWidth={720}>
      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Книга</Table.Th>
            <Table.Th ta="right">На складі</Table.Th>
            <Table.Th ta="right">У резерві</Table.Th>
            <Table.Th ta="right">Доступно</Table.Th>
            <Table.Th>Мінімум</Table.Th>
            <Table.Th>Стан</Table.Th>
            {hasActions && <Table.Th w={48} />}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {lines.map((line) => {
            const target = { book: line.book, title: title(line.book), onHand: line.onHand, available: line.available }
            return (
              <Table.Tr key={line.book}>
                <Table.Td><Text fw={600} size="md">{target.title}</Text></Table.Td>
                <Table.Td ta="right">{line.onHand}</Table.Td>
                <Table.Td ta="right">{line.reserved}</Table.Td>
                <Table.Td ta="right"><Text fw={600} size="md">{line.available}</Text></Table.Td>
                <Table.Td><MinimumCell location={location} book={line.book} minimum={line.minimum} editable={canAdjust} /></Table.Td>
                <Table.Td>{line.belowMinimum && <StatusBadge tone="attention" label="Нижче мінімуму" />}</Table.Td>
                {hasActions && (
                  <Table.Td>
                    <Menu position="bottom-end" width={220} shadow="md">
                      <Menu.Target>
                        <ActionIcon variant="subtle" color="gray" aria-label={`Дії: ${target.title}`}><IconDots size={18} /></ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        {canAdjust && <Menu.Item onClick={() => onAdjust(target)}>Коригувати залишок…</Menu.Item>}
                        {canWriteOff && <Menu.Item c="red" disabled={line.available <= 0} onClick={() => onWriteOff(target)}>Списати…</Menu.Item>}
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                )}
              </Table.Tr>
            )
          })}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}
