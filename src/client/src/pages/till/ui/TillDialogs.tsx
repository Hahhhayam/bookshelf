import { Text } from '@mantine/core'
import { tierLabel } from '@/entities/customer'
import { CustomerCardDialog } from '@/features/till-customer'
import {
  PaymentProblemDialog, QuickPayDialog, SplitPaymentDialog, toCents, type ProblemAction,
} from '@/features/till-payment'
import { BookPickDialog, TitleSearchDialog } from '@/features/till-scan'
import { ConfirmDialog } from '@/shared/ui'
import type { TillController } from '../model/useTillController'

/** Every dialog of the till; each one closes back to the scan field. */
export function TillDialogs({ till, locationId }: { till: TillController; locationId: string }) {
  const { dialog, setDialog, receipt, controls, checkout, scan, quote } = till
  const close = () => setDialog(null)
  const total = toCents(quote.total)
  const selectedLine = receipt.lines[receipt.selected]
  const customer = receipt.customer

  function onProblem(action: ProblemAction) {
    if (action === 'retry') return checkout.retry()
    if (action === 'adjust') {
      checkout.dismissFailure()
      return setDialog({ kind: 'split', adjust: true })
    }
    till.openPay(action)
  }

  return (
    <>
      <QuickPayDialog method={dialog?.kind === 'quick' ? dialog.method : null} total={total} busy={checkout.busy}
        onClose={close} onSubmit={(plan) => { close(); checkout.pay(plan) }} />
      <SplitPaymentDialog opened={dialog?.kind === 'split'} adjustTotal={dialog?.kind === 'split' && dialog.adjust}
        total={total} busy={checkout.busy} onClose={close} onSubmit={(plan) => { close(); checkout.pay(plan) }}
        bonusBalance={customer ? toCents(customer.bonusBalance) : null}
        subtitle={customer ? `${customer.name}, ${tierLabel[customer.tier]} рівень` : 'Без клієнта'} />
      <PaymentProblemDialog failure={dialog ? null : checkout.failure} busy={checkout.busy} onAction={onProblem}
        onClose={checkout.dismissFailure} />
      <CustomerCardDialog opened={dialog?.kind === 'customer'} hasCustomer={customer !== null} onClose={close}
        onFound={controls.setCustomer} onClear={() => controls.setCustomer(null)} />
      <TitleSearchDialog opened={dialog?.kind === 'search'} locationId={locationId} onClose={close}
        onPick={(hit) => { close(); scan.addHit(hit) }} />
      <BookPickDialog hits={scan.pick?.hits ?? null} code={scan.pick?.code ?? ''} locationId={locationId}
        onClose={scan.closePick} onPick={scan.addHit} />
      <ConfirmDialog opened={dialog?.kind === 'remove'} title="Прибрати рядок?" confirmLabel="Прибрати" danger
        onClose={close} onConfirm={() => { controls.remove(receipt.selected); close() }}>
        <Text>«{selectedLine?.title}», {selectedLine?.quantity} шт. зникне з чека.</Text>
      </ConfirmDialog>
      <ConfirmDialog opened={dialog?.kind === 'void'} title="Анулювати чек?" confirmLabel="Анулювати" danger
        onClose={close} onConfirm={() => { controls.renew(); scan.setMessage(null); close() }}>
        <Text>Усі рядки й клієнт зникнуть; чек не буде проведено.</Text>
      </ConfirmDialog>
    </>
  )
}
