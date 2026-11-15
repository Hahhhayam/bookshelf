import { Text } from '@mantine/core'
import { tokens } from '@/shared/config/tokens'
import { CheckoutSection } from './CheckoutSection'

/** Online orders are paid in the store: the API has no payment choice for an order (GAP-22). */
export function PaymentSection() {
  return (
    <CheckoutSection step={3} title="Оплата">
      <Text fz={16} fw={700}>У магазині при отриманні</Text>
      <Text size="md" c={tokens.color.ink2}>Готівкою, карткою або сертифікатом.</Text>
    </CheckoutSection>
  )
}
