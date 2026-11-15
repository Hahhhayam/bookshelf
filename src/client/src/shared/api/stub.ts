/**
 * Ids of the server gaps the client works around, each described in src/client/API_GAPS.md. A stub names its gap,
 * so finding every workaround for one gap is a search for its id.
 */
export type GapId = `GAP-${number}`

const reported = new Set<GapId>()

/** Answers with local data instead of the missing endpoint, and says so once in the console. */
export async function stub<T>(gap: GapId, value: T | (() => T)): Promise<T> {
  if (!reported.has(gap)) {
    reported.add(gap)
    console.warn(`[stub] ${gap}: answered locally, see API_GAPS.md`)
  }
  await new Promise((resolve) => setTimeout(resolve, 150))
  return typeof value === 'function' ? (value as () => T)() : value
}
