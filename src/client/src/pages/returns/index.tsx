import { SimpleGrid, Stack } from '@mantine/core'
import { IconBuildingStore } from '@tabler/icons-react'
import { useCan, useWorkingLocation } from '@/entities/viewer'
import { CreateReturnForm, PendingReturns } from '@/features/till-return'
import { Perm } from '@/shared/lib'
import { EmptyState, PageHeader } from '@/shared/ui'

export default function ReturnsPage() {
  const can = useCan()
  const location = useWorkingLocation()
  const canCreate = can(Perm.ReturnsCreate)
  return (
    <Stack gap="lg">
      <PageHeader title="Повернення" eyebrow="Повернення за чеком протягом 7 днів" />
      {!location ? (
        <EmptyState icon={<IconBuildingStore size={36} stroke={1.75} />} title="Оберіть магазин"
          text="Повернення оформлюють у магазині, де був продаж." />
      ) : (
        <SimpleGrid cols={{ base: 1, lg: canCreate ? 2 : 1 }} spacing="lg" style={{ alignItems: 'start' }}>
          {canCreate && <CreateReturnForm key={location.id} locationId={location.id} />}
          <PendingReturns locationId={location.id} />
        </SimpleGrid>
      )}
    </Stack>
  )
}
