import { Anchor, Text } from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'
import { Link } from 'react-router'
import { compactIsbn, isValidIsbn, useBookSearch } from '@/entities/book'
import { tokens } from '@/shared/config/tokens'

/** Under the ISBN field: whether the number is valid and not yet in the catalog (the server checks again). */
export function IsbnCheck({ isbn }: { isbn: string }) {
  const valid = isValidIsbn(isbn)
  const existing = useBookSearch({ isbn: compactIsbn(isbn) }, valid)
  if (!valid || existing.isPending) return null
  const taken = existing.data?.[0]
  if (taken) {
    return (
      <Text size="xs" c="red">
        Книга з таким ISBN уже є: <Anchor component={Link} to={`/staff/catalog/${taken.id}`} size="xs">{taken.title}</Anchor>
      </Text>
    )
  }
  return (
    <Text size="xs" fw={500} style={{ color: tokens.color.positive, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <IconCheck size={14} stroke={2} /> ISBN коректний, такої книги ще немає
    </Text>
  )
}
