import { tokens } from '@/shared/config/tokens'

type Size = 'sm' | 'md' | 'lg'

/** A book gets a stable cover colour from its id. */
function coverColor(id: string): string {
  let hash = 0
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return tokens.cover[hash % tokens.cover.length]!
}

const sizes: Record<Size, { title: number; caption: number; padding: number }> = {
  sm: { title: 15, caption: 8, padding: 8 },
  md: { title: 26, caption: 11, padding: 14 },
  lg: { title: 56, caption: 14, padding: 28 },
}

/** A typographic cover (title on a coloured board) in place of the cover images the API does not have. */
export function BookCover({ id, title, caption, size = 'md' }: { id: string; title: string; caption?: string; size?: Size }) {
  const s = sizes[size]
  return (
    <div
      role="img"
      aria-label={`Обкладинка книги «${title}»`}
      style={{
        aspectRatio: '2 / 3', width: '100%', padding: s.padding, boxSizing: 'border-box', display: 'flex',
        flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden',
        background: coverColor(id), color: tokens.color.paper,
      }}
    >
      <span style={{ fontFamily: tokens.font.display, fontSize: s.title, fontWeight: 600, lineHeight: 1.05, overflowWrap: 'anywhere' }}>
        {title}
      </span>
      {caption && (
        <span style={{ fontSize: s.caption, letterSpacing: '.08em', textTransform: 'uppercase' }}>{caption}</span>
      )}
    </div>
  )
}
