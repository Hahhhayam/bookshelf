import { ActionIcon, Group, NumberInput, Table, Text } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { uah } from '@/shared/api'
import { tokens } from '@/shared/config/tokens'
import { MoneyText } from '@/shared/ui'
import type { DraftLine } from '../model/useOrderDraft'

/** The lines of a new purchase order: quantity and purchase price per book, with the order total. */
export function OrderLinesEditor({ lines, onChange, onRemove }: {
  lines: readonly DraftLine[]
  onChange: (book: string, patch: Partial<Pick<DraftLine, 'quantity' | 'price'>>) => void
  onRemove: (book: string) => void
}) {
  if (lines.length === 0) {
    return <Text c="dimmed" size="sm" p="md">Відскануйте або знайдіть книгу — вона з’явиться тут.</Text>
  }
  const total = lines.reduce((sum, line) => sum + line.quantity * line.price, 0)
  const units = lines.reduce((sum, line) => sum + line.quantity, 0)
  return (
    <>
      <Table.ScrollContainer minWidth={640}>
        <Table verticalSpacing={8} horizontalSpacing={12}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Книга</Table.Th>
              <Table.Th ta="right" w={120}>Кількість</Table.Th>
              <Table.Th ta="right" w={160}>Ціна закупівлі, ₴</Table.Th>
              <Table.Th ta="right">Сума</Table.Th>
              <Table.Th w={44} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {lines.map((line) => <LineRow key={line.book} line={line} onChange={onChange} onRemove={onRemove} />)}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <Group justify="space-between" px="md" py={10} style={{ borderTop: `1px solid ${tokens.color.line}` }}>
        <Text size="sm" c="dimmed">{lines.length} назв · {units} од.</Text>
        <Text size="sm">Разом <MoneyText value={uah(total)} variant="strong" /></Text>
      </Group>
    </>
  )
}

function LineRow({ line, onChange, onRemove }: {
  line: DraftLine
  onChange: (book: string, patch: Partial<Pick<DraftLine, 'quantity' | 'price'>>) => void
  onRemove: (book: string) => void
}) {
  return (
    <Table.Tr>
      <Table.Td><Text fw={600} size="sm">{line.title}</Text></Table.Td>
      <Table.Td>
        <NumberInput aria-label={`Кількість, ${line.title}`} value={line.quantity} min={1} allowDecimal={false}
          allowNegative={false} hideControls styles={{ input: { textAlign: 'right' } }}
          onChange={(value) => onChange(line.book, { quantity: Number(value) || 0 })} />
      </Table.Td>
      <Table.Td>
        <NumberInput aria-label={`Ціна закупівлі, ${line.title}`} value={line.price} min={0} decimalScale={2}
          allowNegative={false} hideControls styles={{ input: { textAlign: 'right' } }}
          onChange={(value) => onChange(line.book, { price: Number(value) || 0 })} />
      </Table.Td>
      <Table.Td ta="right"><MoneyText value={uah(line.quantity * line.price)} /></Table.Td>
      <Table.Td>
        <ActionIcon variant="subtle" color="gray" aria-label={`Прибрати ${line.title}`} onClick={() => onRemove(line.book)}>
          <IconTrash size={16} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  )
}
