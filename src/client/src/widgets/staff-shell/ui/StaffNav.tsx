import { NavLink as MantineNavLink, ScrollArea, Stack, Text } from '@mantine/core'
import { NavLink } from 'react-router'
import { useCan } from '@/entities/viewer'
import { tokens } from '@/shared/config/tokens'
import type { NavGroup } from '../model/types'

/** The side menu, filtered by the user's rights: a cashier sees four items, an administrator all of them. */
export function StaffNav({ navigation, onNavigate }: { navigation: NavGroup[]; onNavigate?: () => void }) {
  const can = useCan()
  const groups = navigation
    .map((group) => ({ ...group, items: group.items.filter((item) => can(...(item.anyOf ?? []))) }))
    .filter((group) => group.items.length > 0)

  return (
    <ScrollArea type="auto" style={{ flex: 1 }}>
      <Stack gap="md" py="xs" component="nav" aria-label="Розділи">
        {groups.map((group) => (
          <Stack key={group.title ?? 'main'} gap={2}>
            {group.title && (
              <Text size="xs" fw={700} c="dimmed" tt="uppercase" px="sm" pb={4} style={{ letterSpacing: '.08em' }}>
                {group.title}
              </Text>
            )}
            {group.items.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} style={{ textDecoration: 'none' }} onClick={onNavigate}>
                {({ isActive }) => (
                  <MantineNavLink
                    component="span"
                    label={item.label}
                    leftSection={item.icon}
                    active={isActive}
                    variant="light"
                    styles={{
                      root: {
                        height: 44,
                        color: isActive ? tokens.color.accent : tokens.color.ink2,
                        fontWeight: isActive ? 600 : 500,
                        background: isActive ? tokens.color.accentSoft : undefined,
                        boxShadow: isActive ? `inset 3px 0 0 ${tokens.color.accent}` : undefined,
                      },
                      label: { fontSize: 15 },
                    }}
                  />
                )}
              </NavLink>
            ))}
          </Stack>
        ))}
      </Stack>
    </ScrollArea>
  )
}
