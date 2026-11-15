import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import type { QuickMethod } from '@/features/till-payment'
import { useReceipt, useReceiptQuote } from '@/features/till-receipt'
import type { TillCommand, TillMode } from './tillKeymap'
import { useTillCheckout } from './useTillCheckout'
import { useTillKeyboard } from './useTillKeyboard'
import { useTillScan } from './useTillScan'

export type TillDialog =
  | { kind: 'quick'; method: QuickMethod }
  | { kind: 'split'; adjust: boolean }
  | { kind: 'customer' | 'search' | 'remove' | 'void' }
  | null

/** Wires the receipt, scan, payment and dialogs to the keyboard; the screen components only render. */
export function useTillController(locationId: string) {
  const navigate = useNavigate()
  const scanRef = useRef<HTMLInputElement>(null)
  const controls = useReceipt(locationId)
  const { receipt } = controls
  const quote = useReceiptQuote(receipt.lines)
  const scan = useTillScan(locationId, receipt.lines, controls.add)
  const checkout = useTillCheckout(locationId, controls)
  const [dialog, setDialog] = useState<TillDialog>(null)

  const anyDialog = dialog !== null || scan.pick !== null
  const mode: TillMode = anyDialog ? 'dialog' : checkout.failure ? 'problem' : checkout.closed ? 'closed' : 'receipt'
  const empty = receipt.lines.length === 0

  // The scan field takes focus back whenever nothing else is on screen; Mantine returns focus first, so wait a frame.
  useEffect(() => {
    if (mode !== 'receipt' && mode !== 'closed') return
    const frame = requestAnimationFrame(() => scanRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [mode, receipt.lines.length])

  function openPay(method: QuickMethod | 'Split') {
    if (empty || checkout.busy || quote.pending) return
    checkout.dismissFailure()
    setDialog(method === 'Split' ? { kind: 'split', adjust: false } : { kind: 'quick', method })
  }

  function exit() {
    if (empty) return navigate('/staff')
    scan.setMessage({ tone: 'error', title: 'Чек не закрито', text: 'Вийти з каси можна лише з порожнім чеком: проведіть оплату або анулюйте чек (Ctrl+Del).' })
  }

  function newReceipt() {
    checkout.finish()
    scan.setMessage(null)
  }

  const commands: Record<TillCommand, () => void> = {
    search: () => setDialog({ kind: 'search' }),
    customer: () => setDialog({ kind: 'customer' }),
    split: () => openPay('Split'),
    cash: () => openPay('Cash'),
    card: () => openPay('Card'),
    certificate: () => openPay('GiftCertificate'),
    exit,
    up: () => controls.move(-1),
    down: () => controls.move(1),
    plus: () => receipt.selected >= 0 && controls.step(receipt.selected, 1),
    minus: () => receipt.selected >= 0 && controls.step(receipt.selected, -1),
    remove: () => receipt.selected >= 0 && setDialog({ kind: 'remove' }),
    void: () => !empty && setDialog({ kind: 'void' }),
    focusScan: () => scanRef.current?.focus(),
    enter: () => { if (checkout.closed) newReceipt() },
  }
  useTillKeyboard(mode, scanRef, (command) => commands[command]())

  function scanCode(code: string) {
    if (checkout.closed) newReceipt()
    scan.scan(code)
  }

  return { scanRef, controls, receipt, quote, scan, scanCode, checkout, dialog, setDialog, openPay, exit, newReceipt, empty }
}

export type TillController = ReturnType<typeof useTillController>
