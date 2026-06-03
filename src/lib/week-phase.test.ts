import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { weekPhase } from '@/lib/recovery-prescription';

describe('weekPhase', () => {
  it('maps a 12-week plan to base, build, peak, and taper blocks', () => {
    const expected: Array<[number, ReturnType<typeof weekPhase>]> = [
      [0, 'base'],
      [1, 'base'],
      [2, 'base'],
      [3, 'build'],
      [4, 'build'],
      [5, 'build'],
      [6, 'build'],
      [7, 'peak'],
      [8, 'peak'],
      [9, 'peak'],
      [10, 'taper'],
      [11, 'taper'],
    ];

    for (const [weekIndex, phase] of expected) {
      assert.equal(weekPhase(weekIndex, 12), phase, `week ${weekIndex + 1}`);
    }
  });
});
