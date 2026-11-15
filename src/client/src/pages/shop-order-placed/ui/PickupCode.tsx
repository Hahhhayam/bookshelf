import { Group } from '@mantine/core'
import { tokens } from '@/shared/config/tokens'

/** «R7 4Q 29»: big character boxes in pairs, easy to read out at the till. */
export function PickupCode({ code }: { code: string }) {
  const chars = [...code.replace(/[-\s]/g, '').toUpperCase()]
  const pairs = Array.from({ length: Math.ceil(chars.length / 2) }, (_, i) => chars.slice(i * 2, i * 2 + 2))
  return (
    <Group gap={14} aria-label={`Код отримання ${pairs.map((p) => p.join('')).join(' ')}`} role="img">
      {pairs.map((pair, i) => (
        <Group key={i} gap={8} wrap="nowrap" aria-hidden="true">
          {pair.map((char, j) => <CodeChar key={j} char={char} />)}
        </Group>
      ))}
    </Group>
  )
}

function CodeChar({ char }: { char: string }) {
  return (
    <span style={{
      width: 'clamp(44px, 12vw, 64px)', height: 'clamp(58px, 16vw, 84px)', display: 'inline-flex', alignItems: 'center',
      justifyContent: 'center', background: tokens.color.surface, border: `2px solid ${tokens.color.ink}`,
      fontFamily: tokens.font.mono, fontSize: 'clamp(30px, 9vw, 44px)', fontWeight: 500,
    }}>{char}</span>
  )
}
