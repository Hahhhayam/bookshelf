import { Stack, Text, Title } from '@mantine/core'
import { useCan, useViewer } from '@/entities/viewer'
import { tokens } from '@/shared/config/tokens'
import { Perm } from '@/shared/lib'
import { CashierHome } from './ui/CashierHome'
import { RoleTiles } from './ui/RoleTiles'

const today = new Intl.DateTimeFormat('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' })

function greeting(hour: number) {
  if (hour < 11) return 'Доброго ранку'
  if (hour < 18) return 'Доброго дня'
  return 'Доброго вечора'
}

/** Role-aware start page: the cashier's tiles and receipts, or the areas the user's rights open. */
export default function StaffHomePage() {
  const viewer = useViewer().data
  const can = useCan()
  const now = new Date()
  const date = today.format(now)
  return (
    <Stack gap="lg" maw={1180}>
      <Stack gap={4}>
        <Title order={1}>{greeting(now.getHours())}, {viewer?.login}</Title>
        <Text fz={15} c={tokens.color.ink2}>{date.charAt(0).toUpperCase() + date.slice(1)}</Text>
      </Stack>
      {can(Perm.SalesCreate) ? <CashierHome /> : <RoleTiles />}
    </Stack>
  )
}
