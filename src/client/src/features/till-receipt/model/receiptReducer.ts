import type { CustomerCard } from '@/entities/customer'
import type { ReceiptLine, ReceiptState } from './types'

export type ReceiptAction =
  | { type: 'add'; line: Omit<ReceiptLine, 'quantity'> }
  | { type: 'step'; index: number; delta: 1 | -1 }
  | { type: 'select'; index: number }
  | { type: 'move'; delta: 1 | -1 }
  | { type: 'remove'; index: number }
  | { type: 'customer'; customer: CustomerCard | null }
  | { type: 'reset'; key: string }

export function emptyReceipt(key: string): ReceiptState {
  return { key, lines: [], selected: -1, customer: null }
}

const clamp = (value: number, max: number) => Math.max(0, Math.min(value, max))

function add(state: ReceiptState, line: Omit<ReceiptLine, 'quantity'>): ReceiptState {
  const existing = state.lines.findIndex((l) => l.book === line.book)
  if (existing >= 0) return step({ ...state, selected: existing }, existing, 1)
  return { ...state, lines: [...state.lines, { ...line, quantity: 1 }], selected: state.lines.length }
}

/** A quantity never drops below one: removing a line is a separate, confirmed action. */
function step(state: ReceiptState, index: number, delta: 1 | -1): ReceiptState {
  const lines = state.lines.map((line, i) =>
    i === index ? { ...line, quantity: Math.max(1, line.quantity + delta) } : line)
  return { ...state, lines, selected: index }
}

function remove(state: ReceiptState, index: number): ReceiptState {
  const lines = state.lines.filter((_, i) => i !== index)
  return { ...state, lines, selected: lines.length === 0 ? -1 : clamp(index, lines.length - 1) }
}

export function receiptReducer(state: ReceiptState, action: ReceiptAction): ReceiptState {
  switch (action.type) {
    case 'add': return add(state, action.line)
    case 'step': return state.lines[action.index] ? step(state, action.index, action.delta) : state
    case 'select': return state.lines[action.index] ? { ...state, selected: action.index } : state
    case 'move':
      return state.lines.length === 0 ? state : { ...state, selected: clamp(state.selected + action.delta, state.lines.length - 1) }
    case 'remove': return state.lines[action.index] ? remove(state, action.index) : state
    case 'customer': return { ...state, customer: action.customer }
    case 'reset': return emptyReceipt(action.key)
  }
}
