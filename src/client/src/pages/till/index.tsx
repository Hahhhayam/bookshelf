import { Button, Center } from '@mantine/core'
import { IconBuildingStore } from '@tabler/icons-react'
import { Link } from 'react-router'
import { useViewer, useWorkingLocation } from '@/entities/viewer'
import { EmptyState } from '@/shared/ui'
import { TillScreen } from './ui/TillScreen'

export default function TillPage() {
  const viewer = useViewer().data
  const location = useWorkingLocation()
  if (!location || location.type !== 'Store') {
    return (
      <Center h="100vh">
        <EmptyState icon={<IconBuildingStore size={40} stroke={1.75} />} title="Каса працює лише в магазині"
          text="Оберіть магазин у перемикачі локацій або попросіть адміністратора додати вас до магазину."
          actions={<Button component={Link} to="/staff">На головну</Button>} />
      </Center>
    )
  }
  // Keyed by location: switching stores opens a new receipt with that store's operation key.
  return <TillScreen key={location.id} locationId={location.id} store={location.name} cashier={viewer?.login ?? ''} />
}
