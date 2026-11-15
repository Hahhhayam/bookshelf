import { Stack } from '@mantine/core'
import { IconPlugConnected } from '@tabler/icons-react'
import { RememberedNote } from '@/shared/ui'
import { useReferenceList } from '@/entities/reference'
import { CreateIntegrationButton } from '@/features/admin-integrations'
import { EmptyState, PageHeader, Panel, QueryView } from '@/shared/ui'
import { IntegrationsTable } from './ui/IntegrationsTable'

/** Connections to payment, online shop, accounting and notification services (UI_Design 6.9, FR-20). */
export default function IntegrationsPage() {
  const integrations = useReferenceList('integrations')
  return (
    <Stack gap="lg">
      <PageHeader eyebrow="Адміністрування" title="Інтеграції" actions={<CreateIntegrationButton />} />
      <RememberedNote>
        Одного типу може бути кілька підключень — наприклад, два платіжні сервіси. Сервер поки не віддає список
        підключень (GAP-10), тому тут лише створені в цьому браузері; «Працює» означає лише, що підключення
        ввімкнене — стану зв’язку сервер не повідомляє.
      </RememberedNote>
      <Panel>
        <QueryView
          query={integrations} isEmpty={(list) => list.length === 0}
          empty={<EmptyState icon={<IconPlugConnected size={32} stroke={1.5} />} title="Підключень ще немає" text="Додайте платіжний сервіс, онлайн-магазин, бухгалтерію або сповіщення." />}
        >
          {(list) => <IntegrationsTable integrations={list} />}
        </QueryView>
      </Panel>
    </Stack>
  )
}
