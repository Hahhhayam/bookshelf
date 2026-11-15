import { Stack, Text, Title } from '@mantine/core'
import type { BookCard } from '@/entities/book'
import { referenceName } from '@/entities/reference'
import { tokens } from '@/shared/config/tokens'

/** «Про книгу»: what the card carries; description, year and pages are not in the API (GAP-24). */
export function BookDetails({ book }: { book: BookCard }) {
  const rows: [string, string, boolean?][] = [
    ['Видавництво', referenceName('publishers', book.publisher)],
    ['Категорія', referenceName('categories', book.category)],
    ['ISBN', book.isbn ?? '—', true],
  ]
  return (
    <Stack gap="sm" component="section" style={{ flex: 1, minWidth: 0 }}>
      <Title order={2} fz={18}>Про книгу</Title>
      <dl style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '6px 24px', margin: 0, maxWidth: 420 }}>
        {rows.map(([label, value, mono]) => [
          <Text key={`${label}-t`} component="dt" c={tokens.color.ink2}>{label}</Text>,
          <Text key={`${label}-d`} component="dd" m={0} ff={mono ? tokens.font.mono : undefined}>{value}</Text>,
        ])}
      </dl>
    </Stack>
  )
}
