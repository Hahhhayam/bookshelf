export type TillCommand =
  | 'search' | 'customer' | 'split' | 'cash' | 'card' | 'certificate' | 'exit'
  | 'up' | 'down' | 'plus' | 'minus' | 'remove' | 'void' | 'focusScan' | 'enter'

/** What the till is showing decides which keys mean something (design/README.md, «Till keyboard flow»). */
export type TillMode = 'receipt' | 'closed' | 'problem' | 'dialog'

const functionKeys: Record<string, TillCommand> = {
  F2: 'search', F4: 'customer', F7: 'split', F8: 'cash', F9: 'card', F10: 'certificate', F12: 'exit',
}

/** Keys that also type into the scan field act on the receipt only while the field is empty (or from the numpad). */
function editingCommand(event: KeyboardEvent, scanEmpty: boolean): TillCommand | null {
  if (event.key === 'ArrowUp') return 'up'
  if (event.key === 'ArrowDown') return 'down'
  if (event.key === 'Escape') return 'focusScan'
  if (event.key === 'Delete' && event.ctrlKey) return 'void'
  if (event.key === 'Delete' && scanEmpty) return 'remove'
  if (event.key === '+' && (scanEmpty || event.code === 'NumpadAdd')) return 'plus'
  if (event.key === '-' && (scanEmpty || event.code === 'NumpadSubtract')) return 'minus'
  if (event.key === 'Enter' && scanEmpty) return 'enter'
  return null
}

export function commandFor(event: KeyboardEvent, mode: TillMode, scanEmpty: boolean): TillCommand | null {
  if (mode === 'dialog') return null
  const fn = functionKeys[event.key]
  if (mode === 'problem') return fn === 'split' || fn === 'cash' || fn === 'card' ? fn : null
  if (mode === 'closed') return event.key === 'Enter' && scanEmpty ? 'enter' : fn === 'exit' ? fn : null
  return fn ?? editingCommand(event, scanEmpty)
}
