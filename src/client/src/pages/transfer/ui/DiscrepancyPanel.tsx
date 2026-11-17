import { Alert, Button, Group, Stack, Text, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconAlertTriangle } from '@tabler/icons-react'
import { useState } from 'react'
import type { TransferCard } from '@/entities/transfer'
import { useCan } from '@/entities/viewer'
import { useResolveDiscrepancies } from '@/features/ops-transfer-steps'
import { statusTone, tokens } from '@/shared/config/tokens'
import { Perm } from '@/shared/lib'
import { ConfirmDialog, errorMessage } from '@/shared/ui'
import { DiscrepancyTable } from './DiscrepancyTable'

/**
 * Discrepancies found at receiving, expected against actual (scenario 3.7, step 5). The reviewer gives a reason
 * per line and confirms; stock stays as it was received.
 */
export function DiscrepancyPanel({ transfer }: { transfer: TransferCard }) {
  const can = useCan()
  const [reasons, setReasons] = useState<Record<string, string>>({})
  const open = transfer.discrepancies.filter((d) => !d.isResolved)
  const editable = open.length > 0 && can(Perm.TransfersManage)
  const ready = open.filter((d) => reasons[d.id]?.trim()).map((d) => ({ discrepancy: d.id, reason: reasons[d.id]!.trim() }))
  const tone = open.length > 0 ? statusTone.problem : statusTone.done

  return (
    <section style={{ background: tokens.color.surface, border: `1px solid ${tokens.color.line}`, boxShadow: `inset 0 3px 0 ${tone.dot}` }}>
      <PanelHeading transfer={transfer} openCount={open.length} color={tone.dot} />
      <DiscrepancyTable
        discrepancies={transfer.discrepancies}
        editable={editable}
        reasons={reasons}
        onReason={(id, reason) => setReasons((current) => ({ ...current, [id]: reason }))}
      />
      {editable && <ConfirmBar transferId={transfer.id} ready={ready} open={open.length} onDone={() => setReasons({})} />}
    </section>
  )
}

function PanelHeading({ transfer, openCount, color }: { transfer: TransferCard; openCount: number; color: string }) {
  const delta = transfer.discrepancies.reduce((sum, d) => sum + d.actual - d.expected, 0)
  const shipped = transfer.lines.reduce((sum, line) => sum + line.shipped, 0)
  const received = transfer.lines.reduce((sum, line) => sum + (line.received ?? 0), 0)
  return (
    <Group gap="sm" align="flex-start" wrap="nowrap" px={22} pt={18} pb={12}>
      <IconAlertTriangle size={22} stroke={1.75} color={color} style={{ flex: 'none' }} />
      <Stack gap={2}>
        <Title order={2} fz={18}>
          Розбіжності при прийманні · {transfer.discrepancies.length} поз., {delta > 0 ? `+${delta}` : `−${-delta}`} од.
        </Title>
        <Text size="md" c={tokens.color.ink2}>
          Прийнято {received} з {shipped}. {openCount > 0 ? `Відкритих розбіжностей: ${openCount}.` : 'Усі розбіжності закрито.'}
        </Text>
      </Stack>
    </Group>
  )
}

function ConfirmBar({ transferId, ready, open, onDone }: {
  transferId: string
  ready: { discrepancy: string; reason: string }[]
  open: number
  onDone: () => void
}) {
  const [opened, setOpened] = useState(false)
  const resolve = useResolveDiscrepancies(transferId)

  function close() {
    resolve.reset()
    setOpened(false)
  }

  function confirm() {
    resolve.mutate(ready, {
      onSuccess: () => {
        notifications.show({ color: 'green', message: 'Розбіжності підтверджено' })
        setOpened(false)
        onDone()
      },
    })
  }

  return (
    <Group justify="flex-end" gap="md" px={22} py={14} style={{ borderTop: `1px solid ${tokens.color.line}` }}>
      {ready.length < open && <Text size="sm" c="dimmed">Вкажіть причину для кожної розбіжності, яку закриваєте.</Text>}
      <Button disabled={ready.length === 0} onClick={() => setOpened(true)}>Підтвердити розбіжності</Button>
      <ConfirmDialog
        opened={opened}
        title="Підтвердити розбіжності?"
        confirmLabel="Підтвердити"
        loading={resolve.isPending}
        onConfirm={confirm}
        onClose={close}
      >
        <Text size="md">
          Буде закрито розбіжностей: {ready.length} з {open}. Залишки не зміняться: вони вже відповідають фактично
          прийнятому. Відкрити розбіжність знову не можна.
        </Text>
        {resolve.isError && <Alert color="red" variant="light" mt="sm">{errorMessage(resolve.error)}</Alert>}
      </ConfirmDialog>
    </Group>
  )
}
