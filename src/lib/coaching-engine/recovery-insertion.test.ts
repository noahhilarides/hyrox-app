import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { generateTrainingPlan } from '@/lib/plan-generator';
import { PREFERRED_RECOVERY_TEMPLATE_IDS } from '@/lib/coaching-engine/recovery-insertion';
import type { OnboardingProfile } from '@/types';

import {
  ensureRecoverySlotInTemplate,
  isProactiveRecoveryWeek,
  shouldScheduleRecoveryWeek,
} from './recovery-insertion';
import { selectWorkoutTemplate } from './select-template';

function intermediateFiveDayProfile(): OnboardingProfile {
  return {
    goal: 'hyrox_race',
    raceDate: '2026-09-01',
    fitnessLevel: 'intermediate',
    runningExperience: 'regular',
    strengthExperience: 'regular',
    daysPerWeek: 5,
    equipment: ['full_gym', 'rower', 'running_only'],
    weaknesses: ['sleds'],
    workoutLength: '60',
    planStartDate: '2026-06-02',
    trainingDayIndices: [1, 2, 3, 5, 6],
    hasRacedBefore: false,
    previousRaceTimeSeconds: null,
  };
}

function advancedFiveDayProfile(): OnboardingProfile {
  return {
    ...intermediateFiveDayProfile(),
    fitnessLevel: 'advanced',
    runningExperience: 'competitive',
    strengthExperience: 'competitive',
  };
}

describe('proactive recovery insertion', () => {
  it('flags intermediate proactive weeks every 3rd week from week 3', () => {
    const profile = intermediateFiveDayProfile();
    assert.equal(isProactiveRecoveryWeek(0, profile), false);
    assert.equal(isProactiveRecoveryWeek(1, profile), false);
    assert.equal(isProactiveRecoveryWeek(2, profile), true);
    assert.equal(isProactiveRecoveryWeek(3, profile), false);
    assert.equal(isProactiveRecoveryWeek(4, profile), false);
    assert.equal(isProactiveRecoveryWeek(5, profile), true);
  });

  it('flags advanced proactive weeks every 4th week', () => {
    const profile = advancedFiveDayProfile();
    assert.equal(isProactiveRecoveryWeek(2, profile), false);
    assert.equal(isProactiveRecoveryWeek(3, profile), true);
    assert.equal(isProactiveRecoveryWeek(4, profile), false);
    assert.equal(isProactiveRecoveryWeek(7, profile), true);
  });

  it('injects a recovery slot into 6-day templates on proactive weeks (converted to skills in applyRecoveryToTemplate)', () => {
    const profile = {
      ...intermediateFiveDayProfile(),
      daysPerWeek: 6,
      trainingDayIndices: [1, 2, 3, 4, 5, 6],
    };
    const base = ['strength', 'run', 'speed', 'hyrox', 'skills', 'run'] as const;
    const week3 = ensureRecoverySlotInTemplate([...base], profile, 2, 12);
    assert.ok(week3.includes('recovery'));
    assert.equal(week3.filter((t) => t === 'recovery').length, 1);

    const week2 = ensureRecoverySlotInTemplate([...base], profile, 1, 12);
    assert.ok(!week2.includes('recovery'));
  });

  it('schedules recovery on proactive weeks for intermediate 5-day athletes', () => {
    const profile = intermediateFiveDayProfile();
    const proactiveWeeks: number[] = [];
    for (let w = 0; w < 12; w++) {
      if (shouldScheduleRecoveryWeek(profile, w, 12)) {
        proactiveWeeks.push(w + 1);
      }
    }
    assert.ok(proactiveWeeks.includes(3));
    assert.ok(proactiveWeeks.includes(6));
    assert.ok(proactiveWeeks.includes(9));
  });

  it('does not place recovery sessions in generated 12-week intermediate plans', () => {
    const profile = intermediateFiveDayProfile();
    const plan = generateTrainingPlan(profile);
    const recoverySessions = plan.workouts.filter((w) => w.type === 'recovery');
    assert.equal(recoverySessions.length, 0);
  });

  it('prefers RCV proactive templates when selecting recovery category', () => {
    const profile = intermediateFiveDayProfile();
    const template = selectWorkoutTemplate('recovery', undefined, profile, {
      weekIndex: 2,
      dayIndex: 0,
      phase: 'base',
      sessionDate: '2026-06-10',
      recentTemplateUsage: [],
    });
    assert.ok(PREFERRED_RECOVERY_TEMPLATE_IDS.includes(template.id));
  });
});
