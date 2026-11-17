import { Alert, Group, Loader, Stack, Text } from '@mantine/core'
import { tokens } from '@/shared/config/tokens'
import { errorMessage, MoneyText } from '@/shared/ui'
import type { ReceiptQuote } from '../model/useReceiptQuote'

function booksWord(count: number) {
  const last = count % 10
  const teen = count % 100 >= 11 && count % 100 <= 14
  if (last === 1 && !teen) return 'книжка'
  if (last >= 2 && last <= 4 && !teen) return 'книжки'
  return 'книжок'
}

/** Sum, discounts and «До сплати» as the server priced them, with the bonus write-off the customer is allowed. */
export function ReceiptTotals({ count, quote }: { count: number; quote: ReceiptQuote }) {
  return (
    <Stack gap="md">
      <Group justify="space-between" fz={14}>
        <Text c={tokens.color.ink2} fz={14}>Сума, {count} {booksWord(count)}</Text>
        <MoneyText value={quote.subtotal} />
      </Group>
      {quote.discount.amount > 0 && (
        <Group justify="space-between" fz={14}>
          <Text c={tokens.color.ink2} fz={14}>Знижки й акції</Text>
          <Text fz={14} c={tokens.color.accent}>−<MoneyText value={quote.discount} /></Text>
        </Group>
      )}
      {quote.bonusAllowed && (
        <Group justify="space-between" fz={14}>
          <Text c={tokens.color.ink2} fz={14}>Можна списати бонусами</Text>
          <MoneyText value={quote.bonusAllowed} />
        </Group>
      )}
      {quote.error !== null && count > 0 && (
        <Alert color="red" variant="light" p="xs"><Text fz={13}>Суму не пораховано: {errorMessage(quote.error)}</Text></Alert>
      )}
      <Stack gap={2} pt={14} pb={6} style={{ borderTop: `2px solid ${tokens.color.ink}` }}>
        <Group gap="xs">
          <Text fz={14} fw={600} c={tokens.color.ink2}>До сплати</Text>
          {quote.pending && <Loader size="xs" color="plum" aria-label="Рахуємо суму" />}
        </Group>
        <span style={{ fontSize: 52, lineHeight: '60px', fontWeight: 700, letterSpacing: '-0.02em' }}>
          <MoneyText value={quote.total} />
        </span>
      </Stack>
    </Stack>
  )
}
