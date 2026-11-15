import { Anchor, Button, Group, Stack, Text } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import { Link } from 'react-router'
import type { Availability } from '@/entities/book'
import { cart, type CartLine } from '@/entities/cart'
import { availabilitySummary } from '@/features/shop-my-store'
import { tokens } from '@/shared/config/tokens'
import { MoneyText } from '@/shared/ui'
import { AvailabilityNote, BookCover, QuantityStepper } from '@/widgets/shop-kit'

export function CartLineRow({ line, myStore, availability }: {
  line: CartLine
  myStore: string | null
  availability: readonly Availability[] | null
}) {
  const hint = availability ? availabilitySummary(availability, myStore) : null
  return (
    <Group align="flex-start" gap="md" py="md" wrap="nowrap" style={{ borderBottom: `1px solid ${tokens.color.line}` }}>
      <div style={{ width: 64, flex: 'none' }}>
        <BookCover id={line.book} title={line.title} size="sm" />
      </div>
      <Group justify="space-between" align="flex-start" gap="md" style={{ flex: 1, minWidth: 0 }}>
        <Stack gap={4} style={{ flex: '1 1 200px', minWidth: 0 }}>
          <Anchor component={Link} to={`/books/${line.book}`} c="var(--mantine-color-text)" fw={600} fz={17}>{line.title}</Anchor>
          {hint && <AvailabilityNote tone={hint.tone}>{hint.label}</AvailabilityNote>}
          <Button variant="subtle" size="compact-sm" px={0} w="fit-content" leftSection={<IconX size={14} />}
            onClick={() => cart.remove(line.book)}>
            Прибрати
          </Button>
        </Stack>
        <Group gap="lg" wrap="nowrap">
          <QuantityStepper value={line.quantity} onChange={(next) => cart.setQuantity(line.book, next)} />
          <Stack gap={0} align="flex-end" miw={110}>
            <MoneyText value={{ ...line.price, amount: line.price.amount * line.quantity }} variant="strong" size={18} />
            {line.quantity > 1 && <Text size="sm" c={tokens.color.ink3}>{line.quantity} × <MoneyText value={line.price} /></Text>}
          </Stack>
        </Group>
      </Group>
    </Group>
  )
}
