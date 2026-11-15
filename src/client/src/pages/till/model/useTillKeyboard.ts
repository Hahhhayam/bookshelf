import { useEffect, useRef, type RefObject } from 'react'
import { commandFor, type TillCommand, type TillMode } from './tillKeymap'

/** The till's keyboard, alive only while the till page is mounted. */
export function useTillKeyboard(
  mode: TillMode,
  scanInput: RefObject<HTMLInputElement | null>,
  run: (command: TillCommand) => void,
) {
  const latest = useRef({ mode, run })
  useEffect(() => { latest.current = { mode, run } })

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const scanEmpty = !scanInput.current?.value
      const command = commandFor(event, latest.current.mode, scanEmpty)
      if (!command) return
      event.preventDefault()
      latest.current.run(command)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [scanInput])
}
