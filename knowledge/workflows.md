---
id: workflows
summary: Exact commands that are known to work, with timings.
updated: 2026-11-17
---

# Workflows

Paths are relative to the repo root. Commands are for Git Bash unless marked.

## Server

```bash
cd src/server
dotnet build Server.sln -nodeReuse:false -p:UseSharedCompilation=false -v:q -clp:ErrorsOnly   # ~25 s
dotnet test EndToEndTests --no-build -nodeReuse:false                                          # ~45 s, needs Docker
```

- E2E spins up SQL Server with Testcontainers; Docker Desktop must be running.
- Run long commands in the background; they can exceed the 2-minute tool timeout.

## Migrations

Migrations were squashed into one `InitialCreate` (D-05). Add a new one only when the model changes:

```bash
cd src/server
dotnet ef migrations add <Name> --project Infrastructure --startup-project Infrastructure --output-dir Persistence/Migrations
```

In a parallel-agent round only the coordinator generates migrations, once, at the end (see multi-agent.md).

## Client

```bash
cd src/client
npm run typecheck
npm run test -- --run
npm run build
npm run dev          # http://localhost:5173, /api → http://localhost:8080
```

## Docker (whole system)

```bash
cd src/server
cp .env.example .env            # once; set MSSQL_SA_PASSWORD
docker compose up -d --build    # UI http://localhost:8081, API :8080, SQL Server localhost,1433
```

- First API image build takes several minutes (restore + publish); it is not stuck.
- Sign in at `/staff/login` as `root` / `root` (D-08).
- Verification without touching the user's stack: `docker compose -p bookshelf-verify up -d --build …`, then
  `docker compose -p bookshelf-verify down -v` (R-10). It still binds host ports 8080/8081/1433, so it conflicts
  with a running user stack.

## Demo data

```bash
cd src/server
python Seed/generate_demo_data.py          # rewrites Seed/demo-data.sql; edit the generator, not the SQL
docker compose cp Seed/demo-data.sql db:/tmp/demo-data.sql
MSYS_NO_PATHCONV=1 docker compose exec db sh -c '/opt/mssql-tools18/bin/sqlcmd -C -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -d Bookstore -b -i /tmp/demo-data.sql'
```

Logins and contents: [Seed/README.md](../src/server/Seed/README.md). The script refuses a DB that has a catalog; to
reload, `docker compose down -v` and start again.

## Checking a change end to end

1. Server build, then e2e. 2. Client typecheck + tests + build. 3. For flows the e2e does not cover: throwaway compose
project + demo data + API calls (a Python `urllib` script that imports `Seed/generate_demo_data.py` for the fixed ids
works well). 4. Update `state.md`.
