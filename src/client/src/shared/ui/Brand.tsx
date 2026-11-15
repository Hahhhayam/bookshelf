import { tokens } from '@/shared/config/tokens'

/** The «Полиця» mark: three books on a shelf, and the name in the display face. */
export function Brand({ size = 28 }: { size?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: tokens.color.ink }}>
      <svg width={size} height={size} viewBox="0 0 36 36" aria-hidden="true">
        <rect x="4" y="6" width="6" height="24" fill={tokens.color.accent} />
        <rect x="12" y="9" width="6" height="21" fill={tokens.color.accent2} />
        <rect x="20" y="7" width="5" height="23" fill={tokens.color.accent} transform="rotate(-12 22 30)" />
        <rect x="2" y="30" width="32" height="2.5" fill={tokens.color.ink} />
      </svg>
      <span style={{ fontFamily: tokens.font.display, fontSize: size * 0.9, fontWeight: 600 }}>Полиця</span>
    </span>
  )
}
