# AGENTS.md

Instructions for AI coding agents working in this repository. Read this file first, then the documents it points to.

## What this project is

A web-based, two-player, turn-based tavla platform. The main game is **backgammon (tavla)**; the second is **Hapis**, a Turkish variant. The first phase (MVP) is a web client, online play between two humans, server-authoritative dice and move validation, matches to 5 points.

Full context: `README.md` (purpose, scope, decisions), `ARCHITECTURE.md` (components, layout, protocol).

## Current state

The repository is **documents only**. No `package.json`, no `pnpm-workspace.yaml`, no source code exists yet. The layout described in `ARCHITECTURE.md` is the plan, not yet on disk:

```
/packages
  /engine      pure rules engine: backgammon and Hapis rule sets
  /protocol    message types and schemas shared by client and server
/apps
  /server      Node.js game server
  /client      React web client
```

Do not assume scripts like `pnpm lint`, `pnpm test`, `pnpm build` work until the workspace is set up. The `Jenkinsfile` calls them and will fail until then.

## Documents are the source of truth

- `RULES_BACKGAMMON.md` and `RULES_HAPIS.md` are referenced by the other documents but **do not exist yet**. If you write rules code, the corresponding rules document must exist first, or be written in the same change.
- When code and a rules document disagree, **the rules document wins** until the owner decides otherwise. Fix the code, or change the document in the same pull request.
- Changing a rule means updating the matching rules document in the same change.
- Changing a structural decision means updating `ARCHITECTURE.md` **and** the decisions table in `README.md`.

## Non-negotiable rules

These come from `CODING_RULES.md`; follow them in every change.

- **Server is the authority.** The client shows and suggests; the server decides. Never trust client input.
- **The engine is pure.** No network, database, clock or randomness inside it. Dice are injected; the server rolls them.
- **TypeScript strict everywhere** (`strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`). No `any`, no `@ts-ignore`.
- **Rule sets are data**, not copy-pasted code paths. Backgammon and Hapis differ by configuration.
- **Total functions.** Illegal input returns a typed error, not an exception.
- **Determinism.** A game must be exactly reproducible from its start state plus roll and move history.
- **Dependencies point inward toward `engine`.** `client` must not import `server`, and so on. See the table in `CODING_RULES.md`, section 3.
- **Naming:** `PascalCase` types/classes, `camelCase` functions/variables, `UPPER_SNAKE_CASE` constants, `kebab-case.ts` files. No default exports. English in code, Turkish terms (*kapı*, *açık*, *hapis*) in comments and docs.

## Workflow

- `main` is protected: no direct pushes, everything goes through a pull request with at least one review and a passing Jenkins build.
- Branch names: `type/short-description`, e.g. `feat/hapis-trapping`, `fix/bearoff-larger-die`.
- **Conventional Commits** (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`). Prefer squash merge.
- Keep changes small and focused; keep `main` working. Never commit secrets, `.env` files or build output.
- A bug fix starts with a failing test that reproduces the bug. Rule changes always come with tests.

## Before you finish

Check `CODING_RULES.md`, section 12 ("Definition of done"): strict compile with no new warnings, lint and format pass, tests written and passing, affected docs updated, UI changes work on desktop and phone-sized screens.
