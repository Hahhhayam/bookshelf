import { Group, Stack, Table, Text } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { forwardRef, useState } from 'react'
import { bookApi } from '@/entities/book'
import { useReferenceNames } from '@/entities/reference'
import { EmptyState, MoneyText, Panel, QueryView, ScanField } from '@/shared/ui'

/** «Знайти книгу»: where a book is in the chain and how many. */
export const BookLookup = forwardRef<HTMLInputElement>(function BookLookup(_, ref) {
  const locationName = useReferenceNames('locations')
  const [code, setCode] = useState('')
  const query = useQuery({ queryKey: ['till-home', 'lookup', code], queryFn: () => bookApi.findByCode(code), enabled: code !== '' })
  return (
    <Panel title="Знайти книгу" padding={16}>
      <Stack gap="md">
        <ScanField ref={ref} placeholder="Скан, ISBN або назва" onScan={setCode} />
        {code && (
          <QueryView query={query} skeletonRows={3} isEmpty={(hits) => hits.length === 0}
            empty={<EmptyState title="Нічого не знайдено" text={`За запитом «${code}» книг немає.`} />}>
            {(hits) => (
              <Table verticalSpacing="sm">
                <Table.Tbody>
                  {hits.slice(0, 10).map((hit) => (
                    <Table.Tr key={hit.id}>
                      <Table.Td>
                        <Text fw={600}>{hit.title}</Text>
                        <Group gap="md">
                          {hit.availability.filter((a) => a.available > 0).map((a) => (
                            <Text key={a.location} fz="sm" c="dimmed">{locationName(a.location)} — {a.available} шт.</Text>
                          ))}
                          {hit.availability.every((a) => a.available === 0) && <Text fz="sm" c="red">Немає в наявності</Text>}
                        </Group>
                      </Table.Td>
                      <Table.Td style={{ textAlign: 'right' }}><MoneyText value={hit.price} variant="strong" /></Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </QueryView>
        )}
      </Stack>
    </Panel>
  )
})
