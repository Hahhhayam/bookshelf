---
id: decisions
summary: Decisions already made, with reasons. Do not reverse one without the user; add a new entry instead.
updated: 2026-11-17
---

# Decisions

| Id | Date | Decision | Reason | Where |
|---|---|---|---|---|
| D-01 | 2026-11-16 | UI features not backed by the report were removed; gaps invented from the design artboards were dropped. | R-01. Early agents compared screens to the design, not the report. | API_GAPS.md "Dropped" |
| D-02 | 2026-11-16 | Every report-backed API gap was implemented on the server and wired in the client; no client stubs remain. | User: "Yes, fill them". | API_GAPS.md "Closed" |
| D-03 | 2026-11-16 | Customers have no login (the report gives none). The shop acts for `VITE_SHOP_CUSTOMER_ID` or asks the customer number once. Cart is server-side. | Report has no customer auth. | client README |
| D-04 | 2026-11-17 | Business errors carry machine codes; the client maps codes to Ukrainian. | Localised, testable errors (B-26). | ERROR_CODES.md, errorMessages.ts |
| D-05 | 2026-11-17 | Migrations squashed into one `InitialCreate`. | New required unique keys (idempotency) could not be filled for existing rows. | `Infrastructure/Persistence/Migrations` |
| D-06 | 2026-11-17 | Pickup orders must name an open store; the server refuses a warehouse or closed store (`pickup-location-not-store`). | Report «Самовивіз»: collected «в обраній точці»; R-07. | `PlaceOrderUseCase` |
| D-07 | 2026-11-17 | The UI is served by nginx in Docker (`web`, :8081) and proxies `/api` with the prefix stripped, like the Vite dev proxy. | Same origin, so the API needs no CORS. | `src/client/Dockerfile`, `nginx.conf` |
| D-08 | 2026-11-17 | At startup the API creates `root`/`root` with a `root` role holding every permission and no locations, if no user has login `root`. | A fresh DB has nobody who can add staff. | `PreseedRootAdminUseCase`, FR-01 notes |
| D-09 | 2026-11-17 | Demo data is a generated SQL script (Python generator, fixed uuid5 ids, dates relative to `@now`), not a startup seeder. | User asked for CSV/SQL; generator keeps it reproducible. | `src/server/Seed` |
| D-10 | 2026-11-17 | SQL Server port 1433 is published by compose. | User asked to connect a DB client. | `docker-compose.yml` |
| D-11 | earlier | Only the store admin holds `shifts.manage` (open/close the till) in samples and demo data. | Report: store admin «Контролює зміни». | Sample.cs, demo data |
| D-12 | earlier | `GET /users/logins` is open to every signed-in employee. | Every role sees who changed a document. | AdministrationController |
