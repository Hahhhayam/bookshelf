import { Group, SimpleGrid, Stack, Text } from '@mantine/core'
import type { CustomerCard } from '@/entities/customer'
import { referenceName } from '@/entities/reference'
import { useCan } from '@/entities/viewer'
import { ChangeSegmentsButton } from '@/features/crm-change-segments'
import { tokens } from '@/shared/config/tokens'
import { Perm } from '@/shared/lib'
import { Panel } from '@/shared/ui'

function Contact({ value, mono }: { value: string | null; mono?: boolean }) {
  if (!value) return <Text c="dimmed">—</Text>
  return <Text style={mono ? { fontFamily: tokens.font.mono } : undefined}>{value}</Text>
}

export function ContactsPanel({ customer }: { customer: CustomerCard }) {
  const can = useCan()
  return (
    <Panel title="Контакти" padding={16}>
      <Stack gap="md">
        <SimpleGrid cols={2} spacing="xs" verticalSpacing="sm" style={{ gridTemplateColumns: '120px 1fr' }}>
          <Text c="dimmed" size="sm">Телефон</Text><Contact value={customer.phone} mono />
          <Text c="dimmed" size="sm">E-mail</Text><Contact value={customer.email} />
        </SimpleGrid>
        <Stack gap={6} pt="sm" style={{ borderTop: `1px solid ${tokens.color.line}` }}>
          <Group justify="space-between">
            <Text size="xs" fw={600} c="dimmed" tt="uppercase">Сегменти</Text>
            {can(Perm.CrmManage) && <ChangeSegmentsButton customerId={customer.id} current={customer.segments} />}
          </Group>
          {customer.segments.length === 0
            ? <Text size="sm" c="dimmed">Не входить у жоден сегмент.</Text>
            : <Group gap={6}>{customer.segments.map((id) => <SegmentChip key={id} name={referenceName('segments', id)} />)}</Group>}
        </Stack>
      </Stack>
    </Panel>
  )
}

function SegmentChip({ name }: { name: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', height: 26, padding: '0 10px', fontSize: 13, fontWeight: 600,
      background: tokens.color.accentSoft, color: tokens.color.accent }}>
      {name}
    </span>
  )
}
