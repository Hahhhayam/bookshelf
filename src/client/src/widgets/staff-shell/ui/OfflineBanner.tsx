import { Group, Text } from '@mantine/core'
import { useNetwork } from '@mantine/hooks'
import { IconWifiOff } from '@tabler/icons-react'
import { tokens } from '@/shared/config/tokens'

/**
 * Shown while the browser is offline. Commands keep their operation keys, so they can be retried safely once the
 * connection is back; the client does not queue sales offline (API_GAPS.md, GAP-19).
 */
export function OfflineBanner() {
  const { online } = useNetwork()
  if (online) return null
  return (
    <Group role="alert" gap="sm" px="lg" py={10} style={{ background: tokens.color.offlineBg, color: tokens.color.offlineText }}>
      <IconWifiOff size={20} stroke={1.75} color={tokens.color.offlineIcon} />
      <Text size="md"><strong>Немає з’єднання з сервером.</strong> Дії не втратяться: повторіть їх, коли з’єднання повернеться.</Text>
    </Group>
  )
}
