import { Button, Group, Paper, Stack, Text } from '@mantine/core'
import { useState } from 'react'
import { bookApi, type BookHit } from '@/entities/book'
import { ScanField, errorMessage } from '@/shared/ui'

/**
 * Scan or search: one hit is picked at once, several are offered to choose from. A shop barcode that is not an ISBN
 * is found only by title (GAP-06).
 */
export function BookScan({ placeholder, onPick }: { placeholder: string; onPick: (book: BookHit) => void }) {
  const [hits, setHits] = useState<BookHit[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function scan(code: string) {
    setBusy(true)
    setMessage(null)
    setHits([])
    try {
      const found = await bookApi.findByCode(code)
      if (found.length === 1) onPick(found[0]!)
      else if (found.length === 0) setMessage(`За «${code}» нічого не знайдено`)
      else setHits(found.slice(0, 8))
    } catch (error) {
      setMessage(errorMessage(error))
    } finally {
      setBusy(false)
    }
  }

  function pick(book: BookHit) {
    setHits([])
    onPick(book)
  }

  return (
    <Stack gap={6}>
      <ScanField placeholder={busy ? 'Шукаю…' : placeholder} onScan={(code) => void scan(code)} autoFocus />
      {message && <Text size="sm" c="red">{message}</Text>}
      {hits.length > 0 && (
        <Paper withBorder p="xs">
          <Text size="sm" c="dimmed" mb={6}>Знайдено кілька книжок — оберіть потрібну:</Text>
          <Group gap="xs">
            {hits.map((hit) => <Button key={hit.id} size="xs" variant="default" onClick={() => pick(hit)}>{hit.title}</Button>)}
          </Group>
        </Paper>
      )}
    </Stack>
  )
}
