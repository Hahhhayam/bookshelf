import { Text } from '@mantine/core'
import { transferStep, type TransferCard, type TransferSide } from '@/entities/transfer'
import { useCan } from '@/entities/viewer'
import { TransferStepButton } from '@/features/ops-transfer-steps'
import { Perm } from '@/shared/lib'

/** The step button for this side of the route, or a note of whose turn it is; receiving has its own form. */
export function TransferActions({ transfer, side }: { transfer: TransferCard; side: TransferSide }) {
  const can = useCan()
  const step = transferStep[transfer.status]
  if (!step || !can(Perm.TransfersManage)) return null
  if (step.side !== side) return <Text size="sm" c="dimmed">{step.waiting}</Text>
  if (step.kind === 'receive') return <Text size="sm" c="dimmed">Внесіть фактичні кількості нижче</Text>
  return <TransferStepButton id={transfer.id} step={{ ...step, kind: step.kind }} />
}
