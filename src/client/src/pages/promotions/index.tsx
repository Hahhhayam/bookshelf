import { Grid, Stack } from '@mantine/core'
import { IconDiscount } from '@tabler/icons-react'
import { useReferenceList } from '@/entities/reference'
import { EmptyState, PageHeader, Panel, QueryView } from '@/shared/ui'
import { PromotionForm } from '@/widgets/crm-promotion-form'
import { PromotionTable } from './ui/PromotionTable'

/** FR-15: promotions for everybody and personal offers for a segment or one customer; the till applies them. */
export default function PromotionsPage() {
  const promotions = useReferenceList('promotions')
  return (
    <Stack gap="lg">
      <PageHeader eyebrow="Клієнти" title="Акції" />
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
