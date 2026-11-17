import { Table, Text } from '@mantine/core'
import { AuditChanges, auditActionBadge, auditValueText, useAudit } from '@/entities/audit'
import { useReferenceNames, useUserNames } from '@/entities/reference'
import { formatDateTime } from '@/shared/lib'
import { EmptyState, QueryView, StatusBadge } from '@/shared/ui'

/** The book's id-valued fields (category, publisher, authors) by name. */
function useBookValueText() {
  const names = { category: useReferenceNames('categories'), publisher: useReferenceNames('publishers'), authors: useReferenceNames('authors') }
  return (field: string, value: string) => {
    const nameOf = names[field as keyof typeof names]
    return nameOf ? value.split(',').map((id) => nameOf(id.trim())).join(', ') : auditValueText(value)
  }
}

/** «Історія» (3.10, FR-17): the audit records about this book, newest first. */
export function BookHistory({ bookId }: { bookId: string }) {
  const records = useAudit({ subject: bookId })
  const userName = useUserNames()
  const valueText = useBookValueText()
  return (
    <QueryView query={records} isEmpty={(rows) => rows.length === 0}
      empty={<EmptyState title="Історія порожня" text="Змін цієї книги ще не записано." />}>
      {(rows) => (
        <Table.ScrollContainer minWidth={640}>
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr><Table.Th>Час</Table.Th><Table.Th>Хто</Table.Th><Table.Th>Дія</Table.Th><Table.Th>Було → стало</Table.Th></Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {[...rows].sort((a, b) => b.at.localeCompare(a.at)).map((record) => (
                <Table.Tr key={record.id} style={{ verticalAlign: 'top' }}>
                  <Table.Td><Text size="sm" style={{ whiteSpace: 'nowrap' }}>{formatDateTime(record.at)}</Text></Table.Td>
                  <Table.Td><Text size="sm">{record.byLogin ?? userName(record.by)}</Text></Table.Td>
                  <Table.Td><StatusBadge {...auditActionBadge(record.action)} /></Table.Td>
                  <Table.Td>
                    <AuditChanges changes={record.changes} expanded valueText={valueText} />
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}
    </QueryView>
  )
}
