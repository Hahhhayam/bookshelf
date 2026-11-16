import { Button, Group, Stack, Text, Title } from '@mantine/core'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { uah } from '@/shared/api'
import { cartTotal, type CartLine } from '@/entities/cart'
import { tokens } from '@/shared/config/tokens'
import { plural } from '@/shared/lib'
import { MoneyText } from '@/shared/ui'

const bookForms = ['книжка', 'книжки', 'книжок'] as const

/** «Разом»: catalog prices; promotions are applied by the store, not shown here (GAP-24). */
export function CartSummary({ lines }: { lines: readonly CartLine[] }) {
  const count = lines.reduce((sum, line) => sum + line.quantity, 0)
  const total = uah(cartTotal(lines))
  return (
    <Stack component="aside" gap={6} p="lg" w={{ base: '100%', md: 380 }}
      style={{ flex: 'none', background: tokens.color.surface, border: `1px solid ${tokens.color.line}`, position: 'sticky', top: 96 }}>
      <Title order={2} fz={18} mb="xs">Разом</Title>
      <SummaryRow label={`${count} ${plural(count, bookForms)}`}><MoneyText value={total} /></SummaryRow>
      <SummaryRow label="Отримання"><Text fz={15}>обираєте далі</Text></SummaryRow>
      <Group justify="space-between" align="baseline" mt="xs" pt="sm" style={{ borderTop: `2px solid ${tokens.color.ink}` }}>
        <Text fz={16} fw={600}>До сплати</Text>
        <MoneyText value={total} variant="strong" size={30} />
      </Group>
      <Button component={Link} to="/checkout" size="lg" h={54} mt="md" fullWidth>Оформити замовлення</Button>
      <Text size="sm" c={tokens.color.ink2} ta="center" mt="xs">Безкоштовний самовивіз з будь-якого магазину</Text>
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
