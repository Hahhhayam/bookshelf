import { Stack } from '@mantine/core'
import { IconBuildingStore } from '@tabler/icons-react'
import { RememberedNote } from '@/shared/ui'
import { useKnownLocations } from '@/entities/reference'
import { useViewer } from '@/entities/viewer'
import { LocationFormButton } from '@/features/admin-locations'
import { EmptyState, PageHeader, Panel, QueryView } from '@/shared/ui'
import { LocationsTable } from './ui/LocationsTable'

/** Stores and warehouses: create, edit, deactivate (UI_Design 6.9, FR-19). */
export default function LocationsPage() {
  const locations = useKnownLocations(useViewer().data?.locations)
  return (
    <Stack gap="lg">
      <PageHeader eyebrow="Адміністрування" title="Локації" actions={<LocationFormButton />} />
      <RememberedNote>
        Сервер поки не віддає список локацій (GAP-03): тут ваші локації та створені або побачені в цьому браузері.
        Адресу локації, відомої лише з вашого доступу, сервер не повідомляє — її видно після редагування.
      </RememberedNote>
      <Panel>
        <QueryView
          query={locations.query} isEmpty={() => locations.list.length === 0}
          empty={<EmptyState icon={<IconBuildingStore size={32} stroke={1.5} />} title="Локацій ще немає" text="Створіть магазин або склад." />}
        >
          {() => <LocationsTable locations={locations.list} />}
        </QueryView>
      </Panel>
    </Stack>
  )
}
