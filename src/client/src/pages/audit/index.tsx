import { Button, Group, Stack, Text } from '@mantine/core'
import { IconHistory } from '@tabler/icons-react'
import { useState } from 'react'
import { useAudit } from '@/entities/audit'
import { referenceName } from '@/entities/reference'
import { useViewer } from '@/entities/viewer'
import { formatNumber } from '@/shared/lib'
import { EmptyState, PageHeader, Panel, QueryView } from '@/shared/ui'
import { useAuditFilter } from './model/useAuditFilter'
import { AuditFilters } from './ui/AuditFilters'
import { AuditTable } from './ui/AuditTable'

const pageSize = 50

/** Who changed what and when (Audit artboard, UI_Design 6.9, FR-17); records cannot be edited. */
export default function AuditPage() {
  const state = useAuditFilter()
  const audit = useAudit(state.filter, state.enabled)
  const viewer = useViewer()
  const [shown, setShown] = useState(pageSize)

  // The API has no user names (GAP-04): the signed-in user and users remembered here get their login.
  const userName = (id: string | null) =>
    !id ? 'Система' : id === viewer.data?.id ? viewer.data.login : referenceName('users', id)

  return (
    <Stack gap="lg">
      <PageHeader eyebrow="хто, що й коли змінив · записи не редагуються" title="Журнал аудиту" />
      <AuditFilters state={state} />
      {!state.enabled
        ? <Panel><EmptyState icon={<IconHistory size={32} stroke={1.5} />} title="Задайте фільтр" text="Вкажіть об’єкт, дію або період, щоб побачити записи." /></Panel>
        : (
          <Panel>
            <QueryView
              query={audit} isEmpty={(list) => list.length === 0}
              empty={(
                <EmptyState
                  icon={<IconHistory size={32} stroke={1.5} />} title="За цими фільтрами — нічого"
                  text="Спробуйте ширший період або іншу дію." actions={<Button variant="default" onClick={state.reset}>Скинути фільтри</Button>}
                />
              )}
            >
              {(records) => {
                const sorted = [...records].sort((a, b) => b.at.localeCompare(a.at))
                return (
                  <>
                    <AuditTable records={sorted.slice(0, shown)} userName={userName} />
                    <Group justify="space-between" px="md" py="sm">
                      <Text size="sm" c="dimmed">
                        {formatNumber(Math.min(shown, sorted.length))} з {formatNumber(sorted.length)} записів
                      </Text>
                      {shown < sorted.length && <Button variant="subtle" onClick={() => setShown(shown + pageSize)}>Показати ще {pageSize}</Button>}
                    </Group>
                  </>
                )
              }}
            </QueryView>
          </Panel>
        )}
    </Stack>
  )
}
