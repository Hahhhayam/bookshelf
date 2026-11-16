import { Group, Stack, Text } from '@mantine/core'
import { BookLookup, type BookHit } from '@/entities/book'
import { MoneyText } from '@/shared/ui'

/** The returned book, found by scan, ISBN or title. */
export function BookPicker({ value, onChange }: { value: BookHit | null; onChange: (hit: BookHit | null) => void }) {
  return (
    <Stack gap="xs">
      <BookLookup label="Книга" placeholder="Скан, ISBN або назва" onPick={onChange} />
      {value && (
        <Group justify="space-between" p="sm" style={{ background: 'var(--mantine-color-plum-0)' }}>
          <Text fw={600}>{value.title}</Text>
          <MoneyText value={value.price} />
        </Group>
      )}
    </Stack>
  )
}
