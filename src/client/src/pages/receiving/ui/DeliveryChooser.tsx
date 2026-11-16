import { Button, Group, Stack, Table, Text, UnstyledButton } from '@mantine/core'
import { IconPackageImport } from '@tabler/icons-react'
import { purchaseOrderStatus, usePurchaseOrders, type PurchaseOrderSummary } from '@/entities/purchase-order'
import { referenceName } from '@/entities/reference'
import { statusTone, tokens } from '@/shared/config/tokens'
import { formatDate } from '@/shared/lib'
import { EmptyState, ErrorView, Panel, StatusBadge } from '@/shared/ui'

/** Expected deliveries are the orders sent to suppliers and not yet fully received. */
function useExpectedDeliveries() {
  const sent = usePurchaseOrders({ status: 'Sent' })
  const partly = usePurchaseOrders({ status: 'PartlyReceived' })
  const rows = [...(sent.data ?? []), ...(partly.data ?? [])].sort((a, b) => a.expectedDate.localeCompare(b.expectedDate))
  return {
    rows,
    isPending: sent.isPending || partly.isPending,
    error: sent.error ?? partly.error,
    retry: () => { void sent.refetch(); void partly.refetch() },
  }
}

export function DeliveryChooser({ onPickOrder, onUnplanned }: { onPickOrder: (id: string) => void; onUnplanned: () => void }) {
  const deliveries = useExpectedDeliveries()
  return (
    <Panel
      title="Очікувані поставки"
      extra={<Button variant="default" leftSection={<IconPackageImport size={16} />} onClick={onUnplanned}>Незапланована поставка</Button>}
    >
      {deliveries.error ? <ErrorView error={deliveries.error} onRetry={deliveries.retry} />
        : deliveries.isPending ? <Text c="dimmed" size="sm" p="md">Завантажуємо очікувані поставки…</Text>
          : deliveries.rows.length === 0
            ? <EmptyState title="Поставок не очікується" text="Немає відправлених замовлень, які ще чекають на приймання. Товар без замовлення приймайте як незаплановану поставку." />
            : <DeliveryTable rows={deliveries.rows} onPick={onPickOrder} />}
    </Panel>
  )
}

function DeliveryTable({ rows, onPick }: { rows: PurchaseOrderSummary[]; onPick: (id: string) => void }) {
  return (
    <Table.ScrollContainer minWidth={520}>
      <Table highlightOnHover verticalSpacing={12} horizontalSpacing={12}>
        <Table.Thead>
          <Table.Tr><Table.Th>Постачальник</Table.Th><Table.Th>Статус</Table.Th><Table.Th>Очікувана поставка</Table.Th></Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row) => (
            <Table.Tr key={row.id} style={{ cursor: 'pointer' }} onClick={() => onPick(row.id)}>
              <Table.Td>
                <UnstyledButton onClick={() => onPick(row.id)} fw={600} c={tokens.color.accent}>
                  {referenceName('suppliers', row.supplier)}
                </UnstyledButton>
              </Table.Td>
              <Table.Td><StatusBadge {...purchaseOrderStatus[row.status]} /></Table.Td>
              <Table.Td>
                <Group gap={6} wrap="nowrap">
                  <Text span size="sm" c={row.isOverdue ? statusTone.attention.text : undefined} fw={row.isOverdue ? 600 : undefined}>
                    {formatDate(row.expectedDate)}
                  </Text>
                  {row.isOverdue && <StatusBadge tone="attention" label="Прострочено" />}
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}

export function NoLocation() {
  return (
    <Stack>
      <EmptyState title="Не вибрано склад" text="Приймання записується на робоче місце. Оберіть склад у перемикачі локації вгорі." />
    </Stack>
  )
}
