import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { generateTrainingPlan } from '@/lib/plan-generator';
import { resolveSlot } from '@/lib/coaching-engine/slot-resolve';
import type { OnboardingProfile } from '@/types';

import {
  applyUpperBodyMinimum,
  daysSinceLastUpperBody,
  isUpperBodyResolvedSlot,
  UPPER_BODY_INTERVAL_DAYS,
} from './upper-body-minimum';

function racePrepProfile(): OnboardingProfile {
  return {
    goal: 'hyrox_race',
    raceDate: '2026-09-01',
    fitnessLevel: 'intermediate',
    runningExperience: 'regular',
    strengthExperience: 'regular',
    daysPerWeek: 5,
    equipment: ['full_gym', 'rower', 'ski_erg', 'sled'],
    weaknesses: ['sleds'],
    workoutLength: '60',
    planStartDate: '2026-06-02',
    trainingDayIndices: [1, 2, 3, 5, 6],
    hasRacedBefore: false,
    previousRaceTimeSeconds: null,
  };
}

describe('upper body minimum', () => {
  it('steers strength slot to upper after 7 days without upper work', () => {
    const profile = racePrepProfile();
    const result = applyUpperBodyMinimum(
      'strength',
      profile,
      {
        phase: 'build',
        isLongRun: false,
        forceRaceSim: false,
        strengthIndex: 1,
        weekIndex: 1,
      },
      '2026-06-12',
      '2026-06-02'
    );
    assert.equal(result.upperBodySteered, true);
    assert.equal(result.slotContext.strengthIndex, 1);
    const resolved = resolveSlot(result.type, profile, result.slotContext);
    assert.equal(resolved.category, 'strength_upper');
  });

  it('generated HYROX plan includes upper work at least every 10 days', () => {
    const plan = generateTrainingPlan(racePrepProfile());
    let lastUpper = '';
    let maxGap = 0;

    for (const w of plan.workouts) {
      const resolved = resolveSlot(w.type, racePrepProfile(), {
        phase: 'base',
        isLongRun: false,
        forceRaceSim: w.type === 'race_sim',
        strengthIndex: 0,
        weekIndex: 0,
      });
      const upper =
        resolved.category === 'strength_upper' ||
        isUpperBodyResolvedSlot(w.type, racePrepProfile(), {
          phase: 'base',
          isLongRun: false,
          forceRaceSim: false,
          strengthIndex: 1,
        });

      if (upper) {
        if (lastUpper) {
          const gap = daysSinceLastUpperBody(w.date, lastUpper);
          maxGap = Math.max(maxGap, gap);
        }
        lastUpper = w.date;
      }
    }

    assert.ok(maxGap <= UPPER_BODY_INTERVAL_DAYS, `max upper gap ${maxGap} days`);
  });
});
