import { Alert, Grid, Stack } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import { useNavigate } from 'react-router'
import { useCan } from '@/entities/viewer'
import { FindByCardForm, OpenByIdForm } from '@/features/crm-find-customer'
import { RegisterCustomerForm } from '@/features/crm-register-customer'
import { Perm } from '@/shared/lib'
import { PageHeader, Panel } from '@/shared/ui'

/** FR-14: find a customer by card (or open by id) and register new ones. */
export default function CustomersPage() {
  const navigate = useNavigate()
  const can = useCan()
  const open = (id: string) => navigate(`/staff/customers/${id}`)

  return (
    <Stack gap="lg">
      <PageHeader eyebrow="Клієнти" title="Пошук клієнта" />
      <Alert variant="light" color="gray" icon={<IconInfoCircle size={18} />}>
        Пошук за ім’ям чи телефоном поки недоступний — знайдіть клієнта за номером картки лояльності.
      </Alert>
      <Grid gap="lg" align="flex-start">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="lg">
            <Panel title="За карткою" padding={16}><FindByCardForm onFound={open} /></Panel>
            <Panel title="За ідентифікатором" padding={16}><OpenByIdForm onOpen={open} /></Panel>
          </Stack>
        </Grid.Col>
        {can(Perm.CrmManage, Perm.SalesCreate) && (
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Panel title="Новий клієнт" padding={16}><RegisterCustomerForm onRegistered={open} /></Panel>
          </Grid.Col>
        )}
      </Grid>
    </Stack>
  )
}
