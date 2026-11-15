import { Anchor, Group, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router'
import { tierLabel, type CustomerCard } from '@/entities/customer'
import { tokens } from '@/shared/config/tokens'
import { Initials, StatusBadge } from '@/shared/ui'
import { maskCard } from './mask'

export function CustomerHeader({ customer }: { customer: CustomerCard }) {
  return (
    <Stack gap="sm">
      <Anchor component={Link} to="/staff/customers" size="sm">Клієнти</Anchor>
      <Group gap="md" wrap="nowrap" align="center">
        <Initials name={customer.name} size={56} solid />
        <Stack gap={4}>
          <Group gap="sm">
            <Title order={1}>{customer.name}</Title>
            <StatusBadge tone={customer.tier === 'Basic' ? 'draft' : 'attention'} label={`${tierLabel[customer.tier]} рівень`} />
          </Group>
          <Text size="sm" c="dimmed">
            Картка лояльності <span style={{ fontFamily: tokens.font.mono }}>{maskCard(customer.card)}</span>
          </Text>
        </Stack>
      </Group>
    </Stack>
  )
}
