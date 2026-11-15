import { Anchor, Button, Table } from '@mantine/core'
import { Link } from 'react-router'
import type { BookHit } from '@/entities/book'
import { BookStatusBadge } from '@/features/catalog-book-form'
import { formatNumber } from '@/shared/lib'
import { MoneyText } from '@/shared/ui'

/** Search returns only books on sale, so every row is active; a deactivated book opens by its link only (B-41). */
export function BookTable({ books }: { books: BookHit[] }) {
  return (
    <Table.ScrollContainer minWidth={640}>
      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Назва</Table.Th>
            <Table.Th ta="right">Ціна</Table.Th>
            <Table.Th ta="right">Доступно</Table.Th>
            <Table.Th>Статус</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {books.map((book) => (
            <Table.Tr key={book.id}>
              <Table.Td><Anchor component={Link} to={`/staff/catalog/${book.id}`} fw={600}>{book.title}</Anchor></Table.Td>
              <Table.Td ta="right"><MoneyText value={book.price} /></Table.Td>
              <Table.Td ta="right">{formatNumber(book.availability.reduce((sum, a) => sum + a.available, 0))}</Table.Td>
              <Table.Td><BookStatusBadge status="Active" /></Table.Td>
              <Table.Td ta="right">
                <Button component={Link} to={`/staff/catalog/${book.id}`} variant="subtle" size="xs">Редагувати</Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}
