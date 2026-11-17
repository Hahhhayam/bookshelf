import { Anchor, Stack } from '@mantine/core'
import { Link, useParams } from 'react-router'
import { useDelivery, type GoodsReceiptCard } from '@/entities/purchase-order'
import { useReferenceNames, useLocationNames, useUserNames } from '@/entities/reference'
import { formatDateTime, shortId } from '@/shared/lib'
import { PageHeader, Panel, QueryView, StatusBadge } from '@/shared/ui'
import { FactGrid, type Fact } from '@/widgets/document-card'
import { ReceiptDiscrepancies } from './ui/ReceiptDiscrepancies'
import { ReceiptLines } from './ui/ReceiptLines'

/** A receiving document (scenario 3.9): what was received, with the discrepancies recorded separately. */
export default function GoodsReceiptPage() {
  const { id } = useParams()
  const receipt = useDelivery(id)
  return <QueryView query={receipt}>{(data) => <ReceiptDocument receipt={data} />}</QueryView>
}

function ReceiptDocument({ receipt }: { receipt: GoodsReceiptCard }) {
  const facts = useReceiptFacts(receipt)
  const hasDiscrepancies = receipt.discrepancies.length > 0
  return (
    <Stack gap="lg">
      <PageHeader
        eyebrow={<Anchor component={Link} to="/staff/receiving" size="sm">Приймання поставки</Anchor>}
        title={`Приймання ${shortId(receipt.id)}`}
        after={hasDiscrepancies
          ? <StatusBadge tone="problem" label="Розбіжності" />
          : <StatusBadge tone="done" label="Прийнято" />}
      />
      <FactGrid facts={facts} />
      {hasDiscrepancies && <ReceiptDiscrepancies discrepancies={receipt.discrepancies} />}
      <Panel title="Позиції"><ReceiptLines lines={receipt.lines} planned={!!receipt.purchaseOrder} /></Panel>
    </Stack>
  )
}

function useReceiptFacts(receipt: GoodsReceiptCard): Fact[] {
  const supplierName = useReferenceNames('suppliers')
  const locationName = useLocationNames()
  const userName = useUserNames()
  const units = receipt.lines.reduce((sum, line) => sum + line.received, 0)
  return [
    { label: 'Постачальник', value: supplierName(receipt.supplier) },
    { label: 'Локація', value: locationName(receipt.location) },
    {
      label: 'Підстава',
      value: receipt.purchaseOrder
        ? <Anchor component={Link} to={`/staff/purchase-orders/${receipt.purchaseOrder}`}>Замовлення {shortId(receipt.purchaseOrder)}</Anchor>
        : 'Незапланована поставка',
    },
    { label: 'Прийнято одиниць', value: units },
    { label: 'Підтверджено', value: `${formatDateTime(receipt.confirmedAt)} · ${receipt.confirmedBy ? userName(receipt.confirmedBy) : '—'}` },
  ]
}
