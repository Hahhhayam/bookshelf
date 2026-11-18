import { Stack, Text, Title } from '@mantine/core'
import { useNavigate, useParams } from 'react-router'
import { useShopperId } from '@/entities/shopper'
import { tokens } from '@/shared/config/tokens'
import { MyOrders } from './ui/MyOrders'
import { TrackForm } from './ui/TrackForm'
import { TrackResult } from './ui/TrackResult'

/** Order tracking by pickup code (artboards ShopTrack, ShopMobile e): status and its changes, no personal data. */
export default function ShopTrackPage() {
  const { code } = useParams()
  const navigate = useNavigate()
  const shopperId = useShopperId()
  return (
    <Stack gap="xl" maw={760} mx="auto">
      <Stack gap="sm">
        <Title order={1} ff="var(--font-display)" fz={{ base: 32, sm: 44 }}>Де моє замовлення?</Title>
        <TrackForm initial={code ?? ''} onSubmit={(next) => navigate(`/track/${encodeURIComponent(next)}`)} />
        <Text size="md" c={tokens.color.ink2}>Код є на сторінці підтвердження.</Text>
      </Stack>
      {code && <TrackResult code={code} />}
      {shopperId && <MyOrders customer={shopperId} />}
    </Stack>
  )
}
