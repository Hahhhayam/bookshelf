import { SimpleGrid, Stack } from '@mantine/core'
import { useParams } from 'react-router'
import { useCustomer } from '@/entities/customer'
import { QueryView } from '@/shared/ui'
import { BonusPanel } from './ui/BonusPanel'
import { ContactsPanel } from './ui/ContactsPanel'
import { CustomerHeader } from './ui/CustomerHeader'
import { PurchasesPanel } from './ui/PurchasesPanel'

/** FR-14 (artboard Customer): contacts, tier, segments, bonuses and purchases. */
export default function CustomerPage() {
  const { id } = useParams()
  const customer = useCustomer(id)
  return (
    <QueryView query={customer} skeletonRows={8}>
      {(card) => (
        <Stack gap="lg">
          <CustomerHeader customer={card} />
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" style={{ alignItems: 'start' }}>
            <ContactsPanel customer={card} />
            <BonusPanel customer={card} />
          </SimpleGrid>
          <PurchasesPanel purchases={card.purchases} />
        </Stack>
      )}
    </QueryView>
  )
}
