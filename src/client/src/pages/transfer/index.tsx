import { useParams } from 'react-router'
import { useLocationNames, useUserNames } from '@/entities/reference'
import {
  transferBadge, transferSide, transferStatus, useTransfer, type TransferCard, type TransferStatus,
} from '@/entities/transfer'
import { useCan, useWorkingLocation } from '@/entities/viewer'
import { formatDateTime, Perm, shortId } from '@/shared/lib'
import { QueryView } from '@/shared/ui'
import { DocumentCard, type Fact } from '@/widgets/document-card'
import { DiscrepancyPanel } from './ui/DiscrepancyPanel'
import { ReceivePanel } from './ui/ReceivePanel'
import { TransferActions } from './ui/TransferActions'
import { TransferLines } from './ui/TransferLines'

const statusLabel = (status: string) => transferStatus[status as TransferStatus]?.label ?? (status || 'Створено')

export default function TransferPage() {
  const { id } = useParams()
  const transfer = useTransfer(id)
  return <QueryView query={transfer}>{(data) => <TransferDocument transfer={data} />}</QueryView>
}

function TransferDocument({ transfer }: { transfer: TransferCard }) {
  const location = useWorkingLocation()
  const can = useCan()
  const side = transferSide(transfer, location?.id)
  const facts = useTransferFacts(transfer)
  const receiving = transfer.status === 'Shipped' && side === 'receiver' && can(Perm.TransfersManage)
  const hasOpen = transfer.discrepancies.some((d) => !d.isResolved)

  return (
    <DocumentCard
      crumb={{ label: 'Переміщення', to: '/staff/transfers' }}
      title={`Переміщення ${shortId(transfer.id)}`}
      status={transferBadge(transfer.status, hasOpen)}
      actions={<TransferActions transfer={transfer} side={side} />}
      facts={facts}
      tabs={[{ value: 'lines', label: 'Позиції', count: transfer.lines.length, content: <TransferLines transfer={transfer} /> }]}
      history={{ entries: transfer.history, label: statusLabel }}
    >
      {transfer.discrepancies.length > 0 && <DiscrepancyPanel transfer={transfer} />}
      {receiving && <ReceivePanel transfer={transfer} />}
    </DocumentCard>
  )
}

function useTransferFacts(transfer: TransferCard): Fact[] {
  const locationName = useLocationNames()
  const userName = useUserNames()
  const units = transfer.lines.reduce((sum, line) => sum + line.shipped, 0)
  const at = (status: TransferStatus) => {
    const entry = transfer.history.find((h) => h.to === status)
    return entry ? `${formatDateTime(entry.at)} · ${userName(entry.by)}` : '—'
  }
  return [
    { label: 'Звідки', value: locationName(transfer.from) },
    { label: 'Куди', value: locationName(transfer.to) },
    { label: 'Позицій / одиниць', value: `${transfer.lines.length} / ${units}` },
    { label: 'Відправлено', value: at('Shipped') },
    { label: 'Отримано', value: at('Received') },
  ]
}
