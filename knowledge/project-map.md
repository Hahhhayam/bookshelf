---
id: project-map
summary: Where documents and code live, and which document wins when they disagree.
updated: 2026-11-17
---

# Project map

## Documents (repo root), in order of authority

1. [`Звіт_Книжковий магаз.md`](../Звіт_Книжковий%20магаз.md) — the course report (Ukrainian). Source of truth (R-01).
   Role table ~line 205, process table ~line 410 (e.g. «Самовивіз», «Онлайн-замовлення»).
2. [Specification_Bookstore_IS.md](../Specification_Bookstore_IS.md) — FR/NFR derived from the report; each FR may have
   "Implementation notes (not in the report)".
3. [Bookstore_Domain.md](../Bookstore_Domain.md) — DDD model: modules, aggregates, value objects, rules.
4. [E2E_Scenarios.md](../E2E_Scenarios.md) — the API scenarios the e2e tests run, step by step.
5. [UI_Design.md](../UI_Design.md) — screens per role. **Stale** in places (O-11); the report wins.
6. `design/` and `Книгарня — дизайн системи.html` (16 MB bundle) — visual design; do not change (R-02).
7. [README.md](../README.md) — only a future "Clever Cache" design, not an overview.

## Server — `src/server` (.NET 10, C# 14, modular monolith, SQL Server, Redis cache)

| Path | Holds |
|---|---|
| `Domain/<Module>` | Aggregates, value objects, events. No EF. Modules: Catalog, Inventory, Sales, Orders, Purchasing, Crm, Administration. |
| `Application/<Module>` | One use case per file (command/query record in the same file), ports as interfaces. Registered automatically by reflection (`Application/DependencyInjection.cs`): any public class whose ctor takes interfaces or Application types. |
| `Application/Common/Permissions.cs` | Permission codes; `Permissions.All` lists them. |
| `Infrastructure/Persistence` | `BookstoreDbContext`, `Configurations/<Module>`, `Queries`, repositories, `Migrations`. |
| `WebApi/Controllers/<Module>Controller.cs` | Routes, `[RequirePermission]`, HTTP request records. `Program.cs` migrates (if `Database:MigrateOnStartup`) then runs `PreseedRootAdminUseCase`. |
| `WebApi/Errors/ApiExceptionHandler.cs` | Problem details with `code`, `field`, `subject`. |
| `EndToEndTests` | `Scenarios/*` (one class per report scenario, steps as private methods), `Samples/*` (seed world), `Hosting/*` (`Api` helper: `Get`, `Create`, `Rejected(code, …)`, `Refused(status, …)`). |
| `Seed/` | Demo data generator + SQL + README. |
| `ERROR_CODES.md` | Every business error code. |
| `docker-compose.yml` | db (:1433), cache, api (:8080), web (:8081). Needs `.env` from `.env.example`. |

## Client — `src/client` (Vite, React 19, TypeScript 7, Mantine 9, TanStack Query)

Feature-Sliced Design: `app > pages > widgets > features > entities > shared`; public `index.ts` per slice; no
same-layer imports. Rules in [CONVENTIONS.md](../src/client/CONVENTIONS.md), overview in
[README.md](../src/client/README.md). Routes in `src/app/routing/router.tsx`: shop at `/`, staff at `/staff`, login
`/staff/login`, till `/staff/till`. API calls go to relative `/api` (Vite proxy in dev, nginx in Docker).
`shared/api/stub.ts` (`stub('GAP-NN')`) is kept for future gaps; no stubs are in use.
