import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Testing Library cleans up by itself only when Vitest globals are on; they are off here.
afterEach(cleanup)

// Mantine reads the colour scheme through matchMedia, and some layouts observe their size; jsdom has neither.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
})

class NoResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver ??= NoResizeObserver as unknown as typeof ResizeObserver
