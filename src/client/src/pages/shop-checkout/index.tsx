import { Anchor, Button, Flex, Stack, Title } from '@mantine/core'
import { IconShoppingBag } from '@tabler/icons-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { useCart, type Cart } from '@/entities/cart'
import { useShopperId } from '@/entities/shopper'
import { useCartAvailability, usePlaceOrder } from '@/features/shop-place-order'
import { EmptyState, errorMessage, QueryView } from '@/shared/ui'
import { useCheckoutForm } from './model/useCheckoutForm'
import { CheckoutSummary } from './ui/CheckoutSummary'
import { CustomerSection } from './ui/CustomerSection'
import { FulfilmentSection } from './ui/FulfilmentSection'

/** Checkout (artboard ShopCheckout): pickup store or delivery, then the server turns the cart into an order. */
export default function ShopCheckoutPage() {
  const shopperId = useShopperId()
  const cart = useCart(shopperId)
  return (
    <QueryView query={cart} isEmpty={(data) => data.lines.length === 0} empty={<EmptyCart />}>
      {(data) => <Checkout cart={data} customer={shopperId!} />}
    </QueryView>
  )
}

function EmptyCart() {
  return (
    <EmptyState icon={<IconShoppingBag size={48} stroke={1.5} />} title="Кошик порожній"
      text="Щоб оформити замовлення, додайте книжки з каталогу." actions={<Button component={Link} to="/">До каталогу</Button>} />
  )
}

function Checkout({ cart, customer }: { cart: Cart; customer: string }) {
  const navigate = useNavigate()
  const availability = useCartAvailability(cart.lines)
  const form = useCheckoutForm(customer, availability.stores)
  const place = usePlaceOrder()
  const [problem, setProblem] = useState<string | null>(null)

  function submit(event: FormEvent) {
    event.preventDefault()
    const built = form.build()
    if (built.error !== undefined) return setProblem(built.error)
    setProblem(null)
    place.mutate(built.input, {
      onSuccess: (placed) => navigate(`/orders/placed/${encodeURIComponent(placed.pickupCode)}`),
      onError: (error) => setProblem(errorMessage(error)),
    })
  }

  return (
    <form onSubmit={submit} aria-label="Оформлення">
      <Stack gap="md">
        <Anchor component={Link} to="/cart" fw={600} size="md">← Повернутися до кошика</Anchor>
        <Flex gap="xl" direction={{ base: 'column', md: 'row' }} align="flex-start">
          <Stack gap="md" style={{ flex: 1, minWidth: 0, width: '100%' }}>
            <Title order={1} ff="var(--font-display)" fz={{ base: 30, sm: 40 }}>Оформлення замовлення</Title>
            <CustomerSection customer={customer} />
            <FulfilmentSection form={form} availability={availability} />
          </Stack>
          <CheckoutSummary cart={cart} form={form} problem={problem} pending={place.isPending} />
        </Flex>
      </Stack>
    </form>
  )
}
