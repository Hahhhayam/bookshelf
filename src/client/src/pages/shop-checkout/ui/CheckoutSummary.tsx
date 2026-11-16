import { Alert, Button, Group, Stack, Text, Title } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { uah } from '@/shared/api'
import { cartTotal, type CartLine } from '@/entities/cart'
import { referenceName } from '@/entities/reference'
import { tokens } from '@/shared/config/tokens'
import { MoneyText } from '@/shared/ui'
import type { CheckoutForm } from '../model/useCheckoutForm'

/** «Ваше замовлення» with the submit button; a refused order shows the server's own words here. */
export function CheckoutSummary({ lines, form, problem, pending }: {
  lines: readonly CartLine[]
  form: CheckoutForm
  problem: string | null
  pending: boolean
}) {
  return (
    <Stack component="aside" gap={6} p="lg" w={{ base: '100%', md: 380 }}
      style={{ flex: 'none', background: tokens.color.surface, border: `1px solid ${tokens.color.line}`, position: 'sticky', top: 96 }}>
      <Title order={2} fz={18} mb="xs">Ваше замовлення</Title>
      {lines.map((line) => (
        <Group key={line.book} justify="space-between" wrap="nowrap" py={5} gap="sm">
          <Text fz={15} style={{ minWidth: 0 }}>{line.title}{line.quantity > 1 ? ` × ${line.quantity}` : ''}</Text>
          <MoneyText value={{ ...line.price, amount: line.price.amount * line.quantity }} />
        </Group>
      ))}
      <FulfilmentRow form={form} />
      <Group justify="space-between" align="baseline" mt="xs" pt="sm" style={{ borderTop: `2px solid ${tokens.color.ink}` }}>
        <Text fz={16} fw={600}>До сплати</Text>
        <MoneyText value={uah(cartTotal(lines))} variant="strong" size={30} />
      </Group>
      {problem && <Alert color="red" icon={<IconAlertCircle size={18} />} mt="sm">{problem}</Alert>}
      <Button type="submit" size="lg" h={54} mt="md" fullWidth loading={pending}>Підтвердити замовлення</Button>
    </Stack>
  )
}

function FulfilmentRow({ form }: { form: CheckoutForm }) {
  const pickup = form.kind === 'Pickup'
  return (
    <Text fz={15} c={tokens.color.ink2} pb={5} mt={6} pt={10} style={{ borderTop: `1px solid ${tokens.color.sunk}` }}>
      {pickup ? `Самовивіз · ${form.pickupStore ? referenceName('locations', form.pickupStore) : 'магазин не обрано'}` : 'Доставка'}
    </Text>
  )
}
