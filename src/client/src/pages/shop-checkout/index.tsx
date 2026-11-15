import { Anchor, Button, Flex, Stack, Title } from '@mantine/core'
import { IconShoppingBag } from '@tabler/icons-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { cart, useCart, type CartLine } from '@/entities/cart'
import { shopper } from '@/entities/shopper'
import { useCartAvailability, usePlaceOrder } from '@/features/shop-place-order'
import { EmptyState, errorMessage } from '@/shared/ui'
import { useCheckoutForm } from './model/useCheckoutForm'
import { CheckoutSummary } from './ui/CheckoutSummary'
import { CustomerSection } from './ui/CustomerSection'
import { FulfilmentSection } from './ui/FulfilmentSection'
import { PaymentSection } from './ui/PaymentSection'

/** Checkout (artboard ShopCheckout): pickup store or delivery, then the order is placed and the cart cleared. */
export default function ShopCheckoutPage() {
  const lines = useCart()
  if (lines.length === 0) {
    return (
      <EmptyState icon={<IconShoppingBag size={48} stroke={1.5} />} title="Кошик порожній"
        text="Щоб оформити замовлення, додайте книжки з каталогу." actions={<Button component={Link} to="/">До каталогу</Button>} />
    )
  }
  return <Checkout lines={lines} />
}

function Checkout({ lines }: { lines: CartLine[] }) {
  const navigate = useNavigate()
  const availability = useCartAvailability(lines)
  const form = useCheckoutForm(lines, availability.stores)
  const place = usePlaceOrder()
  const [problem, setProblem] = useState<string | null>(null)

  function submit(event: FormEvent) {
    event.preventDefault()
    const built = form.build()
    if (built.error !== undefined) return setProblem(built.error)
    setProblem(null)
    shopper.set(built.input.customer)
    place.mutate(built.input, {
      onSuccess: (summary) => { navigate('/orders/placed', { state: summary }); cart.clear() },
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
            <CustomerSection form={form} />
            <FulfilmentSection form={form} availability={availability} />
            <PaymentSection />
          </Stack>
          <CheckoutSummary lines={lines} form={form} problem={problem} pending={place.isPending} />
        </Flex>
      </Stack>
    </form>
  )
}
