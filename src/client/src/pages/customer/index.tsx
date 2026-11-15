import { Alert, SimpleGrid, Stack } from '@mantine/core'
import { IconShieldLock } from '@tabler/icons-react'
import { useParams } from 'react-router'
import { useCustomer } from '@/entities/customer'
import { QueryView } from '@/shared/ui'
import { BonusPanel } from './ui/BonusPanel'
import { ContactsPanel } from './ui/ContactsPanel'
import { CustomerHeader } from './ui/CustomerHeader'
import { PurchasesPanel } from './ui/PurchasesPanel'

/** FR-14 (artboard Customer): contacts, tier, segments, bonuses and purchases. Personal data: cashiers and CRM only. */
export default function CustomerPage() {
  const { id } = useParams()
  const customer = useCustomer(id)
  return (
    <Stack gap="lg">
      <Alert color="yellow" variant="light" icon={<IconShieldLock size={18} />}>
        <strong>Персональні дані.</strong> Контакти приховано — відкривайте лише за потреби й не копіюйте їх поза системою.
      </Alert>
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
    </Stack>
  )
}
