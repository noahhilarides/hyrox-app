import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { weekPhase } from '@/lib/recovery-prescription';

describe('weekPhase', () => {
  it('maps a 12-week intermediate plan with capped peak/taper', () => {
    // taper capped at 2 (here 1wk), peak capped at 4 (here 2wks); remaining
    // 9 weeks split 47/53 base/build for intermediate → base 1-4, build 5-9.
    const expected: Array<[number, ReturnType<typeof weekPhase>]> = [
      [0, 'base'],
      [1, 'base'],
      [2, 'base'],
      [3, 'base'],
      [4, 'build'],
      [5, 'build'],
      [6, 'build'],
      [7, 'build'],
      [8, 'build'],
      [9, 'peak'],
      [10, 'peak'],
      [11, 'taper'],
    ];

    for (const [weekIndex, phase] of expected) {
      assert.equal(weekPhase(weekIndex, 12, 'intermediate'), phase, `week ${weekIndex + 1}`);
    }
  });

  it('scales base/build split by fitness level (more base for beginners)', () => {
    // Week 4 (index 3): beginner still base, advanced already build.
    assert.equal(weekPhase(3, 12, 'beginner'), 'base');
    assert.equal(weekPhase(3, 12, 'advanced'), 'build');
  });

  it('caps peak and taper on long plans so extra weeks bank into base/build', () => {
    // 24-week plan: taper ≤ 2, peak ≤ 4; the rest are base/build.
    const phases = Array.from({ length: 24 }, (_, i) => weekPhase(i, 24, 'intermediate'));
    assert.ok(phases.filter((p) => p === 'taper').length <= 2);
    assert.ok(phases.filter((p) => p === 'peak').length <= 4);
    assert.equal(phases[0], 'base');
    assert.equal(phases[23], 'taper');
  });

  it('defaults to intermediate when no level is passed', () => {
    for (let i = 0; i < 12; i++) {
      assert.equal(weekPhase(i, 12), weekPhase(i, 12, 'intermediate'), `week ${i + 1}`);
    }
  });
});
