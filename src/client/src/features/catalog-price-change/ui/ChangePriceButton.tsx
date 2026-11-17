import { Alert, Button, Group, NumberInput, Stack, Text, TextInput } from '@mantine/core'
import { useState } from 'react'
import type { Money } from '@/shared/api'
import { formatMoney } from '@/shared/lib'
import { ConfirmDialog, errorMessage, MoneyText } from '@/shared/ui'
import { useChangePrice } from '../model/useChangePrice'

/** Scenario 3.3: the old and the new price side by side, and the moment the new one starts (empty: at once). */
export function ChangePriceButton({ bookId, subtitle, current }: { bookId: string; subtitle: string; current: Money }) {
  const [opened, setOpened] = useState(false)
  const [amount, setAmount] = useState<number | ''>('')
  const [invalid, setInvalid] = useState<string | null>(null)
  const [from, setFrom] = useState('')
  const [fromInvalid, setFromInvalid] = useState<string | null>(null)
  const change = useChangePrice(bookId)
  const next: Money | null = amount === '' ? null : { amount, currency: current.currency }

  function open() { setAmount(''); setInvalid(null); setFrom(''); setFromInvalid(null); change.reset(); setOpened(true) }

  function confirm() {
    if (!next || next.amount < 0) return setInvalid('Вкажіть нову ціну, не менше нуля')
    if (next.amount === current.amount) return setInvalid('Нова ціна така сама, як зараз')
    // `datetime-local` gives local wall time; the API takes an offset date-time.
    const effectiveFrom = from ? new Date(from) : null
    if (effectiveFrom && effectiveFrom.getTime() <= Date.now()) return setFromInvalid('Момент має бути в майбутньому, або залиште порожнім')
    change.mutate({ newPrice: next, effectiveFrom: effectiveFrom?.toISOString() ?? null }, { onSuccess: () => setOpened(false) })
  }

  return (
    <>
      <Button variant="default" onClick={open}>Змінити ціну</Button>
      <ConfirmDialog opened={opened} onClose={() => setOpened(false)} title="Змінити ціну" loading={change.isPending}
        confirmLabel={next ? `Змінити ціну на ${formatMoney(next)}` : 'Змінити ціну'} onConfirm={confirm}>
        <Stack gap="md">
          <Text size="sm" c="dimmed">{subtitle}</Text>
          <Group grow align="flex-end">
            <Stack gap={4}>
              <Text size="sm" fw={600}>Зараз</Text>
              <Text fz={22} fw={600} lh="42px"><MoneyText value={current} /></Text>
            </Stack>
            <NumberInput label="Нова ціна" data-autofocus min={0} decimalScale={2} decimalSeparator="," thousandSeparator=" "
              hideControls rightSection="₴" value={amount} error={invalid}
              onChange={(v) => { setAmount(typeof v === 'number' ? v : ''); setInvalid(null) }} />
          </Group>
          <TextInput type="datetime-local" label="Діє з" description="Порожньо — одразу. Стара ціна лишається в історії."
            value={from} error={fromInvalid} onChange={(e) => { setFrom(e.currentTarget.value); setFromInvalid(null) }} />
          {change.isError && <Alert color="red">{errorMessage(change.error)}</Alert>}
        </Stack>
      </ConfirmDialog>
    </>
  )
}
