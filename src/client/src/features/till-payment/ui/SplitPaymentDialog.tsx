import { Alert, Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core'
import { IconCash, IconCreditCard, IconGift, IconStar } from '@tabler/icons-react'
import { useEffect, type KeyboardEvent } from 'react'
import { statusTone, tokens } from '@/shared/config/tokens'
import { formatMoney } from '@/shared/lib'
import { Key, MoneyText } from '@/shared/ui'
import { fromCents } from '../model/money'
import { change, planProblem, remaining, type PaymentPlan, type TenderMethod } from '../model/paymentPlan'
import { useSplitForm } from '../model/useSplitForm'
import { AmountInput } from './AmountInput'
import { SplitRow } from './SplitRow'

const labels: Record<TenderMethod, string> = {
  Bonus: 'Сума бонусами', GiftCertificate: 'Сума сертифікатом', Cash: 'Готівка отримана', Card: 'Сума карткою',
}

/**
 * F7: one receipt paid by several methods. Tab moves between fields, Enter fills in what is left, Ctrl+Enter posts
 * when nothing is left, Esc closes without changes. With `adjustTotal` (after B-01) the cashier may correct
 * «До сплати» to the amount the server expects.
 */
export function SplitPaymentDialog({ opened, total, subtitle, bonusBalance, adjustTotal, busy, onSubmit, onClose }: {
  opened: boolean
  total: number
  subtitle: string
  /** Kopecks on the customer's bonus account, or null without a customer. */
  bonusBalance: number | null
  adjustTotal: boolean
  busy: boolean
  onSubmit: (plan: PaymentPlan) => void
  onClose: () => void
}) {
  const form = useSplitForm(total)
  const { reset } = form
  useEffect(() => { if (opened) reset(total) }, [opened, total, reset])

  const { plan } = form
  const left = remaining(plan.total, plan.tender)
  const problem = form.invalid.length > 0 ? 'Перевірте суми: дозволені лише числа.' : planProblem(plan, bonusBalance)

  function field(method: TenderMethod, autoFocus = false, disabled = false) {
    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter' || event.ctrlKey) return
      event.preventDefault()
      form.fillRemaining(method)
    }
    return <AmountInput label={labels[method]} value={form.fields[method]} autoFocus={autoFocus} disabled={disabled}
      invalid={form.invalid.includes(method)} onChange={(v) => form.setField(method, v)} onKeyDown={onKeyDown} />
  }
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Enter' || !event.ctrlKey) return
    event.preventDefault()
    if (!problem && !busy) onSubmit(plan)
  }

  return (
    <Modal opened={opened} onClose={onClose} centered size={620} padding={26} withCloseButton={false}>
      <Stack gap={0} onKeyDown={onKeyDown}>
        <Group justify="space-between" align="flex-start" pb={6}>
          <Stack gap={4}>
            <Text fz={22} fw={600}>Розділена оплата</Text>
            <Text fz={14} c={tokens.color.ink2}>{subtitle}</Text>
          </Stack>
          <Stack gap={2} align="flex-end">
            <Text fz={13} c={tokens.color.ink2}>До сплати</Text>
            {adjustTotal
              ? <TextInput aria-label="До сплати" w={150} value={form.totalText} rightSection="₴"
                  onChange={(e) => form.setTotalText(e.currentTarget.value)}
                  styles={{ input: { textAlign: 'right', fontWeight: 700, fontSize: 20 } }} />
              : <MoneyText value={fromCents(plan.total)} variant="strong" size={24} />}
          </Stack>
        </Group>
        {adjustTotal && (
          <Alert color="yellow" variant="light" p="xs" mb="xs">
            <Text fz={13}>Сервер порахував суму з акціями. Вкажіть суму з повідомлення або чека сервера й розподіліть оплату.</Text>
          </Alert>
        )}
        <SplitRow icon={<IconStar size={20} stroke={1.75} />} title="Бонуси" field={field('Bonus', false, bonusBalance === null)}
          hint={bonusBalance === null ? 'Потрібен клієнт (F4)' : `На рахунку ${formatMoney(fromCents(bonusBalance))}`} />
        <SplitRow icon={<IconGift size={20} stroke={1.75} />} title="Подарунковий сертифікат" field={field('GiftCertificate')}
          hint={<TextInput size="xs" mt={2} placeholder="Номер сертифіката" aria-label="Номер сертифіката" value={form.certificateNumber}
            onChange={(e) => form.setCertificateNumber(e.currentTarget.value)} styles={{ input: { fontFamily: tokens.font.mono } }} />} />
        <SplitRow icon={<IconCash size={20} stroke={1.75} />} title="Готівка" field={field('Cash', true)}
          hint={<>Отримано від клієнта · <strong style={{ color: tokens.color.ink }}>решта {formatMoney(fromCents(change(plan.total, plan.tender)))}</strong></>} />
        <SplitRow icon={<IconCreditCard size={20} stroke={1.75} />} title="Картка" field={field('Card')} last
          hint="Термінал спише вказану суму" />
        <Totals left={left} change={change(plan.total, plan.tender)} />
        {problem && left === 0 && <Text fz={13} c={tokens.color.danger} mt="xs">{problem}</Text>}
        <Group justify="space-between" pt={18} gap={12}>
          <Group gap={6} fz={13} c={tokens.color.ink2}><Key>Tab</Key>наступний спосіб · <Key>Enter</Key>у полі — підставити залишок</Group>
          <Group gap={10}>
            <Button variant="default" size="lg" onClick={onClose} rightSection={<Key>Esc</Key>}>Назад</Button>
            <Button size="lg" loading={busy} disabled={!!problem} onClick={() => onSubmit(plan)}
              rightSection={<Key inverted>Ctrl Enter</Key>}>Провести оплату</Button>
          </Group>
        </Group>
      </Stack>
    </Modal>
  )
}

function Totals({ left, change: rest }: { left: number; change: number }) {
  const done = left === 0
  return (
    <Group justify="space-between" mt={6} px={18} py={16}
      style={{ background: done ? statusTone.ready.bg : tokens.color.paper }}>
      <Stack gap={2}>
        <Text fz={13} fw={600} c={done ? statusTone.ready.text : tokens.color.ink}>Залишилось сплатити</Text>
        <Text fz={28} fw={700} c={done ? statusTone.ready.text : tokens.color.ink}><MoneyText value={fromCents(left)} /></Text>
      </Stack>
      <Stack gap={2} align="flex-end">
        <Text fz={13} fw={600}>Видати решту</Text>
        <Text fz={28} fw={700}><MoneyText value={fromCents(rest)} /></Text>
      </Stack>
    </Group>
  )
}
