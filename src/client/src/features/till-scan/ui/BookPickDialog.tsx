import { Modal, Stack, Text } from '@mantine/core'
import { BookHitList, type BookHit } from '@/entities/book'
import { StockHere } from './StockHere'

/** A code that matched several books (a title typed into the scan field, GAP-06): the cashier picks one. */
export function BookPickDialog({ hits, code, locationId, onPick, onClose }: {
  hits: BookHit[] | null
  code: string
  locationId: string
  onPick: (hit: BookHit) => void
  onClose: () => void
}) {
  return (
    <Modal opened={hits !== null} onClose={onClose} centered size="lg" title={<Text fw={600} fz={20}>Знайдено кілька книжок</Text>}>
      <Stack gap="sm">
        <Text fz={14} c="dimmed">За запитом «{code}». ↑/↓ — вибрати, Enter — додати, Esc — назад.</Text>
        {hits && <BookHitList hits={hits} onPick={onPick} autoFocus caption={(hit) => <StockHere hit={hit} locationId={locationId} />} />}
      </Stack>
    </Modal>
  )
}
