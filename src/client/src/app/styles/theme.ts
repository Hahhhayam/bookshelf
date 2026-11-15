import { createTheme, type CSSVariablesResolver, type MantineColorsTuple } from '@mantine/core'
import { tokens } from '@/shared/config/tokens'

// Mantine needs ten shades per colour; shade 6 is the accent and 7 its hover, as in the design.
const plum: MantineColorsTuple = [
  '#F2EAF4', '#E6D6EB', '#D3BEDD', '#B793C6', '#8E5BA3', '#74428B', '#5B2C6F', '#4A2259', '#3B1B47', '#2C1435',
]

// Warm neutrals replace Mantine's cold greys, so borders, dimmed text and disabled states match the paper base.
const gray: MantineColorsTuple = [
  '#FBF9F5', '#F6F3ED', '#EFEAE1', '#E3DCD0', '#CFC6B7', '#A79F92', '#8C8478', '#6E665A', '#4D463D', '#1E1A16',
]

export const theme = createTheme({
  primaryColor: 'plum',
  primaryShade: 6,
  colors: { plum, gray },
  black: tokens.color.ink,
  white: tokens.color.surface,
  defaultRadius: 0,
  radius: { xs: '0', sm: '0', md: '0', lg: '0', xl: '0' },
  fontFamily: tokens.font.ui,
  fontFamilyMonospace: tokens.font.mono,
  fontSizes: { xs: '12px', sm: '13px', md: '14px', lg: '16px', xl: '20px' },
  lineHeights: { xs: '1.33', sm: '1.38', md: '1.43', lg: '1.5', xl: '1.4' },
  spacing: { xs: '8px', sm: '12px', md: '16px', lg: '24px', xl: '32px' },
  shadows: {
    xs: tokens.shadow.e1,
    sm: tokens.shadow.e1,
    md: tokens.shadow.e2,
    lg: tokens.shadow.e2,
    xl: tokens.shadow.e3,
  },
  headings: {
    fontFamily: tokens.font.ui,
    fontWeight: '600',
    sizes: {
      h1: { fontSize: '28px', lineHeight: '36px' },
      h2: { fontSize: '20px', lineHeight: '28px' },
      h3: { fontSize: '16px', lineHeight: '24px' },
      h4: { fontSize: '14px', lineHeight: '20px' },
    },
  },
  focusRing: 'auto',
  cursorType: 'pointer',
})

export const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {
    '--font-display': tokens.font.display,
  },
  light: {
    '--mantine-color-body': tokens.color.paper,
    '--mantine-color-text': tokens.color.ink,
    '--mantine-color-dimmed': tokens.color.ink3,
    '--mantine-color-default': tokens.color.surface,
    '--mantine-color-default-border': tokens.color.lineStrong,
    '--mantine-color-default-hover': tokens.color.paper,
  },
  dark: {},
})
