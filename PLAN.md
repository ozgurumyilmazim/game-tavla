# Go-Live Plan / Yayına Alma Planı

Status: draft v1, written by the developer, awaiting owner review.
Scope: the first phase (MVP) described in `README.md`, taken from an empty repository to a public launch.

## 1. Decisions taken for this plan

| Topic | Decision | Notes |
| --- | --- | --- |
| Hosting | Owner's own Linux server with Docker Compose | Not a cloud provider. The owner runs the machine and controls DNS. |
| Jenkins | Owner's existing Jenkins, owner maintains it | Runs in the owner's environment. |
| Product name | TAVLA | Public site and UI brand. |
| Inactivity | Inactive player loses the current game | Phase 1 rule. The time limit is still open (section 9). |
| Player data | No email stored | Google subject id and display name only. |
| In-game chat | Text and audio | Added by the owner; see M5b. Audio ships behind a feature flag and may follow the beta start (decided). Text chat is required for Gate A. |
| Reverse proxy and TLS | Caddy | Automatic HTTPS, WebSocket proxying. Needs ports 80/443 reachable and a DNS record. |
| Database | PostgreSQL | Container with a volume, plus off-VM backups. Confirms the open item in `ARCHITECTURE.md`. |
| Sign-in | Guest play + Google login | Guests join by invite link. Google gives a persistent identity. No passwords stored. |
| Matchmaking | Invite links only | No lobby, no random opponents in the MVP. |
| Launch shape | Closed beta, then public | Two gates, see section 7. |
| Single server instance | Yes for the MVP | Game rooms live in one Node process, state persisted in Postgres. Scale-out is a later concern. |

These are to be copied into `README.md` (decisions table) and `ARCHITECTURE.md` (section 11) when the owner approves this plan.

## 2. Guiding constraints

- Correctness of rules comes first. No public launch with an unverified engine.
- `RULES.md` is the specification. Every rule gets a test (`CODING_RULES.md` section 4).
- Small pull requests, `main` always releasable, Jenkins green before merge.
- The server is the authority. Dice are rolled with `crypto.randomInt` and stored.
- Every game is replayable from its history, which is also our dispute tool.

## 3. Milestones

Effort is in rough developer-weeks, one developer working full time. They are estimates, not commitments, and will be revised after M1.

| # | Milestone | Outcome | Est. |
| --- | --- | --- | --- |
| M0 | Foundation | Workspace, tooling, CI green on an empty change | 0.5 |
| M1 | Engine: backgammon | Complete, tested backgammon rules | 2 |
| M2 | Engine: Hapis | Trapping, no bar, bear-off restriction, as data | 1.5 |
| M3 | Protocol | Shared zod schemas and message types | 0.5 |
| M4 | Server core | Rooms, dice, validation, persistence, reconnect | 2.5 |
| M5 | Client | Board, play flow, i18n TR/EN, mobile | 3 |
| M5b | Chat | Text chat and 1:1 audio between the two players | 2.5 |
| M6 | Identity | Guest sessions and Google login | 1 |
| M7 | Infrastructure | VM, Docker, Caddy, Postgres, backups, deploy job | 1 |
| M8 | Hardening | Rate limits, logging, e2e tests, load check, security review | 1.5 |
| M9 | Closed beta | Real users, bug fixing, rule feedback | 2 |
| M10 | Public launch | Open registration, monitoring, support routine | 0.5 |

Total: about 18.5 weeks (chat adds 2.5). M5 and M6 can overlap with M4 once the protocol (M3) is fixed. M7 can start as soon as M0 is done and run in parallel.

### M0 Foundation

- pnpm workspace with `packages/engine`, `packages/protocol`, `apps/server`, `apps/client`.
- TypeScript strict config with `noUncheckedIndexedAccess` and `noImplicitOverride`, shared base config.
- ESLint and Prettier, with the import-boundary lint rule from `CODING_RULES.md` section 3.
- Vitest set up; `.nvmrc`, `.gitignore`, `.editorconfig`.
- Scripts `lint`, `typecheck`, `test`, `build` at the root so the existing `Jenkinsfile` passes.
- GitHub: branch protection on `main`, secret scanning, Dependabot, issue labels.
- Jenkins: the owner's existing instance. Wire the GitHub webhook and status check, and confirm agent has Node LTS, pnpm (corepack) and Docker.
- README "Getting started" section filled in.

Done when: an empty pull request goes green on Jenkins and is blocked when lint or types fail.

### M1 Engine: backgammon

- Resolve the file-name mismatch first: rules live in `RULES.md` (single file); fix the stale reference in `AGENTS.md`.
- Types: `Player`, `Point`, `GameState`, `Move`, `RuleSet`, typed errors.
- `newGame`, `legalTurns`, `applyMove`, `gameResult`, as in `ARCHITECTURE.md` section 4.
- Doubles played four times; must-use-both-dice and larger-die rules; bar entry; hitting; bear-off with larger die; gammon and backgammon scoring.
- Opening roll (higher die starts, re-roll on equal) and match flow to 5 points.
- One named test per edge case in `RULES.md` section 7, plus property tests with fast-check (checker conservation, pip limits, determinism).

Done when: every rule and edge case in the backgammon parts of `RULES.md` has a passing test, and a seeded random-play simulation of several thousand games completes with no invariant violation.

### M2 Engine: Hapis

- Add the Hapis rule set as configuration, not a new code path: start layout, trap instead of hit, no bar, bear-off blocked while a checker is trapped, scoring in `RULES.md` section 4.5.
- Trapping in the opponent's home is allowed (decided).
- Edge-case tests from `RULES.md`, plus simulation runs for Hapis, including positions where no legal move exists.

Done when: the same simulation harness passes for both rule sets. A native Turkish tavla player reviews a sample of recorded games against `RULES.md` (see risks, section 8).

### M3 Protocol

- Final message names and zod schemas for the messages in `ARCHITECTURE.md` section 7.
- Version field on the protocol so old clients can be refused cleanly.
- Message idempotency keys (needed for reconnect, `CODING_RULES.md` section 6.6).

### M4 Server core

- Node.js WebSocket server; `joinGame` by invite link; two seats per game.
- Server rolls dice, stores every roll; validates every move with the engine; rejects wrong-turn and illegal moves.
- Persist before reply. Schema: players, games, rolls and moves, match score (`ARCHITECTURE.md` section 8). Migrations from day one.
- Reconnect: resend full `gameState`. Repeated messages never apply twice.
- Abandoned games: no turn timer in the MVP (decided), but a player who is inactive loses the current game (decided: forfeit). The inactivity period is still to be set (section 9). A forfeit counts as a normal loss (1 point) in the match; gammon scoring does not apply to forfeits unless the owner says otherwise.
- Resign.

### M5 Client

- SVG board; piece selection; legal-move highlighting using the engine; preview; confirm and `endTurn`.
- Server answer is final; the client shows moves rejected by the server.
- Trapped checkers marked by more than colour (accessibility).
- Turkish and English from the start, no hard-coded strings.
- Mobile layout and touch targets; keyboard operable.
- Create game, copy invite link, join page, match score screen, game over and match over screens.
- Component tests for the board; Playwright end-to-end test for a full game between two browser sessions.

### M5b Chat (text and audio)

Proposed design, to be confirmed (section 9):

- Text chat: messages travel over the existing WebSocket, validated by zod, length-limited and rate-limited. Stored with the game only if the owner wants it for disputes.
- Audio: browser WebRTC, one peer-to-peer call between the two players of a game. The server only relays signalling over the WebSocket. Audio is not recorded and does not pass through the application server.
- TURN relay: players behind strict NATs cannot connect directly, so the server needs a TURN service (coturn in Docker) with its own UDP port range, TLS, and short-lived credentials issued per game. This is the main new infrastructure item.
- Controls for players: mic off by default and push-to-talk or mute, mute the opponent, block, and report. Opt-in microphone permission is requested only when the player starts a call.
- Moderation: reports go to a queue the owner reads; chat is limited to the two players of a game, so there is no public channel.
- Works on phones (iOS Safari and Android Chrome). This needs real-device testing and is the largest risk in this milestone.
- Privacy: audio is not stored; text retention and the privacy notice must say so (KVKK).
- Accessibility and i18n: chat strings in TR and EN; text chat has a non-audio alternative at all times.

Done when: two players on different networks (one behind mobile data) can chat and talk during a game, and a muted or blocked opponent is silent and unseen.

### M6 Identity

- Guest session: server-issued random token stored in the browser, with a chosen display name. Guest rows are cleaned up after a retention period.
- Google sign-in with OAuth/OIDC through a maintained library. Server validates the ID token; no Google tokens are shown to the client beyond what the flow needs.
- A guest can upgrade to a Google account and keep their games.
- Minimal personal data: Google subject id and display name. Email is not stored (decided). Request only the `openid` and `profile` scope, not `email`.
- Privacy notice and cookie handling for the Turkish market (KVKK); see section 9.

### M7 Infrastructure

Layout on the VM:

```
Caddy (80/443)  ->  client static files  +  /ws -> server (Node)
server          ->  PostgreSQL (private Docker network)
```

- The target is the owner's existing Linux machine with Docker and Docker Compose; no cloud provider is involved.
- Docker images for `server` and `client`, built by the owner's Jenkins, tagged with the git commit. An image registry is needed (self-hosted or a private one); to be agreed.
- `docker-compose.yml` for production; secrets from environment files kept on the server, never in the repository.
- Network: ports 80 and 443 reachable from the internet, a DNS record under the owner's control, and for chat a coturn service (UDP 3478 plus a relay port range, and TLS on 5349). Check firewall and any upstream NAT.
- Hardening: non-root user, SSH keys only, firewall, unattended security updates, fail2ban or equivalent. The deploy path from Jenkins to the server uses a dedicated limited key stored in Jenkins credentials.
- Postgres: nightly `pg_dump` to storage off this machine, retention of 14 days, and a documented, tested restore.
- Two environments: `staging` and `production`, as separate Compose projects on the same machine unless the owner has a second one. Weaker isolation, so staging gets its own database and no production secrets.
- Deploy job in Jenkins: on merge to `main`, build, push images, deploy to staging automatically; production on a manual approval step. Rollback is redeploying the previous tag.
- Uptime check from outside the owner's network, with an alert to the owner.

### M8 Hardening

- Rate limits on connections and messages; maximum message size; cap on games per player.
- Structured logs with game id, player id and event; no credentials in logs. Log retention and rotation.
- Security review against `CODING_RULES.md` section 11: input validation, origin checks on the WebSocket, session token handling, dependency audit.
- Load test: target is a few hundred concurrent games on the chosen VM, to be confirmed with the owner (section 9).
- Failure drills: server restart mid-game (games resume), database restart, network drop on one client.
- Replay check: re-run stored games from history and compare the final state.

### M9 Closed beta

- Invite a small group (target 20 to 50 people, including experienced Hapis players).
- In-app feedback link and a GitHub issue template for bugs and rule disputes.
- Daily look at logs and errors; weekly fix-and-release rhythm.
- Exit criteria (all must hold): see section 7.

### M10 Public launch

- Remove the beta gate; announce.
- Monitoring and alerts verified; backup restore verified again on the production data.
- Support routine: where bug reports go, who answers, response expectation.

## 4. Environments and release flow

```
feature branch -> pull request -> Jenkins (lint, typecheck, test, build)
  -> review + squash merge to main
  -> Jenkins builds images -> auto deploy to staging
  -> e2e smoke test on staging -> manual approval -> production
```

- Database migrations run as a deploy step and must be backward compatible with the previous release, so a rollback is safe.
- The protocol version lets the server tell an outdated client to reload.

## 5. Testing strategy (summary)

| Level | What | Gate |
| --- | --- | --- |
| Engine unit + property | Every rule and edge case in `RULES.md` | Every PR |
| Simulation | Random full games for both rule sets, invariants checked | Every PR (short run), nightly (long run) |
| Server | Schema validation, turn order, reconnect, persistence, idempotency | Every PR |
| Client component | Board rendering and interaction | Every PR |
| End-to-end | Two browser sessions play a full match | Before each production release |
| Manual | Phone-sized and desktop; Turkish and English | Before each production release |

Playwright needs browsers on the Jenkins agent; enable the commented e2e stage in the `Jenkinsfile` when that is ready.

## 6. Operations after launch

- Alerts: server down, error rate up, disk above 80 percent, backup failed.
- Backups: tested restore monthly.
- Patching: monthly OS and image updates; same-week for security advisories. Dependabot pull requests reviewed weekly.
- Jenkins is part of operations: someone owns its updates and its credentials (open question).
- Incident note: for any outage or lost game, write a short post-mortem in `docs/incidents/`.

## 7. Launch gates

### Gate A: start closed beta

- M1 to M8 complete and merged, including M5b text chat. Audio may be disabled behind a flag (decided); it is enabled once it passes real-device testing.
- Both games playable end to end on staging between two real browsers (desktop and phone).
- Restore from backup demonstrated once.
- A rules review of Hapis by a knowledgeable player is done and issues are closed or accepted in writing.

### Gate B: go public

- At least 2 weeks of beta with no known bug that loses games, applies wrong rules or corrupts state.
- No open critical or high security finding.
- At least 100 completed beta games with replay verification showing no mismatch.
- Backup, alerting and rollback exercised on production.
- Privacy notice and terms published.
- Owner sign-off.

## 8. Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Rule disagreements about Hapis (regional variants) | Players feel the game is wrong | `RULES.md` is the authority; early review by experienced players; rule changes always via `RULES.md` and tests. |
| Engine bugs in rare positions | Wrong results, lost trust | Property tests, simulation, per-edge-case tests, replay of beta games. |
| Single VM failure | Downtime, lost games in progress | State persisted per move; backups off the VM; documented rebuild from Compose files; accept short downtime in the MVP. |
| Disconnects and abandoned games | Frustration, stuck matches | Reconnect with full state; inactivity close rule; real timers in a later phase. |
| Guest abuse (spam, many sessions) | Load, harassment | Rate limits, caps per IP and per guest, short-lived guest data, invite-link only play limits exposure. |
| Jenkins outage | Slows delivery if it breaks | Owner maintains it; pipeline only calls `pnpm` scripts so it is replaceable. |
| Audio chat (WebRTC, TURN, phones) | Largest new technical risk; abuse and privacy exposure | Own milestone M5b; coturn with short-lived credentials; mute, block, report; no recording; real-device testing; can be switched off by a flag if it is not ready at Gate A. |
| Single self-hosted machine | Home or office network, power or ISP failure means downtime | Backups off the machine; UPS and a stable public IP checked at M7; accept downtime in the MVP. |
| Scope growth | Late launch | Out-of-scope list in `README.md` stays fixed until Gate B. |
| Legal and privacy (KVKK, cookies, Google data) | Compliance exposure | Minimal data; privacy notice; get the owner's view on legal review before Gate B. |

## 9. Questions for the owner

Answered (recorded in section 1):

| # | Question | Answer |
| --- | --- | --- |
| 1 | Jenkins maintainer and location | Owner's own Jenkins, in the owner's environment |
| 2 | VM provider, region, budget | Owner's own Linux machine with Docker Compose; no provider |
| 3 | Domain and DNS | Owner controls DNS (domain name itself still to be told, see O1) |
| 4 | Player email needed? | No, Google subject id and display name only |
| 5 | Abandoned games | Inactive player loses the current game (period still open, see O2) |
| 8 | Legal review (KVKK) | Owner will check with their lawyer |
| 9 | Product name | TAVLA |
| 10 | In-game chat | Yes, text and audio (design to confirm, see O3). Audio ships behind a flag (decided). |

Open:

| # | Question | Needed by |
| --- | --- | --- |
| O1 | Which domain name (for example tavla.example.com) and is the machine reachable from the internet on ports 80, 443 and a UDP range for TURN? | M7 |
| O2 | After how long without a move or connection does a player lose the game? Does the forfeit count as 1 point? | M4 |
| O3 | Audio scope: only a call between the two players of a game, with mute, block and report? Is text chat stored (for disputes) or discarded? | M5b |
| 6 | Expected beta size and launch-week concurrent games, to size the machine | M8 |
| 7 | Who reviews the Hapis rules and who is in the beta? | M2 |
| O5 | Is there an image registry available to Jenkins, and how does Jenkins reach the server (SSH from Jenkins)? | M0 |
| O6 | Second machine for staging, or share the production one? | M7 |

## 10. Next actions

1. Owner answers O2 and O3 (they shape M4 and M5b); the rest can follow.
2. Developer starts M0 on a `chore/workspace-setup` branch, as one small pull request per area (workspace, lint/format, CI scripts, GitHub settings).
3. Record the decisions from section 1 in `README.md` and `ARCHITECTURE.md` once approved.
