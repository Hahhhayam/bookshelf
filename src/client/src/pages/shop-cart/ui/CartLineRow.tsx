import { Anchor, Button, Group, Stack, Text } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import { Link } from 'react-router'
import { availabilityStatusTone, availabilitySummary, BookCover, type Availability } from '@/entities/book'
import type { CartLine } from '@/entities/cart'
import { useEditCart } from '@/features/shop-edit-cart'
import { tokens } from '@/shared/config/tokens'
import { MoneyText, QuantityStepper, StatusNote } from '@/shared/ui'

export function CartLineRow({ line, customer, myStore, availability }: {
  line: CartLine
  customer: string
  myStore: string | null
  availability: readonly Availability[] | null
}) {
  const edit = useEditCart(customer)
  const hint = availability ? availabilitySummary(availability, myStore) : null
  return (
    <Group align="flex-start" gap="md" py="md" wrap="nowrap" style={{ borderBottom: `1px solid ${tokens.color.line}` }}>
      <div style={{ width: 64, flex: 'none' }}>
        <BookCover id={line.book} title={line.title} size="sm" />
      </div>
      <Group justify="space-between" align="flex-start" gap="md" style={{ flex: 1, minWidth: 0 }}>
        <Stack gap={4} style={{ flex: '1 1 200px', minWidth: 0 }}>
          <Anchor component={Link} to={`/books/${line.book}`} c="var(--mantine-color-text)" fw={600} fz={17}>{line.title}</Anchor>
          {hint && <StatusNote tone={availabilityStatusTone[hint.tone]}>{hint.label}</StatusNote>}
          <Button variant="subtle" size="compact-sm" px={0} w="fit-content" leftSection={<IconX size={14} />}
            loading={edit.remove.isPending} onClick={() => edit.remove.mutate(line.book)}>
            Прибрати
          </Button>
        </Stack>
        <Group gap="lg" wrap="nowrap">
          <QuantityStepper value={line.quantity} onChange={(next) => edit.setQuantity.mutate({ book: line.book, quantity: next })} />
          <Stack gap={0} align="flex-end" miw={110}>
            <MoneyText value={{ ...line.unitPrice, amount: line.unitPrice.amount * line.quantity }} variant="strong" size={18} />
            {line.quantity > 1 && <Text size="sm" c={tokens.color.ink3}>{line.quantity} × <MoneyText value={line.unitPrice} /></Text>}
          </Stack>
        </Group>
      </Group>
    </Group>
  )
}
