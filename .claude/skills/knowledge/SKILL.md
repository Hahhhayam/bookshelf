---
name: knowledge
description: Load and maintain the agent knowledge base in knowledge/. Use at the start of every session or delegated task in this repo, before planning or editing anything, and again before finishing a task, after the user states a preference or decision, or after hitting a trap. Also when the user asks to "remember", "note", "record" or "update the knowledge base".
---

# Knowledge base: load, then maintain

The knowledge base in `knowledge/` is shared memory for every agent in this repo. Its entries carry stable ids:
R (rules), G (gotchas), D (decisions), O (open items). Read the right parts of it, act on it, and leave it more
accurate than you found it.

## 1. Load (session or task start)

1. Read `knowledge/INDEX.md`, `knowledge/rules.md` and `knowledge/state.md` in full.
2. From the INDEX table, read only the files your task needs. Before a build, test, Docker or SQL command, read
   `workflows.md` and `gotchas.md`. Before changing an existing behaviour, read `decisions.md`. Before splitting work
   or briefing a subagent, read `multi-agent.md`.
3. If an entry names a file, route or command, check it still exists before relying on it. If it doesn't, fix the
   entry (step 3) instead of working around it silently.
4. Keep the rules in force for the whole session, and cite ids when you apply them, e.g. "per R-07, checked on the
   server too".

When you brief a subagent, tell it to read `knowledge/INDEX.md`, `rules.md` and `state.md`, and to report learnings back
instead of editing `knowledge/` itself (the coordinator owns it; see `multi-agent.md`).

## 2. Capture (during the session)

Note these as they happen; don't wait for the end:

| Event | File | Entry |
|---|---|---|
| The user states a preference, correction or constraint | `rules.md` | new R-NN, quoting or closely paraphrasing the user, with the date |
| You or the user choose between real alternatives | `decisions.md` | new D-NN: decision, reason, where it lives |
| A command or tool fails for a non-obvious reason and you find the fix | `gotchas.md` | new G-NN: symptom, cause, fix |
| Work is left unfinished, or a question waits on the user | `open-items.md` | new O-NN, *Needs* = User or Agent |
| An open item is resolved | `open-items.md` | strike it through (`~~…~~`) and add a short reason; don't delete it |
| You verify or change what works (build, tests, Docker, data) | `state.md` | update the row and its date; update the commit line if it moved |
| A new path, module or command appears | `project-map.md` / `workflows.md` | edit the existing table |

## 3. Write rules

- One fact per entry. Give it its source (the user's message, a file, a command's output) and the date as YYYY-MM-DD.
  Today's date comes from the session context.
- Take the next free id in that file and never reuse one. If an entry is wrong, correct it in place. If it no longer
  applies, strike it through with a reason. Never add a second entry that contradicts an existing one.
- Link to the project docs, the code and `CLAUDE.md`; don't copy them. Don't record what git history or the code
  already shows.
- Keep entries terse: the next agent reads them under a context budget.
- Never store secrets: passwords other than documented demo/test ones, tokens, connection strings with real
  credentials.
- Update `updated:` in the front matter of any file you change.

## 4. Before finishing a task

Make one pass:

1. Did the user say anything that should become a rule? Did you make a decision, hit a trap, or leave something open?
   Record each.
2. Does `state.md` match what you verified this session, and does it say what you did not verify?
3. Is every id you cited in your reply present in the files?
4. Mention in your reply, in one line, which knowledge files you changed (e.g. "knowledge: +D-13, O-02 struck, state
   updated").

Skip the pass only for a pure question that changed nothing and taught nothing new.
