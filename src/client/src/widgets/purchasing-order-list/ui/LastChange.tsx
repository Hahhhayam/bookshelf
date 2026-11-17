import { Group, Stack, Text } from '@mantine/core'
import { useUserInitials, useUserNames } from '@/entities/reference'
import { tokens } from '@/shared/config/tokens'
import { formatAgo } from '@/shared/lib'

/** «12 хв тому» over who made the change, with their initials. */
export function LastChange({ at, by }: { at: string | null; by: string | null }) {
  const userName = useUserNames()
  const initialsOf = useUserInitials()
  if (!at) return <Text span c="dimmed" size="sm">—</Text>
  return (
    <Group gap={8} wrap="nowrap">
      <span
        aria-hidden="true"
        style={{
          width: 24, height: 24, flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700, background: tokens.color.accentSoft, color: tokens.color.accent,
        }}
      >
        {initialsOf(by)}
      </span>
      <Stack gap={0} style={{ lineHeight: 1.3, whiteSpace: 'nowrap' }}>
        <Text fz={13}>{formatAgo(at)}</Text>
        <Text fz={12} c={tokens.color.ink2}>{userName(by)}</Text>
      </Stack>
    </Group>
  )
}
