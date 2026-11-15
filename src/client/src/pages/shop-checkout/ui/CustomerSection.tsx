import { Button, Group, Text, TextInput } from '@mantine/core'
import { shortId } from '@/shared/lib'
import type { CheckoutForm } from '../model/useCheckoutForm'
import { CheckoutSection } from './CheckoutSection'

/** Customers cannot sign in yet (GAP-02): the order is placed for a customer id remembered in this browser. */
export function CustomerSection({ form }: { form: CheckoutForm }) {
  return (
    <CheckoutSection step={1} title="Покупець">
      {form.askCustomer ? (
        <TextInput
          label="Номер покупця"
          description="Вхід для покупців ще не працює. Введіть номер з картки покупця — ми запам’ятаємо його в цьому браузері."
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          value={form.customer}
          onChange={(e) => form.setCustomer(e.currentTarget.value)}
          autoComplete="off"
          maw={460}
          required
        />
      ) : (
        <Group gap="sm">
          <Text>Замовлення буде оформлено на покупця <strong>#{shortId(form.shopperId ?? '')}</strong></Text>
          <Button variant="subtle" size="compact-sm" onClick={form.editCustomer}>Змінити</Button>
        </Group>
      )}
    </CheckoutSection>
  )
}
