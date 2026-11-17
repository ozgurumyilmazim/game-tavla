/** The two sides of a game. */
export type Player = 'white' | 'black';

/**
 * Returns the other player.
 *
 * @example opponent('white') // 'black'
 */
export function opponent(player: Player): Player {
  return player === 'white' ? 'black' : 'white';
}
