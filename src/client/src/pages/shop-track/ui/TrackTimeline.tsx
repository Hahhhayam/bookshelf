import { Group, Text, Timeline } from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'
import { orderStatus, type TrackedOrder } from '@/entities/order'
import { tokens } from '@/shared/config/tokens'
import { formatDateTime } from '@/shared/lib'
import { stepText, trackSteps, type TrackStep } from '../model/trackSteps'

/** Status changes with their time only (`to`, `at`): who made them is not the customer's business. */
export function TrackTimeline({ order }: { order: TrackedOrder }) {
  const steps = trackSteps(order)
  const current = steps.findIndex((s) => s.state === 'current')
  return (
    <Timeline active={current} bulletSize={28} lineWidth={2} component="ol" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {steps.map((step, i) => (
        <Timeline.Item key={`${step.status}-${i}`} bullet={step.state === 'done' ? <IconCheck size={16} stroke={2.5} /> : null}
          title={<StepTitle step={step} />} aria-current={step.state === 'current' ? 'step' : undefined} component="li">
          <Text size="md" c={tokens.color.ink2}>{stepText[step.status]}</Text>
        </Timeline.Item>
      ))}
    </Timeline>
  )
}

function StepTitle({ step }: { step: TrackStep }) {
  return (
    <Group justify="space-between" gap="sm" wrap="nowrap">
      <Text fz={16} fw={700} c={step.state === 'next' ? tokens.color.ink2 : undefined}>{orderStatus[step.status].label}</Text>
      {step.at && <Text size="md" c={tokens.color.ink2}>{formatDateTime(step.at)}</Text>}
    </Group>
  )
}
