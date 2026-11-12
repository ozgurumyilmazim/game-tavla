# Tavla Games

A web-based, two-player, turn-based board game platform. The main game is **backgammon (tavla)**. The second game is **Hapis**, a traditional Turkish tavla variant. A third game will be chosen later.

## Purpose

Give players a place to play tavla games online against another person, with rules that are correct, fair and identical for both sides of every match. The Turkish tavla tradition is a first-class citizen: Hapis is not an afterthought, and the rules follow how the games are actually played.

The project is built so that one rules engine can serve several games, and so that the web client can later be joined by native Android and iOS apps without rewriting the rules.

## Scope of the first phase (MVP)

In scope:

- Web client for desktop and mobile browsers.
- Online play between two human players, turn based.
- Two games: backgammon and Hapis.
- Matches played to 5 points, for both games.
- Gammon and backgammon scoring.
- Server-side dice and server-side move validation.

Out of scope for the first phase:

- Native Android and iOS apps.
- Solo play against a bot.
- Doubling cube (and therefore the Crawford rule).
- The third game.

## Decisions so far

| Topic | Decision |
| --- | --- |
| Client language | TypeScript (React + Vite) |
| Server language | TypeScript (Node.js, WebSockets) |
| Shared code | One rules engine package used by client and server |
| Hapis start position | All 15 checkers of each player on their own 24-point |
| Doubles | Played four times, in both games |
| Match length | 5 points only, in both games |
| Trapping in the opponent's home (Hapis) | Allowed |
| Doubling cube | Not in the first phase |
| Version control | GitHub (pull requests, Issues) |
| Continuous integration | Jenkins (pipeline in a `Jenkinsfile`) |

Open questions are tracked at the end of `RULES.md` and `ARCHITECTURE.md`.

## Documents

| File | What it contains |
| --- | --- |
| `README.md` | This file: purpose, scope, decisions |
| `CODING_RULES.md` | Ground rules for everyone who writes code here |
| `ARCHITECTURE.md` | Components, repository layout, data flow, protocol sketch |
| `RULES.md` | The rules of both games, as the engine must implement them: shared rules, differences, terms, edge cases |

When code and `RULES.md` disagree, `RULES.md` is right until the owner decides otherwise. Fix the code, or change the document in the same pull request.

## Getting started

To be filled in once the repository is created (install, run, test commands).
