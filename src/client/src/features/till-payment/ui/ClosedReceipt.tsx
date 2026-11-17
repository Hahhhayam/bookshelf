import { Button, Group, Stack, Text } from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'
import type { ReactNode } from 'react'
import { paymentLabel, type Payment } from '@/entities/sale'
import { statusTone, tokens } from '@/shared/config/tokens'
import { formatDateTime, fromCents } from '@/shared/lib'
import { Key, MoneyText } from '@/shared/ui'

export interface ClosedSale {
  id: string
  at: string
  total: number
  change: number
  items: number
  payments: Payment[]
  customerName: string | null
}

function PaymentSummary({ sale }: { sale: ClosedSale }) {
  return (
    <Stack gap={14} p={22} w={380} style={{ background: tokens.color.surface, border: `1px solid ${tokens.color.line}` }}>
      <Text fz={16} fw={700}>Оплата</Text>
      {sale.payments.map((p) => (
        <Group key={p.method} justify="space-between" fz={15}>
          <Text c={tokens.color.ink2} fz={15}>
            {paymentLabel[p.method]}{p.giftCertificateNumber ? ` ${p.giftCertificateNumber}` : ''}
          </Text>
          <MoneyText value={p.tendered ?? p.amount} />
        </Group>
      ))}
      {sale.change > 0 && (
        <Group justify="space-between"><Text c={tokens.color.ink2} fz={15}>Решта</Text><MoneyText value={fromCents(-sale.change)} /></Group>
      )}
      <Stack gap={6} pt={12} fz={14} c={tokens.color.ink2} style={{ borderTop: `1px solid ${tokens.color.sunk}` }}>
        <span>{sale.items} шт. · {formatDateTime(sale.at)}</span>
        <span>Ідентифікатор продажу <span style={{ fontFamily: tokens.font.mono, fontSize: 12, color: tokens.color.ink }}>{sale.id}</span></span>
      </Stack>
    </Stack>
  )
}

/** The paid receipt (TillStates artboard). Enter or the next scan opens a new receipt. */
export function ClosedReceipt({ sale, onNew, scanSlot }: { sale: ClosedSale; onNew: () => void; scanSlot: ReactNode }) {
  return (
    <Group justify="center" align="center" gap={64} p={32} style={{ flex: 1 }}>
      <Stack gap={18} maw={520}>
        <span style={{ width: 72, height: 72, background: statusTone.ready.bg, color: statusTone.ready.text, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconCheck size={40} stroke={2} />
        </span>
        <Stack role="status" gap={6}>
          <Text fz={16} fw={600} c={statusTone.ready.text}>Оплачено</Text>
          <span style={{ fontSize: 56, lineHeight: '64px', fontWeight: 700, letterSpacing: '-0.02em' }}><MoneyText value={fromCents(sale.total)} /></span>
          {sale.change > 0 && <Text fz={22} fw={600}>Видайте решту: <MoneyText value={fromCents(sale.change)} /></Text>}
        </Stack>
        {sale.customerName && <Text fz={15} c={tokens.color.ink2}>Клієнт: {sale.customerName}</Text>}
        <Group gap={10} mt={6}>
          <Button size="lg" onClick={onNew} rightSection={<Key inverted>Enter</Key>}>Новий чек</Button>
        </Group>
        {scanSlot}
      </Stack>
      <PaymentSummary sale={sale} />
    </Group>
  )
}
