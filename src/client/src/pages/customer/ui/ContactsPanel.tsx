import { Button, Group, SimpleGrid, Stack, Text } from '@mantine/core'
import { useState } from 'react'
import type { CustomerCard } from '@/entities/customer'
import { referenceName } from '@/entities/reference'
import { useCan } from '@/entities/viewer'
import { ChangeSegmentsButton } from '@/features/crm-change-segments'
import { tokens } from '@/shared/config/tokens'
import { maskEmail, maskPhone, Perm } from '@/shared/lib'
import { Panel } from '@/shared/ui'

function Hidden({ value, mask, mono }: { value: string | null; mask: (v: string) => string; mono?: boolean }) {
  const [shown, setShown] = useState(false)
  if (!value) return <Text c="dimmed">—</Text>
  return (
    <Group gap="xs">
      <Text style={mono ? { fontFamily: tokens.font.mono } : undefined}>{shown ? value : mask(value)}</Text>
      {!shown && <Button variant="subtle" size="compact-xs" onClick={() => setShown(true)}>Показати</Button>}
    </Group>
  )
}

export function ContactsPanel({ customer }: { customer: CustomerCard }) {
  const can = useCan()
  return (
    <Panel title="Контакти" padding={16}>
      <Stack gap="md">
        <SimpleGrid cols={2} spacing="xs" verticalSpacing="sm" style={{ gridTemplateColumns: '120px 1fr' }}>
          <Text c="dimmed" size="sm">Телефон</Text><Hidden value={customer.phone} mask={maskPhone} mono />
          <Text c="dimmed" size="sm">E-mail</Text><Hidden value={customer.email} mask={maskEmail} />
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
