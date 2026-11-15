import { Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'

/** Placeholder; the catalog and search from the design come next. */
export function CatalogPage() {
  const { t } = useTranslation()
  return <Title order={2}>{t('shop.catalog')}</Title>
}
