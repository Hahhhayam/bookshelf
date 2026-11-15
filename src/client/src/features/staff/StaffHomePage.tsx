import { Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'

/** Placeholder; each role will land on its own start page once GET /auth/me exists. */
export function StaffHomePage() {
  const { t } = useTranslation()
  return <Text c="dimmed">{t('staff.home')}</Text>
}
