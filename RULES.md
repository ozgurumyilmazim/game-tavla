# Game Rules: Backgammon (Tavla) and Hapis / Oyun Kuralları: Backgammon (Tavla) ve Hapis

**EN**
This file is the single source of truth for the rules of both games, and the specification the engine implements. It covers what is shared and what differs.

**TR**
Bu dosya, her iki oyun için kuralların tek gerçek kaynağıdır ve motorun uyguladığı spesifikasyonu içerir. Paylaşılan ve farklı olanları kapsar.


Scope: first phase (MVP). Two players, online, turn based. Matches to 5 points. No doubling cube. No solo play.

All rules below have been confirmed by the project owner. The only open point is in section 9.

## 1. Summary / 1. Özet

### 1.1 Equipment and Objective

**EN**
* **Equipment**: A backgammon board with 24 triangular points (hane), a pair of dice, and 30 checkers (15 per player, typically black and white).
* **Objective**: Move all your checkers into your home board (points 1‑6) and then bear them off. The first player to bear off all 15 checkers wins. A win where the opponent has not borne off any checkers is a **Gammon** (double points).

**Turkish**: Tavla; 24 üçgen haneden (kapıdan) oluşan tahta, iki zar ve iki oyuncuya ait 30 pul. Amaç tüm pulları kendi iç sahasına (kalesine) getirip tahtadan toplamaktır. Rakip hiçbir pul toplamazsa **Mars** (iki puan) kazanılır.


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
| Scoring | 1 / 2 (gammon) / 3 (backgammon) | 1 / 2 (gammon) / 3 (backgammon, see 4.5) |
| Match | First to 5 points | First to 5 points |
| Doubling cube | Not in the first phase | Not in the first phase |

## 2. Shared rules (both games) / 2. Ortak Kurallar (her iki oyun)

### 2.1 Goal

Move all 15 of your checkers into your home quadrant (points 1 to 6), then bear them off before your opponent does.

### 2.2 Board and numbering

- 24 points. Each player numbers the points from their own side. Your home is points 1 to 6. Your farthest point is your **24-point**.
- Your 24-point is the same place as your opponent's 1-point.
- The two players move in opposite directions, from point 24 toward point 1.
- Checkers always move forward, following a U-shaped track around the board, and never move backward.

### 2.3 Starting a game

- **First game of a match (score 0-0):** each player rolls one die. The higher die starts and plays the first turn using both dice as rolled. If both dice are equal, both players roll again, and keep rolling until the dice differ.
- **Later games of the match:** the winner of the previous game starts (see 2.8).

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
- There is no limit to the number of checkers on a point; all 15 may stand on one point.

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

There are no draws: every game has a winner.

### 2.8 Match

- A match is played to **5 points**. The first player to reach 5 or more points wins the match.
- The winner of the previous game starts the next game. There is no opening roll after the first game; the starter simply rolls two dice for the first turn.
- No doubling cube and no Crawford rule in the first phase.

## 3. Backgammon / 3. Backgammon (Türkçe)

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
3. **Stacking.** The trapper may be joined by more of its owner's checkers on the same point. The trapped checker stays trapped until **all** of the trapper's checkers have left the point, and is then freed.
4. **Adding own checkers.** A player may land more of their own checkers on a point where their checker is already trapping an opposing checker.
5. While the trap stands, the trapped player cannot land on that point.
6. A trapping checker cannot itself be trapped. A point holding two or more checkers of one player cannot be trapped.
7. Nothing is ever removed from the board, so there is no bar and no re-entry.
8. A player whose every checker is trapped or blocked loses the turn.

### 4.4 Bearing off

Same as 2.6, with one extra condition: **a player with a checker still trapped cannot begin bearing off.**

### 4.5 Backgammon (3 points)

The loser has borne off no checkers and still has a checker in the winner's home quadrant, or a trapped checker.

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
5. Opening roll: equal dice are rolled again, repeatedly, until they differ.
6. Gammon detection at game end.
7. After the first game, the previous winner starts, with no opening roll.

Backgammon only:

8. A checker on the bar and every entry point blocked: turn lost.
9. A hit during bear-off sends the checker back and stops bearing off.
10. Backgammon (3-point) detection with a checker on the bar or in the winner's home.

Hapis only:

11. Landing on a lone opposing checker traps it; it cannot move.
12. A trapped checker is freed when the trapper leaves.
13. Two or more of the trapper's checkers on the point: the trapped checker stays trapped until all have left.
14. Adding more of your own checkers to a trapping point is legal.
15. No counter-trapping.
16. Bearing off refused while any of your checkers is trapped.
17. Turn lost when every checker is trapped or blocked.
18. Trapping on the opponent's home points is legal.
19. Backgammon (3-point) detection with a checker in the winner's home quadrant, and with a trapped checker.

## 8. Not in the first phase

- Doubling cube and Crawford rule.
- Solo play against a bot.
- Option to ban trapping in the opponent's home (possible later).
- Time limit per turn.
- Third game.

## 9. Open questions

- [ ] **Turn time limit (later phase).** There is no time limit in the first phase. Because the game is online, a limit will be needed later: how long per turn, and what happens when it runs out or a player disconnects.

### 1.1 Equipment and Objective

**EN**
* **Equipment**: A backgammon board with 24 triangular points (hane), a pair of dice, and 30 checkers (15 per player, typically black and white).
* **Objective**: Move all your checkers into your home board (points 1‑6) and then bear them off. The first player to bear off all 15 checkers wins. A win where the opponent has not borne off any checkers is a **Gammon** (double points).  

**Turkish**: Tavla; 24 üçgen haneden (kapıdan) oluşan tahta, iki zar ve iki oyuncuya ait 30 pul. Amaç tüm pulları kendi iç sahasına (kalesine) getirip tahtadan toplamaktır. Rakip hiçbir pul toplamazsa **Mars** (iki puan) kazanılır.

## 1. Özet / 1. Summary (Türkçe)

**Türkçe:**

* **Ekipman ve Amaç**: 24 üçgen haneden (kapıdan) oluşan tavla tahtası, iki zar ve iki oyuncuya ait 30 pul. Amaç tüm pulları kendi iç sahasına (kalesine) getirip tahtadan toplamaktır. Rakibin hiç pulları toplaması durumu **Mars** (iki puan) olarak adlandırılır.

* **Oyunun Hedefi**: Her iki oyun (Backgammon ve Hapis) için ortak kurallar aşağıdaki tabloda özetlenmiştir.

| | Backgammon | Hapis |
|---|---|---|
| Oyuncu Sayısı | 2 | 2 |
| Pul Sayısı | Her biri 15 | Her biri 15 |
| Zar Sayısı | 2 | 2 |
| Başlangıç Düzeni | Klasik: 24‑hane 2 pul, 13‑hane 5 pul, 8‑hane 3 pul, 6‑hane 5 pul | Tüm 15 pul 24‑haneye yerleştirilir |
| Tek pul üzerine iniş | Vuruş: bar’a gönderilir | Tuzak: yerde sabit kalır |
| Bar ve yeniden giriş | Var | Yok |
| Çifte zar (doubles) | 4 kez oynanır | 4 kez oynanır |
| Puanlama | 1 / 2 (gammon) / 3 (backgammon) | 1 / 2 (gammon) / 3 (backgammon, bkz. 4.5) |
| Maç | İlk 5 puana ulaşan | İlk 5 puana ulaşan |
| Doubling cube | İlk fazda yok | İlk fazda yok |

---
