import { Alert, Button, Stack } from '@mantine/core'
import { IconInfoCircle, IconPlus } from '@tabler/icons-react'
import { useState } from 'react'
import { useReferenceList, type Supplier } from '@/entities/reference'
import { SupplierFormDialog } from '@/features/purchasing-manage-supplier'
import { EmptyState, PageHeader, Panel, QueryView } from '@/shared/ui'
import { SupplierTable } from './ui/SupplierTable'

/** Which supplier the dialog edits; `seq` remounts it so its fields start fresh each time. */
interface DialogState {
  seq: number
  supplier?: Supplier
}

/** Suppliers remembered in this browser (GAP-03): create, edit, activate and deactivate. */
export default function SuppliersPage() {
  const query = useReferenceList('suppliers')
  const [dialog, setDialog] = useState<DialogState | null>(null)
  const open = (supplier?: Supplier) => setDialog((d) => ({ seq: (d?.seq ?? 0) + 1, supplier }))

  return (
    <Stack gap={20}>
      <PageHeader
        eyebrow="Закупівлі"
        title="Постачальники"
        actions={<Button leftSection={<IconPlus size={16} />} onClick={() => open()}>Новий постачальник</Button>}
      />
      <Alert color="blue" variant="light" icon={<IconInfoCircle size={18} />}>
        Сервер поки не віддає список постачальників, тому тут видно лише тих, кого створили або змінили в цьому
        браузері. Постачальники з інших комп’ютерів з’являться, коли API навчиться їх перелічувати.
      </Alert>
      <Panel>
        <QueryView
          query={query}
          isEmpty={(data) => data.length === 0}
          empty={(
            <EmptyState
              title="Постачальників ще немає"
              text="Додайте постачальника, щоб оформлювати йому замовлення."
              actions={<Button onClick={() => open()}>Новий постачальник</Button>}
            />
          )}
        >
          {(suppliers) => <SupplierTable suppliers={suppliers} onEdit={open} />}
        </QueryView>
      </Panel>
      {dialog && (
        <SupplierFormDialog key={dialog.seq} opened supplier={dialog.supplier} onClose={() => setDialog(null)} />
      )}
    </Stack>
  )
}
