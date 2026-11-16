import { Alert, Grid, Stack } from '@mantine/core'
import { IconDiscount, IconInfoCircle } from '@tabler/icons-react'
import { useReferenceList } from '@/entities/reference'
import { EmptyState, PageHeader, Panel, QueryView } from '@/shared/ui'
import { PromotionForm } from '@/widgets/crm-promotion-form'
import { PromotionTable } from './ui/PromotionTable'

/** FR-15. The list holds promotions created in this browser until the API can list them (GAP-12). */
export default function PromotionsPage() {
  const promotions = useReferenceList('promotions')
  return (
    <Stack gap="lg">
      <PageHeader eyebrow="Клієнти" title="Акції" />
      <Alert variant="light" color="gray" icon={<IconInfoCircle size={18} />}>
        Сервер поки не віддає список акцій, тож тут видно лише акції, створені в цьому браузері. Каси застосовують
        акції автоматично.
      </Alert>
      <Grid gap="lg" align="flex-start">
        <Grid.Col span={{ base: 12, lg: 5 }}>
          <Panel title="Нова акція" padding={16}><PromotionForm /></Panel>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 7 }}>
          <Panel title="Акції">
            <QueryView query={promotions} isEmpty={(rows) => rows.length === 0}
              empty={<EmptyState icon={<IconDiscount size={40} stroke={1.5} />} title="Акцій ще немає"
                text="Створіть першу акцію у формі ліворуч." />}>
              {(rows) => <PromotionTable rows={rows} />}
            </QueryView>
          </Panel>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}
