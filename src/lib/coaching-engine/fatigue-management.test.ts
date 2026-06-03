import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { generateTrainingPlan } from '@/lib/plan-generator';
import type { OnboardingProfile } from '@/types';

import {
  estimateSessionFatigue,
  fatigueScoreFromResolved,
  resolveFatigueSafeSessionForDate,
  rollingWindowFatigueTotal,
  shouldProtectFromConsecutiveLowerLoad,
} from './fatigue-management';
import { resolveSlot } from './slot-resolve';

function mockProfile(): OnboardingProfile {
  return {
    goal: 'hyrox_race',
    raceDate: '2026-09-01',
    fitnessLevel: 'intermediate',
    runningExperience: 'competitive',
    strengthExperience: 'none',
    daysPerWeek: 5,
    equipment: ['full_gym', 'rower', 'ski_erg', 'sled'],
    weaknesses: ['sleds', 'wall_balls', 'strength'],
    workoutLength: '60',
    planStartDate: '2026-06-02',
    trainingDayIndices: [1, 2, 3, 5, 6],
    hasRacedBefore: false,
    previousRaceTimeSeconds: null,
  };
}

describe('fatigue management', () => {
  it('assigns reference fatigue scores', () => {
    const profile = mockProfile();
    const lower = resolveSlot('strength', profile, {
      phase: 'build',
      isLongRun: false,
      forceRaceSim: false,
      strengthIndex: 1,
      weekIndex: 0,
    });
    const lowerCtx = {
      phase: 'build' as const,
      isLongRun: false,
      forceRaceSim: false,
      strengthIndex: 1,
      weekIndex: 0,
    };
    assert.equal(fatigueScoreFromResolved(lower, lowerCtx), 3);

    const upper = resolveSlot('strength', profile, {
      ...lowerCtx,
      strengthIndex: 0,
    });
    assert.equal(
      fatigueScoreFromResolved(upper, { ...lowerCtx, strengthIndex: 0 }),
      1
    );

    const longRunCtx = { ...lowerCtx, isLongRun: true };
    const longRun = resolveSlot('run', profile, longRunCtx);
    assert.equal(fatigueScoreFromResolved(longRun, longRunCtx), 2);

    const sledCtx = { ...lowerCtx, targetWeakness: 'sleds' as const };
    const sled = resolveSlot('hyrox', profile, sledCtx);
    assert.equal(fatigueScoreFromResolved(sled, sledCtx), 3);

    const recoveryCtx = {
      phase: 'base' as const,
      isLongRun: false,
      forceRaceSim: false,
      strengthIndex: 0,
      weekIndex: 0,
    };
    const recovery = resolveSlot('recovery', profile, recoveryCtx);
    assert.equal(fatigueScoreFromResolved(recovery, recoveryCtx), 0);
  });

  it('detects consecutive lower-load protection when both prior sessions are high load', () => {
    const history = [
      {
        date: '2026-06-02',
        score: 3,
        loadTags: ['heavy_lower' as const],
        workoutType: 'strength' as const,
      },
      {
        date: '2026-06-04',
        score: 3,
        loadTags: ['simulation' as const],
        workoutType: 'race_sim' as const,
      },
    ];
    assert.equal(shouldProtectFromConsecutiveLowerLoad(history), true);

    const mixed = [
      history[0]!,
      {
        date: '2026-06-03',
        score: 1,
        loadTags: [],
        workoutType: 'speed' as const,
      },
    ];
    assert.equal(shouldProtectFromConsecutiveLowerLoad(mixed), false);
  });

  it('swaps lower-dominant session after heavy prior two sessions', () => {
    const profile = mockProfile();
    const history = [
      {
        date: '2026-06-02',
        score: 3,
        loadTags: ['heavy_lower' as const],
        workoutType: 'strength' as const,
      },
      {
        date: '2026-06-04',
        score: 2,
        loadTags: ['long_run' as const],
        workoutType: 'run' as const,
      },
    ];
    const result = resolveFatigueSafeSessionForDate(
      'hyrox',
      profile,
      {
        phase: 'build',
        isLongRun: false,
        forceRaceSim: false,
        strengthIndex: 0,
        weekIndex: 0,
        targetWeakness: 'sleds',
      },
      history,
      '2026-06-06'
    );
    assert.equal(result.fatigueAdjusted, true);
    assert.ok(
      result.type === 'run' ||
        (result.type === 'strength' &&
          resolveSlot('strength', profile, result.slotContext).category ===
            'strength_upper')
    );
  });

  it('swaps high-fatigue session when rolling window would exceed max', () => {
    const profile = mockProfile();
    const history = [
      {
        date: '2026-06-02',
        score: 3,
        loadTags: ['heavy_lower' as const],
        workoutType: 'strength' as const,
      },
      {
        date: '2026-06-03',
        score: 3,
        loadTags: ['sled_session' as const],
        workoutType: 'hyrox' as const,
      },
    ];
    assert.equal(rollingWindowFatigueTotal(history, '2026-06-04'), 6);

    const result = resolveFatigueSafeSessionForDate(
      'hyrox',
      profile,
      {
        phase: 'build',
        isLongRun: false,
        forceRaceSim: false,
        strengthIndex: 0,
        weekIndex: 0,
        targetWeakness: 'sleds',
      },
      history,
      '2026-06-04'
    );

    assert.equal(result.fatigueAdjusted, true);
    assert.ok(result.fatigueScore <= 1);
    assert.ok(
      result.type === 'run' ||
        (result.type === 'strength' && result.fatigueScore === 1)
    );
  });

  it('generated plan includes fatigue-adjusted sessions after stacked load', () => {
    const plan = generateTrainingPlan(mockProfile());
    const adjusted = plan.workouts.filter(
      (w) =>
        w.coachNote.includes('Adjusted') ||
        w.coachNote.includes('legs needed a break') ||
        w.coachNote.includes('legs recover')
    );
    assert.ok(adjusted.length >= 1);
  });
});
