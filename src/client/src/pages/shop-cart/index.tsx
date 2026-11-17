import { Anchor, Button, Flex, Stack, Title } from '@mantine/core'
import { IconShoppingBag } from '@tabler/icons-react'
import { Link } from 'react-router'
import { useCart, type Cart } from '@/entities/cart'
import { useShopperId } from '@/entities/shopper'
import { useMyStore } from '@/features/shop-my-store'
import { useCartAvailability } from '@/features/shop-place-order'
import { EmptyState, QueryView } from '@/shared/ui'
import { CartLineRow } from './ui/CartLineRow'
import { CartSummary } from './ui/CartSummary'

/** Cart (artboards ShopCart, ShopMobile c): the shopper's cart as the server keeps it. */
export default function ShopCartPage() {
  const shopperId = useShopperId()
  const cart = useCart(shopperId)
  return (
    <QueryView query={cart} isEmpty={(data) => data.lines.length === 0} empty={<EmptyCart />}>
      {(data) => (
        <Flex gap={40} direction={{ base: 'column', md: 'row' }} align="flex-start">
          <CartLines cart={data} customer={shopperId!} />
          <CartSummary cart={data} />
        </Flex>
      )}
    </QueryView>
  )
}

function CartLines({ cart, customer }: { cart: Cart; customer: string }) {
  const store = useMyStore()
  const availability = useCartAvailability(cart.lines)
  return (
    <Stack component="section" gap={0} style={{ flex: 1, minWidth: 0, width: '100%' }}>
      <Title order={1} ff="var(--font-display)" fz={{ base: 30, sm: 40 }} mb="xs">Кошик</Title>
      {cart.lines.map((line) => (
        <CartLineRow key={line.book} line={line} customer={customer} myStore={store}
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
