import { Alert, Group, Loader, Stack, Text, UnstyledButton } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { forwardRef, useState } from 'react'
import { bookApi, type BookHit } from '@/entities/book'
import { tokens } from '@/shared/config/tokens'
import { ErrorView, MoneyText, ScanField } from '@/shared/ui'

/**
 * Finds a book by a scanned code or typed text. One hit is picked at once; several are offered to choose from.
 * A shop barcode that is not an ISBN is found through text search only (GAP-06).
 */
export const BookLookup = forwardRef<HTMLInputElement, {
  onPick: (book: BookHit) => void
  placeholder?: string
  label?: string
  autoFocus?: boolean
}>(function BookLookup({ onPick, placeholder = 'Скан ISBN або назва книги', label, autoFocus }, ref) {
  const [choices, setChoices] = useState<{ code: string; hits: BookHit[] } | null>(null)
  const find = useMutation({
    mutationFn: (code: string) => bookApi.findByCode(code),
    onSuccess: (hits, code) => {
      if (hits.length === 1) {
        setChoices(null)
        onPick(hits[0]!)
      } else {
        setChoices({ code, hits })
      }
    },
  })

  function pick(book: BookHit) {
    setChoices(null)
    onPick(book)
  }

  return (
    <Stack gap="xs">
      <ScanField ref={ref} label={label} placeholder={placeholder} autoFocus={autoFocus} onScan={(code) => find.mutate(code)} />
      {find.isPending && <Group gap="xs"><Loader size="xs" /><Text size="sm" c="dimmed">Шукаємо…</Text></Group>}
      {find.isError && <ErrorView error={find.error} />}
      {choices && choices.hits.length === 0 && (
        <Alert color="yellow" variant="light">За «{choices.code}» нічого не знайдено. Перевірте код або введіть назву.</Alert>
      )}
      {choices && choices.hits.length > 1 && (
        <HitList code={choices.code} hits={choices.hits} onPick={pick} />
      )}
    </Stack>
  )
})

function HitList({ code, hits, onPick }: { code: string; hits: BookHit[]; onPick: (book: BookHit) => void }) {
  return (
    <div style={{ border: `1px solid ${tokens.color.line}`, background: tokens.color.surface }}>
      <Text size="sm" c="dimmed" px="md" py={8} style={{ borderBottom: `1px solid ${tokens.color.line}` }}>
        За «{code}» знайдено {hits.length} — оберіть потрібну книгу
      </Text>
      {hits.slice(0, 8).map((hit) => (
        <UnstyledButton
          key={hit.id}
          onClick={() => onPick(hit)}
          px="md"
          py={8}
          style={{ display: 'flex', width: '100%', justifyContent: 'space-between', gap: 12, borderBottom: `1px solid ${tokens.color.sunk}` }}
        >
          <Text size="sm" fw={600}>{hit.title}</Text>
          <MoneyText value={hit.price} variant="muted" size={13} />
        </UnstyledButton>
      ))}
    </div>
  )
}
