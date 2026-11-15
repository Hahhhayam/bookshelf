/** Design tokens of «Полиця» (design/README.md). The theme and the status badge read them from here only. */
export const tokens = {
  color: {
    paper: '#F6F3ED',
    surface: '#FFFFFF',
    sunk: '#EFEAE1',
    line: '#E3DCD0',
    lineStrong: '#CFC6B7',
    side: '#FBF9F5',
    ink: '#1E1A16',
    ink2: '#4D463D',
    ink3: '#6E665A',
    disabledText: '#8C8478',
    accent: '#5B2C6F',
    accentHover: '#4A2259',
    accent2: '#8E5BA3',
    accentSoft: '#F2EAF4',
    danger: '#A12A1F',
    positive: '#1D6A3A',
    offlineBg: '#3A2A12',
    offlineText: '#FDF0D7',
    offlineIcon: '#F2B84B',
  },
  font: {
    ui: "'Commissioner', system-ui, -apple-system, 'Segoe UI', sans-serif",
    display: "'EB Garamond', Georgia, serif",
    mono: "'Fira Mono', ui-monospace, SFMono-Regular, Consolas, monospace",
  },
  shadow: {
    e1: '0 1px 2px rgba(30,26,22,.06)',
    e2: '0 6px 16px rgba(30,26,22,.10)',
    e3: '0 20px 48px rgba(30,26,22,.18)',
  },
} as const

/** One colour scale for every status in the system; a badge always shows a word too, never colour alone. */
export const statusTone = {
  draft: { text: '#4D463D', bg: '#EDE9E3', dot: '#8C8478', ring: undefined },
  progress: { text: '#1F4F99', bg: '#E4ECF9', dot: '#2F6BD0', ring: undefined },
  ready: { text: '#1D6A3A', bg: '#E2F1E7', dot: '#2E8B50', ring: undefined },
  done: { text: '#4D463D', bg: '#FFFFFF', dot: '#A79F92', ring: '#D6CEC1' },
  problem: { text: '#A12A1F', bg: '#FBE6E4', dot: '#D0402F', ring: undefined },
  attention: { text: '#855100', bg: '#FDF0D7', dot: '#D98B0B', ring: undefined },
} as const

export type StatusTone = keyof typeof statusTone
