---
id: gotchas
summary: Traps already hit in this repo, as symptom → cause → fix.
updated: 2026-11-17
---

# Gotchas

| Id | Symptom | Cause | Fix |
|---|---|---|---|
| G-01 | `docker compose exec db /opt/...` fails: `stat C:/Program Files/Git/opt/...: no such file` | Git Bash rewrites Unix-looking paths. | Prefix `MSYS_NO_PATHCONV=1`, or run in PowerShell. |
| G-02 | sqlcmd: `INSERT/DELETE failed because ... 'QUOTED_IDENTIFIER'` | sqlcmd defaults it OFF; the schema has filtered unique indexes (open shift per store, idempotency keys). | `SET QUOTED_IDENTIFIER ON;` at the top of the script, or `sqlcmd -I`. |
| G-03 | E2E report test sometimes gets 0 instead of the sales total | Test clock advances 1 ms per read; query times go out in whole seconds, so a boundary at "now" can cut off rows. | Keep period boundaries away from "now" (the test starts its window an hour ahead). |
| G-04 | Rename/`mv` of a client folder: "Permission denied"; `Remove-Item`: "in use" | Windows locks a folder that is a shell's cwd or open in the IDE. | Copy, rewrite imports, delete old files one by one by absolute path. |
| G-05 | `rm -rf` with a relative glob is blocked | Safety check on relative destructive globs. | Delete by absolute path. |
| G-06 | A `docker-compose.yml` change (e.g. new port) has no effect | Running containers keep their old config. | `docker compose up -d <service>` recreates it — ask the user first if it is their stack (R-10). |
| G-07 | Inserting stock movements/reservations: FK error on `StockItemId` | Stock items inserted after their movements. | Generator writes `StockItems` before `StockMovements`/`Reservations`. |
| G-08 | Purchasing user gets 403 on store-level lists | Location access is checked per location; warehouse-only access cannot read store requests. | Give chain-level roles access to all locations. |
| G-09 | Python `hash()` gives different output per run | Hash randomisation. | Use `uuid5`/fixed values in generators. |
| G-10 | Sub-agents return "HTTP 429 usage limit" mid-task | Account usage limit. | After the user says continue, resume each agent with SendMessage; do not restart from scratch. |
| G-11 | Parallel agents' builds collide / EF migration conflicts | Same solution and model edited at once. | Agents do not build or add migrations; the coordinator builds once and generates one migration. |
| G-12 | A modal form inside the checkout `<form>` also submitted the checkout (placed the order, cart went empty). | Mantine modals are portalled, but React bubbles synthetic events through the React tree. | `FormModal` calls `event.stopPropagation()` on submit. |
| G-13 | Workflow haiku worker failed 5 times on the report schema (`filesEdited` missing). | Small model skips required fields. | Make report fields optional for haiku workers or use a bigger model; check `failures` in the result. |
