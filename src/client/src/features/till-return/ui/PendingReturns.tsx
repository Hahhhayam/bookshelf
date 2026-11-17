import { Alert, Button, Table, Text } from '@mantine/core'
import { IconArrowBackUp } from '@tabler/icons-react'
import { useState } from 'react'
import { useBookTitles } from '@/entities/book'
import { conditionLabel, usePendingReturns, type ReturnView } from '@/entities/sale'
import { useCan } from '@/entities/viewer'
import { formatMoney, Perm, shortId } from '@/shared/lib'
import { ConfirmDialog, EmptyState, errorMessage, MoneyText, Panel, QueryView } from '@/shared/ui'
import { useConfirmReturn } from '../model/queries'

function Row({ item, titleOf, canConfirm, onConfirm }: {
  item: ReturnView
  titleOf: (book: string) => string
  canConfirm: boolean
  onConfirm: () => void
}) {
  return (
    <Table.Tr>
      <Table.Td>
        {item.lines.map((l) => <Text key={l.book} fw={600} fz="md">{titleOf(l.book)} · {l.quantity} шт.</Text>)}
        <Text fz="sm" c="dimmed">{item.reason}</Text>
      </Table.Td>
      <Table.Td>{conditionLabel[item.condition]}</Table.Td>
      <Table.Td style={{ textAlign: 'right' }}><MoneyText value={item.refundTotal} variant="strong" /></Table.Td>
      <Table.Td ff="monospace" fz={13}>{shortId(item.sale)}</Table.Td>
      {canConfirm && <Table.Td><Button size="xs" onClick={onConfirm}>Підтвердити</Button></Table.Td>}
    </Table.Tr>
  )
}

/** The store's returns awaiting the administrator's confirmation (scenario 3.6). */
export function PendingReturns({ locationId }: { locationId: string }) {
  const can = useCan()
  const canConfirm = can(Perm.ReturnsConfirm)
  const query = usePendingReturns(locationId)
  const titleOf = useBookTitles((query.data ?? []).flatMap((r) => r.lines.map((l) => l.book)))
  const confirm = useConfirmReturn(locationId)
  const [target, setTarget] = useState<ReturnView | null>(null)

  return (
    <Panel title="Чекають підтвердження">
      {confirm.isError && <Alert color="red" variant="light" m="md">{errorMessage(confirm.error)}</Alert>}
      <QueryView query={query} skeletonRows={3} isEmpty={(items) => items.length === 0}
        empty={<EmptyState icon={<IconArrowBackUp size={36} stroke={1.75} />} title="Немає повернень, що чекають"
          text="Створені в магазині повернення з’являться тут до підтвердження." />}>
        {(items) => (
          <Table.ScrollContainer minWidth={600}>
            <Table verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Книга</Table.Th><Table.Th>Стан книги</Table.Th>
                  <Table.Th style={{ textAlign: 'right' }}>До повернення</Table.Th><Table.Th>Продаж</Table.Th>
                  {canConfirm && <Table.Th />}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {items.map((item) => (
                  <Row key={item.id} item={item} titleOf={titleOf} canConfirm={canConfirm} onConfirm={() => setTarget(item)} />
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </QueryView>
      <ConfirmDialog opened={target !== null} title="Підтвердити повернення?" confirmLabel="Підтвердити"
        loading={confirm.isPending} onClose={() => setTarget(null)}
        onConfirm={() => target && confirm.mutate(target.id, { onSettled: () => setTarget(null) })}>
        <Text>Повернення на {formatMoney(target?.refundTotal)} буде проведено. Скасувати це не можна.</Text>
      </ConfirmDialog>
    </Panel>
  )
}
