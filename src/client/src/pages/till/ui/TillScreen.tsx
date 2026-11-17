import { Center, Stack } from '@mantine/core'
import { IconLock } from '@tabler/icons-react'
import { useOpenShift } from '@/entities/sale'
import { CustomerPanel } from '@/features/till-customer'
import { ClosedReceipt, PayButtons } from '@/features/till-payment'
import { ReceiptLines, ReceiptTotals } from '@/features/till-receipt'
import { ScanStatus } from '@/features/till-scan'
import { ShiftControl } from '@/features/till-shift'
import { tokens } from '@/shared/config/tokens'
import { EmptyState, ScanField, type ScanHint } from '@/shared/ui'
import { useTillController, type TillController } from '../model/useTillController'
import { KeyHints } from './KeyHints'
import { TillDialogs } from './TillDialogs'
import { TillHeader } from './TillHeader'

const scanHints: ScanHint[] = [{ key: 'Enter', label: 'додати' }, { key: 'F2', label: 'пошук за назвою' }]

function TillScan({ till, error, placeholder = 'Скануйте штрихкод або введіть ISBN' }: {
  till: TillController
  error?: boolean
  placeholder?: string
}) {
  return (
    <ScanField ref={till.scanRef} size="xl" autoFocus aria-label="Штрихкод, ISBN або назва" placeholder={placeholder}
      hints={scanHints} onScan={till.scanCode} busy={till.scan.busy} error={error} />
  )
}

function ReceiptSection({ till }: { till: TillController }) {
  const { receipt, controls, scan } = till
  return (
    <Stack component="section" aria-label="Чек" gap={12} p={20} style={{ flex: 1, minWidth: 0 }}>
      <TillScan till={till} error={scan.message?.tone === 'error'} />
      <ScanStatus message={scan.message} />
      <div style={{ flex: 1, minHeight: 0, background: tokens.color.surface, border: `1px solid ${tokens.color.line}`, overflow: 'auto' }}>
        <ReceiptLines lines={receipt.lines} priced={till.quote.lineOf} selected={receipt.selected} onSelect={controls.select} onStep={controls.step} />
      </div>
      <KeyHints discount={till.canDiscount} />
    </Stack>
  )
}

function SidePanel({ till }: { till: TillController }) {
  const count = till.receipt.lines.reduce((sum, l) => sum + l.quantity, 0)
  return (
    <Stack component="aside" aria-label="Клієнт і оплата" gap={16} p={20} w={392}
      style={{ flex: 'none', background: tokens.color.surface, borderLeft: `1px solid ${tokens.color.line}` }}>
      <CustomerPanel customer={till.receipt.customer} />
      <ReceiptTotals count={count} quote={till.quote} />
      <div style={{ marginTop: 'auto' }}>
        <PayButtons disabled={till.empty || till.checkout.busy || till.quote.pending || till.quote.error !== null} onPay={till.openPay} />
      </div>
    </Stack>
  )
}

/** A sale needs an open shift (3.5 «Каса відкрита»); the receipt being paid stays on screen until it closes. */
function TillClosed({ locationId }: { locationId: string }) {
  return (
    <Center style={{ flex: 1 }}>
      <EmptyState icon={<IconLock size={40} stroke={1.75} />} title="Каса закрита"
        text="Продаж можливий лише у відкриту зміну." actions={<ShiftControl locationId={locationId} />} />
    </Center>
  )
}

/** The full-screen till (Till, TillPay and TillStates artboards); base font 16 px. */
export function TillScreen({ locationId, store, cashier }: { locationId: string; store: string; cashier: string }) {
  const till = useTillController(locationId)
  const shift = useOpenShift(locationId).data
  const closed = till.checkout.closed
  const tillClosed = shift !== undefined && !shift.open && !closed && till.empty
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: tokens.color.paper, fontSize: 16, fontFeatureSettings: "'tnum' 1" }}>
      <TillHeader store={store} shiftSince={shift?.open ? shift.openedAt : null} cashier={cashier} onExit={till.exit} />
      {tillClosed ? <TillClosed locationId={locationId} /> : closed ? (
        <ClosedReceipt sale={closed} onNew={till.newReceipt}
          scanSlot={<TillScan till={till} placeholder="Скануйте наступну книгу — відкриється новий чек" />} />
      ) : (
        <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
          <ReceiptSection till={till} />
          <SidePanel till={till} />
        </div>
      )}
      <TillDialogs till={till} locationId={locationId} />
    </div>
  )
}
