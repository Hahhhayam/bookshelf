---
id: multi-agent
summary: How agents split work, brief each other, avoid collisions and hand off. Proven in the 2026-11-16 gap rounds.
updated: 2026-11-17
---

# Multi-agent protocol

## Roles

- **Coordinator** — the agent the user talks to. Splits the task, writes briefs, owns shared docs
  (Bookstore_Domain.md, Specification, API_GAPS.md, this knowledge base), runs the single build, migration and full
  verification at the end, reports to the user.
- **Worker** — owns one slice (a module or a gap group). Edits code and its own tests; reports back; never talks to
  the user.

## Splitting

- Split by module/gap group so workers touch disjoint files. Shared files that several workers may touch
  (`BookstoreDbContext.cs`, a controller, `EndToEndTests/Samples/*`, client `entities/*`) need additive edits only.
- Something one worker's result depends on is not parallel; do it first or in the same worker.
- Keep each worker's scope to what the report asks (R-01); give it the gap ids, not a retelling.

## Worker brief (template)

```
Repo: D:\uni\9\dragan\bookshelf. Read first: CLAUDE.md, knowledge/INDEX.md + rules.md, <task docs>.
Goal: <ids, e.g. GAP-12, GAP-14> — done means <endpoint + client wiring + e2e step + doc notes>.
Pattern: copy the closest existing use case / query / controller action / client entity call.
Rules:
- Do NOT run dotnet build/test or add EF migrations (others edit the same solution; coordinator does it once).
- Do NOT edit Bookstore_Domain.md, Specification_Bookstore_IS.md, API_GAPS.md, knowledge/ — report changes instead.
- Shared files: re-read right before each edit, additive edits only, never revert or reformat others' work.
- Delete files by absolute path only. Client: npm run typecheck and npm run test -- --run at the end.
Report back (concise):
1. Per id: closed / partly / not done — endpoint (method, route, params) and client change.
2. Domain changes (aggregates, fields, rules, permissions) — for docs and the migration.
3. Shared files edited. 4. E2E changed/added. 5. Blockers and decisions needed.
```

## Collecting results

1. Read each report, then check the diff — a report is a claim, not proof.
2. Build once; fix compile errors across workers. 3. Generate one migration (or squash, D-05). 4. Run e2e and client
   checks. 5. Update shared docs and this knowledge base (state.md, decisions.md, open-items.md). 6. Report to the user
   with what is verified and what is not.

## Interruptions

- Usage limit (G-10): resume each worker with SendMessage once the user says continue.
- A new user request mid-task: finish or hand off the current slice first; record half-done work in open-items.md.

## Handoff note (end of every agent's work)

Add or update entries here rather than leaving them only in a chat reply: state.md (what you verified), open-items.md
(what is left, who decides), decisions.md (what you chose and why), gotchas.md (what bit you).
