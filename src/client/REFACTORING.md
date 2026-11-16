# Client refactoring

Technical debt in the client: nothing here adds a feature or closes an API gap (those are in `API_GAPS.md`).
Every screen works as it is; these items make code reusable or fix client-side flaws that already have a workaround.

Ids: **C** client flaw · **MS** move to `shared` · **ME** move to `entities` · **MW** move to a shared widget ·
**RM** remove. Mention the id in the commit that does it, and delete the row. Done so far: MS-01..17, ME-01..25,
MW-01..02, C-01, C-02.

## Open

| Id | What | Now in | Change | Why |
|---|---|---|---|---|
| RM-01 | `PlacedOrderSummary` navigation-state contract | `features/shop-place-order/model` | Remove once GAP-25 is closed | The confirmation should read the order from the API |
| MS-18 | Till ring colour `#E6D6EB` hard-coded | `shared/ui/ScanField.tsx`, `shared/ui/HomeTile.tsx` | Add a token in `shared/config/tokens.ts` | No colours outside tokens (CONVENTIONS) |
