import { Modal, Stack, Text, TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'
import { useState } from 'react'
import { useBookSearch, type BookHit } from '@/entities/book'
import { EmptyState, QueryView } from '@/shared/ui'
import { BookHitList } from './BookHitList'

function Results({ text, locationId, onPick }: { text: string; locationId: string; onPick: (hit: BookHit) => void }) {
  const query = useBookSearch({ text }, text.length >= 2)
  if (text.length < 2) return <Text fz={14} c="dimmed">Введіть щонайменше дві літери назви.</Text>
  return (
    <QueryView query={query} skeletonRows={3} isEmpty={(hits) => hits.length === 0}
      empty={<EmptyState title="Нічого не знайдено" text="Перевірте назву або скануйте штрихкод." />}>
      {(hits) => <BookHitList hits={hits.slice(0, 20)} locationId={locationId} onPick={onPick} />}
    </QueryView>
  )
}

/** F2: books by title, for an item without a readable barcode. */
export function TitleSearchDialog({ opened, locationId, onPick, onClose }: {
  opened: boolean
  locationId: string
  onPick: (hit: BookHit) => void
  onClose: () => void
}) {
  const [text, setText] = useState('')
  const [debounced] = useDebouncedValue(text.trim(), 300)
  function close() {
    setText('')
    onClose()
  }
  return (
    <Modal opened={opened} onClose={close} centered size="lg" title={<Text fw={600} fz={20}>Пошук за назвою</Text>}>
      <Stack gap="md">
        <TextInput data-autofocus size="lg" placeholder="Назва книги" aria-label="Назва книги"
          leftSection={<IconSearch size={20} stroke={1.75} />} value={text}
          onChange={(e) => setText(e.currentTarget.value)} />
        <Results text={debounced} locationId={locationId} onPick={(hit) => { setText(''); onPick(hit) }} />
      </Stack>
    </Modal>
  )
}
