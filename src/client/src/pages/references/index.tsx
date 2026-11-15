import { Alert, Anchor, Stack, Tabs } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import { Link } from 'react-router'
import { PageHeader } from '@/shared/ui'
import { ReferenceList } from './ui/ReferenceList'

/** Authors, publishers and categories (FR-02): created, renamed and (except categories) switched off here. */
export default function ReferencesPage() {
  return (
    <Stack gap="lg">
      <PageHeader eyebrow={<Anchor component={Link} to="/staff/catalog" size="sm">Каталог</Anchor>} title="Довідники" />
      <Alert variant="light" color="gray" icon={<IconInfoCircle size={18} />}>
        Сервер поки не віддає списки довідників, тому тут видно лише записи, створені або побачені в цьому браузері.
        Автори й видавництва не видаляються — їх можна деактивувати й повернути.
      </Alert>
      <Tabs defaultValue="authors" keepMounted={false}>
        <Tabs.List mb="md">
          <Tabs.Tab value="authors">Автори</Tabs.Tab>
          <Tabs.Tab value="publishers">Видавництва</Tabs.Tab>
          <Tabs.Tab value="categories">Категорії</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="authors"><ReferenceList kind="authors" /></Tabs.Panel>
        <Tabs.Panel value="publishers"><ReferenceList kind="publishers" /></Tabs.Panel>
        <Tabs.Panel value="categories"><ReferenceList kind="categories" /></Tabs.Panel>
      </Tabs>
    </Stack>
  )
}
