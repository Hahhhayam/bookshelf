---
id: open-items
summary: Unfinished work and questions waiting for the user. Pick from here; strike an item when it is resolved.
updated: 2026-11-17
---

# Open items

"User" in *Needs* means do not act until the user decides.

| Id | Item | Needs | Notes |
|---|---|---|---|
| O-01 | A pickup order can reserve stock at a location other than its pickup store (raw HTTP). | User | Suggested rule: pickup stock location = pickup store (`pickup-stock-mismatch`). |
| O-02 | Client never reserves a delivery at a warehouse; report «Онлайн-замовлення» allows «резерв у магазині або на складі». | User | Delivery fails when no single store has every book. |
| O-03 | An immediate price change does not cancel a pending scheduled price. | User | |
| O-04 | Cashiers cannot open the till; only `shifts.manage` holders (store admin). | User | D-11. |
| O-05 | `GET /users/logins` visible to all staff. | User | D-12. |
| O-06 | GAP-50 `active` flag was not added. | User | See API_GAPS.md history. |
| O-07 | Personal-data masking was removed, but report table 1.3 mentions «захист персональних даних». | User | |
| O-08 | The generic `blank` error text does not name the field. | Agent | Could use the `field` in problem details. |
| O-09 | Pickup code is upper-cased in the client but stored lowercase (32 hex chars). | Agent | Lookup must stay case-insensitive. |
| O-10 | MS-18: till ring colour `#E6D6EB` hard-coded in `ScanField.tsx`, `HomeTile.tsx`; move to `shared/config/tokens.ts`. | Agent | REFACTORING.md. |
| O-11 | `UI_Design.md` is stale relative to the report-synced client. | User | Update or mark superseded. |
| O-12 | 16 MB `Книгарня — дизайн системи.html` in the repo root. | User | Delete only with go-ahead (R-10). |
| O-13 | `root`/`root` is created on every installation, production included. | User | Change the password or make it configurable before sharing. |
| O-14 | UI not clicked through by hand after the gap round. | Agent | Use demo data (workflows.md). |
| O-15 | DB port not live on the user's running stack: `server-db-1` predates the port change. | User | User declined the recreate; they run `docker compose up -d db` themselves. |
| O-16 | `GET customers/{id}/orders` is anonymous and keyed only by a guessable id; sorted by v7 GUID (no `CreatedAt`), N+1 history reads. | User | D-14. Decide on ownership check / `CreatedAt`. |
| O-17 | Root's whole-chain report is now empty (no locations). Bug 7 may also live in the client (location pickers for no-geo users): not checked. | User | D-15. |
| ~~O-18~~ | ~~No e2e for bugs 1-3, 6, 7.~~ Added 2026-11-17 (scenarios 1 and 8); EF author subquery translates. Still open: nearest-match loads candidates in memory and ignores `availableAt`; bug 4 fix (FormModal stopPropagation) not clicked through. | Agent | |
