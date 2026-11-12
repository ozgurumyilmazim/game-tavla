# Architecture

Status: starting draft for the MVP (web client, two human players, backgammon and Hapis).

## 1. Goals

- One rules engine for all games, shared by client and server.
- Server-authoritative play: dice, validation and results come from the server.
- Turn-based online play between two people, with reconnection.
- Room to add native mobile apps and a third game later without rewriting the rules.

## 2. Technology

| Layer | Choice |
| --- | --- |
| Language | TypeScript (strict) on both sides |
| Client | React with Vite; board drawn with SVG |
| Server | Node.js with WebSockets |
| Database | PostgreSQL (to be confirmed) |
| Validation | zod schemas, shared in the protocol package |
| Tests | Vitest; Playwright for end-to-end |
| Repository | pnpm workspaces monorepo, hosted on GitHub |
| CI | Jenkins (pipeline defined in a `Jenkinsfile`) |

## 3. Repository layout

```
/packages
  /engine      pure rules engine: backgammon and Hapis rule sets
  /protocol    message types and schemas shared by client and server
/apps
  /server      Node.js game server
  /client      React web client
```

Dependencies point inward toward `engine`; see `CODING_RULES.md`, section 3.

## 4. The rules engine

A single engine takes a **rule set** (configuration) and works on a **game state**.

State (summary):

- 24 points, each with an owner and a count of checkers.
- Per player: checkers borne off; for backgammon, checkers on the bar.
- For Hapis: which checkers are trapped and which checker traps them.
- Current player, dice for the turn, dice not yet used.
- Match score (to 5 points) and game number.

Main functions:

1. `newGame(ruleSet)` returns the starting state.
2. `legalTurns(state, dice)` returns every complete legal sequence of moves for the dice.
3. `applyMove(state, move)` returns the next state or a typed error.
4. `gameResult(state)` returns the winner and the points (1, 2 or 3), or nothing if the game continues.

Rule sets differ by data:

| Setting | Backgammon | Hapis |
| --- | --- | --- |
| Starting layout | Classic 2-5-3-5 | All 15 on the 24-point |
| Lone checker landed on | Hit, sent to the bar | Trapped in place |
| Bar and re-entry | Yes | No |
| Bear-off blocked while trapped | n/a | Yes |
| Doubling cube | Not in the first phase | Not in the first phase |
| Match target | 5 | 5 |

The exact rules are in `RULES.md`.

## 5. Server

Responsibilities:

- Authenticate players and create or join games (invite link or matchmaking).
- Roll dice with a secure random source and store each roll.
- Validate every move with the engine; reject anything that is not legal or not the sender's turn.
- Persist game state after every accepted move.
- Push updates to both players; resend current state after a reconnect.
- Handle timeouts and abandoned games (rules to be decided).

The server holds the authoritative game; clients hold a view of it.

## 6. Client

Responsibilities:

- Draw the board, checkers, dice and score.
- Let the player choose moves; use the engine to highlight legal moves and preview.
- Send chosen moves to the server and display the server's answer.
- Show trapped checkers clearly (not by colour alone).
- Turkish and English interface.

## 7. Protocol sketch

Messages travel over a WebSocket. Every message is validated by a shared schema.

Client to server:

| Message | Meaning |
| --- | --- |
| `joinGame` | Join or resume a game |
| `rollDice` | Ask for this turn's dice (the server rolls) |
| `playMove` | Play one move |
| `endTurn` | Confirm the turn is finished |
| `resign` | Give up the game |

Server to client:

| Message | Meaning |
| --- | --- |
| `gameState` | Full current state (also sent on reconnect) |
| `diceRolled` | Dice for the current turn |
| `moveApplied` | A move was accepted |
| `moveRejected` | A move was not legal, with the reason |
| `gameOver` | Result and points |
| `matchOver` | Match result (first to 5) |

Message names are provisional and will be fixed in the protocol package.

## 8. Data (summary)

- Players: id, display name, login identity.
- Games: id, game type, players, status, current state, match score.
- Moves and rolls: ordered history for each game, enough to replay it exactly.

## 9. Quality and operations

- Jenkins runs type check, lint and tests on every pull request and reports the result to GitHub; a failing build blocks the merge.
- Games must be replayable from their history; this is used in tests and for investigating disputes.
- Structured logs; no secrets in logs.

## 10. Later (not in the MVP)

- Native Android and iOS apps reusing the engine and protocol.
- Solo play against a bot.
- Doubling cube and Crawford rule.
- Third game, added as another rule set or engine module.

## 11. Open questions

- [ ] Authentication method (email, social login, guest play).
- [ ] Matchmaking: invite links only, or also random opponents.
- [ ] Turn time limits: none in the first phase (decided), but a limit and handling of disconnected players will be needed later for online play.
- [ ] Hosting and deployment target.
- [ ] Jenkins setup: where it runs, build agents (Node.js, pnpm, Playwright browsers), GitHub webhook and status-check integration, who maintains and patches it.
- [ ] Database confirmation (PostgreSQL).
- [ ] Which third game.
