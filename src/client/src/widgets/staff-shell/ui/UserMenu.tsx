import { Menu, Stack, Text, UnstyledButton, Group } from '@mantine/core'
import { IconLogout } from '@tabler/icons-react'
import { useNavigate } from 'react-router'
import { useLogout } from '@/features/auth'
import { useViewer } from '@/entities/viewer'
import { Initials } from '@/shared/ui'

export function UserMenu() {
  const viewer = useViewer().data
  const logout = useLogout()
  const navigate = useNavigate()
  if (!viewer) return null

  return (
    <Menu position="bottom-end" shadow="md" width={220}>
      <Menu.Target>
        <UnstyledButton aria-label="Меню користувача" h={44} px={6}>
          <Group gap={10}>
            <Initials name={viewer.login} size={36} solid />
            <Stack gap={0} visibleFrom="sm">
              <Text fw={600} size="md">{viewer.login}</Text>
              <Text size="xs" c="dimmed">{viewer.permissions.length} прав</Text>
            </Stack>
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconLogout size={16} />}
          onClick={() => logout.mutate(undefined, { onSettled: () => navigate('/staff/login', { replace: true }) })}
        >
          Вийти
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
