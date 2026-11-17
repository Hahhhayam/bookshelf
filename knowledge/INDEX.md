---
id: index
summary: Entry point of the agent knowledge base. Read first, then only the files your task needs.
updated: 2026-11-17
---

# Agent knowledge base

Shared memory for agents working on «Полиця» (bookstore chain IS: .NET 10 server + React client). It holds what the
code and the project docs cannot tell you: binding rules, decisions and their reasons, traps, open questions, and how
agents coordinate. It links to the project docs instead of copying them.

## Read order

1. This file.
2. [rules.md](rules.md) — always. Binding; breaking one is a defect.
3. [state.md](state.md) — always. What is true right now, what was last verified.
4. Then by task:

| Task | Read |
|---|---|
| Find where something lives | [project-map.md](project-map.md) |
| Build, test, migrate, run Docker, load demo data | [workflows.md](workflows.md) |
| A command fails strangely (Windows, Docker, sqlcmd, e2e timing) | [gotchas.md](gotchas.md) |
| Why is X like this? / about to change a past choice | [decisions.md](decisions.md) |
| What is unfinished, what waits for the user | [open-items.md](open-items.md) |
| Splitting work across agents, writing a brief, handing off | [multi-agent.md](multi-agent.md) |

## Entry format

Every entry has a stable id (`R-03`, `G-02`, `D-07`, `O-04`). Cite ids in briefs, commits and reports instead of
retelling the entry. Ids are never reused; a dropped entry stays with ~~strikethrough~~ and a reason.

## Updating (every agent, before finishing)

The full procedure, with when to capture what, is the `knowledge` skill
([.claude/skills/knowledge/SKILL.md](../.claude/skills/knowledge/SKILL.md)). In short:

- Learned a rule from the user → `rules.md`. Made or found a decision → `decisions.md`. Hit a trap → `gotchas.md`.
  Left something unfinished or found a question for the user → `open-items.md`. Changed what is verified → `state.md`.
- One fact per entry, with its source (user message, file, command output) and date. Newest state wins; fix or strike
  stale entries instead of adding contradicting ones.
- Do not record what the code, git history or the project docs already say; link to them.
- Facts here can go stale. Before acting on one that names a file, route or command, check it still exists.
