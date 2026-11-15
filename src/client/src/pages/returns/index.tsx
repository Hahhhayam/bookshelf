import { SimpleGrid, Stack } from '@mantine/core'
import { useCan } from '@/entities/viewer'
import { CreateReturnForm, PendingReturns } from '@/features/till-return'
import { Perm } from '@/shared/lib'
import { PageHeader } from '@/shared/ui'

export default function ReturnsPage() {
  const can = useCan()
  const canCreate = can(Perm.ReturnsCreate)
  return (
    <Stack gap="lg">
      <PageHeader title="Повернення" eyebrow="Повернення за чеком протягом 7 днів" />
      <SimpleGrid cols={{ base: 1, lg: canCreate ? 2 : 1 }} spacing="lg" style={{ alignItems: 'start' }}>
        {canCreate && <CreateReturnForm />}
        <PendingReturns />
      </SimpleGrid>
    </Stack>
  )
}
