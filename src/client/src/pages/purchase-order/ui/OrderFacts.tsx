import { SimpleGrid, Stack, Text } from '@mantine/core'
import type { ReactNode } from 'react'
import type { PurchaseOrderCard } from '@/entities/purchase-order'
import { referenceName } from '@/entities/reference'
import { uah } from '@/shared/api'
import { statusTone, tokens } from '@/shared/config/tokens'
import { formatDate, formatNumber } from '@/shared/lib'
import { MoneyText, Panel } from '@/shared/ui'

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Stack gap={4}>
      <Text fz={12} fw={600} c={tokens.color.ink2}>{label}</Text>
      <Text fz={14} fw={600} component="div">{children}</Text>
    </Stack>
  )
}

/** The order's key facts in one row of the card. */
export function OrderFacts({ order }: { order: PurchaseOrderCard }) {
  const ordered = order.lines.reduce((sum, line) => sum + line.ordered, 0)
  const received = order.lines.reduce((sum, line) => sum + line.received, 0)
  const total = order.lines.reduce((sum, line) => sum + line.ordered * line.purchasePrice.amount, 0)
  return (
    <Panel padding={20}>
      <SimpleGrid cols={{ base: 1, xs: 2, md: 5 }} spacing={28} verticalSpacing={20}>
        <Fact label="Постачальник">{referenceName('suppliers', order.supplier)}</Fact>
        <Fact label="Очікувана поставка">
          <span style={{ color: order.isOverdue ? statusTone.attention.text : undefined }}>{formatDate(order.expectedDate)}</span>
        </Fact>
        <Fact label="Позицій / одиниць">{order.lines.length} / {formatNumber(ordered)}</Fact>
        <Fact label="Отримано">{formatNumber(received)} з {formatNumber(ordered)} од.</Fact>
        <Fact label="Сума закупівлі"><MoneyText value={uah(total)} /></Fact>
      </SimpleGrid>
    </Panel>
  )
}
