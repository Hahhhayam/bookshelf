import { Alert, Group, Loader, Stack, Text } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import { tokens } from '@/shared/config/tokens'
import { MoneyText } from '@/shared/ui'
import type { ReceiptQuote } from '../model/useReceiptQuote'

function booksWord(count: number) {
  const last = count % 10
  const teen = count % 100 >= 11 && count % 100 <= 14
  if (last === 1 && !teen) return 'книжка'
  if (last >= 2 && last <= 4 && !teen) return 'книжки'
  return 'книжок'
}

/** «До сплати» with the approximate-total hint while promotions are priced only by the server (GAP-05, B-01). */
export function ReceiptTotals({ count, quote }: { count: number; quote: ReceiptQuote }) {
  return (
    <Stack gap="md">
      <Group justify="space-between" fz={14}>
        <Text c={tokens.color.ink2} fz={14}>Сума, {count} {booksWord(count)}</Text>
        <MoneyText value={quote.total} />
      </Group>
      {!quote.exact && count > 0 && (
        <Alert color="gray" variant="light" p="xs" icon={<IconInfoCircle size={18} stroke={1.75} />}>
          <Text fz={13}>Сума без урахування акцій — остаточну рахує сервер.</Text>
        </Alert>
      )}
      <Stack gap={2} pt={14} pb={6} style={{ borderTop: `2px solid ${tokens.color.ink}` }}>
        <Group gap="xs">
          <Text fz={14} fw={600} c={tokens.color.ink2}>До сплати</Text>
          {quote.pending && count > 0 && <Loader size="xs" color="plum" aria-label="Рахуємо суму" />}
        </Group>
        <span style={{ fontSize: 52, lineHeight: '60px', fontWeight: 700, letterSpacing: '-0.02em' }}>
          <MoneyText value={quote.total} />
        </span>
      </Stack>
    </Stack>
  )
}
