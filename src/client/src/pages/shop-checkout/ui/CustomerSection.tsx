import { Button, Group, Text } from '@mantine/core'
import { useState } from 'react'
import { ShopperIdModal } from '@/entities/shopper'
import { shortId } from '@/shared/lib'
import { CheckoutSection } from './CheckoutSection'

/** The order is placed for the shopper whose cart this is; another number opens that customer's cart. */
export function CustomerSection({ customer }: { customer: string }) {
  const [changing, setChanging] = useState(false)
  return (
    <CheckoutSection step={1} title="Покупець">
      <Group gap="sm">
        <Text>Замовлення буде оформлено на покупця <strong>#{shortId(customer)}</strong></Text>
        <Button variant="subtle" size="compact-sm" onClick={() => setChanging(true)}>Змінити</Button>
      </Group>
      <ShopperIdModal opened={changing} onClose={() => setChanging(false)} />
    </CheckoutSection>
  )
}
