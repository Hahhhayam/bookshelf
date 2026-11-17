import { Button, Group, Stack, Text, Title } from '@mantine/core'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { uah } from '@/shared/api'
import { cartCount, type Cart } from '@/entities/cart'
import { tokens } from '@/shared/config/tokens'
import { plural } from '@/shared/lib'
import { MoneyText } from '@/shared/ui'

const bookForms = ['книжка', 'книжки', 'книжок'] as const

export function CartSummary({ cart }: { cart: Cart }) {
  const count = cartCount(cart.lines)
  const total = cart.total ?? uah(0)
  return (
    <Stack component="aside" gap={6} p="lg" w={{ base: '100%', md: 380 }}
      style={{ flex: 'none', background: tokens.color.surface, border: `1px solid ${tokens.color.line}`, position: 'sticky', top: 96 }}>
      <Title order={2} fz={18} mb="xs">Разом</Title>
      <SummaryRow label={`${count} ${plural(count, bookForms)}`}><MoneyText value={total} /></SummaryRow>
      <Group justify="space-between" align="baseline" mt="xs" pt="sm" style={{ borderTop: `2px solid ${tokens.color.ink}` }}>
        <Text fz={16} fw={600}>До сплати</Text>
        <MoneyText value={total} variant="strong" size={30} />
      </Group>
      <Button component={Link} to="/checkout" size="lg" h={54} mt="md" fullWidth>Оформити замовлення</Button>
    </Stack>
  )
}

function SummaryRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Group justify="space-between" py={5} fz={15}>
      <Text fz={15} c={tokens.color.ink2}>{label}</Text>
      {children}
    </Group>
  )
}
