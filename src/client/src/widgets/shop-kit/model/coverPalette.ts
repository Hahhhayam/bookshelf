/**
 * Cover backgrounds from the shop artboards (classes c1–c8 in ShopCatalog). The API has no cover images (GAP-24), so
 * a book gets a stable colour from its id. Proposed move: tokens.cover in shared/config/tokens.ts.
 */
export const coverPalette = ['#3D2A4A', '#2F4A3E', '#7A3B2E', '#2E3F5C', '#8A6A35', '#4D463D', '#5B2C6F', '#1E1A16'] as const

export function coverColor(id: string): string {
  let hash = 0
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return coverPalette[hash % coverPalette.length]!
}
