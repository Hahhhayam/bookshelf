---
id: rules
summary: Binding rules from the user and the repo. Apply to every task.
updated: 2026-11-17
---

# Rules

Code conventions (one type per file, comment policy, ~20-line methods, EF mapping only in `Infrastructure`) are in
[CLAUDE.md](../CLAUDE.md) and the client's [CONVENTIONS.md](../src/client/CONVENTIONS.md). They are binding and not
repeated here.

| Id | Rule | Why / source |
|---|---|---|
| R-01 | The report [`Звіт_Книжковий магаз.md`](../Звіт_Книжковий%20магаз.md) is the source of truth for behaviour. Build nothing it does not ask for; remove what it does not back. | User, 2026-11-16: "all additional must be deleted"; "client must be in sync with report". |
| R-02 | Do not change the visual design (`design/`, the design-system HTML). Sync behaviour to the report without redesigning. | User: "there is no target to change design". |
| R-03 | The user commits. Never `git commit`/`push` unless asked in that message. | Standing user preference. |
| R-04 | Every domain model change updates [Bookstore_Domain.md](../Bookstore_Domain.md) in the same task; behaviour beyond the report goes into the "Implementation notes (not in the report)" of [Specification_Bookstore_IS.md](../Specification_Bookstore_IS.md); new e2e steps into [E2E_Scenarios.md](../E2E_Scenarios.md). | User memory "keep domain design doc current". |
| R-05 | Reuse first: a new filter/field on an existing endpoint or an existing domain method before a new endpoint or method. | User: "reuse endpoints at most, if it suitable". |
| R-06 | Business-rule errors throw `DomainException(code, message)` / `Guard.That(cond, code, msg)`. A new code goes into [ERROR_CODES.md](../src/server/ERROR_CODES.md) and gets Ukrainian text in `src/client/src/shared/api/errorMessages.ts`. | Error-code pass, 2026-11-17. |
| R-07 | Protect rules on the server even when the UI already prevents the case (raw HTTP must not bypass them). | User, 2026-11-17, warehouse pickup. |
| R-08 | Client debt goes to [REFACTORING.md](../src/client/REFACTORING.md) (C-NN flaw, MS/ME/MW-NN move, RM-NN remove); missing/broken API goes to [API_GAPS.md](../src/client/API_GAPS.md). Every row has an id; delete the row when done and mention the id in the work. | User, 2026-11-16. |
| R-09 | Answers to the user are short, with a recommendation; no option surveys. | Standing user preference. |
| R-10 | Ask before outward-facing or hard-to-reverse actions: recreating/stopping the user's running containers, deleting large files (e.g. the 16 MB design HTML), dropping databases. Throwaway verification stacks use their own compose project (`-p bookshelf-verify`) and are torn down after. | User rejected recreating `server-db-1`, 2026-11-17. |
| R-11 | Verify before reporting done: server build, e2e, client typecheck/tests/build as relevant; say plainly what was not verified (e.g. "not clicked through by hand"). | Session practice the user accepted. |
| R-12 | Search boxes (shop, staff catalog) search while typing: 0.5 s debounce, at least 3 characters, hint below that. Shop box: suggestion list under it, click opens the book, Enter shows results. Constants in `shared/config/search.ts`. | User, 2026-11-17. |
