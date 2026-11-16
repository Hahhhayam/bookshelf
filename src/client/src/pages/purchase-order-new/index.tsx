import { Anchor, SimpleGrid, Stack, Text, TextInput } from '@mantine/core'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { BookLookup } from '@/entities/book'
import { OrderLinesEditor, useCreateOrder, useOrderDraft, validateDraft } from '@/features/purchasing-create-order'
import { SupplierSelect } from '@/features/purchasing-manage-supplier'
import { PageHeader, Panel } from '@/shared/ui'
import { SubmitBar } from './ui/SubmitBar'

/** A new purchase order: supplier, expected date and the books with purchase prices. */
export default function PurchaseOrderNewPage() {
  const navigate = useNavigate()
  const order = useOrderDraft()
  const create = useCreateOrder()
  const [submitted, setSubmitted] = useState(false)
  const errors = submitted ? validateDraft(order.draft) : {}

  function submit() {
    setSubmitted(true)
    if (Object.keys(validateDraft(order.draft)).length > 0) return
    create.mutate(order.draft, { onSuccess: (id) => navigate(`/staff/purchase-orders/${id}`) })
  }

  return (
    <Stack gap="lg">
      <PageHeader
        eyebrow={<Anchor component={Link} to="/staff/purchase-orders" size="sm">Замовлення постачальникам</Anchor>}
        title="Нове замовлення"
      />
      <Panel padding={20}>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          <SupplierSelect value={order.draft.supplier} onChange={order.setSupplier} error={errors.supplier} />
          <TextInput type="date" label="Очікувана поставка" required min={order.minDate} value={order.draft.expectedDate}
            error={errors.expectedDate} onChange={(event) => order.setExpectedDate(event.currentTarget.value)} />
        </SimpleGrid>
      </Panel>
      <Panel title="Позиції" extra={errors.lines && <Text size="sm" c="red">{errors.lines}</Text>}>
        <Stack gap={0}>
          <div style={{ padding: 16 }}>
            <BookLookup onPick={order.addBook} placeholder="Скан ISBN або назва — книга додасться до замовлення" />
          </div>
          <OrderLinesEditor lines={order.draft.lines} onChange={order.updateLine} onRemove={order.removeLine} />
        </Stack>
      </Panel>
      <SubmitBar pending={create.isPending} error={create.error} onSubmit={submit} />
    </Stack>
  )
}
