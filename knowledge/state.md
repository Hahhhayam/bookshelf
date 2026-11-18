---
id: state
summary: Snapshot of what is true and verified now. Update it whenever you change or re-verify something.
updated: 2026-11-17
---

# Current state

As of commit `f6731a7` ("open port"), 2026-11-17. Working tree was clean apart from this knowledge base.

## Works and verified

| Area | Status | Last verified |
|---|---|---|
| Server build | 0 errors (warnings exist) | 2026-11-17 |
| E2E (`src/server/EndToEndTests`) | 10/10 pass, real SQL Server via Testcontainers | 2026-11-17, after root preseed |
| Client | typecheck clean, 3/3 unit tests, build OK | 2026-11-17 |
| API gaps | none missing or broken; only "Redundant" rows R-01..03, R-36, R-46 remain in API_GAPS.md | 2026-11-17 |
| Client refactoring | only MS-18 open (till ring colour token) | 2026-11-17 |
| Docker compose | db, cache, api, web (UI on :8081 via nginx, `/api` proxied) start and serve | 2026-11-17, throwaway project |
| Root admin | API creates `root`/`root` with every permission at startup if no `root` user | 2026-11-17, login checked in Docker |
| Demo data | `src/server/Seed/demo-data.sql` loads into a fresh DB; 27 API flow checks pass | 2026-11-17 |
| Migrations | one squashed `InitialCreate` (`20261116221728`); older local DBs must be dropped and recreated | 2026-11-17 |

## Not verified

- 2026-11-17 buglist round (uncommitted): server build + e2e 10/10 + client typecheck/tests/build passed after the fixes, but e2e now covers bugs 1, 2, 3, 6, 7 (10/10 pass); bug 4 and the UI were not clicked through (O-18).

- The UI has not been clicked through by hand after the gap-filling round.
- DB port `1433:1433` is in `docker-compose.yml`, but the user's running stack (`server-db-1`, started earlier) was not
  recreated, so the port is not published until the user runs `docker compose up -d db` (see O-15).

## Environment

Windows 10, Git Bash + PowerShell, Docker Desktop available, Node 26 locally (image uses Node 24), .NET 10 SDK.
