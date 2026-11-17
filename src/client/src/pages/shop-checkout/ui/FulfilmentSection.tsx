import { Group, Radio, SimpleGrid, Stack, Text, Textarea } from '@mantine/core'
import type { FulfilmentKind } from '@/entities/order'
import { storeName, useStores } from '@/entities/store'
import type { useCartAvailability } from '@/features/shop-place-order'
import { tokens } from '@/shared/config/tokens'
import type { CheckoutForm } from '../model/useCheckoutForm'
import { CheckoutSection } from './CheckoutSection'
import { StoreChoice } from './StoreChoice'

const options: { kind: FulfilmentKind; title: string; text: string }[] = [
  { kind: 'Pickup', title: 'Самовивіз з магазину', text: 'Заберете в обраному магазині' },
  { kind: 'Delivery', title: 'Доставка', text: 'Відправимо з магазину, де є всі книжки' },
]

export function FulfilmentSection({ form, availability }: { form: CheckoutForm; availability: ReturnType<typeof useCartAvailability> }) {
  return (
    <CheckoutSection step={2} title="Отримання">
      <Radio.Group value={form.kind} onChange={(value) => form.setKind(value as FulfilmentKind)} aria-label="Спосіб отримання">
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
          {options.map((option) => <KindCard key={option.kind} {...option} />)}
        </SimpleGrid>
      </Radio.Group>
      {form.kind === 'Pickup'
        ? <StoreChoice form={form} availability={availability} />
        : <DeliveryFields form={form} />}
    </CheckoutSection>
  )
}

function KindCard({ kind, title, text }: { kind: FulfilmentKind; title: string; text: string }) {
  return (
    <Radio.Card value={kind} p="md">
      <Group wrap="nowrap" align="flex-start" gap="sm">
        <Radio.Indicator />
        <Stack gap={4}>
          <Text fz={16} fw={700}>{title}</Text>
          <Text size="md" c={tokens.color.ink2}>{text}</Text>
        </Stack>
      </Group>
    </Radio.Card>
  )
}

function DeliveryFields({ form }: { form: CheckoutForm }) {
  const stores = useStores().data
  return (
    <Stack gap="xs">
      <Textarea label="Адреса доставки" placeholder="Місто, вулиця, будинок, квартира або відділення перевізника"
        autosize minRows={2} value={form.address} onChange={(e) => form.setAddress(e.currentTarget.value)} required />
      <Text size="sm" c={tokens.color.ink2}>
        {form.deliveryStock
          ? `Відправимо з: ${storeName(stores, form.deliveryStock)}.`
          : 'Зараз немає магазину, де є всі книжки разом.'}
      </Text>
    </Stack>
  )
}
