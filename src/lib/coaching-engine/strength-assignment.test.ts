import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { generateTrainingPlan } from '@/lib/plan-generator';
import { isPlanRecoveryWeek } from '@/lib/plan-progression';
import type { OnboardingProfile } from '@/types';
import { differenceInCalendarWeeks, parseISO } from 'date-fns';

import {
  applyConsecutiveLowerBodyGuard,
  strengthSlotIsUpper,
} from './strength-assignment';
import { resolveSlot } from './slot-resolve';

function profile(): OnboardingProfile {
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

describe('strength assignment', () => {
  it('assigns upper on even weeks and lower on odd weeks for the first strength slot', () => {
    const p = profile();
    const base = {
      phase: 'build' as const,
      isLongRun: false,
      forceRaceSim: false,
      strengthIndex: 0,
    };

    const even = resolveSlot('strength', p, { ...base, weekIndex: 0 });
    assert.equal(even.category, 'strength_upper');

    const odd = resolveSlot('strength', p, { ...base, weekIndex: 1 });
    assert.equal(odd.category, 'strength_lower');
  });

  it('alternates second strength slot within the week', () => {
    const p = profile();
    const ctx = {
      phase: 'build' as const,
      isLongRun: false,
      forceRaceSim: false,
      weekIndex: 0,
    };
    assert.equal(strengthSlotIsUpper({ ...ctx, strengthIndex: 0 }), true);
    assert.equal(strengthSlotIsUpper({ ...ctx, strengthIndex: 1 }), false);
    assert.equal(strengthSlotIsUpper({ ...ctx, weekIndex: 1, strengthIndex: 0 }), false);
    assert.equal(strengthSlotIsUpper({ ...ctx, weekIndex: 1, strengthIndex: 1 }), true);
  });

  it('keeps planned lower-body strength after a lower-dominant prior calendar day', () => {
    const p = profile();
    const prior = {
      sessionDate: '2026-06-05',
      plannedType: 'skills' as const,
      slotContext: {
        phase: 'build' as const,
        isLongRun: false,
        forceRaceSim: false,
        strengthIndex: 0,
        weekIndex: 1,
        targetWeakness: 'sleds' as const,
      },
    };
    const adjusted = applyConsecutiveLowerBodyGuard(
      'strength',
      p,
      {
        phase: 'build',
        isLongRun: false,
        forceRaceSim: false,
        strengthIndex: 0,
        weekIndex: 1,
      },
      '2026-06-06',
      prior
    );
    assert.equal(adjusted.forceUpperStrength, undefined);
    const resolved = resolveSlot('strength', p, adjusted);
    assert.equal(resolved.category, 'strength_lower');
  });

  it('does not steer when prior training day is not the previous calendar day', () => {
    const p = profile();
    const prior = {
      sessionDate: '2026-06-03',
      plannedType: 'hyrox' as const,
      slotContext: {
        phase: 'build' as const,
        isLongRun: false,
        forceRaceSim: false,
        strengthIndex: 0,
        weekIndex: 1,
        targetWeakness: 'sleds' as const,
      },
    };
    const adjusted = applyConsecutiveLowerBodyGuard(
      'strength',
      p,
      {
        phase: 'build',
        isLongRun: false,
        forceRaceSim: false,
        strengthIndex: 0,
        weekIndex: 1,
      },
      '2026-06-06',
      prior
    );
    assert.equal(adjusted.forceUpperStrength, undefined);
    assert.equal(resolveSlot('strength', p, adjusted).category, 'strength_lower');
  });

  it('generated 6-day plans include lower strength on odd weeks and upper on even weeks', () => {
    const p: OnboardingProfile = {
      ...profile(),
      daysPerWeek: 6,
      trainingDayIndices: [1, 2, 3, 4, 5, 6],
    };
    const plan = generateTrainingPlan(p);
    const planStart = parseISO(p.planStartDate!);
    const strengthSessions = plan.workouts.filter((w) => w.type === 'strength');

    const byWeek = new Map<number, { upper: number; lower: number }>();
    for (const session of strengthSessions) {
      const weekIndex = differenceInCalendarWeeks(parseISO(session.date), planStart, {
        weekStartsOn: 1,
      });
      const entry = byWeek.get(weekIndex) ?? { upper: 0, lower: 0 };
      const lower =
        /lower|squat|deadlift|carry|lunge|maintenance/i.test(session.title) &&
        !/upper/i.test(session.title);
      if (lower) entry.lower += 1;
      else entry.upper += 1;
      byWeek.set(weekIndex, entry);
    }

    for (const [weekIndex, counts] of byWeek) {
      if (weekIndex % 2 === 0) {
        assert.ok(counts.upper >= 1, `week ${weekIndex} should include upper strength`);
      } else if (!isPlanRecoveryWeek(weekIndex, p)) {
        assert.ok(counts.lower >= 1, `week ${weekIndex} should include lower strength`);
      }
    }
  });
});
