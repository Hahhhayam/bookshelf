import { Stack } from '@mantine/core'
import { IconBuildingStore } from '@tabler/icons-react'
import { useReferenceList } from '@/entities/reference'
import { LocationFormButton } from '@/features/admin-locations'
import { EmptyState, PageHeader, Panel, QueryView } from '@/shared/ui'
import { LocationsTable } from './ui/LocationsTable'

/** Stores and warehouses: create, edit, deactivate (UI_Design 6.9, FR-19). */
export default function LocationsPage() {
  const locations = useReferenceList('locations')
  return (
    <Stack gap="lg">
      <PageHeader eyebrow="Адміністрування" title="Локації" actions={<LocationFormButton />} />
      <Panel>
        <QueryView
          query={locations} isEmpty={(list) => list.length === 0}
          empty={<EmptyState icon={<IconBuildingStore size={32} stroke={1.5} />} title="Локацій ще немає" text="Створіть магазин або склад." />}
        >
          {(list) => <LocationsTable locations={list} />}
        </QueryView>
      </Panel>
    </Stack>
  )
}
