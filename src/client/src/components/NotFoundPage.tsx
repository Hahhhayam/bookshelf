import { Button, Center, Stack, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

export function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <Center h="100vh">
      <Stack align="center">
        <Title order={2}>{t('notFound.title')}</Title>
        <Button component={Link} to="/">{t('notFound.back')}</Button>
      </Stack>
    </Center>
  )
}
