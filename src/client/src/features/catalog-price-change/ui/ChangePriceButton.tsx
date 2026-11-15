import { Alert, Button, Group, NumberInput, Stack, Text } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import { useState } from 'react'
import type { Money } from '@/shared/api'
import { tokens } from '@/shared/config/tokens'
import { formatMoney } from '@/shared/lib'
import { ConfirmDialog, errorMessage, MoneyText } from '@/shared/ui'
import { useChangePrice } from '../model/useChangePrice'

/**
 * The FormDialogs price dialog: current vs new price and the difference; the button names the new sum.
 * The artboard's «Діє з» and «Причина» are left out: the API applies a price at once and takes no reason (R-41).
 */
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
          {next && <Difference current={current} next={next} />}
          <Alert variant="light" color="gray" icon={<IconInfoCircle size={18} />}>
            Нова ціна з’явиться на всіх касах і в онлайн-магазині одразу. Оформлені замовлення залишаться за старою ціною.
          </Alert>
          {change.isError && <Alert color="red">{errorMessage(change.error)}</Alert>}
        </Stack>
      </ConfirmDialog>
    </>
  )
}

function Difference({ current, next }: { current: Money; next: Money }) {
  const delta = next.amount - current.amount
  const percent = current.amount === 0 ? null : (delta / current.amount) * 100
  const sign = delta > 0 ? '+' : delta < 0 ? '−' : ''
  return (
    <Text size="sm">
      Різниця{' '}
      <strong style={{ color: delta < 0 ? tokens.color.danger : tokens.color.positive }}>
        {sign}{formatMoney({ amount: Math.abs(delta), currency: current.currency })}
        {percent !== null && ` (${sign}${Math.abs(percent).toFixed(1).replace('.', ',')}%)`}
      </strong>
    </Text>
  )
}
