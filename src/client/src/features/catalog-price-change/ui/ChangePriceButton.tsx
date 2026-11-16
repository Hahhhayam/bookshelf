import { Alert, Button, Group, NumberInput, Stack, Text } from '@mantine/core'
import { useState } from 'react'
import type { Money } from '@/shared/api'
import { formatMoney } from '@/shared/lib'
import { ConfirmDialog, errorMessage, MoneyText } from '@/shared/ui'
import { useChangePrice } from '../model/useChangePrice'

/** Scenario 3.3: the old and the new price side by side; the button names the new sum. The API applies a price at once (R-41). */
export function ChangePriceButton({ bookId, subtitle, current }: { bookId: string; subtitle: string; current: Money }) {
  const [opened, setOpened] = useState(false)
  const [amount, setAmount] = useState<number | ''>('')
  const [invalid, setInvalid] = useState<string | null>(null)
  const change = useChangePrice(bookId)
  const next: Money | null = amount === '' ? null : { amount, currency: current.currency }

  function open() { setAmount(''); setInvalid(null); change.reset(); setOpened(true) }

  function confirm() {
    if (!next || next.amount < 0) return setInvalid('Вкажіть нову ціну, не менше нуля')
    if (next.amount === current.amount) return setInvalid('Нова ціна така сама, як зараз')
    change.mutate(next, { onSuccess: () => setOpened(false) })
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
          {change.isError && <Alert color="red">{errorMessage(change.error)}</Alert>}
        </Stack>
      </ConfirmDialog>
    </>
  )
}
