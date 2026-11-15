import { tokens } from '@/shared/config/tokens'
import { initials } from '@/shared/lib'

/** Square initials avatar: corners are square everywhere in the design, avatars included. */
export function Initials({ name, size = 24, solid = false }: { name: string; size?: number; solid?: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: size, height: size, flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: Math.round(size * 0.38), fontWeight: 700,
        background: solid ? tokens.color.accent : '#E8DDEB', color: solid ? '#FFFFFF' : tokens.color.accent,
      }}
    >
      {initials(name)}
    </span>
  )
}
