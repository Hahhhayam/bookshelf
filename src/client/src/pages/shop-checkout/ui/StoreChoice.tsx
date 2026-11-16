import { Group, Radio, Skeleton, Stack, Text } from '@mantine/core'
import { referenceName } from '@/entities/reference'
import type { StoreCoverage, useCartAvailability } from '@/features/shop-place-order'
import { ErrorView, StatusNote } from '@/shared/ui'
import type { CheckoutForm } from '../model/useCheckoutForm'

/** «Оберіть магазин»: stores from the cart books' availability (GAP-14); one missing a book cannot be chosen. */
export function StoreChoice({ form, availability }: { form: CheckoutForm; availability: ReturnType<typeof useCartAvailability> }) {
  if (availability.isPending) {
    return <Stack gap="xs" aria-busy="true">{[0, 1, 2].map((i) => <Skeleton key={i} height={48} radius={0} />)}</Stack>
  }
  if (availability.error) return <ErrorView error={availability.error} onRetry={availability.refetch} />
  if (availability.stores.length === 0) return <Text c="dimmed">Цих книжок зараз немає в жодному магазині.</Text>
  return (
    <Radio.Group label="Оберіть магазин" value={form.pickupStore} onChange={form.setPickup}>
      <Stack gap="xs" mt="xs">
        {availability.stores.map((store) => <StoreRow key={store.location} store={store} />)}
      </Stack>
    </Radio.Group>
  )
}

function StoreRow({ store }: { store: StoreCoverage }) {
  const complete = store.missing.length === 0
  return (
    <Radio.Card value={store.location} p="sm" disabled={!complete}>
      <Group wrap="nowrap" justify="space-between" align="flex-start" gap="sm">
        <Group wrap="nowrap" gap="sm" align="flex-start">
          <Radio.Indicator disabled={!complete} />
          <Text fw={600} fz={15}>{referenceName('locations', store.location)}</Text>
        </Group>
        <Stack gap={0} align="flex-end" ta="right">
          <StatusNote tone={complete ? 'ready' : 'attention'} size={14}>{complete ? 'Усе є' : 'Не все є'}</StatusNote>
          {!complete && <Text size="sm" c="dimmed">Бракує: {store.missing.map((t) => `«${t}»`).join(', ')}</Text>}
        </Stack>
      </Group>
    </Radio.Card>
  )
}
