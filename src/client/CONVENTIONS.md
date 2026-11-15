# Client conventions

## Feature-Sliced Design

Layers, top to bottom. A module imports only from layers **below** it, and only through a slice's public `index.ts`.

| Layer | Holds | Examples |
|---|---|---|
| `app` | providers, routing, navigation config, global styles | `app/routing/router.tsx` |
| `pages` | one slice per route; composes widgets, features, entities | `pages/order-board` |
| `widgets` | large self-contained blocks reused by pages | `widgets/staff-shell` |
| `features` | one user action each (a form, a button with its mutation) | `features/auth`, `features/switch-location` |
| `entities` | business objects: types, API calls, query hooks, status labels | `entities/order`, `entities/book` |
| `shared` | no business knowledge: HTTP, formatting, tokens, UI kit | `shared/api`, `shared/ui` |

Slices on the same layer do not import each other. A page slice is `pages/<name>/index.tsx` with a **default export**
(the router loads it lazily); bigger pages split into `pages/<name>/ui/*`.

## SOLID in practice

- **Single responsibility** — a component renders, a hook fetches or mutates, an `entities/*/api` module talks HTTP.
  A page over ~150 lines is split into sections (`ui/` files) or a widget.
- **Open/closed** — status labels and tones are data (`orderStatus`, `transferStatus`…), not `switch` statements in
  components; add a status by adding a row.
- **Liskov** — shared components take plain props with the same meaning everywhere (`StatusBadge tone label`).
- **Interface segregation** — components get only what they show (`title`, `money`), not whole API objects, when reused.
- **Dependency inversion** — lower layers never import higher ones; the app injects what they need
  (`configureHttp`, `StaffShell navigation={…}`).

## Data and the API

- All HTTP goes through `entities/*/api` → `shared/api/http`. Pages never call `fetch`.
- Server state is TanStack Query; invalidate the entity's keys after a mutation.
- Commands that change stock or money keep their operation key across retries (`newKey`, `Idempotency-Key`).
- **Missing endpoint** → implement a stub in the entity with `stub('GAP-NN', …)` and record it in `API_GAPS.md`.
  **Redundant** API → record it (R-NN). **Broken** → stub around it and record it (B-NN).

## UI

- Build from the artboards in `design/project/*.dc.html`; tokens are in `design/README.md` and
  `shared/config/tokens.ts`. Use Mantine components and the kit in `shared/ui`; no hard-coded colours outside tokens.
- Ukrainian interface text. Money through `MoneyText`/`formatMoney`, dates through `formatDate*`.
- Every list has loading, empty and error states (`QueryView`, `EmptyState`); every irreversible action asks
  for confirmation (`ConfirmDialog`).
