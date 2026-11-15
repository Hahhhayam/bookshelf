import { Button, Flex, Stack } from '@mantine/core'
import { IconReceiptOff } from '@tabler/icons-react'
import { Link, useLocation } from 'react-router'
import { asPlacedOrderSummary } from '@/features/shop-place-order'
import { EmptyState } from '@/shared/ui'
import { PickupCodeCard } from './ui/PickupCodeCard'
import { PlacedLines } from './ui/PlacedLines'

/** Confirmation (artboards ShopConfirm, ShopMobile d). Its data comes only from navigation state (GAP-25). */
export default function ShopOrderPlacedPage() {
  const summary = asPlacedOrderSummary(useLocation().state)
  if (!summary) {
    return (
      <EmptyState
        icon={<IconReceiptOff size={48} stroke={1.5} />}
        title="Підтвердження вже не показати"
        text="Ця сторінка доступна одразу після оформлення. Стан замовлення можна перевірити за кодом отримання."
        actions={<Button component={Link} to="/track">Відстежити замовлення</Button>}
      />
    )
  }
  return (
    <Flex gap={40} direction={{ base: 'column', md: 'row' }} align="flex-start" maw={1080} mx="auto">
      <Stack style={{ flex: 1, minWidth: 0, width: '100%' }}>
        <PickupCodeCard summary={summary} />
      </Stack>
      <PlacedLines summary={summary} />
    </Flex>
  )
}
