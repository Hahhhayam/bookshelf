import { ActionIcon, Group, Table, Text } from '@mantine/core'
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react'
import { useState } from 'react'
import { AuditChanges, auditActionBadge, auditSubjectLabel, type AuditRecord } from '@/entities/audit'
import { formatDateTime } from '@/shared/lib'
import { Initials, StatusBadge } from '@/shared/ui'
import type { AuditNames } from '../model/useAuditNames'

/** Audit records: time, who, action and subject, key fields before → after; a row expands to a field per row. */
export function AuditTable({ records, names }: { records: AuditRecord[]; names: AuditNames }) {
  const [open, setOpen] = useState<ReadonlySet<string>>(new Set())
  const toggle = (id: string) => setOpen((current) => {
    const next = new Set(current)
    if (!next.delete(id)) next.add(id)
    return next
  })

  return (
    <Table.ScrollContainer minWidth={860}>
      <Table verticalSpacing="sm" style={{ tableLayout: 'fixed' }}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={44} aria-label="Розгорнути" />
            <Table.Th w={120}>Час</Table.Th>
            <Table.Th w={200}>Хто</Table.Th>
            <Table.Th w={280}>Дія та об’єкт</Table.Th>
            <Table.Th>Було → стало</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {records.map((record) => {
            const expanded = open.has(record.id)
            const who = names.userName(record)
            return (
              <Table.Tr key={record.id} style={{ verticalAlign: 'top' }}>
                <Table.Td>
                  <ActionIcon variant="subtle" color="gray" aria-expanded={expanded} aria-label="Показати зміни" onClick={() => toggle(record.id)}>
                    {expanded ? <IconChevronDown size={18} stroke={1.75} /> : <IconChevronRight size={18} stroke={1.75} />}
                  </ActionIcon>
                </Table.Td>
                <Table.Td><Text size="sm" style={{ whiteSpace: 'nowrap' }}>{formatDateTime(record.at)}</Text></Table.Td>
                <Table.Td>
                  <Group gap={8} wrap="nowrap">
                    <Initials name={who.replace(/[#._-]/g, ' ')} size={28} />
                    <Text size="sm" truncate>{who}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Group gap={8}>
                    <StatusBadge {...auditActionBadge(record.action)} />
                    <Text size="sm" fw={500} truncate>{auditSubjectLabel(record.action, record.subject, names.subjectName)}</Text>
                  </Group>
                </Table.Td>
                <Table.Td><AuditChanges changes={record.changes} expanded={expanded} valueText={names.valueText} /></Table.Td>
              </Table.Tr>
            )
          })}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}
