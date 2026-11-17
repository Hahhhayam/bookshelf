import { Alert, Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core'
import { useState, type KeyboardEvent } from 'react'
import { tokens } from '@/shared/config/tokens'
import { formatAmount, fromCents, parseAmount } from '@/shared/lib'
import { Key, MoneyText } from '@/shared/ui'
import { change, planProblem, wholeBy, type PaymentPlan } from '../model/paymentPlan'
import { CertificateBalance } from './CertificateBalance'

export type QuickMethod = 'Cash' | 'Card' | 'GiftCertificate'

const titles: Record<QuickMethod, string> = {
  Cash: 'Оплата готівкою', Card: 'Оплата карткою', GiftCertificate: 'Оплата сертифікатом',
}

function CashBody({ total, received, setReceived }: { total: number; received: string; setReceived: (v: string) => void }) {
  const cents = parseAmount(received)
  const rest = cents === null ? 0 : change(total, { Bonus: 0, GiftCertificate: 0, Card: 0, Cash: cents })
  return (
    <Stack gap="sm">
      <TextInput data-autofocus label="Отримано від клієнта" size="lg" inputMode="decimal" value={received}
        onChange={(e) => setReceived(e.currentTarget.value)} onFocus={(e) => e.currentTarget.select()}
        rightSection="₴" styles={{ input: { textAlign: 'right', fontWeight: 600, fontSize: 20 } }}
        error={cents === null ? 'Невірна сума' : undefined} />
      <Group justify="space-between">
        <Text fz={16} fw={600}>Видати решту</Text>
        <MoneyText value={fromCents(rest)} variant="strong" size={24} />
      </Group>
    </Stack>
  )
}

function CertificateBody({ number, setNumber }: { number: string; setNumber: (v: string) => void }) {
  return (
    <Stack gap="xs">
      <TextInput data-autofocus label="Номер сертифіката" size="lg" value={number}
        onChange={(e) => setNumber(e.currentTarget.value)} styles={{ input: { fontFamily: tokens.font.mono } }} />
      <CertificateBalance number={number} />
    </Stack>
  )
}

/** F8/F9/F10: the whole total by one method; Enter confirms and closes the receipt. */
export function QuickPayDialog({ method, total, busy, onSubmit, onClose }: {
  method: QuickMethod | null
  total: number
  busy: boolean
  onSubmit: (plan: PaymentPlan) => void
  onClose: () => void
}) {
  const [received, setReceived] = useState('')
  const [number, setNumber] = useState('')
  const plan = method === 'Cash'
    ? { ...wholeBy('Cash', total), tender: { Bonus: 0, GiftCertificate: 0, Card: 0, Cash: parseAmount(received || formatAmount(total)) ?? 0 } }
    : wholeBy(method ?? 'Card', total, number)
  const problem = planProblem(plan, null)

  function close() {
    setReceived('')
    setNumber('')
    onClose()
  }
  function submit() {
    if (!problem && !busy) onSubmit(plan)
  }
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Enter' || event.target instanceof HTMLButtonElement) return
    event.preventDefault()
    submit()
  }

  return (
    <Modal opened={method !== null} onClose={close} centered title={<Text fw={600} fz={22}>{method ? titles[method] : ''}</Text>}>
      <Stack gap="md" onKeyDown={onKeyDown}>
        <Group justify="space-between">
          <Text fz={14} c={tokens.color.ink2}>До сплати</Text>
          <MoneyText value={fromCents(total)} variant="strong" size={24} />
        </Group>
        {method === 'Cash' && <CashBody total={total} received={received || formatAmount(total)} setReceived={setReceived} />}
        {method === 'Card' && <Text fz={15} data-autofocus tabIndex={-1}>Попросіть клієнта прикласти картку до терміналу.</Text>}
        {method === 'GiftCertificate' && <CertificateBody number={number} setNumber={setNumber} />}
        {problem && method !== 'Card' && <Alert color="gray" variant="light" p="xs"><Text fz={13}>{problem}</Text></Alert>}
        <Group justify="flex-end" gap="sm">
          <Button variant="default" size="md" onClick={close} rightSection={<Key>Esc</Key>}>Назад</Button>
          <Button size="md" loading={busy} disabled={!!problem} onClick={submit} rightSection={<Key inverted>Enter</Key>}>
            Провести оплату
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
