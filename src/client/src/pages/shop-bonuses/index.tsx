import { Button, Stack, Text, Title } from '@mantine/core'
import { IconGift } from '@tabler/icons-react'
import { useState } from 'react'
import { useBonusSummary } from '@/entities/customer'
import { ShopperIdModal, useShopperId } from '@/entities/shopper'
import { EmptyState, QueryView } from '@/shared/ui'
import { BonusOverview } from './ui/BonusOverview'

/** The buyer's loyalty program (table 1.1 «Покупець … бонуси», FR-14): tier, balance and the history of operations. */
export default function ShopBonusesPage() {
  const shopperId = useShopperId()
  const summary = useBonusSummary(shopperId)
  const [asking, setAsking] = useState(false)

  return (
    <Stack gap="lg" maw={720}>
      <Title order={1} ff="var(--font-display)" fz={{ base: 28, sm: 38 }}>Мої бонуси</Title>
      {shopperId ? (
        <QueryView query={summary} skeletonRows={4}>{(bonuses) => <BonusOverview bonuses={bonuses} />}</QueryView>
      ) : (
        <EmptyState icon={<IconGift size={44} stroke={1.5} />} title="Вкажіть номер покупця"
          text="Бонуси прив’язані до картки покупця. Введіть номер з картки, щоб побачити баланс і рівень."
          actions={<Button onClick={() => setAsking(true)}>Ввести номер</Button>} />
      )}
      {shopperId && <Text size="sm" c="dimmed">Номер покупця: {shopperId}. <Button variant="subtle" size="compact-sm" onClick={() => setAsking(true)}>Змінити</Button></Text>}
      <ShopperIdModal opened={asking} onClose={() => setAsking(false)} />
    </Stack>
  )
}
