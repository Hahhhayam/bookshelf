import { Group, Stack, Text, Timeline } from '@mantine/core'
import { bonusKindLabel, type BonusKind, type CustomerCard } from '@/entities/customer'
import { tokens } from '@/shared/config/tokens'
import { formatDateTime, formatNumber, shortId } from '@/shared/lib'
import { Panel } from '@/shared/ui'

/** Accruals add points; redemptions and reversals take them away (the balance never goes negative, FR-14). */
const direction: Record<BonusKind, { sign: string; color: string }> = {
  Accrual: { sign: '+', color: tokens.color.positive },
  Redemption: { sign: '−', color: tokens.color.ink },
  Reversal: { sign: '−', color: tokens.color.danger },
}

export function BonusPanel({ customer }: { customer: CustomerCard }) {
  return (
    <Panel padding={16}>
      <Stack gap="md">
        <Group justify="space-between" align="flex-end">
          <Stack gap={2}>
            <Text size="xs" fw={600} c="dimmed" tt="uppercase">Бонусний рахунок</Text>
            <Text fz={32} fw={700} lh="40px">{formatNumber(customer.bonusBalance)} <Text span fz={16} fw={500} c="dimmed">балів</Text></Text>
          </Stack>
        </Group>
        {customer.bonusOperations.length === 0
          ? <Text size="sm" c="dimmed">Операцій з бонусами ще не було.</Text>
          : <Operations operations={customer.bonusOperations} />}
      </Stack>
    </Panel>
  )
}

function Operations({ operations }: { operations: CustomerCard['bonusOperations'] }) {
  return (
    <Timeline bulletSize={10} lineWidth={2}>
      {operations.map((op) => (
        <Timeline.Item key={`${op.at}-${op.document}-${op.kind}`}
          title={
            <Group justify="space-between" wrap="nowrap">
              <Text size="sm" fw={500}>{bonusKindLabel[op.kind]} · документ <span style={{ fontFamily: tokens.font.mono }}>{shortId(op.document)}</span></Text>
              <Text size="sm" fw={600} style={{ color: direction[op.kind].color, whiteSpace: 'nowrap' }}>
                {direction[op.kind].sign}{formatNumber(Math.abs(op.points))}
              </Text>
            </Group>
          }>
          <Text size="xs" c="dimmed">{formatDateTime(op.at)}</Text>
        </Timeline.Item>
      ))}
    </Timeline>
  )
}
