import { tokens } from '@/shared/config/tokens'

/** A keyboard hint, as on the till buttons («F8 Готівка»). */
export function Key({ children, inverted = false }: { children: string; inverted?: boolean }) {
  return (
    <kbd
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 22, height: 22,
        padding: '0 6px', boxSizing: 'border-box', fontFamily: tokens.font.mono, fontSize: 11, fontWeight: 500,
        lineHeight: 1, border: '1px solid', borderBottomWidth: 2,
        background: inverted ? 'rgba(255,255,255,.16)' : tokens.color.surface,
        borderColor: inverted ? 'rgba(255,255,255,.35)' : tokens.color.lineStrong,
        color: inverted ? '#FFFFFF' : tokens.color.ink2,
      }}
    >
      {children}
    </kbd>
  )
}
