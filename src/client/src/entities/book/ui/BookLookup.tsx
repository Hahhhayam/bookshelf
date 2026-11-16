import { Alert, Stack, Text } from '@mantine/core'
import { useState } from 'react'
import { ErrorView, ScanField } from '@/shared/ui'
import { useFindBook } from '../model/queries'
import type { BookHit } from '../model/types'
import { BookHitList } from './BookHitList'

/**
 * Finds a book by a scanned code or typed text. One hit is picked at once; several are offered to choose from.
 * A shop barcode that is not an ISBN is found through text search only (GAP-06).
 */
export function BookLookup({ onPick, placeholder = 'Скан ISBN або назва книги', label, autoFocus }: {
  onPick: (book: BookHit) => void
  placeholder?: string
  label?: string
  autoFocus?: boolean
}) {
  const [choices, setChoices] = useState<{ code: string; hits: BookHit[] } | null>(null)
  const find = useFindBook()

  function pick(book: BookHit) {
    setChoices(null)
    onPick(book)
  }

  function scan(code: string) {
    find.mutate(code, { onSuccess: (hits) => (hits.length === 1 ? pick(hits[0]!) : setChoices({ code, hits })) })
  }

  return (
    <Stack gap="xs">
      <ScanField label={label} placeholder={placeholder} autoFocus={autoFocus} busy={find.isPending} onScan={scan} />
      {find.isError && <ErrorView error={find.error} />}
      {choices && choices.hits.length === 0 && (
        <Alert color="yellow" variant="light">За «{choices.code}» нічого не знайдено. Перевірте код або введіть назву.</Alert>
      )}
      {choices && choices.hits.length > 1 && (
        <Stack gap={4}>
          <Text size="sm" c="dimmed">За «{choices.code}» знайдено {choices.hits.length} — оберіть потрібну книгу</Text>
          <BookHitList hits={choices.hits.slice(0, 8)} onPick={pick} dense />
        </Stack>
      )}
    </Stack>
  )
}
