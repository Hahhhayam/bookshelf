import { Anchor, Group, Stack, Table, Text, Title } from '@mantine/core'
import type { Availability } from '@/entities/book'
import { storeName, useStores } from '@/entities/store'
import { myStore as myStoreModel } from '@/features/shop-my-store'
import { tokens } from '@/shared/config/tokens'
import { StatusNote } from '@/shared/ui'

/** «Наявність у магазинах»: the book's availability at each store. */
export function AvailabilityTable({ availability, myStore }: { availability: readonly Availability[]; myStore: string | null }) {
  return (
    <Stack gap={6} component="section" aria-labelledby="availability-title">
      <Title id="availability-title" order={2} fz={18}>Наявність у магазинах</Title>
      {availability.length === 0
        ? <Text c="dimmed">Зараз немає в жодному магазині.</Text>
        : (
          <Table verticalSpacing="sm" fz="md">
            <Table.Tbody>
              {availability.map((row) => <AvailabilityRow key={row.location} row={row} mine={row.location === myStore} />)}
            </Table.Tbody>
          </Table>
        )}
    </Stack>
  )
}

function AvailabilityRow({ row, mine }: { row: Availability; mine: boolean }) {
  const stores = useStores().data
  return (
    <Table.Tr>
      <Table.Td>
        <Group gap={6} wrap="wrap">
          <Text fw={mine ? 700 : 400}>{storeName(stores, row.location)}</Text>
          {mine
            ? <Text size="sm" c={tokens.color.ink2}>· ваш</Text>
            : <Anchor component="button" type="button" size="sm" onClick={() => myStoreModel.set(row.location)}>зробити моїм</Anchor>}
        </Group>
      </Table.Td>
      <Table.Td ta="right">
        {row.available > 0
          ? <StatusNote tone="ready" size={14}>{row.available} шт.</StatusNote>
          : <StatusNote tone="draft" size={14}>Немає</StatusNote>}
      </Table.Td>
    </Table.Tr>
  )
}
