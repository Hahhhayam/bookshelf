import { Table, Text } from '@mantine/core'
import type { ReactNode } from 'react'

export interface Column {
  label: string
  numeric?: boolean
}

/** A compact read-only table for the report sections; an empty one says so in one line. */
export function SimpleTable({ columns, rows, empty = 'Немає даних за цей період' }: {
  columns: Column[]
  rows: { key: string; cells: ReactNode[] }[]
  empty?: string
}) {
  if (rows.length === 0) return <Text c="dimmed" size="sm" p="md">{empty}</Text>
  const align = (column: Column | undefined) => (column?.numeric ? 'right' : 'left')
  return (
    <Table.ScrollContainer minWidth={420}>
      <Table verticalSpacing="xs">
        <Table.Thead>
          <Table.Tr>
            {columns.map((column) => <Table.Th key={column.label} style={{ textAlign: align(column) }}>{column.label}</Table.Th>)}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row) => (
            <Table.Tr key={row.key}>
              {row.cells.map((cell, i) => (
                <Table.Td key={i} style={{ textAlign: align(columns[i]), whiteSpace: columns[i]?.numeric ? 'nowrap' : undefined }}>
                  {cell}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}
