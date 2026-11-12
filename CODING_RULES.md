# Coding Rules

These are the ground rules for all code in this repository. They are short on purpose. If a rule gets in the way of doing the job well, raise it and change the rule; do not quietly ignore it.

## 1. Principles

1. **The server is the authority.** The client shows and suggests; the server decides. Never trust anything that comes from a client.
2. **The rules engine is pure.** No network, no database, no clock, no randomness inside it.
3. **Correctness before cleverness.** Tavla rules have many edge cases. Readable code with tests beats short code.
4. **Rules live in one place.** Game rules are written once, in the shared engine, and described in `RULES.md`.
5. **Small steps.** Small, reviewable changes that keep the main branch working.

## 2. Language and tooling

- **TypeScript everywhere**, in strict mode. `strict: true`, plus `noUncheckedIndexedAccess` and `noImplicitOverride`.
- **No `any`.** Use `unknown` and narrow it. Exceptions need a comment saying why.
- **No `@ts-ignore`.** If unavoidable, use `@ts-expect-error` with a reason.
- **pnpm workspaces** monorepo. One lockfile, committed.
- **ESLint and Prettier** with the shared config. Formatting is automatic and never argued about in review.
- **Vitest** for tests. **Playwright** for end-to-end browser tests.
- **Node.js LTS** for the server; the version is pinned in `.nvmrc` and `package.json`.

## 3. Repository boundaries

| Package | May import | Must not import |
| --- | --- | --- |
| `engine` | nothing outside itself | `server`, `client`, Node or browser APIs |
| `protocol` | `engine` types only | `server`, `client` |
| `server` | `engine`, `protocol` | `client` |
| `client` | `engine`, `protocol` | `server` |

Dependencies point inward toward `engine`. A lint rule enforces this.

## 4. The rules engine

1. **Pure functions only.** Same input, same output. State is never mutated; functions return a new state.
2. **Dice are injected.** The engine never calls `Math.random`. It receives dice values as input. The server generates them (see section 6).
3. **Rule sets are data.** Backgammon and Hapis differ by configuration (hit vs. trap, layout, bar, bear-off restriction), not by copy-pasted code paths.
4. **Total functions.** Illegal input returns a typed error, not an exception.
5. **Every rule in `RULES.md` has at least one test**, and every edge case listed there has its own named test.
6. **Property tests** (for example with fast-check) check invariants: checker counts never change except by bearing off, a move sequence never uses more pips than rolled, and so on.
7. **Determinism.** A game must be exactly reproducible from its starting state and its roll and move history.

## 5. Naming and structure

- Types and classes: `PascalCase`. Functions and variables: `camelCase`. Constants: `UPPER_SNAKE_CASE`. Files: `kebab-case.ts`.
- Name things in the domain's language: `point`, `checker`, `bar`, `bearOff`, `trap`, `gate`. Turkish terms (*kapı*, *açık*, *hapis*) are used in comments and in `RULES.md`, and English in code.
- One concept per file. Avoid files over about 300 lines.
- Prefer small, explicit types over booleans and strings: `type Player = 'white' | 'black'`.
- No default exports.
- Comments explain **why**, not what.

## 6. Server rules

1. **Dice are rolled on the server** with a cryptographically secure source (`crypto.randomInt`). Every roll is stored with the game.
2. **Validate every incoming message** with a schema (zod). Reject what does not match.
3. **Re-validate every move** with the engine before accepting it. Check that it is the sender's turn and that the move is in the engine's legal set.
4. **Secrets only from environment variables.** Never commit keys, passwords or tokens.
5. **Structured logging.** Log game id, player id and event; never log credentials.
6. **Idempotent actions.** A repeated message (for example after a reconnect) must not apply a move twice.
7. **Persist before you reply.** A move is stored before it is confirmed to players.
8. **Fail closed.** If something is wrong or unknown, reject the action.

## 7. Client rules

1. **The client never decides outcomes.** It may use the engine to highlight legal moves and preview results, but the server's answer is final.
2. **Game state comes from the server.** On reconnect, reload state; do not trust local memory.
3. **Accessibility.** Keyboard operable, readable contrast, and no information conveyed by colour alone (for example, trapped checkers need a mark besides colour).
4. **Internationalisation from day one.** Turkish and English. No hard-coded user-facing strings in components.
5. **Mobile-friendly.** Layouts work on a phone-sized screen. Touch targets are large enough.
6. **No game rules in components.** UI code calls the engine; it does not reimplement it.

## 8. Testing

- A change that touches rules must come with tests.
- Engine: very high coverage; every rule and edge case in `RULES.md`.
- Server: tests for message validation, turn order, reconnection and persistence.
- Client: component tests for the board; a few end-to-end tests for a full game between two browser sessions.
- Tests are deterministic: no real clocks, no real randomness, no network.
- A bug fix starts with a failing test that reproduces the bug.

## 9. Version control and review

All code and documents are versioned in **GitHub**.

- `main` is always releasable and is a **protected branch**: no direct pushes, changes arrive only through pull requests.
- Work happens on short-lived branches named `type/short-description` (for example `feat/hapis-trapping`, `fix/bearoff-larger-die`).
- **Conventional Commits** (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`).
- Pull requests are small and focused, with a clear description of what and why. Link the GitHub issue they close (`Closes #12`).
- Use GitHub **Issues** for bugs, tasks and rule questions; open rule questions from `RULES.md` become issues.
- At least one review before merge. The **Jenkins** build must pass (type check, lint, tests) and is reported on the pull request as a status check.
- CI runs only the repository's own `pnpm` scripts (`lint`, `typecheck`, `test`, `build`), so a developer can run exactly what CI runs. The `Jenkinsfile` lives in the repository and contains no secrets; credentials are stored in Jenkins and referenced by id.
- Prefer squash merge, so `main` keeps one clean commit per change.
- No force-push to `main`. No merging your own failing build.
- Never commit secrets, `.env` files or build output. Keep `.gitignore` current, and enable GitHub secret scanning and Dependabot alerts.

## 10. Documentation

- If you change a rule, update `RULES.md` in the same pull request.
- If you change a structural decision, update `ARCHITECTURE.md` and the decisions table in `README.md`.
- Public functions of the engine have short doc comments with an example.

## 11. Security and privacy

- Collect the minimum personal data needed.
- Hash passwords with a modern algorithm if passwords are used at all; prefer a trusted identity provider.
- Rate-limit connections and messages.
- Keep dependencies few and up to date; review new ones before adding them.

## 12. Definition of done

A change is done when:

- [ ] It compiles in strict mode with no new warnings.
- [ ] Lint and format checks pass.
- [ ] Tests are written and pass, including edge cases for rule changes.
- [ ] Rules docs and architecture docs are updated if affected.
- [ ] It works in the browser on desktop and phone-sized screens, if it touches the UI.
- [ ] It was reviewed and merged by pull request.
