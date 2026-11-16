import { Anchor, Stack } from '@mantine/core'
import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { useCan, useWorkingLocation } from '@/entities/viewer'
import { SupplierSelect } from '@/features/purchasing-manage-supplier'
import { Perm } from '@/shared/lib'
import { PageHeader, Panel } from '@/shared/ui'
import { DeliveryChooser, NoLocation } from './ui/DeliveryChooser'
import { PlannedDelivery } from './ui/PlannedDelivery'
import { ReceiptDone } from './ui/ReceiptDone'
import { ReceivingWorkspace } from './ui/ReceivingWorkspace'

/** Receiving a delivery (Receiving artboard): against a sent purchase order, or unplanned with a supplier. */
export default function ReceivingPage() {
  const [params, setParams] = useSearchParams()
  const location = useWorkingLocation()
  const can = useCan()
  const [done, setDone] = useState<string | null>(null)
  const [supplier, setSupplier] = useState<string | null>(null)
  const order = params.get('order')
  const unplanned = params.get('unplanned') === '1'
  const chosen = !!order || unplanned

  function restart() {
    setDone(null)
    setSupplier(null)
    setParams(new URLSearchParams())
  }

  return (
    <Stack gap={16}>
      <PageHeader
        eyebrow={chosen && <Anchor component="button" size="sm" onClick={restart}>← Очікувані поставки</Anchor>}
        title={unplanned ? 'Незапланована поставка' : 'Приймання поставки'}
        actions={location && <span>{location.name}</span>}
      />
      {!location ? <NoLocation />
        : done ? <ReceiptDone order={order} onNext={restart} />
          : order ? <PlannedDelivery orderId={order} location={location.id} onDone={setDone} />
            : unplanned ? (
              <Stack gap={16}>
                <Panel padding={20}><SupplierSelect value={supplier} onChange={setSupplier} canCreate={can(Perm.PurchasingManage)} /></Panel>
                <ReceivingWorkspace initialLines={[]} planned={false} location={location.id} order={null} supplier={supplier} onDone={setDone} />
              </Stack>
            )
              : <DeliveryChooser onPickOrder={(id) => setParams({ order: id })} onUnplanned={() => setParams({ unplanned: '1' })} />}
    </Stack>
  )
}
