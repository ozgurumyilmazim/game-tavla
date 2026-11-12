# Game Rules: Backgammon (Tavla) and Hapis

This file is the single reference for the rules of both games. It combines what is shared and what differs. The detailed engine specifications are in `RULES_BACKGAMMON.md` and `RULES_HAPIS.md`; if they ever disagree with this file, update all three in the same pull request.

Scope: first phase (MVP). Two players, online, turn based. Matches to 5 points. No doubling cube. No solo play.

Items marked **provisional** were not stated by the project owner and need confirmation (see section 9).

## 1. Summary

| | Backgammon | Hapis |
| --- | --- | --- |
| Players | 2 | 2 |
| Checkers | 15 each | 15 each |
| Dice | 2 | 2 |
| Start position | Classic: 2 on the 24-point, 5 on the 13-point, 3 on the 8-point, 5 on the 6-point | All 15 on your own 24-point |
| Landing on a lone opposing checker | Hit: sent to the bar | Trap: frozen in place |
| Bar and re-entry | Yes | No |
| Bearing off while a checker is trapped | n/a | Not allowed |
| Doubles | Played four times | Played four times |
| Scoring | 1 / 2 (gammon) / 3 (backgammon) | 1 / 2 (gammon) / 3 (backgammon, provisional definition) |
| Match | First to 5 points | First to 5 points |
| Doubling cube | Not in the first phase | Not in the first phase |

## 2. Shared rules (both games)

### 2.1 Goal

Move all 15 of your checkers into your home quadrant (points 1 to 6), then bear them off before your opponent does.

### 2.2 Board and numbering

- 24 points. Each player numbers the points from their own side. Your home is points 1 to 6. Your farthest point is your **24-point**.
- Your 24-point is the same place as your opponent's 1-point.
- The two players move in opposite directions, from point 24 toward point 1.

### 2.3 Starting a game

Each player rolls one die. The higher die wins and plays the first turn using both dice as rolled. If both dice are equal, they are rolled again. (Hapis: provisional, same as backgammon.)

### 2.4 A turn

1. Roll two dice. The server rolls them.
2. Each die is a separate move. A checker moves forward (toward point 1) by the number shown.
3. Both dice may be played by one checker or by two checkers. When one checker plays both, the point it passes through must also be a legal landing point.
4. **Doubles** (both dice equal) are played four times.
5. You must play as many dice as legally possible.
6. If only one die can be played, you must play the larger one.
7. If no move is possible, the turn is lost.

### 2.5 Points and gates

- A point holding two or more checkers of one player is a **gate** (*kapı*). The opponent cannot land on it.
- A lone checker is *açık* (open). What happens when it is landed on depends on the game (hit or trap).

### 2.6 Bearing off

- Allowed only when all 15 of your checkers are in your home quadrant.
- A die showing N removes a checker from your N-point.
- If you have no checker on the N-point, you must move a checker from a higher point if you can. If there is none on a higher point, you remove a checker from the highest point you occupy.
- The first player to bear off all 15 checkers wins the game.

### 2.7 Scoring

| Result | Points |
| --- | --- |
| Normal win | 1 |
| Gammon: the loser has borne off no checkers | 2 |
| Backgammon: see each game below | 3 |

### 2.8 Match

- A match is played to **5 points**. The first player to reach 5 or more points wins the match.
- Who starts the next game: the player who lost the previous game rolls first (provisional).
- No doubling cube and no Crawford rule in the first phase.

## 3. Backgammon

### 3.1 Starting position

Counted from your own side:

| Point | Checkers |
| --- | --- |
| 24 | 2 |
| 13 | 5 |
| 8 | 3 |
| 6 | 5 |

### 3.2 Landing

A checker may land on an empty point, a point holding your own checkers, or a point holding exactly one opposing checker. It may not land on a gate.

### 3.3 Hitting and the bar

- Landing on a lone opposing checker **hits** it. The hit checker goes to the bar.
- A player with a checker on the bar must bring it back before moving any other checker.
- Re-entry: a die of N enters on the opponent's N-point (1 to 6). Entry is blocked if that point is a gate. If no die allows entry, the turn is lost.
- A hit checker loses all the distance it had travelled.

### 3.4 Bearing off with hits

If a checker is hit during bear-off, it must re-enter and return home before bearing off continues.

### 3.5 Backgammon (3 points)

The loser has borne off no checkers and still has a checker on the bar or in the winner's home quadrant.

## 4. Hapis

Hapis ("prison") is a traditional Turkish tavla variant. Rules vary by region; the rules below are those chosen by the project owner.

### 4.1 Starting position

All 15 checkers of each player are stacked on that player's own **24-point**. There is no bar and no entry phase.

### 4.2 Landing

A checker may land on:

- an empty point;
- a point holding your own checkers;
- a point holding exactly one opposing checker, which **traps** it.

A checker may not land on a gate, nor on a point where the opponent's checker is a trapper (see 4.3).

Trapping is allowed on every point, including points in the opponent's home quadrant.

### 4.3 Trapping (*hapis*)

1. Landing on a lone opposing checker traps it. Your checker sits on top of it on the same point.
2. A trapped checker cannot move.
3. It is freed when the checker (or checkers) trapping it has left the point.
4. While the trap stands, the trapped player cannot land on that point.
5. A trapping checker cannot itself be trapped. A point holding two or more checkers of one player cannot be trapped.
6. Nothing is ever removed from the board, so there is no bar and no re-entry.
7. A player whose every checker is trapped or blocked loses the turn.

### 4.4 Bearing off

Same as 2.6, with one extra condition: **a player with a checker still trapped cannot begin bearing off.**

### 4.5 Backgammon (3 points)

Provisional: the loser has borne off no checkers and still has a checker in the winner's home quadrant, or a trapped checker.

## 5. Terms

| Term | Turkish | Meaning |
| --- | --- | --- |
| Checker | pul | A playing piece |
| Point | hane | One of the 24 triangles |
| Gate | kapı | Two or more of your checkers on a point; the opponent cannot land there |
| Blot | açık | A lone checker |
| Bar | köprü | The centre divider; holds hit checkers (backgammon) |
| Hit | kırmak | Landing on a blot and sending it to the bar (backgammon) |
| Trap | hapsetmek | Landing on a blot and freezing it (Hapis) |
| Bear off | toplamak | Removing checkers from the board at the end |
| Gammon | mars | Win while the loser has borne off nothing |

## 6. Rules the engine must enforce

1. Only legal landing points (2.5, 3.2, 4.2).
2. The most-dice-possible rule, and the larger die when only one can be played.
3. Four moves on doubles, as many as are legal.
4. Backgammon: bar first, then re-entry rules.
5. Hapis: frozen trapped checkers, no counter-trapping, bear-off blocked while trapped.
6. Bear-off conditions and the higher-point rule.
7. Correct scoring (1, 2 or 3) and match end at 5 points.

## 7. Edge cases to test

Common to both games:

1. A double where only some of the four moves can be played.
2. Only one die playable: the larger must be chosen.
3. Playing both dice with one checker where the middle point is blocked.
4. Bearing off with a die larger than the highest occupied point.
5. Opening roll with equal dice is rolled again.
6. Gammon detection at game end.

Backgammon only:

7. A checker on the bar and every entry point blocked: turn lost.
8. A hit during bear-off sends the checker back and stops bearing off.
9. Backgammon (3-point) detection.

Hapis only:

10. Landing on a lone opposing checker traps it; it cannot move.
11. A trapped checker is freed when the trapper leaves.
12. No counter-trapping.
13. Bearing off refused while any of your checkers is trapped.
14. Turn lost when every checker is trapped or blocked.
15. Trapping on the opponent's home points is legal.

## 8. Not in the first phase

- Doubling cube and Crawford rule.
- Solo play against a bot.
- Option to ban trapping in the opponent's home (possible later).
- Third game.

## 9. Open questions

- [ ] **Hapis, stacking on a trapping point.** If a second checker of the trapper lands on the same point, the trapped checker stays trapped until all trapper checkers have left (proposed).
- [ ] **Hapis, adding own checkers to a trapping point.** Confirm that this is allowed.
- [ ] **Hapis, backgammon (3-point) definition,** since there is no bar.
- [ ] **Who starts the next game of a match:** the previous loser (provisional) or a new roll for both.
- [ ] **Time limit per turn** and what happens when it runs out.
