import { Anchor, Button, Flex, Stack, Title } from '@mantine/core'
import { IconShoppingBag } from '@tabler/icons-react'
import { Link } from 'react-router'
import { useCart, type CartLine } from '@/entities/cart'
import { useMyStore } from '@/features/shop-my-store'
import { useCartAvailability } from '@/features/shop-place-order'
import { EmptyState } from '@/shared/ui'
import { CartLineRow } from './ui/CartLineRow'
import { CartSummary } from './ui/CartSummary'

/** Cart (artboards ShopCart, ShopMobile c). The cart lives in this browser until checkout (GAP-01). */
export default function ShopCartPage() {
  const lines = useCart()
  if (lines.length === 0) return <EmptyCart />
  return (
    <Flex gap={40} direction={{ base: 'column', md: 'row' }} align="flex-start">
      <CartLines lines={lines} />
      <CartSummary lines={lines} />
    </Flex>
  )
}

function CartLines({ lines }: { lines: CartLine[] }) {
  const store = useMyStore()
  const availability = useCartAvailability(lines)
  return (
    <Stack component="section" gap={0} style={{ flex: 1, minWidth: 0, width: '100%' }}>
      <Title order={1} ff="var(--font-display)" fz={{ base: 30, sm: 40 }} mb="xs">Кошик</Title>
      {lines.map((line) => (
        <CartLineRow key={line.book} line={line} myStore={store}
          availability={availability.isPending ? null : availability.availabilityOf(line.book)} />
      ))}
      <Anchor component={Link} to="/" fw={600} mt="md">← Продовжити покупки</Anchor>
    </Stack>
  )
}

function EmptyCart() {
  return (
    <EmptyState
      icon={<IconShoppingBag size={48} stroke={1.5} />}
      title="Кошик порожній"
      text="Знайдіть книжку в каталозі й натисніть «У кошик»."
      actions={<Button component={Link} to="/">До каталогу</Button>}
    />
  )
}
