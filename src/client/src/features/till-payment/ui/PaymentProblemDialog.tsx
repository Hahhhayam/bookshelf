import { Button, Group, Modal, Stack, Text } from '@mantine/core'
import { IconAlertTriangle, IconCreditCardOff, IconRefresh } from '@tabler/icons-react'
import type { ReactNode } from 'react'
import { statusTone, tokens } from '@/shared/config/tokens'
import { Key } from '@/shared/ui'
import type { PaymentFailure } from '../model/failure'

export type ProblemAction = 'retry' | 'Cash' | 'Card' | 'Split'

function Choice({ k, primary, onClick, children, loading }: {
  k?: string; primary?: boolean; onClick: () => void; children: ReactNode; loading?: boolean
}) {
  return (
    <Button size="lg" variant={primary ? 'filled' : 'default'} justify="space-between" fullWidth loading={loading}
      data-autofocus={primary || undefined} onClick={onClick} rightSection={k && <Key inverted={primary}>{k}</Key>}>
      {children}
    </Button>
  )
}

function Title({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <Group gap={12} wrap="nowrap">
      <span style={{ width: 40, height: 40, background: statusTone.problem.bg, color: tokens.color.danger, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</span>
      <Text fz={18} fw={700}>{text}</Text>
    </Group>
  )
}

function Body({ failure, busy, act, close }: {
  failure: PaymentFailure; busy: boolean; act: (a: ProblemAction) => void; close: () => void
}) {
  switch (failure.kind) {
    case 'declined':
      return <>
        <Title icon={<IconCreditCardOff size={22} stroke={1.75} />} text="Оплату карткою відхилено" />
        <Text fz={14}>Банк відмовив у списанні. <strong>Гроші не списано</strong>, чек лишився відкритим.</Text>
        <Choice primary k="F9" onClick={() => act('Card')}>Інша картка — спробувати ще раз</Choice>
        <Choice k="F8" onClick={() => act('Cash')}>Оплатити готівкою</Choice>
        <Choice k="F7" onClick={() => act('Split')}>Розділити оплату</Choice>
      </>
    case 'rule':
      return <>
        <Title icon={<IconAlertTriangle size={22} stroke={1.75} />} text="Сервер не провів чек" />
        <Text fz={14}>{failure.message}</Text>
        <Choice primary k="Esc" onClick={close}>Назад до чека</Choice>
      </>
    case 'unconfirmed':
      return <>
        <Title icon={<IconRefresh size={22} stroke={1.75} />} text="Чек ще не підтверджено" />
        <Text fz={14}>Сервер не відповів. <strong>Повторити безпечно:</strong> чек не буде проведено двічі, навіть якщо перша спроба дійшла.</Text>
        <Choice primary k="Enter" loading={busy} onClick={() => act('retry')}>Спробувати зараз</Choice>
      </>
    case 'other':
      return <>
        <Title icon={<IconAlertTriangle size={22} stroke={1.75} />} text="Не вдалося провести чек" />
        <Text fz={14}>{failure.message}</Text>
      </>
  }
}

/** What went wrong with a payment and what the cashier can do next (TillStates artboard). */
export function PaymentProblemDialog({ failure, busy, onAction, onClose }: {
  failure: PaymentFailure | null
  busy: boolean
  onAction: (action: ProblemAction) => void
  onClose: () => void
}) {
  return (
    <Modal opened={failure !== null} onClose={onClose} centered withCloseButton={false} padding={22}>
      <Stack gap={12} role="alertdialog">
        {failure && <Body failure={failure} busy={busy} act={onAction} close={onClose} />}
        {failure?.kind !== 'rule' && <Button variant="subtle" onClick={onClose} rightSection={<Key>Esc</Key>}>Назад до чека</Button>}
      </Stack>
    </Modal>
  )
}
