import { Alert, Button, Table, Text } from '@mantine/core'
import { IconArrowBackUp } from '@tabler/icons-react'
import { useState } from 'react'
import { conditionLabel, usePendingReturns, type PendingReturn } from '@/entities/sale'
import { useCan } from '@/entities/viewer'
import { formatDateTime, Perm, shortId } from '@/shared/lib'
import { ConfirmDialog, EmptyState, errorMessage, Panel, QueryView } from '@/shared/ui'
import { useConfirmReturn } from '../model/queries'

function Row({ item, canConfirm, onConfirm }: { item: PendingReturn; canConfirm: boolean; onConfirm: () => void }) {
  return (
    <Table.Tr>
      <Table.Td>{formatDateTime(item.at)}</Table.Td>
      <Table.Td><Text fw={600} fz="md">{item.title}</Text><Text fz="sm" c="dimmed">{item.reason}</Text></Table.Td>
      <Table.Td>{item.quantity}</Table.Td>
      <Table.Td>{conditionLabel[item.condition]}</Table.Td>
      <Table.Td ff="monospace" fz={13}>{shortId(item.sale)}</Table.Td>      {canConfirm && <Table.Td><Button size="xs" onClick={onConfirm}>Підтвердити</Button></Table.Td>}
    </Table.Tr>
  )
}

/** Returns created in this browser and awaiting confirmation (the API cannot list them yet, GAP-16). */
export function PendingReturns() {
  const can = useCan()
  const canConfirm = can(Perm.ReturnsConfirm)
  const query = usePendingReturns()
  const confirm = useConfirmReturn()
  const [target, setTarget] = useState<PendingReturn | null>(null)

  return (
    <Panel title="Чекають підтвердження" extra={<Text fz="sm" c="dimmed">створені в цьому браузері</Text>}>
      {confirm.isError && <Alert color="red" variant="light" m="md">{errorMessage(confirm.error)}</Alert>}
      <QueryView query={query} skeletonRows={3} isEmpty={(items) => items.length === 0}
        empty={<EmptyState icon={<IconArrowBackUp size={36} stroke={1.75} />} title="Немає повернень, що чекають"
          text="Створене тут повернення з’явиться в цьому списку до підтвердження." />}>
        {(items) => (
          <Table.ScrollContainer minWidth={600}>
            <Table verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Час</Table.Th><Table.Th>Книга</Table.Th><Table.Th>К-сть</Table.Th>
                  <Table.Th>Стан книги</Table.Th><Table.Th>Продаж</Table.Th>
                  {canConfirm && <Table.Th />}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {items.map((item) => <Row key={item.id} item={item} canConfirm={canConfirm} onConfirm={() => setTarget(item)} />)}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </QueryView>
      <ConfirmDialog opened={target !== null} title="Підтвердити повернення?" confirmLabel="Підтвердити"
        loading={confirm.isPending} onClose={() => setTarget(null)}
        onConfirm={() => target && confirm.mutate(target.id, { onSettled: () => setTarget(null) })}>
        <Text>«{target?.title}», {target?.quantity} шт. — повернення буде проведено. Скасувати це не можна.</Text>
      </ConfirmDialog>
    </Panel>
  )
}
