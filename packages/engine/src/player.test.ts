import { describe, expect, it } from 'vitest';
import { opponent } from './player.js';

describe('opponent', () => {
  it('returns black for white', () => {
    expect(opponent('white')).toBe('black');
  });

  it('returns white for black', () => {
    expect(opponent('black')).toBe('white');
  });
});
